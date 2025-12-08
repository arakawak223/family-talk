"use client";

import { PlayerState } from "@/lib/types/world-tour";
import { Trophy } from "lucide-react";

interface EmotionPointsDisplayProps {
  points: PlayerState["emotionPoints"];
  compact?: boolean;
}

const EMOTION_CONFIG = {
  fun: { label: "たのしい", icon: "😊", className: "emotion-fun" },
  joy: { label: "うれしい", icon: "😢", className: "emotion-joy" },
  beauty: { label: "うつくしい", icon: "✨", className: "emotion-beauty" },
  wonder: { label: "おどろき", icon: "🤯", className: "emotion-wonder" },
  reflection: { label: "しみじみ", icon: "💭", className: "emotion-reflection" },
};

export function EmotionPointsDisplay({
  points,
  compact = false,
}: EmotionPointsDisplayProps) {
  if (compact) {
    return (
      <div className="glass-card-light px-4 py-2 flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <div>
          <p className="text-white/60 text-xs">感動pt</p>
          <p className="font-bold text-yellow-400 text-xl">{points.total}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-light px-4 py-3">
      {/* 合計ポイント */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white/60 text-xs">感動ポイント</p>
          <p className="text-2xl font-bold text-yellow-400 title-glow">{points.total}</p>
        </div>
      </div>

      {/* カテゴリー別 - ミニバッジ */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EMOTION_CONFIG) as Array<keyof typeof EMOTION_CONFIG>).map(
          (key) => {
            const config = EMOTION_CONFIG[key];
            const value = points[key];
            if (value === 0) return null;
            return (
              <div
                key={key}
                className={`${config.className} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                title={config.label}
              >
                <span>{config.icon}</span>
                <span>{value}</span>
              </div>
            );
          }
        )}
        {points.total === 0 && (
          <p className="text-white/40 text-xs">まだポイントがありません</p>
        )}
      </div>
    </div>
  );
}
