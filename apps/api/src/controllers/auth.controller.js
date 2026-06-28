const db = require('../db/database');
const authService = require('../services/auth.service');
const bcrypt = require('bcryptjs');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    const { name, email, password, business } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const { user, token } = await authService.register(name, email, password, business);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });
    const { user, token } = await authService.login(email, password);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

const me = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// ─── Password Reset — security question approach ──────────────────────────────
// No email needed. User provides their email + business name as verification.
// If both match, password is updated immediately on the same page.
// Simple but effective — only the account owner knows their business name.

const resetPassword = async (req, res) => {
  try {
    const { email, businessName, newPassword } = req.body;

    if (!email || !businessName || !newPassword)
      return res.status(400).json({
        error: 'Email, business name and new password are required',
      });

    if (newPassword.length < 6)
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      });

    // Match on email + business name (case-insensitive on business)
    const { rows } = await db.pool.query(
      'SELECT id FROM users WHERE email = $1 AND LOWER(business) = LOWER($2)',
      [email.toLowerCase().trim(), businessName.trim()],
    );

    if (!rows[0])
      return res.status(400).json({
        error: 'Email and business name do not match our records',
      });

    const hashed = await