"use client";

import { Button } from "@/components/ui/button";
import { getAirportByCode, calculateDistance, distanceToSpaces } from "@/lib/data/airports";

interface FlightSelectorProps {
  from: string;
  to: string;
  onConfirm: () => void;
  onCancel: () => void;
  isFinalDestination?: boolean;
}

export function FlightSelector({
  from,
  to,
  onConfirm,
  onCancel,
  isFinalDestination = false,
}: FlightSelectorProps) {
  const fromAirport = getAirportByCode(from);
  const toAirport = getAirportByCode(to);

  if (!fromAirport || !toAirport) return null;

  const distance = calculateDistance(fromAirport, toAirport);
  const spaces = distanceToSpaces(distance);
  const flightTime = Math.round(distance / 800); // 平均時速800kmで計算

  return (
    <div className={`p-4 rounded-lg border-2 ${isFinalDestination ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-300" : "bg-gradient-to-r from-sky-50 to-blue-50 border-blue-200"}`}>
      <p className={`text-sm font-semibold mb-3 ${isFinalDestination ? "text-amber-800" : "text-blue-800"}`}>
        {isFinalDestination ? "🎯 目的地到着！" : "✈️ フライト確認"}
      </p>

      {/* ルート表示 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="text-center">
          <p className="text-2xl">{fromAirport.icon}</p>
          <p className="font-bold">{fromAirport.city}</p>
          <p className="text-xs text-gray-500">{fromAirport.code}</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex-1 h-0.5 bg-blue-300"></div>
          <span className="px-2 text-2xl">✈️</span>
          <div className="flex-1 h-0.5 bg-blue-300"></div>
        </div>

        <div className="text-center">
          <p className="text-2xl">{toAirport.icon}</p>
          <p className="font-bold">{toAirport.city}</p>
          <p className="text-xs text-gray-500">{toAirport.code}</p>
        </div>
      </div>

      {/* フライト情報 */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
        <div className="p-2 bg-white rounded">
          <p className="text-gray-500">距離</p>
          <p className="font-bold">{distance.toLocaleString()} km</p>
        </div>
        <div className="p-2 bg-white rounded">
          <p className="text-gray-500">飛行時間</p>
          <p className="font-bold">約 {flightTime} 時間</p>
        </div>
        <div className="p-2 bg-white rounded">
          <p className="text-gray-500">消費マス</p>
          <p className="font-bold">{spaces} マス</p>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          キャンセル
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={onConfirm}
        >
          ✈️ 出発する
        </Button>
      </div>
    </div>
  );
}
