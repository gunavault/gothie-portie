import LoginForm from "@/components/admin/LoginForm";

// keeps the console out of search results
export const metadata = {
  title: "GD.26 Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return <LoginForm configured={configured} />;
}
