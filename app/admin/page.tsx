import { redirect } from "next/navigation";
import AdminApp from "@/components/admin/AdminApp";
import { getAdminContent } from "@/lib/admin";
import { supabaseConfigured } from "@/lib/supabase";
import { serverClient } from "@/lib/supabase-server";

export const metadata = { title: "GD.26 Admin" };

export default async function AdminPage() {
  // the login screen explains what is missing; this page cannot run without it
  if (!supabaseConfigured) redirect("/admin/login");

  const db = await serverClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  const content = await getAdminContent();

  return <AdminApp initial={content} email={user?.email ?? ""} />;
}
