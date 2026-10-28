import config from '../site.config.js';
import { areas } from './content/areas.js';
import { crossBorderTopics, values } from './content/crossborder.js';
import { paths, t, scopeNotice } from './i18n.js';
import { layout, h, strandsSvg, formatDate, missing } from './layout.js';
import { posts, pairOf, markdown, readingMinutes } from './blog.js';
import { legalPage } from './legal.js';

const L = config.lawyer;
const C = config.contact;
const areaPath = (lang, a) => `${paths.areas[lang]}/${a.slug[lang]}`;
const postPath = (lang, p) => `${paths.blog[lang]}/${p.slug}`;

const fmtFull = (iso, lang) => formatDate(iso, lang);

// Kariyer zaman çizelgesi (gerçek bir sıra olduğu için numaralı/sıralı gösterilir).
const timeline = (lang) =>
  lang === 'de'
    ? [
        ['2016', 'Abschluss an der Juristischen Fakultät der Dokuz-Eylül-Universität'],
        ['30.01.2018', 'Anwaltszulassung, İzmir Barosu'],
        ['2018', 'Gründung von Güneş Hukuk Bürosu in İzmir'],
        ['31.10.2024', 'Aufnahme in die Rechtsanwaltskammer Düsseldorf nach § 206 BRAO'],
      ]
    : [
        ['2016', 'Dokuz Eylül Üniversitesi Hukuk Fakültesinden mezuniyet'],
        ['30.01.2018', 'Avukatlık ruhsatı, İzmir Barosu'],
        ['2018', 'Güneş Hukuk Bürosunun İzmir’de kuruluşu'],
        ['31.10.2024', 'Rechtsanwaltskammer Düsseldorf kaydı, § 206 BRAO'],
      ];

function timelineBlock(lang, extraClass = '') {
  return `<div class="timeline ${extraClass}">
    ${strandsSvg('timeline-strands')}
    <ol class="timeline-list">
      ${timeline(lang)
        .map(([d, txt]) => `<li><span class="tl-dot" aria-hidden="true"></span><span class="tl-date">${h(d)}</span><span class="tl-text">${h(txt)}</span></li>`)
        .join('')}
    </ol>
  </div>`;
}

const scopeBox = (lang, cls = '') => `<aside class="scope ${cls}" aria-label="${lang === 'de' ? 'Hinweis zur Berufsbezeichnung' : 'Mesleki unvan açıklaması'}">
  <p class="scope-head">${lang === 'de' ? 'Berufsbezeichnung und Tätigkeitsumfang in Deutschland' : 'Almanya’daki mesleki unvan ve faaliyet kapsamı'}</p>
  <p>${h(scopeNotice[lang])}</p>
</aside>`;

function bookingBand(lang) {
  const steps =
    lang === 'de'
      ? ['Gesprächsart und Thema wählen', 'Freien Termin auswählen', 'Kontaktdaten angeben; die Bestätigung erhalten Sie per E-Mail']
      : ['Görüşme türünü ve konuyu seçin', 'Uygun bir tarih ve saat belirleyin', 'Bilgilerinizi iletin; onay e-posta ile bildirilir'];
  return `<section class="band band-booking" aria-labelledby="bb-title">
    <div class="wrap band-booking-inner">
      <div>
        <h2 id="bb-title">${lang === 'de' ? 'Gesprächstermin vereinbaren' : 'Görüşme randevusu'}</h2>
        <p>${
          lang === 'de'
            ? 'Termine finden online per Video, telefonisch oder persönlich in Düsseldorf statt. Die Uhrzeiten werden in deutscher und türkischer Zeit angezeigt.'
            : 'Görüşmeler online görüntülü, telefonla veya Düsseldorf’ta yüz yüze yapılabilir. Saatler Almanya ve Türkiye saatiyle birlikte gösterilir.'
        }</p>
        <a class="btn btn-gold" href="${paths.booking[lang]}">${h(t[lang].bookCta)}</a>
      </div>
      <ol class="steps">${steps.map((s) => `<li>${h(s)}</li>`).join('')}</ol>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Ana sayfa                                                           */
/* ------------------------------------------------------------------ */

export function home(lang) {
  const de = lang === 'de';
  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <h1><span class="h1-pre">${de ? 'Avukat (Türkei)' : 'Avukat'}</span>${h(L.name)}</h1>
      <p class="hero-bars">İzmir Barosu <span aria-hidden="true">|</span> Rechtsanwaltskammer Düsseldorf</p>
      <p class="hero-lead">${
        de
          ? 'Beratung und Vertretung im türkischen Recht bei Angelegenheiten mit Bezug zur Türkei und zu Deutschland'
          : 'Türkiye ve Almanya bağlantılı hukuki süreçlerde avukatlık ve danışmanlık hizmetleri'
      }</p>
      <div class="hero-actions">
        <a class="btn" href="${paths.booking[lang]}">${h(t[lang].bookCta)}</a>
        <a class="link-quiet" href="${paths.areas[lang]}">${de ? 'Rechtsgebiete ansehen' : 'Çalışma alanlarını inceleyin'}</a>
      </div>
    </div>
    <figure class="hero-figure portrait portrait-arch">
      <img src="/img/portre-ana.jpg" width="689" height="900" alt="${de ? 'Avukat (Türkei) Sermin Güneş Keçeci' : 'Av. Sermin Güneş Keçeci'}" fetchpriority="high">
      <img class="hero-badge" src="/img/logo-160.png" width="160" height="144" alt="">
    </figure>
  </div>
  <div class="wrap">${timelineBlock(lang, 'timeline-hero')}</div>
</section>

<section class="section about-short" aria-labelledby="about-title">
  <div class="wrap split">
    <h2 id="about-title">${de ? 'Zur Person' : 'Hakkımda'}</h2>
    <div class="prose">
      <p class="lead">${
        de
          ? `Seit 2018 bin ich in der Türkei als Avukat zugelassen und Mitglied der Rechtsanwaltskammer İzmir. Im selben Jahr habe ich in İzmir die Kanzlei Güneş Hukuk Bürosu gegründet.`
          : `2018 yılından bu yana İzmir Barosuna kayıtlı avukat olarak çalışıyorum. Aynı yıl İzmir’de Güneş Hukuk Bürosunu kurdum.`
      }</p>
      <p>${
        de
          ? 'Seit dem 31. Oktober 2024 bin ich gemäß § 206 BRAO auch Mitglied der Rechtsanwaltskammer Düsseldorf. In Deutschland betreue ich vor allem türkische Rechtsangelegenheiten von Menschen, die hier leben.'
          : '31 Ekim 2024’ten bu yana § 206 BRAO kapsamında Rechtsanwaltskammer Düsseldorf’a da kayıtlıyım. Türkiye’deki uyuşmazlıkların yanı sıra Almanya’da yaşayan Türk vatandaşlarının Türkiye’deki hukuki işlemleriyle ilgileniyorum.'
      }</p>
      <p><a class="link-arrow" href="${paths.about[lang]}">${de ? 'Werdegang und Zulassungen' : 'Mesleki geçmiş ve baro kayıtları'}</a></p>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="areas-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="areas-title">${de ? 'Rechtsgebiete' : 'Hukuki çalışma alanları'}</h2>
      <p>${de ? 'Beratung und Vertretung nach türkischem Recht.' : 'Özel hukuk ve kamu hukukunun çeşitli alanlarında dava takibi ve danışmanlık.'}</p>
    </div>
    ${areaIndex(lang)}
  </div>
</section>

<section class="section section-green" aria-labelledby="cb-title">
  <div class="wrap split split-wide">
    <div>
      <h2 id="cb-title">${de ? 'Türkei–Deutschland' : 'Türkiye–Almanya hukuki işlemler'}</h2>
      <p class="lead">${
        de
          ? 'Viele in Deutschland lebende Menschen haben Rechtsangelegenheiten in der Türkei: eine Scheidung, ein Nachlass, ein Grundstück oder ein laufendes Verfahren.'
          : 'Almanya’da yaşayan pek çok kişinin Türkiye’de süren bir boşanma, miras, taşınmaz veya dava süreci bulunmaktadır.'
      }</p>
      <p>${
        de
          ? 'Diese Angelegenheiten lassen sich von Düsseldorf aus begleiten, ohne dass Sie für jeden Schritt in die Türkei reisen müssen.'
          : 'Bu süreçler, her aşama için Türkiye’ye gitmenizi gerektirmeden Düsseldorf’tan takip edilebilir.'
      }</p>
      <a class="link-arrow on-dark" href="${paths.crossborder[lang]}">${de ? 'Alle Themen im Überblick' : 'Tüm başlıkları inceleyin'}</a>
    </div>
    <ul class="cb-list">
      ${crossBorderTopics.map((x) => `<li>${h(x.title[lang])}</li>`).join('')}
    </ul>
  </div>
  <div class="wrap">${scopeBox(lang, 'scope-on-dark')}</div>
</section>

<section class="section" aria-labelledby="values-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="values-title">${de ? 'Berufliches Selbstverständnis' : 'Mesleki yaklaşım'}</h2>
    </div>
    ${valuesGrid(lang)}
  </div>
</section>

${bookingBand(lang)}

<section class="section" aria-labelledby="contact-title">
  <div class="wrap split">
    <h2 id="contact-title">${de ? 'Kontakt' : 'İletişim'}</h2>
    <div class="contact-short">
      ${contactCards(lang)}
      <p><a class="link-arrow" href="${paths.contact[lang]}">${de ? 'Nachricht senden' : 'Mesaj gönderin'}</a></p>
    </div>
  </div>
</section>`;

  return layout({
    lang,
    title: null,
    description: de
      ? 'Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf: Beratung im türkischen Recht – Scheidung, Erbschaft, Immobilien und Anerkennung deutscher Urteile in der Türkei.'
      : 'Av. Sermin Güneş Keçeci – İzmir Barosu ve Rechtsanwaltskammer Düsseldorf. Türkiye ve Almanya bağlantılı boşanma, miras, gayrimenkul ve tanıma-tenfiz süreçleri.',
    path: paths.home[lang],
    altPath: paths.home[lang === 'tr' ? 'de' : 'tr'],
    active: 'home',
    body,
  });
}

function areaIndex(lang) {
  return `<ul class="area-index">
    ${areas
      .map(
        (a) => `<li><a href="${areaPath(lang, a)}">
          <span class="area-name">${h(a.title[lang])}</span>
          <span class="area-sum">${h(a.summary[lang])}</span>
        </a></li>`,
      )
      .join('')}
  </ul>`;
}

function valuesGrid(lang) {
  return `<dl class="values">
    ${values.map((v) => `<div><dt>${h(v.title[lang])}</dt><dd>${h(v.text[lang])}</dd></div>`).join('')}
  </dl>`;
}

function contactCards(lang) {
  const de = lang === 'de';
  const lines = [];
  lines.push(`<div class="contact-card">
    <p class="contact-head">Düsseldorf</p>
    <address>${h(C.addressDe.street)}<br>${h(C.addressDe.city)}<br>${h(C.addressDe.country)}</address>
  </div>`);
  if (C.addressTr) {
    lines.push(`<div class="contact-card">
      <p class="contact-head">İzmir — ${h(L.office)}</p>
      <address>${h(C.addressTr.street)}<br>${h(C.addressTr.city)}<br>${h(C.addressTr.country)}</address>
    </div>`);
  }
  const direct = [];
  if (C.email) direct.push(`<a href="mailto:${h(C.email)}">${h(C.email)}</a>`);
  if (C.phoneDe) direct.push(`<a href="tel:${h(C.phoneDe.replace(/\s/g, ''))}">${h(C.phoneDe)}</a> <span class="muted">(${de ? 'Deutschland' : 'Almanya'})</span>`);
  if (C.phoneTr) direct.push(`<a href="tel:${h(C.phoneTr.replace(/\s/g, ''))}">${h(C.phoneTr)}</a> <span class="muted">(${de ? 'Türkei' : 'Türkiye'})</span>`);
  if (direct.length) {
    lines.push(`<div class="contact-card"><p class="contact-head">${de ? 'Direkt' : 'Doğrudan'}</p><p>${direct.join('<br>')}</p></div>`);
  }
  return `<div class="contact-cards">${lines.join('')}</div>`;
}

/* ------------------------------------------------------------------ */
/* Hakkımda                                                            */
/* ------------------------------------------------------------------ */

export function about(lang) {
  const de = lang === 'de';
  const facts = de
    ? [
        ['Berufsbezeichnung', 'Avukat (Türkei) — verliehen in der Türkei'],
        ['Zulassung in der Türkei', 'İzmir Barosu, seit 30.01.2018'],
        ['Kammer in Deutschland', `Rechtsanwaltskammer Düsseldorf, Mitgliedsnummer ${L.barDe.memberNo}`],
        ['Aufnahme in Deutschland', '31.10.2024, gemäß § 206 BRAO'],
        ['Kanzlei in der Türkei', 'Güneş Hukuk Bürosu, İzmir (gegründet 2018)'],
        ['Studium', 'Juristische Fakultät der Dokuz-Eylül-Universität, Abschluss 2016'],
        ['Sprachen', 'Türkisch, Deutsch'],
      ]
    : [
        ['Mesleki unvan', 'Avukat'],
        ['Türkiye’deki baro', 'İzmir Barosu — ruhsat tarihi 30.01.2018'],
        ['Almanya’daki baro', `Rechtsanwaltskammer Düsseldorf — üyelik no. ${L.barDe.memberNo}`],
        ['Almanya’daki statü', '§ 206 BRAO kapsamında kayıtlı Türk avukat, “Avukat (Türkei)” — kayıt tarihi 31.10.2024'],
        ['Hukuk bürosu', 'Güneş Hukuk Bürosu, İzmir (kuruluş 2018)'],
        ['Eğitim', 'Dokuz Eylül Üniversitesi Hukuk Fakültesi, 2016'],
        ['Diller', 'Türkçe, Almanca'],
      ];

  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${de ? 'Über mich' : 'Hakkımda'}</h1>
    <p class="page-lead">${de ? 'Avukat (Türkei) Sermin Güneş Keçeci — Werdegang, Zulassungen und Arbeitsweise.' : 'Av. Sermin Güneş Keçeci — eğitim, mesleki geçmiş ve baro kayıtları.'}</p>
  </div>
</header>

<section class="section section-tight">
  <div class="wrap split">
    <figure class="about-figure portrait"><img src="/img/portre-hakkimda.jpg" width="591" height="514" alt="${de ? 'Avukat (Türkei) Sermin Güneş Keçeci' : 'Av. Sermin Güneş Keçeci'}" loading="lazy"></figure>
    <div class="prose">
      ${
        de
          ? `<p class="lead">2016 habe ich mein Studium an der Juristischen Fakultät der Dokuz-Eylül-Universität in İzmir abgeschlossen.</p>
      <p>Nach dem Referendariat (staj) bei der Rechtsanwaltskammer İzmir erhielt ich am 30. Januar 2018 meine Anwaltszulassung. Im selben Jahr gründete ich in İzmir die Kanzlei Güneş Hukuk Bürosu und bin seitdem selbstständig als Avukat tätig.</p>
      <p>In meiner beruflichen Tätigkeit habe ich in zahlreichen Bereichen des Privatrechts und des öffentlichen Rechts gearbeitet, insbesondere im Familien-, Straf-, Erb-, Immobilien-, Arbeits-, Vollstreckungs-, Schadensersatz- und Vertragsrecht.</p>
      <p>Am 31. Oktober 2024 wurde ich gemäß § 206 BRAO in die Rechtsanwaltskammer Düsseldorf aufgenommen. Seitdem berate ich von Düsseldorf aus vor allem Menschen, die in Deutschland leben, in ihren Rechtsangelegenheiten in der Türkei sowie in Fällen mit Auslandsbezug nach türkischem Recht.</p>
      <p>Im Mittelpunkt meiner Arbeit stehen juristische Sorgfalt, der Schutz der Rechte meiner Mandantinnen und Mandanten, eine offene Kommunikation und die Prüfung jedes Falls unter seinen besonderen Umständen.</p>`
          : `<p class="lead">2016 yılında Dokuz Eylül Üniversitesi Hukuk Fakültesinden mezun oldum.</p>
      <p>Avukatlık stajımı İzmir Barosu bünyesinde tamamladım ve 30 Ocak 2018 tarihinde avukatlık ruhsatımı aldım. Aynı yıl İzmir’de Güneş Hukuk Bürosunu kurarak bağımsız avukatlık faaliyetlerime başladım.</p>
      <p>Meslek hayatım boyunca aile hukuku, ceza hukuku, miras hukuku, gayrimenkul hukuku, iş hukuku, icra ve iflas hukuku, tazminat hukuku ve sözleşmeler hukuku başta olmak üzere özel hukukun ve kamu hukukunun çeşitli alanlarında çalıştım.</p>
      <p>31 Ekim 2024 tarihinde Almanya’da Düsseldorf Barosuna (Rechtsanwaltskammer Düsseldorf) § 206 BRAO kapsamında kaydolarak mesleki faaliyetlerimi uluslararası boyuta taşıdım. Bugün Türkiye’deki hukuki uyuşmazlıkların yanı sıra Almanya’da yaşayan Türk vatandaşlarının Türkiye’deki hukuki işlemleriyle ve yabancılık unsuru taşıyan uyuşmazlıklarla ilgileniyorum.</p>
      <p>Mesleki yaklaşımımda hukuki titizliği, müvekkil haklarının korunmasını, şeffaf iletişimi ve her uyuşmazlığın kendine özgü koşullarıyla değerlendirilmesini ön planda tutuyorum.</p>`
      }
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="tl-title">
  <div class="wrap">
    <h2 id="tl-title">${de ? 'Werdegang' : 'Mesleki geçmiş'}</h2>
    ${timelineBlock(lang)}
  </div>
</section>

<section class="section" aria-labelledby="facts-title">
  <div class="wrap split">
    <h2 id="facts-title">${de ? 'Zulassungen und Angaben' : 'Baro kayıtları ve bilgiler'}</h2>
    <div>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${h(k)}</dt><dd>${h(v)}</dd></div>`).join('')}</dl>
      ${scopeBox(lang)}
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="values-title">
  <div class="wrap">
    <div class="section-head"><h2 id="values-title">${de ? 'Berufliches Selbstverständnis' : 'Mesleki değerler'}</h2></div>
    ${valuesGrid(lang)}
  </div>
</section>

${bookingBand(lang)}`;

  return layout({
    lang,
    title: de ? 'Über mich' : 'Hakkımda',
    description: de
      ? 'Werdegang von Avukat (Türkei) Sermin Güneş Keçeci: Studium in İzmir, Zulassung 2018, Güneş Hukuk Bürosu und Mitgliedschaft in der Rechtsanwaltskammer Düsseldorf nach § 206 BRAO.'
      : 'Av. Sermin Güneş Keçeci: Dokuz Eylül Üniversitesi Hukuk Fakültesi, 2018’den beri İzmir Barosu, Güneş Hukuk Bürosu ve § 206 BRAO kapsamında Düsseldorf Barosu kaydı.',
    path: paths.about[lang],
    altPath: paths.about[lang === 'tr' ? 'de' : 'tr'],
    active: 'about',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Çalışma alanları                                                    */
/* ------------------------------------------------------------------ */

export function areasPage(lang) {
  const de = lang === 'de';
  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${de ? 'Rechtsgebiete' : 'Çalışma Alanları'}</h1>
    <p class="page-lead">${
      de
        ? 'Beratung und Vertretung im türkischen Recht. Wählen Sie ein Rechtsgebiet, um mehr über die jeweiligen Themen zu erfahren.'
        : 'Dava takibi ve hukuki danışmanlık verilen alanlar. Ayrıntılar için ilgili alanı seçin.'
    }</p>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap">${areaIndex(lang)}</div>
</section>
${de ? `<section class="section section-tight"><div class="wrap">${scopeBox(lang)}</div></section>` : ''}
${bookingBand(lang)}`;
  return layout({
    lang,
    title: de ? 'Rechtsgebiete' : 'Çalışma Alanları',
    description: de
      ? 'Rechtsgebiete im türkischen Recht: Familienrecht, Erbrecht, Immobilienrecht, Strafrecht, Arbeitsrecht, Vollstreckung, Schadensersatz, Vertragsrecht, Verbraucherrecht und IPR.'
      : 'Aile, miras, gayrimenkul, ceza, iş, icra ve iflas, tazminat, ticaret ve sözleşmeler, tüketici hukuku ve milletlerarası özel hukuk alanlarında avukatlık hizmetleri.',
    path: paths.areas[lang],
    altPath: paths.areas[lang === 'tr' ? 'de' : 'tr'],
    active: 'areas',
    body,
  });
}

export function areaPage(lang, a) {
  const de = lang === 'de';
  const other = lang === 'tr' ? 'de' : 'tr';
  const body = `
<header class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="${de ? 'Brotkrumen' : 'Sayfa yolu'}"><a href="${paths.areas[lang]}">${de ? 'Rechtsgebiete' : 'Çalışma Alanları'}</a></nav>
    <h1>${h(a.title[lang])}${de ? ' <span class="h1-note">nach türkischem Recht</span>' : ''}</h1>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap area-layout">
    <div class="prose">
      ${a.intro[lang].map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${h(p)}</p>`).join('')}
      <h2>${de ? 'Themen' : 'Başlıca konular'}</h2>
      <ul class="topic-list">${a.items[lang].map((x) => `<li>${h(x)}</li>`).join('')}</ul>
      ${
        a.crossBorder
          ? `<div class="note"><h2>${de ? 'Bezug zu Deutschland' : 'Almanya bağlantılı durumlar'}</h2><p>${h(a.crossBorder[lang])}</p>
             <p><a class="link-arrow" href="${paths.crossborder[lang]}">${de ? 'Türkei–Deutschland' : 'Türkiye–Almanya hukuki işlemler'}</a></p></div>`
          : ''
      }
      <p class="muted small">${
        de
          ? 'Diese Seite gibt einen allgemeinen Überblick. Ob und wie in Ihrem Fall vorgegangen werden kann, lässt sich erst nach Prüfung der Unterlagen beurteilen.'
          : 'Bu sayfa genel bilgi verir. Somut durumunuzda nasıl bir yol izlenebileceği, ancak belgelerin incelenmesinden sonra değerlendirilebilir.'
      }</p>
      ${de ? scopeBox(lang) : ''}
    </div>
    <aside class="area-aside">
      <div class="aside-book">
        <p class="aside-title">${de ? 'Gespräch vereinbaren' : 'Görüşme planlayın'}</p>
        <p>${h(t[lang].bookLead)}</p>
        <a class="btn" href="${paths.booking[lang]}?konu=${a.key}">${h(t[lang].bookCta)}</a>
      </div>
      <nav aria-label="${de ? 'Weitere Rechtsgebiete' : 'Diğer çalışma alanları'}">
        <p class="aside-title">${de ? 'Weitere Rechtsgebiete' : 'Diğer alanlar'}</p>
        <ul class="aside-list">${areas
          .filter((x) => x !== a)
          .map((x) => `<li><a href="${areaPath(lang, x)}">${h(x.title[lang])}</a></li>`)
          .join('')}</ul>
      </nav>
    </aside>
  </div>
</section>`;
  return layout({
    lang,
    title: de ? `${a.title.de} (türkisches Recht)` : a.title.tr,
    description: de
      ? `${a.title.de} nach türkischem Recht: ${a.items.de.slice(0, 4).join(', ')}. Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf.`
      : `${a.title.tr}: ${a.items.tr.slice(0, 4).join(', ')}. Av. Sermin Güneş Keçeci, İzmir ve Düsseldorf.`,
    path: areaPath(lang, a),
    altPath: areaPath(other, a),
    active: 'areas',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Türkiye–Almanya                                                     */
/* ------------------------------------------------------------------ */

export function crossborderPage(lang) {
  const de = lang === 'de';
  const related = posts(lang);
  const postFor = (key) => related.find((p) => p.pair === key);
  const body = `
<header class="page-head page-head-green">
  <div class="wrap">
    <h1>${de ? 'Türkei–Deutschland' : 'Türkiye–Almanya hukuki işlemler'}</h1>
    <p class="page-lead">${
      de
        ? 'Rechtsangelegenheiten in der Türkei für Menschen, die in Deutschland leben: Scheidung, Anerkennung, Erbschaft, Immobilien und laufende Verfahren.'
        : 'Almanya’da yaşayanların Türkiye’deki hukuki işlemleri: boşanma, tanıma, miras, taşınmaz ve süren davalar.'
    }</p>
  </div>
  ${strandsSvg('page-head-strands')}
</header>

<section class="section section-tight">
  <div class="wrap split">
    <h2>${de ? 'Worum es geht' : 'Bu bölüm kimler için?'}</h2>
    <div class="prose">
      <p class="lead">${
        de
          ? 'Wer in Deutschland lebt, hat oft weiterhin rechtliche Verbindungen in die Türkei – über die Staatsangehörigkeit, Familie, Grundstücke oder einen Nachlass.'
          : 'Almanya’da yaşayan pek çok Türk vatandaşının vatandaşlık, aile, taşınmaz veya miras yoluyla Türkiye ile hukuki bağı devam etmektedir.'
      }</p>
      <p>${
        de
          ? 'Ein deutsches Scheidungsurteil wird in der Türkei nicht automatisch wirksam, ein Grundstück in der Türkei unterliegt türkischem Recht, und für die Vertretung vor türkischen Gerichten und Behörden ist eine formgerechte Vollmacht nötig. Diese Schritte lassen sich von Deutschland aus planen und begleiten.'
          : 'Almanya’da verilen bir boşanma kararı Türkiye’de kendiliğinden hüküm doğurmaz; Türkiye’deki taşınmazlar Türk hukukuna tabidir; Türk mahkemeleri ve kurumları önünde temsil için usulüne uygun bir vekâletname gerekir. Bu adımlar Almanya’dan planlanabilir ve takip edilebilir.'
      }</p>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="topics-title">
  <div class="wrap">
    <h2 id="topics-title" class="section-title">${de ? 'Themen' : 'Başlıca konular'}</h2>
    <div class="cb-topics">
      ${crossBorderTopics
        .map((x) => {
          const p = x.post && postFor(x.post);
          return `<article class="cb-topic">
            <h3>${h(x.title[lang])}</h3>
            <p>${h(x.text[lang])}</p>
            ${p ? `<p><a class="link-arrow" href="${postPath(lang, p)}">${de ? 'Zum Beitrag' : 'İlgili yazı'}</a></p>` : ''}
          </article>`;
        })
        .join('')}
    </div>
  </div>
</section>

<section class="section section-tight">
  <div class="wrap split">
    <h2>${de ? 'Zuständigkeit' : 'Yetki sınırları'}</h2>
    <div>
      ${scopeBox(lang)}
      <p class="muted small">${
        de
          ? 'Fragen, die deutsches Recht betreffen – etwa ein Scheidungsverfahren vor einem deutschen Familiengericht –, gehören in die Hände einer in Deutschland zugelassenen Rechtsanwältin oder eines Rechtsanwalts.'
          : 'Alman hukukuna ilişkin konular — örneğin bir Alman aile mahkemesindeki boşanma davası — Almanya’da ruhsatlı bir Rechtsanwalt/Rechtsanwältin tarafından yürütülmelidir.'
      }</p>
    </div>
  </div>
</section>

${bookingBand(lang)}`;
  return layout({
    lang,
    title: de ? 'Türkei–Deutschland: Rechtsangelegenheiten in der Türkei' : 'Türkiye–Almanya Hukuki İşlemler',
    description: de
      ? 'Türkischer Avukat in Düsseldorf: Scheidung in der Türkei, Anerkennung deutscher Scheidungsurteile, Erbschaft und Immobilien in der Türkei, Vollmacht aus Deutschland.'
      : 'Almanya’da yaşayanlar için Türkiye’de boşanma, Almanya boşanma kararının Türkiye’de tanınması, miras ve taşınmaz işlemleri, yurt dışından vekâletname ve dava takibi.',
    path: paths.crossborder[lang],
    altPath: paths.crossborder[lang === 'tr' ? 'de' : 'tr'],
    active: 'crossborder',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Hukuki yayınlar                                                     */
/* ------------------------------------------------------------------ */

export function blogPage(lang) {
  const de = lang === 'de';
  const list = posts(lang);
  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${de ? 'Publikationen' : 'Hukuki Yayınlar'}</h1>
    <p class="page-lead">${de ? 'Allgemeine Informationen zu Rechtsfragen mit Bezug zur Türkei.' : 'Türkiye ve Almanya bağlantılı hukuki konularda genel bilgilendirme yazıları.'}</p>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap">
    ${
      list.length
        ? `<ul class="post-list">${list
            .map(
              (p) => `<li><article>
                <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time></p>
                <h2><a href="${postPath(lang, p)}">${h(p.title)}</a></h2>
                <p>${h(p.description || '')}</p>
              </article></li>`,
            )
            .join('')}</ul>`
        : `<p class="empty">${de ? 'Derzeit sind keine Beiträge veröffentlicht.' : 'Henüz yayımlanmış bir yazı bulunmuyor.'}</p>`
    }
  </div>
</section>`;
  return layout({
    lang,
    title: de ? 'Publikationen' : 'Hukuki Yayınlar',
    description: de
      ? 'Beiträge von Avukat (Türkei) Sermin Güneş Keçeci zu türkischem Recht mit Bezug zu Deutschland.'
      : 'Av. Sermin Güneş Keçeci’nin Türkiye–Almanya bağlantılı hukuki konulardaki bilgilendirme yazıları.',
    path: paths.blog[lang],
    altPath: paths.blog[lang === 'tr' ? 'de' : 'tr'],
    active: 'blog',
    body,
  });
}

export function postPage(lang, p) {
  const de = lang === 'de';
  const other = lang === 'tr' ? 'de' : 'tr';
  const twin = pairOf(p, other);
  const body = `
<article class="post">
  <header class="page-head">
    <div class="wrap wrap-narrow">
      <nav class="crumbs" aria-label="${de ? 'Brotkrumen' : 'Sayfa yolu'}"><a href="${paths.blog[lang]}">${de ? 'Publikationen' : 'Hukuki Yayınlar'}</a></nav>
      <h1>${h(p.title)}</h1>
      <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time> <span aria-hidden="true">/</span> ${readingMinutes(p.body)} ${de ? 'Min. Lesezeit' : 'dk okuma'}</p>
    </div>
  </header>
  <div class="wrap wrap-narrow section-tight">
    <div class="prose prose-article">${markdown(p.body)}</div>
    <aside class="post-disclaimer">
      <p>${
        de
          ? 'Dieser Beitrag gibt den Stand zum Zeitpunkt der Veröffentlichung wieder und dient ausschließlich der allgemeinen Information. Er ersetzt keine Beratung im Einzelfall.'
          : 'Bu yazı yayım tarihindeki mevzuatı esas alır ve yalnızca genel bilgilendirme amacı taşır; somut durumlar için hukuki danışmanlık yerine geçmez.'
      }</p>
    </aside>
  </div>
</article>
${bookingBand(lang)}`;
  return layout({
    lang,
    title: p.title,
    description: p.description || p.title,
    path: postPath(lang, p),
    altPath: twin ? postPath(other, twin) : paths.blog[other],
    active: 'blog',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* İletişim                                                            */
/* ------------------------------------------------------------------ */

export function contactPage(lang) {
  const de = lang === 'de';
  const f = de
    ? { name: 'Name', email: 'E-Mail', phone: 'Telefon (optional)', subject: 'Betreff', message: 'Ihre Nachricht', send: 'Nachricht senden' }
    : { name: 'Ad soyad', email: 'E-posta', phone: 'Telefon (isteğe bağlı)', subject: 'Konu', message: 'Mesajınız', send: 'Mesajı gönder' };
  const body = `
<header class="page-head">
  <div class="wrap page-head-grid">
    <div>
      <h1>${de ? 'Kontakt' : 'İletişim'}</h1>
      <p class="page-lead">${de ? 'Schreiben Sie eine Nachricht oder buchen Sie direkt einen Gesprächstermin.' : 'Mesaj gönderebilir veya doğrudan görüşme randevusu alabilirsiniz.'}</p>
    </div>
    <figure class="portrait page-head-photo"><img src="/img/portre-iletisim.jpg" width="562" height="800" alt="${de ? 'Avukat (Türkei) Sermin Güneş Keçeci an ihrem Schreibtisch' : 'Av. Sermin Güneş Keçeci çalışma masasında'}"></figure>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap contact-layout">
    <div>
      ${contactCards(lang)}
      <div class="aside-book">
        <p class="aside-title">${de ? 'Termin buchen' : 'Randevu'}</p>
        <p>${h(t[lang].bookLead)}</p>
        <a class="btn" href="${paths.booking[lang]}">${h(t[lang].bookCta)}</a>
      </div>
      <div class="contact-card">
        <p class="contact-head">${de ? 'Kammer' : 'Baro kayıtları'}</p>
        <p>İzmir Barosu<br>Rechtsanwaltskammer Düsseldorf, Nr. ${h(L.barDe.memberNo)}</p>
      </div>
    </div>
    <form class="form js-contact" method="post" action="/api/contact" novalidate>
      <h2>${de ? 'Nachricht' : 'Mesaj formu'}</h2>
      <p class="form-warn">${
        de
          ? 'Bitte übermitteln Sie über dieses Formular keine vertraulichen Einzelheiten oder Dokumente. Eine kurze Beschreibung des Anliegens genügt.'
          : 'Lütfen bu formda gizli ayrıntılar veya belgeler paylaşmayın. Konunun kısa bir tanımı yeterlidir.'
      }</p>
      <input type="hidden" name="lang" value="${lang}">
      <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="field"><label for="c-name">${f.name}</label><input id="c-name" name="name" required maxlength="120" autocomplete="name"></div>
      <div class="field-row">
        <div class="field"><label for="c-email">${f.email}</label><input id="c-email" name="email" type="email" required maxlength="160" autocomplete="email"></div>
        <div class="field"><label for="c-phone">${f.phone}</label><input id="c-phone" name="phone" type="tel" maxlength="40" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="c-subject">${f.subject}</label>
        <select id="c-subject" name="subject" required>
          <option value="">${de ? 'Bitte wählen' : 'Seçiniz'}</option>
          ${areas.map((a) => `<option value="${a.key}">${h(a.title[lang])}</option>`).join('')}
          <option value="crossborder">${de ? 'Türkei–Deutschland' : 'Türkiye–Almanya işlemleri'}</option>
          <option value="other">${de ? 'Sonstiges' : 'Diğer'}</option>
        </select>
      </div>
      <div class="field"><label for="c-message">${f.message}</label><textarea id="c-message" name="message" rows="6" required maxlength="3000"></textarea></div>
      <div class="field check"><input id="c-consent" name="consent" type="checkbox" value="1" required>
        <label for="c-consent">${
          de
            ? `Ich habe die <a href="${paths.privacy.de}">Datenschutzerklärung</a> gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage einverstanden.`
            : `<a href="${paths.privacy.tr}">Aydınlatma metnini</a> okudum; bilgilerimin talebimin yanıtlanması amacıyla işlenmesini kabul ediyorum.`
        }</label></div>
      <p class="form-note">${
        de ? 'Durch das Absenden dieses Formulars entsteht kein Mandatsverhältnis.' : 'Bu formun gönderilmesiyle avukat–müvekkil ilişkisi kurulmaz.'
      }</p>
      <button class="btn" type="submit">${f.send}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
  return layout({
    lang,
    title: de ? 'Kontakt' : 'İletişim',
    description: de
      ? 'Kontakt zu Avukat (Türkei) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.'
      : 'Av. Sermin Güneş Keçeci iletişim bilgileri ve iletişim formu. Kaiserswerther Str. 239, 40474 Düsseldorf.',
    path: paths.contact[lang],
    altPath: paths.contact[lang === 'tr' ? 'de' : 'tr'],
    active: 'contact',
    body,
    scripts: ['/js/forms.js'],
  });
}

/* ------------------------------------------------------------------ */
/* Randevu                                                             */
/* ------------------------------------------------------------------ */

export function bookingPage(lang) {
  const de = lang === 'de';
  const B = config.booking;
  const types = B.types.filter((x) => x.enabled);
  const tzLabel = de ? 'deutscher Zeit' : 'Almanya saatine';
  const body = `
<header class="page-head">
  <div class="wrap page-head-grid">
    <div>
      <h1>${de ? 'Termin buchen' : 'Randevu al'}</h1>
      <p class="page-lead">${
        de
          ? `Gespräche dauern etwa ${B.durationMinutes} Minuten. Ihre Anfrage wird geprüft und per E-Mail bestätigt.`
          : `Görüşmeler yaklaşık ${B.durationMinutes} dakika sürer. Randevu talebiniz incelendikten sonra e-posta ile onaylanır.`
      }</p>
    </div>
    <figure class="portrait page-head-photo page-head-photo-sm"><img src="/img/portre-randevu.jpg" width="268" height="503" alt="${de ? 'Avukat (Türkei) Sermin Güneş Keçeci' : 'Av. Sermin Güneş Keçeci'}"></figure>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap">
    <noscript><p class="form-warn">${
      de
        ? 'Für die Terminbuchung wird JavaScript benötigt. Alternativ können Sie uns über das Kontaktformular schreiben.'
        : 'Randevu sistemi için JavaScript gereklidir. Dilerseniz iletişim formunu kullanabilirsiniz.'
    } <a href="${paths.contact[lang]}">${de ? 'Kontakt' : 'İletişim'}</a></p></noscript>
    <form class="booking js-booking" novalidate data-lang="${lang}" data-tz="${h(B.timezone)}" data-tz2="${h(B.secondaryTimezone)}" data-cancel-path="${paths.cancel[lang]}">
      <input type="hidden" name="lang" value="${lang}">
      <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>

      <fieldset class="bk-step" data-step="1">
        <legend><span class="bk-num">1</span>${de ? 'Gesprächsart und Thema' : 'Görüşme türü ve konu'}</legend>
        <div class="choice-grid">
          ${types
            .map(
              (x, i) => `<label class="choice"><input type="radio" name="type" value="${h(x.id)}"${i === 0 ? ' checked' : ''} required>
              <span>${h(x[lang])}</span></label>`,
            )
            .join('')}
        </div>
        <div class="field"><label for="b-topic">${de ? 'Rechtsgebiet' : 'Hukuki konu'}</label>
          <select id="b-topic" name="topic" required>
            <option value="">${de ? 'Bitte wählen' : 'Seçiniz'}</option>
            ${areas.map((a) => `<option value="${a.key}">${h(a.title[lang])}</option>`).join('')}
            <option value="crossborder">${de ? 'Türkei–Deutschland' : 'Türkiye–Almanya işlemleri'}</option>
            <option value="other">${de ? 'Sonstiges' : 'Diğer'}</option>
          </select>
        </div>
      </fieldset>

      <fieldset class="bk-step" data-step="2">
        <legend><span class="bk-num">2</span>${de ? 'Datum und Uhrzeit' : 'Tarih ve saat'}</legend>
        <p class="muted small">${
          de
            ? `Alle Zeiten in ${tzLabel} (Düsseldorf). In Klammern die Uhrzeit in der Türkei.`
            : `Saatler ${tzLabel} (Düsseldorf) göredir. Parantez içinde Türkiye saati yer alır.`
        }</p>
        <div class="bk-picker">
          <div class="cal" aria-live="polite">
            <div class="cal-head">
              <button type="button" class="cal-nav" data-dir="-1" aria-label="${de ? 'Vorheriger Monat' : 'Önceki ay'}">‹</button>
              <p class="cal-month"></p>
              <button type="button" class="cal-nav" data-dir="1" aria-label="${de ? 'Nächster Monat' : 'Sonraki ay'}">›</button>
            </div>
            <div class="cal-grid" role="grid"></div>
          </div>
          <div class="slots">
            <p class="slots-title">${de ? 'Bitte zuerst ein Datum wählen.' : 'Önce bir tarih seçin.'}</p>
            <div class="slot-list" role="radiogroup"></div>
          </div>
        </div>
      </fieldset>

      <fieldset class="bk-step" data-step="3">
        <legend><span class="bk-num">3</span>${de ? 'Ihre Angaben' : 'Bilgileriniz'}</legend>
        <div class="field-row">
          <div class="field"><label for="b-name">${de ? 'Name' : 'Ad soyad'}</label><input id="b-name" name="name" required maxlength="120" autocomplete="name"></div>
          <div class="field"><label for="b-email">${de ? 'E-Mail' : 'E-posta'}</label><input id="b-email" name="email" type="email" required maxlength="160" autocomplete="email"></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="b-phone">${de ? 'Telefon' : 'Telefon'}</label><input id="b-phone" name="phone" type="tel" required maxlength="40" autocomplete="tel"></div>
          <div class="field"><label for="b-language">${de ? 'Gesprächssprache' : 'Görüşme dili'}</label>
            <select id="b-language" name="language"><option value="tr"${de ? '' : ' selected'}>Türkçe</option><option value="de"${de ? ' selected' : ''}>Deutsch</option></select>
          </div>
        </div>
        <div class="field"><label for="b-note">${de ? 'Kurze Beschreibung Ihres Anliegens' : 'Konunun kısa açıklaması'}</label>
          <textarea id="b-note" name="note" rows="4" maxlength="1500" aria-describedby="b-note-hint"></textarea>
          <p id="b-note-hint" class="hint">${
            de
              ? 'Bitte nur eine kurze Beschreibung, keine vertraulichen Einzelheiten.'
              : 'Lütfen yalnızca kısa bir açıklama yazın; gizli ayrıntıları görüşmede paylaşabilirsiniz.'
          }</p>
        </div>
        <div class="field check"><input id="b-consent" name="consent" type="checkbox" value="1" required>
          <label for="b-consent">${
            de
              ? `Ich habe die <a href="${paths.privacy.de}">Datenschutzerklärung</a> gelesen und bin mit der Verarbeitung meiner Angaben zur Terminvereinbarung einverstanden.`
              : `<a href="${paths.privacy.tr}">Aydınlatma metnini</a> okudum; bilgilerimin randevu planlaması amacıyla işlenmesini kabul ediyorum.`
          }</label></div>
      </fieldset>

      <div class="bk-summary" hidden></div>
      <p class="form-note">${
        de
          ? 'Die Terminanfrage begründet noch kein Mandatsverhältnis. Informationen zu Honorar und Ablauf erhalten Sie mit der Terminbestätigung.'
          : 'Randevu talebi avukat–müvekkil ilişkisi kurmaz. Görüşmenin kapsamı ve ücretine ilişkin bilgi, randevu onayıyla birlikte iletilir.'
      }</p>
      <button class="btn" type="submit">${de ? 'Terminanfrage senden' : 'Randevu talebini gönder'}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="booking-done" hidden tabindex="-1"></div>
  </div>
</section>`;
  return layout({
    lang,
    title: de ? 'Termin buchen' : 'Randevu Al',
    description: de
      ? 'Online einen Gesprächstermin mit Avukat (Türkei) Sermin Güneş Keçeci buchen – per Video, Telefon oder persönlich in Düsseldorf.'
      : 'Av. Sermin Güneş Keçeci ile online görüntülü, telefonla veya Düsseldorf’ta yüz yüze görüşme için randevu alın.',
    path: paths.booking[lang],
    altPath: paths.booking[lang === 'tr' ? 'de' : 'tr'],
    active: 'booking',
    body,
    scripts: ['/js/booking.js'],
  });
}

export function cancelPage(lang, appt, state, token) {
  const de = lang === 'de';
  const B = config.booking;
  let inner;
  if (!appt) {
    inner = `<p>${de ? 'Dieser Link ist ungültig oder abgelaufen.' : 'Bu bağlantı geçersiz veya süresi dolmuş.'}</p>`;
  } else {
    const when = new Date(appt.start_utc).toLocaleString(de ? 'de-DE' : 'tr-TR', {
      timeZone: B.timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    });
    if (state === 'done' || appt.status === 'cancelled') {
      inner = `<p class="lead">${de ? 'Der Termin wurde storniert.' : 'Randevu iptal edildi.'}</p>
        <p>${when}</p>
        <a class="btn" href="${paths.booking[lang]}">${de ? 'Neuen Termin buchen' : 'Yeni randevu al'}</a>`;
    } else if (new Date(appt.start_utc) < new Date()) {
      inner = `<p>${de ? 'Dieser Termin liegt in der Vergangenheit.' : 'Bu randevunun tarihi geçmiştir.'}</p>`;
    } else {
      inner = `<p class="lead">${when} ${de ? '(deutsche Zeit)' : '(Almanya saati)'}</p>
        <p>${de ? 'Möchten Sie diesen Termin stornieren?' : 'Bu randevuyu iptal etmek istiyor musunuz?'}</p>
        <form method="post" action="${paths.cancel[lang]}/${h(token)}"><button class="btn" type="submit">${de ? 'Termin stornieren' : 'Randevuyu iptal et'}</button></form>`;
    }
  }
  return layout({
    lang,
    title: de ? 'Termin stornieren' : 'Randevu iptali',
    description: de ? 'Termin stornieren' : 'Randevu iptali',
    path: paths.cancel[lang],
    altPath: null,
    active: 'booking',
    noindex: true,
    body: `<header class="page-head"><div class="wrap"><h1>${de ? 'Termin stornieren' : 'Randevu iptali'}</h1></div></header>
      <section class="section section-tight"><div class="wrap wrap-narrow prose">${inner}</div></section>`,
  });
}

export function notFound(lang) {
  const de = lang === 'de';
  return layout({
    lang,
    title: de ? 'Seite nicht gefunden' : 'Sayfa bulunamadı',
    description: '',
    path: '/404',
    altPath: paths.home[lang === 'tr' ? 'de' : 'tr'],
    noindex: true,
    body: `<header class="page-head"><div class="wrap"><h1>${de ? 'Seite nicht gefunden' : 'Sayfa bulunamadı'}</h1>
      <p class="page-lead">${de ? 'Die aufgerufene Adresse existiert nicht.' : 'Aradığınız adres mevcut değil.'}</p>
      <p><a class="btn" href="${paths.home[lang]}">${de ? 'Zur Startseite' : 'Ana sayfaya dön'}</a></p></div></header>`,
  });
}

export { legalPage, missing };
