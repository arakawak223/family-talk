import { redirect } from "next/navigation";
import { isAdmin, getAllFamiliesWithStats, getSystemStats } from "@/lib/admin";
import { SystemStatsCards } from "@/components/admin/system-stats-cards";
import { FamiliesTable } from "@/components/admin/families-table";

export default async function AdminPage() {
  // 管理者権限チェック
  const hasAdminAccess = await isAdmin();

  if (!hasAdminAccess) {
    redirect("/auth/login");
  }

  // データ取得
  const [systemStats, families] = await Promise.all([
    getSystemStats(),
    getAllFamiliesWithStats(),
  ]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">管理画面</h1>
        <p className="text-muted-foreground">
          Family Talkの利用状況を管理します
        </p>
      </div>

      <SystemStatsCards stats={systemStats} />

      <FamiliesTable families={families} />
    </div>
  );
}
