// Sitemap'teki sabit sayfaların son düzenleme tarihlerini git geçmişinden üretir
// ve src/lastmod.json dosyasına yazar. Sayfa metinleri değiştiğinde commit'ten önce
// çalıştırın: npm run lastmod
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

// Sayfa grubu -> içeriğini belirleyen dosyalar
const groups = {
  home: ['src/pages.js', 'src/i18n.js', 'src/content/areas.js'],
  about: ['src/pages.js', 'src/i18n.js'],
  areas: ['src/pages.js', 'src/content/areas.js'],
  crossborder: ['src/pages.js', 'src/content/crossborder.js'],
  contact: ['src/pages.js', 'site.config.js'],
  booking: ['src/pages.js', 'site.config.js'],
  legal: ['src/legal.js', 'site.config.js'],
};

// Henüz commit edilmemiş değişiklik varsa bugünün tarihi kullanılır.
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });
const changed = new Set(git('diff', 'HEAD', '--name-only').split('\n').filter(Boolean));

const out = {};
for (const [key, files] of Object.entries(groups)) {
  out[key] = files.some((f) => changed.has(f)) ? today : git('log', '-1', '--format=%cs', '--', ...files) || today;
}
fs.writeFileSync(path.join(ROOT, 'src/lastmod.json'), JSON.stringify(out, null, 2) + '\n');
console.log(out);
