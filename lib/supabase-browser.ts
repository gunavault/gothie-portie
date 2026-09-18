import { createBrowserClient } from "@supabase/ssr";

/** Shares the session cookie with the server, so Storage writes pass RLS. */
export function browserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
