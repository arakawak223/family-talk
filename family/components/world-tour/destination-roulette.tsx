'use client';

import { useState, useCallback } from 'react';
import { Airport } from '@/lib/types/world-tour';
import { AIRPORTS } from '@/lib/data/airports';
import { playBGM, stopBGM } from '@/lib/audio/bgm-manager';
import { speakText } from '@/lib/speech';
import { Globe, Plane, MapPin, Sparkles } from 'lucide-react';

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
    <div className="glass-card p-6 md:p-8 relative slide-in-up">
      {/* 背景のパーティクル */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* 装飾的な光 */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

        {/* タイトル */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Globe className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold text-white title-glow">
              {isFinalDestination ? '最終目的地' : '目的地ルーレット'}
            </h2>
            <Plane className="h-8 w-8 text-yellow-400 airplane-flying" />
          </div>
          <p className="text-white/60 text-sm">
            {isFinalDestination
              ? '🏁 スタート地点に戻ってゴール！'
              : `✨ ${availableAirports.length}都市から運命の目的地が選ばれます`}
          </p>
        </div>

        {/* メインルーレット表示 */}
        <div className={`
          relative rounded-2xl p-8 mb-8 text-center overflow-hidden
          ${isSpinning
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400'
            : showResult
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400'
              : 'bg-white/5 border-2 border-white/20'}
          transition-all duration-500
        `}>
          {/* 回転中のオーバーレイエフェクト */}
          {isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent animate-pulse" />
          )}

          {currentAirport ? (
            <div className={`relative z-10 ${isSpinning ? 'roulette-spinning' : showResult ? 'arrival-celebration' : ''}`}>
              {/* アイコン */}
              <div className={`text-8xl mb-4 ${isSpinning ? 'animate-bounce' : ''}`}>
                {currentAirport.icon}
              </div>

              {/* 都市名 */}
              <div className={`text-4xl font-bold mb-2 ${showResult ? 'text-yellow-400 title-glow' : 'text-white'}`}>
                {currentAirport.city}
              </div>

              {/* 国名 */}
              <div className="text-xl text-white/80 mb-2">
                {currentAirport.country}
              </div>

              {/* 空港コード */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-white/60 text-sm">
                <MapPin className="h-4 w-4" />
                {currentAirport.code}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-8xl mb-4 animate-pulse">🌍</div>
              <p className="text-white/60">ルーレットを回して目的地を決めよう！</p>
            </div>
          )}
        </div>

        {/* スロット風サブディスプレイ */}
        {isSpinning && (
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 glass-card-light rounded-xl flex items-center justify-center text-2xl"
                style={{
                  animation: `roulette-spin ${0.3 + i * 0.1}s linear infinite`
                }}
              >
                {AIRPORTS[Math.floor(Math.random() * AIRPORTS.length)]?.icon}
              </div>
            ))}
          </div>
        )}

        {/* 結果バナー */}
        {showResult && selectedAirport && (
          <div className="message-banner mb-8 text-center fade-in">
            <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold text-lg">
              <Sparkles className="h-5 w-5" />
              {isFinalDestination ? 'ゴール地点決定！' : '次の目的地が決定！'}
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="relative">
          {!showResult ? (
            <button
              className={`btn-travel w-full h-16 text-xl font-bold flex items-center justify-center gap-3 ${isSpinning ? 'opacity-80' : ''}`}
              onClick={spin}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <>
                  <span className="animate-spin text-2xl">🎰</span>
                  <span>回転中...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🎲</span>
                  <span>ルーレットを回す！</span>
                </>
              )}
            </button>
          ) : (
            <button
              className="w-full h-16 text-xl font-bold flex items-center justify-center gap-3 rounded-full
                bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600
                text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105"
              onClick={handleConfirm}
            >
              <Plane className="h-6 w-6 airplane-flying" />
              <span>{selectedAirport?.city}へ出発！</span>
              <span className="text-2xl">✈️</span>
            </button>
          )}
        </div>

        {/* 残り都市数 */}
        {!isFinalDestination && (
          <p className="text-center text-white/40 text-sm mt-4">
            🌍 まだ行っていない都市: {availableAirports.length}か所
          </p>
        )}
      </div>
    </div>
  );
}

export type { DestinationRouletteProps };
