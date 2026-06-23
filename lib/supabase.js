import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yjonlzmzoclynfamfmws.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb25sem16b2NseW5mYW1mbXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTU0NDMsImV4cCI6MjA5Nzc3MTQ0M30.aPtxNDuvj1afmTZTSYCdr_wCoETLPLm8wK9OHrfBeX4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
