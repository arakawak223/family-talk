import { createBrowserClient } from "@supabase/ssr";

// 環境変数を直接取得（ビルド時に埋め込まれる）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  // デバッグ用（本番環境で環境変数を確認）
  console.log("Supabase URL:", supabaseUrl || "✗ Missing");
  console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Loaded" : "✗ Missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Environment variables check:", {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl || "undefined",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "[REDACTED]" : "undefined",
      allEnv: typeof window !== "undefined" ? "browser" : "server",
    });
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
