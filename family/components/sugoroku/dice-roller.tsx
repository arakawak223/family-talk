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
  const [giftName, setGiftName] = useState<string>("");
  const [giftRarity, setGiftRarity] = useState<string>("");

  const handleRoll = async (rollType: RollType) => {
    const cost = rollType === "dice" ? 50 : 70;

    if (currentPoints < cost) {
      setMessage("ポイントが足りません");
      return;
    }

    setRolling(true);
    setResult(null);
    setSquare(null);
    setMessage("");
    setGiftName("");
    setGiftRarity("");

    // アニメーション効果
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await rollDice(userId, familyId, rollType);

      if (response.success && response.result !== undefined) {
        setResult(response.result);
        setSquare(response.square || null);

        // ギフト情報を設定
        if (response.giftName) {
          setGiftName(response.giftName);
        }
        if (response.giftRarity) {
          setGiftRarity(response.giftRarity);
        }

        // 結果メッセージ
        let resultMessage = "";
        // イベントメッセージを優先表示
        if (response.eventMessage) {
          resultMessage = response.eventMessage;
        } else if (response.square?.description) {
          resultMessage = response.square.description;
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
                <p className="text-xl font-bold text-purple-600">70pt</p>
                <Button
                  onClick={() => handleRoll("roulette")}
                  disabled={rolling || currentPoints < 70}
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

              {message && (
                <div className={`mt-6 p-6 border-4 rounded-xl shadow-lg ${
                  giftName && giftRarity === 'legendary'
                    ? 'bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-100 border-yellow-500 animate-pulse'
                    : giftName && giftRarity === 'rare'
                    ? 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 border-blue-500'
                    : giftName
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400'
                }`}>
                  <div className="text-6xl mb-3">
                    {square?.square_type === "gift" ? "🎁" :
                     square?.square_type === "bonus" ? "💰" :
                     square?.square_type === "goal" ? "🎉" :
                     square?.square_type === "family_event" ? "👨‍👩‍👧‍👦" : "✨"}
                  </div>
                  <p className={`text-2xl font-bold whitespace-pre-line ${
                    giftName && giftRarity === 'legendary'
                      ? 'text-yellow-800'
                      : giftName && giftRarity === 'rare'
                      ? 'text-purple-800'
                      : giftName
                      ? 'text-green-800'
                      : 'text-orange-700'
                  }`}>
                    {message}
                  </p>
                  {giftName && (
                    <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
                      <p className="text-lg font-semibold">
                        🎁 獲得したギフト: <span className="text-xl">{giftName}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {square && !message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold mb-2">
                    {getSquareTypeLabel(square.square_type)}
                  </p>
                  {square.description && (
                    <p className="text-gray-700 whitespace-pre-line">
                      {square.description}
                    </p>
                  )}
                </div>
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
