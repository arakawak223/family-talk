"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSpotById } from "@/lib/data/tourist-spots";
import { EmotionCategory } from "@/lib/types/world-tour";

interface SpotVisitModalProps {
  spotId: string;
  onComplete: (emotionCategory: EmotionCategory, points: number) => void;
  onClose: () => void;
}

const EMOTION_CONFIG: Record<
  EmotionCategory,
  { label: string; icon: string; bgColor: string; textColor: string }
> = {
  fun: {
    label: "たのしい感動",
    icon: "😊",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  joy: {
    label: "うれしい感動",
    icon: "😢",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
  },
  beauty: {
    label: "うつくしい感動",
    icon: "✨",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
  },
  wonder: {
    label: "おどろき感動",
    icon: "🤯",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  reflection: {
    label: "しみじみ感動",
    icon: "💭",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
};

export function SpotVisitModal({
  spotId,
  onComplete,
  onClose,
}: SpotVisitModalProps) {
  const [phase, setPhase] = useState<"intro" | "event" | "result">("intro");
  const [, setSelectedChoice] = useState<number | null>(null);
  const [resultPoints, setResultPoints] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  const spot = getSpotById(spotId);
  if (!spot) return null;

  const emotionConfig = EMOTION_CONFIG[spot.emotionCategory];

  const handleVisit = () => {
    if (spot.visitEvent?.choices) {
      setPhase("event");
    } else {
      // 選択肢がない場合は直接結果へ
      setResultPoints(spot.emotionPoints);
      setResultMessage(`${spot.name}を満喫しました！`);
      setPhase("result");
    }
  };

  const handleChoice = (choiceIndex: number) => {
    if (!spot.visitEvent?.choices) return;

    const choice = spot.visitEvent.choices[choiceIndex];
    setSelectedChoice(choiceIndex);
    setResultPoints(spot.emotionPoints + choice.result.emotionPoints);
    setResultMessage(choice.result.message);
    setPhase("result");
  };

  const handleComplete = () => {
    onComplete(spot.emotionCategory, resultPoints);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {/* イントロフェーズ */}
        {phase === "intro" && (
          <>
            <CardHeader className={`${emotionConfig.bgColor} rounded-t-lg`}>
              <CardTitle className="flex items-center gap-3">
                <span className="text-4xl">{spot.icon}</span>
                <div>
                  <p className={`text-xl ${emotionConfig.textColor}`}>
                    {spot.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`${emotionConfig.bgColor} ${emotionConfig.textColor}`}
                  >
                    {emotionConfig.icon} {emotionConfig.label}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-gray-700">{spot.description}</p>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  📍 {spot.country} | {spot.transportFromAirport.description}
                </p>
                {spot.isWorldHeritage && (
                  <p className="text-sm text-amber-600 mt-1">
                    🏆 ユネスコ世界遺産
                  </p>
                )}
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">基本獲得ポイント</p>
                <p className="text-3xl font-bold text-purple-600">
                  +{spot.emotionPoints} pt
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  後で訪れる
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={handleVisit}
                >
                  {spot.icon} 訪問する
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* イベントフェーズ */}
        {phase === "event" && spot.visitEvent && (
          <>
            <CardHeader className={`${emotionConfig.bgColor} rounded-t-lg`}>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{emotionConfig.icon}</span>
                <span className={emotionConfig.textColor}>
                  {spot.visitEvent.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-gray-700 text-center italic">
                &ldquo;{spot.visitEvent.description}&rdquo;
              </p>

              {spot.visitEvent.choices && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">
                    どうしますか？
                  </p>
                  {spot.visitEvent.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between hover:bg-purple-50"
                      onClick={() => handleChoice(index)}
                    >
                      <span>{choice.text}</span>
                      <Badge variant="secondary">
                        +{spot.emotionPoints + choice.result.emotionPoints} pt
                      </Badge>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* 結果フェーズ */}
        {phase === "result" && (
          <>
            <CardHeader
              className={`${emotionConfig.bgColor} rounded-t-lg text-center`}
            >
              <div className="text-6xl mb-2">{emotionConfig.icon}</div>
              <CardTitle className={emotionConfig.textColor}>
                {emotionConfig.label}を獲得！
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-center">
              <p className="text-gray-700">{resultMessage}</p>

              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">獲得感動ポイント</p>
                <p className="text-5xl font-bold text-purple-600 animate-pulse">
                  +{resultPoints}
                </p>
                <p className="text-sm text-purple-500 mt-2">感動ポイント</p>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleComplete}
              >
                素晴らしい！ 次へ進む
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
