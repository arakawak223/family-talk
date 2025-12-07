'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Airport } from '@/lib/types/world-tour';
import { AIRPORTS } from '@/lib/data/world-tour-data';
import { playBGM, stopBGM } from '@/lib/audio/bgm-manager';
import { speakText } from '@/lib/speech';

interface DestinationRouletteProps {
  excludeAirports: string[];  // 除外する空港コード（スタート地点、既訪問地）
  onDestinationSelected: (airport: Airport) => void;
  isFinalDestination?: boolean;  // 最終目的地（スタート地点に戻る）かどうか
  startAirport?: string;  // スタート地点（最終目的地用）
}

export function DestinationRoulette({
  excludeAirports,
  onDestinationSelected,
  isFinalDestination = false,
  startAirport
}: DestinationRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAirport, setCurrentAirport] = useState<Airport | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 選択可能な空港リスト
  const availableAirports = AIRPORTS.filter(
    (airport: Airport) => !excludeAirports.includes(airport.code)
  );

  // 最終目的地の場合はスタート地点を返す
  const getFinalDestination = useCallback(() => {
    if (isFinalDestination && startAirport) {
      return AIRPORTS.find((a: Airport) => a.code === startAirport) || null;
    }
    return null;
  }, [isFinalDestination, startAirport]);

  // ルーレットを回す
  const spin = async () => {
    if (isFinalDestination) {
      // 最終目的地の場合は演出だけしてスタート地点に戻る
      const finalDest = getFinalDestination();
      if (finalDest) {
        setIsSpinning(true);
        playBGM('roulette');

        // 短い演出
        let speed = 50;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          if (elapsed < duration) {
            const randomIndex = Math.floor(Math.random() * AIRPORTS.length);
            setCurrentAirport(AIRPORTS[randomIndex]);
            speed = 50 + (elapsed / duration) * 200;
            setTimeout(animate, speed);
          } else {
            setCurrentAirport(finalDest);
            setSelectedAirport(finalDest);
            setIsSpinning(false);
            setShowResult(true);
            stopBGM();
            // 結果を読み上げ
            speakText(`最終目的地は、${finalDest.city}です！スタート地点に戻りましょう！`);
          }
        };
        animate();
      }
      return;
    }

    if (availableAirports.length === 0) {
      console.warn('No available airports for roulette');
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    playBGM('roulette');

    // ルーレット演出
    let speed = 50;
    const duration = 3000; // 3秒間回す
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        // ランダムに空港を表示
        const randomIndex = Math.floor(Math.random() * availableAirports.length);
        setCurrentAirport(availableAirports[randomIndex]);

        // 徐々にスピードを落とす
        speed = 50 + (elapsed / duration) * 300;
        setTimeout(animate, speed);
      } else {
        // 最終選択
        const finalIndex = Math.floor(Math.random() * availableAirports.length);
        const selected = availableAirports[finalIndex];
        setCurrentAirport(selected);
        setSelectedAirport(selected);
        setIsSpinning(false);
        setShowResult(true);
        stopBGM();

        // 結果を読み上げ
        speakText(`次の目的地は、${selected.country}の${selected.city}です！`);
      }
    };

    animate();
  };

  // 決定ボタン
  const handleConfirm = () => {
    if (selectedAirport) {
      onDestinationSelected(selectedAirport);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-gradient-to-b from-purple-900 to-indigo-900 text-white border-2 border-yellow-400">
        <CardContent className="p-6">
          {/* タイトル */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isFinalDestination ? '🏁 最終目的地 🏁' : '🎰 目的地ルーレット 🎰'}
            </h2>
            <p className="text-purple-200 text-sm">
              {isFinalDestination
                ? 'スタート地点に戻ります！'
                : `残り ${availableAirports.length} か所から選ばれます`}
            </p>
          </div>

          {/* ルーレット表示 */}
          <div className={`
            bg-black/40 rounded-xl p-8 mb-6 text-center
            border-4 ${isSpinning ? 'border-yellow-400 animate-pulse' : 'border-purple-500'}
          `}>
            {currentAirport ? (
              <div className={`transition-all ${isSpinning ? 'animate-bounce' : ''}`}>
                <div className="text-6xl mb-4">{currentAirport.icon}</div>
                <div className="text-3xl font-bold mb-2">{currentAirport.city}</div>
                <div className="text-xl text-purple-200">{currentAirport.country}</div>
                <div className="text-sm text-purple-300 mt-2">({currentAirport.code})</div>
              </div>
            ) : (
              <div className="text-6xl animate-pulse">❓</div>
            )}
          </div>

          {/* スロット風の演出（サイドに小さく表示） */}
          {isSpinning && (
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center text-2xl animate-spin"
                  style={{ animationDuration: `${0.5 + i * 0.2}s` }}
                >
                  {AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)]?.icon}
                </div>
              ))}
            </div>
          )}

          {/* 結果表示 */}
          {showResult && selectedAirport && (
            <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mb-6 text-center">
              <div className="text-yellow-400 font-bold text-lg mb-1">
                {isFinalDestination ? '🏁 ゴール地点決定！' : '✨ 次の目的地が決定！'}
              </div>
              <div className="text-white">
                <span className="text-2xl mr-2">{selectedAirport.icon}</span>
                <span className="font-bold">{selectedAirport.city}</span>
                （{selectedAirport.country}）
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3">
            {!showResult ? (
              <Button
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                onClick={spin}
                disabled={isSpinning}
              >
                {isSpinning ? (
                  <>
                    <span className="animate-spin mr-2">🎰</span>
                    回転中...
                  </>
                ) : (
                  <>
                    🎲 ルーレットを回す！
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={handleConfirm}
              >
                ✈️ {selectedAirport?.city}へ出発！
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
