import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = process.env.DATA_DIR || path.resolve(import.meta.dirname, '../data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new DatabaseSync(path.join(DATA_DIR, 'site.db'));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS appointments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ref         TEXT NOT NULL UNIQUE,
    token       TEXT NOT NULL UNIQUE,
    start_utc   TEXT NOT NULL,
    end_utc     TEXT NOT NULL,
    type        TEXT NOT NULL,
    topic       TEXT NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT NOT NULL,
    language    TEXT NOT NULL,
    note        TEXT,
    site_lang   TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled | done
    admin_note  TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  -- Aynı saate iki aktif randevu yazılamaz.
  CREATE UNIQUE INDEX IF NOT EXISTS appt_active_slot
    ON appointments(start_utc) WHERE status IN ('pending', 'confirmed');
  CREATE INDEX IF NOT EXISTS appt_start ON appointments(start_utc);

  CREATE TABLE IF NOT EXISTS blocked_days (
    day    TEXT PRIMARY KEY, -- YYYY-MM-DD (randevu saat dilimine göre)
    reason TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    subject    TEXT NOT NULL,
    message    TEXT NOT NULL,
    site_lang  TEXT NOT NULL,
    read       INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
`);

// Saklama süresi dolan kayıtları siler (DSGVO / KVKK).
export function purgeOld(days) {
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
  const a = db.prepare('DELETE FROM appointments WHERE start_utc < ?').run(cutoff);
  const m = db.prepare('DELETE FROM messages WHERE created_at < ?').run(cutoff);
  return { appointments: Number(a.changes), messages: Number(m.changes) };
}
