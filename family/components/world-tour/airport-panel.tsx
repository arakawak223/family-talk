"use client";

import { getAirportByCode } from "@/lib/data/airports";
import { TouristSpot, EmotionCategory } from "@/lib/types/world-tour";
import { MapPin, Globe, Building2, UtensilsCrossed, Landmark, Sparkles } from "lucide-react";

interface AirportPanelProps {
  airport: string;
  isCurrentLocation?: boolean;
  nearbySpots?: TouristSpot[];
  visitedAttractions?: string[];  // 訪問済み観光名所のID (airportCode-index形式)
  visitedFoods?: string[];        // 訪問済みグルメのID (airportCode-index形式)
  onVisitAttraction?: (airportCode: string, index: number, name: string, points: number, category: EmotionCategory, isPowerSpot?: boolean) => void;
  onVisitFood?: (airportCode: string, index: number, name: string, points: number) => void;
  canInteract?: boolean;          // 現在地の場合のみインタラクション可能
  isStartAirport?: boolean;       // スタート地点かどうか（ポイント獲得不可）
  hasPlayerSelectedHere?: boolean; // 現在のプレイヤーがこの空港で既に選択済みか
}

const REGION_NAMES: Record<string, string> = {
  asia: "アジア",
  europe: "ヨーロッパ",
  north_america: "北米",
  south_america: "南米",
  africa: "アフリカ",
  oceania: "オセアニア",
  middle_east: "中東",
};

const EMOTION_LABELS: Record<string, { label: string; icon: string; className: string }> = {
  fun: { label: "たのしい", icon: "😊", className: "emotion-fun" },
  joy: { label: "うれしい", icon: "😢", className: "emotion-joy" },
  beauty: { label: "うつくしい", icon: "✨", className: "emotion-beauty" },
  wonder: { label: "おどろき", icon: "🤯", className: "emotion-wonder" },
  reflection: { label: "しみじみ", icon: "💭", className: "emotion-reflection" },
};

export function AirportPanel({
  airport,
  isCurrentLocation = false,
  nearbySpots = [],
  visitedAttractions = [],
  visitedFoods = [],
  onVisitAttraction,
  onVisitFood,
  canInteract = false,
  isStartAirport = false,
  hasPlayerSelectedHere = false,
}: AirportPanelProps) {
  const airportData = getAirportByCode(airport);

  if (!airportData) {
    return (
      <div className="glass-card p-8 text-center">
        <Globe className="h-12 w-12 text-white/30 mx-auto mb-3" />
        <p className="text-white/60">空港を選択してください</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 md:p-6 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-start gap-4">
        <div className="text-5xl">{airportData.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">{airportData.city}</h2>
            {isCurrentLocation && (
              <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                📍 現在地
              </span>
            )}
          </div>
          <p className="text-white/60 text-sm">{airportData.name}</p>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass-card-light p-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-white/50 text-xs">国</p>
            <p className="text-white font-medium text-sm">{airportData.country}</p>
          </div>
        </div>
        <div className="glass-card-light p-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-purple-400" />
          <div>
            <p className="text-white/50 text-xs">地域</p>
            <p className="text-white font-medium text-sm">
              {REGION_NAMES[airportData.region] || airportData.region}
            </p>
          </div>
        </div>
        <div className="glass-card-light p-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-400" />
          <div>
            <p className="text-white/50 text-xs">空港コード</p>
            <p className="text-white font-mono font-bold text-sm">{airportData.code}</p>
          </div>
        </div>
        <div className="glass-card-light p-3 flex items-center gap-2">
          {airportData.hub ? (
            <Sparkles className="h-4 w-4 text-yellow-400" />
          ) : (
            <Building2 className="h-4 w-4 text-gray-400" />
          )}
          <div>
            <p className="text-white/50 text-xs">タイプ</p>
            <p className={`font-medium text-sm ${airportData.hub ? 'text-yellow-400' : 'text-white/70'}`}>
              {airportData.hub ? "⭐ ハブ空港" : "地方空港"}
            </p>
          </div>
        </div>
      </div>

      {/* スタート地点の注意表示 */}
      {isStartAirport && (
        <div className="p-4 rounded-xl bg-gray-500/20 border border-gray-400/30">
          <p className="text-gray-400 text-center text-sm">
            🏠 ここはスタート地点です。観光スポットでのポイント獲得はできません。
          </p>
        </div>
      )}

      {/* 観光名所・グルメ選択（4つから1つだけ選択可能） */}
      {!isStartAirport && ((airportData.attractions?.length ?? 0) > 0 || (airportData.localFood?.length ?? 0) > 0) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-cyan-400" />
              <h3 className="text-white font-bold">観光スポット</h3>
            </div>
            {canInteract && !hasPlayerSelectedHere && (
              <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">
                ★ 1つだけ選べます
              </span>
            )}
          </div>

          {/* スポット表示 */}
          {(() => {

            return (
              <div className="space-y-2">
                {/* 観光名所 */}
                {airportData.attractions?.map((attraction, index) => {
                  const attractionId = `${airportData.code}-attraction-${index}`;
                  const isVisited = visitedAttractions.includes(attractionId);
                  // 現在のプレイヤーが選択済み、または既に他プレイヤーが選んだスポットはクリック不可
                  const canClick = canInteract && !hasPlayerSelectedHere && !isVisited && onVisitAttraction;

                  return (
                    <div
                      key={`attraction-${index}`}
                      className={`p-4 rounded-xl transition-all ${
                        isVisited
                          ? "bg-green-500/20 border border-green-400/50"
                          : hasPlayerSelectedHere
                          ? "bg-white/5 opacity-40 grayscale"
                          : canClick
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400 cursor-pointer hover:scale-[1.02]"
                          : "bg-white/5 border border-white/10"
                      }`}
                      onClick={() => {
                        if (canClick) {
                          onVisitAttraction(airportData.code, index, attraction.name, attraction.emotionPoints, attraction.emotionCategory, attraction.isPowerSpot);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{attraction.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-cyan-500/30 text-cyan-300 rounded-full">観光名所</span>
                            <p className="font-bold text-white">{attraction.name}</p>
                            {attraction.isPowerSpot && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 rounded-full">
                                ⚡ パワースポット
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mt-1">{attraction.description}</p>
                          {attraction.isPowerSpot && !isVisited && !hasPlayerSelectedHere && (
                            <p className="text-yellow-400 text-xs mt-2 font-medium">
                              ⚡ 訪問するとサイコロ2〜3倍チケット獲得！
                            </p>
                          )}
                        </div>
                        {isVisited ? (
                          <span className="px-3 py-1 text-xs font-bold bg-green-500/30 text-green-300 rounded-full border border-green-400/50">
                            ✓ 訪問済み
                          </span>
                        ) : hasPlayerSelectedHere ? (
                          <span className="px-3 py-1 text-xs text-gray-500 rounded-full">
                            —
                          </span>
                        ) : (
                          <span className={`emotion-badge ${EMOTION_LABELS[attraction.emotionCategory]?.className || ''}`}>
                            {EMOTION_LABELS[attraction.emotionCategory]?.icon} +{attraction.emotionPoints}pt
                          </span>
                        )}
                      </div>
                      {canClick && (
                        <p className="text-cyan-400 text-xs mt-2 text-center font-medium">👆 タップして訪問</p>
                      )}
                    </div>
                  );
                })}

                {/* ご当地グルメ */}
                {airportData.localFood?.map((food, index) => {
                  const foodId = `${airportData.code}-food-${index}`;
                  const isVisited = visitedFoods.includes(foodId);
                  // 現在のプレイヤーが選択済み、または既に他プレイヤーが選んだグルメはクリック不可
                  const canClick = canInteract && !hasPlayerSelectedHere && !isVisited && onVisitFood;

                  return (
                    <div
                      key={`food-${index}`}
                      className={`p-4 rounded-xl transition-all ${
                        isVisited
                          ? "bg-green-500/20 border border-green-400/50"
                          : hasPlayerSelectedHere
                          ? "bg-white/5 opacity-40 grayscale"
                          : canClick
                          ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 hover:border-orange-400 cursor-pointer hover:scale-[1.02]"
                          : "bg-white/5 border border-white/10"
                      }`}
                      onClick={() => {
                        if (canClick) {
                          onVisitFood(airportData.code, index, food.name, food.emotionPoints);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{food.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-orange-500/30 text-orange-300 rounded-full">グルメ</span>
                            <p className="font-bold text-white">{food.name}</p>
                          </div>
                          <p className="text-white/60 text-sm">{food.description}</p>
                        </div>
                        {isVisited ? (
                          <span className="px-3 py-1 text-xs font-bold bg-green-500/30 text-green-300 rounded-full border border-green-400/50">
                            ✓ 味わい済み
                          </span>
                        ) : hasPlayerSelectedHere ? (
                          <span className="px-3 py-1 text-xs text-gray-500 rounded-full">
                            —
                          </span>
                        ) : (
                          <span className="emotion-badge emotion-fun">
                            +{food.emotionPoints}pt
                          </span>
                        )}
                      </div>
                      {canClick && (
                        <p className="text-orange-400 text-xs mt-2 text-center font-medium">👆 タップして味わう</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* 近くの観光スポット */}
      {(() => {
        const attractionNames = (airportData.attractions || []).map(a => a.name.toLowerCase());
        const filteredSpots = nearbySpots.filter(spot =>
          !attractionNames.some(name =>
            spot.name.toLowerCase().includes(name) || name.includes(spot.name.toLowerCase())
          )
        );

        if (filteredSpots.length === 0) return null;

        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-bold">周辺の観光スポット</h3>
            </div>
            <div className="space-y-2">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{spot.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{spot.name}</p>
                        {spot.isWorldHeritage && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/50">
                            🏆 世界遺産
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">
                        {spot.transportFromAirport.description}
                      </p>
                    </div>
                    <span className={`emotion-badge ${EMOTION_LABELS[spot.emotionCategory]?.className || ''}`}>
                      {EMOTION_LABELS[spot.emotionCategory]?.icon} +{spot.emotionPoints}pt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 何も情報がない場合 */}
      {(!airportData.attractions || airportData.attractions.length === 0) &&
       (!airportData.localFood || airportData.localFood.length === 0) &&
       nearbySpots.length === 0 && (
        <div className="text-center py-8 glass-card-light rounded-xl">
          <div className="text-5xl mb-3">🛫</div>
          <p className="text-white/60">この空港には観光スポットがありません</p>
          <p className="text-white/40 text-sm mt-1">でも、新しい空港への玄関口です！</p>
        </div>
      )}
    </div>
  );
}
