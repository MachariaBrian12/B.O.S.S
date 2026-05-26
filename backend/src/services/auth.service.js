const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const db     = require("../db/database");
const { JWT_SECRET } = require("../middleware/auth.middleware");

const register = (name, email, password, business) => {
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) throw new Error("Email already registered");

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    "INSERT INTO users (name, email, password, business) VALUES (?, ?, ?, ?)"
  ).run(name, email.toLowerCase().trim(), hashed, business || "My Business");

  const user = db.prepare("SELECT id, name, email, business, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};

const login = (email, password) => {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user) throw new Error("Invalid email or password");

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  const { password: _, ...safe } = user;
  return { user: safe, token };
};

const getMe = (userId) => {
  const user = db.prepare("SELECT id, name, email, business, created_at FROM users WHERE id = ?").get(userId);
  if (!user) throw new Error("User not found");
  return user;
};

module.exports = { register, login, getMe };
