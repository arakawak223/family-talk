import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";

export function createClient() {
  // デバッグ用
  console.log("Supabase URL:", supabaseConfig.url);
  console.log("Supabase Anon Key:", supabaseConfig.anonKey ? "✓ Loaded" : "✗ Missing");

  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    console.error("Supabase configuration is missing");
    throw new Error("Missing Supabase configuration");
  }

  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
