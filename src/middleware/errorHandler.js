/**
 * src/middleware/errorHandler.js
 *
 * Global Express error handler. Must be registered LAST in app.js
 * (after all routes) to catch errors forwarded via next(err).
 *
 * Returns a consistent JSON error shape to the frontend:
 *   { error: "message", details: "optional extra info" }
 */

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
