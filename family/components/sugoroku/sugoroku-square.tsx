"use client";

import { SugorokuSquare } from "@/lib/types/sugoroku";

interface SugorokuSquareItemProps {
  square: SugorokuSquare;
  isCurrentPosition: boolean;
  isPassed: boolean;
}

export function SugorokuSquareItem({
  square,
  isCurrentPosition,
  isPassed,
}: SugorokuSquareItemProps) {
  const getSquareColor = () => {
    if (isCurrentPosition) return "bg-blue-500 border-blue-700 animate-pulse";
    if (isPassed) return "bg-gray-300 border-gray-400";

    switch (square.square_type) {
      case "gift":
        return "bg-pink-400 border-pink-600";
      case "bonus":
        return "bg-yellow-400 border-yellow-600";
      case "chance":
        return "bg-purple-400 border-purple-600";
      case "family_event":
        return "bg-green-400 border-green-600";
      case "mission":
        return "bg-orange-400 border-orange-600";
      case "rest":
        return "bg-cyan-400 border-cyan-600";
      case "goal":
        return "bg-red-500 border-red-700";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getSquareIcon = () => {
    switch (square.square_type) {
      case "gift":
        return "🎁";
      case "bonus":
        return "💰";
      case "chance":
        return "🎰";
      case "family_event":
        return "👨‍👩‍👧‍👦";
      case "mission":
        return "📝";
      case "rest":
        return "☕";
      case "goal":
        return "🏁";
      default:
        return "";
    }
  };

  return (
    <div
      className={`
        relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center
        ${getSquareColor()}
        ${isCurrentPosition ? 'scale-110 z-10 shadow-lg' : ''}
        transition-all duration-200 hover:scale-105
      `}
      title={square.description || undefined}
    >
      {/* 位置番号 */}
      <span className="absolute top-0 left-0 text-xs px-1 bg-white bg-opacity-75 rounded-br">
        {square.position}
      </span>

      {/* アイコン */}
      <span className="text-xl sm:text-2xl">{getSquareIcon()}</span>

      {/* 現在位置マーカー */}
      {isCurrentPosition && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
          👤
        </div>
      )}
    </div>
  );
}
