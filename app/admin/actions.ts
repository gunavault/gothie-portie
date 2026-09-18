"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { seedContent, type AdminContent } from "@/lib/admin";
import { PORTFOLIO_TAG } from "@/lib/portfolio";
import { serverClient } from "@/lib/supabase-server";

async function write(content: AdminContent) {
  const db = await serverClient();
  const { error } = await db.rpc("save_portfolio", { payload: content });
  if (error) return { error: error.message };

  revalidateTag(PORTFOLIO_TAG);
  revalidatePath("/");
  return { error: null };
}

export async function saveContent(content: AdminContent) {
  return write(content);
}

export async function resetContent() {
  const result = await write(seedContent());
  return result.error ? result : { error: null, content: seedContent() };
}

export async function signIn(_state: unknown, formData: FormData) {
  const db = await serverClient();
  const { error } = await db.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: true };
  redirect("/admin");
}

export async function signOut() {
  const db = await serverClient();
  await db.auth.signOut();
  redirect("/admin/login");
}
