import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

try {
  process.loadEnvFile(path.resolve(import.meta.dirname, '.env'));
} catch {
  // .env yoksa ortam değişkenleri kullanılır.
}

const config = (await import('./site.config.js')).default;
const { paths, LANGS, langOf } = await import('./src/i18n.js');
const pages = await import('./src/pages.js');
const { areas, findArea } = await import('./src/content/areas.js');
const { findPost, posts, pairOf, postUrl, postDates, getPost, savePost, deletePost, publishGroup, imported } = await import('./src/blog.js');
const { KANUNLAR, maddeList, maddeUrl, kanunUrl, maddeFromPath, findMadde } = await import('./src/kanunlar.js');
const { db, purgeOld } = await import('./src/db.js');
const booking = await import('./src/booking.js');
const mail = await import('./src/mail.js');
const admin = await import('./src/admin.js');
const { absUrl } = await import('./src/layout.js');
const lastmod = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, 'src/lastmod.json'), 'utf8'));

const PORT = Number(process.env.PORT || 3000);
const PUBLIC = path.resolve(import.meta.dirname, 'public');
const IS_PROD = process.env.NODE_ENV === 'production';

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const SECURITY_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  ...(IS_PROD ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {}),
};

/* --------------------------- yardımcılar --------------------------- */

function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, ...SECURITY_HEADERS, ...extra });
  res.end(body);
}
const json = (res, status, data) => send(res, status, JSON.stringify(data), 'application/json; charset=utf-8', { 'Cache-Control': 'no-store' });
const redirect = (res, to, extra = {}) => {
  res.writeHead(303, { Location: to, ...SECURITY_HEADERS, ...extra });
  res.end();
};

function readBody(req, limit = 20_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error('too large'), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const clientIp = (req) =>
  (process.env.TRUST_PROXY === 'true' && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) ||
  req.socket.remoteAddress;

// Basit, bellek içi istek sınırlayıcı.
const hits = new Map();
function rateLimited(req, bucket, max, windowMs) {
  const key = bucket + ':' + clientIp(req);
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, arr] of hits) if (arr.every((t) => now - t > 3600_000)) hits.delete(k);
}, 600_000).unref();

// JSON API çağrıları yalnızca aynı kaynaktan kabul edilir.
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const validTopics = () => [...areas.map((a) => a.key), 'crossborder', 'other'];

function serveStatic(req, res, pathname) {
  const file = path.normalize(path.join(PUBLIC, decodeURIComponent(pathname)));
  if (!file.startsWith(PUBLIC + path.sep)) return false;
  if (path.basename(file) === 'logo-original.png') return false;
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return false;
  }
  if (!stat.isFile()) return false;
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const versioned = /[?&]v=/.test(req.url) || pathname.startsWith('/fonts/');
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
    ...SECURITY_HEADERS,
  });
  if (req.method === 'HEAD') return res.end(), true;
  fs.createReadStream(file).pipe(res);
  return true;
}

function sitemap() {
  const urls = [];
  const modified = (p) => postDates(p).modified.slice(0, 10);
  // Liste sayfaları, o dildeki en yeni yazının tarihini alır.
  const newest = (lang, category) => posts(lang, category).map(modified).sort().at(-1);
  // alt: { tr, de, en, nl } — aynı sayfanın her dildeki yolu; date: dil -> son düzenleme tarihi
  const add = (alt, date) => {
    const links = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absUrl(alt[l])}"/>`).join('\n');
    for (const l of LANGS) {
      const d = typeof date === 'function' ? date(l) : date;
      urls.push(`<url><loc>${absUrl(alt[l])}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}\n${links}</url>`);
    }
  };
  for (const k of ['home', 'about', 'areas', 'crossborder', 'contact', 'booking']) add(paths[k], lastmod[k]);
  for (const k of ['imprint', 'privacy', 'cookies']) add(paths[k], lastmod.legal);
  add(paths.blog, (l) => [newest(l, 'blog'), newest(l, 'mevzuat')].filter(Boolean).sort().at(-1) || lastmod.home);
  add(paths.makaleler, (l) => newest(l, 'blog') || lastmod.home);
  add(paths.mevzuat, (l) => newest(l, 'mevzuat') || lastmod.home);
  for (const a of areas) add(Object.fromEntries(LANGS.map((l) => [l, `${paths.areas[l]}/${a.slug[l]}`])), lastmod.areas);
  // Kanun maddeleri yalnızca Türkçe
  for (const K of Object.values(KANUNLAR)) {
    if (!maddeList(K.key).length) continue;
    urls.push(`<url><loc>${absUrl(kanunUrl(K.key))}</loc><lastmod>${K.guncel}</lastmod></url>`);
    for (const m of maddeList(K.key)) urls.push(`<url><loc>${absUrl(maddeUrl(m))}</loc><lastmod>${K.guncel}</lastmod></url>`);
  }
  for (const lang of LANGS) {
    for (const p of posts(lang)) {
      // Çevirileri olan yazılar için dil karşılıkları da bildirilir.
      const twins = LANGS.map((l) => [l, l === lang ? p : pairOf(p, l)]).filter(([, x]) => x);
      const links = twins.length > 1 ? twins.map(([l, x]) => `\n<xhtml:link rel="alternate" hreflang="${l}" href="${absUrl(postUrl(x))}"/>`).join('') : '';
      urls.push(`<url><loc>${absUrl(postUrl(p))}</loc><lastmod>${modified(p)}</lastmod>${links}</url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

// Yapay zekâ araçları için kısa site özeti (https://llmstxt.org).
function llmsTxt() {
  const L = config.lawyer;
  const c = config.contact;
  const link = (title, p) => `- [${title}](${absUrl(p)})`;
  return `# Avukat ${L.name}

> Türk hukuku avukatı (İzmir Barosu, ${L.barTr.licenseDate.slice(0, 4)}'den beri). § 206 BRAO kapsamında Rechtsanwaltskammer Düsseldorf üyesi; Almanya'da "${L.titleDe}" unvanını kullanır. Almanya'da yalnızca Türk hukuku ve uluslararası hukuk alanında danışmanlık verir; Alman hukukunda danışmanlık ve temsil yapmaz. Görüşmeler Türkçe yapılır.

- Büro: ${L.office}, İzmir (kuruluş ${L.officeFounded})
- Düsseldorf adresi: ${c.addressDe.street}, ${c.addressDe.city}, ${c.addressDe.country}${c.addressTr ? `\n- İzmir adresi: ${c.addressTr.street}, ${c.addressTr.city}` : ''}${c.email ? `\n- E-posta: ${c.email}` : ''}${c.phoneDe ? `\n- Telefon (DE): ${c.phoneDe}` : ''}${c.phoneTr ? `\n- Telefon (TR): ${c.phoneTr}` : ''}
- Site dilleri: Türkçe (ana dil), Almanca, İngilizce, Hollandaca

## Çalışma alanları

${areas.map((a) => link(a.title.tr, `${paths.areas.tr}/${a.slug.tr}`) + `: ${a.summary.tr}`).join('\n')}

## Sayfalar

${link('Hakkımda', paths.about.tr)}
${link('Türkiye–Almanya hukuki işlemler', paths.crossborder.tr)}
${link('Hukuki yayınlar', paths.blog.tr)}
${link('Makaleler', paths.makaleler.tr)}
${link('Mevzuat açıklamaları', paths.mevzuat.tr)}
${Object.values(KANUNLAR)
  .filter((K) => maddeList(K.key).length)
  .map((K) => link(`${K.ad} (${K.kisa}) madde madde: güncel metin, gerekçe ve açıklama`, kanunUrl(K.key)))
  .join('\n')}
${link('Randevu', paths.booking.tr)}
${link('İletişim', paths.contact.tr)}
${link('Yasal bilgiler', paths.imprint.tr)}

## Diğer diller

${link('Deutsch', paths.home.de)}
${link('English', paths.home.en)}
${link('Nederlands', paths.home.nl)}
`;
}

/* ------------------------------ sayfalar ------------------------------ */

// Sabit yollar: yol -> [dil, oluşturucu]
const routes = new Map();
for (const lang of LANGS) {
  routes.set(paths.home[lang], () => pages.home(lang));
  routes.set(paths.about[lang], () => pages.about(lang));
  routes.set(paths.areas[lang], () => pages.areasPage(lang));
  routes.set(paths.crossborder[lang], () => pages.crossborderPage(lang));
  routes.set(paths.blog[lang], () => pages.blogHub(lang));
  routes.set(paths.makaleler[lang], (q) => pages.blogPage(lang, 'blog', q));
  routes.set(paths.mevzuat[lang], (q) => pages.blogPage(lang, 'mevzuat', q));
  routes.set(paths.contact[lang], () => pages.contactPage(lang));
  routes.set(paths.booking[lang], () => pages.bookingPage(lang));
  routes.set(paths.imprint[lang], () => pages.legalPage('imprint', lang));
  routes.set(paths.privacy[lang], () => pages.legalPage('privacy', lang));
  routes.set(paths.cookies[lang], () => pages.legalPage('cookies', lang));
}

function dynamicPage(pathname) {
  const madde = maddeFromPath(pathname);
  if (madde) return pages.maddePage(madde);
  for (const lang of LANGS) {
    const area = pathname.startsWith(paths.areas[lang] + '/') && findArea(lang, pathname.slice(paths.areas[lang].length + 1));
    if (area) return pages.areaPage(lang, area);
    const law = pathname.startsWith(paths.mevzuat[lang] + '/') && findPost(lang, pathname.slice(paths.mevzuat[lang].length + 1), 'mevzuat');
    if (law) return pages.postPage(lang, law);
    const post = pathname.startsWith(paths.blog[lang] + '/') && findPost(lang, pathname.slice(paths.blog[lang].length + 1));
    if (post) return pages.postPage(lang, post);
  }
  return null;
}

/* -------------------------------- API -------------------------------- */

// Yazı bulucu. Soru gövdede gelir (adres satırına ve erişim kayıtlarına düşmesin) ve saklanmaz.
// JavaScript ile çağrılınca cevap balonu JSON içinde döner; JavaScript kapalıysa yayınlar sayfası cevapla birlikte gösterilir.
async function apiFinder(req, res) {
  if (!sameOrigin(req)) return json(res, 403, { error: 'origin' });
  const wantsJson = String(req.headers.accept || '').includes('application/json');
  if (rateLimited(req, 'finder', 60, 600_000)) return wantsJson ? json(res, 429, { error: 'rate' }) : send(res, 429, 'Too Many Requests', 'text/plain; charset=utf-8');
  let f;
  try {
    f = new URLSearchParams(await readBody(req, 4_000));
  } catch {
    return json(res, 400, { error: 'invalid' });
  }
  const lang = LANGS.includes(f.get('dil')) ? f.get('dil') : 'tr';
  const question = clean(f.get('soru'), 500);
  if (!question) return wantsJson ? json(res, 400, { error: 'empty' }) : redirect(res, paths.blog[lang]);
  if (wantsJson) return json(res, 200, { html: pages.finderReply(lang, question) });
  return send(res, 200, pages.blogHub(lang, { question }), undefined, { 'Cache-Control': 'no-store' });
}

async function apiAppointments(req, res) {
  if (!sameOrigin(req)) return json(res, 403, { error: 'origin' });
  if (rateLimited(req, 'book', 5, 3600_000)) return json(res, 429, { error: 'rate' });
  let b;
  try {
    b = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { error: 'invalid' });
  }
  if (b.website) return json(res, 200, { ok: true, ref: 'R-000000' }); // bal küpü

  const input = {
    lang: LANGS.includes(b.lang) ? b.lang : 'tr',
    type: clean(b.type, 40),
    topic: clean(b.topic, 40),
    start: clean(b.start, 40),
    name: clean(b.name, 120),
    email: clean(b.email, 160).toLowerCase(),
    phone: clean(b.phone, 40),
    language: 'tr', // Görüşmeler yalnızca Türkçe yapılır.
    note: clean(b.note, 1500),
  };
  const errors = [];
  if (!booking.typeIds().includes(input.type)) errors.push('type');
  if (!validTopics().includes(input.topic)) errors.push('topic');
  if (input.name.length < 2) errors.push('name');
  if (!EMAIL_RE.test(input.email)) errors.push('email');
  if (input.phone.replace(/\D/g, '').length < 6) errors.push('phone');
  if (b.consent !== true) errors.push('consent');
  if (Number.isNaN(Date.parse(input.start))) errors.push('start');
  if (errors.length) return json(res, 422, { error: 'validation', fields: errors });

  input.start = new Date(Date.parse(input.start)).toISOString();
  if (!booking.isAvailable(input.start)) return json(res, 409, { error: 'taken' });
  const row = booking.createAppointment(input);
  if (!row) return json(res, 409, { error: 'taken' });
  mail.bookingReceived(row);
  return json(res, 201, { ok: true, ref: row.ref, token: row.token, start: row.start_utc });
}

async function apiContact(req, res) {
  if (!sameOrigin(req)) return json(res, 403, { error: 'origin' });
  if (rateLimited(req, 'contact', 5, 3600_000)) return json(res, 429, { error: 'rate' });
  let b;
  try {
    b = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { error: 'invalid' });
  }
  if (b.website) return json(res, 200, { ok: true });
  const m = {
    lang: LANGS.includes(b.lang) ? b.lang : 'tr',
    name: clean(b.name, 120),
    email: clean(b.email, 160).toLowerCase(),
    phone: clean(b.phone, 40),
    subject: clean(b.subject, 40),
    message: clean(b.message, 3000),
  };
  const errors = [];
  if (m.name.length < 2) errors.push('name');
  if (!EMAIL_RE.test(m.email)) errors.push('email');
  if (!validTopics().includes(m.subject)) errors.push('subject');
  if (m.message.length < 10) errors.push('message');
  if (b.consent !== true) errors.push('consent');
  if (errors.length) return json(res, 422, { error: 'validation', fields: errors });
  db.prepare('INSERT INTO messages (name, email, phone, subject, message, site_lang) VALUES (?, ?, ?, ?, ?, ?)').run(
    m.name,
    m.email,
    m.phone || null,
    m.subject,
    m.message,
    m.lang,
  );
  mail.contactReceived(m);
  return json(res, 201, { ok: true });
}

/* ------------------------------- yönetim ------------------------------- */

async function handleAdmin(req, res, url) {
  const p = url.pathname.replace(/\/$/, '') || '/yonetim';
  const session = admin.readSession(req);
  const noStore = { 'Cache-Control': 'no-store' };

  if (p === '/yonetim/giris' && req.method === 'POST') {
    if (rateLimited(req, 'login', 8, 900_000)) return send(res, 429, admin.loginPage('Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin.'), undefined, noStore);
    const form = new URLSearchParams(await readBody(req, 2000));
    if (admin.checkPassword(form.get('password') || '')) {
      return redirect(res, '/yonetim', { 'Set-Cookie': admin.newSessionCookie(IS_PROD) });
    }
    return send(res, 401, admin.loginPage('Şifre hatalı.'), undefined, noStore);
  }
  if (!session) return send(res, 200, admin.loginPage(), undefined, noStore);

  const postMatch = p.match(/^\/yonetim\/yazilar\/(yeni|\d+)(\/sil|\/onizleme|\/yayinla)?$/);
  const postId = postMatch && postMatch[1] !== 'yeni' ? Number(postMatch[1]) : null;
  const post = postId ? getPost(postId) : null;
  if ((postId || postMatch?.[2]) && !post) return send(res, 404, 'Yazı bulunamadı', 'text/plain; charset=utf-8');

  if (req.method === 'POST') {
    // Blog yazıları uzun olabileceği için daha geniş bir sınır.
    const form = new URLSearchParams(await readBody(req, postMatch ? 300_000 : 5000));
    if (form.get('csrf') !== session.csrf) return send(res, 403, 'Geçersiz istek', 'text/plain; charset=utf-8');
    if (p === '/yonetim/cikis') return redirect(res, '/yonetim', { 'Set-Cookie': admin.clearSessionCookie });
    if (p === '/yonetim/sifre') {
      if (rateLimited(req, 'login', 8, 900_000)) return send(res, 429, admin.passwordPage(session, { error: 'Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin.' }), undefined, noStore);
      const error = admin.changePassword(form.get('current') || '', form.get('next') || '', form.get('repeat') || '');
      if (error) return send(res, 422, admin.passwordPage(session, { error }), undefined, noStore);
      // Eski oturumlar geçersiz olduğu için bu cihaza yeni oturum verilir.
      return redirect(res, '/yonetim/sifre?degisti=1', { 'Set-Cookie': admin.newSessionCookie(IS_PROD) });
    }
    if (postMatch?.[2] === '/yayinla') {
      publishGroup(postId);
      return redirect(res, '/yonetim/yazilar?yayinlandi=1');
    }
    if (postMatch?.[2] === '/sil') {
      deletePost(postId);
      return redirect(res, '/yonetim/yazilar');
    }
    if (postMatch && !postMatch[2]) {
      const r = savePost(postId, Object.fromEntries(form));
      if (r.errors) return send(res, 422, admin.postEditor(session, post, r), undefined, noStore);
      return redirect(res, `/yonetim/yazilar/${r.id}?kaydedildi=1`);
    }
    const ap = p.match(/^\/yonetim\/randevu\/(\d+)$/);
    if (ap) {
      admin.updateAppointment(Number(ap[1]), form.get('status'), clean(form.get('admin_note'), 500));
      return redirect(res, req.headers.referer?.includes('/yonetim') ? new URL(req.headers.referer).pathname + new URL(req.headers.referer).search : '/yonetim');
    }
    if (p === '/yonetim/takvim') {
      admin.updateBlocked(form);
      return redirect(res, '/yonetim/takvim');
    }
    const mp = p.match(/^\/yonetim\/mesaj\/(\d+)$/);
    if (mp) {
      db.prepare('DELETE FROM messages WHERE id = ?').run(Number(mp[1]));
      return redirect(res, '/yonetim/mesajlar');
    }
    return send(res, 404, 'Bulunamadı', 'text/plain; charset=utf-8');
  }

  if (p === '/yonetim') return send(res, 200, admin.dashboard(session, url.searchParams), undefined, noStore);
  if (p === '/yonetim/takvim') return send(res, 200, admin.blockedPage(session), undefined, noStore);
  if (p === '/yonetim/mesajlar') return send(res, 200, admin.messagesPage(session), undefined, noStore);
  if (p === '/yonetim/sifre') return send(res, 200, admin.passwordPage(session, { ok: url.searchParams.has('degisti') }), undefined, noStore);
  if (p === '/yonetim/yazilar') return send(res, 200, admin.postsPage(session, url.searchParams), undefined, noStore);
  if (postMatch?.[2] === '/onizleme') return send(res, 200, pages.postPage(post.lang, post, { preview: true }), undefined, noStore);
  if (postMatch && !postMatch[2]) return send(res, 200, admin.postEditor(session, post, { saved: url.searchParams.has('kaydedildi') }), undefined, noStore);
  return redirect(res, '/yonetim');
}

/* ------------------------------- sunucu ------------------------------- */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let pathname = url.pathname;

  // www.alanadi.com -> alanadi.com (yol ve sorgu korunur), tek adreste toplanması için kalıcı yönlendirme.
  const host = String(req.headers.host || '').toLowerCase();
  if (config.siteUrl && host.startsWith('www.') && host.slice(4) === new URL(config.siteUrl).host) {
    res.writeHead(301, { Location: config.siteUrl + req.url, 'Cache-Control': 'public, max-age=86400', ...SECURITY_HEADERS });
    return res.end();
  }

  if (pathname === '/yonetim' || pathname.startsWith('/yonetim/')) return handleAdmin(req, res, url);

  if (pathname === '/api/availability' && req.method === 'GET') {
    if (rateLimited(req, 'avail', 120, 600_000)) return json(res, 429, { error: 'rate' });
    return json(res, 200, { timezone: config.booking.timezone, days: booking.availability() });
  }
  if (pathname === '/api/appointments' && req.method === 'POST') return apiAppointments(req, res);
  if (pathname === '/api/contact' && req.method === 'POST') return apiContact(req, res);
  if (pathname === '/api/yazi-bul' && req.method === 'POST') return apiFinder(req, res);

  // Müvekkilin randevu iptali
  for (const lang of LANGS) {
    const base = paths.cancel[lang] + '/';
    if (pathname.startsWith(base)) {
      const token = pathname.slice(base.length);
      if (!/^[a-f0-9]{48}$/.test(token)) return send(res, 404, pages.cancelPage(lang, null));
      const appt = db.prepare('SELECT * FROM appointments WHERE token = ?').get(token);
      if (req.method === 'POST' && appt && ['pending', 'confirmed'].includes(appt.status) && new Date(appt.start_utc) > new Date()) {
        db.prepare(`UPDATE appointments SET status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`).run(appt.id);
        mail.bookingCancelledByClient(appt);
        return send(res, 200, pages.cancelPage(lang, { ...appt, status: 'cancelled' }, 'done', token), undefined, { 'Cache-Control': 'no-store' });
      }
      return send(res, appt ? 200 : 404, pages.cancelPage(lang, appt, null, token), undefined, { 'Cache-Control': 'no-store' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed', 'text/plain; charset=utf-8');

  if (pathname === '/robots.txt') {
    return send(res, 200, `User-agent: *\nDisallow: /yonetim\nDisallow: /api/\n${config.siteUrl ? `Sitemap: ${config.siteUrl}/sitemap.xml\n` : ''}`, MIME['.txt']);
  }
  if (pathname === '/sitemap.xml') return send(res, 200, sitemap(), MIME['.xml']);
  if (pathname === '/llms.txt') return send(res, 200, llmsTxt(), MIME['.txt'], { 'Cache-Control': 'public, max-age=3600' });
  if (pathname === '/favicon.ico') return redirect(res, '/img/favicon-64.png');

  if (/\.[a-z0-9]+$/i.test(pathname) && serveStatic(req, res, pathname)) return;

  // Dil ana sayfaları sonda / ile sunulur: /de/, /en/, /nl/
  const langHomes = LANGS.map((l) => paths.home[l]);
  if (langHomes.includes(pathname + '/')) return redirect(res, pathname + '/');
  if (pathname.length > 1 && pathname.endsWith('/') && !langHomes.includes(pathname)) pathname = pathname.slice(0, -1);

  // Kanun dizinleri: /yayinlar/mevzuat/tmk ve "Maddeye git" formu (?madde=166)
  for (const K of Object.values(KANUNLAR)) {
    if (pathname !== kanunUrl(K.key) || !maddeList(K.key).length) continue;
    const no = (url.searchParams.get('madde') || '').trim();
    if (no) {
      const m = findMadde(K.key, no.replace(/^0+/, ''));
      return redirect(res, m ? maddeUrl(m) : kanunUrl(K.key));
    }
    return send(res, 200, pages.kanunPage(K.key), undefined, { 'Cache-Control': 'no-cache', 'Content-Language': 'tr' });
  }

  const render = routes.get(pathname);
  const html = render ? render(url.searchParams) : dynamicPage(pathname);
  if (html) return send(res, 200, html, undefined, { 'Cache-Control': 'no-cache', 'Content-Language': langOf(pathname) });
  return send(res, 404, pages.notFound(langOf(pathname)));
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) send(res, err.status || 500, err.status === 413 ? 'Payload Too Large' : 'Sunucu hatası', 'text/plain; charset=utf-8');
  });
});

// Saklama süresi dolan kayıtları günde bir kez temizle.
const purge = () => {
  const r = purgeOld(config.privacy.retentionDays);
  if (r.appointments || r.messages) console.log(`[temizlik] ${r.appointments} randevu, ${r.messages} mesaj silindi.`);
};
purge();
setInterval(purge, 86400_000).unref();

// Yayın rutininin depoya eklediği yeni yazılar bu açılışta aktarıldıysa haber ver.
if (imported.length) {
  console.log(`[yazılar] ${imported.length} yeni yazı aktarıldı.`);
  mail.postsImported(imported);
}

server.listen(PORT, () => {
  console.log(`Site hazır: http://localhost:${PORT}  (Almanca: /de/, İngilizce: /en/, Felemenkçe: /nl/, yönetim: /yonetim)`);
  const missing = [];
  if (!config.siteUrl) missing.push('siteUrl');
  if (!config.contact.email) missing.push('contact.email');
  if (!config.contact.phoneDe) missing.push('contact.phoneDe');
  if (!config.insurance.insurer) missing.push('insurance');
  if (!admin.passwordEnabled()) missing.push('ADMIN_PASSWORD (.env)');
  if (!process.env.SMTP_HOST) missing.push('SMTP (.env)');
  if (missing.length) console.warn('Eksik yapılandırma:', missing.join(', '));
});
