const db              = require("../db/database");
const businessService = require("./business.service");

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const fmt  = n => `KES ${Number(n||0).toLocaleString()}`;
const pct  = (a,b) => b > 0 ? (((a-b)/b)*100).toFixed(1) : null;
const date = d => new Date(d).toLocaleDateString("en-KE",{weekday:"short",month:"short",day:"numeric"});

const getLast30 = (userId) =>
  db.prepare(`SELECT * FROM business_entries WHERE user_id = ? ORDER BY date DESC LIMIT 30`).all(userId);

const getStreak = (userId) => {
  const rows = db.prepare(`SELECT date FROM business_entries WHERE user_id = ? ORDER BY date DESC`).all(userId);
  if (!rows.length) return 0;
  let streak = 0;
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = 0; i < rows.length; i++) {
    const d = new Date(rows[i].date); d.setHours(0,0,0,0);
    const diff = Math.round((today - d) / 86400000);
    if (diff === i || (i === 0 && diff === 1)) streak++;
    else break;
  }
  return streak;
};

/* ─────────────────────────────────────────
   INTELLIGENCE FEED GENERATOR
───────────────────────────────────────── */
const generateFeed = (today, yesterday, history, weekSummary) => {
  const feed = [];
  if (!today) return feed;

  const profit    = today.sales - today.expenses;
  const margin    = today.sales > 0 ? ((profit/today.sales)*100).toFixed(1) : 0;
  const expRatio  = today.sales > 0 ? today.expenses/today.sales : 0;

  /* vs yesterday */
  if (yesterday) {
    const salesDiff  = pct(today.sales,    yesterday.sales);
    const profitDiff = pct(profit, yesterday.sales - yesterday.expenses);
    const expDiff    = pct(today.expenses, yesterday.expenses);

    if (salesDiff !== null) {
      const up = parseFloat(salesDiff) >= 0;
      feed.push({
        id:"sales-vs-yday", type: up?"growth":"warning",
        icon: up?"↑":"↓",
        title: up ? "Revenue momentum" : "Revenue softened",
        body: `Sales ${up?"up":"down"} ${Math.abs(parseFloat(salesDiff))}% compared to yesterday (${fmt(yesterday.sales)}).`,
        time: "Compared to yesterday", priority: up ? 2 : 1,
      });
    }

    if (expDiff !== null && parseFloat(expDiff) > 20) {
      feed.push({
        id:"exp-spike", type:"alert",
        icon:"⚠",
        title: "Expense spike detected",
        body: `Expenses rose ${Math.abs(parseFloat(expDiff))}% vs yesterday. Review cost categories before end of day.`,
        time: "Compared to yesterday", priority: 1,
      });
    }

    if (profitDiff !== null) {
      const up = parseFloat(profitDiff) >= 0;
      feed.push({
        id:"profit-trend", type: up?"growth":"warning",
        icon: up?"◆":"◇",
        title: up ? "Profit improving" : "Profit under pressure",
        body: `Net profit ${up?"improved":"declined"} ${Math.abs(parseFloat(profitDiff))}% vs yesterday. Margin today: ${margin}%.`,
        time: "Compared to yesterday", priority: up ? 3 : 1,
      });
    }
  }

  /* margin analysis */
  if (Number(margin) >= 45) {
    feed.push({
      id:"high-margin", type:"growth",
      icon:"★",
      title: "Strong margin performance",
      body: `${margin}% profit margin today — well above the healthy 30% threshold. Business efficiency is high.`,
      time: "Today", priority: 4,
    });
  } else if (Number(margin) < 15 && today.sales > 0) {
    feed.push({
      id:"low-margin", type:"critical",
      icon:"!",
      title: "Margin compression alert",
      body: `Profit margin at ${margin}% — dangerously thin. Expenses are consuming ${(expRatio*100).toFixed(0)}% of revenue.`,
      time: "Today", priority: 0,
    });
  }

  /* week patterns */
  if (history.length >= 3) {
    const avgSales = history.slice(0,7).reduce((a,r)=>a+r.sales,0) / Math.min(history.length,7);
    const today7Diff = pct(today.sales, avgSales);
    if (today7Diff !== null && Math.abs(parseFloat(today7Diff)) > 15) {
      const up = parseFloat(today7Diff) >= 0;
      feed.push({
        id:"vs-weekly-avg", type: up?"opportunity":"warning",
        icon: up?"⬆":"⬇",
        title: up ? "Above weekly average" : "Below weekly average",
        body: `Today's sales are ${Math.abs(parseFloat(today7Diff))}% ${up?"above":"below"} your 7-day average of ${fmt(Math.round(avgSales))}.`,
        time: "Compared to 7-day average", priority: up ? 3 : 2,
      });
    }

    /* best/worst day detection */
    const best = history.reduce((a,r) => r.sales > a.sales ? r : a, history[0]);
    if (today.sales >= best.sales && history.length > 1) {
      feed.push({
        id:"best-day", type:"growth",
        icon:"🏆",
        title: "Best sales day on record",
        body: `${fmt(today.sales)} — your highest single-day revenue recorded. Exceptional performance.`,
        time: "All time", priority: 5,
      });
    }
  }

  /* expense ratio */
  if (expRatio > 0.7) {
    feed.push({
      id:"high-exp-ratio", type:"alert",
      icon:"⚡",
      title: "High expense-to-revenue ratio",
      body: `Expenses represent ${(expRatio*100).toFixed(0)}% of today's revenue. Sustainable threshold is below 60%.`,
      time: "Today", priority: 1,
    });
  }

  /* operational suggestion */
  if (Number(margin) >= 40) {
    feed.push({
      id:"reinvest-signal", type:"opportunity",
      icon:"→",
      title: "Reinvestment window open",
      body: "Strong margins create a natural window to increase inventory, test new product lines, or invest in marketing.",
      time: "Strategic", priority: 3,
    });
  }

  return feed.sort((a,b) => a.priority - b.priority);
};

/* ─────────────────────────────────────────
   PREDICTIVE SIGNALS
───────────────────────────────────────── */
const generateSignals = (today, history) => {
  const signals = [];
  if (!today || history.length < 3) {
    signals.push({
      id:"more-data", confidence:40, direction:"neutral",
      title:"Building your intelligence model",
      body:"Add entries for at least 3 days to unlock predictive signals.",
      timeframe:"Ongoing",
    });
    return signals;
  }

  const recent3 = history.slice(0,3);
  const salesTrend = recent3[0].sales - recent3[2].sales;
  const expTrend   = recent3[0].expenses - recent3[2].expenses;

  /* sales trajectory */
  if (salesTrend < -0.1 * recent3[2].sales) {
    signals.push({
      id:"sales-declining", confidence:68, direction:"down",
      title:"Sales may slow tomorrow",
      body:"Revenue has declined over the last 3 recorded days. Consider a targeted promotion or pricing review.",
      timeframe:"Next 1–2 days",
    });
  } else if (salesTrend > 0.1 * recent3[2].sales) {
    signals.push({
      id:"sales-rising", confidence:72, direction:"up",
      title:"Revenue momentum building",
      body:"Sales have grown consistently over recent days. Ensure inventory levels can meet continued demand.",
      timeframe:"Next 1–2 days",
    });
  }

  /* expense pressure */
  if (expTrend > 0.15 * recent3[2].expenses) {
    signals.push({
      id:"exp-pressure", confidence:74, direction:"down",
      title:"Cash flow pressure likely",
      body:"Expenses have been rising consistently. If revenue doesn't increase, cash flow may tighten next week.",
      timeframe:"Next 3–5 days",
    });
  }

  /* volatility */
  const salesValues = history.slice(0,7).map(r=>r.sales);
  const avg = salesValues.reduce((a,v)=>a+v,0)/salesValues.length;
  const variance = salesValues.reduce((a,v)=>a+Math.pow(v-avg,2),0)/salesValues.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev/avg > 0.35 && avg > 0) {
    signals.push({
      id:"volatility", confidence:61, direction:"neutral",
      title:"Revenue volatility detected",
      body:"Sales are fluctuating significantly day-to-day. Consider smoothing demand through consistent promotions.",
      timeframe:"This week",
    });
  }

  /* weekend signal */
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 4 || dayOfWeek === 5) {
    signals.push({
      id:"weekend-demand", confidence:65, direction:"up",
      title:"Weekend demand expected to rise",
      body:"Ensure stock levels and staffing are ready for typical weekend activity spikes.",
      timeframe:"This weekend",
    });
  }

  if (!signals.length) {
    signals.push({
      id:"stable", confidence:70, direction:"neutral",
      title:"Business operating steadily",
      body:"No significant anomalies or risks detected. Continue monitoring daily performance.",
      timeframe:"Near term",
    });
  }

  return signals;
};

/* ─────────────────────────────────────────
   ALERTS ENGINE
───────────────────────────────────────── */
const generateAlerts = (today, yesterday, history) => {
  const alerts = [];
  if (!today) return alerts;

  const profit   = today.sales - today.expenses;
  const margin   = today.sales > 0 ? (profit/today.sales)*100 : 0;
  const expRatio = today.sales > 0 ? today.expenses/today.sales : 0;

  if (profit < 0) {
    alerts.push({ level:"critical", title:"Operating at a loss", body:`Expenses exceed sales by ${fmt(Math.abs(profit))}. Immediate cost review required.`, action:"Review and cut non-essential expenses today." });
  }
  if (expRatio > 0.75 && profit >= 0) {
    alerts.push({ level:"warning", title:"Expenses too high", body:`${(expRatio*100).toFixed(0)}% of revenue is going to expenses. Sustainable max is 60%.`, action:"Identify your top 2 expense categories and reduce them." });
  }
  if (yesterday && today.sales < yesterday.sales * 0.65) {
    alerts.push({ level:"warning", title:"Significant sales drop", body:`Revenue fell more than 35% compared to yesterday (${fmt(yesterday.sales)}).`, action:"Investigate demand — check pricing, visibility, and stock availability." });
  }
  if (margin >= 40 && today.sales > 0) {
    alerts.push({ level:"opportunity", title:"Strong margin window", body:`${margin.toFixed(1)}% profit margin today. Prime time to reinvest or expand.`, action:"Consider increasing inventory or launching a promotion." });
  }
  if (history.length >= 5) {
    const avgSales = history.slice(0,5).reduce((a,r)=>a+r.sales,0)/5;
    if (today.sales > avgSales * 1.35) {
      alerts.push({ level:"growth", title:"Sales significantly above average", body:`Today's revenue is ${pct(today.sales,avgSales)}% above your 5-day average.`, action:"Capitalise on momentum — ensure supply can meet demand." });
    }
  }

  return alerts;
};

/* ─────────────────────────────────────────
   MAIN INSIGHTS RUNNER
───────────────────────────────────────── */
const runInsights = (userId) => {
  const today     = businessService.getToday(userId);
  const yesterday = businessService.getYesterday(userId);
  const week      = businessService.getWeekSummary(userId);
  const history   = businessService.getHistory(userId, 30);
  const streak    = getStreak(userId);

  let profitTrend    = "neutral";
  let topProduct     = "No products recorded yet";
  let summary        = "No data entered yet for today.";
  let warning        = null;
  let recommendation = "Enter today's sales and expenses to get your first insight.";
  let score          = 50;

  if (!today) {
    return {
      hasData:false, profitTrend, topProduct, summary,
      warning, recommendation, score,
      feed:[], signals: generateSignals(null, history),
      alerts:[], streak, history:[],
    };
  }

  const profit    = today.sales - today.expenses;
  const marginPct = today.sales > 0 ? ((profit/today.sales)*100).toFixed(1) : 0;
  const expRatio  = today.sales > 0 ? today.expenses/today.sales : 0;

  if (yesterday) {
    const prevProfit = yesterday.sales - yesterday.expenses;
    if (profit > prevProfit) {
      const p = prevProfit > 0 ? (((profit-prevProfit)/prevProfit)*100).toFixed(1) : 100;
      profitTrend = `+${p}%`;
    } else if (profit < prevProfit) {
      const p = prevProfit > 0 ? (((prevProfit-profit)/prevProfit)*100).toFixed(1) : 100;
      profitTrend = `-${p}%`;
    } else { profitTrend = "0%"; }
  }

  summary = `${fmt(today.sales)} in sales · ${fmt(today.expenses)} in expenses · ${fmt(profit)} profit (${marginPct}% margin).`;

  if      (marginPct >= 45) score = 92;
  else if (marginPct >= 35) score = 80;
  else if (marginPct >= 20) score = 65;
  else if (marginPct >= 0)  score = 45;
  else                      score = 20;

  if (profit < 0)            { warning = "Operating at a loss. Expenses exceed sales."; score -= 25; }
  else if (expRatio > 0.75)  { warning = "Expenses above 75% of sales — margins critically thin."; score -= 18; }
  else if (expRatio > 0.5)   { warning = "Expenses above 50% of sales. Cost structure review recommended."; score -= 8; }
  else if (yesterday && today.sales < yesterday.sales * 0.7) { warning = "Sales dropped more than 30% compared to yesterday."; score -= 12; }

  if      (profit < 0)                    recommendation = "Immediately cut non-essential expenses. Do not increase spending today.";
  else if (expRatio > 0.75)               recommendation = "Pause non-essential spending. Focus on converting existing inventory.";
  else if (expRatio > 0.5)                recommendation = "Identify 1–2 costs to reduce by 20% this week.";
  else if (yesterday && today.sales > yesterday.sales*1.2) recommendation = "Strong momentum. Consider restocking top products.";
  else if (Number(marginPct) >= 40)       recommendation = "Excellent margins. Good time to invest in marketing or new lines.";
  else                                    recommendation = "Stay consistent. Daily data builds your intelligence model.";

  const topP = db.prepare("SELECT name FROM products WHERE user_id = ? ORDER BY revenue DESC LIMIT 1").get(userId);
  if (topP) topProduct = topP.name;

  const weekStats = week ? {
    totalSales:    week.total_sales    || 0,
    totalExpenses: week.total_expenses || 0,
    totalProfit:   week.total_profit   || 0,
    avgDailySales: Math.round(week.avg_daily_sales || 0),
    bestDaySales:  week.best_day_sales || 0,
    daysRecorded:  week.days_recorded  || 0,
  } : null;

  const dateStr = new Date().toISOString().split("T")[0];
  db.prepare(`
    INSERT INTO insights_cache (user_id,date,profit_trend,top_product,summary,warning,recommendation)
    VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(user_id,date) DO UPDATE SET
      profit_trend=excluded.profit_trend, top_product=excluded.top_product,
      summary=excluded.summary, warning=excluded.warning, recommendation=excluded.recommendation
  `).run(userId, dateStr, profitTrend, topProduct, summary, warning||"", recommendation);

  const feed    = generateFeed(today, yesterday, history, week);
  const signals = generateSignals(today, history);
  const alerts  = generateAlerts(today, yesterday, history);

  return {
    hasData: true,
    today: { sales:today.sales, expenses:today.expenses, profit, margin:Number(marginPct), date:today.date },
    yesterday: yesterday ? { sales:yesterday.sales, expenses:yesterday.expenses, profit:yesterday.sales-yesterday.expenses } : null,
    profitTrend, topProduct, summary, warning, recommendation,
    score: Math.max(0, Math.min(100, score)),
    weekStats,
    history: history.map(e => ({ date:e.date, sales:e.sales, expenses:e.expenses, profit:e.sales-e.expenses })),
    feed, signals, alerts, streak,
  };
};

module.exports = { runInsights, generateFeed, generateSignals, generateAlerts };
