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
              {/* 海（背景）- よりリアルな青 */}
              <rect x="0" y="0" width="1000" height="600" fill="#2196f3" opacity="0.3" />
              <rect x="0" y="0" width="1000" height="600" fill="url(#ocean-gradient)" />

              {/* 海のグラデーション定義 */}
              <defs>
                <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4fc3f7', stopOpacity: 0.6 }} />
                  <stop offset="50%" style={{ stopColor: '#29b6f6', stopOpacity: 0.7 }} />
                  <stop offset="100%" style={{ stopColor: '#039be5', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>

              {/* グリーンランド - より詳細 */}
              <path d="M 310,40 Q 320,30 340,35 L 365,45 Q 380,55 385,75 L 390,95 L 385,115 Q 375,125 360,125 L 340,120 Q 325,110 320,95 L 315,70 Q 310,55 310,40 Z"
                fill="#e8f5e9" stroke="#81c784" strokeWidth="1.5" opacity="0.9" />

              {/* 北アメリカ大陸 - より詳細な形状 */}
              {/* カナダ北部 */}
              <path d="M 50,120 Q 60,100 80,110 L 110,120 Q 130,125 145,135 L 160,145 Q 175,150 185,160 L 195,175 Q 200,185 198,200 L 190,220 Q 185,230 175,235 L 160,240 Q 150,240 140,235 L 125,225 Q 110,215 100,200 L 85,180 Q 70,160 60,140 L 50,120 Z"
                fill="#8bc34a" stroke="#689f38" strokeWidth="1.5" />
              {/* アメリカ中部 */}
              <path d="M 80,240 L 95,250 Q 110,260 125,265 L 145,270 Q 160,272 175,270 L 190,265 Q 200,258 205,245 L 210,225 Q 208,210 200,200 L 185,200 Q 175,205 165,210 L 150,220 Q 135,230 120,235 L 100,238 Q 85,240 80,240 Z"
                fill="#9ccc65" stroke="#7cb342" strokeWidth="1.5" />
              {/* メキシコ */}
              <path d="M 130,270 L 145,280 Q 155,288 160,295 L 165,305 Q 165,315 160,320 L 150,325 Q 140,325 132,320 L 125,310 Q 122,300 122,290 L 125,280 Q 128,275 130,270 Z"
                fill="#aed581" stroke="#9ccc65" strokeWidth="1.5" />

              {/* 南アメリカ大陸 - より細長く正確に */}
              <path d="M 155,340 Q 165,335 175,340 L 185,350 Q 192,360 195,375 L 200,400 Q 203,420 205,440 L 208,460 Q 208,475 205,485 L 198,495 Q 188,500 178,498 L 168,490 Q 160,480 156,465 L 150,445 Q 145,425 143,405 L 140,380 Q 140,360 145,348 Q 150,342 155,340 Z"
                fill="#8bc34a" stroke="#689f38" strokeWidth="1.5" />

              {/* ヨーロッパ大陸 - スカンジナビア含む */}
              {/* スカンジナビア半島 */}
              <path d="M 330,130 Q 338,120 348,125 L 358,135 Q 365,145 368,158 L 370,175 Q 368,188 362,195 L 355,200 Q 348,200 342,195 L 335,185 Q 330,175 328,162 L 328,145 Q 328,135 330,130 Z"
                fill="#c5e1a5" stroke="#9ccc65" strokeWidth="1.5" />
              {/* 西ヨーロッパ */}
              <path d="M 280,190 L 295,185 Q 310,183 322,188 L 340,198 Q 355,208 365,220 L 372,235 Q 375,245 373,255 L 365,265 Q 355,270 343,268 L 325,260 Q 310,250 298,238 L 285,225 Q 278,215 275,205 L 275,195 Q 277,190 280,190 Z"
                fill="#c5e1a5" stroke="#9ccc65" strokeWidth="1.5" />

              {/* アフリカ大陸 - より正確な形状 */}
              <path d="M 340,265 Q 350,260 362,265 L 378,275 Q 390,285 398,300 L 408,320 Q 418,345 425,370 L 432,395 Q 437,418 438,440 L 435,460 Q 428,475 418,483 L 405,488 Q 390,488 378,482 L 365,472 Q 355,460 348,445 L 342,425 Q 338,405 336,385 L 335,360 Q 335,335 338,312 L 340,290 Q 340,275 340,265 Z"
                fill="#e0c99a" stroke="#c4a574" strokeWidth="1.5" />

              {/* アジア大陸 - より詳細 */}
              {/* シベリア・中央アジア */}
              <path d="M 380,140 Q 400,130 425,135 L 455,145 Q 485,155 515,165 L 550,175 Q 585,185 620,195 L 655,205 Q 690,215 720,228 L 750,243 Q 775,258 792,275 L 805,295 Q 812,310 812,328 L 808,350 Q 800,365 785,372 L 765,378 Q 740,380 715,375 L 685,365 Q 655,353 625,340 L 595,325 Q 565,310 540,295 L 510,278 Q 485,262 462,248 L 438,232 Q 418,218 402,205 L 388,188 Q 380,172 378,155 L 380,140 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1.5" />
              {/* 中国・東アジア */}
              <path d="M 720,230 L 745,245 Q 765,258 780,275 L 795,295 Q 805,312 808,330 L 808,350 Q 805,365 795,375 L 780,382 Q 760,385 742,380 L 720,370 Q 705,358 695,342 L 688,320 Q 685,300 688,282 L 695,265 Q 705,250 715,240 L 720,230 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1.5" />

              {/* 中東 */}
              <path d="M 440,275 Q 455,268 470,272 L 485,282 Q 495,292 500,305 L 502,320 Q 500,332 492,340 L 480,345 Q 468,346 458,342 L 448,333 Q 443,322 442,310 L 442,295 Q 442,283 440,275 Z"
                fill="#e0c99a" stroke="#c4a574" strokeWidth="1.5" />

              {/* インド亜大陸 - 三角形に近い形 */}
              <path d="M 660,280 Q 672,273 685,278 L 700,288 Q 710,300 715,315 L 718,332 Q 717,348 710,360 L 698,370 Q 685,375 672,372 L 660,365 Q 652,355 648,342 L 645,325 Q 645,308 650,295 L 655,285 Q 658,280 660,280 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1.5" />

              {/* 東南アジア - より詳細 */}
              <path d="M 730,315 L 745,322 Q 758,330 768,342 L 775,358 Q 778,372 775,385 L 768,395 Q 758,400 746,398 L 735,390 Q 727,380 722,368 L 718,352 Q 717,338 720,327 L 725,318 Q 728,315 730,315 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1.5" />

              {/* オーストラリア大陸 - より正確な形 */}
              <path d="M 785,425 Q 800,418 818,420 L 838,428 Q 855,438 868,452 L 878,470 Q 882,485 880,498 L 872,510 Q 858,518 842,518 L 822,512 Q 805,502 792,488 L 782,470 Q 778,455 778,440 L 780,430 Q 783,425 785,425 Z"
                fill="#e0c99a" stroke="#c4a574" strokeWidth="1.5" />

              {/* 日本列島 - より細かく */}
              <path d="M 845,200 Q 850,195 855,200 L 860,210 Q 862,220 860,230 L 855,245 Q 850,255 845,260 L 840,250 Q 838,240 838,228 L 840,215 Q 842,205 845,200 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1.5" />

              {/* ニュージーランド */}
              <path d="M 910,510 Q 915,505 920,508 L 923,518 Q 922,528 918,535 L 912,540 Q 907,540 904,535 L 903,525 Q 905,515 910,510 Z"
                fill="#a5d6a7" stroke="#81c784" strokeWidth="1" />

              {/* イギリス諸島 */}
              <path d="M 295,175 Q 300,170 305,173 L 308,180 Q 308,188 305,193 L 300,196 Q 295,195 292,190 L 291,182 Q 293,177 295,175 Z"
                fill="#c5e1a5" stroke="#9ccc65" strokeWidth="1" />

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
