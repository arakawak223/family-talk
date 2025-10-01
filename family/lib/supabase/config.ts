// Supabase設定
// 注: 本番環境では環境変数から読み込むべきですが、
// Vercelでの環境変数読み込みに問題があるため一時的にここに記載

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://psnlgyisnpwoafjiyhwn.supabase.co",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmxneWlzbnB3b2Fmaml5aHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI0ODksImV4cCI6MjA3NDU1ODQ4OX0.qC_XjVNSSjAJmcUWaeYzduUSYeJCmLFgZmcy9VDqipc",
};
