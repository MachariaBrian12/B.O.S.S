const db              = require("../db/database");
const businessService = require("./business.service");

const runInsights = (userId) => {
  const today     = businessService.getToday(userId);
  const yesterday = businessService.getYesterday(userId);
  const week      = businessService.getWeekSummary(userId);
  const history   = businessService.getHistory(userId, 7);

  /* ── defaults ── */
  let profitTrend    = "neutral";
  let topProduct     = "No products recorded yet";
  let summary        = "No data entered yet for today.";
  let warning        = null;
  let recommendation = "Enter today's sales and expenses to get your first insight.";
  let score          = 50;

  if (!today) {
    return { profitTrend, topProduct, summary, warning, recommendation, score, hasData: false };
  }

  const profit       = today.sales - today.expenses;
  const marginPct    = today.sales > 0 ? ((profit / today.sales) * 100).toFixed(1) : 0;
  const expenseRatio = today.sales > 0 ? today.expenses / today.sales : 0;

  /* ── profit trend vs yesterday ── */
  if (yesterday) {
    const prevProfit = yesterday.sales - yesterday.expenses;
    if (profit > prevProfit) {
      const pct = prevProfit > 0 ? (((profit - prevProfit) / prevProfit) * 100).toFixed(1) : 100;
      profitTrend = `+${pct}%`;
    } else if (profit < prevProfit) {
      const pct = prevProfit > 0 ? (((prevProfit - profit) / prevProfit) * 100).toFixed(1) : 100;
      profitTrend = `-${pct}%`;
    } else {
      profitTrend = "0%";
    }
  }

  /* ── summary ── */
  summary = `Today you made KES ${today.sales.toLocaleString()} in sales with KES ${today.expenses.toLocaleString()} in expenses — a profit of KES ${profit.toLocaleString()} (${marginPct}% margin).`;

  /* ── score (0-100) ── */
  if (marginPct >= 40)       score = 90;
  else if (marginPct >= 25)  score = 75;
  else if (marginPct >= 10)  score = 60;
  else if (marginPct >= 0)   score = 40;
  else                       score = 20;

  /* ── warnings (priority order) ── */
  if (profit < 0) {
    warning = "🔴 You are operating at a loss today. Expenses exceed sales.";
    score -= 20;
  } else if (expenseRatio > 0.75) {
    warning = "🟠 Expenses are very high — above 75% of sales. Margins are dangerously thin.";
    score -= 15;
  } else if (expenseRatio > 0.5) {
    warning = "🟡 Expenses are above 50% of sales. Consider reviewing your cost structure.";
    score -= 5;
  } else if (yesterday && today.sales < yesterday.sales * 0.7) {
    warning = "🟡 Sales dropped more than 30% compared to yesterday. Investigate why.";
    score -= 10;
  }

  /* ── recommendations ── */
  if (profit < 0) {
    recommendation = "Immediately identify your biggest expense and find ways to cut it. Do not increase spending today.";
  } else if (expenseRatio > 0.75) {
    recommendation = "Pause non-essential spending. Focus on converting existing inventory before restocking.";
  } else if (expenseRatio > 0.5) {
    recommendation = "Review your expense categories. Identify 1-2 costs you can reduce by 20% this week.";
  } else if (yesterday && today.sales > yesterday.sales * 1.2) {
    recommendation = "Strong day! Consider restocking your top products to maintain momentum.";
  } else if (marginPct >= 40) {
    recommendation = "Excellent margins. This is a good time to invest in marketing or new product lines.";
  } else {
    recommendation = "Stay consistent. Record expenses daily to identify patterns and opportunities.";
  }

  /* ── top product from products table ── */
  const topP = db.prepare(
    "SELECT name FROM products WHERE user_id = ? ORDER BY revenue DESC LIMIT 1"
  ).get(userId);
  if (topP) topProduct = topP.name;

  /* ── week stats ── */
  const weekStats = week ? {
    totalSales:    week.total_sales    || 0,
    totalExpenses: week.total_expenses || 0,
    totalProfit:   week.total_profit   || 0,
    avgDailySales: Math.round(week.avg_daily_sales || 0),
    bestDaySales:  week.best_day_sales || 0,
    daysRecorded:  week.days_recorded  || 0,
  } : null;

  /* ── cache the insight ── */
  const dateStr = new Date().toISOString().split("T")[0];
  db.prepare(`
    INSERT INTO insights_cache (user_id, date, profit_trend, top_product, summary, warning, recommendation)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET
      profit_trend   = excluded.profit_trend,
      top_product    = excluded.top_product,
      summary        = excluded.summary,
      warning        = excluded.warning,
      recommendation = excluded.recommendation
  `).run(userId, dateStr, profitTrend, topProduct, summary, warning || "", recommendation);

  return {
    hasData: true,
    today: {
      sales:    today.sales,
      expenses: today.expenses,
      profit,
      margin:   Number(marginPct),
      date:     today.date,
    },
    yesterday: yesterday ? {
      sales:   yesterday.sales,
      expenses: yesterday.expenses,
      profit:  yesterday.sales - yesterday.expenses,
    } : null,
    profitTrend,
    topProduct,
    summary,
    warning,
    recommendation,
    score: Math.max(0, Math.min(100, score)),
    weekStats,
    history: history.map(e => ({
      date:     e.date,
      sales:    e.sales,
      expenses: e.expenses,
      profit:   e.sales - e.expenses,
    })),
  };
};

module.exports = { runInsights };
