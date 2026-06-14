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

module.exports = router;
