const db = require("../db/database");

const addEntry = (userId, { sales, expenses, notes }) => {
  if (isNaN(sales) || sales < 0)    throw new Error("Invalid sales amount");
  if (isNaN(expenses) || expenses < 0) throw new Error("Invalid expenses amount");

  const today = new Date().toISOString().split("T")[0];

  /* one entry per day — update if exists */
  const existing = db.prepare(
    "SELECT id FROM business_entries WHERE user_id = ? AND date = ?"
  ).get(userId, today);

  if (existing) {
    db.prepare(
      "UPDATE business_entries SET sales = ?, expenses = ?, notes = ? WHERE id = ?"
    ).run(sales, expenses, notes || "", existing.id);
    return db.prepare("SELECT * FROM business_entries WHERE id = ?").get(existing.id);
  }

  const result = db.prepare(
    "INSERT INTO business_entries (user_id, date, sales, expenses, notes) VALUES (?, ?, ?, ?, ?)"
  ).run(userId, today, sales, expenses, notes || "");

  return db.prepare("SELECT * FROM business_entries WHERE id = ?").get(result.lastInsertRowid);
};

const getToday = (userId) => {
  const today = new Date().toISOString().split("T")[0];
  return db.prepare(
    "SELECT * FROM business_entries WHERE user_id = ? AND date = ?"
  ).get(userId, today) || null;
};

const getHistory = (userId, limit = 30) => {
  return db.prepare(
    "SELECT * FROM business_entries WHERE user_id = ? ORDER BY date DESC LIMIT ?"
  ).all(userId, limit);
};

const getYesterday = (userId) => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  return db.prepare(
    "SELECT * FROM business_entries WHERE user_id = ? AND date = ?"
  ).get(userId, yesterday) || null;
};

const getWeekSummary = (userId) => {
  return db.prepare(`
    SELECT
      COUNT(*)        AS days_recorded,
      SUM(sales)      AS total_sales,
      SUM(expenses)   AS total_expenses,
      SUM(sales - expenses) AS total_profit,
      AVG(sales)      AS avg_daily_sales,
      MAX(sales)      AS best_day_sales
    FROM business_entries
    WHERE user_id = ?
      AND date >= date('now', '-7 days')
  `).get(userId);
};

module.exports = { addEntry, getToday, getHistory, getYesterday, getWeekSummary };
