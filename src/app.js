/**
 * src/app.js
 *
 * Express application setup.
 * - Global middleware (security, logging, CORS, JSON parsing)
 * - API route mounting
 * - Health-check endpoint
 * - Global error handler (must be last)
 *
 * Imported by server.js which handles port binding.
 */

require("dotenv").config();
const express = require("express");
const helmet  = require("helmet");
const morgan  = require("morgan");
const cors    = require("cors");

const routes       = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl) during development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed.`));
      }
    },
    credentials: true, // allow Authorization headers
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check (no auth required) ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Global error handler (MUST be last) ───────────────────────────────────────
app.use(errorHandler);

module.exports = app;
