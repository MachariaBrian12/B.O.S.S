const jwt = require('jsonwebtoken');

// Crash at startup if JWT_SECRET is not set.
// A missing secret means tokens are signed with a known fallback —
// anyone can forge a token and authenticate as any user.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(
    'FATAL: JWT_SECRET environment variable is not set. Refusing to start.',
  );
  process.exit(1);
}

const protect = (req, res, next) => {
  try {
    // Check Authorization header first, then fall back to cookie
    const token =
      req.headers.authorization?.replace('Bearer ', '') ||
      req.cookies?.boss_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { protect, JWT_SECRET };
