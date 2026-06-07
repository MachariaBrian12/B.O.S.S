const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      business    TEXT    NOT NULL DEFAULT 'My Business',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS business_entries (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date        DATE    NOT NULL DEFAULT CURRENT_DATE,
      sales       NUMERIC NOT NULL DEFAULT 0,
      expenses    NUMERIC NOT NULL DEFAULT 0,
      notes       TEXT    DEFAULT '',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, date)
    );
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name        TEXT    NOT NULL,
      category    TEXT    DEFAULT 'General',
      sales_count INTEGER DEFAULT 0,
      revenue     NUMERIC DEFAULT 0,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS insights_cache (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date            DATE    NOT NULL DEFAULT CURRENT_DATE,
      profit_trend    TEXT    DEFAULT '',
      top_product     TEXT    DEFAULT '',
      summary         TEXT    DEFAULT '',
      recommendation  TEXT    DEFAULT '',
      warning         TEXT    DEFAULT '',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, date)
    );
  `);
  console.log("✅ Database ready (Postgres)");
};

module.exports = { pool, init };
