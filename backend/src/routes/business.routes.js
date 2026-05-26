const router = require("express").Router();
const { addEntry, getToday, getHistory } = require("../controllers/business.controller");
const { protect } = require("../middleware/auth.middleware");
const businessService = require("../services/business.service");

router.use(protect);

router.post("/entry",   addEntry);
router.get ("/today",   getToday);
router.get ("/history", getHistory);

router.get("/week", (req, res) => {
  try {
    const history = businessService.getHistory(req.user.id, 7);
    const summary = businessService.getWeekSummary(req.user.id);
    res.json({ success: true, history, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
