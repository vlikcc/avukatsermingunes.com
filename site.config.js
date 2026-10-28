// Sitenin tek yapılandırma dosyası.
// `null` bırakılan alanlar sitede gösterilmez; Impressum gibi yasal zorunlu
// alanlarda ise "eklenecek" uyarısı görünür. Yayından önce hepsini doldurun.
// Bilinmeyen bilgileri tahmin ederek doldurmayın.

export default {
  // Yayın adresi, ör. "https://www.ornek-alanadi.com" (sonda / olmadan).
  // Canonical, hreflang ve sitemap bağlantıları bu adresle üretilir.
  siteUrl: process.env.PUBLIC_URL || null,

  lawyer: {
    name: 'Sermin Güneş Keçeci',
    titleTr: 'Avukat',
    titleDe: 'Avukat (Türkei)',
    office: 'Güneş Hukuk Bürosu',
    officeFounded: 2018,
    university: 'Dokuz Eylül Üniversitesi Hukuk Fakültesi',
    universityDe: 'Juristische Fakultät der Dokuz-Eylül-Universität',
    graduated: 2016,
    barTr: {
      name: 'İzmir Barosu',
      nameDe: 'Rechtsanwaltskammer İzmir (İzmir Barosu)',
      licenseDate: '2018-01-30',
      registryNo: null, // İzmir Barosu sicil numarası
      url: 'https://www.izmirbarosu.org.tr',
    },
    barDe: {
      name: 'Rechtsanwaltskammer Düsseldorf',
      memberNo: '59669',
      registeredAt: '2024-10-31',
      address: 'Freiligrathstraße 25, 40479 Düsseldorf',
      url: 'https://www.rak-dus.de',
    },
  },

  contact: {
    email: null, // ör. "info@ornek-alanadi.com" — Impressum için zorunlu
    phoneDe: null, // ör. "+49 211 ..." — Impressum için zorunlu (veya başka hızlı iletişim yolu)
    phoneTr: null,
    addressDe: {
      street: 'Kaiserswerther Str. 239',
      city: '40474 Düsseldorf',
      country: 'Deutschland',
    },
    addressTr: null, // ör. { street: '...', city: '35... İzmir', country: 'Türkiye' }
  },

  // Impressum / mesleki sorumluluk sigortası (§ 2 DL-InfoV)
  insurance: {
    insurer: null, // Sigorta şirketinin adı
    address: null, // Sigorta şirketinin adresi
    scope: null, // Coğrafi kapsam, ör. "Deutschland und Türkei"
  },
  vatId: null, // USt-IdNr. varsa

  // Gizlilik metinlerinde adı geçecek hizmet sağlayıcılar.
  privacy: {
    hostingProvider: null, // ör. "Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen"
    hostingLocation: null, // ör. "Almanya" / "Deutschland"
    mailProvider: null, // E-posta bildirimleri için kullanılan SMTP sağlayıcısı
    retentionDays: 180, // Randevu talepleri ve mesajların otomatik silinme süresi
  },

  // Sosyal medya hesapları: yalnızca gerçek hesaplar eklenmeli. Boş bırakılırsa gösterilmez.
  social: [],

  booking: {
    // Randevu saatleri bu saat dilimine göre tanımlanır ve gösterilir.
    timezone: 'Europe/Berlin',
    // Ziyaretçiye ikinci saat olarak gösterilecek saat dilimi.
    secondaryTimezone: 'Europe/Istanbul',
    durationMinutes: 45,
    // Haftalık çalışma saatleri (timezone'a göre). Her gün için [başlangıç, bitiş] aralıkları.
    weekly: {
      mon: [['09:00', '12:00'], ['13:30', '17:00']],
      tue: [['09:00', '12:00'], ['13:30', '17:00']],
      wed: [['09:00', '12:00'], ['13:30', '17:00']],
      thu: [['09:00', '12:00'], ['13:30', '17:00']],
      fri: [['09:00', '12:00']],
      sat: [],
      sun: [],
    },
    slotStepMinutes: 60,
    minNoticeHours: 24,
    maxDaysAhead: 45,
    types: [
      { id: 'video', enabled: true, tr: 'Online görüntülü görüşme', de: 'Online-Videogespräch' },
      { id: 'phone', enabled: true, tr: 'Telefon görüşmesi', de: 'Telefongespräch' },
      { id: 'office-de', enabled: true, tr: 'Yüz yüze görüşme — Düsseldorf', de: 'Persönliches Gespräch — Düsseldorf' },
      { id: 'office-tr', enabled: false, tr: 'Yüz yüze görüşme — İzmir', de: 'Persönliches Gespräch — İzmir' },
    ],
  },
};
