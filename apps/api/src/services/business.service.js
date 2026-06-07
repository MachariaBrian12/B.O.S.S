const { pool } = require("../db/database");

const addEntry = async (userId, { sales, expenses, notes }) => {
  if (isNaN(sales) || sales < 0) throw new Error("Invalid sales amount");
  if (isNaN(expenses) || expenses < 0) throw new Error("Invalid expenses amount");
  const today = new Date().toISOString().split("T")[0];
  const { rows } = await pool.query(
    `INSERT INTO business_entries (user_id, date, sales, expenses, notes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, date) DO UPDATE SET sales=$3, expenses=$4, notes=$5
     RETURNING *`,
    [userId, today, sales, expenses, notes || ""]
  );
  return rows[0];
};

const getToday = async (userId) => {
  const today = new Date().toISOString().split("T")[0];
  const { rows } = await pool.query("SELECT * FROM business_entries WHERE user_id=$1 AND date=$2", [userId, today]);
  return rows[0] || null;
};

const getHistory = async (userId, limit = 30) => {
  const { rows } = await pool.query("SELECT * FROM business_entries WHERE user_id=$1 ORDER BY date DESC LIMIT $2", [userId, limit]);
  return rows;
};

const getYesterday = async (userId) => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const { rows } = await pool.query("SELECT * FROM business_entries WHERE user_id=$1 AND date=$2", [userId, yesterday]);
  return rows[0] || null;
};

const getWeekSummary = async (userId) => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) AS days_recorded, SUM(sales) AS total_sales,
           SUM(expenses) AS total_expenses, SUM(sales-expenses) AS total_profit,
           AVG(sales) AS avg_daily_sales, MAX(sales) AS best_day_sales
    FROM business_entries WHERE user_id=$1 AND date >= CURRENT_DATE - INTERVAL '7 days'
  `, [userId]);
  return rows[0];
};

module.exports = { addEntry, getToday, getHistory, getYesterday, getWeekSummary };
