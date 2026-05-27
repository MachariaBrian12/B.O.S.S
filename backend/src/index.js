const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");

require("./db/database");

const authRoutes     = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const insightsRoutes = require("./routes/insights.routes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.set("trust proxy", 1);

app.get("/api/health", (_, res) => res.json({
  status:  "ok",
  service: "B.O.S.S Engine",
  env:     process.env.NODE_ENV || "development",
  time:    new Date().toISOString(),
}));

app.use("/api/auth",     authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/insights", insightsRoutes);

app.use((_, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, _req, res, _next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 B.O.S.S Engine → http://localhost:${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
});
