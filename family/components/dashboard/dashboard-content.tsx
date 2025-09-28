"use client";

import { useState } from "react";
import { UserWithProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { QuestionSelector } from "@/components/questions/question-selector";
import { FamilyInfo } from "@/components/dashboard/family-info";

interface DashboardContentProps {
  user: UserWithProfile;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedFamily, setSelectedFamily] = useState(user.families[0]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          おかえりなさい、{user.profile?.display_name}さん！
        </h1>
        <p className="text-gray-600">
          今日も家族とのひと言を交換しましょう
        </p>
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
              }}
              onCancel={() => setShowRecorder(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* 最近のメッセージ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 最近の家族のひと言
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            ボイスメッセージ機能は開発中です
          </div>
        </CardContent>
      </Card>
    </div>
  );
}