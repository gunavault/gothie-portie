import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Reads and writes the session cookie, so RLS sees the signed-in user. */
export async function serverClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (written) => {
          try {
            written.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // called from a server component, where cookies are read-only;
            // middleware refreshes the session instead
          }
        },
      },
    },
  );
}
