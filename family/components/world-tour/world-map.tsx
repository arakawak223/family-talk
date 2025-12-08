"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Airport, TravelProgress } from "@/lib/types/world-tour";
import { AIRPORTS } from "@/lib/data/airports";

interface PlayerPosition {
  playerId: string;
  playerName: string;
  avatarEmoji: string;
  color: string;
  airportCode?: string;
  currentPosition?: { lat: number; lng: number };
  isInFlight: boolean;
  isCurrentPlayer: boolean;
}

interface WorldMapProps {
  currentAirport?: string;
  visitedAirports?: string[];
  selectedAirport?: string;
  onAirportSelect?: (airportCode: string) => void;
  showFlightRoutes?: boolean;
  availableDestinations?: string[];
  playerPositions?: PlayerPosition[];
  destinationAirport?: string;
  travelProgress?: TravelProgress;
  routePositions?: { lat: number; lng: number }[];
}

// Leaflet components loaded dynamically (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export function WorldMap({
  currentAirport,
  visitedAirports = [],
  selectedAirport,
  onAirportSelect,
  showFlightRoutes = false,
  availableDestinations = [],
  playerPositions = [],
  destinationAirport,
  travelProgress,
  routePositions = [],
}: WorldMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [planeIcon, setPlaneIcon] = useState<L.DivIcon | null>(null);
  const [playerIcons, setPlayerIcons] = useState<Map<string, L.DivIcon>>(new Map());

  useEffect(() => {
    setIsClient(true);
    // 飛行機アイコンを作成
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const icon = L.divIcon({
          html: '<div style="font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">✈️</div>',
          className: "plane-marker",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        setPlaneIcon(icon);
      });
    }
  }, []);

  // プレイヤーアイコンを作成
  useEffect(() => {
    if (typeof window !== "undefined" && playerPositions.length > 0) {
      import("leaflet").then((L) => {
        const icons = new Map<string, L.DivIcon>();
        playerPositions.forEach((player) => {
          const icon = L.divIcon({
            html: `
              <div class="player-bubble ${player.isCurrentPlayer ? 'current' : ''}" style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
              ">
                <div style="
                  background: ${player.color};
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 36px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  ${player.isCurrentPlayer ? 'animation: pulse 1.5s infinite;' : ''}
                ">${player.avatarEmoji}</div>
                <div style="
                  background: ${player.color};
                  color: white;
                  font-size: 10px;
                  font-weight: bold;
                  padding: 2px 6px;
                  border-radius: 8px;
                  margin-top: 2px;
                  white-space: nowrap;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                ">${player.playerName}</div>
                ${player.isCurrentPlayer ? '<div style="position: absolute; top: -8px; right: -8px; font-size: 12px;">🎮</div>' : ''}
              </div>
            `,
            className: "player-marker",
            iconSize: [50, 60],
            iconAnchor: [25, 55],
          });
          icons.set(player.playerId, icon);
        });
        setPlayerIcons(icons);
      });
    }
  }, [playerPositions]);

  const getMarkerStyle = useCallback(
    (airport: Airport) => {
      const isCurrentPosition = airport.code === currentAirport;
      const isVisited = visitedAirports.includes(airport.code);
      const isAvailable = availableDestinations.includes(airport.code);
      const isSelected = airport.code === selectedAirport;
      const isDestination = airport.code === destinationAirport;
      const isStartOfRoute = travelProgress?.startAirport === airport.code;
      const isInFlight = travelProgress && travelProgress.currentSpace > 0;

      // 現在地（移動中でない場合、または移動開始前の出発地）
      if (isCurrentPosition && !isInFlight) {
        return { color: "#dc2626", fillColor: "#ef4444", fillOpacity: 1, weight: 3, radius: 10 };
      }
      // 移動中の出発地（すでに離陸済み）
      if (isStartOfRoute && isInFlight) {
        return { color: "#059669", fillColor: "#10b981", fillOpacity: 1, weight: 3, radius: 10 };
      }
      if (isDestination) {
        // 目的地は金色で大きく表示
        return { color: "#d97706", fillColor: "#fbbf24", fillOpacity: 1, weight: 3, radius: 12 };
      }
      if (isSelected) {
        return { color: "#7c3aed", fillColor: "#8b5cf6", fillOpacity: 1, weight: 2, radius: 9 };
      }
      if (isAvailable) {
        return { color: "#16a34a", fillColor: "#22c55e", fillOpacity: 1, weight: 2, radius: 8 };
      }
      if (isVisited) {
        return { color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9, weight: 2, radius: 6 };
      }
      return { color: "#6b7280", fillColor: "#9ca3af", fillOpacity: 0.7, weight: 1, radius: airport.hub ? 5 : 4 };
    },
    [currentAirport, visitedAirports, availableDestinations, selectedAirport, destinationAirport, travelProgress]
  );

  const currentAirportData = useMemo(
    () => AIRPORTS.find((a) => a.code === currentAirport),
    [currentAirport]
  );

  const flightLines = useMemo(() => {
    if (!showFlightRoutes || !currentAirportData) return [];
    return availableDestinations
      .map((destCode) => {
        const dest = AIRPORTS.find((a) => a.code === destCode);
        if (!dest) return null;
        return {
          positions: [
            [currentAirportData.coordinates.lat, currentAirportData.coordinates.lng] as [number, number],
            [dest.coordinates.lat, dest.coordinates.lng] as [number, number],
          ],
          code: destCode,
        };
      })
      .filter(Boolean);
  }, [showFlightRoutes, currentAirportData, availableDestinations]);

  // 空路のライン（出発地から目的地）
  const travelRouteLine = useMemo(() => {
    if (!travelProgress || routePositions.length < 2) return null;
    return routePositions.map((pos) => [pos.lat, pos.lng] as [number, number]);
  }, [travelProgress, routePositions]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-[#1a365d] to-[#0f2744] flex items-center justify-center">
        <div className="text-white text-lg">地図を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .plane-marker {
          background: transparent;
          border: none;
        }
        .player-marker {
          background: transparent;
          border: none;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          }
        }
      `}</style>

      {/* 凡例 */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg p-2.5 shadow-lg text-[10px]">
        <p className="font-bold mb-1.5 text-gray-800">凡例</p>
        <div className="space-y-1">
          {!travelProgress && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-600 shadow"></span>
              <span>現在地</span>
            </div>
          )}
          {travelProgress && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-base">✈️</span>
                <span>移動中</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-600 shadow"></span>
                <span>出発地</span>
              </div>
            </>
          )}
          {destinationAirport && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-amber-600 shadow"></span>
              <span>目的地</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 border border-blue-600"></span>
            <span>訪問済み</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 border border-gray-500"></span>
            <span>未訪問</span>
          </div>
        </div>
      </div>

      {/* 操作説明 */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg px-2.5 py-1.5 shadow-lg text-[10px]">
        <p>🖱️ ドラッグで移動 / ホイールでズーム</p>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={true}
      >
        {/* CartoDB Voyager - 美しくモダンな地図タイル */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* 目的地設定時のフライトルート候補 */}
        {flightLines.map((line, index) => {
          if (!line) return null;
          return (
            <Polyline
              key={`route-${index}`}
              positions={line.positions}
              color="#22c55e"
              weight={3}
              opacity={0.7}
              dashArray="10, 5"
            />
          );
        })}

        {/* 移動中の空路ライン */}
        {travelRouteLine && (
          <Polyline
            positions={travelRouteLine}
            color="#0ea5e9"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* 空路上のマス（ウェイポイント） */}
        {travelProgress && routePositions.map((pos, index) => {
          const isCurrentSpace = index === travelProgress.currentSpace;
          const isPassed = index < travelProgress.currentSpace;
          const isStart = index === 0;
          const isEnd = index === routePositions.length - 1;

          // 出発地と目的地は空港マーカーとして表示するのでスキップ
          if (isStart || isEnd) return null;

          return (
            <CircleMarker
              key={`waypoint-${index}`}
              center={[pos.lat, pos.lng]}
              radius={isCurrentSpace ? 8 : 5}
              color={isPassed ? "#0ea5e9" : "#94a3b8"}
              fillColor={isPassed ? "#38bdf8" : "#cbd5e1"}
              fillOpacity={0.9}
              weight={isCurrentSpace ? 3 : 2}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="text-center text-xs">
                  <div className="font-bold">{index}マス目</div>
                  {isCurrentSpace && <div className="text-sky-600">現在地</div>}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* 空港マーカー */}
        {AIRPORTS.map((airport) => {
          const style = getMarkerStyle(airport);
          const isClickable = availableDestinations.includes(airport.code) || airport.code === currentAirport;
          // currentAirportが変わった時にマーカーを再レンダリングするためのkey
          const markerKey = `${airport.code}-${currentAirport}-${travelProgress?.currentSpace ?? 'none'}`;

          return (
            <CircleMarker
              key={markerKey}
              center={[airport.coordinates.lat, airport.coordinates.lng]}
              {...style}
              eventHandlers={{
                click: () => isClickable && onAirportSelect?.(airport.code),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-center">
                  <div className="font-bold">{airport.icon} {airport.city}</div>
                  <div className="text-xs text-gray-600">{airport.name}</div>
                  <div className="text-xs text-gray-500">{airport.code}</div>
                  {airport.code === travelProgress?.startAirport && (
                    <div className="text-xs text-emerald-600 font-bold">出発地</div>
                  )}
                  {airport.code === destinationAirport && (
                    <div className="text-xs text-amber-600 font-bold">目的地</div>
                  )}
                </div>
              </Tooltip>
              {airport.code === currentAirport && !travelProgress && (
                <Popup>
                  <div className="text-center">
                    <div className="text-2xl mb-1">✈️</div>
                    <div className="font-bold">{airport.city}</div>
                    <div className="text-sm text-gray-600">現在地</div>
                  </div>
                </Popup>
              )}
            </CircleMarker>
          );
        })}

        {/* 移動中の飛行機マーカー */}
        {travelProgress && travelProgress.currentSpace > 0 && planeIcon && (
          <Marker
            position={[travelProgress.currentPosition.lat, travelProgress.currentPosition.lng]}
            icon={planeIcon}
          >
            <Tooltip direction="top" offset={[0, -15]} opacity={1} permanent>
              <div className="text-center text-xs font-bold">
                {travelProgress.currentSpace}/{travelProgress.totalSpaces}マス
              </div>
            </Tooltip>
          </Marker>
        )}

        {/* プレイヤー位置マーカー（吹き出し付き） */}
        {playerPositions.map((player, index) => {
          const playerIcon = playerIcons.get(player.playerId);
          if (!playerIcon) return null;

          // プレイヤーの位置を決定
          let position: [number, number] | null = null;
          if (player.isInFlight && player.currentPosition) {
            position = [player.currentPosition.lat, player.currentPosition.lng];
          } else if (player.airportCode) {
            const airport = AIRPORTS.find(a => a.code === player.airportCode);
            if (airport) {
              // 複数プレイヤーが同じ空港にいる場合は少しずらす
              const offset = index * 0.5;
              position = [airport.coordinates.lat + offset, airport.coordinates.lng + offset];
            }
          }

          if (!position) return null;

          return (
            <Marker
              key={`player-${player.playerId}`}
              position={position}
              icon={playerIcon}
              zIndexOffset={player.isCurrentPlayer ? 1000 : 100 + index}
            >
              <Tooltip direction="top" offset={[0, -60]} opacity={1}>
                <div className="text-center">
                  <div className="font-bold">{player.avatarEmoji} {player.playerName}</div>
                  {player.isInFlight ? (
                    <div className="text-xs text-sky-600">移動中 ✈️</div>
                  ) : player.airportCode ? (
                    <div className="text-xs text-gray-600">
                      {AIRPORTS.find(a => a.code === player.airportCode)?.city}
                    </div>
                  ) : null}
                  {player.isCurrentPlayer && (
                    <div className="text-xs text-green-600 font-bold">🎮 現在のターン</div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
