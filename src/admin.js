// Yönetim paneli: /yonetim
// Giriş şifresi ADMIN_PASSWORD ortam değişkeninden okunur.

import crypto from 'node:crypto';
import config from '../site.config.js';
import { db } from './db.js';
import { h } from './layout.js';
import { formatWhen, typeLabel, localDay } from './booking.js';
import { topicLabel, bookingStatusChanged } from './mail.js';
import { ASSET_VERSION } from './layout.js';

const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_HOURS = 8;

const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('base64url');
const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function readSession(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)sid=([^;]+)/);
  if (!m) return null;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || !safeEq(sign(exp), sig) || Date.now() > Number(exp)) return null;
  return { id: m[1], csrf: sign('csrf:' + m[1]) };
}

export function newSessionCookie(secure) {
  const exp = String(Date.now() + SESSION_HOURS * 3600_000);
  return `sid=${exp}.${sign(exp)}; Path=/yonetim; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure ? '; Secure' : ''}`;
}
export const clearSessionCookie = 'sid=; Path=/yonetim; HttpOnly; SameSite=Strict; Max-Age=0';

export function checkPassword(pw) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEq(sign('pw:' + pw), sign('pw:' + expected));
}

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
      ? `<nav class="admin-nav"><a href="/yonetim">Randevular</a><a href="/yonetim/takvim">Kapalı günler</a><a href="/yonetim/mesajlar">Mesajlar${unreadBadge()}</a><a href="/" target="_blank" rel="noopener">Siteyi aç</a>
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
  const enabled = Boolean(process.env.ADMIN_PASSWORD);
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
