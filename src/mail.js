// E-posta bildirimleri. SMTP_HOST tanımlı değilse e-postalar gönderilmez,
// yalnızca sunucu konsoluna kısa bir not düşülür.

import config from '../site.config.js';
import { formatWhen, typeLabel } from './booking.js';
import { paths } from './i18n.js';
import { areas } from './content/areas.js';

let transport = null;
let warned = false;

async function getTransport() {
  if (transport || !process.env.SMTP_HOST) return transport;
  const nodemailer = (await import('nodemailer')).default;
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transport;
}

async function send({ to, subject, text, attachments }) {
  if (!to) return;
  const tr = await getTransport();
  if (!tr) {
    if (!warned) {
      console.warn('[mail] SMTP yapılandırılmamış; e-posta bildirimleri gönderilmiyor.');
      warned = true;
    }
    console.log(`[mail:devre dışı] ${to} — ${subject}`);
    return;
  }
  try {
    await tr.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, attachments });
  } catch (err) {
    console.error('[mail] gönderilemedi:', err.message);
  }
}

const base = () => process.env.PUBLIC_URL || config.siteUrl || 'http://localhost:' + (process.env.PORT || 3000);
const topicLabel = (key, lang) =>
  areas.find((a) => a.key === key)?.title[lang] ??
  (key === 'crossborder'
    ? { tr: 'Türkiye–Almanya', de: 'Türkei–Deutschland', en: 'Türkiye–Germany', nl: 'Turkije–Duitsland' }[lang]
    : { tr: 'Diğer', de: 'Sonstiges', en: 'Other', nl: 'Overig' }[lang]);

const signature = (lang) =>
  lang === 'tr'
    ? `\n\n—\nAv. ${config.lawyer.name}\nİzmir Barosu · Rechtsanwaltskammer Düsseldorf\n${config.contact.addressDe.street}, ${config.contact.addressDe.city}`
    : `\n\n—\n${config.lawyer.name}\nAvukat (Türkei) · Rechtsanwaltskammer Düsseldorf\n${config.contact.addressDe.street}, ${config.contact.addressDe.city}`;

// Müvekkile giden e-postaların sitenin diline göre metinleri.
const M = {
  tr: {
    hello: (n) => `Sayın ${n},`,
    germanTime: 'Almanya saati',
    when: 'Tarih',
    type: 'Görüşme türü',
    topic: 'Konu',
    ref: 'Referans',
    note: 'Not',
    cancelLink: 'İptal bağlantısı',
    newBooking: 'Yeni randevu',
    calendar: 'Randevu',
    receivedSubject: (r) => `Randevu talebiniz ${r}`,
    receivedText: 'Randevu talebiniz alınmıştır. Talebiniz incelendikten sonra onay e-postası gönderilecektir.',
    noMandate: 'Randevu talebi avukat–müvekkil ilişkisi kurmaz.',
    confirmedSubject: (r) => `Randevunuz onaylandı ${r}`,
    confirmedText: 'Randevunuz onaylanmıştır.',
    cancelledSubject: (r) => `Randevu iptal edildi ${r}`,
    cancelledText: (w) => `${w} tarihli randevu iptal edilmiştir.`,
  },
  de: {
    hello: (n) => `Guten Tag ${n},`,
    germanTime: 'deutsche Zeit',
    when: 'Termin',
    type: 'Art',
    topic: 'Thema',
    ref: 'Referenz',
    note: 'Hinweis',
    cancelLink: 'Stornierung',
    newBooking: 'Neuen Termin buchen',
    calendar: 'Termin',
    receivedSubject: (r) => `Ihre Terminanfrage ${r}`,
    receivedText: 'vielen Dank für Ihre Terminanfrage. Sie wird geprüft; die Bestätigung erhalten Sie per E-Mail.',
    noMandate: 'Die Terminanfrage begründet noch kein Mandatsverhältnis.',
    confirmedSubject: (r) => `Terminbestätigung ${r}`,
    confirmedText: 'Ihr Termin ist bestätigt.',
    cancelledSubject: (r) => `Termin storniert ${r}`,
    cancelledText: (w) => `der Termin am ${w} wurde storniert.`,
  },
  en: {
    hello: (n) => `Dear ${n},`,
    germanTime: 'German time',
    when: 'Appointment',
    type: 'Type',
    topic: 'Topic',
    ref: 'Reference',
    note: 'Note',
    cancelLink: 'Cancellation',
    newBooking: 'Book a new appointment',
    calendar: 'Appointment',
    receivedSubject: (r) => `Your appointment request ${r}`,
    receivedText: 'Thank you for your appointment request. It will be reviewed and you will receive confirmation by email.',
    noMandate: 'An appointment request does not create a lawyer–client relationship.',
    confirmedSubject: (r) => `Appointment confirmed ${r}`,
    confirmedText: 'Your appointment has been confirmed.',
    cancelledSubject: (r) => `Appointment cancelled ${r}`,
    cancelledText: (w) => `Your appointment on ${w} has been cancelled.`,
  },
  nl: {
    hello: (n) => `Geachte ${n},`,
    germanTime: 'Duitse tijd',
    when: 'Afspraak',
    type: 'Soort',
    topic: 'Onderwerp',
    ref: 'Referentie',
    note: 'Opmerking',
    cancelLink: 'Annuleren',
    newBooking: 'Nieuwe afspraak maken',
    calendar: 'Afspraak',
    receivedSubject: (r) => `Uw afspraakaanvraag ${r}`,
    receivedText: 'Hartelijk dank voor uw afspraakaanvraag. Deze wordt beoordeeld; de bevestiging ontvangt u per e-mail.',
    noMandate: 'Een afspraakaanvraag doet nog geen advocaat-cliëntrelatie ontstaan.',
    confirmedSubject: (r) => `Afspraak bevestigd ${r}`,
    confirmedText: 'Uw afspraak is bevestigd.',
    cancelledSubject: (r) => `Afspraak geannuleerd ${r}`,
    cancelledText: (w) => `uw afspraak op ${w} is geannuleerd.`,
  },
};
const msg = (lang) => M[lang] || M.tr;

function ics(a) {
  const stamp = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d+/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//sermin-gunes-kececi//randevu//TR',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${a.ref}@randevu`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(a.start_utc)}`,
    `DTEND:${stamp(a.end_utc)}`,
    `SUMMARY:${msg(a.site_lang).calendar} – ${config.lawyer.name}`,
    a.type === 'office-de' ? `LOCATION:${config.contact.addressDe.street}\\, ${config.contact.addressDe.city}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function bookingReceived(a) {
  const lang = a.site_lang;
  const T = msg(lang);
  const when = formatWhen(a.start_utc, lang);
  const cancelUrl = `${base()}${paths.cancel[lang]}/${a.token}`;
  send({
    to: a.email,
    subject: T.receivedSubject(a.ref),
    text: `${T.hello(a.name)}\n\n${T.receivedText}\n\n${T.ref}: ${a.ref}\n${T.when}: ${when} (${T.germanTime})\n${T.type}: ${typeLabel(a.type, lang)}\n${T.topic}: ${topicLabel(a.topic, lang)}\n\n${T.cancelLink}: ${cancelUrl}\n\n${T.noMandate}${signature(lang)}`,
  });
  send({
    to: process.env.NOTIFY_EMAIL,
    subject: `Yeni randevu talebi ${a.ref} — ${formatWhen(a.start_utc, 'tr')}`,
    text: `Yeni randevu talebi\n\nReferans: ${a.ref}\nTarih: ${formatWhen(a.start_utc, 'tr')} (Almanya saati)\nTür: ${typeLabel(a.type, 'tr')}\nKonu: ${topicLabel(a.topic, 'tr')}\nAd: ${a.name}\nE-posta: ${a.email}\nTelefon: ${a.phone}\nGörüşme dili: ${a.language}\n\nAçıklama:\n${a.note || '-'}\n\nYönetim: ${base()}/yonetim`,
  });
}

export function bookingStatusChanged(a, status) {
  const lang = a.site_lang;
  const T = msg(lang);
  const when = formatWhen(a.start_utc, lang);
  if (status === 'confirmed') {
    send({
      to: a.email,
      subject: T.confirmedSubject(a.ref),
      text: `${T.hello(a.name)}\n\n${T.confirmedText}\n\n${T.when}: ${when} (${T.germanTime})\n${T.type}: ${typeLabel(a.type, lang)}\n${a.admin_note ? `\n${T.note}: ${a.admin_note}\n` : ''}\n${T.cancelLink}: ${base()}${paths.cancel[lang]}/${a.token}${signature(lang)}`,
      attachments: [{ filename: 'randevu.ics', content: ics(a), contentType: 'text/calendar' }],
    });
  } else if (status === 'cancelled') {
    send({
      to: a.email,
      subject: T.cancelledSubject(a.ref),
      text: `${T.hello(a.name)}\n\n${T.cancelledText(when)}${a.admin_note ? `\n\n${T.note}: ${a.admin_note}` : ''}\n\n${T.newBooking}: ${base()}${paths.booking[lang]}${signature(lang)}`,
    });
  }
}

export function bookingCancelledByClient(a) {
  send({
    to: process.env.NOTIFY_EMAIL,
    subject: `Randevu müvekkil tarafından iptal edildi ${a.ref}`,
    text: `${a.name} (${a.email}) ${formatWhen(a.start_utc, 'tr')} tarihli randevuyu iptal etti.`,
  });
}

export function contactReceived(m) {
  send({
    to: process.env.NOTIFY_EMAIL,
    subject: `İletişim formu: ${topicLabel(m.subject, 'tr')} — ${m.name}`,
    text: `Ad: ${m.name}\nE-posta: ${m.email}\nTelefon: ${m.phone || '-'}\nKonu: ${topicLabel(m.subject, 'tr')}\nDil: ${m.lang}\n\n${m.message}\n\nYönetim: ${base()}/yonetim/mesajlar`,
  });
}

// Yayın rutininin eklediği yazılar (genellikle onay bekleyen taslaklar).
export function postsImported(list) {
  const drafts = list.filter((p) => p.status === 'draft');
  const tr = list.filter((p) => p.lang === 'tr');
  const when = (p) =>
    p.publish_at
      ? new Date(p.publish_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', dateStyle: 'long', timeStyle: 'short' }) + ' (Türkiye saati)'
      : p.date;
  send({
    to: process.env.NOTIFY_EMAIL,
    subject: drafts.length ? `${drafts.length} yeni yazı onayınızı bekliyor` : `${list.length} yeni yazı eklendi`,
    text: `Yayın rutini siteye ${list.length} yeni yazı ekledi${drafts.length ? `; ${drafts.length} tanesi taslak olarak onayınızı bekliyor` : ''}.

${(tr.length ? tr : list).map((p) => `- [${p.category === 'mevzuat' ? 'Mevzuat' : 'Makale'}] ${p.title}\n  Yayın: ${when(p)}\n  ${base()}/yonetim/yazilar/${p.id}`).join('\n\n')}

Yazıları okuyup doğruladıktan sonra yönetim panelindeki “Tüm dilleriyle yayınla” düğmesiyle dört dildeki hâlini birlikte yayına alabilirsiniz. Yayın zamanı gelmeden onaylanan yazılar o saatte kendiliğinden görünür.

${base()}/yonetim/yazilar?durum=taslak`,
  });
}

export { topicLabel };
