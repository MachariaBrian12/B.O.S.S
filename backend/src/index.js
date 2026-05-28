const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./db/database");

/* ── routes ── */
const authRoutes = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const insightsRoutes = require("./routes/insights.routes");

const app = express();

/* ── allowed origins ── */
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(o => o.trim());

/* ── CORS ── */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
}));

/* ── middleware ── */
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

/* ── health check ── */
app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
    service: "B.O.S.S Engine",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

/* ── routes ── */
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/insights", insightsRoutes);

/* ── 404 handler ── */
app.use((_, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ── error handler ── */
app.use((err, _req, res, _next) => {
  console.error("❌ Server error:", err.message);

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

/* ── start server ── */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 B.O.S.S Engine → http://localhost:${PORT}`);
  console.log(`🌍 Allowed origins: ${allowedOrigins.join(", ")}`);
});
