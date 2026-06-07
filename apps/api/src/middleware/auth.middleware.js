const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "boss_secret_change_in_prod";

const protect = (req, res, next) => {
  try {
    /* check cookie first, then Authorization header */
    const token =
      req.cookies?.boss_token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { protect, JWT_SECRET };
