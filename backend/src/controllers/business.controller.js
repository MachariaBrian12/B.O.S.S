const businessService = require("../services/business.service");
const insightsService = require("../services/insights.service");

const addEntry = (req, res) => {
  try {
    const { sales, expenses, notes } = req.body;
    if (sales === undefined || expenses === undefined)
      return res.status(400).json({ error: "Sales and expenses are required" });

    const entry = businessService.addEntry(req.user.id, {
      sales:    Number(sales),
      expenses: Number(expenses),
      notes,
    });

    /* auto-run insights after every entry */
    const insights = insightsService.runInsights(req.user.id);
    res.status(201).json({ success: true, entry, insights });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getToday = (req, res) => {
  try {
    const today = businessService.getToday(req.user.id);
    res.json({ success: true, entry: today });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = (req, res) => {
  try {
    const limit   = parseInt(req.query.limit) || 30;
    const history = businessService.getHistory(req.user.id, limit);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addEntry, getToday, getHistory };
