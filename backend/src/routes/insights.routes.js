const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const insightsService = require("../services/insights.service");

router.use(protect);

router.get("/daily", (req, res) => {
  try {
    const insights = insightsService.runInsights(req.user.id);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
