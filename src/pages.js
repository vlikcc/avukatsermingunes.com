import config from '../site.config.js';
import { areas } from './content/areas.js';
import { crossBorderTopics, values } from './content/crossborder.js';
import { paths, t, scopeNotice, LANGS, langNames, intlLocale, isForeign, proTitle } from './i18n.js';
import { layout, h, strandsSvg, formatDate, missing, absUrl, asset, attorneyId } from './layout.js';
import { posts, pairOf, markdown, readingMinutes, postUrl, headings, postDates } from './blog.js';
import { legalPage } from './legal.js';
import { findPosts } from './finder.js';
import { KANUNLAR, maddeList, maddeUrl, maddeTitle, maddeLabel, kanunUrl, neighbours } from './kanunlar.js';
import { areaIcon } from './icons.js';

const L = config.lawyer;
const C = config.contact;
const areaPath = (lang, a) => `${paths.areas[lang]}/${a.slug[lang]}`;
const allLangs = (fn) => Object.fromEntries(LANGS.map((l) => [l, fn(l)]));

// Dile göre metin seçici: const T = pick(lang); T({ tr: '…', de: '…', en: '…', nl: '…' })
const pick = (lang) => (o) => o[lang];

const fmtFull = (iso, lang) => formatDate(iso, lang);

// Kariyer zaman çizelgesi (gerçek bir sıra olduğu için numaralı/sıralı gösterilir).
const timeline = (lang) =>
  pick(lang)({
    tr: [
      ['2016', 'Dokuz Eylül Üniversitesi Hukuk Fakültesinden mezuniyet'],
      ['30.01.2018', 'Avukatlık ruhsatı, İzmir Barosu'],
      ['2018', 'Güneş Hukuk Bürosunun İzmir’de kuruluşu'],
      ['31.10.2024', 'Rechtsanwaltskammer Düsseldorf kaydı, § 206 BRAO'],
    ],
    de: [
      ['2016', 'Abschluss an der Juristischen Fakultät der Dokuz-Eylül-Universität'],
      ['30.01.2018', 'Anwaltszulassung, İzmir Barosu'],
      ['2018', 'Gründung von Güneş Hukuk Bürosu in İzmir'],
      ['31.10.2024', 'Aufnahme in die Rechtsanwaltskammer Düsseldorf nach § 206 BRAO'],
    ],
    en: [
      ['2016', 'Graduated from the Faculty of Law, Dokuz Eylül University'],
      ['30.01.2018', 'Admitted to practise, İzmir Barosu'],
      ['2018', 'Founded Güneş Hukuk Bürosu in İzmir'],
      ['31.10.2024', 'Admitted to the Rechtsanwaltskammer Düsseldorf under § 206 BRAO'],
    ],
    nl: [
      ['2016', 'Afgestudeerd aan de Juridische Faculteit van de Dokuz Eylül Universiteit'],
      ['30.01.2018', 'Toegelaten als advocaat, İzmir Barosu'],
      ['2018', 'Oprichting van Güneş Hukuk Bürosu in İzmir'],
      ['31.10.2024', 'Toegelaten tot de Rechtsanwaltskammer Düsseldorf op grond van § 206 BRAO'],
    ],
  });

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

function scopeBox(lang, cls = '') {
  const T = pick(lang);
  return `<aside class="scope ${cls}" aria-label="${T({ tr: 'Mesleki unvan açıklaması', de: 'Hinweis zur Berufsbezeichnung', en: 'Note on professional title', nl: 'Toelichting beroepstitel' })}">
  <p class="scope-head">${T({
    tr: 'Almanya’daki mesleki unvan ve faaliyet kapsamı',
    de: 'Berufsbezeichnung und Tätigkeitsumfang in Deutschland',
    en: 'Professional title and scope of practice in Germany',
    nl: 'Beroepstitel en reikwijdte van de praktijk in Duitsland',
  })}</p>
  <p>${h(scopeNotice[lang])}</p>
</aside>`;
}

// Fotoğrafların alternatif metni: yabancı dillerde unvan o dilin biçimiyle yazılır.
const portraitAlt = (lang) => (isForeign(lang) ? `${proTitle[lang]} ${L.name}` : `Av. ${L.name}`);

const topicOptions = (lang) => {
  const T = pick(lang);
  return `<option value="">${T({ tr: 'Seçiniz', de: 'Bitte wählen', en: 'Please select', nl: 'Maak een keuze' })}</option>
    ${areas.map((a) => `<option value="${a.key}">${h(a.title[lang])}</option>`).join('')}
    <option value="crossborder">${T({ tr: 'Türkiye–Almanya işlemleri', de: 'Türkei–Deutschland', en: 'Türkiye–Germany', nl: 'Turkije–Duitsland' })}</option>
    <option value="other">${T({ tr: 'Diğer', de: 'Sonstiges', en: 'Other', nl: 'Overig' })}</option>`;
};

function bookingBand(lang) {
  const T = pick(lang);
  const steps = T({
    tr: ['Görüşme türünü ve konuyu seçin', 'Uygun bir tarih ve saat belirleyin', 'Bilgilerinizi iletin; onay e-posta ile bildirilir'],
    de: ['Gesprächsart und Thema wählen', 'Freien Termin auswählen', 'Kontaktdaten angeben; die Bestätigung erhalten Sie per E-Mail'],
    en: ['Choose the type of consultation and topic', 'Select an available time', 'Enter your details; confirmation will be sent by email'],
    nl: ['Kies het soort gesprek en het onderwerp', 'Kies een beschikbaar tijdstip', 'Vul uw gegevens in; de bevestiging ontvangt u per e-mail'],
  });
  return `<section class="band band-booking" aria-labelledby="bb-title">
    <div class="wrap band-booking-inner">
      <div>
        <h2 id="bb-title">${T({ tr: 'Görüşme randevusu', de: 'Gesprächstermin vereinbaren', en: 'Arrange a consultation', nl: 'Een gesprek inplannen' })}</h2>
        <p>${T({
          tr: 'Görüşmeler online görüntülü, telefonla veya Düsseldorf’ta yüz yüze yapılabilir. Saatler Almanya ve Türkiye saatiyle birlikte gösterilir.',
          de: 'Termine finden online per Video, telefonisch oder persönlich in Düsseldorf statt; die Gespräche werden auf Türkisch geführt. Die Uhrzeiten werden in deutscher und türkischer Zeit angezeigt.',
          en: 'Consultations take place online by video, by telephone or in person in Düsseldorf and are held in Turkish. Times are shown in both German and Turkish time.',
          nl: 'Gesprekken vinden online via video, telefonisch of persoonlijk in Düsseldorf plaats en worden in het Turks gevoerd. De tijden worden in Duitse en Turkse tijd weergegeven.',
        })}</p>
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
  const T = pick(lang);
  const body = `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <h1><span class="h1-pre">${h(proTitle[lang])}</span>${h(L.name)} <span class="h1-note">${T({
        tr: 'Almanya’da yaşayanlar için Türk hukuku',
        de: 'Türkisches Recht in Düsseldorf',
        en: 'Turkish law in Düsseldorf',
        nl: 'Turks recht in Düsseldorf',
      })}</span></h1>
      <p class="hero-bars">İzmir Barosu <span aria-hidden="true">|</span> Rechtsanwaltskammer Düsseldorf</p>
      <p class="hero-lead">${T({
        tr: 'Türkiye ve Almanya bağlantılı hukuki süreçlerde avukatlık ve danışmanlık hizmetleri',
        de: 'Beratung und Vertretung im türkischen Recht bei Angelegenheiten mit Bezug zur Türkei und zu Deutschland',
        en: 'Advice and representation under Turkish law in matters connected with Türkiye and Germany',
        nl: 'Advies en vertegenwoordiging naar Turks recht in zaken met een band met Turkije en Duitsland',
      })}</p>
      <div class="hero-actions">
        <a class="btn" href="${paths.booking[lang]}">${h(t[lang].bookCta)}</a>
        <a class="link-quiet" href="${paths.areas[lang]}">${T({ tr: 'Çalışma alanlarını inceleyin', de: 'Rechtsgebiete ansehen', en: 'View practice areas', nl: 'Bekijk de rechtsgebieden' })}</a>
      </div>
    </div>
    <figure class="hero-figure portrait portrait-arch">
      <img src="${asset('/img/portre-ana.webp')}" width="689" height="900" alt="${h(portraitAlt(lang))}" fetchpriority="high">
      <img class="hero-badge" src="${asset('/img/logo-176.webp')}" width="176" height="159" alt="">
    </figure>
  </div>
  <div class="wrap">${timelineBlock(lang, 'timeline-hero')}</div>
</section>

<section class="section about-short" aria-labelledby="about-title">
  <div class="wrap split">
    <h2 id="about-title">${T({ tr: 'Hakkımda', de: 'Zur Person', en: 'About me', nl: 'Over mij' })}</h2>
    <div class="prose">
      <p class="lead">${T({
        tr: '2018 yılından bu yana İzmir Barosuna kayıtlı avukat olarak çalışıyorum. Aynı yıl İzmir’de Güneş Hukuk Bürosunu kurdum.',
        de: 'Seit 2018 bin ich in der Türkei als Avukat zugelassen und Mitglied der Rechtsanwaltskammer İzmir. Im selben Jahr habe ich in İzmir die Kanzlei Güneş Hukuk Bürosu gegründet.',
        en: 'I have been admitted as a lawyer (Avukat) in Türkiye and a member of the İzmir Bar since 2018. In the same year I founded the law firm Güneş Hukuk Bürosu in İzmir.',
        nl: 'Sinds 2018 ben ik in Turkije toegelaten als advocaat (Avukat) en lid van de Orde van Advocaten in İzmir. In datzelfde jaar heb ik in İzmir het advocatenkantoor Güneş Hukuk Bürosu opgericht.',
      })}</p>
      <p>${T({
        tr: '31 Ekim 2024’ten bu yana § 206 BRAO kapsamında Rechtsanwaltskammer Düsseldorf’a da kayıtlıyım. Türkiye’deki uyuşmazlıkların yanı sıra Almanya’da yaşayan Türk vatandaşlarının Türkiye’deki hukuki işlemleriyle ilgileniyorum.',
        de: 'Seit dem 31. Oktober 2024 bin ich gemäß § 206 BRAO auch Mitglied der Rechtsanwaltskammer Düsseldorf. In Deutschland betreue ich vor allem türkische Rechtsangelegenheiten von Menschen, die hier leben.',
        en: 'Since 31 October 2024 I have also been a member of the Rechtsanwaltskammer Düsseldorf under § 206 BRAO. From Germany I mainly assist people living outside Türkiye with their legal matters in Türkiye.',
        nl: 'Sinds 31 oktober 2024 ben ik op grond van § 206 BRAO ook lid van de Rechtsanwaltskammer Düsseldorf. Vanuit Duitsland sta ik vooral mensen bij die buiten Turkije wonen en juridische zaken in Turkije hebben.',
      })}</p>
      <p><a class="link-arrow" href="${paths.about[lang]}">${T({ tr: 'Mesleki geçmiş ve baro kayıtları', de: 'Werdegang und Zulassungen', en: 'Career and bar admissions', nl: 'Loopbaan en toelatingen' })}</a></p>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="areas-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="areas-title">${T({ tr: 'Hukuki çalışma alanları', de: 'Rechtsgebiete', en: 'Practice areas', nl: 'Rechtsgebieden' })}</h2>
      <p>${T({
        tr: 'Özel hukuk ve kamu hukukunun çeşitli alanlarında dava takibi ve danışmanlık.',
        de: 'Beratung und Vertretung nach türkischem Recht.',
        en: 'Advice and representation under Turkish law.',
        nl: 'Advies en vertegenwoordiging naar Turks recht.',
      })}</p>
    </div>
    ${areaIndex(lang)}
  </div>
</section>

<section class="section section-green" aria-labelledby="cb-title">
  <div class="wrap split split-wide">
    <div>
      <h2 id="cb-title">${T({ tr: 'Türkiye–Almanya hukuki işlemler', de: 'Türkei–Deutschland', en: 'Türkiye–Germany', nl: 'Turkije–Duitsland' })}</h2>
      <p class="lead">${T({
        tr: 'Almanya’da yaşayan pek çok kişinin Türkiye’de süren bir boşanma, miras, taşınmaz veya dava süreci bulunmaktadır.',
        de: 'Viele in Deutschland lebende Menschen haben Rechtsangelegenheiten in der Türkei: eine Scheidung, ein Nachlass, ein Grundstück oder ein laufendes Verfahren.',
        en: 'Many people living in Germany or elsewhere in Europe have legal matters in Türkiye: a divorce, an estate, a property or ongoing proceedings.',
        nl: 'Veel mensen die in Duitsland, Nederland of elders in Europa wonen, hebben juridische zaken in Turkije: een echtscheiding, een nalatenschap, onroerend goed of een lopende procedure.',
      })}</p>
      <p>${T({
        tr: 'Bu süreçler, her aşama için Türkiye’ye gitmenizi gerektirmeden Düsseldorf’tan takip edilebilir.',
        de: 'Diese Angelegenheiten lassen sich von Düsseldorf aus begleiten, ohne dass Sie für jeden Schritt in die Türkei reisen müssen.',
        en: 'These matters can be handled from Düsseldorf, without you having to travel to Türkiye for every step.',
        nl: 'Deze zaken kunnen vanuit Düsseldorf worden begeleid, zonder dat u voor elke stap naar Turkije hoeft te reizen.',
      })}</p>
      <a class="link-arrow on-dark" href="${paths.crossborder[lang]}">${T({ tr: 'Tüm başlıkları inceleyin', de: 'Alle Themen im Überblick', en: 'All topics at a glance', nl: 'Alle onderwerpen op een rij' })}</a>
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
      <h2 id="values-title">${T({ tr: 'Mesleki yaklaşım', de: 'Berufliches Selbstverständnis', en: 'Professional principles', nl: 'Beroepsopvatting' })}</h2>
    </div>
    ${valuesGrid(lang)}
  </div>
</section>

${bookingBand(lang)}

<section class="section" aria-labelledby="contact-title">
  <div class="wrap split">
    <h2 id="contact-title">${h(t[lang].nav.contact)}</h2>
    <div class="contact-short">
      ${contactCards(lang)}
      <p><a class="link-arrow" href="${paths.contact[lang]}">${T({ tr: 'Mesaj gönderin', de: 'Nachricht senden', en: 'Send a message', nl: 'Stuur een bericht' })}</a></p>
    </div>
  </div>
</section>`;

  return layout({
    lang,
    fullTitle: T({
      tr: 'Av. Sermin Güneş Keçeci | Türkiye–Almanya Hukuki İşlemler',
      de: 'Türkisches Recht in Düsseldorf | Avukat Sermin Güneş Keçeci',
      en: 'Turkish Lawyer in Düsseldorf | Sermin Güneş Keçeci',
      nl: 'Turks recht in Düsseldorf | Avukat Sermin Güneş Keçeci',
    }),
    attorney: true,
    description: T({
      tr: 'Av. Sermin Güneş Keçeci – İzmir Barosu ve Rechtsanwaltskammer Düsseldorf. Türkiye ve Almanya bağlantılı boşanma, miras, gayrimenkul ve tanıma-tenfiz süreçleri.',
      de: 'Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf: Beratung im türkischen Recht – Scheidung, Erbschaft, Immobilien und Anerkennung deutscher Urteile in der Türkei.',
      en: 'Avukat (Turkey) Sermin Güneş Keçeci, Düsseldorf: advice under Turkish law – divorce, inheritance, real estate and recognition of foreign judgments in Türkiye.',
      nl: 'Avukat (Turkije) Sermin Güneş Keçeci, Düsseldorf: advies naar Turks recht – echtscheiding, erfrecht, vastgoed en erkenning van buitenlandse vonnissen in Turkije.',
    }),
    path: paths.home[lang],
    alt: paths.home,
    active: 'home',
    body,
  });
}

function areaIndex(lang) {
  return `<ul class="area-index">
    ${areas
      .map(
        (a) => `<li><a href="${areaPath(lang, a)}">
          <span class="area-icon">${areaIcon(a.key)}</span>
          <span class="area-text">
            <span class="area-name">${h(a.title[lang])}</span>
            <span class="area-sum">${h(a.summary[lang])}</span>
          </span>
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
  const T = pick(lang);
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
  if (C.phoneDe)
    direct.push(`<a href="tel:${h(C.phoneDe.replace(/\s/g, ''))}">${h(C.phoneDe)}</a> <span class="muted">(${T({ tr: 'Almanya', de: 'Deutschland', en: 'Germany', nl: 'Duitsland' })})</span>`);
  if (C.phoneTr)
    direct.push(`<a href="tel:${h(C.phoneTr.replace(/\s/g, ''))}">${h(C.phoneTr)}</a> <span class="muted">(${T({ tr: 'Türkiye', de: 'Türkei', en: 'Türkiye', nl: 'Turkije' })})</span>`);
  if (direct.length) {
    lines.push(`<div class="contact-card"><p class="contact-head">${T({ tr: 'Doğrudan', de: 'Direkt', en: 'Direct', nl: 'Direct' })}</p><p>${direct.join('<br>')}</p></div>`);
  }
  return `<div class="contact-cards">${lines.join('')}</div>`;
}

/* ------------------------------------------------------------------ */
/* Hakkımda                                                            */
/* ------------------------------------------------------------------ */

export function about(lang) {
  const T = pick(lang);
  const facts = T({
    tr: [
      ['Mesleki unvan', 'Avukat'],
      ['Türkiye’deki baro', 'İzmir Barosu — ruhsat tarihi 30.01.2018'],
      ['Almanya’daki baro', `Rechtsanwaltskammer Düsseldorf — üyelik no. ${L.barDe.memberNo}`],
      ['Almanya’daki statü', '§ 206 BRAO kapsamında kayıtlı Türk avukat, “Avukat (Türkei)” — kayıt tarihi 31.10.2024'],
      ['Hukuk bürosu', 'Güneş Hukuk Bürosu, İzmir (kuruluş 2018)'],
      ['Eğitim', 'Dokuz Eylül Üniversitesi Hukuk Fakültesi, 2016'],
      ['Diller', 'Türkçe, Almanca'],
    ],
    de: [
      ['Berufsbezeichnung', 'Avukat (Türkei) — verliehen in der Türkei'],
      ['Zulassung in der Türkei', 'İzmir Barosu, seit 30.01.2018'],
      ['Kammer in Deutschland', `Rechtsanwaltskammer Düsseldorf, Mitgliedsnummer ${L.barDe.memberNo}`],
      ['Aufnahme in Deutschland', '31.10.2024, gemäß § 206 BRAO'],
      ['Kanzlei in der Türkei', 'Güneş Hukuk Bürosu, İzmir (gegründet 2018)'],
      ['Studium', 'Juristische Fakultät der Dokuz-Eylül-Universität, Abschluss 2016'],
      ['Sprachen', 'Türkisch, Deutsch'],
    ],
    en: [
      ['Professional title', 'Avukat (Türkei) — conferred in Türkiye'],
      ['Admission in Türkiye', 'İzmir Barosu, since 30.01.2018'],
      ['Bar in Germany', `Rechtsanwaltskammer Düsseldorf, membership no. ${L.barDe.memberNo}`],
      ['Admission in Germany', '31.10.2024, under § 206 BRAO'],
      ['Law firm in Türkiye', 'Güneş Hukuk Bürosu, İzmir (founded 2018)'],
      ['Education', 'Faculty of Law, Dokuz Eylül University, graduated 2016'],
      ['Languages', 'Turkish, German'],
    ],
    nl: [
      ['Beroepstitel', 'Avukat (Türkei) — verleend in Turkije'],
      ['Toelating in Turkije', 'İzmir Barosu, sinds 30.01.2018'],
      ['Orde in Duitsland', `Rechtsanwaltskammer Düsseldorf, lidmaatschapsnummer ${L.barDe.memberNo}`],
      ['Toelating in Duitsland', '31.10.2024, op grond van § 206 BRAO'],
      ['Kantoor in Turkije', 'Güneş Hukuk Bürosu, İzmir (opgericht 2018)'],
      ['Opleiding', 'Juridische Faculteit van de Dokuz Eylül Universiteit, afgestudeerd 2016'],
      ['Talen', 'Turks, Duits'],
    ],
  });

  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${T({ tr: 'Hakkımda', de: 'Über mich', en: 'About me', nl: 'Over mij' })}</h1>
    <p class="page-lead">${T({
      tr: 'Av. Sermin Güneş Keçeci — eğitim, mesleki geçmiş ve baro kayıtları.',
      de: 'Avukat (Türkei) Sermin Güneş Keçeci — Werdegang, Zulassungen und Arbeitsweise.',
      en: 'Avukat (Turkey) Sermin Güneş Keçeci — career, bar admissions and approach.',
      nl: 'Avukat (Turkije) Sermin Güneş Keçeci — loopbaan, toelatingen en werkwijze.',
    })}</p>
  </div>
</header>

<section class="section section-tight">
  <div class="wrap split">
    <figure class="about-figure portrait"><img src="${asset('/img/portre-hakkimda.webp')}" width="591" height="514" alt="${h(portraitAlt(lang))}" loading="lazy"></figure>
    <div class="prose">
      ${T({
        tr: `<p class="lead">2016 yılında Dokuz Eylül Üniversitesi Hukuk Fakültesinden mezun oldum.</p>
      <p>Avukatlık stajımı İzmir Barosu bünyesinde tamamladım ve 30 Ocak 2018 tarihinde avukatlık ruhsatımı aldım. Aynı yıl İzmir’de Güneş Hukuk Bürosunu kurarak bağımsız avukatlık faaliyetlerime başladım.</p>
      <p>Meslek hayatım boyunca aile hukuku, ceza hukuku, miras hukuku, gayrimenkul hukuku, iş hukuku, icra ve iflas hukuku, tazminat hukuku ve sözleşmeler hukuku başta olmak üzere özel hukukun ve kamu hukukunun çeşitli alanlarında çalıştım.</p>
      <p>31 Ekim 2024 tarihinde Almanya’da Düsseldorf Barosuna (Rechtsanwaltskammer Düsseldorf) § 206 BRAO kapsamında kaydolarak mesleki faaliyetlerimi uluslararası boyuta taşıdım. Bugün Türkiye’deki hukuki uyuşmazlıkların yanı sıra Almanya’da yaşayan Türk vatandaşlarının Türkiye’deki hukuki işlemleriyle ve yabancılık unsuru taşıyan uyuşmazlıklarla ilgileniyorum.</p>
      <p>Mesleki yaklaşımımda hukuki titizliği, müvekkil haklarının korunmasını, şeffaf iletişimi ve her uyuşmazlığın kendine özgü koşullarıyla değerlendirilmesini ön planda tutuyorum.</p>`,
        de: `<p class="lead">2016 habe ich mein Studium an der Juristischen Fakultät der Dokuz-Eylül-Universität in İzmir abgeschlossen.</p>
      <p>Nach dem Referendariat (staj) bei der Rechtsanwaltskammer İzmir erhielt ich am 30. Januar 2018 meine Anwaltszulassung. Im selben Jahr gründete ich in İzmir die Kanzlei Güneş Hukuk Bürosu und bin seitdem selbstständig als Avukat tätig.</p>
      <p>In meiner beruflichen Tätigkeit habe ich in zahlreichen Bereichen des Privatrechts und des öffentlichen Rechts gearbeitet, insbesondere im Familien-, Straf-, Erb-, Immobilien-, Arbeits-, Vollstreckungs-, Schadensersatz- und Vertragsrecht.</p>
      <p>Am 31. Oktober 2024 wurde ich gemäß § 206 BRAO in die Rechtsanwaltskammer Düsseldorf aufgenommen. Seitdem berate ich von Düsseldorf aus vor allem Menschen, die in Deutschland leben, in ihren Rechtsangelegenheiten in der Türkei sowie in Fällen mit Auslandsbezug nach türkischem Recht.</p>
      <p>Im Mittelpunkt meiner Arbeit stehen juristische Sorgfalt, der Schutz der Rechte meiner Mandantinnen und Mandanten, eine offene Kommunikation und die Prüfung jedes Falls unter seinen besonderen Umständen.</p>`,
        en: `<p class="lead">In 2016 I graduated from the Faculty of Law at Dokuz Eylül University in İzmir.</p>
      <p>After completing my legal traineeship (staj) at the İzmir Bar, I was admitted to practise on 30 January 2018. In the same year I founded the law firm Güneş Hukuk Bürosu in İzmir and have practised independently as an Avukat ever since.</p>
      <p>Throughout my career I have worked in many areas of private and public law, in particular family, criminal, inheritance, real estate, employment, enforcement, compensation and contract law.</p>
      <p>On 31 October 2024 I was admitted to the Rechtsanwaltskammer Düsseldorf under § 206 BRAO. Since then, working from Düsseldorf, I have mainly advised people living outside Türkiye on their legal matters in Türkiye and on cases with an international element under Turkish law.</p>
      <p>My work is guided by legal diligence, the protection of my clients’ rights, open communication and the assessment of each case in light of its particular circumstances.</p>`,
        nl: `<p class="lead">In 2016 ben ik afgestudeerd aan de Juridische Faculteit van de Dokuz Eylül Universiteit in İzmir.</p>
      <p>Na mijn stage (staj) bij de Orde van Advocaten in İzmir ben ik op 30 januari 2018 als advocaat toegelaten. In datzelfde jaar heb ik in İzmir het advocatenkantoor Güneş Hukuk Bürosu opgericht; sindsdien ben ik zelfstandig werkzaam als Avukat.</p>
      <p>In mijn loopbaan heb ik op uiteenlopende terreinen van het privaatrecht en het publiekrecht gewerkt, met name familierecht, strafrecht, erfrecht, vastgoedrecht, arbeidsrecht, executierecht, schadevergoedingsrecht en contractenrecht.</p>
      <p>Op 31 oktober 2024 ben ik op grond van § 206 BRAO toegelaten tot de Rechtsanwaltskammer Düsseldorf. Sindsdien adviseer ik vanuit Düsseldorf vooral mensen die buiten Turkije wonen over hun juridische zaken in Turkije en over zaken met een internationaal element naar Turks recht.</p>
      <p>Centraal in mijn werk staan juridische zorgvuldigheid, de bescherming van de rechten van mijn cliënten, open communicatie en de beoordeling van elke zaak in het licht van de bijzondere omstandigheden.</p>`,
      })}
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="tl-title">
  <div class="wrap">
    <h2 id="tl-title">${T({ tr: 'Mesleki geçmiş', de: 'Werdegang', en: 'Career', nl: 'Loopbaan' })}</h2>
    ${timelineBlock(lang)}
  </div>
</section>

<section class="section" aria-labelledby="facts-title">
  <div class="wrap split">
    <h2 id="facts-title">${T({ tr: 'Baro kayıtları ve bilgiler', de: 'Zulassungen und Angaben', en: 'Bar admissions and details', nl: 'Toelatingen en gegevens' })}</h2>
    <div>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${h(k)}</dt><dd>${h(v)}</dd></div>`).join('')}</dl>
      ${scopeBox(lang)}
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="values-title">
  <div class="wrap">
    <div class="section-head"><h2 id="values-title">${T({ tr: 'Mesleki değerler', de: 'Berufliches Selbstverständnis', en: 'Professional principles', nl: 'Beroepsopvatting' })}</h2></div>
    ${valuesGrid(lang)}
  </div>
</section>

${bookingBand(lang)}`;

  return layout({
    lang,
    title: T({ tr: 'Hakkımda', de: 'Über mich', en: 'About me', nl: 'Over mij' }),
    description: T({
      tr: 'Av. Sermin Güneş Keçeci: Dokuz Eylül Üniversitesi Hukuk Fakültesi, 2018’den beri İzmir Barosu, Güneş Hukuk Bürosu ve § 206 BRAO kapsamında Düsseldorf Barosu kaydı.',
      de: 'Werdegang von Avukat (Türkei) Sermin Güneş Keçeci: Studium in İzmir, Zulassung 2018, Güneş Hukuk Bürosu und Mitgliedschaft in der Rechtsanwaltskammer Düsseldorf nach § 206 BRAO.',
      en: 'Career of Avukat (Turkey) Sermin Güneş Keçeci: law degree in İzmir, admitted in 2018, Güneş Hukuk Bürosu and membership of the Rechtsanwaltskammer Düsseldorf under § 206 BRAO.',
      nl: 'Loopbaan van Avukat (Turkije) Sermin Güneş Keçeci: rechtenstudie in İzmir, toegelaten in 2018, Güneş Hukuk Bürosu en lidmaatschap van de Rechtsanwaltskammer Düsseldorf op grond van § 206 BRAO.',
    }),
    path: paths.about[lang],
    alt: paths.about,
    attorney: true,
    active: 'about',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Çalışma alanları                                                    */
/* ------------------------------------------------------------------ */

export function areasPage(lang) {
  const T = pick(lang);
  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${h(t[lang].nav.areas)}</h1>
    <p class="page-lead">${T({
      tr: 'Dava takibi ve hukuki danışmanlık verilen alanlar. Ayrıntılar için ilgili alanı seçin.',
      de: 'Beratung und Vertretung im türkischen Recht. Wählen Sie ein Rechtsgebiet, um mehr über die jeweiligen Themen zu erfahren.',
      en: 'Advice and representation under Turkish law. Select a practice area to learn more about the topics it covers.',
      nl: 'Advies en vertegenwoordiging naar Turks recht. Kies een rechtsgebied voor meer informatie over de onderwerpen.',
    })}</p>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap">${areaIndex(lang)}</div>
</section>
${isForeign(lang) ? `<section class="section section-tight"><div class="wrap">${scopeBox(lang)}</div></section>` : ''}
${bookingBand(lang)}`;
  return layout({
    lang,
    title: t[lang].nav.areas,
    description: T({
      tr: 'Aile, miras, gayrimenkul, ceza, iş, icra ve iflas, tazminat, ticaret ve sözleşmeler, tüketici hukuku ve milletlerarası özel hukuk alanlarında avukatlık hizmetleri.',
      de: 'Rechtsgebiete im türkischen Recht: Familienrecht, Erbrecht, Immobilienrecht, Strafrecht, Arbeitsrecht, Vollstreckung, Schadensersatz, Vertragsrecht, Verbraucherrecht und IPR.',
      en: 'Practice areas under Turkish law: family, inheritance, real estate, criminal, employment, enforcement, compensation, contract and consumer law, and private international law.',
      nl: 'Rechtsgebieden naar Turks recht: familierecht, erfrecht, vastgoedrecht, strafrecht, arbeidsrecht, executie, schadevergoeding, contractenrecht, consumentenrecht en internationaal privaatrecht.',
    }),
    path: paths.areas[lang],
    alt: paths.areas,
    active: 'areas',
    body,
  });
}

export function areaPage(lang, a) {
  const T = pick(lang);
  const foreign = isForeign(lang);
  const lawNote = T({ tr: '', de: 'nach türkischem Recht', en: 'under Turkish law', nl: 'naar Turks recht' });
  const body = `
<header class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="${T({ tr: 'Sayfa yolu', de: 'Brotkrumen', en: 'Breadcrumb', nl: 'Kruimelpad' })}"><a href="${paths.areas[lang]}">${h(t[lang].nav.areas)}</a></nav>
    <h1>${h(a.title[lang])}${lawNote ? ` <span class="h1-note">${lawNote}</span>` : ''}</h1>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap area-layout">
    <div class="prose">
      ${a.intro[lang].map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${h(p)}</p>`).join('')}
      <h2>${T({ tr: 'Başlıca konular', de: 'Themen', en: 'Topics', nl: 'Onderwerpen' })}</h2>
      <ul class="topic-list">${a.items[lang].map((x) => `<li>${h(x)}</li>`).join('')}</ul>
      ${
        a.crossBorder
          ? `<div class="note"><h2>${T({ tr: 'Almanya bağlantılı durumlar', de: 'Bezug zu Deutschland', en: 'Cases involving Germany', nl: 'Zaken met een band met Duitsland' })}</h2><p>${h(a.crossBorder[lang])}</p>
             <p><a class="link-arrow" href="${paths.crossborder[lang]}">${T({ tr: 'Türkiye–Almanya hukuki işlemler', de: 'Türkei–Deutschland', en: 'Türkiye–Germany', nl: 'Turkije–Duitsland' })}</a></p></div>`
          : ''
      }
      <p class="muted small">${T({
        tr: 'Bu sayfa genel bilgi verir. Somut durumunuzda nasıl bir yol izlenebileceği, ancak belgelerin incelenmesinden sonra değerlendirilebilir.',
        de: 'Diese Seite gibt einen allgemeinen Überblick. Ob und wie in Ihrem Fall vorgegangen werden kann, lässt sich erst nach Prüfung der Unterlagen beurteilen.',
        en: 'This page provides a general overview. Whether and how your case can be pursued can only be assessed after reviewing the documents.',
        nl: 'Deze pagina geeft een algemeen overzicht. Of en hoe in uw zaak kan worden opgetreden, kan pas na bestudering van de stukken worden beoordeeld.',
      })}</p>
      ${foreign ? scopeBox(lang) : ''}
    </div>
    <aside class="area-aside">
      <div class="aside-book">
        <p class="aside-title">${T({ tr: 'Görüşme planlayın', de: 'Gespräch vereinbaren', en: 'Arrange a consultation', nl: 'Gesprek inplannen' })}</p>
        <p>${h(t[lang].bookLead)}</p>
        <a class="btn" href="${paths.booking[lang]}?konu=${a.key}">${h(t[lang].bookCta)}</a>
      </div>
      <nav aria-label="${T({ tr: 'Diğer çalışma alanları', de: 'Weitere Rechtsgebiete', en: 'Other practice areas', nl: 'Andere rechtsgebieden' })}">
        <p class="aside-title">${T({ tr: 'Diğer alanlar', de: 'Weitere Rechtsgebiete', en: 'Other practice areas', nl: 'Andere rechtsgebieden' })}</p>
        <ul class="aside-list">${areas
          .filter((x) => x !== a)
          .map((x) => `<li><a href="${areaPath(lang, x)}">${h(x.title[lang])}</a></li>`)
          .join('')}</ul>
      </nav>
    </aside>
  </div>
</section>`;
  const title = a.title[lang];
  const items = a.items[lang].slice(0, 3).join(', ');
  return layout({
    lang,
    title: T({ tr: title, de: `${title} (türkisches Recht)`, en: `${title} (Turkish law)`, nl: `${title} (Turks recht)` }),
    description: T({
      tr: `${title}: ${items}. Av. Sermin Güneş Keçeci, İzmir ve Düsseldorf.`,
      de: `${title} nach türkischem Recht: ${items}. Düsseldorf und İzmir.`,
      en: `${title} under Turkish law: ${items}. Düsseldorf and İzmir.`,
      nl: `${title} naar Turks recht: ${items}. Düsseldorf en İzmir.`,
    }),
    path: areaPath(lang, a),
    alt: allLangs((l) => areaPath(l, a)),
    active: 'areas',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: title,
        serviceType: title,
        description: a.summary[lang],
        url: absUrl(areaPath(lang, a)),
        inLanguage: lang,
        provider: { '@type': 'Attorney', '@id': attorneyId(), name: `${proTitle[lang]} ${L.name}` },
        areaServed: [
          { '@type': 'Country', name: 'Türkiye' },
          { '@type': 'Country', name: 'Germany' },
        ],
      },
      breadcrumbs(lang, [[t[lang].nav.areas, paths.areas[lang]], [title, areaPath(lang, a)]]),
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Türkiye–Almanya                                                     */
/* ------------------------------------------------------------------ */

export function crossborderPage(lang) {
  const T = pick(lang);
  const related = posts(lang);
  const postFor = (key) => related.find((p) => p.pair === key);
  const body = `
<header class="page-head page-head-green">
  <div class="wrap">
    <h1>${T({ tr: 'Türkiye–Almanya hukuki işlemler', de: 'Türkei–Deutschland', en: 'Türkiye–Germany', nl: 'Turkije–Duitsland' })}</h1>
    <p class="page-lead">${T({
      tr: 'Almanya’da yaşayanların Türkiye’deki hukuki işlemleri: boşanma, tanıma, miras, taşınmaz ve süren davalar.',
      de: 'Rechtsangelegenheiten in der Türkei für Menschen, die in Deutschland leben: Scheidung, Anerkennung, Erbschaft, Immobilien und laufende Verfahren.',
      en: 'Legal matters in Türkiye for people living in Germany and elsewhere in Europe: divorce, recognition, inheritance, real estate and ongoing proceedings.',
      nl: 'Juridische zaken in Turkije voor mensen die in Duitsland, Nederland of elders in Europa wonen: echtscheiding, erkenning, erfrecht, vastgoed en lopende procedures.',
    })}</p>
  </div>
  ${strandsSvg('page-head-strands')}
</header>

<section class="section section-tight">
  <div class="wrap split">
    <h2>${T({ tr: 'Bu bölüm kimler için?', de: 'Worum es geht', en: 'What this is about', nl: 'Waar het om gaat' })}</h2>
    <div class="prose">
      <p class="lead">${T({
        tr: 'Almanya’da yaşayan pek çok Türk vatandaşının vatandaşlık, aile, taşınmaz veya miras yoluyla Türkiye ile hukuki bağı devam etmektedir.',
        de: 'Wer in Deutschland lebt, hat oft weiterhin rechtliche Verbindungen in die Türkei – über die Staatsangehörigkeit, Familie, Grundstücke oder einen Nachlass.',
        en: 'People living abroad often keep legal ties to Türkiye – through citizenship, family, property or an estate.',
        nl: 'Wie in het buitenland woont, heeft vaak nog juridische banden met Turkije – via de nationaliteit, familie, onroerend goed of een nalatenschap.',
      })}</p>
      <p>${T({
        tr: 'Almanya’da verilen bir boşanma kararı Türkiye’de kendiliğinden hüküm doğurmaz; Türkiye’deki taşınmazlar Türk hukukuna tabidir; Türk mahkemeleri ve kurumları önünde temsil için usulüne uygun bir vekâletname gerekir. Bu adımlar Almanya’dan planlanabilir ve takip edilebilir.',
        de: 'Ein deutsches Scheidungsurteil wird in der Türkei nicht automatisch wirksam, ein Grundstück in der Türkei unterliegt türkischem Recht, und für die Vertretung vor türkischen Gerichten und Behörden ist eine formgerechte Vollmacht nötig. Diese Schritte lassen sich von Deutschland aus planen und begleiten.',
        en: 'A divorce granted in Germany or another country does not automatically take effect in Türkiye, property in Türkiye is governed by Turkish law, and representation before Turkish courts and authorities requires a power of attorney in the proper form. These steps can be planned and handled from abroad.',
        nl: 'Een in Duitsland, Nederland of een ander land uitgesproken echtscheiding heeft in Turkije niet automatisch rechtsgevolg, onroerend goed in Turkije valt onder Turks recht en voor vertegenwoordiging bij Turkse rechtbanken en instanties is een volmacht in de juiste vorm nodig. Deze stappen kunnen vanuit het buitenland worden gepland en begeleid.',
      })}</p>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="topics-title">
  <div class="wrap">
    <h2 id="topics-title" class="section-title">${T({ tr: 'Başlıca konular', de: 'Themen', en: 'Topics', nl: 'Onderwerpen' })}</h2>
    <div class="cb-topics">
      ${crossBorderTopics
        .map((x) => {
          const p = x.post && postFor(x.post);
          return `<article class="cb-topic">
            <h3>${h(x.title[lang])}</h3>
            <p>${h(x.text[lang])}</p>
            ${p ? `<p><a class="link-arrow" href="${postUrl(p)}">${T({ tr: 'İlgili yazı', de: 'Zum Beitrag', en: 'Read the article', nl: 'Lees het artikel' })}</a></p>` : ''}
          </article>`;
        })
        .join('')}
    </div>
  </div>
</section>

<section class="section section-tight">
  <div class="wrap split">
    <h2>${T({ tr: 'Yetki sınırları', de: 'Zuständigkeit', en: 'Scope of practice', nl: 'Reikwijdte' })}</h2>
    <div>
      ${scopeBox(lang)}
      <p class="muted small">${T({
        tr: 'Alman hukukuna ilişkin konular — örneğin bir Alman aile mahkemesindeki boşanma davası — Almanya’da ruhsatlı bir Rechtsanwalt/Rechtsanwältin tarafından yürütülmelidir.',
        de: 'Fragen, die deutsches Recht betreffen – etwa ein Scheidungsverfahren vor einem deutschen Familiengericht –, gehören in die Hände einer in Deutschland zugelassenen Rechtsanwältin oder eines Rechtsanwalts.',
        en: 'Matters governed by German or other foreign law – for example divorce proceedings before a German family court – should be handled by a lawyer admitted in that country.',
        nl: 'Vragen naar Duits of Nederlands recht – bijvoorbeeld een echtscheidingsprocedure bij een Duitse of Nederlandse rechter – horen thuis bij een in dat land toegelaten advocaat.',
      })}</p>
    </div>
  </div>
</section>

${bookingBand(lang)}`;
  return layout({
    lang,
    title: T({
      tr: 'Türkiye–Almanya Hukuki İşlemler',
      de: 'Türkei–Deutschland: Rechtsangelegenheiten in der Türkei',
      en: 'Türkiye–Germany: legal matters in Türkiye',
      nl: 'Turkije–Duitsland: juridische zaken in Turkije',
    }),
    description: T({
      tr: 'Almanya’da yaşayanlar için Türkiye’de boşanma, Almanya boşanma kararının Türkiye’de tanınması, miras ve taşınmaz işlemleri, yurt dışından vekâletname ve dava takibi.',
      de: 'Türkischer Avukat in Düsseldorf: Scheidung in der Türkei, Anerkennung deutscher Scheidungsurteile, Erbschaft und Immobilien in der Türkei, Vollmacht aus Deutschland.',
      en: 'Avukat (Turkey) in Düsseldorf: divorce in Türkiye, recognition of foreign divorce judgments, inheritance and real estate in Türkiye, power of attorney from abroad.',
      nl: 'Avukat (Turkije) in Düsseldorf: echtscheiding in Turkije, erkenning van buitenlandse echtscheidingsvonnissen, erfenis en vastgoed in Turkije, volmacht vanuit het buitenland.',
    }),
    path: paths.crossborder[lang],
    alt: paths.crossborder,
    active: 'crossborder',
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Hukuki yayınlar                                                     */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 20;

// Bölüm adları ve tanıtım metinleri: "Yazılar" (genel blog) ve "Mevzuat".
const SECTIONS = {
  blog: {
    name: { tr: 'Makaleler', de: 'Beiträge', en: 'Articles', nl: 'Artikelen' },
    lead: {
      tr: 'Türk hukukundaki güncel gelişmeler ve Avrupa’da yaşayanların Türkiye’deki hukuki işleri üzerine genel bilgilendirme yazıları.',
      de: 'Aktuelle Entwicklungen im türkischen Recht und Rechtsfragen in der Türkei für in Europa lebende Menschen – allgemeine Informationen.',
      en: 'Current developments in Turkish law and legal matters in Türkiye for people living in Europe – general information.',
      nl: 'Actuele ontwikkelingen in het Turkse recht en juridische zaken in Turkije voor wie in Europa woont – algemene informatie.',
    },
    description: {
      tr: 'Av. Sermin Güneş Keçeci’nin Türk hukukundaki güncel gelişmeler ve Avrupa’da yaşayan Türklerin hukuki sorunları üzerine bilgilendirme yazıları.',
      de: 'Beiträge von Avukat (Türkei) Sermin Güneş Keçeci zu aktuellen Entwicklungen im türkischen Recht und Rechtsfragen in der Türkei.',
      en: 'Articles by Avukat (Turkey) Sermin Güneş Keçeci on current developments in Turkish law and legal matters in Türkiye.',
      nl: 'Artikelen van Avukat (Turkije) Sermin Güneş Keçeci over actuele ontwikkelingen in het Turkse recht en juridische zaken in Turkije.',
    },
  },
  mevzuat: {
    name: { tr: 'Mevzuat', de: 'Gesetze erklärt', en: 'Legislation explained', nl: 'Wetgeving uitgelegd' },
    lead: {
      tr: 'Kanun maddeleri tek tek: güncel madde metni, gerekçesi, açıklaması ve uygulamadaki yeri.',
      de: 'Türkische Gesetzesartikel einzeln erklärt: aktueller Wortlaut (nichtamtliche Übersetzung), Begründung, Erläuterung und Praxis.',
      en: 'Turkish statutory provisions one by one: current wording (unofficial translation), legislative reasoning, explanation and practice.',
      nl: 'Turkse wetsartikelen één voor één: actuele tekst (niet-officiële vertaling), toelichting, uitleg en praktijk.',
    },
    description: {
      tr: 'Türk mevzuatından kanun maddeleri: güncel madde metni, madde gerekçesi, açıklama ve uygulama bilgileri.',
      de: 'Türkische Gesetzesartikel erklärt: Wortlaut, Begründung und Anwendung in der Praxis – Avukat (Türkei) Sermin Güneş Keçeci.',
      en: 'Turkish statutory provisions explained: wording, legislative reasoning and application in practice – Avukat (Turkey) Sermin Güneş Keçeci.',
      nl: 'Turkse wetsartikelen uitgelegd: tekst, toelichting en toepassing in de praktijk – Avukat (Turkije) Sermin Güneş Keçeci.',
    },
  },
};
const sectionPath = (category) => (category === 'mevzuat' ? paths.mevzuat : paths.makaleler);

/**
 * Yayın listesi: genel yazılar (category = blog) veya mevzuat bölümü.
 * @param {URLSearchParams} [query]  ?page=2 sayfalama
 */
export function blogPage(lang, category = 'blog', query) {
  const T = pick(lang);
  const S = SECTIONS[category];
  const all = posts(lang, category);
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(query?.get('page'), 10) || 1));
  const list = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const base = sectionPath(category)[lang];
  const pageUrl = (n) => (n === 1 ? base : `${base}?page=${n}`);
  // Henüz bu dilde yazı yoksa, yazıların bulunduğu diller önerilir.
  const otherLangs = LANGS.filter((l) => l !== lang && posts(l, category).length);
  const empty = `<p class="empty">${T({
    tr: 'Henüz yayımlanmış bir yazı bulunmuyor.',
    de: 'Derzeit sind keine Beiträge veröffentlicht.',
    en: 'No articles have been published in English yet.',
    nl: 'Er zijn nog geen artikelen in het Nederlands gepubliceerd.',
  })}${
    otherLangs.length
      ? ` ${T({ tr: 'Diğer dillerdeki yazılar:', de: 'Beiträge in anderen Sprachen:', en: 'Articles in other languages:', nl: 'Artikelen in andere talen:' })} ${otherLangs
          .map((l) => `<a href="${sectionPath(category)[l]}" hreflang="${l}" lang="${l}">${h(langNames[l])}</a>`)
          .join(', ')}`
      : ''
  }</p>`;
  const tabs = ['blog', 'mevzuat']
    .map((c) => `<a href="${sectionPath(c)[lang]}"${c === category ? ' aria-current="page"' : ''}>${h(SECTIONS[c].name[lang])}</a>`)
    .join('');
  const pager =
    pages > 1
      ? `<nav class="pager" aria-label="${T({ tr: 'Sayfalar', de: 'Seiten', en: 'Pages', nl: 'Pagina’s' })}">${
          page > 1 ? `<a rel="prev" href="${pageUrl(page - 1)}">← ${T({ tr: 'Daha yeni', de: 'Neuere', en: 'Newer', nl: 'Nieuwer' })}</a>` : '<span></span>'
        }<span>${page} / ${pages}</span>${
          page < pages ? `<a rel="next" href="${pageUrl(page + 1)}">${T({ tr: 'Daha eski', de: 'Ältere', en: 'Older', nl: 'Ouder' })} →</a>` : '<span></span>'
        }</nav>`
      : '';
  const body = `
<header class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="${T({ tr: 'Sayfa yolu', de: 'Brotkrumen', en: 'Breadcrumb', nl: 'Kruimelpad' })}"><a href="${paths.blog[lang]}">${h(t[lang].nav.blog)}</a></nav>
    <h1>${h(S.name[lang])}</h1>
    <p class="page-lead">${h(S.lead[lang])}</p>
    <nav class="section-tabs" aria-label="${T({ tr: 'Bölümler', de: 'Rubriken', en: 'Sections', nl: 'Rubrieken' })}">${tabs}</nav>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap pub-layout">
    ${finderBox(lang)}
    ${category === 'mevzuat' && lang === 'tr' && page === 1 ? kanunCards() : ''}
    <div>
    ${category === 'mevzuat' && lang === 'tr' ? '<h2 class="pub-list-title">Mevzuat yazıları</h2>' : ''}
    ${
      list.length
        ? `<ul class="post-list">${list
            .map(
              (p) => `<li><article>
                <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time></p>
                <h2><a href="${postUrl(p)}">${h(p.title)}</a></h2>
                <p>${h(p.description || '')}</p>
              </article></li>`,
            )
            .join('')}</ul>${pager}`
        : empty
    }
    </div>
  </div>
</section>`;
  const title = S.name[lang];
  return layout({
    lang,
    title: page > 1 ? `${title} (${page})` : title,
    description: S.description[lang],
    path: pageUrl(page),
    alt: page > 1 ? null : sectionPath(category),
    active: 'blog',
    activeSub: category === 'mevzuat' ? 'mevzuat' : 'makaleler',
    scripts: ['/js/finder.js'],
    jsonLd: [breadcrumbs(lang, [[t[lang].nav.blog, paths.blog[lang]], [S.name[lang], base]])],
    body,
  });
}

const KIND = { blog: { tr: 'Makale', de: 'Beitrag', en: 'Article', nl: 'Artikel' }, mevzuat: { tr: 'Mevzuat', de: 'Gesetz', en: 'Legislation', nl: 'Wetgeving' }, kanun: { tr: 'Kanun maddesi', de: 'Gesetzesartikel', en: 'Statutory provision', nl: 'Wetsartikel' } };

/**
 * Yazı bulucunun cevabı: ziyaretçinin sorusu ve önerilen yazılar (sohbet balonları).
 * Hem /api/yazi-bul (JavaScript ile) hem de JavaScript kapalıyken yayınlar sayfasında kullanılır.
 */
export function finderReply(lang, question) {
  const T = pick(lang);
  const { results, area, understood } = findPosts(lang, question);
  const areaLine = area
    ? `<p>${T({ tr: 'İlgili çalışma alanı:', de: 'Passendes Rechtsgebiet:', en: 'Related practice area:', nl: 'Bijbehorend rechtsgebied:' })} <a href="${areaPath(lang, area)}">${h(area.title[lang])}</a></p>`
    : '';
  const contact = `<p>${T({
    tr: `Durumunuzu ayrıntılı konuşmak isterseniz <a href="${paths.booking.tr}">randevu alabilir</a> ya da <a href="${paths.contact.tr}">yazabilirsiniz</a>.`,
    de: `Wenn Sie Ihren Fall besprechen möchten, können Sie <a href="${paths.booking.de}">einen Termin vereinbaren</a> oder <a href="${paths.contact.de}">schreiben</a>.`,
    en: `If you would like to discuss your situation, you can <a href="${paths.booking.en}">book an appointment</a> or <a href="${paths.contact.en}">get in touch</a>.`,
    nl: `Wilt u uw situatie bespreken, dan kunt u <a href="${paths.booking.nl}">een afspraak maken</a> of <a href="${paths.contact.nl}">contact opnemen</a>.`,
  })}</p>`;
  let answer;
  if (!understood) {
    answer = `<p>${T({
      tr: 'Sorununuzu biraz daha açık yazar mısınız? Konuyu (ör. miras, boşanma, tapu, vekâletname) ve işlemin Türkiye’de mi Almanya’da mı olduğunu belirtmeniz yeterli.',
      de: 'Können Sie Ihr Anliegen etwas genauer beschreiben? Nennen Sie das Thema (z. B. Erbschaft, Scheidung, Immobilie, Vollmacht) und ob es um die Türkei oder Deutschland geht.',
      en: 'Could you describe your issue in a little more detail? Mention the topic (e.g. inheritance, divorce, property, power of attorney) and whether it concerns Türkiye or Germany.',
      nl: 'Kunt u uw vraag iets nauwkeuriger omschrijven? Noem het onderwerp (bijv. erfenis, echtscheiding, vastgoed, volmacht) en of het om Turkije of Duitsland gaat.',
    })}</p>`;
  } else if (results.length) {
    answer = `<p>${T({
      tr: 'Şu yazılar sorunuzla ilgili olabilir:',
      de: 'Diese Beiträge könnten zu Ihrem Anliegen passen:',
      en: 'These posts may be relevant to your question:',
      nl: 'Deze teksten kunnen bij uw vraag passen:',
    })}</p><ul class="finder-results">${results
      .map((r) => `<li><a href="${r.url}"><span class="finder-kind">${h(KIND[r.kind][lang])}</span>${h(r.title)}</a></li>`)
      .join('')}</ul>${areaLine}${contact}`;
  } else {
    answer = `<p>${T({
      tr: 'Bu konuda henüz bir yazı bulamadım. Sorununuzu başka kelimelerle yazmayı deneyebilirsiniz.',
      de: 'Zu diesem Thema habe ich noch keinen Beitrag gefunden. Versuchen Sie es gern mit anderen Worten.',
      en: 'I could not find a post on this topic yet. You can try describing it in other words.',
      nl: 'Over dit onderwerp heb ik nog geen tekst gevonden. Probeer het eventueel met andere woorden.',
    })}</p>${areaLine}${contact}`;
  }
  return `<div class="msg msg-user"><p>${h(question)}</p></div><div class="msg msg-bot">${answer}</div>`;
}

/** Yazı bulucu kutusu (Hukuki Yayınlar, Makaleler ve Mevzuat sayfalarında). question: JavaScript kapalıyken gönderilen soru. */
function finderBox(lang, question) {
  const T = pick(lang);
  return `
    <aside class="finder" aria-labelledby="finder-title">
      <div class="finder-intro">
      <h2 id="finder-title">${T({ tr: 'Konunuzla ilgili yazıyı bulun', de: 'Den passenden Beitrag finden', en: 'Find the right post', nl: 'Vind de juiste tekst' })}</h2>
      <p class="finder-note">${T({
        tr: 'Yalnızca bu sitedeki yazılar aranır, hukuki değerlendirme yapılmaz. Yazdıklarınız kaydedilmez; ad, adres veya dosya numarası yazmayın.',
        de: 'Durchsucht werden nur die Beiträge dieser Website; eine rechtliche Bewertung erfolgt nicht. Ihre Eingabe wird nicht gespeichert – bitte keine Namen, Adressen oder Aktenzeichen eingeben.',
        en: 'Only the posts on this website are searched; no legal assessment is made. Your text is not stored – please do not enter names, addresses or case numbers.',
        nl: 'Alleen de teksten op deze website worden doorzocht; er volgt geen juridische beoordeling. Uw tekst wordt niet opgeslagen – vul geen namen, adressen of zaaknummers in.',
      })}</p>
      </div>
      <div class="finder-chat">
      <div class="finder-log" role="log" aria-live="polite">
        <div class="msg msg-bot"><p>${T({
          tr: 'Sorununuzu bir iki cümleyle yazın, ilgili makale ve mevzuat yazılarını göstereyim.',
          de: 'Beschreiben Sie Ihr Anliegen in ein, zwei Sätzen – ich zeige Ihnen passende Beiträge und Gesetzeserläuterungen.',
          en: 'Describe your issue in a sentence or two and I will show you related articles and legislation.',
          nl: 'Beschrijf uw vraag in een of twee zinnen, dan laat ik u passende artikelen en wetsuitleg zien.',
        })}</p><p class="finder-example">${T({
          tr: 'Örnek: “Babam Türkiye’de vefat etti, mirası reddetmek istiyorum.”',
          de: 'Beispiel: „Mein Vater ist in der Türkei verstorben, ich möchte das Erbe ausschlagen.“',
          en: 'Example: “My father died in Türkiye and I want to renounce the inheritance.”',
          nl: 'Voorbeeld: „Mijn vader is in Turkije overleden, ik wil de erfenis verwerpen.”',
        })}</p></div>
        ${question ? finderReply(lang, question) : ''}
      </div>
      <form class="finder-form" method="post" action="/api/yazi-bul">
        <input type="hidden" name="dil" value="${lang}">
        <label class="sr-only" for="finder-q">${T({ tr: 'Sorununuz', de: 'Ihr Anliegen', en: 'Your issue', nl: 'Uw vraag' })}</label>
        <textarea id="finder-q" name="soru" rows="2" maxlength="500" required placeholder="${T({ tr: 'Sorununuzu yazın…', de: 'Ihr Anliegen…', en: 'Your issue…', nl: 'Uw vraag…' })}"></textarea>
        <button class="btn btn-small" type="submit">${T({ tr: 'Yazıları bul', de: 'Beiträge finden', en: 'Find posts', nl: 'Teksten zoeken' })}</button>
      </form>
      </div>
    </aside>`;
}

/** Hukuki Yayınlar: üstte yazı bulucu, altında makaleler ve mevzuat bölümleri yan yana. */
export function blogHub(lang, { question } = {}) {
  const T = pick(lang);
  const block = (category) => {
    const S = SECTIONS[category];
    const all = posts(lang, category);
    const id = `pub-${category}`;
    return `<section class="pub-section" aria-labelledby="${id}">
      <div class="pub-section-head">
        <h2 id="${id}"><a href="${sectionPath(category)[lang]}">${h(S.name[lang])}</a></h2>
        ${all.length ? `<a class="pub-all" href="${sectionPath(category)[lang]}">${T({ tr: 'Tümü', de: 'Alle', en: 'View all', nl: 'Alle' })} (${all.length})</a>` : ''}
      </div>
      <p class="pub-lead">${h(S.lead[lang])}</p>
      ${
        all.length
          ? `<ul class="post-list post-list-compact">${all
              .slice(0, 4)
              .map(
                (p) => `<li><article>
                <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time></p>
                <h3><a href="${postUrl(p)}">${h(p.title)}</a></h3>
                <p>${h(p.description || '')}</p>
              </article></li>`,
              )
              .join('')}</ul>`
          : `<p class="empty">${T({ tr: 'Bu bölümde henüz yayımlanmış bir yazı bulunmuyor.', de: 'In dieser Rubrik ist noch nichts veröffentlicht.', en: 'Nothing has been published in this section yet.', nl: 'In deze rubriek is nog niets gepubliceerd.' })}</p>`
      }
    </section>`;
  };
  const body = `
<header class="page-head">
  <div class="wrap">
    <h1>${h(t[lang].nav.blog)}</h1>
    <p class="page-lead">${T({
      tr: 'Makaleler güncel gelişmeleri ve Avrupa’da yaşayanların Türkiye’deki hukuki işlerini, Mevzuat bölümü ise kanun maddelerini tek tek ele alır.',
      de: 'Beiträge zu aktuellen Entwicklungen und Rechtsfragen in der Türkei sowie einzeln erläuterte türkische Gesetzesartikel.',
      en: 'Articles on current developments and legal matters in Türkiye, and Turkish statutory provisions explained one by one.',
      nl: 'Artikelen over actuele ontwikkelingen en juridische zaken in Turkije, en Turkse wetsartikelen één voor één uitgelegd.',
    })}</p>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap pub-layout">
    ${finderBox(lang, question)}
    <div class="pub-sections">
      ${block('blog')}
      ${block('mevzuat')}
    </div>
  </div>
</section>`;
  return layout({
    lang,
    title: t[lang].nav.blog,
    description: T({
      tr: 'Av. Sermin Güneş Keçeci’nin Türk hukuku üzerine makaleleri ve kanun maddesi açıklamaları; konunuzu yazın, ilgili yazıları bulun.',
      de: 'Beiträge und Erläuterungen türkischer Gesetzesartikel von Avukat (Türkei) Sermin Güneş Keçeci – mit Suche nach Ihrem Anliegen.',
      en: 'Articles and explanations of Turkish statutory provisions by Avukat (Turkey) Sermin Güneş Keçeci – describe your issue to find related posts.',
      nl: 'Artikelen en uitleg van Turkse wetsartikelen door Avukat (Turkije) Sermin Güneş Keçeci – beschrijf uw vraag en vind passende teksten.',
    }),
    path: paths.blog[lang],
    alt: paths.blog,
    active: 'blog',
    noindex: Boolean(question),
    scripts: ['/js/finder.js'],
    jsonLd: [breadcrumbs(lang, [[t[lang].nav.blog, paths.blog[lang]]])],
    body,
  });
}

// schema.org BreadcrumbList: items = [[ad, yol], …]
function breadcrumbs(lang, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [[T0(lang), paths.home[lang]], ...items].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absUrl(path) })),
  };
}
const T0 = (lang) => ({ tr: 'Ana sayfa', de: 'Startseite', en: 'Home', nl: 'Home' })[lang];

// preview: yönetim panelindeki önizleme (taslaklar için de çalışır, arama motorlarına kapalı).
export function postPage(lang, p, { preview = false } = {}) {
  const T = pick(lang);
  const mevzuat = p.category === 'mevzuat';
  const toc = headings(p.body);
  const { published, modified } = postDates(p);
  const twins = allLangs((l) => (l === lang ? p : pairOf(p, l)));
  const author = {
    '@type': 'Person',
    name: `${proTitle[lang]} ${L.name}`,
    url: absUrl(paths.about[lang]),
    jobTitle: proTitle[lang],
  };
  const section = mevzuat ? SECTIONS.mevzuat : SECTIONS.blog;
  const crumbItems = [[t[lang].nav.blog, paths.blog[lang]], [section.name[lang], sectionPath(p.category)[lang]], [p.title, postUrl(p)]];
  const body = `
<article class="post">
  <header class="page-head">
    <div class="wrap wrap-narrow">
      <nav class="crumbs" aria-label="${T({ tr: 'Sayfa yolu', de: 'Brotkrumen', en: 'Breadcrumb', nl: 'Kruimelpad' })}"><a href="${paths.blog[lang]}">${h(t[lang].nav.blog)}</a> <span aria-hidden="true">/</span> <a href="${sectionPath(p.category)[lang]}">${h(section.name[lang])}</a></nav>
      <h1>${h(p.title)}</h1>
      <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time> <span aria-hidden="true">/</span> ${readingMinutes(p.body)} ${T({ tr: 'dk okuma', de: 'Min. Lesezeit', en: 'min read', nl: 'min. leestijd' })} <span aria-hidden="true">/</span> ${h(isForeign(lang) ? proTitle[lang] : 'Av.')} ${h(L.name)}</p>
    </div>
  </header>
  <div class="wrap wrap-narrow section-tight">
    ${
      toc.length >= 3
        ? `<nav class="toc" aria-labelledby="toc-title"><p class="toc-title" id="toc-title">${T({ tr: 'İçindekiler', de: 'Inhalt', en: 'Contents', nl: 'Inhoud' })}</p><ol>${toc
            .map((x) => `<li><a href="#${h(x.id)}">${h(x.text)}</a></li>`)
            .join('')}</ol></nav>`
        : ''
    }
    <div class="prose prose-article">${markdown(p.body)}</div>
    <aside class="post-disclaimer">
      <p>${T({
        tr: 'Bu yazı yayım tarihindeki mevzuatı esas alır ve yalnızca genel bilgilendirme amacı taşır; somut durumlar için hukuki danışmanlık yerine geçmez.',
        de: 'Dieser Beitrag gibt den Stand zum Zeitpunkt der Veröffentlichung wieder und dient ausschließlich der allgemeinen Information. Er ersetzt keine Beratung im Einzelfall.',
        en: 'This article reflects the law at the time of publication and is for general information only. It does not replace advice on an individual case.',
        nl: 'Dit artikel geeft de stand van het recht weer op het moment van publicatie en is uitsluitend bedoeld als algemene informatie. Het vervangt geen advies in een concreet geval.',
      })}${
        mevzuat && lang !== 'tr'
          ? ` ${T({
              de: 'Die Übersetzung des Gesetzestextes ist nicht amtlich; maßgeblich ist allein der im türkischen Amtsblatt (Resmî Gazete) veröffentlichte türkische Wortlaut.',
              en: 'The translation of the statutory text is unofficial; only the Turkish text published in the Official Gazette (Resmî Gazete) is authoritative.',
              nl: 'De vertaling van de wettekst is niet officieel; alleen de Turkse tekst zoals gepubliceerd in het Turkse Staatsblad (Resmî Gazete) is bindend.',
            })}`
          : ''
      }</p>
    </aside>
  </div>
</article>
${bookingBand(lang)}`;
  return layout({
    lang,
    title: p.title,
    description: p.description || p.title,
    path: postUrl(p),
    // Çevirisi olmayan dilde dil seçici liste sayfasına gider; hreflang yalnızca gerçek çevirileri bildirir.
    alt: allLangs((l) => (twins[l] ? postUrl(twins[l]) : sectionPath(p.category)[l])),
    hreflang: LANGS.filter((l) => twins[l]),
    active: 'blog',
    noindex: preview,
    article: { published, modified, section: section.name[lang] },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': mevzuat ? 'Article' : 'BlogPosting',
        headline: p.title,
        description: p.description || undefined,
        inLanguage: lang,
        datePublished: published,
        dateModified: modified,
        author,
        publisher: author,
        image: absUrl('/img/portre-ana.jpg'),
        mainEntityOfPage: absUrl(postUrl(p)),
        articleSection: section.name[lang],
        wordCount: p.body.split(/\s+/).length,
      },
      breadcrumbs(lang, crumbItems),
    ],
    body: preview ? `<p class="preview-bar">Önizleme${p.status === 'draft' ? ' — bu yazı taslak, sitede görünmüyor' : ''}. <a href="/yonetim/yazilar/${p.id}">Düzenlemeye dön</a></p>${body}` : body,
  });
}

/* ------------------------------------------------------------------ */
/* Kanun maddeleri (TMK, MÖHUK) — yalnızca Türkçe                       */
/* ------------------------------------------------------------------ */

// Madde metnindeki [^n] dipnot işaretleri
const footRefs = (html, key) => html.replace(/\[\^(\d+)\]/g, (_, n) => `<sup><a href="#dn-${key}-${n}" id="dr-${key}-${n}">${n}</a></sup>`);

// "Birinci Kitap – Kişiler Hukuku" gibi bölüm adlarının aralığı: (m. 1–117)
const rangeLabel = (list) => {
  const nums = list.filter((m) => !m.no.startsWith('gecici-')).map((m) => Number(m.no));
  if (!nums.length) return '';
  const a = Math.min(...nums), b = Math.max(...nums);
  return a === b ? `m. ${a}` : `m. ${a}–${b}`;
};

/** Mevzuat sayfasındaki kanun kartları (Türkçe). */
export function kanunCards() {
  return `<section class="kanun-cards" aria-labelledby="kanunlar-title">
    <h2 id="kanunlar-title">Kanunlar madde madde</h2>
    <p class="pub-lead">Her maddenin güncel metni, resmî gerekçesi ve açıklaması ayrı bir sayfada.</p>
    <ul>${Object.values(KANUNLAR)
      .filter((k) => maddeList(k.key).length)
      .map(
        (k) => `<li><a href="${kanunUrl(k.key)}"><span class="kanun-kisa">${h(k.kisa)}</span><span class="kanun-ad">${h(k.no)} sayılı ${h(k.ad)}</span><span class="kanun-ozet">${h(k.ozet)}</span><span class="kanun-sayi">${maddeList(k.key).length} madde</span></a></li>`,
      )
      .join('')}</ul>
  </section>`;
}

/** Kanun dizini: bölümlere göre gruplanmış madde listesi. */
export function kanunPage(key) {
  const K = KANUNLAR[key];
  const list = maddeList(key);
  // En üst bölüme göre grupla (TMK'da kitap, MÖHUK'ta kısım); içeride alt bölüm başlıkları.
  const groups = [];
  for (const m of list) {
    const top = m.bolum[0] || '';
    let g = groups.at(-1);
    if (!g || g.top !== top) groups.push((g = { top, items: [] }));
    g.items.push(m);
  }
  const groupHtml = (g, i) => {
    let prev = [];
    let html = '';
    let open = false;
    for (const m of g.items) {
      const sub = m.bolum.slice(1);
      const changed = sub.findIndex((x, j) => x !== prev[j]);
      if (changed !== -1 || sub.length !== prev.length) {
        if (open) html += '</ol>';
        const from = changed === -1 ? sub.length : changed;
        for (let j = from; j < sub.length; j++) html += `<p class="kanun-alt kanun-alt-${Math.min(j + 1, 3)}">${h(sub[j])}</p>`;
        html += '<ol class="kanun-maddeler">';
        open = true;
        prev = sub;
      } else if (!open) {
        html += '<ol class="kanun-maddeler">';
        open = true;
      }
      html += `<li><a href="${maddeUrl(m)}"><span class="madde-no">${h(maddeLabel(m))}</span> ${h(m.baslik)}</a></li>`;
    }
    if (open) html += '</ol>';
    return `<details class="kanun-grup"${i === 0 ? ' open' : ''}><summary><span>${h(g.top || K.ad)}</span><small>${rangeLabel(g.items)}</small></summary>${html}</details>`;
  };
  const crumbItems = [[t.tr.nav.blog, paths.blog.tr], [SECTIONS.mevzuat.name.tr, paths.mevzuat.tr], [K.kisa, kanunUrl(key)]];
  const body = `
<header class="page-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Sayfa yolu"><a href="${paths.blog.tr}">${h(t.tr.nav.blog)}</a> <span aria-hidden="true">/</span> <a href="${paths.mevzuat.tr}">${h(SECTIONS.mevzuat.name.tr)}</a></nav>
    <h1>${h(K.ad)} (${h(K.kisa)})</h1>
    <p class="page-lead">${h(K.ozet)}</p>
    <p class="kanun-kunye">Kanun numarası: ${h(K.no)} · ${h(K.rg)} · ${list.length} madde</p>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap wrap-narrow">
    <form class="madde-git" method="get" action="${kanunUrl(key)}">
      <label for="madde-no">Maddeye git</label>
      <input id="madde-no" name="madde" inputmode="numeric" pattern="[0-9]+" maxlength="4" placeholder="ör. ${key === 'tmk' ? '166' : '50'}" required>
      <button class="btn btn-small" type="submit">Git</button>
    </form>
    ${groups.map(groupHtml).join('')}
    <p class="kanun-kaynak">Madde metinleri: <a href="${K.kaynak}" rel="noopener">mevzuat.gov.tr</a> (son karşılaştırma ${h(fmtFull(K.guncel, 'tr'))}). Gerekçeler: ${h(K.gerekceKaynak)}.</p>
  </div>
</section>`;
  return layout({
    lang: 'tr',
    title: `${K.ad} (${K.kisa}) madde madde`,
    description: `${K.no} sayılı ${K.ad}: ${list.length} maddenin güncel metni, resmî madde gerekçesi ve açıklaması.`.slice(0, 160),
    path: kanunUrl(key),
    alt: null,
    active: 'blog',
    activeSub: 'mevzuat',
    jsonLd: [breadcrumbs('tr', crumbItems)],
    body,
  });
}

// Bu maddeye atıf yapan Türkçe yazılar (ör. başlıkta "MÖHUK Madde 50" ya da metinde "TMK m. 605").
function relatedPosts(m) {
  if (m.no.startsWith('gecici-')) return [];
  const re = new RegExp(`${KANUNLAR[m.kanun].kisa}\\s*(?:m\\.|madde)\\s*${m.no}(?![0-9])`, 'i');
  return posts('tr')
    .filter((p) => re.test(p.title) || re.test(p.body))
    .sort((a, b) => Number(re.test(b.title)) - Number(re.test(a.title)))
    .slice(0, 4);
}

/** Tek madde: güncel metin, dipnotlar, gerekçe, açıklama. */
export function maddePage(m) {
  const K = KANUNLAR[m.kanun];
  const title = maddeTitle(m);
  const label = `${K.kisa} ${maddeLabel(m)}`;
  const key = `${m.kanun}${m.no}`;
  const { prev, next } = neighbours(m);
  const related = relatedPosts(m);
  // Madde metni Markdown olarak işlenmez ("1." ile başlayan bentler numaralı listeye dönmesin).
  const metin = footRefs(
    m.metin
      .split(/\n{2,}/)
      .map((x) => `<p>${h(x.trim()).replace(/^(\((?:Değişik|Ek|Mülga|İptal)[^)]*\))/, '<span class="degisiklik">$1</span>')}</p>`)
      .join(''),
    key,
  );
  const dipnotlar = m.dipnotlar
    ? `<ol class="dipnotlar">${m.dipnotlar
        .split('\n')
        .map((l) => l.match(/^\[\^(\d+)\]:\s*(.*)$/))
        .filter(Boolean)
        .map(([, n, text]) => `<li id="dn-${key}-${n}" value="${n}">${h(text)}${m.metin.includes(`[^${n}]`) ? ` <a href="#dr-${key}-${n}" aria-label="Metne dön">↩</a>` : ''}</li>`)
        .join('')}</ol>`
    : '';
  const toc = [
    ['metin', `${label} metni`],
    ...(m.gerekce ? [['gerekce', `${label} gerekçesi`]] : []),
    ...(m.aciklama ? [['aciklama', 'Açıklama']] : []),
    ...(related.length ? [['yazilar', 'İlgili yazılar']] : []),
  ];
  const description = (m.aciklama.replace(/[*_[\]()#>-]/g, '').split(/\n\n/)[0] || `${title}: güncel madde metni, gerekçesi ve açıklaması.`).replace(/\s+/g, ' ');
  const body = `
<article class="post madde">
  <header class="page-head">
    <div class="wrap wrap-narrow">
      <nav class="crumbs" aria-label="Sayfa yolu"><a href="${paths.blog.tr}">${h(t.tr.nav.blog)}</a> <span aria-hidden="true">/</span> <a href="${paths.mevzuat.tr}">${h(SECTIONS.mevzuat.name.tr)}</a> <span aria-hidden="true">/</span> <a href="${kanunUrl(m.kanun)}">${h(K.kisa)}</a></nav>
      <h1>${h(title)}</h1>
      <p class="post-meta">${h(K.no)} sayılı ${h(K.ad)}${m.bolum.length ? ` <span aria-hidden="true">/</span> ${h(m.bolum.at(-1))}` : ''}</p>
    </div>
  </header>
  <div class="wrap wrap-narrow section-tight">
    <nav class="toc" aria-labelledby="toc-title"><p class="toc-title" id="toc-title">İçindekiler</p><ol>${toc.map(([id, text]) => `<li><a href="#${id}">${h(text)}</a></li>`).join('')}</ol></nav>
    <div class="prose prose-article">
      <h2 id="metin">${h(label)} metni</h2>
      <blockquote class="madde-metni">${m.kenar.length ? `<p class="madde-kenar">${h(m.kenar.join(' / '))}</p>` : ''}<p class="madde-no-line"><strong>${h(maddeLabel(m))}</strong></p>${metin}</blockquote>
      ${dipnotlar ? `<p class="dipnot-baslik">Değişiklik notları</p>${dipnotlar}` : ''}
      <p class="madde-kaynak">Güncel metin: <a href="${K.kaynak}" rel="noopener">mevzuat.gov.tr</a>, son karşılaştırma ${h(fmtFull(K.guncel, 'tr'))}.</p>
      ${
        m.gerekce
          ? `<h2 id="gerekce">${h(label)} gerekçesi</h2>
      ${markdown(m.gerekce)}
      <p class="madde-kaynak">Kaynak: <a href="${K.gerekceUrl}" rel="noopener">${h(K.gerekceKaynak)}</a>${m.tasari_no && m.tasari_no !== m.no ? `, tasarının ${h(m.tasari_no)}. maddesi` : ''}. Gerekçe, tasarının Meclis’e sunulan metnine aittir; madde sonradan değiştirilmişse güncel metinle farklılık gösterebilir. ${h(K.gerekceSozluk)}</p>`
          : m.gerekce_not
            ? `<p class="madde-kaynak">${h(m.gerekce_not)}</p>`
            : ''
      }
      ${m.aciklama ? `<h2 id="aciklama">Açıklama</h2>\n${markdown(m.aciklama)}` : ''}
      ${
        related.length
          ? `<h2 id="yazilar">İlgili yazılar</h2><ul>${related.map((p) => `<li><a href="${postUrl(p)}">${h(p.title)}</a></li>`).join('')}</ul>`
          : ''
      }
    </div>
    <nav class="madde-nav" aria-label="Maddeler arasında gezinme">
      ${prev ? `<a rel="prev" href="${maddeUrl(prev)}"><small>Önceki</small>${h(maddeTitle(prev).replace(/^\S+ /, ''))}</a>` : '<span></span>'}
      <a class="madde-nav-index" href="${kanunUrl(m.kanun)}">${h(K.kisa)} madde listesi</a>
      ${next ? `<a rel="next" href="${maddeUrl(next)}"><small>Sonraki</small>${h(maddeTitle(next).replace(/^\S+ /, ''))}</a>` : '<span></span>'}
    </nav>
    <aside class="post-disclaimer">
      <p>Madde metni mevzuat.gov.tr’deki güncel metinden alınmıştır; bağlayıcı olan Resmî Gazete’de yayımlanan metindir. Açıklama genel bilgilendirme amacı taşır ve somut durumlar için hukuki danışmanlık yerine geçmez.</p>
    </aside>
  </div>
</article>
${bookingBand('tr')}`;
  return layout({
    lang: 'tr',
    title,
    description: description.length > 155 ? description.slice(0, 150).replace(/\s+\S*$/, '') + '…' : description,
    path: maddeUrl(m),
    alt: null,
    active: 'blog',
    activeSub: 'mevzuat',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        inLanguage: 'tr',
        author: { '@type': 'Person', name: `Avukat ${L.name}`, url: absUrl(paths.about.tr) },
        mainEntityOfPage: absUrl(maddeUrl(m)),
        about: {
          '@type': 'Legislation',
          name: K.ad,
          legislationIdentifier: `${K.no} sayılı Kanun, ${maddeLabel(m)}`,
          legislationJurisdiction: 'TR',
        },
      },
      breadcrumbs('tr', [...[[t.tr.nav.blog, paths.blog.tr], [SECTIONS.mevzuat.name.tr, paths.mevzuat.tr], [K.kisa, kanunUrl(m.kanun)]], [label, maddeUrl(m)]]),
    ],
    body,
  });
}

/* ------------------------------------------------------------------ */
/* İletişim                                                            */
/* ------------------------------------------------------------------ */

export function contactPage(lang) {
  const T = pick(lang);
  const f = T({
    tr: { name: 'Ad soyad', email: 'E-posta', phone: 'Telefon (isteğe bağlı)', subject: 'Konu', message: 'Mesajınız', send: 'Mesajı gönder' },
    de: { name: 'Name', email: 'E-Mail', phone: 'Telefon (optional)', subject: 'Betreff', message: 'Ihre Nachricht', send: 'Nachricht senden' },
    en: { name: 'Name', email: 'Email', phone: 'Telephone (optional)', subject: 'Subject', message: 'Your message', send: 'Send message' },
    nl: { name: 'Naam', email: 'E-mail', phone: 'Telefoon (optioneel)', subject: 'Onderwerp', message: 'Uw bericht', send: 'Bericht versturen' },
  });
  const privacyLink = (label) => `<a href="${paths.privacy[lang]}">${label}</a>`;
  const body = `
<header class="page-head">
  <div class="wrap page-head-grid">
    <div>
      <h1>${h(t[lang].nav.contact)}</h1>
      <p class="page-lead">${T({
        tr: 'Mesaj gönderebilir veya doğrudan görüşme randevusu alabilirsiniz.',
        de: 'Schreiben Sie eine Nachricht oder buchen Sie direkt einen Gesprächstermin.',
        en: 'Send a message or book a consultation directly.',
        nl: 'Stuur een bericht of maak direct een afspraak voor een gesprek.',
      })}</p>
    </div>
    <figure class="portrait page-head-photo"><img src="${asset('/img/portre-iletisim.webp')}" width="562" height="800" alt="${h(
      T({
        tr: `Av. ${L.name} çalışma masasında`,
        de: `Avukat (Türkei) ${L.name} an ihrem Schreibtisch`,
        en: `Avukat (Turkey) ${L.name} at her desk`,
        nl: `Avukat (Turkije) ${L.name} aan haar bureau`,
      }),
    )}"></figure>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap contact-layout">
    <div>
      ${contactCards(lang)}
      <div class="aside-book">
        <p class="aside-title">${T({ tr: 'Randevu', de: 'Termin buchen', en: 'Book an appointment', nl: 'Afspraak maken' })}</p>
        <p>${h(t[lang].bookLead)}</p>
        <a class="btn" href="${paths.booking[lang]}">${h(t[lang].bookCta)}</a>
      </div>
      <div class="contact-card">
        <p class="contact-head">${T({ tr: 'Baro kayıtları', de: 'Kammer', en: 'Bar membership', nl: 'Orde van advocaten' })}</p>
        <p>İzmir Barosu<br>Rechtsanwaltskammer Düsseldorf, ${T({ tr: 'Nr.', de: 'Nr.', en: 'no.', nl: 'nr.' })} ${h(L.barDe.memberNo)}</p>
      </div>
    </div>
    <form class="form js-contact" method="post" action="/api/contact" novalidate>
      <h2>${T({ tr: 'Mesaj formu', de: 'Nachricht', en: 'Message', nl: 'Bericht' })}</h2>
      <p class="form-warn">${T({
        tr: 'Lütfen bu formda gizli ayrıntılar veya belgeler paylaşmayın. Konunun kısa bir tanımı yeterlidir.',
        de: 'Bitte übermitteln Sie über dieses Formular keine vertraulichen Einzelheiten oder Dokumente. Eine kurze Beschreibung des Anliegens genügt.',
        en: 'Please do not send confidential details or documents through this form. A brief description of your matter is sufficient.',
        nl: 'Stuur via dit formulier geen vertrouwelijke details of documenten. Een korte omschrijving van uw zaak is voldoende.',
      })}</p>
      <input type="hidden" name="lang" value="${lang}">
      <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="field"><label for="c-name">${f.name}</label><input id="c-name" name="name" required maxlength="120" autocomplete="name"></div>
      <div class="field-row">
        <div class="field"><label for="c-email">${f.email}</label><input id="c-email" name="email" type="email" required maxlength="160" autocomplete="email"></div>
        <div class="field"><label for="c-phone">${f.phone}</label><input id="c-phone" name="phone" type="tel" maxlength="40" autocomplete="tel"></div>
      </div>
      <div class="field"><label for="c-subject">${f.subject}</label>
        <select id="c-subject" name="subject" required>
          ${topicOptions(lang)}
        </select>
      </div>
      <div class="field"><label for="c-message">${f.message}</label><textarea id="c-message" name="message" rows="6" required maxlength="3000"></textarea></div>
      <div class="field check"><input id="c-consent" name="consent" type="checkbox" value="1" required>
        <label for="c-consent">${T({
          tr: `${privacyLink('Aydınlatma metnini')} okudum; bilgilerimin talebimin yanıtlanması amacıyla işlenmesini kabul ediyorum.`,
          de: `Ich habe die ${privacyLink('Datenschutzerklärung')} gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage einverstanden.`,
          en: `I have read the ${privacyLink('privacy policy')} and agree to my details being processed in order to handle my enquiry.`,
          nl: `Ik heb de ${privacyLink('privacyverklaring')} gelezen en ga akkoord met de verwerking van mijn gegevens voor de behandeling van mijn vraag.`,
        })}</label></div>
      <p class="form-note">${T({
        tr: 'Bu formun gönderilmesiyle avukat–müvekkil ilişkisi kurulmaz.',
        de: 'Durch das Absenden dieses Formulars entsteht kein Mandatsverhältnis.',
        en: 'Submitting this form does not create a lawyer–client relationship.',
        nl: 'Door het versturen van dit formulier ontstaat geen advocaat-cliëntrelatie.',
      })}</p>
      <button class="btn" type="submit">${f.send}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
  return layout({
    lang,
    title: T({ tr: 'İletişim', de: 'Kontakt', en: 'Contact', nl: 'Contact opnemen' }),
    description: T({
      tr: 'Av. Sermin Güneş Keçeci iletişim bilgileri ve iletişim formu. Kaiserswerther Str. 239, 40474 Düsseldorf.',
      de: 'Kontakt zu Avukat (Türkei) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
      en: 'Contact details for Avukat (Turkey) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
      nl: 'Contactgegevens van Avukat (Turkije) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
    }),
    path: paths.contact[lang],
    alt: paths.contact,
    attorney: true,
    active: 'contact',
    body,
    scripts: ['/js/forms.js'],
  });
}

/* ------------------------------------------------------------------ */
/* Randevu                                                             */
/* ------------------------------------------------------------------ */

export function bookingPage(lang) {
  const T = pick(lang);
  const B = config.booking;
  const types = B.types.filter((x) => x.enabled);
  const privacyLink = (label) => `<a href="${paths.privacy[lang]}">${label}</a>`;
  const body = `
<header class="page-head">
  <div class="wrap page-head-grid">
    <div>
      <h1>${T({ tr: 'Randevu al', de: 'Termin buchen', en: 'Book an appointment', nl: 'Afspraak maken' })}</h1>
      <p class="page-lead">${T({
        tr: `Görüşmeler yaklaşık ${B.durationMinutes} dakika sürer. Randevu talebiniz incelendikten sonra e-posta ile onaylanır.`,
        de: `Gespräche dauern etwa ${B.durationMinutes} Minuten und werden auf Türkisch geführt. Ihre Anfrage wird geprüft und per E-Mail bestätigt.`,
        en: `Consultations last about ${B.durationMinutes} minutes and are held in Turkish. Your request will be reviewed and confirmed by email.`,
        nl: `Een gesprek duurt ongeveer ${B.durationMinutes} minuten en wordt in het Turks gevoerd. Uw aanvraag wordt beoordeeld en per e-mail bevestigd.`,
      })}</p>
    </div>
    <figure class="portrait page-head-photo page-head-photo-sm"><img src="${asset('/img/portre-randevu.webp')}" width="268" height="503" alt="${h(portraitAlt(lang))}"></figure>
  </div>
</header>
<section class="section section-tight">
  <div class="wrap">
    <noscript><p class="form-warn">${T({
      tr: 'Randevu sistemi için JavaScript gereklidir. Dilerseniz iletişim formunu kullanabilirsiniz.',
      de: 'Für die Terminbuchung wird JavaScript benötigt. Alternativ können Sie uns über das Kontaktformular schreiben.',
      en: 'JavaScript is required to book an appointment. Alternatively, you can write to us using the contact form.',
      nl: 'Voor het maken van een afspraak is JavaScript nodig. U kunt ook het contactformulier gebruiken.',
    })} <a href="${paths.contact[lang]}">${h(t[lang].nav.contact)}</a></p></noscript>
    <form class="booking js-booking" novalidate data-lang="${lang}" data-tz="${h(B.timezone)}" data-tz2="${h(B.secondaryTimezone)}" data-cancel-path="${paths.cancel[lang]}">
      <input type="hidden" name="lang" value="${lang}">
      <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>

      <fieldset class="bk-step" data-step="1">
        <legend><span class="bk-num">1</span>${T({ tr: 'Görüşme türü ve konu', de: 'Gesprächsart und Thema', en: 'Type of consultation and topic', nl: 'Soort gesprek en onderwerp' })}</legend>
        <div class="choice-grid">
          ${types
            .map(
              (x, i) => `<label class="choice"><input type="radio" name="type" value="${h(x.id)}"${i === 0 ? ' checked' : ''} required>
              <span>${h(x[lang])}</span></label>`,
            )
            .join('')}
        </div>
        <div class="field"><label for="b-topic">${T({ tr: 'Hukuki konu', de: 'Rechtsgebiet', en: 'Practice area', nl: 'Rechtsgebied' })}</label>
          <select id="b-topic" name="topic" required>
            ${topicOptions(lang)}
          </select>
        </div>
      </fieldset>

      <fieldset class="bk-step" data-step="2">
        <legend><span class="bk-num">2</span>${T({ tr: 'Tarih ve saat', de: 'Datum und Uhrzeit', en: 'Date and time', nl: 'Datum en tijd' })}</legend>
        <p class="muted small">${T({
          tr: 'Saatler Almanya saatine (Düsseldorf) göredir. Parantez içinde Türkiye saati yer alır.',
          de: 'Alle Zeiten in deutscher Zeit (Düsseldorf). In Klammern die Uhrzeit in der Türkei.',
          en: 'All times are in German time (Düsseldorf). The time in Türkiye is shown alongside.',
          nl: 'Alle tijden zijn in Duitse tijd (Düsseldorf), gelijk aan de Nederlandse tijd. Daarnaast staat de tijd in Turkije.',
        })}</p>
        <div class="bk-picker">
          <div class="cal" aria-live="polite">
            <div class="cal-head">
              <button type="button" class="cal-nav" data-dir="-1" aria-label="${T({ tr: 'Önceki ay', de: 'Vorheriger Monat', en: 'Previous month', nl: 'Vorige maand' })}">‹</button>
              <p class="cal-month"></p>
              <button type="button" class="cal-nav" data-dir="1" aria-label="${T({ tr: 'Sonraki ay', de: 'Nächster Monat', en: 'Next month', nl: 'Volgende maand' })}">›</button>
            </div>
            <div class="cal-grid" role="grid"></div>
          </div>
          <div class="slots">
            <p class="slots-title">${T({ tr: 'Önce bir tarih seçin.', de: 'Bitte zuerst ein Datum wählen.', en: 'Please select a date first.', nl: 'Kies eerst een datum.' })}</p>
            <div class="slot-list" role="radiogroup"></div>
          </div>
        </div>
      </fieldset>

      <fieldset class="bk-step" data-step="3">
        <legend><span class="bk-num">3</span>${T({ tr: 'Bilgileriniz', de: 'Ihre Angaben', en: 'Your details', nl: 'Uw gegevens' })}</legend>
        <div class="field"><label for="b-name">${T({ tr: 'Ad soyad', de: 'Name', en: 'Name', nl: 'Naam' })}</label><input id="b-name" name="name" required maxlength="120" autocomplete="name"></div>
        <div class="field-row">
          <div class="field"><label for="b-email">${T({ tr: 'E-posta', de: 'E-Mail', en: 'Email', nl: 'E-mail' })}</label><input id="b-email" name="email" type="email" required maxlength="160" autocomplete="email"></div>
          <div class="field"><label for="b-phone">${T({ tr: 'Telefon', de: 'Telefon', en: 'Telephone', nl: 'Telefoon' })}</label><input id="b-phone" name="phone" type="tel" required maxlength="40" autocomplete="tel"></div>
        </div>
        <div class="field"><label for="b-note">${T({ tr: 'Konunun kısa açıklaması', de: 'Kurze Beschreibung Ihres Anliegens', en: 'Brief description of your matter', nl: 'Korte omschrijving van uw zaak' })}</label>
          <textarea id="b-note" name="note" rows="4" maxlength="1500" aria-describedby="b-note-hint"></textarea>
          <p id="b-note-hint" class="hint">${T({
            tr: 'Lütfen yalnızca kısa bir açıklama yazın; gizli ayrıntıları görüşmede paylaşabilirsiniz.',
            de: 'Bitte nur eine kurze Beschreibung, keine vertraulichen Einzelheiten.',
            en: 'Please give only a brief description, without confidential details.',
            nl: 'Geef alleen een korte omschrijving, zonder vertrouwelijke details.',
          })}</p>
        </div>
        <div class="field check"><input id="b-consent" name="consent" type="checkbox" value="1" required>
          <label for="b-consent">${T({
            tr: `${privacyLink('Aydınlatma metnini')} okudum; bilgilerimin randevu planlaması amacıyla işlenmesini kabul ediyorum.`,
            de: `Ich habe die ${privacyLink('Datenschutzerklärung')} gelesen und bin mit der Verarbeitung meiner Angaben zur Terminvereinbarung einverstanden.`,
            en: `I have read the ${privacyLink('privacy policy')} and agree to my details being processed in order to arrange an appointment.`,
            nl: `Ik heb de ${privacyLink('privacyverklaring')} gelezen en ga akkoord met de verwerking van mijn gegevens voor het plannen van een afspraak.`,
          })}</label></div>
      </fieldset>

      <div class="bk-summary" hidden></div>
      <p class="form-note">${T({
        tr: 'Randevu talebi avukat–müvekkil ilişkisi kurmaz. Görüşmenin kapsamı ve ücretine ilişkin bilgi, randevu onayıyla birlikte iletilir.',
        de: 'Die Terminanfrage begründet noch kein Mandatsverhältnis. Informationen zu Honorar und Ablauf erhalten Sie mit der Terminbestätigung.',
        en: 'An appointment request does not create a lawyer–client relationship. Information on fees and the procedure will be sent with the appointment confirmation.',
        nl: 'Een afspraakaanvraag doet nog geen advocaat-cliëntrelatie ontstaan. Informatie over het honorarium en de werkwijze ontvangt u bij de bevestiging van de afspraak.',
      })}</p>
      <button class="btn" type="submit">${T({ tr: 'Randevu talebini gönder', de: 'Terminanfrage senden', en: 'Send appointment request', nl: 'Afspraakaanvraag versturen' })}</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="booking-done" hidden tabindex="-1"></div>
  </div>
</section>`;
  return layout({
    lang,
    title: T({ tr: 'Randevu Al', de: 'Termin buchen', en: 'Book an appointment', nl: 'Afspraak maken' }),
    description: T({
      tr: 'Av. Sermin Güneş Keçeci ile online görüntülü, telefonla veya Düsseldorf’ta yüz yüze görüşme için randevu alın.',
      de: 'Online einen Gesprächstermin mit Avukat (Türkei) Sermin Güneş Keçeci buchen – per Video, Telefon oder persönlich in Düsseldorf.',
      en: 'Book a consultation online with Avukat (Turkey) Sermin Güneş Keçeci – by video, by telephone or in person in Düsseldorf.',
      nl: 'Maak online een afspraak met Avukat (Turkije) Sermin Güneş Keçeci – via video, telefonisch of persoonlijk in Düsseldorf.',
    }),
    path: paths.booking[lang],
    alt: paths.booking,
    active: 'booking',
    body,
    scripts: ['/js/booking.js'],
  });
}

export function cancelPage(lang, appt, state, token) {
  const T = pick(lang);
  const B = config.booking;
  const title = T({ tr: 'Randevu iptali', de: 'Termin stornieren', en: 'Cancel appointment', nl: 'Afspraak annuleren' });
  let inner;
  if (!appt) {
    inner = `<p>${T({ tr: 'Bu bağlantı geçersiz veya süresi dolmuş.', de: 'Dieser Link ist ungültig oder abgelaufen.', en: 'This link is invalid or has expired.', nl: 'Deze link is ongeldig of verlopen.' })}</p>`;
  } else {
    const when = new Date(appt.start_utc).toLocaleString(intlLocale[lang], {
      timeZone: B.timezone,
      dateStyle: 'full',
      timeStyle: 'short',
    });
    if (state === 'done' || appt.status === 'cancelled') {
      inner = `<p class="lead">${T({ tr: 'Randevu iptal edildi.', de: 'Der Termin wurde storniert.', en: 'The appointment has been cancelled.', nl: 'De afspraak is geannuleerd.' })}</p>
        <p>${when}</p>
        <a class="btn" href="${paths.booking[lang]}">${T({ tr: 'Yeni randevu al', de: 'Neuen Termin buchen', en: 'Book a new appointment', nl: 'Nieuwe afspraak maken' })}</a>`;
    } else if (new Date(appt.start_utc) < new Date()) {
      inner = `<p>${T({ tr: 'Bu randevunun tarihi geçmiştir.', de: 'Dieser Termin liegt in der Vergangenheit.', en: 'This appointment is in the past.', nl: 'Deze afspraak ligt in het verleden.' })}</p>`;
    } else {
      inner = `<p class="lead">${when} ${T({ tr: '(Almanya saati)', de: '(deutsche Zeit)', en: '(German time)', nl: '(Duitse tijd)' })}</p>
        <p>${T({ tr: 'Bu randevuyu iptal etmek istiyor musunuz?', de: 'Möchten Sie diesen Termin stornieren?', en: 'Would you like to cancel this appointment?', nl: 'Wilt u deze afspraak annuleren?' })}</p>
        <form method="post" action="${paths.cancel[lang]}/${h(token)}"><button class="btn" type="submit">${T({ tr: 'Randevuyu iptal et', de: 'Termin stornieren', en: 'Cancel appointment', nl: 'Afspraak annuleren' })}</button></form>`;
    }
  }
  return layout({
    lang,
    title,
    description: title,
    path: paths.cancel[lang],
    alt: null,
    active: 'booking',
    noindex: true,
    body: `<header class="page-head"><div class="wrap"><h1>${title}</h1></div></header>
      <section class="section section-tight"><div class="wrap wrap-narrow prose">${inner}</div></section>`,
  });
}

export function notFound(lang) {
  const T = pick(lang);
  const title = T({ tr: 'Sayfa bulunamadı', de: 'Seite nicht gefunden', en: 'Page not found', nl: 'Pagina niet gevonden' });
  return layout({
    lang,
    title,
    description: '',
    path: '/404',
    alt: paths.home,
    noindex: true,
    body: `<header class="page-head"><div class="wrap"><h1>${title}</h1>
      <p class="page-lead">${T({ tr: 'Aradığınız adres mevcut değil.', de: 'Die aufgerufene Adresse existiert nicht.', en: 'The address you requested does not exist.', nl: 'Het opgevraagde adres bestaat niet.' })}</p>
      <p><a class="btn" href="${paths.home[lang]}">${T({ tr: 'Ana sayfaya dön', de: 'Zur Startseite', en: 'Back to the home page', nl: 'Naar de startpagina' })}</a></p></div></header>`,
  });
}

export { legalPage, missing };
