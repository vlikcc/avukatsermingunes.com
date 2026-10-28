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

  -- Blog yazıları (yönetim panelinden yazılır).
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    lang        TEXT NOT NULL,             -- tr | de | en | nl
    slug        TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    body        TEXT NOT NULL,             -- Markdown
    date        TEXT NOT NULL,             -- YYYY-MM-DD, yayım tarihi
    pair        TEXT,                      -- farklı dillerdeki çevirileri bağlayan ortak anahtar
    status      TEXT NOT NULL DEFAULT 'draft', -- draft | published
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    UNIQUE (lang, slug)
  );

  -- Basit ayarlar (ör. yönetim şifresinin özeti).
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Sonradan eklenen sütunlar: eski veritabanlarına bir kez eklenir.
const postCols = db.prepare('PRAGMA table_info(posts)').all().map((c) => c.name);
if (!postCols.includes('category')) db.exec("ALTER TABLE posts ADD COLUMN category TEXT NOT NULL DEFAULT 'blog'"); // blog | mevzuat
if (!postCols.includes('publish_at')) db.exec('ALTER TABLE posts ADD COLUMN publish_at TEXT'); // UTC ISO; dolmadan yayında görünmez

// content/posts altından veritabanına aktarılmış dosyalar (bir dosya yalnızca bir kez aktarılır).
db.exec('CREATE TABLE IF NOT EXISTS imported_files (path TEXT PRIMARY KEY, imported_at TEXT NOT NULL)');

export const getSetting = (key) => db.prepare('SELECT value FROM settings WHERE key = ?').get(key)?.value ?? null;
export const setSetting = (key, value) => db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);

// Saklama süresi dolan kayıtları siler (DSGVO / KVKK).
export function purgeOld(days) {
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
  const a = db.prepare('DELETE FROM appointments WHERE start_utc < ?').run(cutoff);
  const m = db.prepare('DELETE FROM messages WHERE created_at < ?').run(cutoff);
  return { appointments: Number(a.changes), messages: Number(m.changes) };
}
