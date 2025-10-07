import { redirect } from "next/navigation";
import { isAdmin, getFamilyDetails } from "@/lib/admin";
import { FamilyDetailView } from "@/components/admin/family-detail-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function FamilyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 管理者権限チェック
  const hasAdminAccess = await isAdmin();

  if (!hasAdminAccess) {
    redirect("/dashboard");
  }

  // paramsをawait
  const { id } = await params;

  // 家族詳細データを取得
  const familyData = await getFamilyDetails(id);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理画面に戻る
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{familyData.family.name}</h1>
        <p className="text-muted-foreground">家族グループの詳細情報</p>
      </div>

      <FamilyDetailView familyData={familyData} />
    </div>
  );
}
