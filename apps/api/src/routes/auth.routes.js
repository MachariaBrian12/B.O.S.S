const router = require('express').Router();
const {
  register,
  login,
  logout,
  me,
  resetPassword,
  updateProfile,
} = require('../controllers/auth.controller');
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

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateProfile);

// Currency preference
router.get('/currency', protect, async (req, res) => {
  try {
    const { pool } = require('../db/database');
    const { rows } = await pool.query(
      'SELECT currency FROM users WHERE id=$1',
      [req.user.id],
    );
    res.json({ currency: rows[0]?.currency || 'KES' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/currency', protect, async (req, res) => {
  try {
    const { currency } = req.body;
    if (!currency) return res.status(400).json({ error: 'Currency required' });
    const { pool } = require('../db/database');
    await pool.query('UPDATE users SET currency=$1 WHERE id=$2', [
      currency,
      req.user.id,
    ]);
    res.json({ success: true, currency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
