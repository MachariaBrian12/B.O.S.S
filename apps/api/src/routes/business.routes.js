const router = require('express').Router();
const {
  addEntry,
  getToday,
  getHistory,
  updateEntry,
  deleteEntry,
} = require('../controllers/business.controller');
const businessService = require('../services/business.service');
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev_secret_change_me',
    );
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(protect);

router.post('/entry', addEntry);
router.put('/entry', updateEntry);
router.delete('/entry', deleteEntry);
router.get('/today', getToday);
router.get('/history', getHistory);

router.get('/week', async (req, res) => {
  try {
    const history = await businessService.getHistory(req.user.id, 7);
    const summary = await businessService.getWeekSummary(req.user.id);
    res.json({ success: true, history, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
