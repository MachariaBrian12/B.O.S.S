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
      return res
        .status(400)
        .json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    const { user, token } = await authService.register(
      name,
      email,
      password,
      business,
    );
    res.cookie('boss_token', token, COOKIE_OPTIONS);
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
    res.cookie('boss_token', token, COOKIE_OPTIONS);
    res.json({ success: true, user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const logout = (_req, res) => {
  res.clearCookie('boss_token');
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

    const { rows } = await db.pool.query(
      'SELECT id FROM users WHERE email = $1 AND LOWER(business) = LOWER($2)',
      [email.toLowerCase().trim(), businessName.trim()],
    );

    if (!rows[0])
      return res.status(400).json({
        error: 'Email and business name do not match our records',
      });

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.pool.query('UPDATE users SET password = $1 WHERE id = $2', [
      hashed,
      rows[0].id,
    ]);

    res.json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, business, currentPassword, newPassword } = req.body;
    if (!name || !business)
      return res.status(400).json({ error: 'Name and business are required' });
    const { rows } = await db.pool.query('SELECT * FROM users WHERE id = $1', [
      req.user.id,
    ]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (newPassword) {
      if (!currentPassword)
        return res
          .status(400)
          .json({ error: 'Current password required to set new password' });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid)
        return res.status(400).json({ error: 'Current password is incorrect' });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: 'New password must be at least 6 characters' });
      const hashed = await bcrypt.hash(newPassword, 10);
      await db.pool.query(
        'UPDATE users SET name=$1, business=$2, password=$3 WHERE id=$4',
        [name, business, hashed, req.user.id],
      );
    } else {
      await db.pool.query('UPDATE users SET name=$1, business=$2 WHERE id=$3', [
        name,
        business,
        req.user.id,
      ]);
    }
    const { rows: updated } = await db.pool.query(
      'SELECT id, name, email, business, created_at FROM users WHERE id=$1',
      [req.user.id],
    );
    res.json({ success: true, user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  resetPassword,
  updateProfile,
};
