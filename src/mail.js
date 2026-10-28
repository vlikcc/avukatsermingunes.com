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
  (key === 'crossborder' ? (lang === 'de' ? 'Türkei–Deutschland' : 'Türkiye–Almanya') : lang === 'de' ? 'Sonstiges' : 'Diğer');

const signature = (lang) =>
  lang === 'de'
    ? `\n\n—\n${config.lawyer.name}\nAvukat (Türkei) · Rechtsanwaltskammer Düsseldorf\n${config.contact.addressDe.street}, ${config.contact.addressDe.city}`
    : `\n\n—\nAv. ${config.lawyer.name}\nİzmir Barosu · Rechtsanwaltskammer Düsseldorf\n${config.contact.addressDe.street}, ${config.contact.addressDe.city}`;

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
    `SUMMARY:${a.site_lang === 'de' ? 'Termin' : 'Randevu'} – ${config.lawyer.name}`,
    a.type === 'office-de' ? `LOCATION:${config.contact.addressDe.street}\\, ${config.contact.addressDe.city}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function bookingReceived(a) {
  const de = a.site_lang === 'de';
  const when = formatWhen(a.start_utc, a.site_lang);
  const cancelUrl = `${base()}${paths.cancel[a.site_lang]}/${a.token}`;
  send({
    to: a.email,
    subject: de ? `Ihre Terminanfrage ${a.ref}` : `Randevu talebiniz ${a.ref}`,
    text: de
      ? `Guten Tag ${a.name},\n\nvielen Dank für Ihre Terminanfrage. Sie wird geprüft; die Bestätigung erhalten Sie per E-Mail.\n\nReferenz: ${a.ref}\nTermin: ${when} (deutsche Zeit)\nArt: ${typeLabel(a.type, 'de')}\nThema: ${topicLabel(a.topic, 'de')}\n\nStornierung: ${cancelUrl}\n\nDie Terminanfrage begründet noch kein Mandatsverhältnis.${signature('de')}`
      : `Sayın ${a.name},\n\nRandevu talebiniz alınmıştır. Talebiniz incelendikten sonra onay e-postası gönderilecektir.\n\nReferans: ${a.ref}\nTarih: ${when} (Almanya saati)\nGörüşme türü: ${typeLabel(a.type, 'tr')}\nKonu: ${topicLabel(a.topic, 'tr')}\n\nİptal bağlantısı: ${cancelUrl}\n\nRandevu talebi avukat–müvekkil ilişkisi kurmaz.${signature('tr')}`,
  });
  send({
    to: process.env.NOTIFY_EMAIL,
    subject: `Yeni randevu talebi ${a.ref} — ${formatWhen(a.start_utc, 'tr')}`,
    text: `Yeni randevu talebi\n\nReferans: ${a.ref}\nTarih: ${formatWhen(a.start_utc, 'tr')} (Almanya saati)\nTür: ${typeLabel(a.type, 'tr')}\nKonu: ${topicLabel(a.topic, 'tr')}\nAd: ${a.name}\nE-posta: ${a.email}\nTelefon: ${a.phone}\nGörüşme dili: ${a.language}\n\nAçıklama:\n${a.note || '-'}\n\nYönetim: ${base()}/yonetim`,
  });
}

export function bookingStatusChanged(a, status) {
  const de = a.site_lang === 'de';
  const when = formatWhen(a.start_utc, a.site_lang);
  if (status === 'confirmed') {
    send({
      to: a.email,
      subject: de ? `Terminbestätigung ${a.ref}` : `Randevunuz onaylandı ${a.ref}`,
      text: de
        ? `Guten Tag ${a.name},\n\nIhr Termin ist bestätigt.\n\nTermin: ${when} (deutsche Zeit)\nArt: ${typeLabel(a.type, 'de')}\n${a.admin_note ? `\nHinweis: ${a.admin_note}\n` : ''}\nStornierung: ${base()}${paths.cancel.de}/${a.token}${signature('de')}`
        : `Sayın ${a.name},\n\nRandevunuz onaylanmıştır.\n\nTarih: ${when} (Almanya saati)\nGörüşme türü: ${typeLabel(a.type, 'tr')}\n${a.admin_note ? `\nNot: ${a.admin_note}\n` : ''}\nİptal bağlantısı: ${base()}${paths.cancel.tr}/${a.token}${signature('tr')}`,
      attachments: [{ filename: 'randevu.ics', content: ics(a), contentType: 'text/calendar' }],
    });
  } else if (status === 'cancelled') {
    send({
      to: a.email,
      subject: de ? `Termin storniert ${a.ref}` : `Randevu iptal edildi ${a.ref}`,
      text: de
        ? `Guten Tag ${a.name},\n\nder Termin am ${when} wurde storniert.${a.admin_note ? `\n\nHinweis: ${a.admin_note}` : ''}\n\nNeuen Termin buchen: ${base()}${paths.booking.de}${signature('de')}`
        : `Sayın ${a.name},\n\n${when} tarihli randevu iptal edilmiştir.${a.admin_note ? `\n\nNot: ${a.admin_note}` : ''}\n\nYeni randevu: ${base()}${paths.booking.tr}${signature('tr')}`,
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

export { topicLabel };
