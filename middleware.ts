import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Without Supabase configured there is nothing to sign in to; the admin says so.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (written) =>
        written.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        ),
    },
  });

  // refreshes an expiring session, and tells us whether there is one at all
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const onLogin = pathname === "/admin/login";

  if (!user && !onLogin) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    return NextResponse.redirect(login);
  }

  if (user && onLogin) {
    const admin = request.nextUrl.clone();
    admin.pathname = "/admin";
    return NextResponse.redirect(admin);
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
