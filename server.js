import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

try {
  process.loadEnvFile(path.resolve(import.meta.dirname, '.env'));
} catch {
  // .env yoksa ortam değişkenleri kullanılır.
}

const config = (await import('./site.config.js')).default;
const { paths, LANGS } = await import('./src/i18n.js');
const pages = await import('./src/pages.js');
const { areas, findArea } = await import('./src/content/areas.js');
const { findPost, posts } = await import('./src/blog.js');
const { db, purgeOld } = await import('./src/db.js');
const booking = await import('./src/booking.js');
const mail = await import('./src/mail.js');
const admin = await import('./src/admin.js');
const { absUrl } = await import('./src/layout.js');

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
  const add = (tr, de) => {
    for (const [lang, p] of [['tr', tr], ['de', de]]) {
      urls.push(`<url><loc>${absUrl(p)}</loc>
<xhtml:link rel="alternate" hreflang="tr" href="${absUrl(tr)}"/>
<xhtml:link rel="alternate" hreflang="de" href="${absUrl(de)}"/></url>`);
      void lang;
    }
  };
  for (const k of ['home', 'about', 'areas', 'crossborder', 'blog', 'contact', 'booking', 'imprint', 'privacy', 'cookies']) add(paths[k].tr, paths[k].de);
  for (const a of areas) add(`${paths.areas.tr}/${a.slug.tr}`, `${paths.areas.de}/${a.slug.de}`);
  for (const lang of LANGS) {
    for (const p of posts(lang)) urls.push(`<url><loc>${absUrl(`${paths.blog[lang]}/${p.slug}`)}</loc><lastmod>${p.date}</lastmod></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/* ------------------------------ sayfalar ------------------------------ */

// Sabit yollar: yol -> [dil, oluşturucu]
const routes = new Map();
for (const lang of LANGS) {
  routes.set(paths.home[lang], () => pages.home(lang));
  routes.set(paths.about[lang], () => pages.about(lang));
  routes.set(paths.areas[lang], () => pages.areasPage(lang));
  routes.set(paths.crossborder[lang], () => pages.crossborderPage(lang));
  routes.set(paths.blog[lang], () => pages.blogPage(lang));
  routes.set(paths.contact[lang], () => pages.contactPage(lang));
  routes.set(paths.booking[lang], () => pages.bookingPage(lang));
  routes.set(paths.imprint[lang], () => pages.legalPage('imprint', lang));
  routes.set(paths.privacy[lang], () => pages.legalPage('privacy', lang));
  routes.set(paths.cookies[lang], () => pages.legalPage('cookies', lang));
}

function dynamicPage(pathname) {
  for (const lang of LANGS) {
    const area = pathname.startsWith(paths.areas[lang] + '/') && findArea(lang, pathname.slice(paths.areas[lang].length + 1));
    if (area) return pages.areaPage(lang, area);
    const post = pathname.startsWith(paths.blog[lang] + '/') && findPost(lang, pathname.slice(paths.blog[lang].length + 1));
    if (post) return pages.postPage(lang, post);
  }
  return null;
}

const langOf = (pathname) => (pathname === '/de' || pathname.startsWith('/de/') ? 'de' : 'tr');

/* -------------------------------- API -------------------------------- */

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
    lang: b.lang === 'de' ? 'de' : 'tr',
    type: clean(b.type, 40),
    topic: clean(b.topic, 40),
    start: clean(b.start, 40),
    name: clean(b.name, 120),
    email: clean(b.email, 160).toLowerCase(),
    phone: clean(b.phone, 40),
    language: b.language === 'de' ? 'de' : 'tr',
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
    lang: b.lang === 'de' ? 'de' : 'tr',
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

  if (req.method === 'POST') {
    const form = new URLSearchParams(await readBody(req, 5000));
    if (form.get('csrf') !== session.csrf) return send(res, 403, 'Geçersiz istek', 'text/plain; charset=utf-8');
    if (p === '/yonetim/cikis') return redirect(res, '/yonetim', { 'Set-Cookie': admin.clearSessionCookie });
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
  return redirect(res, '/yonetim');
}

/* ------------------------------- sunucu ------------------------------- */

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let pathname = url.pathname;

  if (pathname === '/yonetim' || pathname.startsWith('/yonetim/')) return handleAdmin(req, res, url);

  if (pathname === '/api/availability' && req.method === 'GET') {
    if (rateLimited(req, 'avail', 120, 600_000)) return json(res, 429, { error: 'rate' });
    return json(res, 200, { timezone: config.booking.timezone, days: booking.availability() });
  }
  if (pathname === '/api/appointments' && req.method === 'POST') return apiAppointments(req, res);
  if (pathname === '/api/contact' && req.method === 'POST') return apiContact(req, res);

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
  if (pathname === '/favicon.ico') return redirect(res, '/img/favicon-64.png');

  if (/\.[a-z0-9]+$/i.test(pathname) && serveStatic(req, res, pathname)) return;

  if (pathname === '/de') return redirect(res, '/de/');
  if (pathname.length > 1 && pathname.endsWith('/') && pathname !== '/de/') pathname = pathname.slice(0, -1);

  const render = routes.get(pathname);
  const html = render ? render() : dynamicPage(pathname);
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

server.listen(PORT, () => {
  console.log(`Site hazır: http://localhost:${PORT}  (Almanca: /de/, yönetim: /yonetim)`);
  const missing = [];
  if (!config.siteUrl) missing.push('siteUrl');
  if (!config.contact.email) missing.push('contact.email');
  if (!config.contact.phoneDe) missing.push('contact.phoneDe');
  if (!config.insurance.insurer) missing.push('insurance');
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD (.env)');
  if (!process.env.SMTP_HOST) missing.push('SMTP (.env)');
  if (missing.length) console.warn('Eksik yapılandırma:', missing.join(', '));
});
