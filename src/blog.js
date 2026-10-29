// Hukuki yayınlar (blog): yazılar veritabanında tutulur ve yönetim panelinden
// yazılır, düzenlenir, silinir. Metinler Markdown biçimindedir.
//
// content/posts/{tr,de,en,nl}/*.md dosyaları sunucu her açıldığında taranır;
// daha önce aktarılmamış her dosya bir kez veritabanına eklenir (yayın rutininin
// ürettiği yazılar bu yolla gelir). Panelden silinen yazı geri gelmez. Dosya biçimi:
//
// ---
// title: Başlık
// description: Arama motorları için kısa açıklama
// date: 2026-10-01
// slug: url-adi
// pair: ortak-anahtar      (diğer dildeki karşılığıyla aynı değer)
// category: mevzuat        (isteğe bağlı; blog | mevzuat, varsayılan blog)
// publish_at: 2026-10-01T08:00:00+03:00  (isteğe bağlı; bu andan önce sitede görünmez)
// draft: true              (isteğe bağlı; taslaklar panelden onaylanana kadar yayımlanmaz)
// ---

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { h } from './layout.js';
import { LANGS, paths } from './i18n.js';
import { db, getSetting, setSetting } from './db.js';

const ROOT = path.resolve(import.meta.dirname, '../content/posts');

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { ...meta, draft: meta.draft === 'true', body: m[2] };
}

export const CATEGORIES = ['blog', 'mevzuat'];

// "2026-10-01T08:00:00+03:00" -> UTC ISO; geçersizse null.
const toUtc = (v) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString() : null;
};

// Markdown dosyalarındaki yeni yazıları veritabanına aktarır ve aktarılan yazıları döndürür.
// Her dosya yalnızca bir kez aktarılır; panelden silinen bir yazı yeniden gelmez.
// Daha önce aktarılmış bir dosya değiştiyse, yazı hâlâ onay bekliyor ve panelden
// düzenlenmemişse veritabanındaki taslak dosyadaki metinle güncellenir.
// Yayındaki bir yazı yalnızca avukatın onayıyla, LIVE_REFRESH listesindeki çeviri
// grupları için ve bir kez güncellenir.
const LIVE_REFRESH = {
  // 29 Ekim yazıları, düzenlenmiş metin siteye ulaşmadan onaylandı; avukat yeni metni 29.10.2026’da onayladı.
  'refresh_2026_10_29': ['2026-10-29-mohuk-50', '2026-10-29-mirasin-reddi'],
};

function importFiles() {
  const ins = db.prepare(
    `INSERT OR IGNORE INTO posts (lang, slug, title, description, body, date, pair, status, category, publish_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const seen = db.prepare('SELECT 1 FROM imported_files WHERE path = ?');
  const bySlug = db.prepare('SELECT * FROM posts WHERE lang = ? AND slug = ?');
  const refresh = db.prepare(
    `UPDATE posts SET title = ?, description = ?, body = ?, date = ?, pair = ?, category = ?, publish_at = ? WHERE id = ?`,
  );
  const touch = db.prepare(`UPDATE posts SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`);
  const pending = Object.keys(LIVE_REFRESH).filter((k) => !getSetting(k));
  const livePairs = pending.flatMap((k) => LIVE_REFRESH[k]);
  const mark = db.prepare('INSERT OR IGNORE INTO imported_files (path, imported_at) VALUES (?, ?)');
  // Önceki sürüm dosyaları ilk açılışta topluca aktarıyordu; o dosyalar yalnızca işaretlenir.
  const legacy = Boolean(getSetting('posts_imported')) && !getSetting('import_tracking');
  const added = [];
  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
      const rel = `${lang}/${f}`;
      if (seen.get(rel)) {
        if (!legacy) refreshDraft(lang, parse(path.join(dir, f)));
        continue;
      }
      const p = legacy ? null : parse(path.join(dir, f));
      if (p?.slug && p.title) {
        const category = CATEGORIES.includes(p.category) ? p.category : 'blog';
        const r = ins.run(lang, p.slug, p.title, p.description || '', p.body.trim(), p.date || today(), p.pair || null, p.draft ? 'draft' : 'published', category, toUtc(p.publish_at));
        if (r.changes) added.push(getPost(Number(r.lastInsertRowid)));
      }
      mark.run(rel, new Date().toISOString());
    }
  }
  setSetting('import_tracking', '1');
  for (const k of pending) setSetting(k, new Date().toISOString());
  return added;

  function refreshDraft(lang, p) {
    const cur = p?.slug && p.title && bySlug.get(lang, p.slug);
    const live = cur?.status === 'published' && livePairs.includes(cur.pair);
    if (!cur || (cur.status !== 'draft' && !live) || Date.parse(cur.updated_at) - Date.parse(cur.created_at) > 60_000) return;
    const next = [p.title, p.description || '', p.body.trim(), p.date || cur.date, p.pair || null, CATEGORIES.includes(p.category) ? p.category : 'blog', toUtc(p.publish_at)];
    const prev = [cur.title, cur.description, cur.body, cur.date, cur.pair, cur.category, cur.publish_at];
    if (next.some((v, i) => v !== prev[i])) {
      refresh.run(...next, cur.id);
      // Yayındaki metin değiştiği için son düzenleme tarihi (dateModified) güncellenir.
      if (live) touch.run(cur.id);
      console.log(`[yazılar] ${live ? 'Yayındaki yazı' : 'Taslak'} dosyadan güncellendi: ${lang}/${p.slug}`);
    }
  }
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });

// Yayında olan ve yayın zamanı gelmiş yazılar sitede görünür.
const LIVE = "status = 'published' AND (publish_at IS NULL OR publish_at <= ?)";
const now = () => new Date().toISOString();

/** Sitedeki adresi: /yayinlar/… veya /yayinlar/mevzuat/… */
export const postUrl = (p) => `${(p.category === 'mevzuat' ? paths.mevzuat : paths.blog)[p.lang]}/${p.slug}`;

/** Bir dildeki görünür yazılar, yeniden eskiye. category verilirse yalnızca o bölüm. */
export const posts = (lang, category) =>
  category
    ? db.prepare(`SELECT * FROM posts WHERE lang = ? AND category = ? AND ${LIVE} ORDER BY date DESC, id DESC`).all(lang, category, now())
    : db.prepare(`SELECT * FROM posts WHERE lang = ? AND ${LIVE} ORDER BY date DESC, id DESC`).all(lang, now());

export const findPost = (lang, slug, category = 'blog') =>
  db.prepare(`SELECT * FROM posts WHERE lang = ? AND slug = ? AND category = ? AND ${LIVE}`).get(lang, slug, category, now());

export const pairOf = (post, lang) =>
  post?.pair ? db.prepare(`SELECT * FROM posts WHERE lang = ? AND pair = ? AND ${LIVE}`).get(lang, post.pair, now()) : undefined;

/**
 * Yazının yayım ve son düzenleme zamanı (ISO). updated_at yalnızca metin panelden
 * düzenlendiğinde değişir; aktarılıp hiç düzenlenmeyen yazıda yayım zamanı kullanılır.
 */
export function postDates(p) {
  const published = p.publish_at || `${p.date}T08:00:00+03:00`;
  const edited = p.updated_at && Date.parse(p.updated_at) - Date.parse(p.created_at) > 60_000;
  const modified = edited && Date.parse(p.updated_at) > Date.parse(published) ? p.updated_at : published;
  return { published, modified };
}

/** Yayında işaretli ama yayın zamanı henüz gelmemiş mi? */
export const isScheduled = (p) => p.status === 'published' && Boolean(p.publish_at) && p.publish_at > now();

/* ----------------------------- yönetim ----------------------------- */

export const allPosts = () => db.prepare('SELECT * FROM posts ORDER BY date DESC, id DESC').all();
export const getPost = (id) => db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

/** Sunucu açılırken content/posts altından aktarılan yeni yazılar. */
export const imported = importFiles();

/** Yazıyı ve aynı ortak anahtara bağlı tüm çevirilerini yayına alır. */
export function publishGroup(id) {
  const p = getPost(id);
  if (!p) return 0;
  const r = p.pair
    ? db.prepare(`UPDATE posts SET status = 'published' WHERE pair = ?`).run(p.pair)
    : db.prepare(`UPDATE posts SET status = 'published' WHERE id = ?`).run(id);
  return Number(r.changes);
}

// Başlıktan adres üretir: "Türkiye’de Boşanma" -> "turkiyede-bosanma"
export function slugify(text) {
  return String(text)
    .replace(/ß/g, 'ss')
    .replace(/[ıİ]/g, 'i')
    .replace(/[’'`]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

const slugTaken = (lang, slug, id) => Boolean(db.prepare('SELECT 1 FROM posts WHERE lang = ? AND slug = ? AND id IS NOT ?').get(lang, slug, id ?? null));

/**
 * Yazıyı kaydeder. id verilmezse yeni yazı oluşturur.
 * @returns {{ id?: number, errors?: Record<string,string>, values: object }}
 */
export function savePost(id, input) {
  const v = {
    lang: LANGS.includes(input.lang) ? input.lang : 'tr',
    title: String(input.title || '').trim().slice(0, 200),
    slug: slugify(input.slug || input.title || ''),
    description: String(input.description || '').trim().replace(/\s+/g, ' ').slice(0, 300),
    body: String(input.body || '').replace(/\r\n/g, '\n').trim(),
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : today(),
    status: input.status === 'published' ? 'published' : 'draft',
    category: CATEGORIES.includes(input.category) ? input.category : 'blog',
    publishTime: /^\d{2}:\d{2}$/.test(input.publishTime || '') ? input.publishTime : '',
    translationOf: Number(input.translationOf) || null,
  };
  const errors = {};
  if (v.title.length < 3) errors.title = 'Başlık en az 3 karakter olmalı.';
  if (!v.slug) errors.slug = 'Geçerli bir adres girin (harf, rakam ve tire).';
  else if (slugTaken(v.lang, v.slug, id)) errors.slug = 'Bu dilde aynı adresli başka bir yazı var.';
  if (v.body.length < 20) errors.body = 'Metin en az 20 karakter olmalı.';
  if (Object.keys(errors).length) return { errors, values: v };

  // Çeviri bağlantısı: seçilen yazının ortak anahtarı kullanılır, yoksa yeni anahtar üretilir.
  let pair = id ? getPost(id)?.pair ?? null : null;
  if (v.translationOf) {
    const other = getPost(v.translationOf);
    if (other && other.id !== id) {
      pair = other.pair || crypto.randomBytes(6).toString('hex');
      if (!other.pair) db.prepare('UPDATE posts SET pair = ? WHERE id = ?').run(pair, other.id);
    }
  } else if (input.translationOf === '') {
    pair = null;
  }

  // Yayın saati Türkiye saatiyle girilir (Türkiye 2016'dan beri yıl boyu UTC+3).
  const row = { ...v, pair, publish_at: v.publishTime ? toUtc(`${v.date}T${v.publishTime}:00+03:00`) : null };
  delete row.translationOf;
  delete row.publishTime;
  if (id) {
    db.prepare(
      `UPDATE posts SET lang = :lang, slug = :slug, title = :title, description = :description, body = :body, date = :date,
       pair = :pair, status = :status, category = :category, publish_at = :publish_at,
       updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = :id`,
    ).run({ ...row, id });
    return { id, values: v };
  }
  const r = db
    .prepare(
      `INSERT INTO posts (lang, slug, title, description, body, date, pair, status, category, publish_at)
       VALUES (:lang, :slug, :title, :description, :body, :date, :pair, :status, :category, :publish_at)`,
    )
    .run(row);
  return { id: Number(r.lastInsertRowid), values: v };
}

export const deletePost = (id) => db.prepare('DELETE FROM posts WHERE id = ?').run(id);

// Satır içi biçimlendirme: **kalın**, *italik*, [bağlantı](url)
function inline(text) {
  return h(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
      const safe = /^(https?:\/\/|\/|#|mailto:)/.test(url) ? url : '#';
      const ext = /^https?:\/\//.test(safe) ? ' rel="noopener" target="_blank"' : '';
      return `<a href="${safe}"${ext}>${label}</a>`;
    });
}

// Ara başlıklara bağlantı verilebilsin diye kimlik: "## Madde metni" -> id="madde-metni"
const headingId = (text) => slugify(text.replace(/[*_[\]()]/g, '')) || 'bolum';

/** Metindeki ## ara başlıklar (içindekiler listesi için). */
export const headings = (src) =>
  [...src.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: headingId(m[1]), text: m[1].replace(/\*\*?|\[|\]\([^)]*\)/g, '') }));

// Yalın bir Markdown dönüştürücü: başlıklar, paragraflar, listeler, alıntılar.
export function markdown(src) {
  const out = [];
  const blocks = src.trim().split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n');
    const hm = block.match(/^(#{2,4})\s+(.+)$/);
    if (hm && lines.length === 1) {
      const lvl = hm[1].length;
      out.push(`<h${lvl} id="${headingId(hm[2])}">${inline(hm[2])}</h${lvl}>`);
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`);
    } else if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`);
    } else if (lines.every((l) => l.startsWith('>'))) {
      // Alıntı içindeki yalnız ">" satırları paragrafları ayırır (ör. kanun maddesinin fıkraları).
      const paras = lines.map((l) => l.replace(/^>\s?/, '')).join('\n').split(/\n\s*\n/);
      out.push(`<blockquote>${paras.map((x) => `<p>${inline(x.replace(/\n/g, ' '))}</p>`).join('')}</blockquote>`);
    } else {
      out.push(`<p>${inline(lines.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

export const readingMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));
