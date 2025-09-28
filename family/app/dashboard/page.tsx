import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserWithFamilies } from "@/lib/auth";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const userWithFamilies = await getCurrentUserWithFamilies();

  if (!userWithFamilies) {
    redirect("/auth/login");
  }

  // プロフィールがない場合はオンボーディングへ
  if (!userWithFamilies.profile) {
    redirect("/onboarding");
  }

  // 家族に参加していない場合はオンボーディングへ
  if (userWithFamilies.families.length === 0) {
    redirect("/onboarding");
  }

  return <DashboardContent user={userWithFamilies} />;
}