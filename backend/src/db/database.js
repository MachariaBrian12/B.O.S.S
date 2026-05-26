const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../boss.db");

const db = new Database(DB_PATH);

/* ── performance pragmas ── */
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/* ══════════════════════════════════
   CREATE TABLES
══════════════════════════════════ */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    business    TEXT    NOT NULL DEFAULT 'My Business',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS business_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    date        TEXT    NOT NULL DEFAULT (date('now')),
    sales       REAL    NOT NULL DEFAULT 0,
    expenses    REAL    NOT NULL DEFAULT 0,
    profit      REAL    GENERATED ALWAYS AS (sales - expenses) VIRTUAL,
    notes       TEXT    DEFAULT '',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    category    TEXT    DEFAULT 'General',
    sales_count INTEGER DEFAULT 0,
    revenue     REAL    DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS insights_cache (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    date            TEXT    NOT NULL DEFAULT (date('now')),
    profit_trend    TEXT    DEFAULT '',
    top_product     TEXT    DEFAULT '',
    summary         TEXT    DEFAULT '',
    warning         TEXT    DEFAULT '',
    recommendation  TEXT    DEFAULT '',
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log("✅ Database ready →", DB_PATH);

module.exports = db;
