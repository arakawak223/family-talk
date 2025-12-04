"use client";

import { PlayerState } from "@/lib/types/world-tour";

interface EmotionPointsDisplayProps {
  points: PlayerState["emotionPoints"];
  compact?: boolean;
}

const EMOTION_CONFIG = {
  fun: { label: "たのしい", icon: "😊", color: "bg-orange-100 text-orange-700" },
  joy: { label: "うれしい", icon: "😢", color: "bg-pink-100 text-pink-700" },
  beauty: { label: "うつくしい", icon: "✨", color: "bg-purple-100 text-purple-700" },
  wonder: { label: "おどろき", icon: "🤯", color: "bg-blue-100 text-blue-700" },
  reflection: { label: "しみじみ", icon: "💭", color: "bg-green-100 text-green-700" },
};

export function EmotionPointsDisplay({
  points,
  compact = false,
}: EmotionPointsDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xl">💖</span>
        <span className="font-bold text-lg">{points.total}</span>
        <span className="text-sm text-gray-500">感動pt</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 合計ポイント */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
        <span className="text-2xl">💖</span>
        <div className="text-center">
          <p className="text-xs text-gray-600">感動ポイント</p>
          <p className="text-3xl font-bold text-purple-700">{points.total}</p>
        </div>
      </div>

      {/* カテゴリー別 */}
      <div className="grid grid-cols-5 gap-1 text-xs">
        {(Object.keys(EMOTION_CONFIG) as Array<keyof typeof EMOTION_CONFIG>).map(
          (key) => {
            const config = EMOTION_CONFIG[key];
            const value = points[key];
            return (
              <div
                key={key}
                className={`p-2 rounded text-center ${config.color}`}
                title={config.label}
              >
                <div className="text-lg">{config.icon}</div>
                <div className="font-bold">{value}</div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
