const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/database");
const { JWT_SECRET } = require("../middleware/auth.middleware");

const register = async (name, email, password, business) => {
  const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  if (exists.rows[0]) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password, business) VALUES ($1, $2, $3, $4) RETURNING id, name, email, business, created_at",
    [name, email.toLowerCase().trim(), hashed, business || "My Business"]
  );
  const user = rows[0];
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};

const login = async (email, password) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
  const user = rows[0];
  if (!user) throw new Error("Invalid email or password");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  const { password: _, ...safe } = user;
  return { user: safe, token };
};

const getMe = async (userId) => {
  const { rows } = await pool.query("SELECT id, name, email, business, created_at FROM users WHERE id = $1", [userId]);
  if (!rows[0]) throw new Error("User not found");
  return rows[0];
};

module.exports = { register, login, getMe };
