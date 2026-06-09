const businessService = require("../services/business.service");
const insightsService = require("../services/insights.service");
const { AuditService } = require("../services/audit.service");

/**
 * Business Controller — all write operations emit audit logs.
 *
 * Analogy: every time a cashier opens the till, a camera
 * records it automatically. The cashier doesn't have to
 * remember to press record — it just happens. That's what
 * AuditService.logAction() does here: fires after every
 * successful write, invisibly, without blocking the response.
 */

const addEntry = async (req, res) => {
  try {
    const { sales, expenses, notes } = req.body;
    if (sales === undefined || expenses === undefined)
      return res.status(400).json({ error: "Sales and expenses are required" });

    const entry    = await businessService.addEntry(req.user.id, {
      sales: Number(sales), expenses: Number(expenses), notes
    });
    const insights = await insightsService.runInsights(req.user.id);

    // Fire-and-forget audit log — never awaited so it never slows the response
    AuditService.logAction(req, 'entry.created', 'BusinessEntry', entry.id, {
      sales: Number(sales),
      expenses: Number(expenses),
      notes: notes || null,
    });

    res.status(201).json({ success: true, entry, insights });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getToday = async (req, res) => {
  try {
    const today = await businessService.getToday(req.user.id);
    res.json({ success: true, entry: today });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const limit   = parseInt(req.query.limit) || 30;
    const history = await businessService.getHistory(req.user.id, limit);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { sales, expenses, notes } = req.body;
    if (sales === undefined || expenses === undefined)
      return res.status(400).json({ error: "Sales and expenses are required" });

    const today = new Date().toISOString().split("T")[0];
    const { rows } = await require("../db/database").pool.query(
      `UPDATE business_entries SET sales=$1, expenses=$2, notes=$3
       WHERE user_id=$4 AND date=$5 RETURNING *`,
      [Number(sales), Number(expenses), notes || "", req.user.id, today]
    );
    if (!rows[0]) return res.status(404).json({ error: "No entry found for today" });

    const insights = await require("../services/insights.service").runInsights(req.user.id);

    AuditService.logAction(req, 'entry.updated', 'BusinessEntry', rows[0].id, {
      sales: Number(sales),
      expenses: Number(expenses),
      notes: notes || null,
      date: today,
    });

    res.json({ success: true, entry: rows[0], insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { rowCount } = await require("../db/database").pool.query(
      "DELETE FROM business_entries WHERE user_id=$1 AND date=$2",
      [req.user.id, today]
    );
    if (!rowCount) return res.status(404).json({ error: "No entry found for today" });

    AuditService.logAction(req, 'entry.deleted', 'BusinessEntry', null, {
      date: today,
    });

    res.json({ success: true, message: "Today's entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addEntry, getToday, getHistory, updateEntry, deleteEntry };
