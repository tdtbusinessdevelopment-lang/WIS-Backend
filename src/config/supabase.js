/**
 * src/config/supabase.js
 *
 * Initializes two Supabase clients:
 *  - supabase       → uses ANON key (respects RLS; safe for user-scoped queries)
 *  - supabaseAdmin  → uses SERVICE ROLE key (bypasses RLS; for trusted server ops)
 *
 * Always prefer `supabase` unless you specifically need to bypass RLS.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
  process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

// Anon client — honours Row Level Security policies
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client — bypasses RLS (use only in trusted server contexts)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabase, supabaseAdmin };
