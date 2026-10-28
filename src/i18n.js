// Sayfa yolları ve arayüz metinleri (TR / DE).

export const LANGS = ['tr', 'de'];

export const paths = {
  home: { tr: '/', de: '/de/' },
  about: { tr: '/hakkimda', de: '/de/ueber-mich' },
  areas: { tr: '/calisma-alanlari', de: '/de/rechtsgebiete' },
  crossborder: { tr: '/turkiye-almanya', de: '/de/tuerkei-deutschland' },
  blog: { tr: '/yayinlar', de: '/de/publikationen' },
  contact: { tr: '/iletisim', de: '/de/kontakt' },
  booking: { tr: '/randevu', de: '/de/termin' },
  cancel: { tr: '/randevu/iptal', de: '/de/termin/stornieren' },
  imprint: { tr: '/yasal-bilgiler', de: '/de/impressum' },
  privacy: { tr: '/gizlilik-ve-kvkk', de: '/de/datenschutz' },
  cookies: { tr: '/cerez-politikasi', de: '/de/cookie-richtlinie' },
};

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
    menu: 'Menü',
    close: 'Kapat',
    otherLang: 'Deutsch',
    otherLangShort: 'DE',
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
    menu: 'Menü',
    close: 'Schließen',
    otherLang: 'Türkçe',
    otherLangShort: 'TR',
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
};

// § 206 BRAO kapsam açıklaması — sitenin birçok yerinde aynı metin kullanılır.
export const scopeNotice = {
  tr: 'Sermin Güneş Keçeci, Almanya’da § 206 BRAO kapsamında Rechtsanwaltskammer Düsseldorf’a kayıtlı Türk avukattır ve Almanya’da “Avukat (Türkei)” mesleki unvanını kullanır. Almanya’daki hukuki danışmanlık faaliyeti Türk hukuku ve uluslararası hukuk alanlarıyla sınırlıdır; Alman hukukuna ilişkin konularda danışmanlık ve temsil hizmeti verilmez.',
  de: 'Sermin Güneş Keçeci ist in der Türkei zugelassene Avukat und gemäß § 206 BRAO Mitglied der Rechtsanwaltskammer Düsseldorf. Sie führt die Berufsbezeichnung „Avukat (Türkei)“. Ihre Rechtsberatung in Deutschland ist auf das türkische Recht und das Völkerrecht beschränkt. Sie ist keine in Deutschland zugelassene Rechtsanwältin und berät nicht im deutschen Recht.',
};
