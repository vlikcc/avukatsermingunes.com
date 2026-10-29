import config from '../site.config.js';
import { paths, t, LANGS, langNames, intlLocale, isForeign, proTitle } from './i18n.js';
import { flag } from './flags.js';

export const h = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Yapılandırmada eksik olan zorunlu bilgiler için görünür yer tutucu.
export const missing = (lang) => `<span class="missing">[${h(t[lang].missing)}]</span>`;

export const absUrl = (path) => (config.siteUrl ? config.siteUrl + path : path);

/** Sürüm eklenmiş statik dosya adresi; sunucu bunları bir yıl önbelleğe aldırır. */
export const asset = (path) => `${path}?v=${ASSET_VERSION}`;

// Arama sonuçlarında kesilmemesi için açıklamayı sözcük sınırında kısaltır.
const clip = (text, max = 160) => {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:–-]+$/, '') + '…';
};

/** Avukatın yapılandırılmış veri kimliği; diğer sayfalar bu kimliğe başvurur. */
export const attorneyId = () => absUrl('/#avukat');

export const formatDate = (iso, lang) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString(intlLocale[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

// Logodaki iç içe geçen altın çizgilerden türetilen iki iplik motifi.
export function strandsSvg(cls = '') {
  const pts = (sign) => {
    const out = [];
    for (let x = 0; x <= 1200; x += 10) {
      const y = 40 + sign * 20 * Math.sin((x / 300) * Math.PI * 2 - Math.PI);
      out.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return out.join(' ');
  };
  return `<svg class="strands ${cls}" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="${pts(1)}" pathLength="1"/><path d="${pts(-1)}" pathLength="1"/></svg>`;
}

const DAYS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

// Avukatın tam kaydı (schema.org Attorney). Yalnızca yapılandırmada bulunan bilgiler yazılır.
function attorneyLd(lang) {
  const L = config.lawyer;
  const c = config.contact;
  const address = [
    {
      '@type': 'PostalAddress',
      streetAddress: c.addressDe.street,
      postalCode: c.addressDe.city.split(' ')[0],
      addressLocality: c.addressDe.city.split(' ').slice(1).join(' '),
      addressCountry: 'DE',
    },
  ];
  if (c.addressTr) {
    address.push({
      '@type': 'PostalAddress',
      streetAddress: c.addressTr.street,
      postalCode: c.addressTr.city.split(' ')[0],
      addressLocality: c.addressTr.city.split(' ').slice(1).join(' '),
      addressCountry: 'TR',
    });
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    '@id': attorneyId(),
    name: `${proTitle[lang]} ${L.name}`,
    url: absUrl(paths.home[lang]),
    image: absUrl('/img/portre-ana.jpg'),
    logo: absUrl('/img/logo-720.png'),
    areaServed: [
      { '@type': 'Country', name: 'Türkiye' },
      { '@type': 'Country', name: 'Germany' },
    ],
    knowsLanguage: ['tr', 'de'],
    address: address.length === 1 ? address[0] : address,
    // Randevu verilen saatler (Almanya saati).
    openingHoursSpecification: Object.entries(config.booking.weekly)
      .flatMap(([d, ranges]) => ranges.map(([opens, closes]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DAYS[d], opens, closes }))),
    memberOf: [
      { '@type': 'Organization', name: L.barTr.name, url: L.barTr.url },
      { '@type': 'Organization', name: L.barDe.name, url: L.barDe.url },
    ],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Dokuz Eylül Üniversitesi' },
  };
  if (c.email) data.email = c.email;
  if (c.phoneDe || c.phoneTr) data.telephone = c.phoneDe || c.phoneTr;
  if (config.social?.length) data.sameAs = config.social.map((x) => x.url || x);
  return data;
}

const ldScript = (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`;

const navItems = ['about', 'areas', 'crossborder', 'blog', 'contact'];
const homeLabel = { tr: 'Ana sayfa', de: 'Startseite', en: 'Home', nl: 'Startpagina' };

/**
 * @param {object} o
 * @param {'tr'|'de'|'en'|'nl'} o.lang
 * @param {string} o.title       Sayfa başlığı (avukatın adı otomatik eklenir)
 * @param {string} [o.fullTitle] Başlığın tamamı (ana sayfa gibi ad eklenmeyecek sayfalar için)
 * @param {string} o.description Meta açıklama
 * @param {string} o.path        Bu sayfanın yolu
 * @param {Record<string,string>|null} o.alt  Her dildeki karşılığı: { tr, de, en, nl } (dil seçici)
 * @param {string[]} [o.hreflang] hreflang ile bildirilecek diller (varsayılan: hepsi). Çevirisi
 *                                olmayan bir yazıda dil seçici liste sayfasına gider, ama o dil bildirilmez.
 * @param {boolean} [o.attorney] Avukatın tam yapılandırılmış veri kaydını ekle
 * @param {string} [o.active]    Aktif menü anahtarı
 * @param {string} o.body
 * @param {boolean} [o.noindex]
 * @param {string[]} [o.scripts]
 * @param {{ published: string, modified?: string, section?: string }} [o.article]  Yazı sayfaları için
 * @param {object[]} [o.jsonLd]  Sayfaya eklenecek ek yapılandırılmış veriler (schema.org)
 */
export function layout(o) {
  const { lang } = o;
  const s = t[lang];
  const foreign = isForeign(lang);
  const L = config.lawyer;
  // Ad eki başlığı 60 karakterden uzun yapıyorsa eklenmez (arama sonuçlarında kesilmesin).
  const named = `${o.title} | ${foreign ? '' : 'Av. '}${L.name}`;
  const fullTitle = o.fullTitle || (named.length <= 60 ? named : o.title);
  const description = clip(o.description);
  const alt = o.alt ? { ...o.alt, [lang]: o.path } : null;
  const hreflangs = alt ? (o.hreflang || LANGS) : [];

  const nav = navItems
    .map(
      (k) =>
        `<li><a href="${paths[k][lang]}"${o.active === k ? ' aria-current="page"' : ''}>${h(s.nav[k])}</a></li>`,
    )
    .join('');

  const addrTr = config.contact.addressTr;
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="${s.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(fullTitle)}</title>
<meta name="description" content="${h(description)}">
${o.noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="canonical" href="${h(absUrl(o.path))}">
${hreflangs.map((l) => `<link rel="alternate" hreflang="${l}" href="${h(absUrl(alt[l]))}">`).join('\n')}
${hreflangs.includes('tr') && hreflangs.length > 1 ? `<link rel="alternate" hreflang="x-default" href="${h(absUrl(alt.tr))}">` : ''}
<meta property="og:type" content="${o.article ? 'article' : 'website'}">
${o.article ? `<meta property="article:published_time" content="${h(o.article.published)}">` : ''}
${o.article?.modified ? `<meta property="article:modified_time" content="${h(o.article.modified)}">` : ''}
${o.article?.section ? `<meta property="article:section" content="${h(o.article.section)}">` : ''}
<meta property="og:title" content="${h(fullTitle)}">
<meta property="og:description" content="${h(description)}">
<meta property="og:url" content="${h(absUrl(o.path))}">
<meta property="og:image" content="${h(absUrl('/img/portre-ana.jpg'))}">
<meta property="og:locale" content="${s.locale}">
<meta name="theme-color" content="#163D32">
<link rel="icon" type="image/png" href="${asset('/img/favicon-64.png')}">
<link rel="apple-touch-icon" href="${asset('/img/apple-touch-icon.png')}">
<link rel="preload" href="/fonts/cormorant-garamond-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/montserrat-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset('/css/site.css')}">
${[...(o.attorney ? [attorneyLd(lang)] : []), ...(o.jsonLd || [])].map(ldScript).join('\n')}
</head>
<body class="page-${h(o.active || 'other')}">
<a class="skip" href="#main">${h(s.skip)}</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${paths.home[lang]}" aria-label="${h(`${proTitle[lang]} ${L.name} – ${homeLabel[lang]}`)}">
      <img src="${asset('/img/logo-104.png')}" width="52" height="47" alt="">
      <span class="brand-text"><span class="brand-name">${h(L.name)}</span><span class="brand-title">${h(s.titleLine)}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-bars" aria-hidden="true"></span><span class="nav-toggle-label">${h(s.menu)}</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="${h(s.navLabel)}">
      <ul>${nav}</ul>
      <div class="nav-actions">
        ${
          alt
            ? `<details class="lang-menu">
          <summary>${flag(lang)}<span aria-hidden="true">${lang.toUpperCase()}</span><span class="sr-only">${h(s.langLabel)}: ${h(langNames[lang])}</span></summary>
          <ul>${LANGS.map((l) =>
            l === lang
              ? `<li><span aria-current="true">${flag(l)}<span class="lang-name">${h(langNames[l])}</span><small>${l.toUpperCase()}</small></span></li>`
              : `<li><a href="${h(alt[l])}" hreflang="${l}" lang="${l}">${flag(l)}<span class="lang-name">${h(langNames[l])}</span><small>${l.toUpperCase()}</small></a></li>`,
          ).join('')}</ul>
        </details>`
            : ''
        }
        <a class="btn btn-small" href="${paths.booking[lang]}"${o.active === 'booking' ? ' aria-current="page"' : ''}>${h(s.nav.booking)}</a>
      </div>
    </nav>
  </div>
</header>
<main id="main">
${o.body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-id">
      <img src="${asset('/img/logo-176.webp')}" width="88" height="79" alt="" loading="lazy">
      <p class="footer-name">${h(proTitle[lang])} ${h(L.name)}</p>
      <p>${h(s.bars)}</p>
    </div>
    <div>
      <p class="footer-head">${h(s.footer.deAddress)}</p>
      <address>${h(config.contact.addressDe.street)}<br>${h(config.contact.addressDe.city)}<br>${h(config.contact.addressDe.country)}</address>
      ${
        addrTr
          ? `<p class="footer-head">${h(s.footer.trOffice)}</p><address>${h(L.office)}<br>${h(addrTr.street)}<br>${h(addrTr.city)}</address>`
          : ''
      }
    </div>
    <div>
      <ul class="footer-links">
        ${navItems.map((k) => `<li><a href="${paths[k][lang]}">${h(s.nav[k])}</a></li>`).join('')}
        <li><a href="${paths.booking[lang]}">${h(s.nav.booking)}</a></li>
      </ul>
    </div>
    <div>
      <ul class="footer-links">
        <li><a href="${paths.imprint[lang]}">${h(s.footer.legal)}</a></li>
        <li><a href="${paths.privacy[lang]}">${h(s.footer.privacy)}</a></li>
        <li><a href="${paths.cookies[lang]}">${h(s.footer.cookies)}</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>${h(s.footer.disclaimer)}</p>
    <p>© ${year} ${h(L.name)}</p>
  </div>
</footer>
<script src="${asset('/js/site.js')}" defer></script>
${(o.scripts || []).map((src) => `<script src="${asset(src)}" defer></script>`).join('\n')}
</body>
</html>`;
}

export const ASSET_VERSION = Date.now().toString(36);
