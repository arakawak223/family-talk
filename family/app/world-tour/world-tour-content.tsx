"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/world-tour";
import { GameSetup } from "@/components/world-tour/game-setup";
import { Player } from "@/lib/game/player-manager";

interface WorldTourContentProps {
  userId: string;
  familyId: string;
  userName: string;
}

// ゲーム設定
interface GameConfig {
  players: Player[];
  destinationCount: number;
  startAirport: string;
}

export function WorldTourContent({
  userId,
  familyId,
}: WorldTourContentProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  // ゲーム開始ハンドラ
  const handleStartGame = (players: Player[], destinationCount: number, startAirport: string) => {
    setGameConfig({ players, destinationCount, startAirport });
    setGameStarted(true);
  };

  // ゲームセットアップ画面に戻る
  const handleBackToSetup = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // ゲームセットアップ画面
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
        {/* ヘッダー */}
        <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ← 戻る
                </Button>
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>✈️</span>
                <span>世界感動旅行ゲーム</span>
              </h1>
            </div>
          </div>
        </header>

        {/* ゲームセットアップ */}
        <main>
          <GameSetup onStartGame={handleStartGame} />
        </main>
      </div>
    );
  }

  // ゲームプレイ画面
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToSetup}>
              ← 設定に戻る
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>✈️</span>
              <span>世界感動旅行ゲーム</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {gameConfig && (
              <span className="text-sm text-gray-600">
                {gameConfig.players.length}人プレイ • 目的地{gameConfig.destinationCount}か所
              </span>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6">
        <GameBoard
          userId={userId}
          familyId={familyId}
          gameConfig={gameConfig}
        />
      </main>

      {/* フッター */}
      <footer className="bg-white/50 border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>🌍 世界感動旅行ゲーム - クイズに答え、名所を巡り、家族とメッセージを交換しよう！</p>
          <p className="text-xs mt-1">🏛️ 50空港 • ❓ クイズマス • ✉️ メッセージマス • 😂 お笑いマス</p>
        </div>
      </footer>
    </div>
  );
}
