const express = require("express");
const router  = express.Router();
const { pool } = require("../db/database");

/**
 * Deep health check — used by uptime monitors.
 *
 * Analogy: instead of asking the receptionist "is the hospital
 * open?", this walks into the building, checks the lights are on,
 * turns a tap to verify water pressure, then comes back and says
 * "yes, everything is working." Shallow checks miss DB outages,
 * connection pool exhaustion, and network partitions.
 *
 * Returns 200 if healthy, 503 if any critical system is down.
 * Uptime monitors should alert on anything that isn't 200.
 */
router.get("/", async (_req, res) => {
  const start = Date.now();

  try {
    await pool.query("SELECT 1");
    const latencyMs = Date.now() - start;

    return res.status(200).json({
      status:    "ok",
      service:   "B.O.S.S Engine",
      version:   process.env.npm_package_version || "1.0.0",
      env:       process.env.NODE_ENV || "development",
      db:        "ok",
      latencyMs,
      time:      new Date().toISOString(),
    });
  } catch (err) {
    const latencyMs = Date.now() - start;

    console.error("[health] DB check failed:", err.message);

    return res.status(503).json({
      status:    "degraded",
      service:   "B.O.S.S Engine",
      db:        "unreachable",
      error:     err.message,
      latencyMs,
      time:      new Date().toISOString(),
    });
  }
});

module.exports = router;
