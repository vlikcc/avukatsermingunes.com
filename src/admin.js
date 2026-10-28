// Yönetim paneli: /yonetim
// İlk giriş şifresi ADMIN_PASSWORD ortam değişkeninden okunur. Şifre panelden
// değiştirildiğinde özeti (scrypt) veritabanına yazılır ve bundan sonra o geçerlidir.

import crypto from 'node:crypto';
import config from '../site.config.js';
import { db, getSetting, setSetting } from './db.js';
import { h } from './layout.js';
import { formatWhen, typeLabel, localDay } from './booking.js';
import { topicLabel, bookingStatusChanged } from './mail.js';
import { ASSET_VERSION } from './layout.js';
import { LANGS, langNames, paths } from './i18n.js';
import { allPosts, slugify, postUrl, isScheduled } from './blog.js';

const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_HOURS = 8;

const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('base64url');
const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/* ------------------------------ şifre ------------------------------ */

const storedHash = () => getSetting('admin_password');

function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  return `scrypt$${salt.toString('hex')}$${crypto.scryptSync(pw, salt, 32).toString('hex')}`;
}

export const passwordEnabled = () => Boolean(storedHash() || process.env.ADMIN_PASSWORD);

export function checkPassword(pw) {
  const stored = storedHash();
  if (stored) {
    const [, salt, hash] = stored.split('$');
    return crypto.timingSafeEqual(crypto.scryptSync(String(pw), Buffer.from(salt, 'hex'), 32), Buffer.from(hash, 'hex'));
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEq(sign('pw:' + pw), sign('pw:' + expected));
}

/** Şifreyi değiştirir. Hata varsa açıklamasını, başarılıysa null döner. */
export function changePassword(current, next, repeat) {
  if (!checkPassword(current)) return 'Mevcut şifre hatalı.';
  if (String(next).length < 10) return 'Yeni şifre en az 10 karakter olmalı.';
  if (next !== repeat) return 'Yeni şifreler birbiriyle aynı değil.';
  if (next === current) return 'Yeni şifre mevcut şifreden farklı olmalı.';
  setSetting('admin_password', hashPassword(next));
  return null;
}

/* ------------------------------ oturum ------------------------------ */

// Oturum imzasına şifrenin bir parmak izi katılır: şifre değişince eski oturumlar geçersiz olur.
const pwStamp = () => sign('stamp:' + (storedHash() || process.env.ADMIN_PASSWORD || '')).slice(0, 12);

export function readSession(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)sid=([^;]+)/);
  if (!m) return null;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || !safeEq(sign(exp + '|' + pwStamp()), sig) || Date.now() > Number(exp)) return null;
  return { id: m[1], csrf: sign('csrf:' + m[1]) };
}

export function newSessionCookie(secure) {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `sid=${exp}.${sign(exp + '|' + pwStamp())}; Path=/yonetim; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure ? '; Secure' : ''}`;
}
export const clearSessionCookie = 'sid=; Path=/yonetim; HttpOnly; SameSite=Strict; Max-Age=0';

const STATUS = {
  pending: 'Onay bekliyor',
  confirmed: 'Onaylandı',
  cancelled: 'İptal',
  done: 'Tamamlandı',
};

function shell(title, body, session) {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${h(title)} | Yönetim</title>
<link rel="icon" type="image/png" href="/img/favicon-64.png">
<link rel="stylesheet" href="/css/site.css?v=${ASSET_VERSION}">
</head><body class="admin">
<header class="admin-head"><div class="wrap admin-head-inner">
  <a class="brand" href="/yonetim"><img src="/img/logo-160.png" width="40" height="36" alt=""><span class="brand-name">Yönetim</span></a>
  ${
    session
      ? `<nav class="admin-nav"><a href="/yonetim">Randevular</a><a href="/yonetim/takvim">Kapalı günler</a><a href="/yonetim/mesajlar">Mesajlar${unreadBadge()}</a><a href="/yonetim/yazilar">Yazılar</a><a href="/yonetim/sifre">Şifre</a><a href="/" target="_blank" rel="noopener">Siteyi aç</a>
      <form method="post" action="/yonetim/cikis"><input type="hidden" name="csrf" value="${session.csrf}"><button class="link-btn" type="submit">Çıkış</button></form></nav>`
      : ''
  }
</div></header>
<main class="wrap admin-main">${body}</main>
<script src="/js/admin.js?v=${ASSET_VERSION}" defer></script></body></html>`;
}

function unreadBadge() {
  const n = db.prepare('SELECT COUNT(*) n FROM messages WHERE read = 0').get().n;
  return n ? ` <span class="badge">${n}</span>` : '';
}

export function loginPage(error) {
  const enabled = passwordEnabled();
  return shell(
    'Giriş',
    `<div class="admin-login">
      <h1>Yönetim girişi</h1>
      ${
        enabled
          ? `<form method="post" action="/yonetim/giris" class="form">
        ${error ? `<p class="form-error" role="alert">${h(error)}</p>` : ''}
        <div class="field"><label for="pw">Şifre</label><input id="pw" name="password" type="password" required autocomplete="current-password" autofocus></div>
        <button class="btn" type="submit">Giriş yap</button>
      </form>`
          : '<p class="form-warn">Yönetim paneli kapalı. Etkinleştirmek için <code>.env</code> dosyasında <code>ADMIN_PASSWORD</code> tanımlayın ve sunucuyu yeniden başlatın.</p>'
      }
    </div>`,
  );
}

export function dashboard(session, query) {
  const filter = ['upcoming', 'pending', 'past', 'all'].includes(query.get('f')) ? query.get('f') : 'upcoming';
  const now = new Date().toISOString();
  const where = {
    upcoming: `WHERE start_utc >= '${now}' AND status IN ('pending','confirmed') ORDER BY start_utc ASC`,
    pending: `WHERE status = 'pending' ORDER BY start_utc ASC`,
    past: `WHERE start_utc < '${now}' ORDER BY start_utc DESC`,
    all: `ORDER BY start_utc DESC`,
  }[filter];
  const rows = db.prepare(`SELECT * FROM appointments ${where} LIMIT 300`).all();
  const counts = db
    .prepare(`SELECT status, COUNT(*) n FROM appointments WHERE start_utc >= ? GROUP BY status`)
    .all(now)
    .reduce((o, r) => ({ ...o, [r.status]: r.n }), {});

  const tabs = [
    ['upcoming', 'Yaklaşan'],
    ['pending', 'Onay bekleyen'],
    ['past', 'Geçmiş'],
    ['all', 'Tümü'],
  ]
    .map(([k, label]) => `<a href="/yonetim?f=${k}"${k === filter ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');

  const tz2 = config.booking.secondaryTimezone;
  const list = rows.length
    ? rows
        .map((a) => {
          const trTime = new Date(a.start_utc).toLocaleTimeString('tr-TR', { timeZone: tz2, hour: '2-digit', minute: '2-digit' });
          const actions = [];
          if (a.status === 'pending') actions.push(['confirmed', 'Onayla', 'btn btn-small']);
          if (a.status === 'pending' || a.status === 'confirmed') actions.push(['cancelled', 'İptal et', 'btn btn-small btn-outline']);
          if (a.status === 'confirmed' && a.start_utc < now) actions.push(['done', 'Tamamlandı', 'btn btn-small btn-outline']);
          return `<article class="appt appt-${a.status}">
          <div class="appt-main">
            <p class="appt-when">${h(formatWhen(a.start_utc, 'tr'))} <span class="muted">(TR ${trTime})</span></p>
            <p class="appt-who"><strong>${h(a.name)}</strong> · <a href="mailto:${h(a.email)}">${h(a.email)}</a> · <a href="tel:${h(a.phone)}">${h(a.phone)}</a></p>
            <p class="appt-meta">${h(typeLabel(a.type, 'tr'))} · ${h(topicLabel(a.topic, 'tr'))} · Görüşme dili: ${a.language === 'de' ? 'Almanca' : 'Türkçe'} · Ref. ${h(a.ref)}</p>
            ${a.note ? `<p class="appt-note">${h(a.note)}</p>` : ''}
          </div>
          <div class="appt-side">
            <p class="status status-${a.status}">${STATUS[a.status]}</p>
            <form method="post" action="/yonetim/randevu/${a.id}" class="appt-form">
              <input type="hidden" name="csrf" value="${session.csrf}">
              ${
                actions.length
                  ? `<label class="sr-only" for="n${a.id}">Müvekkile not</label>
              <input id="n${a.id}" name="admin_note" placeholder="Müvekkile iletilecek not (isteğe bağlı)" value="${h(a.admin_note || '')}" maxlength="500">
              <div class="appt-actions">${actions.map(([s, l, c]) => `<button class="${c}" name="status" value="${s}">${l}</button>`).join('')}</div>`
                  : ''
              }
              <button class="link-btn danger" name="status" value="delete" data-confirm="Bu kayıt kalıcı olarak silinsin mi?">Kaydı sil</button>
            </form>
          </div>
        </article>`;
        })
        .join('')
    : '<p class="empty">Bu görünümde randevu bulunmuyor.</p>';

  return shell(
    'Randevular',
    `<div class="admin-title"><h1>Randevular</h1>
      <p class="muted">Onay bekleyen: ${counts.pending || 0} · Onaylı: ${counts.confirmed || 0} · Saatler ${h(config.booking.timezone)} saat dilimine göredir.</p></div>
    ${query.has('yayinlandi') ? '<p class="form-ok" role="status">Yazı ve çevirileri yayına alındı.</p>' : ''}
    <nav class="admin-tabs">${tabs}</nav>
    <div class="appt-list">${list}</div>`,
    session,
  );
}

export function updateAppointment(id, status, note) {
  const a = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  if (!a) return;
  if (status === 'delete') {
    db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
    return;
  }
  if (!STATUS[status]) return;
  db.prepare(`UPDATE appointments SET status = ?, admin_note = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`).run(
    status,
    note || null,
    id,
  );
  if (status !== a.status) bookingStatusChanged({ ...a, admin_note: note || null }, status);
}

export function blockedPage(session) {
  const today = localDay(Date.now());
  const rows = db.prepare('SELECT * FROM blocked_days WHERE day >= ? ORDER BY day').all(today);
  return shell(
    'Kapalı günler',
    `<div class="admin-title"><h1>Kapalı günler</h1>
      <p class="muted">Tatil, duruşma veya seyahat günlerini randevuya kapatın. Haftalık çalışma saatleri <code>site.config.js</code> dosyasından ayarlanır.</p></div>
    <form method="post" action="/yonetim/takvim" class="form form-inline">
      <input type="hidden" name="csrf" value="${session.csrf}">
      <div class="field"><label for="from">Başlangıç</label><input id="from" name="from" type="date" min="${today}" required></div>
      <div class="field"><label for="to">Bitiş (isteğe bağlı)</label><input id="to" name="to" type="date" min="${today}"></div>
      <div class="field"><label for="reason">Not</label><input id="reason" name="reason" maxlength="120" placeholder="ör. Duruşma — İzmir"></div>
      <button class="btn" type="submit" name="action" value="add">Kapat</button>
    </form>
    ${
      rows.length
        ? `<ul class="blocked-list">${rows
            .map(
              (r) => `<li><span>${h(new Date(r.day + 'T12:00:00Z').toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }))}</span>
              <span class="muted">${h(r.reason || '')}</span>
              <form method="post" action="/yonetim/takvim"><input type="hidden" name="csrf" value="${session.csrf}"><input type="hidden" name="day" value="${r.day}">
              <button class="link-btn" name="action" value="remove">Aç</button></form></li>`,
            )
            .join('')}</ul>`
        : '<p class="empty">Kapalı gün yok.</p>'
    }`,
    session,
  );
}

export function updateBlocked(form) {
  if (form.get('action') === 'remove') {
    db.prepare('DELETE FROM blocked_days WHERE day = ?').run(form.get('day'));
    return;
  }
  const from = form.get('from');
  const to = form.get('to') || from;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || to < from) return;
  const ins = db.prepare('INSERT OR REPLACE INTO blocked_days (day, reason) VALUES (?, ?)');
  const reason = (form.get('reason') || '').slice(0, 120);
  for (let d = new Date(from + 'T12:00:00Z'), i = 0; d.toISOString().slice(0, 10) <= to && i < 370; d.setUTCDate(d.getUTCDate() + 1), i++) {
    ins.run(d.toISOString().slice(0, 10), reason);
  }
}

export function messagesPage(session) {
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 300').all();
  db.prepare('UPDATE messages SET read = 1 WHERE read = 0').run();
  return shell(
    'Mesajlar',
    `<div class="admin-title"><h1>Mesajlar</h1><p class="muted">İletişim formundan gelen mesajlar. ${config.privacy.retentionDays} gün sonra otomatik silinir.</p></div>
    ${
      rows.length
        ? rows
            .map(
              (m) => `<article class="appt${m.read ? '' : ' appt-pending'}">
          <div class="appt-main">
            <p class="appt-when">${h(new Date(m.created_at).toLocaleString('tr-TR', { timeZone: config.booking.timezone, dateStyle: 'medium', timeStyle: 'short' }))} · ${h(topicLabel(m.subject, 'tr'))}${m.read ? '' : ' <span class="badge">yeni</span>'}</p>
            <p class="appt-who"><strong>${h(m.name)}</strong> · <a href="mailto:${h(m.email)}">${h(m.email)}</a>${m.phone ? ` · <a href="tel:${h(m.phone)}">${h(m.phone)}</a>` : ''} · ${m.site_lang.toUpperCase()}</p>
            <p class="appt-note">${h(m.message).replace(/\n/g, '<br>')}</p>
          </div>
          <div class="appt-side"><form method="post" action="/yonetim/mesaj/${m.id}"><input type="hidden" name="csrf" value="${session.csrf}">
            <button class="link-btn danger" data-confirm="Mesaj kalıcı olarak silinsin mi?">Sil</button></form></div>
        </article>`,
            )
            .join('')
        : '<p class="empty">Mesaj yok.</p>'
    }`,
    session,
  );
}

/* ------------------------------ şifre sayfası ------------------------------ */

export function passwordPage(session, { error, ok } = {}) {
  return shell(
    'Şifre',
    `<div class="admin-title"><h1>Şifre değiştir</h1>
      <p class="muted">Yeni şifre en az 10 karakter olmalı. Şifre değişince diğer cihazlardaki oturumlar kapanır.</p></div>
    <form method="post" action="/yonetim/sifre" class="form admin-narrow">
      <input type="hidden" name="csrf" value="${session.csrf}">
      ${error ? `<p class="form-error" role="alert">${h(error)}</p>` : ''}
      ${ok ? '<p class="form-ok" role="status">Şifreniz değiştirildi.</p>' : ''}
      <div class="field"><label for="pw-current">Mevcut şifre</label><input id="pw-current" name="current" type="password" required autocomplete="current-password"></div>
      <div class="field"><label for="pw-new">Yeni şifre</label><input id="pw-new" name="next" type="password" required minlength="10" autocomplete="new-password"></div>
      <div class="field"><label for="pw-repeat">Yeni şifre (tekrar)</label><input id="pw-repeat" name="repeat" type="password" required minlength="10" autocomplete="new-password"></div>
      <button class="btn" type="submit">Şifreyi değiştir</button>
    </form>`,
    session,
  );
}

/* ------------------------------ yazılar ------------------------------ */

const POST_STATUS = { draft: 'Taslak', published: 'Yayında' };
const fmtDay = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const publicUrl = postUrl;
const CATEGORY_LABEL = { blog: 'Makale', mevzuat: 'Mevzuat' };
// Yayın zamanı Türkiye saatiyle gösterilir.
const trTime = (iso) => (iso ? new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' }) : '');
const siblings = (p, list) => (p.pair ? list.filter((x) => x.pair === p.pair && x.id !== p.id) : []);

export function postsPage(session, query) {
  const all = allPosts();
  const filter = LANGS.includes(query.get('dil')) ? query.get('dil') : query.get('durum') === 'taslak' ? 'taslak' : 'all';
  const rows = filter === 'all' ? all : filter === 'taslak' ? all.filter((p) => p.status === 'draft') : all.filter((p) => p.lang === filter);
  const count = (l) => all.filter((p) => p.lang === l).length;
  const drafts = all.filter((p) => p.status === 'draft').length;
  const tabs = [['all', `Tümü (${all.length})`], ['taslak', `Onay bekleyen (${drafts})`], ...LANGS.map((l) => [l, `${langNames[l]} (${count(l)})`])]
    .map(([k, label]) => `<a href="/yonetim/yazilar${k === 'all' ? '' : k === 'taslak' ? '?durum=taslak' : `?dil=${k}`}"${k === filter ? ' aria-current="page"' : ''}>${h(label)}</a>`)
    .join('');

  const list = rows.length
    ? rows
        .map((p) => {
          const tr = siblings(p, all);
          return `<article class="appt post-row post-${p.status}">
          <div class="appt-main">
            <p class="appt-when"><a href="/yonetim/yazilar/${p.id}">${h(p.title)}</a></p>
            <p class="appt-meta"><span class="lang-tag">${p.lang.toUpperCase()}</span> <span class="lang-tag">${CATEGORY_LABEL[p.category] || 'Makale'}</span> ${h(fmtDay(p.date))}${
              p.publish_at ? ` ${trTime(p.publish_at)}` : ''
            } · <span class="status status-${p.status}">${isScheduled(p) ? 'Zamanlandı' : POST_STATUS[p.status]}</span>${
              tr.length ? ` · Çevirileri: ${tr.map((x) => `<a href="/yonetim/yazilar/${x.id}">${x.lang.toUpperCase()}</a>`).join(', ')}` : ''
            }</p>
            ${p.description ? `<p>${h(p.description)}</p>` : ''}
          </div>
          <div class="appt-side post-row-actions">
            ${
              p.status === 'draft'
                ? `<form method="post" action="/yonetim/yazilar/${p.id}/yayinla"><input type="hidden" name="csrf" value="${session.csrf}">
              <button class="btn btn-small" data-confirm="“${h(p.title)}”${tr.length ? ' ve çevirileri' : ''} yayına alınsın mı?${p.publish_at ? ` Yayın zamanı: ${h(fmtDay(p.date))} ${trTime(p.publish_at)} (Türkiye saati).` : ''}">${tr.length ? 'Tüm dilleriyle yayınla' : 'Yayınla'}</button></form>`
                : ''
            }
            <a class="btn btn-small${p.status === 'draft' ? ' btn-outline' : ''}" href="/yonetim/yazilar/${p.id}">Düzenle</a>
            ${
              p.status === 'published'
                ? `<a class="btn btn-small btn-outline" href="${publicUrl(p)}" target="_blank" rel="noopener">Sitede gör</a>`
                : `<a class="btn btn-small btn-outline" href="/yonetim/yazilar/${p.id}/onizleme" target="_blank" rel="noopener">Önizle</a>`
            }
            <form method="post" action="/yonetim/yazilar/${p.id}/sil"><input type="hidden" name="csrf" value="${session.csrf}">
              <button class="link-btn danger" data-confirm="“${h(p.title)}” kalıcı olarak silinsin mi?">Sil</button></form>
          </div>
        </article>`;
        })
        .join('')
    : '<p class="empty">Bu görünümde yazı bulunmuyor.</p>';

  return shell(
    'Yazılar',
    `<div class="admin-title admin-title-row"><div><h1>Yazılar</h1>
      <p class="muted">Sitedeki “Hukuki Yayınlar” (makaleler ve mevzuat) bölümünde görünen yazılar. Taslaklar sitede görünmez; yayın saati gelmemiş yazılar o saatte kendiliğinden görünür.</p></div>
      <a class="btn" href="/yonetim/yazilar/yeni">Yeni yazı</a></div>
    <nav class="admin-tabs">${tabs}</nav>
    <div class="appt-list">${list}</div>`,
    session,
  );
}

/**
 * Yazı düzenleme formu.
 * @param {object|null} post   Kayıtlı yazı (yeni yazıda null)
 * @param {object} [o]
 * @param {object} [o.values]  Hatalı gönderimde formun değerleri
 * @param {object} [o.errors]
 * @param {boolean} [o.saved]
 */
export function postEditor(session, post, { values, errors = {}, saved } = {}) {
  const all = allPosts();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: config.booking.timezone });
  const v = values || (post && { ...post, publishTime: trTime(post.publish_at) }) || { lang: 'tr', category: 'blog', title: '', slug: '', description: '', body: '', date: today, status: 'draft' };
  const linked = values ? Number(values.translationOf) || null : post ? siblings(post, all)[0]?.id ?? null : null;
  const others = all.filter((p) => !post || p.id !== post.id);
  const err = (k) => (errors[k] ? `<p class="form-error" id="e-${k}">${h(errors[k])}</p>` : '');
  const inv = (k) => (errors[k] ? ` aria-invalid="true" aria-describedby="e-${k}"` : '');
  const action = post ? `/yonetim/yazilar/${post.id}` : '/yonetim/yazilar/yeni';

  return shell(
    post ? 'Yazıyı düzenle' : 'Yeni yazı',
    `<p class="admin-back"><a href="/yonetim/yazilar">← Yazılar</a></p>
    <div class="admin-title"><h1>${post ? 'Yazıyı düzenle' : 'Yeni yazı'}</h1></div>
    ${saved ? '<p class="form-ok" role="status">Kaydedildi.</p>' : ''}
    ${Object.keys(errors).length ? '<p class="form-error" role="alert">Yazı kaydedilmedi. Lütfen işaretli alanları düzeltin.</p>' : ''}
    <form method="post" action="${action}" class="form post-editor">
      <input type="hidden" name="csrf" value="${session.csrf}">
      <div class="post-editor-main">
        <div class="field"><label for="p-title">Başlık</label>
          <input id="p-title" name="title" value="${h(v.title)}" required maxlength="200"${inv('title')}>${err('title')}</div>
        <div class="field"><label for="p-body">Metin</label>
          <textarea id="p-body" name="body" rows="26" required${inv('body')}>${h(v.body)}</textarea>${err('body')}
          <details class="md-help"><summary>Biçimlendirme yardımı</summary>
            <ul>
              <li>Paragraflar arasında bir boş satır bırakın.</li>
              <li><code>## Ara başlık</code>, <code>### Küçük ara başlık</code></li>
              <li><code>**kalın**</code>, <code>*italik*</code></li>
              <li>Madde işaretli liste: satır başında <code>- </code>; numaralı liste: <code>1. </code></li>
              <li>Bağlantı: <code>[görünen metin](https://adres.com)</code></li>
              <li>Alıntı: satır başında <code>&gt; </code></li>
            </ul>
          </details>
        </div>
      </div>
      <aside class="post-editor-side">
        <fieldset class="field">
          <legend>Durum</legend>
          <label class="choice-inline"><input type="radio" name="status" value="draft"${v.status !== 'published' ? ' checked' : ''}> Taslak</label>
          <label class="choice-inline"><input type="radio" name="status" value="published"${v.status === 'published' ? ' checked' : ''}> Yayında</label>
        </fieldset>
        <div class="field"><label for="p-lang">Dil</label>
          <select id="p-lang" name="lang">${LANGS.map((l) => `<option value="${l}"${v.lang === l ? ' selected' : ''}>${h(langNames[l])}</option>`).join('')}</select></div>
        <div class="field"><label for="p-cat">Bölüm</label>
          <select id="p-cat" name="category">${Object.entries(CATEGORY_LABEL).map(([k, label]) => `<option value="${k}"${(v.category || 'blog') === k ? ' selected' : ''}>${label}</option>`).join('')}</select></div>
        <div class="field"><label for="p-date">Yayım tarihi</label>
          <input id="p-date" name="date" type="date" value="${h(v.date)}" required></div>
        <div class="field"><label for="p-time">Yayın saati (Türkiye saati)</label>
          <input id="p-time" name="publishTime" type="time" value="${h(v.publishTime || '')}">
          <p class="hint">Doluysa yazı “Yayında” olsa bile bu tarih ve saatten önce sitede görünmez. Boşsa hemen görünür.</p></div>
        <div class="field"><label for="p-slug">Adres</label>
          <input id="p-slug" name="slug" value="${h(v.slug)}" maxlength="80" placeholder="${h(slugify(v.title) || 'baslik-kendiliginden')}"${inv('slug')}>${err('slug')}
          <p class="hint">Boş bırakılırsa başlıktan üretilir. Yayındaki bir yazının adresini değiştirmek eski bağlantıları bozar.${
            post ? `<br><code>${h(publicUrl(post))}</code>` : ''
          }</p></div>
        <div class="field"><label for="p-desc">Kısa açıklama</label>
          <textarea id="p-desc" name="description" rows="3" maxlength="300">${h(v.description)}</textarea>
          <p class="hint">Yazı listesinde ve arama motoru sonuçlarında görünür (en fazla 300 karakter).</p></div>
        <div class="field"><label for="p-pair">Çevirisi olduğu yazı</label>
          <select id="p-pair" name="translationOf"><option value="">Yok</option>${others
            .map((p) => `<option value="${p.id}"${linked === p.id ? ' selected' : ''}>[${p.lang.toUpperCase()}] ${h(p.title)}</option>`)
            .join('')}</select>
          <p class="hint">Aynı yazının başka dildeki hâlini seçerseniz, sitedeki dil seçici iki yazıyı birbirine bağlar.</p></div>
        <button class="btn" type="submit">Kaydet</button>
        ${
          post
            ? `<p class="post-editor-links"><a href="/yonetim/yazilar/${post.id}/onizleme" target="_blank" rel="noopener">Önizle</a>${
                post.status === 'published' ? ` · <a href="${publicUrl(post)}" target="_blank" rel="noopener">Sitede gör</a>` : ''
              }</p>`
            : ''
        }
      </aside>
    </form>
    ${
      post
        ? `<form method="post" action="/yonetim/yazilar/${post.id}/sil" class="post-delete"><input type="hidden" name="csrf" value="${session.csrf}">
        <button class="link-btn danger" data-confirm="Bu yazı kalıcı olarak silinsin mi?">Yazıyı sil</button></form>`
        : ''
    }`,
    session,
  );
}

