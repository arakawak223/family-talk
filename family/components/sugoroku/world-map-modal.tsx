"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// 30の世界遺産名所（西回りルート + 地図上の位置）
const WORLD_HERITAGE_ROUTE = [
  { position: 0, name: "富士山", region: "日本", icon: "🗻", x: 85, y: 35 },
  { position: 1, name: "厳島神社", region: "日本", icon: "⛩️", x: 83, y: 38 },
  { position: 2, name: "姫路城", region: "日本", icon: "🏯", x: 84, y: 37 },
  { position: 3, name: "九寨溝", region: "中国", icon: "🐼", x: 75, y: 32 },
  { position: 4, name: "万里の長城", region: "中国", icon: "🏯", x: 77, y: 38 },
  { position: 5, name: "紫禁城", region: "中国", icon: "🏛️", x: 78, y: 40 },
  { position: 6, name: "タージマハル", region: "インド", icon: "🕌", x: 68, y: 48 },
  { position: 7, name: "アンコールワット", region: "カンボジア", icon: "🛕", x: 75, y: 55 },
  { position: 8, name: "エベレスト", region: "ネパール", icon: "⛰️", x: 70, y: 45 },
  { position: 9, name: "ペトラ遺跡", region: "ヨルダン", icon: "🕌", x: 48, y: 52 },
  { position: 10, name: "ピラミッド", region: "エジプト", icon: "🏜️", x: 45, y: 52 },
  { position: 11, name: "サハラ砂漠", region: "アフリカ", icon: "🐫", x: 35, y: 50 },
  { position: 12, name: "セレンゲティ", region: "タンザニア", icon: "🦁", x: 46, y: 62 },
  { position: 13, name: "ビクトリア滝", region: "ジンバブエ", icon: "🗿", x: 44, y: 70 },
  { position: 14, name: "アテネ神殿", region: "ギリシャ", icon: "🏛️", x: 42, y: 42 },
  { position: 15, name: "コロッセオ", region: "イタリア", icon: "🏟️", x: 36, y: 40 },
  { position: 16, name: "ピサの斜塔", region: "イタリア", icon: "🗼", x: 35, y: 39 },
  { position: 17, name: "サグラダファミリア", region: "スペイン", icon: "⛪", x: 28, y: 42 },
  { position: 18, name: "モンサンミッシェル", region: "フランス", icon: "🏰", x: 30, y: 36 },
  { position: 19, name: "エッフェル塔", region: "フランス", icon: "🗼", x: 31, y: 37 },
  { position: 20, name: "ノイシュバンシュタイン", region: "ドイツ", icon: "🏰", x: 35, y: 36 },
  { position: 21, name: "タワーブリッジ", region: "イギリス", icon: "🌉", x: 30, y: 33 },
  { position: 22, name: "自由の女神", region: "アメリカ", icon: "🗽", x: 15, y: 40 },
  { position: 23, name: "グランドキャニオン", region: "アメリカ", icon: "🏞️", x: 10, y: 42 },
  { position: 24, name: "ゴールデンゲート", region: "アメリカ", icon: "🌁", x: 8, y: 40 },
  { position: 25, name: "マチュピチュ", region: "ペルー", icon: "🗿", x: 18, y: 68 },
  { position: 26, name: "イグアスの滝", region: "ブラジル", icon: "🌴", x: 22, y: 72 },
  { position: 27, name: "イースター島", region: "チリ", icon: "🗿", x: 12, y: 75 },
  { position: 28, name: "グレートバリアリーフ", region: "オーストラリア", icon: "🏝️", x: 82, y: 75 },
  { position: 29, name: "ハワイ火山", region: "アメリカ", icon: "🌋", x: 5, y: 50 },
];

interface WorldMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPosition?: number;
}

export function WorldMapModal({ open, onOpenChange, currentPosition = 0 }: WorldMapModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                🗺️ 世界遺産名所を巡る旅のルート
              </AlertDialogTitle>
              <AlertDialogDescription>
                西回りで世界を一周！30の世界遺産名所を訪れます
              </AlertDialogDescription>
            </div>
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm">
                ✕ 閉じる
              </Button>
            </AlertDialogCancel>
          </div>
        </AlertDialogHeader>

        <div className="mt-4 space-y-6">
          {/* 現在地表示 */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
            <p className="text-sm font-semibold text-gray-700 mb-2">📍 現在の位置</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{WORLD_HERITAGE_ROUTE[currentPosition]?.icon}</span>
              <div>
                <p className="text-lg font-bold">{WORLD_HERITAGE_ROUTE[currentPosition]?.name}</p>
                <p className="text-sm text-gray-600">{WORLD_HERITAGE_ROUTE[currentPosition]?.region}</p>
              </div>
            </div>
          </div>

          {/* 世界地図 */}
          <div className="relative w-full bg-gradient-to-b from-sky-200 via-blue-100 to-green-100 rounded-xl border-4 border-blue-400 overflow-hidden" style={{ height: "500px" }}>
            {/* 地図の背景（大陸風） */}
            <div className="absolute inset-0">
              {/* アジア */}
              <div className="absolute bg-green-200 rounded-full opacity-60" style={{ top: "25%", left: "65%", width: "25%", height: "40%" }}></div>
              {/* ヨーロッパ */}
              <div className="absolute bg-green-200 rounded-full opacity-60" style={{ top: "20%", left: "28%", width: "18%", height: "35%" }}></div>
              {/* アフリカ */}
              <div className="absolute bg-yellow-200 rounded-full opacity-60" style={{ top: "40%", left: "32%", width: "16%", height: "40%" }}></div>
              {/* 北アメリカ */}
              <div className="absolute bg-green-200 rounded-full opacity-60" style={{ top: "20%", left: "5%", width: "18%", height: "40%" }}></div>
              {/* 南アメリカ */}
              <div className="absolute bg-green-200 rounded-full opacity-60" style={{ top: "55%", left: "12%", width: "14%", height: "35%" }}></div>
              {/* オーストラリア */}
              <div className="absolute bg-yellow-100 rounded-full opacity-60" style={{ top: "65%", left: "75%", width: "12%", height: "20%" }}></div>
            </div>

            {/* 名所のマーカー（番号のみ） */}
            {WORLD_HERITAGE_ROUTE.map((site, index) => {
              const isPassed = site.position < currentPosition;
              const isCurrent = site.position === currentPosition;

              return (
                <div
                  key={site.position}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 z-10 cursor-pointer group"
                  style={{ left: `${site.x}%`, top: `${site.y}%` }}
                >
                  {/* 番号表示 */}
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-3 font-bold text-sm shadow-lg transition-all ${
                      isCurrent
                        ? "bg-yellow-400 border-yellow-600 text-white animate-pulse scale-125"
                        : isPassed
                        ? "bg-gray-300 border-gray-400 text-gray-600 opacity-70"
                        : "bg-white border-blue-400 text-blue-600"
                    }`}
                  >
                    {site.position}

                    {/* ホバー時のツールチップ */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {site.icon} {site.name}
                    </div>
                  </div>

                  {/* ルート線 */}
                  {index < WORLD_HERITAGE_ROUTE.length - 1 && (
                    <svg
                      className="absolute top-0 left-0 pointer-events-none"
                      style={{
                        width: `${Math.abs(WORLD_HERITAGE_ROUTE[index + 1].x - site.x) * 10}px`,
                        height: `${Math.abs(WORLD_HERITAGE_ROUTE[index + 1].y - site.y) * 10}px`,
                      }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2={`${(WORLD_HERITAGE_ROUTE[index + 1].x - site.x) * 10}px`}
                        y2={`${(WORLD_HERITAGE_ROUTE[index + 1].y - site.y) * 10}px`}
                        stroke={isPassed ? "#9ca3af" : isCurrent ? "#fbbf24" : "#60a5fa"}
                        strokeWidth="3"
                        strokeDasharray="8,4"
                        opacity={isPassed ? "0.3" : "0.7"}
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {/* 名所一覧（地図の下） */}
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>📋</span>
              <span>名所一覧</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {WORLD_HERITAGE_ROUTE.map((site) => {
                const isPassed = site.position < currentPosition;
                const isCurrent = site.position === currentPosition;

                return (
                  <div
                    key={site.position}
                    className={`text-xs p-2 rounded border ${
                      isCurrent
                        ? "bg-yellow-100 border-yellow-400 font-bold"
                        : isPassed
                        ? "bg-gray-100 border-gray-300 text-gray-600"
                        : "bg-white border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-mono font-bold">{site.position}</span>
                      {isCurrent && <span>📍</span>}
                      {isPassed && <span className="text-green-600">✓</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-base">{site.icon}</span>
                      <span className="font-semibold truncate">{site.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
