// Sayfa yolları ve arayüz metinleri (TR / DE / EN / NL).

export const LANGS = ['tr', 'de', 'en', 'nl'];

// Dil kodu → dilin kendi adı (dil değiştiricide kullanılır).
export const langNames = { tr: 'Türkçe', de: 'Deutsch', en: 'English', nl: 'Nederlands' };

// Tarih ve saat biçimlendirme için yerel ayarlar.
export const intlLocale = { tr: 'tr-TR', de: 'de-DE', en: 'en-GB', nl: 'nl-NL' };

// Türkçe dışındaki diller Almanya'daki ziyaretçilere yöneliktir; bu sayfalarda
// "Avukat (Türkei)" unvanı ve § 206 BRAO kapsam açıklaması gösterilir.
export const isForeign = (lang) => lang !== 'tr';

// Başlık, menü ve açıklamalarda gösterilen unvan. Almanya'daki resmî biçim "Avukat (Türkei)"
// yasal metinlerde (Impressum, § 206 BRAO açıklaması) olduğu gibi kalır; İngilizce ve
// Hollandaca sayfalarda ülke adı o dilde yazılır.
export const proTitle = { tr: 'Avukat', de: 'Avukat (Türkei)', en: 'Avukat (Turkey)', nl: 'Avukat (Turkije)' };

export const paths = {
  home: { tr: '/', de: '/de/', en: '/en/', nl: '/nl/' },
  about: { tr: '/hakkimda', de: '/de/ueber-mich', en: '/en/about', nl: '/nl/over-mij' },
  areas: { tr: '/calisma-alanlari', de: '/de/rechtsgebiete', en: '/en/practice-areas', nl: '/nl/rechtsgebieden' },
  crossborder: { tr: '/turkiye-almanya', de: '/de/tuerkei-deutschland', en: '/en/turkiye-germany', nl: '/nl/turkije-duitsland' },
  blog: { tr: '/yayinlar', de: '/de/publikationen', en: '/en/publications', nl: '/nl/publicaties' },
  makaleler: { tr: '/yayinlar/makaleler', de: '/de/publikationen/beitraege', en: '/en/publications/articles', nl: '/nl/publicaties/artikelen' },
  mevzuat: { tr: '/yayinlar/mevzuat', de: '/de/publikationen/gesetze', en: '/en/publications/legislation', nl: '/nl/publicaties/wetgeving' },
  contact: { tr: '/iletisim', de: '/de/kontakt', en: '/en/contact', nl: '/nl/contact' },
  booking: { tr: '/randevu', de: '/de/termin', en: '/en/appointment', nl: '/nl/afspraak' },
  cancel: { tr: '/randevu/iptal', de: '/de/termin/stornieren', en: '/en/appointment/cancel', nl: '/nl/afspraak/annuleren' },
  imprint: { tr: '/yasal-bilgiler', de: '/de/impressum', en: '/en/legal-notice', nl: '/nl/colofon' },
  privacy: { tr: '/gizlilik-ve-kvkk', de: '/de/datenschutz', en: '/en/privacy', nl: '/nl/privacy' },
  cookies: { tr: '/cerez-politikasi', de: '/de/cookie-richtlinie', en: '/en/cookie-policy', nl: '/nl/cookiebeleid' },
};

// Yolun hangi dile ait olduğunu bulur (/de, /en, /nl önekleri; diğerleri Türkçe).
export const langOf = (pathname) => LANGS.find((l) => l !== 'tr' && (pathname === `/${l}` || pathname.startsWith(`/${l}/`))) || 'tr';

export const t = {
  tr: {
    htmlLang: 'tr',
    locale: 'tr_TR',
    skip: 'İçeriğe geç',
    nav: {
      about: 'Hakkımda',
      areas: 'Çalışma Alanları',
      crossborder: 'Türkiye–Almanya',
      blog: 'Hukuki Yayınlar',
      contact: 'İletişim',
      booking: 'Randevu al',
    },
    navLabel: 'Ana menü',
    langLabel: 'Dil seçimi',
    menu: 'Menü',
    close: 'Kapat',
    titleLine: 'Avukat',
    bars: 'İzmir Barosu | Rechtsanwaltskammer Düsseldorf',
    footer: {
      disclaimer:
        'Bu sitedeki içerikler genel bilgilendirme amaçlıdır ve hukuki danışmanlık yerine geçmez. Site üzerinden iletilen bilgiler avukat-müvekkil ilişkisi kurmaz.',
      legal: 'Yasal bilgiler',
      privacy: 'Gizlilik ve KVKK',
      cookies: 'Çerez politikası',
      deAddress: 'Düsseldorf',
      trOffice: 'İzmir',
    },
    readMore: 'Ayrıntılar',
    allAreas: 'Tüm çalışma alanları',
    bookCta: 'Randevu al',
    bookLead: 'Görüşme için uygun bir zaman seçin.',
    missing: 'eklenecek',
  },
  de: {
    htmlLang: 'de',
    locale: 'de_DE',
    skip: 'Zum Inhalt springen',
    nav: {
      about: 'Über mich',
      areas: 'Rechtsgebiete',
      crossborder: 'Türkei–Deutschland',
      blog: 'Publikationen',
      contact: 'Kontakt',
      booking: 'Termin buchen',
    },
    navLabel: 'Hauptnavigation',
    langLabel: 'Sprache wählen',
    menu: 'Menü',
    close: 'Schließen',
    titleLine: 'Avukat (Türkei)',
    bars: 'İzmir Barosu | Rechtsanwaltskammer Düsseldorf',
    footer: {
      disclaimer:
        'Die Inhalte dieser Website dienen der allgemeinen Information und ersetzen keine Rechtsberatung. Durch die Kontaktaufnahme über diese Website wird kein Mandatsverhältnis begründet.',
      legal: 'Impressum',
      privacy: 'Datenschutz',
      cookies: 'Cookie-Richtlinie',
      deAddress: 'Düsseldorf',
      trOffice: 'İzmir',
    },
    readMore: 'Mehr erfahren',
    allAreas: 'Alle Rechtsgebiete',
    bookCta: 'Termin buchen',
    bookLead: 'Wählen Sie einen passenden Gesprächstermin.',
    missing: 'noch zu ergänzen',
  },
  en: {
    htmlLang: 'en',
    locale: 'en_GB',
    skip: 'Skip to content',
    nav: {
      about: 'About',
      areas: 'Practice Areas',
      crossborder: 'Türkiye–Germany',
      blog: 'Publications',
      contact: 'Contact',
      booking: 'Book an appointment',
    },
    navLabel: 'Main navigation',
    langLabel: 'Choose language',
    menu: 'Menu',
    close: 'Close',
    titleLine: 'Avukat (Turkey)',
    bars: 'İzmir Barosu | Rechtsanwaltskammer Düsseldorf',
    footer: {
      disclaimer:
        'The content of this website is for general information only and does not constitute legal advice. Contacting us through this website does not create a lawyer–client relationship.',
      legal: 'Legal notice',
      privacy: 'Privacy',
      cookies: 'Cookie policy',
      deAddress: 'Düsseldorf',
      trOffice: 'İzmir',
    },
    readMore: 'Read more',
    allAreas: 'All practice areas',
    bookCta: 'Book an appointment',
    bookLead: 'Choose a convenient time for a consultation.',
    missing: 'to be added',
  },
  nl: {
    htmlLang: 'nl',
    locale: 'nl_NL',
    skip: 'Naar de inhoud',
    nav: {
      about: 'Over mij',
      areas: 'Rechtsgebieden',
      crossborder: 'Turkije–Duitsland',
      blog: 'Publicaties',
      contact: 'Contact',
      booking: 'Afspraak maken',
    },
    navLabel: 'Hoofdnavigatie',
    langLabel: 'Taal kiezen',
    menu: 'Menu',
    close: 'Sluiten',
    titleLine: 'Avukat (Turkije)',
    bars: 'İzmir Barosu | Rechtsanwaltskammer Düsseldorf',
    footer: {
      disclaimer:
        'De inhoud van deze website is uitsluitend bedoeld als algemene informatie en vormt geen juridisch advies. Door contact op te nemen via deze website ontstaat geen advocaat-cliëntrelatie.',
      legal: 'Colofon',
      privacy: 'Privacy',
      cookies: 'Cookiebeleid',
      deAddress: 'Düsseldorf',
      trOffice: 'İzmir',
    },
    readMore: 'Meer informatie',
    allAreas: 'Alle rechtsgebieden',
    bookCta: 'Afspraak maken',
    bookLead: 'Kies een geschikt tijdstip voor een gesprek.',
    missing: 'nog aan te vullen',
  },
};

// § 206 BRAO kapsam açıklaması — sitenin birçok yerinde aynı metin kullanılır.
export const scopeNotice = {
  tr: 'Sermin Güneş Keçeci, Almanya’da § 206 BRAO kapsamında Rechtsanwaltskammer Düsseldorf’a kayıtlı Türk avukattır ve Almanya’da “Avukat (Türkei)” mesleki unvanını kullanır. Almanya’daki hukuki danışmanlık faaliyeti Türk hukuku ve uluslararası hukuk alanlarıyla sınırlıdır; Alman hukukuna ilişkin konularda danışmanlık ve temsil hizmeti verilmez.',
  de: 'Sermin Güneş Keçeci ist in der Türkei zugelassene Avukat und gemäß § 206 BRAO Mitglied der Rechtsanwaltskammer Düsseldorf. Sie führt die Berufsbezeichnung „Avukat (Türkei)“. Ihre Rechtsberatung in Deutschland ist auf das türkische Recht und das Völkerrecht beschränkt. Sie ist keine in Deutschland zugelassene Rechtsanwältin und berät nicht im deutschen Recht.',
  en: 'Sermin Güneş Keçeci is a lawyer (Avukat) admitted in Türkiye and, under § 206 of the German Federal Lawyers’ Act (BRAO), a member of the Düsseldorf Bar (Rechtsanwaltskammer Düsseldorf). In Germany she practises under the professional title “Avukat (Türkei)”. Her legal advice in Germany is limited to Turkish law and public international law. She is not admitted as a German Rechtsanwältin and does not advise on German law or the law of any other country.',
  nl: 'Sermin Güneş Keçeci is in Turkije toegelaten advocaat (Avukat) en op grond van § 206 van de Duitse advocatenwet (BRAO) lid van de Orde van Advocaten in Düsseldorf (Rechtsanwaltskammer Düsseldorf). In Duitsland voert zij de beroepstitel „Avukat (Türkei)”. Haar juridisch advies in Duitsland is beperkt tot het Turkse recht en het internationaal publiekrecht. Zij is niet toegelaten als Rechtsanwältin in Duitsland of als advocaat in Nederland en adviseert niet over Duits of Nederlands recht.',
};
