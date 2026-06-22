const db = require('../db/database');
const authService = require('../services/auth.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

// ─── Step 1: Request a password reset ────────────────────────────────────────
// User submits their email. We generate a secure time-limited token and send
// it to them. We always return the same message whether the email exists or not
// so attackers can't tell which addresses are registered (account enumeration).

const requestPasswordReset = async (req, res) => {
  const genericResponse = {
    success: true,
    message: 'If that email is registered, a reset link has been sent.',
  };

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { rows } = await db.pool.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email.toLowerCase().trim()],
    );

    // No account — return generic response so we don't leak which emails exist
    if (!rows[0]) return res.json(genericResponse);

    const user = rows[0];

    // Generate a cryptographically secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Store only the hash — the raw token is sent to the user, never stored
    const tokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour

    await db.pool.query(
      `UPDATE users
       SET reset_token = $1, reset_token_expires = $2
       WHERE id = $3`,
      [tokenHash, expiresAt, user.id],
    );

    const firstName = user.name ? user.name.split(' ')[0] : 'there';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email.toLowerCase().trim())}`;

    // Send the reset email — if email sending fails we still return generic
    // so the user isn't confused, but we log the error for debugging
    try {
      await authService.sendPasswordResetEmail({
        to: email.toLowerCase().trim(),
        firstName,
        resetUrl,
      });
    } catch (emailErr) {
      console.error('Failed to send password reset email:', emailErr);
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    // Still return generic — don't leak error details
    return res.json(genericResponse);
  }
};

// ─── Step 2: Confirm a password reset ────────────────────────────────────────
// User clicks the link in their email which contains ?token=...&email=...
// They submit { email, token, newPassword }. We verify the token is valid and
// unexpired before touching the password. Token is single-use — cleared on use.

const confirmPasswordReset = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword)
      return res
        .status(400)
        .json({ error: 'Email, token, and new password are required' });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });

    // Hash the incoming token to compare with what we stored
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const { rows } = await db.pool.query(
      `SELECT id FROM users
       WHERE email = $1
         AND reset_token = $2
         AND reset_token_expires > NOW()`,
      [email.toLowerCase().trim(), tokenHash],
    );

    if (!rows[0])
      return res
        .status(400)
        .json({
          error:
            'This reset link is invalid or has expired. Please request a new one.',
        });

    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and clear the token so it can't be reused
    await db.pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expires = NULL
       WHERE id = $2`,
      [hashed, rows[0].id],
    );

    res.json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (err) {
    console.error('confirmPasswordReset error:', err);
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
  requestPasswordReset,
  confirmPasswordReset,
  updateProfile,
};
