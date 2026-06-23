import { createClient } from "@supabase/supabase-js";

// Load Supabase credentials from environment variables.
// Create a local `.env` file (not committed) with these keys, or set them
// in your environment when running the app.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Warn during development if env vars are missing.
  // Do not log secrets in production.
  // You can create a `.env` from `.env.example`.
  console.warn("SUPABASE_URL or SUPABASE_ANON_KEY not set in environment");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
