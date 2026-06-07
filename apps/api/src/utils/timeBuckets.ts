/**
 * =========================
 * DAY KEY (DAILY RESET)
 * =========================
 */
export function getDayKey(date = new Date()) {
  return date.toISOString().split('T')[0]; // 2026-05-30
}

/**
 * =========================
 * WEEK KEY (ISO STYLE)
 * =========================
 */
export function getWeekKey(date = new Date()) {
  const d = new Date(date);

  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start

  d.setDate(d.getDate() + diff);

  const year = d.getFullYear();
  const start = new Date(year, 0, 1);

  const week = Math.ceil(
    ((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7,
  );

  return `${year}-W${week}`;
}

/**
 * =========================
 * MONTH KEY
 * =========================
 */
export function getMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`; // 2026-05
}

/**
 * =========================
 * QUARTER KEY (NEW)
 * =========================
 */
export function getQuarterKey(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const quarter = Math.ceil(month / 3); // 1–4

  return `${year}-Q${quarter}`; // 2026-Q2
}

/**
 * =========================
 * YEAR KEY (NEW)
 * =========================
 */
export function getYearKey(date = new Date()) {
  return `${date.getFullYear()}`; // 2026
}

/**
 * =========================
 * ALL TOGETHER (MAIN EXPORT)
 * =========================
 */
export function getAllTimeBuckets(date = new Date()) {
  return {
    dayKey: getDayKey(date),
    weekKey: getWeekKey(date),
    monthKey: getMonthKey(date),
    quarterKey: getQuarterKey(date),
    yearKey: getYearKey(date),
  };
}
