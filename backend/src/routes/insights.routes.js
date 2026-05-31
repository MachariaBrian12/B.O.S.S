const router  = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { runInsights, generateSignals, generateAlerts } = require("../services/insights.service");
const businessService = require("../services/business.service");

router.use(protect);

router.get("/daily", async (req, res) => {
  try {
    res.json({ success:true, insights: await runInsights(req.user.id) });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get("/signals", async (req, res) => {
  try {
    const today   = await businessService.getToday(req.user.id);
    const history = await businessService.getHistory(req.user.id, 14);
    res.json({ success:true, signals: generateSignals(today, history) });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get("/alerts", async (req, res) => {
  try {
    const today     = await businessService.getToday(req.user.id);
    const yesterday = await businessService.getYesterday(req.user.id);
    const history   = await businessService.getHistory(req.user.id, 7);
    res.json({ success:true, alerts: generateAlerts(today, yesterday, history) });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

module.exports = router;
