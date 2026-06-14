const router = require('express').Router();
const {
  runInsights,
  generateSignals,
  generateAlerts,
} = require('../services/insights.service');
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

router.get('/daily', async (req, res) => {
  try {
    res.json({ success: true, insights: await runInsights(req.user.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/signals', async (req, res) => {
  try {
    const today = await businessService.getToday(req.user.id);
    const history = await businessService.getHistory(req.user.id, 14);
    res.json({ success: true, signals: generateSignals(today, history) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const today = await businessService.getToday(req.user.id);
    const yesterday = await businessService.getYesterday(req.user.id);
    const history = await businessService.getHistory(req.user.id, 7);
    res.json({
      success: true,
      alerts: generateAlerts(today, yesterday, history),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
