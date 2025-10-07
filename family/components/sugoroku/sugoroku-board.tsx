"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SugorokuSquare,
  UserBoardProgressWithBoard,
  FamilyRanking,
} from "@/lib/types/sugoroku";
import {
  getUserProgress,
  getBoardSquares,
  getFamilyRanking,
} from "@/lib/api/sugoroku";
import { getUserPoints } from "@/lib/api/points";
import { SugorokuSquareItem } from "./sugoroku-square";
import { DiceRoller } from "./dice-roller";

interface SugorokuBoardProps {
  userId: string;
  familyId: string;
}

export function SugorokuBoard({ userId, familyId }: SugorokuBoardProps) {
  const [progress, setProgress] = useState<UserBoardProgressWithBoard | null>(null);
  const [squares, setSquares] = useState<SugorokuSquare[]>([]);
  const [ranking, setRanking] = useState<FamilyRanking[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDiceRoller, setShowDiceRoller] = useState(false);

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
      <Card>
        <CardHeader>
          <CardTitle>🗺️ ボード</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {squares.map((square) => (
              <SugorokuSquareItem
                key={square.id}
                square={square}
                isCurrentPosition={square.position === progress.current_position}
                isPassed={square.position < progress.current_position}
              />
            ))}
          </div>
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
    </div>
  );
}
