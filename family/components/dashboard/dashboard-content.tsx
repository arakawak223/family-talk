"use client";

import { useState } from "react";
import { UserWithProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { QuestionSelector } from "@/components/questions/question-selector";
import { FamilyInfo } from "@/components/dashboard/family-info";
import { VoiceMessagesList } from "@/components/voice/voice-messages-list";

interface DashboardContentProps {
  user: UserWithProfile;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedFamily, setSelectedFamily] = useState(user.families[0]);
  const [refreshMessages, setRefreshMessages] = useState(0);

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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            おかえりなさい、{user.profile?.display_name}さん！
          </h1>
          <p className="text-gray-600">
            今日も家族とのひと言を交換しましょう
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          ログアウト
        </Button>
      </div>

      {/* 家族情報 */}
      <div className="mb-8">
        <FamilyInfo
          families={user.families}
          selectedFamily={selectedFamily}
          onFamilyChange={setSelectedFamily}
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

              {/* 録音開始ボタン */}
              <Button
                onClick={() => setShowRecorder(true)}
                className="w-full"
                size="lg"
              >
                🎤 録音を開始
              </Button>
            </div>
          ) : (
            <VoiceRecorder
              familyId={selectedFamily.id}
              question={selectedQuestion}
              onComplete={() => {
                setShowRecorder(false);
                setSelectedQuestion("");
                setRefreshMessages(prev => prev + 1); // メッセージ一覧を更新
              }}
              onCancel={() => setShowRecorder(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* 最近のメッセージ */}
      <VoiceMessagesList
        familyId={selectedFamily.id}
        currentUserId={user.profile?.id || ""}
        key={`${selectedFamily.id}-${refreshMessages}`}
      />
    </div>
  );
}