import crypto from 'node:crypto';
import config from '../site.config.js';
import { db } from './db.js';

const B = config.booking;
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// Bir saat diliminin verilen andaki UTC farkı (ms).
function tzOffset(tz, ts) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(new Date(ts))
      .map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - ts;
}

// "2026-11-03" + "09:30" (tz yerel saati) -> UTC zaman damgası
export function zonedToUtc(day, time, tz = B.timezone) {
  const [y, m, d] = day.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const first = guess - tzOffset(tz, guess);
  return guess - tzOffset(tz, first);
}

export const localDay = (ts, tz = B.timezone) => new Date(ts).toLocaleDateString('en-CA', { timeZone: tz });

const toMin = (s) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

/** Önümüzdeki günlerin boş randevu saatleri: { 'YYYY-MM-DD': [{ start, time }] } */
export function availability(now = Date.now()) {
  const earliest = now + B.minNoticeHours * 3600_000;
  const taken = new Set(
    db
      .prepare("SELECT start_utc FROM appointments WHERE status IN ('pending','confirmed') AND start_utc >= ?")
      .all(new Date(now).toISOString())
      .map((r) => r.start_utc),
  );
  const blocked = new Set(db.prepare('SELECT day FROM blocked_days').all().map((r) => r.day));

  const [y, m, d] = localDay(now).split('-').map(Number);
  const days = {};
  for (let i = 0; i <= B.maxDaysAhead; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    const day = date.toISOString().slice(0, 10);
    if (blocked.has(day)) continue;
    const ranges = B.weekly[DAY_KEYS[date.getUTCDay()]] || [];
    const slots = [];
    for (const [from, to] of ranges) {
      for (let t = toMin(from); t + B.durationMinutes <= toMin(to); t += B.slotStepMinutes) {
        const time = fromMin(t);
        const ts = zonedToUtc(day, time);
        const iso = new Date(ts).toISOString();
        if (ts < earliest || taken.has(iso)) continue;
        slots.push({ start: iso, time });
      }
    }
    if (slots.length) days[day] = slots;
  }
  return days;
}

export function isAvailable(startIso) {
  const day = localDay(Date.parse(startIso));
  return (availability()[day] || []).some((s) => s.start === startIso);
}

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeRef = () =>
  'R-' +
  Array.from(crypto.randomBytes(6))
    .map((b) => REF_ALPHABET[b % REF_ALPHABET.length])
    .join('');

export const typeIds = () => B.types.filter((x) => x.enabled).map((x) => x.id);
export const typeLabel = (id, lang) => B.types.find((x) => x.id === id)?.[lang] ?? id;

/** Randevu kaydı oluşturur. Saat doluysa null döner. */
export function createAppointment(input) {
  const start = Date.parse(input.start);
  const row = {
    ref: makeRef(),
    token: crypto.randomBytes(24).toString('hex'),
    start_utc: new Date(start).toISOString(),
    end_utc: new Date(start + B.durationMinutes * 60_000).toISOString(),
    type: input.type,
    topic: input.topic,
    name: input.name,
    email: input.email,
    phone: input.phone,
    language: input.language,
    note: input.note || null,
    site_lang: input.lang,
  };
  try {
    db.prepare(
      `INSERT INTO appointments (ref, token, start_utc, end_utc, type, topic, name, email, phone, language, note, site_lang)
       VALUES (:ref, :token, :start_utc, :end_utc, :type, :topic, :name, :email, :phone, :language, :note, :site_lang)`,
    ).run(row);
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return null;
    throw err;
  }
  return row;
}

export const formatWhen = (iso, lang, tz = B.timezone) =>
  new Date(iso).toLocaleString(lang === 'de' ? 'de-DE' : 'tr-TR', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
