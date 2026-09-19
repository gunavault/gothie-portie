## 2026-09-19 - Next.js Server Action Authorization Bypass
**Vulnerability:** Next.js Server Actions create public HTTP POST endpoints that can be invoked directly by client requests, bypassing route-level middleware protection (`middleware.ts`). Server actions performing sensitive mutations (`saveContent`, `resetContent`) called Supabase RPC functions without validating user authentication status first.
**Learning:** Middleware in Next.js protects page routing (`/orbital-command/:path*`), but does not protect Server Actions imported or called independently.
**Prevention:** Always verify caller session/user using `db.auth.getUser()` inside Server Action functions before executing sensitive backend mutations.
