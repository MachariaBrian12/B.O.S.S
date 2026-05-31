const { pool } = require("../db/database");
const businessService = require("./business.service");

const fmt  = n => `KES ${Number(n||0).toLocaleString()}`;
const pct  = (a,b) => b > 0 ? (((a-b)/b)*100).toFixed(1) : null;

const getStreak = async (userId) => {
  const { rows } = await pool.query("SELECT date FROM business_entries WHERE user_id=$1 ORDER BY date DESC", [userId]);
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

const generateFeed = (today, yesterday, history) => {
  const feed = [];
  if (!today) return feed;
  const profit   = today.sales - today.expenses;
  const margin   = today.sales > 0 ? ((profit/today.sales)*100).toFixed(1) : 0;
  const expRatio = today.sales > 0 ? today.expenses/today.sales : 0;

  if (yesterday) {
    const salesDiff  = pct(today.sales, yesterday.sales);
    const profitDiff = pct(profit, yesterday.sales - yesterday.expenses);
    const expDiff    = pct(today.expenses, yesterday.expenses);
    if (salesDiff !== null) {
      const up = parseFloat(salesDiff) >= 0;
      feed.push({ id:"sales-vs-yday", type:up?"growth":"warning", icon:up?"↑":"↓",
        title: up?"Revenue momentum":"Revenue softened",
        body:`Sales ${up?"up":"down"} ${Math.abs(parseFloat(salesDiff))}% vs yesterday (${fmt(yesterday.sales)}).`,
        time:"Compared to yesterday", priority:up?2:1 });
    }
    if (expDiff !== null && parseFloat(expDiff) > 20) {
      feed.push({ id:"exp-spike", type:"alert", icon:"⚠", title:"Expense spike detected",
        body:`Expenses rose ${Math.abs(parseFloat(expDiff))}% vs yesterday.`,
        time:"Compared to yesterday", priority:1 });
    }
    if (profitDiff !== null) {
      const up = parseFloat(profitDiff) >= 0;
      feed.push({ id:"profit-trend", type:up?"growth":"warning", icon:up?"◆":"◇",
        title:up?"Profit improving":"Profit under pressure",
        body:`Net profit ${up?"improved":"declined"} ${Math.abs(parseFloat(profitDiff))}% vs yesterday. Margin: ${margin}%.`,
        time:"Compared to yesterday", priority:up?3:1 });
    }
  }
  if (Number(margin) >= 45) {
    feed.push({ id:"high-margin", type:"growth", icon:"★", title:"Strong margin performance",
      body:`${margin}% profit margin — above the healthy 30% threshold.`, time:"Today", priority:4 });
  } else if (Number(margin) < 15 && today.sales > 0) {
    feed.push({ id:"low-margin", type:"critical", icon:"!", title:"Margin compression alert",
      body:`Profit margin at ${margin}% — expenses consuming ${(expRatio*100).toFixed(0)}% of revenue.`, time:"Today", priority:0 });
  }
  if (history.length >= 3) {
    const avgSales = history.slice(0,7).reduce((a,r)=>a+Number(r.sales),0)/Math.min(history.length,7);
    const diff = pct(today.sales, avgSales);
    if (diff !== null && Math.abs(parseFloat(diff)) > 15) {
      const up = parseFloat(diff) >= 0;
      feed.push({ id:"vs-weekly-avg", type:up?"opportunity":"warning", icon:up?"⬆":"⬇",
        title:up?"Above weekly average":"Below weekly average",
        body:`Today's sales ${Math.abs(parseFloat(diff))}% ${up?"above":"below"} your 7-day average of ${fmt(Math.round(avgSales))}.`,
        time:"7-day average", priority:up?3:2 });
    }
  }
  if (expRatio > 0.7) {
    feed.push({ id:"high-exp-ratio", type:"alert", icon:"⚡", title:"High expense ratio",
      body:`Expenses at ${(expRatio*100).toFixed(0)}% of revenue. Sustainable max is 60%.`, time:"Today", priority:1 });
  }
  return feed.sort((a,b) => a.priority - b.priority);
};

const generateSignals = (today, history) => {
  const signals = [];
  if (!today || history.length < 3) {
    signals.push({ id:"more-data", confidence:40, direction:"neutral",
      title:"Building your intelligence model",
      body:"Add entries for at least 3 days to unlock predictive signals.", timeframe:"Ongoing" });
    return signals;
  }
  const recent3 = history.slice(0,3);
  const salesTrend = recent3[0].sales - recent3[2].sales;
  const expTrend   = recent3[0].expenses - recent3[2].expenses;
  if (salesTrend < -0.1 * recent3[2].sales) {
    signals.push({ id:"sales-declining", confidence:68, direction:"down",
      title:"Sales may slow tomorrow",
      body:"Revenue has declined over the last 3 days. Consider a targeted promotion.", timeframe:"Next 1–2 days" });
  } else if (salesTrend > 0.1 * recent3[2].sales) {
    signals.push({ id:"sales-rising", confidence:72, direction:"up",
      title:"Revenue momentum building",
      body:"Sales have grown consistently. Ensure inventory can meet continued demand.", timeframe:"Next 1–2 days" });
  }
  if (expTrend > 0.15 * recent3[2].expenses) {
    signals.push({ id:"exp-pressure", confidence:74, direction:"down",
      title:"Cash flow pressure likely",
      body:"Expenses rising consistently. Cash flow may tighten next week.", timeframe:"Next 3–5 days" });
  }
  if (!signals.length) {
    signals.push({ id:"stable", confidence:70, direction:"neutral",
      title:"Business operating steadily",
      body:"No anomalies detected. Continue monitoring daily performance.", timeframe:"Near term" });
  }
  return signals;
};

const generateAlerts = (today, yesterday, history) => {
  const alerts = [];
  if (!today) return alerts;
  const profit   = today.sales - today.expenses;
  const margin   = today.sales > 0 ? (profit/today.sales)*100 : 0;
  const expRatio = today.sales > 0 ? today.expenses/today.sales : 0;
  if (profit < 0) alerts.push({ level:"critical", title:"Operating at a loss",
    body:`Expenses exceed sales by ${fmt(Math.abs(profit))}.`, action:"Review and cut non-essential expenses today." });
  if (expRatio > 0.75 && profit >= 0) alerts.push({ level:"warning", title:"Expenses too high",
    body:`${(expRatio*100).toFixed(0)}% of revenue going to expenses.`, action:"Identify top 2 expenses and reduce them." });
  if (yesterday && today.sales < yesterday.sales * 0.65) alerts.push({ level:"warning", title:"Significant sales drop",
    body:`Revenue fell 35%+ vs yesterday (${fmt(yesterday.sales)}).`, action:"Check pricing, visibility, and stock." });
  if (margin >= 40 && today.sales > 0) alerts.push({ level:"opportunity", title:"Strong margin window",
    body:`${margin.toFixed(1)}% margin today. Prime time to reinvest.`, action:"Consider increasing inventory." });
  return alerts;
};

const runInsights = async (userId) => {
  const today     = await businessService.getToday(userId);
  const yesterday = await businessService.getYesterday(userId);
  const week      = await businessService.getWeekSummary(userId);
  const history   = await businessService.getHistory(userId, 30);
  const streak    = await getStreak(userId);

  if (!today) {
    return { hasData:false, profitTrend:"neutral", topProduct:"No products recorded yet",
      summary:"No data entered yet for today.", warning:null,
      recommendation:"Enter today's sales and expenses to get your first insight.",
      score:50, feed:[], signals:generateSignals(null, history), alerts:[], streak, history:[] };
  }

  const profit    = Number(today.sales) - Number(today.expenses);
  const marginPct = today.sales > 0 ? ((profit/Number(today.sales))*100).toFixed(1) : 0;
  const expRatio  = today.sales > 0 ? today.expenses/today.sales : 0;

  let profitTrend = "neutral";
  if (yesterday) {
    const prevProfit = Number(yesterday.sales) - Number(yesterday.expenses);
    if (profit > prevProfit) {
      const p = prevProfit > 0 ? (((profit-prevProfit)/prevProfit)*100).toFixed(1) : 100;
      profitTrend = `+${p}%`;
    } else if (profit < prevProfit) {
      const p = prevProfit > 0 ? (((prevProfit-profit)/prevProfit)*100).toFixed(1) : 100;
      profitTrend = `-${p}%`;
    } else { profitTrend = "0%"; }
  }

  let score = 50;
  if      (marginPct >= 45) score = 92;
  else if (marginPct >= 35) score = 80;
  else if (marginPct >= 20) score = 65;
  else if (marginPct >= 0)  score = 45;
  else                      score = 20;

  let warning = null;
  if      (profit < 0)           { warning = "Operating at a loss. Expenses exceed sales."; score -= 25; }
  else if (expRatio > 0.75)      { warning = "Expenses above 75% of sales — margins critically thin."; score -= 18; }
  else if (expRatio > 0.5)       { warning = "Expenses above 50% of sales."; score -= 8; }

  let recommendation = "Stay consistent. Daily data builds your intelligence model.";
  if      (profit < 0)           recommendation = "Cut non-essential expenses immediately.";
  else if (expRatio > 0.75)      recommendation = "Pause non-essential spending.";
  else if (Number(marginPct)>=40) recommendation = "Excellent margins. Good time to invest in marketing.";

  const { rows: topP } = await pool.query("SELECT name FROM products WHERE user_id=$1 ORDER BY revenue DESC LIMIT 1", [userId]);
  const topProduct = topP[0]?.name || "No products recorded yet";

  const weekStats = week ? {
    totalSales:    Number(week.total_sales)    || 0,
    totalExpenses: Number(week.total_expenses) || 0,
    totalProfit:   Number(week.total_profit)   || 0,
    avgDailySales: Math.round(Number(week.avg_daily_sales) || 0),
    bestDaySales:  Number(week.best_day_sales) || 0,
    daysRecorded:  Number(week.days_recorded)  || 0,
  } : null;

  const feed    = generateFeed(today, yesterday, history);
  const signals = generateSignals(today, history);
  const alerts  = generateAlerts(today, yesterday, history);

  return {
    hasData: true,
    today: { sales:Number(today.sales), expenses:Number(today.expenses), profit, margin:Number(marginPct), date:today.date },
    yesterday: yesterday ? { sales:Number(yesterday.sales), expenses:Number(yesterday.expenses), profit:Number(yesterday.sales)-Number(yesterday.expenses) } : null,
    profitTrend, topProduct, summary:`${fmt(today.sales)} in sales · ${fmt(today.expenses)} in expenses · ${fmt(profit)} profit (${marginPct}% margin).`,
    warning, recommendation, score:Math.max(0,Math.min(100,score)),
    weekStats, history:history.map(e=>({ date:e.date, sales:Number(e.sales), expenses:Number(e.expenses), profit:Number(e.sales)-Number(e.expenses) })),
    feed, signals, alerts, streak,
  };
};

module.exports = { runInsights, generateFeed, generateSignals, generateAlerts };
