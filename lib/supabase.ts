import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False until the project's env vars are set, so the site runs on seed content. */
export const supabaseConfigured = Boolean(url && anonKey);

export function readClient() {
  return createClient(url!, anonKey!, { auth: { persistSession: false } });
}
