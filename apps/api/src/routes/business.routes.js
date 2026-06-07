const router = require("express").Router();
const { addEntry, getToday, getHistory, updateEntry, deleteEntry } = require("../controllers/business.controller");
const { protect } = require("../middleware/auth.middleware");
const businessService = require("../services/business.service");

router.use(protect);

router.post("/entry",          addEntry);
router.put ("/entry",          updateEntry);
router.delete("/entry",        deleteEntry);
router.get ("/today",          getToday);
router.get ("/history",        getHistory);

router.get("/week", async (req, res) => {
  try {
    const history = await businessService.getHistory(req.user.id, 7);
    const summary = await businessService.getWeekSummary(req.user.id);
    res.json({ success: true, history, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
