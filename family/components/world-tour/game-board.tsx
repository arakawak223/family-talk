"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMap } from "./world-map";
import { AirportPanel } from "./airport-panel";
import { EmotionPointsDisplay } from "./emotion-points-display";
import { SpotVisitModal } from "./spot-visit-modal";
import { PlayerState, EmotionCategory, TravelProgress } from "@/lib/types/world-tour";
import { AIRPORTS, getAirportByCode, calculateDistance, distanceToSpaces } from "@/lib/data/airports";
import { getSpotsByAirport } from "@/lib/data/tourist-spots";

interface GameBoardProps {
  userId: string;
  familyId: string;
}

// 初期プレイヤー状態
function createInitialPlayer(id: string, name: string): PlayerState {
  return {
    id,
    name,
    currentAirport: "NRT", // 成田空港からスタート
    emotionPoints: {
      total: 0,
      fun: 0,
      joy: 0,
      beauty: 0,
      wonder: 0,
      reflection: 0,
    },
    visitedAirports: ["NRT"],
    visitedSpots: [],
    inventory: [],
    turnsPlayed: 0,
  };
}

// 2点間の座標を線形補間
function interpolatePosition(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progress: number // 0〜1
): { lat: number; lng: number } {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

// 空路上のマス位置を計算
function calculateRoutePositions(
  startAirport: string,
  endAirport: string,
  totalSpaces: number
): { lat: number; lng: number }[] {
  const start = getAirportByCode(startAirport);
  const end = getAirportByCode(endAirport);
  if (!start || !end) return [];

  const positions: { lat: number; lng: number }[] = [];
  for (let i = 0; i <= totalSpaces; i++) {
    const progress = i / totalSpaces;
    positions.push(interpolatePosition(start.coordinates, end.coordinates, progress));
  }
  return positions;
}

// 今回のサイコロで到達可能な空港を計算（目的地設定モード用）
function getAllDestinationsWithDistance(currentAirport: string): { code: string; distance: number; spaces: number }[] {
  const current = getAirportByCode(currentAirport);
  if (!current) return [];

  return AIRPORTS
    .filter((airport) => airport.code !== currentAirport)
    .map((airport) => {
      const distance = calculateDistance(current, airport);
      const spaces = distanceToSpaces(distance);
      return { code: airport.code, distance, spaces };
    })
    .sort((a, b) => a.spaces - b.spaces);
}

export function GameBoard({ userId }: GameBoardProps) {
  const [player, setPlayer] = useState<PlayerState>(() =>
    createInitialPlayer(userId, "プレイヤー")
  );
  const [gamePhase, setGamePhase] = useState<
    "idle" | "setting_destination" | "rolling" | "moving" | "arrived" | "visiting"
  >("idle");
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [currentSpot, setCurrentSpot] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  // 目的地選択用のリスト
  const allDestinations = useMemo(() =>
    getAllDestinationsWithDistance(player.currentAirport),
    [player.currentAirport]
  );

  // 空路上のマス位置を計算
  const routePositions = useMemo(() => {
    if (!player.travelProgress) return [];
    return calculateRoutePositions(
      player.travelProgress.startAirport,
      player.travelProgress.finalDestination,
      player.travelProgress.totalSpaces
    );
  }, [player.travelProgress]);

  // 目的地設定モード開始
  const startDestinationSelection = useCallback(() => {
    setGamePhase("setting_destination");
    setMessage("目的地を選んでください");
  }, []);

  // 目的地確定
  const confirmDestination = useCallback((destinationCode: string) => {
    const current = getAirportByCode(player.currentAirport);
    const destination = getAirportByCode(destinationCode);
    if (!current || !destination) return;

    const distance = calculateDistance(current, destination);
    const totalSpaces = distanceToSpaces(distance);

    const travelProgress: TravelProgress = {
      startAirport: player.currentAirport,
      finalDestination: destinationCode,
      totalDistance: distance,
      totalSpaces,
      currentSpace: 0,
      currentPosition: current.coordinates,
    };

    setPlayer((prev) => ({
      ...prev,
      destinationAirport: destinationCode,
      travelProgress,
    }));

    setSelectedAirport(null);
    setGamePhase("idle");
    setMessage(`目的地: ${destination.city} (${totalSpaces}マス) 設定完了！サイコロを振って進みましょう`);
  }, [player.currentAirport]);

  // 目的地キャンセル
  const cancelDestination = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      destinationAirport: undefined,
      travelProgress: undefined,
    }));
    setGamePhase("idle");
    setMessage("目的地をキャンセルしました");
  }, []);

  // サイコロを振る
  const rollDice = useCallback(() => {
    if (!player.travelProgress) return;

    setGamePhase("rolling");
    setMessage("サイコロを振っています...");

    // サイコロアニメーション
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        setGamePhase("moving");

        const remaining = player.travelProgress!.totalSpaces - player.travelProgress!.currentSpace;
        if (finalResult >= remaining) {
          setMessage(`${finalResult}が出ました！目的地に到着します！`);
        } else {
          setMessage(`${finalResult}が出ました！${finalResult}マス進みます`);
        }
      }
    }, 100);
  }, [player.travelProgress]);

  // 移動を確定
  const confirmMove = useCallback(() => {
    if (!player.travelProgress || diceResult === null) return;

    const currentSpace = player.travelProgress.currentSpace;
    const totalSpaces = player.travelProgress.totalSpaces;
    const newSpace = Math.min(currentSpace + diceResult, totalSpaces);
    const isArrived = newSpace >= totalSpaces;

    // 新しい位置を計算
    const startAirport = getAirportByCode(player.travelProgress.startAirport);
    const destAirport = getAirportByCode(player.travelProgress.finalDestination);
    if (!startAirport || !destAirport) return;

    const progress = newSpace / totalSpaces;
    const newPosition = interpolatePosition(
      startAirport.coordinates,
      destAirport.coordinates,
      progress
    );

    if (isArrived) {
      // 目的地到着
      const destination = player.travelProgress.finalDestination;
      const destinationAirport = getAirportByCode(destination);
      const isNewAirport = !player.visitedAirports.includes(destination);
      const bonusPoints = isNewAirport ? 100 : 50;

      setPlayer((prev) => ({
        ...prev,
        currentAirport: destination,
        visitedAirports: isNewAirport
          ? [...prev.visitedAirports, destination]
          : prev.visitedAirports,
        destinationAirport: undefined,
        travelProgress: undefined,
        turnsPlayed: prev.turnsPlayed + 1,
        emotionPoints: {
          ...prev.emotionPoints,
          total: prev.emotionPoints.total + bonusPoints,
          joy: prev.emotionPoints.joy + bonusPoints,
        },
      }));

      const spots = getSpotsByAirport(destination);
      if (spots.length > 0) {
        setGamePhase("visiting");
        setMessage(`🎉 ${destinationAirport?.city}に到着！目的地ボーナス +${bonusPoints}pt！観光スポットがあります`);
      } else {
        setGamePhase("idle");
        setMessage(`🎉 ${destinationAirport?.city}に到着！目的地ボーナス +${bonusPoints}pt。次の目的地を設定しましょう！`);
      }
    } else {
      // 空路上を移動
      setPlayer((prev) => ({
        ...prev,
        travelProgress: {
          ...prev.travelProgress!,
          currentSpace: newSpace,
          currentPosition: newPosition,
        },
        turnsPlayed: prev.turnsPlayed + 1,
      }));

      setGamePhase("idle");
      setMessage(`${diceResult}マス進みました！残り${totalSpaces - newSpace}マス`);
    }

    setDiceResult(null);
  }, [player.travelProgress, player.visitedAirports, diceResult]);

  // 観光スポット訪問
  const visitSpot = useCallback((spotId: string) => {
    setCurrentSpot(spotId);
    setShowSpotModal(true);
  }, []);

  // スポット訪問完了
  const handleSpotVisitComplete = useCallback(
    (emotionCategory: EmotionCategory, points: number) => {
      setPlayer((prev) => ({
        ...prev,
        visitedSpots: [...prev.visitedSpots, currentSpot!],
        emotionPoints: {
          ...prev.emotionPoints,
          total: prev.emotionPoints.total + points,
          [emotionCategory]: prev.emotionPoints[emotionCategory] + points,
        },
      }));
      setShowSpotModal(false);
      setCurrentSpot(null);
      setGamePhase("idle");
      setMessage(`感動ポイント +${points}pt 獲得！`);
    },
    [currentSpot]
  );

  // スキップして次のターンへ
  const skipVisit = useCallback(() => {
    setGamePhase("idle");
    setMessage("次のターンへ");
  }, []);

  const currentAirport = getAirportByCode(player.currentAirport);
  const destinationAirportData = player.destinationAirport ? getAirportByCode(player.destinationAirport) : null;
  const nearbySpots = getSpotsByAirport(player.currentAirport);
  const unvisitedSpots = nearbySpots.filter(
    (spot) => !player.visitedSpots.includes(spot.id)
  );

  // 移動中かどうか（空路上にいる）
  const isInFlight = player.travelProgress && player.travelProgress.currentSpace > 0;

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>✈️ 世界感動旅行</span>
            <Badge variant="outline" className="text-lg">
              ターン {player.turnsPlayed + 1}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 現在地 */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isInFlight ? "✈️" : currentAirport?.icon}</span>
              <div>
                <p className="text-sm text-gray-500">現在地</p>
                <p className="font-bold">
                  {isInFlight ? (
                    <span className="text-sky-600">
                      {getAirportByCode(player.travelProgress?.startAirport || "")?.city}
                      → {destinationAirportData?.city} 移動中
                    </span>
                  ) : (
                    `${currentAirport?.city}, ${currentAirport?.country}`
                  )}
                </p>
              </div>
            </div>

            {/* 目的地表示 */}
            {destinationAirportData && player.travelProgress && (
              <div className="flex items-center gap-2 p-2 bg-sky-50 rounded-lg border border-sky-200">
                <span className="text-2xl">{destinationAirportData.icon}</span>
                <div>
                  <p className="text-sm text-sky-600">目的地</p>
                  <p className="font-bold text-sky-800">
                    {destinationAirportData.city}
                  </p>
                  <p className="text-xs text-sky-600">
                    {player.travelProgress.currentSpace}/{player.travelProgress.totalSpaces}マス
                  </p>
                </div>
              </div>
            )}

            {/* 感動ポイント */}
            <EmotionPointsDisplay points={player.emotionPoints} />

            {/* 訪問数 */}
            <div className="text-center">
              <p className="text-sm text-gray-500">訪問空港</p>
              <p className="text-2xl font-bold">
                {player.visitedAirports.length}/{AIRPORTS.length}
              </p>
            </div>
          </div>

          {/* メッセージ */}
          {message && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-800">{message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* メインマップ */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[600px] w-full relative">
            <WorldMap
              currentAirport={isInFlight ? undefined : player.currentAirport}
              visitedAirports={player.visitedAirports}
              selectedAirport={selectedAirport || undefined}
              onAirportSelect={(code) => {
                if (gamePhase === "setting_destination") {
                  setSelectedAirport(code);
                }
              }}
              showFlightRoutes={gamePhase === "setting_destination"}
              availableDestinations={
                gamePhase === "setting_destination"
                  ? AIRPORTS.filter(a => a.code !== player.currentAirport).map(a => a.code)
                  : []
              }
              destinationAirport={player.destinationAirport}
              travelProgress={player.travelProgress}
              routePositions={routePositions}
            />
          </div>
        </CardContent>
      </Card>

      {/* コントロールパネル */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* アクションパネル */}
        <Card>
          <CardHeader>
            <CardTitle>🎮 アクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 目的地設定モード */}
            {gamePhase === "setting_destination" && (
              <div className="space-y-3">
                <p className="font-semibold text-sky-700">🗺️ 目的地を選択</p>
                <p className="text-sm text-gray-600">
                  地図上の空港をクリックするか、下のリストから選んでください
                </p>

                {/* 選択中の空港 */}
                {selectedAirport && (
                  <div className="p-3 bg-sky-50 rounded-lg border-2 border-sky-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAirportByCode(selectedAirport)?.icon}</span>
                        <div>
                          <p className="font-bold">{getAirportByCode(selectedAirport)?.city}</p>
                          <p className="text-sm text-gray-500">
                            {(() => {
                              const dest = allDestinations.find(d => d.code === selectedAirport);
                              return dest ? `${dest.distance.toLocaleString()}km / ${dest.spaces}マス` : "";
                            })()}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => confirmDestination(selectedAirport)} className="bg-sky-600 hover:bg-sky-700">
                        決定
                      </Button>
                    </div>
                  </div>
                )}

                {/* 人気の目的地リスト */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {allDestinations.slice(0, 15).map(({ code, distance, spaces }) => {
                    const airport = getAirportByCode(code);
                    if (!airport) return null;
                    const isSelected = code === selectedAirport;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedAirport(code)}
                        className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                          isSelected ? "bg-sky-100 border-2 border-sky-400" : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{airport.icon}</span>
                          <span className="font-medium">{airport.city}</span>
                        </div>
                        <div className="text-right text-sm">
                          <span className="text-gray-500">{distance.toLocaleString()}km</span>
                          <Badge variant="secondary" className="ml-2">
                            {spaces}マス
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setGamePhase("idle")}>
                  キャンセル
                </Button>
              </div>
            )}

            {/* 通常の待機状態 */}
            {gamePhase === "idle" && (
              <div className="space-y-3">
                {/* 目的地が設定されている場合（移動中） */}
                {player.travelProgress ? (
                  <>
                    <div className="p-3 bg-sky-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-sky-600">
                          {getAirportByCode(player.travelProgress.startAirport)?.city} → {destinationAirportData?.city}
                        </p>
                        <span className="text-sm font-bold text-sky-700">
                          {player.travelProgress.currentSpace}/{player.travelProgress.totalSpaces}マス
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-sky-200 rounded-full h-4 relative">
                          <div
                            className="bg-sky-600 h-4 rounded-full transition-all"
                            style={{
                              width: `${(player.travelProgress.currentSpace / player.travelProgress.totalSpaces) * 100}%`
                            }}
                          />
                          {/* マス表示 */}
                          <div className="absolute inset-0 flex items-center justify-around px-1">
                            {Array.from({ length: player.travelProgress.totalSpaces + 1 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i <= player.travelProgress!.currentSpace
                                    ? "bg-white"
                                    : "bg-sky-400"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-sky-600 mt-2 text-center">
                        残り {player.travelProgress.totalSpaces - player.travelProgress.currentSpace}マス
                      </p>
                    </div>
                    <Button
                      onClick={rollDice}
                      size="lg"
                      className="w-full text-xl py-6 bg-sky-600 hover:bg-sky-700"
                    >
                      🎲 サイコロを振る
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-red-600"
                      onClick={cancelDestination}
                    >
                      目的地をキャンセル
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={startDestinationSelection}
                      size="lg"
                      className="w-full text-xl py-6"
                    >
                      🗺️ 目的地を設定する
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      目的地を選んでサイコロを振り、空路を進んで目指しましょう！
                    </p>
                  </>
                )}
              </div>
            )}

            {/* サイコロ結果 - 移動確認 */}
            {(gamePhase === "rolling" || gamePhase === "moving") && diceResult !== null && (
              <div className="space-y-3">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">サイコロの目</p>
                  <p className="text-6xl font-bold text-yellow-600">{diceResult}</p>
                  {player.travelProgress && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        {player.travelProgress.currentSpace}マス目 → {Math.min(player.travelProgress.currentSpace + diceResult, player.travelProgress.totalSpaces)}マス目
                      </p>
                      {player.travelProgress.currentSpace + diceResult >= player.travelProgress.totalSpaces && (
                        <p className="text-green-600 font-bold mt-1">🎉 目的地に到着！</p>
                      )}
                    </div>
                  )}
                </div>

                {gamePhase === "moving" && (
                  <Button
                    onClick={confirmMove}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    ✈️ 移動する
                  </Button>
                )}
              </div>
            )}

            {/* 観光スポット */}
            {gamePhase === "visiting" && unvisitedSpots.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold">🏛️ 観光スポット</p>
                {unvisitedSpots.map((spot) => (
                  <Button
                    key={spot.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => visitSpot(spot.id)}
                  >
                    <span className="text-xl mr-2">{spot.icon}</span>
                    <span>{spot.name}</span>
                    <Badge className="ml-auto" variant="secondary">
                      +{spot.emotionPoints}pt
                    </Badge>
                  </Button>
                ))}
                <Button variant="ghost" className="w-full" onClick={skipVisit}>
                  スキップして次へ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 空港情報パネル */}
        <AirportPanel
          airport={selectedAirport || player.destinationAirport || player.currentAirport}
          isCurrentLocation={!selectedAirport && !player.destinationAirport}
          nearbySpots={
            selectedAirport
              ? getSpotsByAirport(selectedAirport)
              : player.destinationAirport
              ? getSpotsByAirport(player.destinationAirport)
              : nearbySpots
          }
        />
      </div>

      {/* スポット訪問モーダル */}
      {showSpotModal && currentSpot && (
        <SpotVisitModal
          spotId={currentSpot}
          onComplete={handleSpotVisitComplete}
          onClose={() => {
            setShowSpotModal(false);
            setCurrentSpot(null);
            setGamePhase("idle");
          }}
        />
      )}
    </div>
  );
}
