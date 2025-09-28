import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // 既存のプロフィールチェック
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // プロフィールが既に存在し、家族に参加している場合はダッシュボードへ
  if (profile) {
    const { data: familyMemberships } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id);

    if (familyMemberships && familyMemberships.length > 0) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          ひと言しつもんアプリへようこそ！
        </h1>
        <p className="text-gray-600">
          家族との温かいコミュニケーションを始めましょう
        </p>
      </div>

      <OnboardingForm />
    </div>
  );
}