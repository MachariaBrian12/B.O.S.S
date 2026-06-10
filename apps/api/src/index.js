const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");

const { init } = require("./db/database"); init().catch(console.error);

const authRoutes     = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const insightsRoutes = require("./routes/insights.routes");
const healthRoute    = require("./routes/health.route");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

/**
 * Deep health check — verifies DB connectivity, not just process uptime.
 * This is the URL you give to Better Uptime / Checkly.
 */
app.use("/api/health", healthRoute);

app.use("/api/auth",     authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/insights", insightsRoutes);

app.use((_, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`B.O.S.S Engine running on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
