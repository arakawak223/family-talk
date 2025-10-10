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

// 30の世界遺産名所（西回りルート + 地図上の位置: SVG座標系 0-1000, 0-600）
const WORLD_HERITAGE_ROUTE = [
  { position: 0, name: "富士山", region: "日本", icon: "🗻", x: 850, y: 210 },
  { position: 1, name: "厳島神社", region: "日本", icon: "⛩️", x: 830, y: 228 },
  { position: 2, name: "九寨溝", region: "中国", icon: "🐼", x: 750, y: 192 },
  { position: 3, name: "万里の長城", region: "中国", icon: "🏯", x: 770, y: 228 },
  { position: 4, name: "紫禁城", region: "中国", icon: "🏛️", x: 780, y: 240 },
  { position: 5, name: "タージマハル", region: "インド", icon: "🕌", x: 680, y: 288 },
  { position: 6, name: "アンコールワット", region: "カンボジア", icon: "🛕", x: 750, y: 330 },
  { position: 7, name: "エベレスト", region: "ネパール", icon: "🏔️", x: 700, y: 270 },
  { position: 8, name: "ピラミッド", region: "エジプト", icon: "🏜️", x: 450, y: 312 },
  { position: 9, name: "サハラ砂漠", region: "アフリカ", icon: "🐫", x: 350, y: 300 },
  { position: 10, name: "セレンゲティ", region: "タンザニア", icon: "🦁", x: 460, y: 372 },
  { position: 11, name: "ビクトリア滝", region: "ジンバブエ", icon: "💧", x: 440, y: 420 },
  { position: 12, name: "アテネ神殿", region: "ギリシャ", icon: "🏛️", x: 420, y: 252 },
  { position: 13, name: "コロッセオ", region: "イタリア", icon: "🏟️", x: 360, y: 240 },
  { position: 14, name: "ピサの斜塔", region: "イタリア", icon: "🗼", x: 350, y: 234 },
  { position: 15, name: "アルハンブラ宮殿", region: "スペイン", icon: "🕌", x: 270, y: 250 },
  { position: 16, name: "サグラダファミリア", region: "スペイン", icon: "⛪", x: 280, y: 252 },
  { position: 17, name: "モンサンミッシェル", region: "フランス", icon: "🏰", x: 300, y: 216 },
  { position: 18, name: "エッフェル塔", region: "フランス", icon: "🗼", x: 310, y: 222 },
  { position: 19, name: "タワーブリッジ", region: "イギリス", icon: "🌉", x: 300, y: 198 },
  { position: 20, name: "バンフ国立公園", region: "カナダ", icon: "🦌", x: 130, y: 190 },
  { position: 21, name: "自由の女神", region: "アメリカ", icon: "🗽", x: 150, y: 240 },
  { position: 22, name: "グランドキャニオン", region: "アメリカ", icon: "🏞️", x: 100, y: 252 },
  { position: 23, name: "ゴールデンゲート", region: "アメリカ", icon: "🌁", x: 80, y: 240 },
  { position: 24, name: "ハワイ火山", region: "アメリカ", icon: "🌋", x: 50, y: 300 },
  { position: 25, name: "マチュピチュ", region: "ペルー", icon: "⛰️", x: 180, y: 408 },
  { position: 26, name: "イグアスの滝", region: "ブラジル", icon: "🌴", x: 220, y: 432 },
  { position: 27, name: "イースター島", region: "チリ", icon: "🗿", x: 120, y: 450 },
  { position: 28, name: "シドニーオペラハウス", region: "オーストラリア", icon: "🎭", x: 850, y: 470 },
  { position: 29, name: "ブルーマウンテン", region: "オーストラリア", icon: "🌲", x: 830, y: 455 },
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
          <div className="relative w-full rounded-xl border-4 border-blue-400 overflow-hidden shadow-2xl" style={{ height: "600px" }}>
            <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full">
              {/* 海（背景） */}
              <rect x="0" y="0" width="1000" height="600" fill="#a8d5e2" />

              {/* 北アメリカ大陸 */}
              <path d="M 50,150 Q 80,120 120,140 L 180,180 Q 200,200 190,240 L 160,280 Q 140,300 120,280 L 80,250 Q 60,220 50,180 Z" fill="#90c695" stroke="#5a8a5f" strokeWidth="1.5" />
              <path d="M 100,160 Q 120,140 160,150 L 200,170 L 220,200 L 200,230 L 170,240 L 140,220 L 120,190 Z" fill="#90c695" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* 南アメリカ大陸 */}
              <path d="M 140,350 Q 160,340 180,360 L 200,400 L 220,450 L 200,480 Q 180,490 160,480 L 140,440 L 130,400 Z" fill="#8bc48a" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* ヨーロッパ大陸 */}
              <path d="M 280,180 Q 300,170 320,180 L 350,200 L 370,220 L 360,240 L 340,250 L 310,240 L 290,220 Z" fill="#9bcf9a" stroke="#5a8a5f" strokeWidth="1.5" />
              <path d="M 320,200 L 360,210 L 380,230 L 370,250 L 340,260 L 320,240 Z" fill="#9bcf9a" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* アフリカ大陸 */}
              <path d="M 340,280 Q 360,270 380,280 L 400,310 L 420,360 L 440,420 L 420,450 Q 400,460 380,450 L 360,420 L 350,380 L 340,330 Z" fill="#d4b896" stroke="#a68a5f" strokeWidth="1.5" />

              {/* アジア大陸 */}
              <path d="M 420,180 Q 450,160 490,170 L 540,190 L 600,210 L 670,230 L 720,250 L 750,270 Q 760,290 750,310 L 720,330 L 680,340 L 640,330 L 590,310 L 540,290 L 490,270 L 450,250 L 420,220 Z" fill="#88c288" stroke="#5a8a5f" strokeWidth="1.5" />
              <path d="M 680,280 Q 700,270 730,280 L 760,300 L 780,330 L 770,360 L 750,380 L 720,370 L 700,350 L 690,320 Z" fill="#88c288" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* 中東 */}
              <path d="M 440,280 Q 460,270 480,280 L 500,300 L 490,320 L 470,330 L 450,320 L 445,300 Z" fill="#d4c896" stroke="#a68a5f" strokeWidth="1.5" />

              {/* インド亜大陸 */}
              <path d="M 660,280 Q 680,270 700,280 L 720,310 L 710,340 Q 690,350 670,340 L 660,310 Z" fill="#8bc48a" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* 東南アジア */}
              <path d="M 730,320 L 750,330 L 760,350 L 750,370 L 730,360 L 725,340 Z" fill="#90c695" stroke="#5a8a5f" strokeWidth="1.5" />

              {/* オーストラリア大陸 */}
              <path d="M 780,420 Q 810,410 840,420 L 870,450 L 860,480 Q 840,490 820,480 L 790,460 L 785,440 Z" fill="#d4b896" stroke="#a68a5f" strokeWidth="1.5" />

              {/* 日本列島 */}
              <ellipse cx="850" cy="220" rx="15" ry="35" fill="#90c695" stroke="#5a8a5f" strokeWidth="1" transform="rotate(20 850 220)" />

              {/* グリーンランド */}
              <path d="M 320,50 Q 350,40 380,60 L 390,90 L 370,110 Q 350,115 330,100 L 325,75 Z" fill="#e8f0e8" stroke="#b0c0b0" strokeWidth="1" />

              {/* 島々の装飾 */}
              <circle cx="60" cy="300" r="8" fill="#8bc48a" stroke="#5a8a5f" strokeWidth="0.5" />
              <circle cx="900" cy="340" r="6" fill="#90c695" stroke="#5a8a5f" strokeWidth="0.5" />

              {/* ルート線 */}
              {WORLD_HERITAGE_ROUTE.map((site, index) => {
                if (index >= WORLD_HERITAGE_ROUTE.length - 1) return null;
                const nextSite = WORLD_HERITAGE_ROUTE[index + 1];
                const isPassed = site.position < currentPosition;
                const isCurrent = site.position === currentPosition;

                return (
                  <line
                    key={`line-${site.position}`}
                    x1={site.x}
                    y1={site.y}
                    x2={nextSite.x}
                    y2={nextSite.y}
                    stroke={isPassed ? "#9ca3af" : isCurrent ? "#fbbf24" : "#60a5fa"}
                    strokeWidth="2"
                    strokeDasharray="6,3"
                    opacity={isPassed ? "0.3" : "0.7"}
                  />
                );
              })}

              {/* 名所のマーカー */}
              {WORLD_HERITAGE_ROUTE.map((site) => {
                const isPassed = site.position < currentPosition;
                const isCurrent = site.position === currentPosition;

                return (
                  <g key={site.position} className="cursor-pointer group">
                    {/* 番号の円 */}
                    <circle
                      cx={site.x}
                      cy={site.y}
                      r="20"
                      fill={
                        isCurrent
                          ? "#fbbf24"
                          : isPassed
                          ? "#d1d5db"
                          : "#ffffff"
                      }
                      stroke={
                        isCurrent
                          ? "#d97706"
                          : isPassed
                          ? "#9ca3af"
                          : "#3b82f6"
                      }
                      strokeWidth="3"
                      className={`transition-all ${isCurrent ? "animate-pulse" : ""}`}
                    />
                    {/* 番号テキスト */}
                    <text
                      x={site.x}
                      y={site.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`font-bold text-sm ${
                        isCurrent
                          ? "fill-white"
                          : isPassed
                          ? "fill-gray-600"
                          : "fill-blue-600"
                      }`}
                      fontSize="16"
                    >
                      {site.position}
                    </text>
                    {/* ホバー時のツールチップ */}
                    <title>{`${site.icon} ${site.name}`}</title>
                  </g>
                );
              })}
            </svg>
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
