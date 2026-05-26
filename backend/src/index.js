const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");

/* ── boot database immediately ── */
require("./db/database");

/* ── routes ── */
const authRoutes     = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const insightsRoutes = require("./routes/insights.routes");

const app = express();

/* ── middleware ── */
app.use(cors({
  origin:      "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

/* ── health check ── */
app.get("/api/health", (_, res) => res.json({
  status:  "ok",
  service: "B.O.S.S Engine",
  time:    new Date().toISOString(),
}));

/* ── mount routes ── */
app.use("/api/auth",     authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/insights", insightsRoutes);

/* ── 404 handler ── */
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

/* ── global error handler ── */
app.use((err, _req, res, _next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 B.O.S.S Engine running on http://localhost:${PORT}`);
});
