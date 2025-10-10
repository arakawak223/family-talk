"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SugorokuSquare,
  UserBoardProgressWithBoard,
  FamilyRanking,
  UserGift,
} from "@/lib/types/sugoroku";
import {
  getUserProgress,
  getBoardSquares,
  getFamilyRanking,
  getUserGifts,
} from "@/lib/api/sugoroku";
import { getUserPoints } from "@/lib/api/points";
import { SugorokuSquareItem } from "./sugoroku-square";
import { DiceRoller } from "./dice-roller";
import { WorldMapModal } from "./world-map-modal";

interface SugorokuBoardProps {
  userId: string;
  familyId: string;
}

export function SugorokuBoard({ userId, familyId }: SugorokuBoardProps) {
  const [progress, setProgress] = useState<UserBoardProgressWithBoard | null>(null);
  const [squares, setSquares] = useState<SugorokuSquare[]>([]);
  const [ranking, setRanking] = useState<FamilyRanking[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [userGifts, setUserGifts] = useState<UserGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId, familyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 進捗を取得
      const progressData = await getUserProgress(userId, familyId);
      setProgress(progressData);

      if (progressData) {
        // マス一覧を取得
        const squaresData = await getBoardSquares(progressData.board_id);
        setSquares(squaresData);
      }

      // ポイントを取得
      const pointsData = await getUserPoints(userId, familyId);
      if (pointsData) {
        setCurrentPoints(pointsData.current_points);
      }

      // ランキングを取得
      const rankingData = await getFamilyRanking(familyId);
      setRanking(rankingData);

      // ユーザーのギフトを取得
      const giftsData = await getUserGifts(userId);
      console.log('User gifts loaded:', giftsData);
      setUserGifts(giftsData);
    } catch (error) {
      console.error("Error loading sugoroku data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollComplete = () => {
    setShowDiceRoller(false);
    loadData(); // データを再読み込み
  };

  const handleInitSugoroku = async () => {
    if (!confirm('双六ゲームのギフトとマスデータを初期化しますか？')) return;

    setInitLoading(true);
    try {
      const response = await fetch('/api/admin/init-sugoroku', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        alert(`初期化成功！\nギフト: ${data.giftsCount}個\nマス: ${data.squaresCount}個`);
        loadData(); // データを再読み込み
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      console.error('Init error:', error);
      alert('初期化に失敗しました');
    } finally {
      setInitLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          読み込み中...
        </CardContent>
      </Card>
    );
  }

  if (!progress) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          エラーが発生しました
        </CardContent>
      </Card>
    );
  }

  const myRank = ranking.find(r => r.user_id === userId);

  return (
    <div className="space-y-6">
      {/* 開発用: 初期化ボタン */}
      <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
        <p className="text-sm text-yellow-800 mb-2 font-bold">
          🔧 開発用: 双六データ初期化ボタン
        </p>
        <Button
          onClick={handleInitSugoroku}
          disabled={initLoading}
          variant="outline"
          size="sm"
          className="bg-yellow-100 hover:bg-yellow-200"
        >
          {initLoading ? '初期化中...' : '🎁 ギフト＆マスデータを初期化'}
        </Button>
      </div>

      {/* ヘッダー情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎲 {progress.board.name}</span>
            <Badge variant="outline" className="text-lg">
              {progress.current_position} / {progress.board.total_squares} マス
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">現在のポイント</p>
              <p className="text-2xl font-bold">{currentPoints} pt</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">順位</p>
              <p className="text-2xl font-bold">
                {myRank ? `${myRank.rank}位` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ボード番号</p>
              <p className="text-2xl font-bold">#{progress.board.board_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">進捗</p>
              <p className="text-2xl font-bold">
                {Math.round((progress.current_position / progress.board.total_squares) * 100)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => setShowDiceRoller(true)}
              size="lg"
              className="w-full"
              disabled={showDiceRoller}
            >
              🎲 サイコロ/ルーレットを振る
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* サイコロ/ルーレット */}
      {showDiceRoller && (
        <DiceRoller
          userId={userId}
          familyId={familyId}
          currentPoints={currentPoints}
          onComplete={handleRollComplete}
          onCancel={() => setShowDiceRoller(false)}
        />
      )}

      {/* 双六ボード */}
      <Card className="bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🗺️ 世界の旅</span>
              <span className="text-sm font-normal text-gray-600">
                ～ {progress.board.name} ～
              </span>
            </div>
            <Button
              onClick={() => setShowWorldMap(true)}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-blue-50"
            >
              🌍 ルート地図を見る
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* ジグザグレイアウト */}
            {Array.from({ length: Math.ceil(squares.length / 10) }).map((_, rowIndex) => {
              const startIndex = rowIndex * 10;
              const rowSquares = squares.slice(startIndex, startIndex + 10);
              const isReverse = rowIndex % 2 === 1; // 奇数行は逆順

              return (
                <div key={rowIndex} className="mb-2 relative">
                  <div className="grid grid-cols-10 gap-2 relative">
                    {(isReverse ? [...rowSquares].reverse() : rowSquares).map((square, idx) => (
                      <div key={square.id} className="relative">
                        <SugorokuSquareItem
                          square={square}
                          isCurrentPosition={square.position === progress.current_position}
                          isPassed={square.position < progress.current_position}
                        />
                        {/* 矢印表示（行の最後以外） */}
                        {idx < rowSquares.length - 1 && (
                          <div className="absolute top-1/2 -translate-y-1/2 -right-1 text-blue-500 text-xs z-0">
                            {isReverse ? "←" : "→"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* 行の終わりの下向き矢印 */}
                  {rowIndex < Math.ceil(squares.length / 10) - 1 && (
                    <div className={`absolute -bottom-1 ${isReverse ? 'left-0' : 'right-0'} text-blue-500 text-xs`}>
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 凡例 */}
          <div className="mt-6 p-4 bg-white bg-opacity-80 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">マスの種類：</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gradient-to-br from-pink-300 to-indigo-400 rounded border"></span>
                <span>🎁 ギフト</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded border"></span>
                <span>💰 ボーナス</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gradient-to-br from-green-300 to-emerald-400 rounded border"></span>
                <span>👨‍👩‍👧‍👦 家族</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gradient-to-br from-blue-50 to-sky-100 rounded border"></span>
                <span>🗺️ 名所</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 獲得ギフト */}
      <Card>
        <CardHeader>
          <CardTitle>🎁 獲得したギフト</CardTitle>
        </CardHeader>
        <CardContent>
          {userGifts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {userGifts.map((userGift) => {
                if (!userGift.gift) return null;
                return (
                  <div
                    key={userGift.id}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg text-center"
                  >
                    {userGift.gift.icon_url ? (
                      <img
                        src={userGift.gift.icon_url}
                        alt={userGift.gift.name}
                        className="w-16 h-16 mx-auto mb-2"
                      />
                    ) : (
                      <div className="text-4xl mb-2">🎁</div>
                    )}
                    <p className="font-bold text-sm">{userGift.gift.name}</p>
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${
                        userGift.gift.rarity === "legendary"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                          : userGift.gift.rarity === "rare"
                          ? "bg-blue-100 text-blue-800 border-blue-400"
                          : "bg-gray-100 text-gray-800 border-gray-400"
                      }`}
                    >
                      {userGift.gift.rarity === "legendary"
                        ? "伝説"
                        : userGift.gift.rarity === "rare"
                        ? "レア"
                        : "コモン"}
                    </Badge>
                    {userGift.gift.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {userGift.gift.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-3">🎁</div>
              <p className="text-lg font-semibold mb-2">まだギフトを獲得していません</p>
              <p className="text-sm">双六でギフトマスに止まるとギフトを獲得できます！</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ランキング */}
      {ranking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🏆 家族ランキング</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ranking.map((member) => (
                <div
                  key={member.user_id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    member.user_id === userId ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `${member.rank}位`}
                    </span>
                    {member.avatar_url && (
                      <img
                        src={member.avatar_url}
                        alt={member.user_name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{member.user_name}</p>
                      <p className="text-sm text-gray-500">
                        ボード{member.board_number} - {member.current_position}マス
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{member.total_points} pt</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 世界地図モーダル */}
      <WorldMapModal
        open={showWorldMap}
        onOpenChange={setShowWorldMap}
        currentPosition={progress.current_position}
      />
    </div>
  );
}
