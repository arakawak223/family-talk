"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithProfile } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FamilyInfo } from "@/components/dashboard/family-info";
import { VoiceMessagesList } from "@/components/voice/voice-messages-list";
import { MessageCalendar } from "@/components/dashboard/message-calendar";

interface DashboardContentProps {
  user: UserWithProfile;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [selectedFamily, setSelectedFamily] = useState(user.families[0]);
  const [refreshMessages] = useState(0);
  const router = useRouter();

  // 家族グループが変更された時のハンドラー
  const handleFamilyChange = (family: typeof selectedFamily) => {
    setSelectedFamily(family);
  };

  const handleManageFamily = () => {
    console.log("家族グループを管理ボタンがクリックされました");
    console.log("Navigating to /onboarding");
    router.push("/onboarding");
  };

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      // セッションをクリア
      localStorage.clear();
      sessionStorage.clear();
      // トップページにリダイレクト
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      // エラーがあってもログインページにリダイレクト
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">
            おかえりなさい、{user.profile?.display_name}さん！
          </h1>
          <p className="text-gray-600">
            今日も家族とのひと言を交換しましょう
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto"
          >
            トップページ
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/settings")}
            className="w-full sm:w-auto"
          >
            プロフィール設定
          </Button>
          <Button
            variant="outline"
            onClick={handleManageFamily}
            className="w-full sm:w-auto"
          >
            家族グループを管理
          </Button>
          <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            ログアウト
          </Button>
        </div>
      </div>

      {/* 家族情報 */}
      <div className="mb-8">
        <FamilyInfo
          families={user.families}
          selectedFamily={selectedFamily}
          onFamilyChange={handleFamilyChange}
        />
      </div>

      {/* ゲームセクション */}
      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🎮 ゲーム
        </h2>

        {/* 感動・世界旅ゲーム */}
        <Card className="border-2 border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">✈️</div>
                <div>
                  <h3 className="text-lg font-bold text-sky-800">感動・世界旅ゲーム</h3>
                  <p className="text-sm text-gray-600">
                    世界中の空港を巡り、クイズに答え、家族とメッセージを交換しよう！
                  </p>
                  <p className="text-xs text-sky-600 mt-1">
                    🌍 50空港 • 🏛️ 観光名所＆グルメ • ❓ クイズマス • ✉️ メッセージマス
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/world-tour")}
                className="bg-sky-600 hover:bg-sky-700"
                size="lg"
              >
                プレイする →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メッセージカレンダー */}
      <div className="mb-8">
        <MessageCalendar
          familyId={selectedFamily.id}
          userId={user.profile?.id || ""}
        />
      </div>

      {/* 最近のメッセージ */}
      <VoiceMessagesList
        familyId={selectedFamily.id}
        currentUserId={user.profile?.id || ""}
        key={`${selectedFamily.id}-${refreshMessages}`}
      />
    </div>
  );
}