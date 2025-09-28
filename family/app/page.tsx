import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithFamilies } from "@/lib/auth";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 認証済みユーザーの場合は適切なページにリダイレクト
  if (user) {
    const userWithFamilies = await getCurrentUserWithFamilies();

    // プロフィールがない、または家族に参加していない場合はオンボーディングへ
    if (!userWithFamilies?.profile || userWithFamilies.families.length === 0) {
      redirect("/onboarding");
    }

    // すべて完了している場合はダッシュボードへ
    redirect("/dashboard");
  }

  // 未認証ユーザーはランディングページを表示
  return <LandingPage />;
}
