"use client";

import { SugorokuSquare } from "@/lib/types/sugoroku";

interface SugorokuSquareItemProps {
  square: SugorokuSquare;
  isCurrentPosition: boolean;
  isPassed: boolean;
}

// 30の世界遺産名所（西回りルート：日本 → アジア → 中東 → ヨーロッパ → アフリカ → アメリカ → 太平洋）
const WORLD_HERITAGE_SITES = [
  { icon: "🗻", name: "富士山" },              // 0: 日本
  { icon: "⛩️", name: "厳島神社" },            // 1: 日本
  { icon: "🐼", name: "九寨溝" },              // 2: 中国
  { icon: "🏯", name: "万里の長城" },          // 3: 中国
  { icon: "🏛️", name: "紫禁城" },             // 4: 中国
  { icon: "🕌", name: "タージマハル" },         // 5: インド
  { icon: "🛕", name: "アンコールワット" },     // 6: カンボジア
  { icon: "🏔️", name: "エベレスト" },          // 7: ネパール
  { icon: "🏜️", name: "ピラミッド" },          // 8: エジプト
  { icon: "🐫", name: "サハラ砂漠" },          // 9: アフリカ
  { icon: "🦁", name: "セレンゲティ" },        // 10: タンザニア
  { icon: "💧", name: "ビクトリア滝" },        // 11: ジンバブエ
  { icon: "🏛️", name: "アテネ神殿" },         // 12: ギリシャ
  { icon: "🏟️", name: "コロッセオ" },         // 13: イタリア
  { icon: "🗼", name: "ピサの斜塔" },          // 14: イタリア
  { icon: "🕌", name: "アルハンブラ宮殿" },     // 15: スペイン
  { icon: "⛪", name: "サグラダファミリア" },   // 16: スペイン
  { icon: "🏰", name: "モンサンミッシェル" },   // 17: フランス
  { icon: "🗼", name: "エッフェル塔" },        // 18: フランス
  { icon: "🌉", name: "タワーブリッジ" },      // 19: イギリス
  { icon: "🦌", name: "バンフ国立公園" },      // 20: カナダ
  { icon: "🗽", name: "自由の女神" },          // 21: アメリカ
  { icon: "🏞️", name: "グランドキャニオン" },  // 22: アメリカ
  { icon: "🌁", name: "ゴールデンゲート" },     // 23: アメリカ
  { icon: "🌋", name: "ハワイ火山" },          // 24: アメリカ
  { icon: "⛰️", name: "マチュピチュ" },        // 25: ペルー
  { icon: "🌴", name: "イグアスの滝" },        // 26: ブラジル
  { icon: "🗿", name: "イースター島" },        // 27: チリ
  { icon: "🎭", name: "シドニーオペラハウス" }, // 28: オーストラリア
  { icon: "🌲", name: "ブルーマウンテン" },    // 29: オーストラリア
];

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
        // 通常マスは世界遺産名所アイコンを順番に表示（30個まで、それ以降は繰り返さない）
        const site = WORLD_HERITAGE_SITES[square.position % WORLD_HERITAGE_SITES.length];
        return site ? site.icon : "🌍";
    }
  };

  const getLandmarkName = () => {
    // ゴールは特別
    if (square.square_type === "goal") return "ゴール";

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
        // 通常マスは世界遺産名所の名前を表示
        const site = WORLD_HERITAGE_SITES[square.position % WORLD_HERITAGE_SITES.length];
        return site ? site.name : "世界";
    }
  };

  return (
    <div
      className={`
        relative aspect-square rounded-xl border-3 flex flex-col items-center justify-center
        ${getSquareColor()}
        ${isCurrentPosition ? 'scale-110 z-10 shadow-2xl ring-4 ring-yellow-400 ring-offset-2' : ''}
        ${!isPassed && !isCurrentPosition ? 'hover:scale-105 cursor-pointer' : ''}
        transition-all duration-300 transform
      `}
      title={`${square.position}: ${getLandmarkName()}`}
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
