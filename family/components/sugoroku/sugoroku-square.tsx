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
    if (isCurrentPosition) return "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 border-yellow-600 animate-pulse shadow-xl";
    if (isPassed) return "bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400 opacity-70";

    switch (square.square_type) {
      case "gift":
        return "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 border-purple-500";
      case "bonus":
        return "bg-gradient-to-br from-yellow-300 to-amber-400 border-yellow-600";
      case "chance":
        return "bg-gradient-to-br from-purple-400 to-fuchsia-500 border-purple-600";
      case "family_event":
        return "bg-gradient-to-br from-green-300 to-emerald-400 border-green-600";
      case "mission":
        return "bg-gradient-to-br from-orange-300 to-red-400 border-orange-600";
      case "rest":
        return "bg-gradient-to-br from-cyan-300 to-blue-400 border-cyan-600";
      case "goal":
        return "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 border-red-700 shadow-2xl";
      default:
        return "bg-gradient-to-br from-blue-50 to-sky-100 border-sky-300";
    }
  };

  const getSquareIcon = () => {
    // ゴールは特別
    if (square.square_type === "goal") return "🏁";

    // 地理情報がある場合は優先的に使用
    if (square.location) {
      return square.location.icon;
    }

    // イベントタイプによるアイコン
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
      default:
        return "🌍";
    }
  };

  const getLandmarkName = () => {
    // ゴールは特別
    if (square.square_type === "goal") {
      return square.location?.landmark || "ゴール";
    }

    // 地理情報がある場合は優先的に使用
    if (square.location) {
      return square.location.landmark;
    }

    // イベントタイプによる名前
    switch (square.square_type) {
      case "gift":
        return "ギフト";
      case "bonus":
        return "ボーナス";
      case "chance":
        return "チャンス";
      case "family_event":
        return "家族";
      case "mission":
        return "ミッション";
      case "rest":
        return "休憩";
      default:
        return "世界";
    }
  };

  const getTooltipText = () => {
    if (square.location) {
      return `${square.position}: ${square.location.landmark}\n${square.location.country} - ${square.location.region}\n${square.location.description || ''}`;
    }
    return `${square.position}: ${getLandmarkName()}`;
  };

  return (
    <div
      className={`
        relative aspect-square rounded-xl border-3 flex flex-col items-center justify-center group
        ${getSquareColor()}
        ${isCurrentPosition ? 'scale-110 z-10 shadow-2xl ring-4 ring-yellow-400 ring-offset-2' : ''}
        ${!isPassed && !isCurrentPosition ? 'hover:scale-105 cursor-pointer' : ''}
        transition-all duration-300 transform
      `}
      title={getTooltipText()}
    >
      {/* 位置番号 */}
      <span className={`absolute top-0.5 left-0.5 text-xs px-1.5 py-0.5 rounded-md font-bold ${
        isCurrentPosition ? 'bg-yellow-400 text-white' : 'bg-white bg-opacity-90 text-gray-700'
      }`}>
        {square.position}
      </span>

      {/* アイコン */}
      <span className={`text-2xl sm:text-3xl mb-1 ${isCurrentPosition ? 'animate-bounce' : ''}`}>
        {getSquareIcon()}
      </span>

      {/* 名所の名前 */}
      <span className="text-[0.5rem] font-semibold text-gray-800 text-center leading-tight px-0.5 bg-white bg-opacity-70 rounded">
        {getLandmarkName()}
      </span>

      {/* 国名ラベル（地理情報がある場合のみ） */}
      {square.location && square.square_type !== 'goal' && (
        <span className="text-[0.4rem] text-gray-600 text-center leading-none mt-0.5 px-1 bg-blue-50 bg-opacity-80 rounded">
          {square.location.country}
        </span>
      )}

      {/* 通過済みの半透明オーバーレイ */}
      {isPassed && !isCurrentPosition && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-30 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      {/* 現在位置マーカー */}
      {isCurrentPosition && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-xl border-2 border-white animate-pulse">
          👤
        </div>
      )}

      {/* 特別マスのキラキラエフェクト */}
      {(square.square_type === 'gift' || square.square_type === 'goal') && !isPassed && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full animate-pulse">
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-75"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      )}
    </div>
  );
}
