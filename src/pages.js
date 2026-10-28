import config from '../site.config.js';
import { areas } from './content/areas.js';
import { crossBorderTopics, values } from './content/crossborder.js';
import { paths, t, scopeNotice, LANGS, langNames, intlLocale, isForeign } from './i18n.js';
import { layout, h, strandsSvg, formatDate, missing, absUrl } from './layout.js';
import { posts, pairOf, markdown, readingMinutes, postUrl, headings } from './blog.js';
import { legalPage } from './legal.js';
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

// Fotoğrafların alternatif metni: Almanya'ya yönelik dillerde Almanya'daki unvan kullanılır.
const portraitAlt = (lang) => (isForeign(lang) ? `Avukat (Türkei) ${L.name}` : `Av. ${L.name}`);

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
      <h1><span class="h1-pre">${isForeign(lang) ? 'Avukat (Türkei)' : 'Avukat'}</span>${h(L.name)}</h1>
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
      <img src="/img/portre-ana.jpg" width="689" height="900" alt="${h(portraitAlt(lang))}" fetchpriority="high">
      <img class="hero-badge" src="/img/logo-160.png" width="160" height="144" alt="">
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
    title: null,
    description: T({
      tr: 'Av. Sermin Güneş Keçeci – İzmir Barosu ve Rechtsanwaltskammer Düsseldorf. Türkiye ve Almanya bağlantılı boşanma, miras, gayrimenkul ve tanıma-tenfiz süreçleri.',
      de: 'Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf: Beratung im türkischen Recht – Scheidung, Erbschaft, Immobilien und Anerkennung deutscher Urteile in der Türkei.',
      en: 'Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf: advice under Turkish law – divorce, inheritance, real estate and recognition of foreign judgments in Türkiye.',
      nl: 'Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf: advies naar Turks recht – echtscheiding, erfrecht, vastgoed en erkenning van buitenlandse vonnissen in Turkije.',
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
      en: 'Avukat (Türkei) Sermin Güneş Keçeci — career, bar admissions and approach.',
      nl: 'Avukat (Türkei) Sermin Güneş Keçeci — loopbaan, toelatingen en werkwijze.',
    })}</p>
  </div>
</header>

<section class="section section-tight">
  <div class="wrap split">
    <figure class="about-figure portrait"><img src="/img/portre-hakkimda.jpg" width="591" height="514" alt="${h(portraitAlt(lang))}" loading="lazy"></figure>
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
      en: 'Career of Avukat (Türkei) Sermin Güneş Keçeci: law degree in İzmir, admitted in 2018, Güneş Hukuk Bürosu and membership of the Rechtsanwaltskammer Düsseldorf under § 206 BRAO.',
      nl: 'Loopbaan van Avukat (Türkei) Sermin Güneş Keçeci: rechtenstudie in İzmir, toegelaten in 2018, Güneş Hukuk Bürosu en lidmaatschap van de Rechtsanwaltskammer Düsseldorf op grond van § 206 BRAO.',
    }),
    path: paths.about[lang],
    alt: paths.about,
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
  const items = a.items[lang].slice(0, 4).join(', ');
  return layout({
    lang,
    title: T({ tr: title, de: `${title} (türkisches Recht)`, en: `${title} (Turkish law)`, nl: `${title} (Turks recht)` }),
    description: T({
      tr: `${title}: ${items}. Av. Sermin Güneş Keçeci, İzmir ve Düsseldorf.`,
      de: `${title} nach türkischem Recht: ${items}. Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf.`,
      en: `${title} under Turkish law: ${items}. Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf.`,
      nl: `${title} naar Turks recht: ${items}. Avukat (Türkei) Sermin Güneş Keçeci, Düsseldorf.`,
    }),
    path: areaPath(lang, a),
    alt: allLangs((l) => areaPath(l, a)),
    active: 'areas',
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
      en: 'Avukat (Türkei) in Düsseldorf: divorce in Türkiye, recognition of foreign divorce judgments, inheritance and real estate in Türkiye, power of attorney from abroad.',
      nl: 'Avukat (Türkei) in Düsseldorf: echtscheiding in Turkije, erkenning van buitenlandse echtscheidingsvonnissen, erfenis en vastgoed in Turkije, volmacht vanuit het buitenland.',
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
      en: 'Articles by Avukat (Türkei) Sermin Güneş Keçeci on current developments in Turkish law and legal matters in Türkiye.',
      nl: 'Artikelen van Avukat (Türkei) Sermin Güneş Keçeci over actuele ontwikkelingen in het Turkse recht en juridische zaken in Turkije.',
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
      en: 'Turkish statutory provisions explained: wording, legislative reasoning and application in practice – Avukat (Türkei) Sermin Güneş Keçeci.',
      nl: 'Turkse wetsartikelen uitgelegd: tekst, toelichting en toepassing in de praktijk – Avukat (Türkei) Sermin Güneş Keçeci.',
    },
  },
};
const sectionPath = (category) => (category === 'mevzuat' ? paths.mevzuat : paths.blog);

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
    ${category === 'mevzuat' ? `<nav class="crumbs" aria-label="${T({ tr: 'Sayfa yolu', de: 'Brotkrumen', en: 'Breadcrumb', nl: 'Kruimelpad' })}"><a href="${paths.blog[lang]}">${h(t[lang].nav.blog)}</a></nav>` : ''}
    <h1>${h(category === 'mevzuat' ? S.name[lang] : t[lang].nav.blog)}</h1>
    <p class="page-lead">${h(S.lead[lang])}</p>
    <nav class="section-tabs" aria-label="${T({ tr: 'Bölümler', de: 'Rubriken', en: 'Sections', nl: 'Rubrieken' })}">${tabs}</nav>
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
                <h2><a href="${postUrl(p)}">${h(p.title)}</a></h2>
                <p>${h(p.description || '')}</p>
              </article></li>`,
            )
            .join('')}</ul>${pager}`
        : empty
    }
  </div>
</section>`;
  const title = category === 'mevzuat' ? S.name[lang] : t[lang].nav.blog;
  return layout({
    lang,
    title: page > 1 ? `${title} (${page})` : title,
    description: S.description[lang],
    path: pageUrl(page),
    alt: page > 1 ? null : sectionPath(category),
    active: 'blog',
    jsonLd: [breadcrumbs(lang, category === 'mevzuat' ? [[t[lang].nav.blog, paths.blog[lang]], [S.name[lang], base]] : [[t[lang].nav.blog, base]])],
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
  const published = p.publish_at || `${p.date}T08:00:00+03:00`;
  const author = {
    '@type': 'Person',
    name: `${isForeign(lang) ? L.titleDe : L.titleTr} ${L.name}`,
    url: absUrl(paths.about[lang]),
    jobTitle: isForeign(lang) ? L.titleDe : L.titleTr,
  };
  const crumbItems = [[t[lang].nav.blog, paths.blog[lang]], ...(mevzuat ? [[SECTIONS.mevzuat.name[lang], paths.mevzuat[lang]]] : []), [p.title, postUrl(p)]];
  const body = `
<article class="post">
  <header class="page-head">
    <div class="wrap wrap-narrow">
      <nav class="crumbs" aria-label="${T({ tr: 'Sayfa yolu', de: 'Brotkrumen', en: 'Breadcrumb', nl: 'Kruimelpad' })}"><a href="${paths.blog[lang]}">${h(t[lang].nav.blog)}</a>${
        mevzuat ? ` <span aria-hidden="true">/</span> <a href="${paths.mevzuat[lang]}">${h(SECTIONS.mevzuat.name[lang])}</a>` : ''
      }</nav>
      <h1>${h(p.title)}</h1>
      <p class="post-meta"><time datetime="${h(p.date)}">${h(fmtFull(p.date, lang))}</time> <span aria-hidden="true">/</span> ${readingMinutes(p.body)} ${T({ tr: 'dk okuma', de: 'Min. Lesezeit', en: 'min read', nl: 'min. leestijd' })} <span aria-hidden="true">/</span> ${h(isForeign(lang) ? L.titleDe : 'Av.')} ${h(L.name)}</p>
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
    alt: allLangs((l) => {
      const twin = pairOf(p, l);
      return twin ? postUrl(twin) : sectionPath(p.category)[l];
    }),
    active: 'blog',
    noindex: preview,
    article: { published, modified: p.updated_at, section: (mevzuat ? SECTIONS.mevzuat : SECTIONS.blog).name[lang] },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': mevzuat ? 'Article' : 'BlogPosting',
        headline: p.title,
        description: p.description || undefined,
        inLanguage: lang,
        datePublished: published,
        dateModified: p.updated_at || published,
        author,
        publisher: author,
        image: absUrl('/img/portre-ana.jpg'),
        mainEntityOfPage: absUrl(postUrl(p)),
        articleSection: (mevzuat ? SECTIONS.mevzuat : SECTIONS.blog).name[lang],
        wordCount: p.body.split(/\s+/).length,
      },
      breadcrumbs(lang, crumbItems),
    ],
    body: preview ? `<p class="preview-bar">Önizleme${p.status === 'draft' ? ' — bu yazı taslak, sitede görünmüyor' : ''}. <a href="/yonetim/yazilar/${p.id}">Düzenlemeye dön</a></p>${body}` : body,
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
    <figure class="portrait page-head-photo"><img src="/img/portre-iletisim.jpg" width="562" height="800" alt="${h(
      T({
        tr: `Av. ${L.name} çalışma masasında`,
        de: `Avukat (Türkei) ${L.name} an ihrem Schreibtisch`,
        en: `Avukat (Türkei) ${L.name} at her desk`,
        nl: `Avukat (Türkei) ${L.name} aan haar bureau`,
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
    title: t[lang].nav.contact,
    description: T({
      tr: 'Av. Sermin Güneş Keçeci iletişim bilgileri ve iletişim formu. Kaiserswerther Str. 239, 40474 Düsseldorf.',
      de: 'Kontakt zu Avukat (Türkei) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
      en: 'Contact details for Avukat (Türkei) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
      nl: 'Contactgegevens van Avukat (Türkei) Sermin Güneş Keçeci, Kaiserswerther Str. 239, 40474 Düsseldorf.',
    }),
    path: paths.contact[lang],
    alt: paths.contact,
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
    <figure class="portrait page-head-photo page-head-photo-sm"><img src="/img/portre-randevu.jpg" width="268" height="503" alt="${h(portraitAlt(lang))}"></figure>
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
      en: 'Book a consultation online with Avukat (Türkei) Sermin Güneş Keçeci – by video, by telephone or in person in Düsseldorf.',
      nl: 'Maak online een afspraak met Avukat (Türkei) Sermin Güneş Keçeci – via video, telefonisch of persoonlijk in Düsseldorf.',
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
