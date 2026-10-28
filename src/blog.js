// Hukuki yayınlar (blog): yazılar veritabanında tutulur ve yönetim panelinden
// yazılır, düzenlenir, silinir. Metinler Markdown biçimindedir.
//
// content/posts/{tr,de,en,nl}/*.md dosyaları yalnızca ilk çalıştırmada bir kez
// veritabanına aktarılır; sonrasında yazılar panelden yönetilir. Dosya biçimi:
//
// ---
// title: Başlık
// description: Arama motorları için kısa açıklama
// date: 2026-10-01
// slug: url-adi
// pair: ortak-anahtar      (diğer dildeki karşılığıyla aynı değer)
// draft: true              (isteğe bağlı; taslaklar yayımlanmaz)
// ---

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { h } from './layout.js';
import { LANGS } from './i18n.js';
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

// Markdown dosyalarındaki yazıları bir kez veritabanına aktarır. Panelden silinen
// bir yazı, sunucu yeniden başladığında geri gelmesin diye işlem işaretlenir.
function importFiles() {
  if (getSetting('posts_imported')) return;
  const ins = db.prepare(
    `INSERT OR IGNORE INTO posts (lang, slug, title, description, body, date, pair, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const p = parse(path.join(dir, f));
      if (!p?.slug || !p.title) continue;
      ins.run(lang, p.slug, p.title, p.description || '', p.body.trim(), p.date || today(), p.pair || null, p.draft ? 'draft' : 'published');
    }
  }
  setSetting('posts_imported', new Date().toISOString());
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });

importFiles();

/** Bir dildeki yayımlanmış yazılar, yeniden eskiye. */
export const posts = (lang) =>
  db.prepare("SELECT * FROM posts WHERE lang = ? AND status = 'published' ORDER BY date DESC, id DESC").all(lang);

export const findPost = (lang, slug) =>
  db.prepare("SELECT * FROM posts WHERE lang = ? AND slug = ? AND status = 'published'").get(lang, slug);

export const pairOf = (post, lang) =>
  post?.pair ? db.prepare("SELECT * FROM posts WHERE lang = ? AND pair = ? AND status = 'published'").get(lang, post.pair) : undefined;

/* ----------------------------- yönetim ----------------------------- */

export const allPosts = () => db.prepare('SELECT * FROM posts ORDER BY date DESC, id DESC').all();
export const getPost = (id) => db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

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

  const row = { ...v, pair };
  delete row.translationOf;
  if (id) {
    db.prepare(
      `UPDATE posts SET lang = :lang, slug = :slug, title = :title, description = :description, body = :body, date = :date,
       pair = :pair, status = :status, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = :id`,
    ).run({ ...row, id });
    return { id, values: v };
  }
  const r = db
    .prepare(
      `INSERT INTO posts (lang, slug, title, description, body, date, pair, status)
       VALUES (:lang, :slug, :title, :description, :body, :date, :pair, :status)`,
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

// Yalın bir Markdown dönüştürücü: başlıklar, paragraflar, listeler, alıntılar.
export function markdown(src) {
  const out = [];
  const blocks = src.trim().split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n');
    const hm = block.match(/^(#{2,4})\s+(.+)$/);
    if (hm && lines.length === 1) {
      const lvl = hm[1].length;
      out.push(`<h${lvl}>${inline(hm[2])}</h${lvl}>`);
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`);
    } else if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`);
    } else if (lines.every((l) => l.startsWith('>'))) {
      out.push(`<blockquote><p>${inline(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))}</p></blockquote>`);
    } else {
      out.push(`<p>${inline(lines.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

export const readingMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));
