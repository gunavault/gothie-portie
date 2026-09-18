"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import s from "./login.module.css";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, { error: false });

  return (
    <div className={s.stage}>
      <form className={s.form} action={action}>
        <div className={s.eyebrow}>
          <span className={s.beacon} />
          Restricted — GD.26 Admin
        </div>
        <div className={s.title}>Identify yourself.</div>

        {configured ? (
          <>
            <input type="email" name="email" placeholder="Email" autoFocus required />
            <input type="password" name="password" placeholder="Passphrase" required />
            {state?.error && <div className={s.error}>Access denied. Try again.</div>}
            <button type="submit" className={s.submit} disabled={pending}>
              {pending ? "Checking…" : "Enter"}
            </button>
          </>
        ) : (
          <div className={s.error}>
            Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY, then reload.
          </div>
        )}

        <a className={s.back} href="/">
          ← Back to portfolio
        </a>
      </form>
    </div>
  );
}
