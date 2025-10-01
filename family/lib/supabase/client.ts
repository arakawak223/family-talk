import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // デバッグ用（本番環境で環境変数を確認）
  console.log("Supabase URL:", supabaseUrl ? "✓ Loaded" : "✗ Missing");
  console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Loaded" : "✗ Missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Environment variables check:", {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "[REDACTED]" : undefined,
    });
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
