"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rollDice } from "@/lib/api/sugoroku";
import { RollType, SugorokuSquare } from "@/lib/types/sugoroku";

interface DiceRollerProps {
  userId: string;
  familyId: string;
  currentPoints: number;
  onComplete: () => void;
  onCancel: () => void;
}

export function DiceRoller({
  userId,
  familyId,
  currentPoints,
  onComplete,
  onCancel,
}: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [square, setSquare] = useState<SugorokuSquare | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleRoll = async (rollType: RollType) => {
    const cost = rollType === "dice" ? 50 : 100;

    if (currentPoints < cost) {
      setMessage("ポイントが足りません");
      return;
    }

    setRolling(true);
    setResult(null);
    setSquare(null);
    setMessage("");

    // アニメーション効果
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await rollDice(userId, familyId, rollType);

      if (response.success && response.result !== undefined) {
        setResult(response.result);
        setSquare(response.square || null);

        // 結果メッセージ
        let resultMessage = `${response.result}マス進みました！`;
        if (response.square) {
          resultMessage += `\n\n${response.square.description || ""}`;
        }
        setMessage(resultMessage);

        // 2秒後に完了
        setTimeout(() => {
          onComplete();
        }, 3000);
      } else {
        setMessage(response.message || "エラーが発生しました");
        setRolling(false);
      }
    } catch (error) {
      console.error("Error rolling dice:", error);
      setMessage("エラーが発生しました");
      setRolling(false);
    }
  };

  return (
    <Card className="border-4 border-blue-300">
      <CardHeader>
        <CardTitle className="text-center">
          {result === null ? "サイコロ・ルーレットを選択" : "結果"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result === null ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* サイコロ */}
              <div className="p-6 border-2 border-gray-300 rounded-lg text-center space-y-3">
                <div className="text-6xl">🎲</div>
                <h3 className="font-bold text-lg">サイコロ</h3>
                <p className="text-sm text-gray-600">1〜6マス進む</p>
                <p className="text-xl font-bold text-blue-600">50pt</p>
                <Button
                  onClick={() => handleRoll("dice")}
                  disabled={rolling || currentPoints < 50}
                  className="w-full"
                >
                  {rolling ? "振っています..." : "振る"}
                </Button>
              </div>

              {/* ルーレット */}
              <div className="p-6 border-2 border-gray-300 rounded-lg text-center space-y-3">
                <div className="text-6xl">🎰</div>
                <h3 className="font-bold text-lg">ルーレット</h3>
                <p className="text-sm text-gray-600">1〜10マス進む</p>
                <p className="text-xl font-bold text-purple-600">100pt</p>
                <Button
                  onClick={() => handleRoll("roulette")}
                  disabled={rolling || currentPoints < 100}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {rolling ? "回しています..." : "回す"}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                現在のポイント: {currentPoints} pt
              </p>
              <Button variant="outline" onClick={onCancel} disabled={rolling}>
                キャンセル
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* 結果表示 */}
            <div className="text-center space-y-4">
              <div className="text-8xl animate-bounce">{result}</div>
              <h3 className="text-2xl font-bold">
                {result}マス進みました！
              </h3>

              {square && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold mb-2">
                    {getSquareTypeLabel(square.square_type)}
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {square.description}
                  </p>
                  {square.square_type === "gift" && (
                    <div className="mt-4 text-4xl">🎁</div>
                  )}
                  {square.square_type === "bonus" && (
                    <div className="mt-4 text-4xl">💰</div>
                  )}
                  {square.square_type === "goal" && (
                    <div className="mt-4 text-4xl">🎉</div>
                  )}
                </div>
              )}

              {message && (
                <p className="text-gray-600 whitespace-pre-line">{message}</p>
              )}

              <div className="mt-6">
                <Button onClick={onComplete} className="w-full">
                  閉じる
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function getSquareTypeLabel(squareType: string): string {
  const labels: Record<string, string> = {
    normal: "通常マス",
    gift: "🎁 ギフトマス",
    bonus: "💰 ボーナスマス",
    chance: "🎰 チャンスマス",
    family_event: "👨‍👩‍👧‍👦 家族イベントマス",
    mission: "📝 ミッションマス",
    rest: "☕ 休憩マス",
    goal: "🏁 ゴール！",
  };
  return labels[squareType] || squareType;
}
