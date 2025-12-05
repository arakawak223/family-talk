"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/world-tour";

interface WorldTourContentProps {
  userId: string;
  familyId: string;
  userName: string;
}

export function WorldTourContent({
  userId,
  familyId,
  userName,
}: WorldTourContentProps) {
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
              <span>感動・世界旅ゲーム</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              プレイヤー: <span className="font-semibold">{userName}</span>
            </span>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6">
        <GameBoard userId={userId} familyId={familyId} />
      </main>

      {/* フッター */}
      <footer className="bg-white/50 border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>🌍 感動・世界旅ゲーム - クイズに答え、名所を巡り、家族とメッセージを交換しよう！</p>
          <p className="text-xs mt-1">🏛️ 50空港 • ❓ クイズマス • ✉️ メッセージマス</p>
        </div>
      </footer>
    </div>
  );
}
