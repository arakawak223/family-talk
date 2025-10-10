"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { QuestionSelector } from "@/components/questions/question-selector";
import { FamilyInfo } from "@/components/dashboard/family-info";
import { VoiceMessagesList } from "@/components/voice/voice-messages-list";
import { MessageCalendar } from "@/components/dashboard/message-calendar";
import { RecipientSelector } from "@/components/voice/recipient-selector";
import { SugorokuBoard } from "@/components/sugoroku/sugoroku-board";

interface DashboardContentProps {
  user: UserWithProfile;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedFamily, setSelectedFamily] = useState(user.families[0]);
  const [refreshMessages, setRefreshMessages] = useState(0);
  const [refreshSugoroku, setRefreshSugoroku] = useState(0);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [initLoading, setInitLoading] = useState(false);
  const router = useRouter();

  // 家族グループが変更されたら受信者リストをリセット
  const handleFamilyChange = (family: typeof selectedFamily) => {
    setSelectedFamily(family);
    setSelectedRecipients([]); // 受信者リストをクリア
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

  const handleInitSugoroku = async () => {
    if (!confirm('双六ゲームのギフトとマスデータを初期化しますか？')) return;

    setInitLoading(true);
    try {
      const response = await fetch('/api/admin/init-sugoroku', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        alert(`初期化成功！\nギフト: ${data.giftsCount}個\nマス: ${data.squaresCount}個`);
        setRefreshSugoroku(prev => prev + 1);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error('Init error:', error);
      alert('初期化に失敗しました');
    } finally {
      setInitLoading(false);
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

      {/* ボイスメッセージ作成 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎤 ボイスメッセージを送る
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showRecorder ? (
            <div className="space-y-4">
              {/* 質問選択 */}
              <QuestionSelector
                onQuestionSelect={setSelectedQuestion}
                selectedQuestion={selectedQuestion}
              />

              {/* 宛先選択 */}
              <RecipientSelector
                familyId={selectedFamily.id}
                currentUserId={user.profile?.id || ""}
                selectedRecipients={selectedRecipients}
                onRecipientsChange={setSelectedRecipients}
              />

              {/* 録音開始ボタン - 中央配置で統一 */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowRecorder(true)}
                  className="w-full max-w-sm"
                  size="lg"
                  disabled={selectedRecipients.length === 0}
                >
                  🎤 録音を開始
                </Button>
              </div>
            </div>
          ) : (
            <VoiceRecorder
              familyId={selectedFamily.id}
              question={selectedQuestion}
              recipientIds={selectedRecipients}
              onComplete={() => {
                setShowRecorder(false);
                setSelectedQuestion("");
                setSelectedRecipients([]);
                setRefreshMessages(prev => prev + 1); // メッセージ一覧を更新
                setRefreshSugoroku(prev => prev + 1); // 双六ボードを更新
              }}
              onCancel={() => setShowRecorder(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* 双六ボード */}
      <div className="mb-8">
        {/* 開発用: 初期化ボタン */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            開発用: 双六データ初期化ボタン
          </p>
          <Button
            onClick={handleInitSugoroku}
            disabled={initLoading}
            variant="outline"
            size="sm"
          >
            {initLoading ? '初期化中...' : 'ギフト＆マスデータを初期化'}
          </Button>
        </div>
        <SugorokuBoard
          userId={user.profile?.id || ""}
          familyId={selectedFamily.id}
          key={`${selectedFamily.id}-${refreshSugoroku}`}
        />
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