const router = require('express').Router();
const {
  register,
  login,
  logout,
  me,
  resetPassword,
  updateProfile,
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

router.post('/reset-password', resetPassword);

router.put('/profile', protect, updateProfile);

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
