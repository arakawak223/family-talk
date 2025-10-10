"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

// 30の世界遺産名所（西回りルート）
const WORLD_HERITAGE_ROUTE = [
  { position: 0, name: "富士山", region: "日本", icon: "🗻" },
  { position: 1, name: "厳島神社", region: "日本", icon: "⛩️" },
  { position: 2, name: "姫路城", region: "日本", icon: "🏯" },
  { position: 3, name: "九寨溝", region: "中国", icon: "🐼" },
  { position: 4, name: "万里の長城", region: "中国", icon: "🏯" },
  { position: 5, name: "紫禁城", region: "中国", icon: "🏛️" },
  { position: 6, name: "タージマハル", region: "インド", icon: "🕌" },
  { position: 7, name: "アンコールワット", region: "カンボジア", icon: "🛕" },
  { position: 8, name: "エベレスト", region: "ネパール", icon: "⛰️" },
  { position: 9, name: "ペトラ遺跡", region: "ヨルダン", icon: "🕌" },
  { position: 10, name: "ピラミッド", region: "エジプト", icon: "🏜️" },
  { position: 11, name: "サハラ砂漠", region: "アフリカ", icon: "🐫" },
  { position: 12, name: "セレンゲティ", region: "タンザニア", icon: "🦁" },
  { position: 13, name: "ビクトリア滝", region: "ジンバブエ", icon: "🗿" },
  { position: 14, name: "アテネ神殿", region: "ギリシャ", icon: "🏛️" },
  { position: 15, name: "コロッセオ", region: "イタリア", icon: "🏟️" },
  { position: 16, name: "ピサの斜塔", region: "イタリア", icon: "🗼" },
  { position: 17, name: "サグラダファミリア", region: "スペイン", icon: "⛪" },
  { position: 18, name: "モンサンミッシェル", region: "フランス", icon: "🏰" },
  { position: 19, name: "エッフェル塔", region: "フランス", icon: "🗼" },
  { position: 20, name: "ノイシュバンシュタイン", region: "ドイツ", icon: "🏰" },
  { position: 21, name: "タワーブリッジ", region: "イギリス", icon: "🌉" },
  { position: 22, name: "自由の女神", region: "アメリカ", icon: "🗽" },
  { position: 23, name: "グランドキャニオン", region: "アメリカ", icon: "🏞️" },
  { position: 24, name: "ゴールデンゲート", region: "アメリカ", icon: "🌁" },
  { position: 25, name: "マチュピチュ", region: "ペルー", icon: "🗿" },
  { position: 26, name: "イグアスの滝", region: "ブラジル", icon: "🌴" },
  { position: 27, name: "イースター島", region: "チリ", icon: "🗿" },
  { position: 28, name: "グレートバリアリーフ", region: "オーストラリア", icon: "🏝️" },
  { position: 29, name: "ハワイ火山", region: "アメリカ", icon: "🌋" },
];

interface WorldMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPosition?: number;
}

export function WorldMapModal({ open, onOpenChange, currentPosition = 0 }: WorldMapModalProps) {
  // 地域ごとにグループ化
  const groupByRegion = () => {
    const groups: { [key: string]: typeof WORLD_HERITAGE_ROUTE } = {};
    WORLD_HERITAGE_ROUTE.forEach((site) => {
      if (!groups[site.region]) {
        groups[site.region] = [];
      }
      groups[site.region].push(site);
    });
    return groups;
  };

  const regionGroups = groupByRegion();
  const regions = ["日本", "中国", "インド", "カンボジア", "ネパール", "ヨルダン", "エジプト", "アフリカ", "タンザニア", "ジンバブエ", "ギリシャ", "イタリア", "スペイン", "フランス", "ドイツ", "イギリス", "アメリカ", "ペルー", "ブラジル", "チリ", "オーストラリア"];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            🗺️ 世界遺産名所を巡る旅のルート
          </AlertDialogTitle>
          <AlertDialogDescription>
            西回りで世界を一周！30の世界遺産名所を訪れます
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          {/* 現在地表示 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
            <p className="text-sm font-semibold text-gray-700 mb-2">📍 現在の位置</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{WORLD_HERITAGE_ROUTE[currentPosition]?.icon}</span>
              <div>
                <p className="text-lg font-bold">{WORLD_HERITAGE_ROUTE[currentPosition]?.name}</p>
                <p className="text-sm text-gray-600">{WORLD_HERITAGE_ROUTE[currentPosition]?.region}</p>
              </div>
            </div>
          </div>

          {/* ルート表示 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🧭</span>
              <span>旅のルート順</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WORLD_HERITAGE_ROUTE.map((site, index) => {
                const isPassed = site.position < currentPosition;
                const isCurrent = site.position === currentPosition;

                return (
                  <div
                    key={site.position}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isCurrent
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400 shadow-lg scale-105"
                        : isPassed
                        ? "bg-gray-100 border-gray-300 opacity-60"
                        : "bg-white border-blue-200 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{site.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">#{site.position}</span>
                          {isCurrent && <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full font-bold">現在地</span>}
                          {isPassed && <span className="text-green-600">✓</span>}
                        </div>
                        <p className="font-bold text-sm truncate">{site.name}</p>
                        <p className="text-xs text-gray-600">{site.region}</p>
                      </div>
                    </div>
                    {index < WORLD_HERITAGE_ROUTE.length - 1 && (
                      <div className="mt-1 text-center text-blue-400">
                        ↓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 地域別サマリー */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🌏</span>
              <span>訪れる地域</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => {
                const sitesInRegion = regionGroups[region] || [];
                if (sitesInRegion.length === 0) return null;

                const allPassed = sitesInRegion.every(s => s.position < currentPosition);
                const hasCurrent = sitesInRegion.some(s => s.position === currentPosition);

                return (
                  <span
                    key={region}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      hasCurrent
                        ? "bg-yellow-400 text-white"
                        : allPassed
                        ? "bg-gray-300 text-gray-600"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {region} ({sitesInRegion.length})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
