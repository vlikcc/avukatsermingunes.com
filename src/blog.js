// Hukuki yayınlar: content/posts/{tr,de}/*.md dosyalarından okunur.
// Dosya başında basit bir ön bilgi bloğu bulunur:
//
// ---
// title: Başlık
// description: Arama motorları için kısa açıklama
// date: 2026-10-01
// slug: url-adi
// pair: ortak-anahtar      (diğer dildeki karşılığıyla aynı değer)
// draft: true              (isteğe bağlı; taslaklar yayımlanmaz)
// ---

import fs from 'node:fs';
import path from 'node:path';
import { h } from './layout.js';

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

let cache = null;
let cacheAt = 0;

export function posts(lang) {
  // Yeni yazılar sunucu yeniden başlatılmadan görünsün diye kısa süreli önbellek.
  if (!cache || Date.now() - cacheAt > 30_000) {
    cache = {};
    for (const l of ['tr', 'de']) {
      const dir = path.join(ROOT, l);
      cache[l] = fs.existsSync(dir)
        ? fs
            .readdirSync(dir)
            .filter((f) => f.endsWith('.md'))
            .map((f) => parse(path.join(dir, f)))
            .filter((p) => p && !p.draft && p.slug && p.title)
            .sort((a, b) => (a.date < b.date ? 1 : -1))
        : [];
    }
    cacheAt = Date.now();
  }
  return cache[lang];
}

export const findPost = (lang, slug) => posts(lang).find((p) => p.slug === slug);
export const pairOf = (post, lang) => post?.pair && posts(lang).find((p) => p.pair === post.pair);

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
