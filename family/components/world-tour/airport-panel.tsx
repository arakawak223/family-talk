"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAirportByCode } from "@/lib/data/airports";
import { TouristSpot } from "@/lib/types/world-tour";

interface AirportPanelProps {
  airport: string;
  isCurrentLocation?: boolean;
  nearbySpots?: TouristSpot[];
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

        {/* 近くの観光スポット */}
        {nearbySpots.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              🏛️ 近くの観光スポット
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

        {nearbySpots.length === 0 && (
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
