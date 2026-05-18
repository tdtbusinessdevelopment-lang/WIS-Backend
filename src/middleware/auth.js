/**
 * src/middleware/auth.js
 *
 * Verifies the Supabase JWT passed in the Authorization header.
 * Attaches the decoded user object to req.user for downstream use.
 *
 * Usage: router.get("/protected", authenticate, handler)
 *
 * Frontend must send:
 *   Authorization: Bearer <supabase_access_token>
 */

const { supabase } = require("../config/supabase");

async function authenticate(req, res, next) {
  // --- BYPASS FOR TESTING (No token required in development) ---
  if (process.env.NODE_ENV !== "production") {
    req.user = { id: "test-user", email: "test@example.com" };
    return next();
  }
  // -------------------------------------------------------------

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed Authorization header." });
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  req.user = user; // e.g. req.user.id, req.user.email
  next();
}

module.exports = { authenticate };
