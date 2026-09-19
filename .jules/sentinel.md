## 2026-09-18 - Next.js Server Actions Bypass Middleware Route Checks
**Vulnerability:** Server actions in `app/orbital-command/actions.ts` (`saveContent`, `resetContent`) executed Supabase RPC `save_portfolio` without verifying `db.auth.getUser()`.
**Learning:** Middleware matching `/orbital-command/*` protects page routing, but Next.js Server Actions are directly callable endpoints via POST requests. Page-level middleware guards do not automatically enforce authentication inside server action handlers.
**Prevention:** Always explicitly check `const { data: { user } } = await db.auth.getUser()` inside server actions performing mutation operations before executing RPCs or database queries.
