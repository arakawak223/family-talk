"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAirportByCode } from "@/lib/data/airports";
import { TouristSpot, EmotionCategory } from "@/lib/types/world-tour";

interface AirportPanelProps {
  airport: string;
  isCurrentLocation?: boolean;
  nearbySpots?: TouristSpot[];
  visitedAttractions?: string[];  // 訪問済み観光名所のID (airportCode-index形式)
  visitedFoods?: string[];        // 訪問済みグルメのID (airportCode-index形式)
  onVisitAttraction?: (airportCode: string, index: number, name: string, points: number, category: EmotionCategory, isPowerSpot?: boolean) => void;
  onVisitFood?: (airportCode: string, index: number, name: string, points: number) => void;
  canInteract?: boolean;          // 現在地の場合のみインタラクション可能
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

const EMOTION_LABELS: Record<string, { label: string; icon: string }> = {
  fun: { label: "たのしい", icon: "😊" },
  joy: { label: "うれしい", icon: "😢" },
  beauty: { label: "うつくしい", icon: "✨" },
  wonder: { label: "おどろき", icon: "🤯" },
  reflection: { label: "しみじみ", icon: "💭" },
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
}: AirportPanelProps) {
  const airportData = getAirportByCode(airport);

  if (!airportData) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          空港を選択してください
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{airportData.icon}</span>
          <div>
            <p className="text-lg">{airportData.city}</p>
            <p className="text-sm font-normal text-gray-500">
              {airportData.name}
            </p>
          </div>
          {isCurrentLocation && (
            <Badge className="ml-auto bg-red-500">現在地</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本情報 */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">国</p>
            <p className="font-semibold">{airportData.country}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">地域</p>
            <p className="font-semibold">
              {REGION_NAMES[airportData.region] || airportData.region}
            </p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">空港コード</p>
            <p className="font-semibold font-mono">{airportData.code}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">タイプ</p>
            <p className="font-semibold">
              {airportData.hub ? "🌟 ハブ空港" : "地方空港"}
            </p>
          </div>
        </div>

        {/* 観光名所（空港データから） */}
        {airportData.attractions && airportData.attractions.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              🏛️ 観光名所
            </p>
            <div className="space-y-2">
              {airportData.attractions.map((attraction, index) => {
                const attractionId = `${airportData.code}-attraction-${index}`;
                const isVisited = visitedAttractions.includes(attractionId);
                // この空港で既に観光名所を訪問済みかチェック（1つのみ選択可能）
                const hasVisitedAttractionInAirport = visitedAttractions.some(id => id.startsWith(`${airportData.code}-attraction-`));
                const canClick = canInteract && !hasVisitedAttractionInAirport && onVisitAttraction;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      isVisited
                        ? "bg-green-50 border-2 border-green-300"
                        : hasVisitedAttractionInAirport
                        ? "bg-gray-100 opacity-50"
                        : canClick
                        ? "bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 cursor-pointer border-2 border-transparent hover:border-sky-300"
                        : "bg-gradient-to-r from-sky-50 to-blue-50"
                    }`}
                    onClick={() => {
                      if (canClick) {
                        onVisitAttraction(airportData.code, index, attraction.name, attraction.emotionPoints, attraction.emotionCategory, attraction.isPowerSpot);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{attraction.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{attraction.name}</p>
                          {attraction.isPowerSpot && (
                            <span className="text-yellow-500" title="パワースポット">✨</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {attraction.description}
                        </p>
                        {attraction.isPowerSpot && !isVisited && (
                          <p className="text-xs text-amber-600 font-medium mt-1">
                            ⚡ パワースポット: 訪問するとサイコロ2〜3倍！
                          </p>
                        )}
                      </div>
                      {isVisited ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ✓ 訪問済み
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={attraction.isPowerSpot
                            ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800"
                            : canClick
                            ? "bg-sky-200 text-sky-800"
                            : "bg-sky-100 text-sky-700"
                          }
                        >
                          {EMOTION_LABELS[attraction.emotionCategory]?.icon}{" "}
                          +{attraction.emotionPoints}pt
                        </Badge>
                      )}
                    </div>
                    {canClick && !isVisited && (
                      <p className="text-xs text-sky-600 mt-1 text-center">タップして訪問</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ご当地グルメ（空港データから） */}
        {airportData.localFood && airportData.localFood.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              🍽️ ご当地グルメ
            </p>
            <div className="space-y-2">
              {airportData.localFood.map((food, index) => {
                const foodId = `${airportData.code}-food-${index}`;
                const isVisited = visitedFoods.includes(foodId);
                // この空港で既にグルメを体験済みかチェック（1つのみ選択可能）
                const hasVisitedFoodInAirport = visitedFoods.some(id => id.startsWith(`${airportData.code}-food-`));
                const canClick = canInteract && !hasVisitedFoodInAirport && onVisitFood;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      isVisited
                        ? "bg-green-50 border-2 border-green-300"
                        : hasVisitedFoodInAirport
                        ? "bg-gray-100 opacity-50"
                        : canClick
                        ? "bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 cursor-pointer border-2 border-transparent hover:border-orange-300"
                        : "bg-gradient-to-r from-orange-50 to-yellow-50"
                    }`}
                    onClick={() => {
                      if (canClick) {
                        onVisitFood(airportData.code, index, food.name, food.emotionPoints);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{food.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{food.name}</p>
                        <p className="text-xs text-gray-500">
                          {food.description}
                        </p>
                      </div>
                      {isVisited ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          ✓ 味わい済み
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className={canClick ? "bg-orange-200 text-orange-800" : "bg-orange-100 text-orange-700"}
                        >
                          +{food.emotionPoints}pt
                        </Badge>
                      )}
                    </div>
                    {canClick && !isVisited && (
                      <p className="text-xs text-orange-600 mt-1 text-center">タップして味わう</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 近くの観光スポット（TouristSpotデータから） */}
        {nearbySpots.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              🗺️ 周辺の観光スポット
            </p>
            <div className="space-y-2">
              {nearbySpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{spot.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{spot.name}</p>
                      <p className="text-xs text-gray-500">
                        {spot.transportFromAirport.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {EMOTION_LABELS[spot.emotionCategory]?.icon}{" "}
                        +{spot.emotionPoints}pt
                      </Badge>
                      {spot.isWorldHeritage && (
                        <p className="text-xs text-amber-600 mt-1">
                          🏆 世界遺産
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 何も情報がない場合 */}
        {(!airportData.attractions || airportData.attractions.length === 0) &&
         (!airportData.localFood || airportData.localFood.length === 0) &&
         nearbySpots.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
            <p className="text-2xl mb-2">🛫</p>
            <p className="text-sm">この空港には観光スポットがありません</p>
            <p className="text-xs">でも、新しい空港への玄関口です！</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
