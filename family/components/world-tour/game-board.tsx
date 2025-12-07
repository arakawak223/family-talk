"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMap } from "./world-map";
import { AirportPanel } from "./airport-panel";
import { EmotionPointsDisplay } from "./emotion-points-display";
import { SpotVisitModal } from "./spot-visit-modal";
import { DestinationRoulette } from "./destination-roulette";
import { PlayerState, EmotionCategory, TravelProgress, RouteSpace, RouteSpaceType, Airport } from "@/lib/types/world-tour";
import { AIRPORTS, getAirportByCode, calculateDistance, distanceToSpaces } from "@/lib/data/airports";
import { getSpotsByAirport } from "@/lib/data/tourist-spots";
import { getRandomQuiz } from "@/lib/data/quiz-pool";
import { getRandomQuestionOnly, getRandomMessageOnly, MessageQuestion } from "@/lib/data/message-questions";
import { getRandomComedy, getComedyTypeLabel, getComedyTypeIcon, ComedyContent } from "@/lib/data/comedy-content";
import { speakText, stopSpeaking } from "@/lib/speech";
import { playBGM, stopBGM, type BGMScene } from "@/lib/audio/bgm-manager";
import { Player, PLAYER_COLORS } from "@/lib/game/player-manager";

// ゲーム設定
interface GameConfig {
  players: Player[];
  destinationCount: number;
  startAirport: string;
}

interface GameBoardProps {
  userId: string;
  familyId: string;
  gameConfig?: GameConfig | null;
}

// 初期プレイヤー状態
function createInitialPlayer(id: string, name: string, startAirport: string = "NRT"): PlayerState {
  return {
    id,
    name,
    currentAirport: startAirport,
    emotionPoints: {
      total: 0,
      fun: 0,
      joy: 0,
      beauty: 0,
      wonder: 0,
      reflection: 0,
    },
    visitedAirports: [startAirport],
    visitedSpots: [],
    inventory: [],
    turnsPlayed: 0,
    powerBoosterTickets: [],
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

// 空路上のマス情報を生成（クイズマス、メッセージマス、お笑いマス含む）
function generateRouteSpaces(
  startAirport: string,
  endAirport: string,
  totalSpaces: number
): RouteSpace[] {
  const start = getAirportByCode(startAirport);
  const end = getAirportByCode(endAirport);
  if (!start || !end) return [];

  const spaces: RouteSpace[] = [];

  // 空港以外のマスにランダムでイベントマスを配置
  // 2〜3マスごとに1つ特殊マスを配置
  const specialSpaceInterval = 2 + Math.floor(Math.random() * 2); // 2〜3

  // 特殊マスのタイプ順序: quiz → message → comedy → quiz → ...
  const spaceTypes: RouteSpaceType[] = ['quiz', 'message', 'comedy'];

  for (let i = 0; i <= totalSpaces; i++) {
    const progress = i / totalSpaces;
    const position = interpolatePosition(start.coordinates, end.coordinates, progress);

    let type: RouteSpaceType = 'normal';
    let icon = '✈️';

    // 最初と最後のマス（空港）以外にイベントマスを配置
    if (i > 0 && i < totalSpaces) {
      if (i % specialSpaceInterval === 0) {
        // 順番にクイズマス・メッセージマス・お笑いマスを配置
        const typeIndex = (Math.floor(i / specialSpaceInterval) - 1) % spaceTypes.length;
        type = spaceTypes[typeIndex];

        switch (type) {
          case 'quiz':
            icon = '❓';
            break;
          case 'message':
            icon = '✉️';
            break;
          case 'comedy':
            icon = '😂';
            break;
        }
      }
    }

    spaces.push({
      index: i,
      type,
      icon,
      position,
    });
  }

  return spaces;
}


export function GameBoard({ userId, gameConfig }: GameBoardProps) {
  // ゲーム設定からスタート空港を取得
  const startAirport = gameConfig?.startAirport || "NRT";
  const destinationCount = gameConfig?.destinationCount || 5;

  // マルチプレイヤー対応: 全プレイヤーの状態を管理
  const [players, setPlayers] = useState<PlayerState[]>(() => {
    if (gameConfig?.players && gameConfig.players.length > 0) {
      return gameConfig.players.map((p, index) =>
        createInitialPlayer(p.id.toString(), p.nickname || `プレイヤー${index + 1}`, startAirport)
      );
    }
    return [createInitialPlayer(userId, "プレイヤー", startAirport)];
  });

  // 現在のプレイヤーインデックス
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const player = players[currentPlayerIndex];

  // プレイヤー状態を更新するヘルパー関数
  const setPlayer = useCallback((updater: PlayerState | ((prev: PlayerState) => PlayerState)) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      if (typeof updater === 'function') {
        newPlayers[currentPlayerIndex] = updater(newPlayers[currentPlayerIndex]);
      } else {
        newPlayers[currentPlayerIndex] = updater;
      }
      return newPlayers;
    });
  }, [currentPlayerIndex]);

  // 目的地ルーレット表示状態
  const [showRoulette, setShowRoulette] = useState(false);
  const [visitedDestinations, setVisitedDestinations] = useState<string[]>([startAirport]);
  const [isFinalDestination, setIsFinalDestination] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameCompleted, setGameCompleted] = useState(false); // TODO: ゲーム終了機能実装時に使用

  // 共通目的地（全プレイヤーが同じ目的地を目指す）
  const [sharedDestination, setSharedDestination] = useState<{
    airport: string;
    totalSpaces: number;
    routeSpaces: RouteSpace[];
  } | null>(null);

  const [gamePhase, setGamePhase] = useState<
    "idle" | "setting_destination" | "roulette" | "rolling" | "moving" | "arrived" | "visiting" | "quiz" | "message_event" | "comedy_event"
  >("idle");
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [currentSpot, setCurrentSpot] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [currentQuiz, setCurrentQuiz] = useState<ReturnType<typeof getRandomQuiz> | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [visitedAttractions, setVisitedAttractions] = useState<string[]>([]);
  const [visitedFoods, setVisitedFoods] = useState<string[]>([]);
  const [currentMessageQuestion, setCurrentMessageQuestion] = useState<MessageQuestion | null>(null);
  const [currentComedyContent, setCurrentComedyContent] = useState<ComedyContent | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeBoosterTicket, setActiveBoosterTicket] = useState<string | null>(null); // 使用中のチケットID

  // 空路上のマス位置を計算
  const routePositions = useMemo(() => {
    if (!player.travelProgress) return [];
    return calculateRoutePositions(
      player.travelProgress.startAirport,
      player.travelProgress.finalDestination,
      player.travelProgress.totalSpaces
    );
  }, [player.travelProgress]);

  // 目的地設定モード開始（ルーレット表示）
  const startDestinationSelection = useCallback(() => {
    // 最終目的地かどうか判定
    const isLast = visitedDestinations.length >= destinationCount;
    setIsFinalDestination(isLast);
    setShowRoulette(true);
    setGamePhase("roulette");
    playBGM('roulette');
    setMessage(isLast ? "🏁 最終目的地を決定！スタート地点に戻ります" : "🎰 目的地ルーレットを回そう！");
  }, [visitedDestinations.length, destinationCount]);

  // ルーレットで目的地が選ばれた時（全プレイヤーに同じ目的地を設定）
  const handleDestinationSelected = useCallback((airport: Airport) => {
    stopBGM();
    setShowRoulette(false);
    setVisitedDestinations(prev => [...prev, airport.code]);

    // 現在のプレイヤー（最初のプレイヤー）の位置から距離を計算
    const currentPlayer = players[0]; // 最初のプレイヤーの位置を基準に
    const current = getAirportByCode(currentPlayer.currentAirport);
    const destination = getAirportByCode(airport.code);
    if (!current || !destination) return;

    const distance = calculateDistance(current, destination);
    const totalSpaces = distanceToSpaces(distance);
    const routeSpaces = generateRouteSpaces(currentPlayer.currentAirport, airport.code, totalSpaces);

    // 共通目的地を設定
    setSharedDestination({
      airport: airport.code,
      totalSpaces,
      routeSpaces,
    });

    // 全プレイヤーに目的地を設定
    setPlayers(prevPlayers => prevPlayers.map(p => {
      const playerCurrent = getAirportByCode(p.currentAirport);
      if (!playerCurrent) return p;

      const playerDistance = calculateDistance(playerCurrent, destination);
      const playerTotalSpaces = distanceToSpaces(playerDistance);
      const playerRouteSpaces = generateRouteSpaces(p.currentAirport, airport.code, playerTotalSpaces);

      const travelProgress: TravelProgress = {
        startAirport: p.currentAirport,
        finalDestination: airport.code,
        totalDistance: playerDistance,
        totalSpaces: playerTotalSpaces,
        currentSpace: 0,
        currentPosition: playerCurrent.coordinates,
        routeSpaces: playerRouteSpaces,
      };

      return {
        ...p,
        destinationAirport: airport.code,
        travelProgress,
      };
    }));

    // ルートスペースの中で特殊マスがあるか確認
    const quizCount = routeSpaces.filter(s => s.type === 'quiz').length;
    const messageCount = routeSpaces.filter(s => s.type === 'message').length;
    const comedyCount = routeSpaces.filter(s => s.type === 'comedy').length;
    let specialInfo = '';
    if (quizCount > 0 || messageCount > 0 || comedyCount > 0) {
      const parts = [];
      if (quizCount > 0) parts.push(`❓クイズ×${quizCount}`);
      if (messageCount > 0) parts.push(`✉️メッセージ×${messageCount}`);
      if (comedyCount > 0) parts.push(`😂お笑い×${comedyCount}`);
      specialInfo = ` (${parts.join(', ')})`;
    }

    setSelectedAirport(null);
    setGamePhase("idle");
    setMessage(`🎯 全員の目的地: ${destination.city} (${totalSpaces}マス)${specialInfo} サイコロを振って進もう！`);
  }, [players]);

  // 目的地キャンセル（全プレイヤーの目的地をクリア）
  const cancelDestination = useCallback(() => {
    setShowRoulette(false);
    stopBGM();
    setSharedDestination(null);
    setPlayers(prevPlayers => prevPlayers.map(p => ({
      ...p,
      destinationAirport: undefined,
      travelProgress: undefined,
    })));
    setGamePhase("idle");
    setMessage("目的地をキャンセルしました");
  }, []);

  // 次のプレイヤーへ
  const nextPlayer = useCallback(() => {
    if (players.length > 1) {
      const nextIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextIndex);
      const nextPlayerData = players[nextIndex];
      const nextPlayerEmoji = gameConfig?.players?.[nextIndex]?.avatarEmoji || '👤';

      // 次のプレイヤーがまだ目的地に到着していない場合
      if (nextPlayerData.travelProgress && nextPlayerData.travelProgress.currentSpace < nextPlayerData.travelProgress.totalSpaces) {
        setMessage(`🎮 ${nextPlayerEmoji} ${nextPlayerData.name}さんのターンです！サイコロを振ろう！`);
        speakText(`${nextPlayerData.name}さんのターンです。サイコロを振ってください`, { rate: 0.95 });
      } else {
        setMessage(`🎮 ${nextPlayerEmoji} ${nextPlayerData.name}さんのターンです！`);
        speakText(`${nextPlayerData.name}さんのターンです`, { rate: 0.95 });
      }
    }
    setGamePhase("idle");
  }, [players, currentPlayerIndex, gameConfig?.players]);

  // パワーブースター・チケットを使用する
  const activateBoosterTicket = useCallback((ticketId: string) => {
    setActiveBoosterTicket(ticketId);
    const ticket = player.powerBoosterTickets.find(t => t.id === ticketId);
    if (ticket) {
      setMessage(`✨ パワーブースター・チケット（${ticket.multiplier}倍）を使用！サイコロを振ってください`);
      speakText(`パワーブースターチケットを使用しました。サイコロの目が${ticket.multiplier}倍になります。`, { rate: 0.95 });
    }
  }, [player.powerBoosterTickets]);

  // パワーブースター・チケットの使用をキャンセル
  const cancelBoosterTicket = useCallback(() => {
    setActiveBoosterTicket(null);
    setMessage("チケットの使用をキャンセルしました");
  }, []);

  // サイコロを振る
  const rollDice = useCallback(() => {
    if (!player.travelProgress) return;

    setGamePhase("rolling");

    // アクティブなチケットを取得
    const activeTicket = activeBoosterTicket
      ? player.powerBoosterTickets.find(t => t.id === activeBoosterTicket)
      : null;

    setMessage(activeTicket
      ? `✨ パワーブースター発動！（${activeTicket.multiplier}倍）サイコロを振っています...`
      : "サイコロを振っています...");

    // サイコロアニメーション
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        const baseResult = Math.floor(Math.random() * 6) + 1;

        // パワーブースター・チケット適用
        let finalResult = baseResult;
        let bonusMessage = "";
        if (activeTicket) {
          const multiplier = activeTicket.multiplier;
          finalResult = baseResult * multiplier;
          bonusMessage = ` (${baseResult} × ${multiplier}倍 = ${finalResult})`;

          // 使用したチケットを削除
          setPlayer((prev) => ({
            ...prev,
            powerBoosterTickets: prev.powerBoosterTickets.filter(t => t.id !== activeBoosterTicket),
          }));
          setActiveBoosterTicket(null);
        }

        setDiceResult(finalResult);
        setGamePhase("moving");

        const remaining = player.travelProgress!.totalSpaces - player.travelProgress!.currentSpace;
        if (finalResult >= remaining) {
          setMessage(`🎲 ${baseResult}が出ました${bonusMessage}！目的地に到着します！`);
        } else {
          setMessage(`🎲 ${baseResult}が出ました${bonusMessage}！${finalResult}マス進みます`);
        }
      }
    }, 100);
  }, [player.travelProgress, player.powerBoosterTickets, activeBoosterTicket, setPlayer]);

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

      // 到着したプレイヤーの状態を更新し、全員の目的地をクリア
      setPlayers(prevPlayers => prevPlayers.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          // 到着したプレイヤー
          return {
            ...p,
            currentAirport: destination,
            visitedAirports: isNewAirport
              ? [...p.visitedAirports, destination]
              : p.visitedAirports,
            destinationAirport: undefined,
            travelProgress: undefined,
            turnsPlayed: p.turnsPlayed + 1,
            emotionPoints: {
              ...p.emotionPoints,
              total: p.emotionPoints.total + bonusPoints,
              joy: p.emotionPoints.joy + bonusPoints,
            },
          };
        }
        // 他のプレイヤーも目的地をクリア（次の目的地を設定するため）
        return {
          ...p,
          destinationAirport: undefined,
          travelProgress: undefined,
        };
      }));

      // 共通目的地をクリア
      setSharedDestination(null);

      // 最終目的地に到着した場合はゲーム終了
      if (isFinalDestination) {
        playBGM('ending');
        setMessage(`🏆 ゲームクリア！${destinationAirport?.city}（スタート地点）に戻ってきました！お疲れさまでした！`);
        setTimeout(() => {
          setGameCompleted(true);
          setGamePhase("idle");
        }, 2000);
        return;
      }

      const spots = getSpotsByAirport(destination);
      if (spots.length > 0) {
        setGamePhase("visiting");
        setMessage(`🎉 ${destinationAirport?.city}に到着！目的地ボーナス +${bonusPoints}pt！観光スポットを見てから次の目的地へ`);
      } else {
        // 観光スポットなし：次の目的地を設定
        setMessage(`🎉 ${destinationAirport?.city}に到着！目的地ボーナス +${bonusPoints}pt 次の目的地を決めよう！`);
        setTimeout(() => {
          setCurrentPlayerIndex(0); // 最初のプレイヤーに戻す
          setGamePhase("idle");
        }, 2000);
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

      // 止まったマスのタイプをチェック
      const routeSpaces = player.travelProgress.routeSpaces;
      const landedSpace = routeSpaces?.find(s => s.index === newSpace);

      if (landedSpace?.type === 'quiz') {
        // クイズマスに止まった
        const quiz = getRandomQuiz();
        setCurrentQuiz(quiz);
        setSelectedAnswer(null);
        setShowQuizResult(false);
        setGamePhase("quiz");
        setMessage(`❓ クイズマスに止まりました！問題に答えよう`);
      } else if (landedSpace?.type === 'message') {
        // メッセージマスに止まった - ランダムで「ひと言しつもん」か「あなたへのメッセージ」を取得
        const isQuestion = Math.random() < 0.5;
        const messageItem = isQuestion ? getRandomQuestionOnly() : getRandomMessageOnly();
        setCurrentMessageQuestion(messageItem);
        setGamePhase("message_event");

        const typeLabel = messageItem.type === 'question' ? '💬 ひと言しつもん' : '💌 あなたへのメッセージ';
        setMessage(`✉️ メッセージマスに止まりました！${typeLabel}`);

        // 少し遅延してから音声読み上げ（絵文字は自動除去される）
        setTimeout(() => {
          setIsSpeaking(true);
          speakText(messageItem.content, {
            rate: 0.95,
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }, 500);
      } else if (landedSpace?.type === 'comedy') {
        // お笑いマスに止まった
        const comedyContent = getRandomComedy();
        setCurrentComedyContent(comedyContent);
        setGamePhase("comedy_event");

        const typeLabel = getComedyTypeLabel(comedyContent.type);
        setMessage(`😂 お笑いマスに止まりました！${getComedyTypeIcon(comedyContent.type)} ${typeLabel}`);

        // 少し遅延してから音声読み上げ
        setTimeout(() => {
          setIsSpeaking(true);
          // speakTextフィールドがあればそれを使う（昭和ギャグのリアル読み上げ）
          // ボケツッコミの場合は全体を読み上げ
          let textToSpeak = comedyContent.speakText || comedyContent.content;
          if (comedyContent.type === 'boke_tsukkomi' && comedyContent.setup && comedyContent.boke && comedyContent.tsukkomi) {
            textToSpeak = `${comedyContent.setup}。${comedyContent.boke}。${comedyContent.tsukkomi}`;
          }
          speakText(textToSpeak, {
            rate: 0.9, // 少しゆっくりめに
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }, 500);
      } else {
        // 通常マス：次のプレイヤーへ
        setMessage(`${diceResult}マス進みました！残り${totalSpaces - newSpace}マス`);
        // 少し遅延してから次のプレイヤーへ
        setTimeout(() => {
          nextPlayer();
        }, 1500);
      }
    }

    setDiceResult(null);
  }, [player.travelProgress, player.visitedAirports, diceResult, nextPlayer, currentPlayerIndex, setPlayer, isFinalDestination]);

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
      setMessage(`感動ポイント +${points}pt 獲得！次の目的地を決めよう！`);
      // 次の目的地を設定するため、プレイヤー1に戻す
      setTimeout(() => {
        setCurrentPlayerIndex(0);
        setGamePhase("idle");
      }, 1500);
    },
    [currentSpot, setPlayer]
  );

  // スキップして次の目的地へ
  const skipVisit = useCallback(() => {
    setMessage("次の目的地を決めよう！");
    // 次の目的地を設定するため、プレイヤー1に戻す
    setTimeout(() => {
      setCurrentPlayerIndex(0);
      setGamePhase("idle");
    }, 1000);
  }, []);

  // クイズの回答を選択
  const handleQuizAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);

  // クイズの回答を確定
  const confirmQuizAnswer = useCallback(() => {
    if (currentQuiz === null || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    setShowQuizResult(true);

    if (isCorrect) {
      // 正解
      setPlayer((prev) => ({
        ...prev,
        emotionPoints: {
          ...prev.emotionPoints,
          total: prev.emotionPoints.total + currentQuiz.points,
          wonder: prev.emotionPoints.wonder + currentQuiz.points,
        },
      }));
      setMessage(`✅ 正解！ +${currentQuiz.points}pt 獲得！ ${currentQuiz.explanation}`);
    } else {
      // 不正解
      setMessage(`❌ 残念...正解は「${currentQuiz.options[currentQuiz.correctAnswer]}」でした。${currentQuiz.explanation}`);
    }
  }, [currentQuiz, selectedAnswer, setPlayer]);

  // クイズを終了
  const closeQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    // 次のプレイヤーへ
    nextPlayer();
  }, [nextPlayer]);

  // メッセージイベントを完了
  const skipMessageEvent = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      emotionPoints: {
        ...prev.emotionPoints,
        total: prev.emotionPoints.total + 30,
        joy: prev.emotionPoints.joy + 30,
      },
    }));
    setCurrentMessageQuestion(null);
    setMessage("✉️ メッセージマスのボーナス +30pt！");
    // 次のプレイヤーへ
    setTimeout(() => {
      nextPlayer();
    }, 1500);
  }, [nextPlayer, setPlayer]);

  // お笑いイベントを完了
  const completeComedyEvent = useCallback(() => {
    stopSpeaking();
    setPlayer((prev) => ({
      ...prev,
      emotionPoints: {
        ...prev.emotionPoints,
        total: prev.emotionPoints.total + 40,
        fun: prev.emotionPoints.fun + 40,
      },
    }));
    setCurrentComedyContent(null);
    setMessage("😂 お笑いマスのボーナス +40pt！笑いは健康の源！");
    // 次のプレイヤーへ
    setTimeout(() => {
      nextPlayer();
    }, 1500);
  }, [nextPlayer, setPlayer]);

  // 観光名所を訪問（各空港で1つのみ）
  const handleVisitAttraction = useCallback((
    airportCode: string,
    index: number,
    name: string,
    points: number,
    category: EmotionCategory,
    isPowerSpot?: boolean
  ) => {
    // この空港で既に観光名所を訪問済みかチェック
    if (visitedAttractions.some(id => id.startsWith(`${airportCode}-attraction-`))) {
      setMessage("この空港では既に観光名所を訪問済みです");
      return;
    }
    const attractionId = `${airportCode}-attraction-${index}`;
    setVisitedAttractions((prev) => [...prev, attractionId]);

    // パワースポットの場合、パワーブースター・チケットを付与
    if (isPowerSpot) {
      const multiplier = 2 + Math.floor(Math.random() * 2); // 2〜3倍
      const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      setPlayer((prev) => ({
        ...prev,
        emotionPoints: {
          ...prev.emotionPoints,
          total: prev.emotionPoints.total + points,
          [category]: prev.emotionPoints[category] + points,
        },
        powerBoosterTickets: [
          ...prev.powerBoosterTickets,
          {
            id: ticketId,
            multiplier,
            spotName: name,
            obtainedAt: airportCode,
          },
        ],
      }));
      setMessage(`✨ ${name}を訪問！ +${points}pt 獲得！パワーブースター・チケット（${multiplier}倍）をゲット！`);
      // パワースポット効果の音声通知
      speakText(`パワーブースターチケットを獲得しました。サイコロを振る前に使うと、サイコロの目が${multiplier}倍になります。`, { rate: 0.95 });
    } else {
      setPlayer((prev) => ({
        ...prev,
        emotionPoints: {
          ...prev.emotionPoints,
          total: prev.emotionPoints.total + points,
          [category]: prev.emotionPoints[category] + points,
        },
      }));
      setMessage(`🏛️ ${name}を訪問！ +${points}pt 獲得！`);
    }
  }, [visitedAttractions, setPlayer]);

  // ご当地グルメを味わう（各空港で1つのみ）
  const handleVisitFood = useCallback((
    airportCode: string,
    index: number,
    name: string,
    points: number
  ) => {
    // この空港で既にグルメを体験済みかチェック
    if (visitedFoods.some(id => id.startsWith(`${airportCode}-food-`))) {
      setMessage("この空港では既にグルメを体験済みです");
      return;
    }
    const foodId = `${airportCode}-food-${index}`;
    setVisitedFoods((prev) => [...prev, foodId]);
    setPlayer((prev) => ({
      ...prev,
      emotionPoints: {
        ...prev.emotionPoints,
        total: prev.emotionPoints.total + points,
        joy: prev.emotionPoints.joy + points,
      },
    }));
    setMessage(`🍽️ ${name}を味わった！ +${points}pt 獲得！`);
  }, [visitedFoods, setPlayer]);

  const currentAirport = getAirportByCode(player.currentAirport);
  const destinationAirportData = player.destinationAirport ? getAirportByCode(player.destinationAirport) : null;
  const nearbySpots = getSpotsByAirport(player.currentAirport);
  const unvisitedSpots = nearbySpots.filter(
    (spot) => !player.visitedSpots.includes(spot.id)
  );

  // 移動中かどうか（空路上にいる）
  const isInFlight = player.travelProgress && player.travelProgress.currentSpace > 0;

  // ゲームフェーズに応じてBGMを自動切り替え
  useEffect(() => {
    const phaseToScene: Record<string, BGMScene | null> = {
      idle: player.travelProgress ? 'dice_wait' : 'title',
      setting_destination: 'title',
      roulette: 'roulette',
      rolling: 'dice_wait',
      moving: 'flying',
      arrived: 'arrival',
      visiting: 'arrival',
      quiz: 'quiz',
      message_event: 'message',
      comedy_event: 'comedy',
    };

    const scene = phaseToScene[gamePhase];
    if (scene) {
      playBGM(scene);
    }

    // コンポーネントアンマウント時にBGM停止
    return () => {
      // ルーレットフェーズ終了時はBGM停止（handleDestinationSelectedで制御）
    };
  }, [gamePhase, player.travelProgress]);

  // ゲーム完了時のエンディングBGM
  useEffect(() => {
    if (gameCompleted) {
      playBGM('ending');
    }
  }, [gameCompleted]);

  // コンポーネントアンマウント時にBGM停止
  useEffect(() => {
    return () => {
      stopBGM();
    };
  }, []);

  // 現在のプレイヤー色を取得
  const currentPlayerColor = gameConfig?.players?.[currentPlayerIndex]?.color
    ? PLAYER_COLORS.find(c => c.id === gameConfig.players[currentPlayerIndex].color)?.color || '#3B82F6'
    : '#3B82F6';

  return (
    <div className="space-y-4">
      {/* ルーレットモーダル */}
      {showRoulette && (
        <DestinationRoulette
          excludeAirports={visitedDestinations}
          onDestinationSelected={handleDestinationSelected}
          isFinalDestination={isFinalDestination}
          startAirport={startAirport}
        />
      )}

      {/* ゲーム終了・結果発表画面 */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-gradient-to-b from-purple-900/90 to-indigo-900/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            {/* タイトル */}
            <div className="text-center mb-6 animate-bounce">
              <div className="text-7xl mb-2">🎊</div>
              <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">
                🏆 結果発表 🏆
              </h1>
              <p className="text-white/80 mt-2">世界感動旅行ゲーム クリア！</p>
            </div>

            {/* ランキング */}
            <Card className="bg-gradient-to-b from-amber-50 to-yellow-100 border-4 border-yellow-400 shadow-2xl">
              <CardContent className="p-6">
                {/* 順位ごとの表示 */}
                <div className="space-y-4">
                  {[...players]
                    .sort((a, b) => b.emotionPoints.total - a.emotionPoints.total)
                    .map((p, index) => {
                      const playerConfigIndex = players.findIndex(pl => pl.id === p.id);
                      const playerEmoji = gameConfig?.players?.[playerConfigIndex]?.avatarEmoji || '👤';
                      const playerColorId = gameConfig?.players?.[playerConfigIndex]?.color || 'blue';
                      const playerColor = PLAYER_COLORS.find(c => c.id === playerColorId)?.color || '#3B82F6';

                      const rankStyle = index === 0
                        ? 'bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 border-yellow-400 ring-4 ring-yellow-300'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 border-gray-300'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 border-amber-400'
                        : 'bg-white border-gray-200';

                      const rankIcon = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️';
                      const rankText = index === 0 ? '優勝！' : `${index + 1}位`;

                      return (
                        <div
                          key={p.id}
                          className={`p-4 rounded-xl border-2 ${rankStyle} ${index === 0 ? 'scale-105 shadow-lg' : ''} transition-all`}
                        >
                          <div className="flex items-center gap-4">
                            {/* 順位 */}
                            <div className="text-center min-w-[60px]">
                              <div className="text-3xl">{rankIcon}</div>
                              <div className={`text-sm font-bold ${index === 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                {rankText}
                              </div>
                            </div>

                            {/* プレイヤー情報 */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">{playerEmoji}</span>
                                <span
                                  className="text-xl font-bold"
                                  style={{ color: playerColor }}
                                >
                                  {p.name}
                                </span>
                              </div>

                              {/* 感動ポイント詳細 */}
                              <div className="grid grid-cols-5 gap-1 text-xs">
                                <div className="text-center p-1 bg-pink-100 rounded">
                                  <div>😄</div>
                                  <div className="font-medium">{p.emotionPoints.fun}</div>
                                </div>
                                <div className="text-center p-1 bg-yellow-100 rounded">
                                  <div>🎉</div>
                                  <div className="font-medium">{p.emotionPoints.joy}</div>
                                </div>
                                <div className="text-center p-1 bg-purple-100 rounded">
                                  <div>✨</div>
                                  <div className="font-medium">{p.emotionPoints.beauty}</div>
                                </div>
                                <div className="text-center p-1 bg-blue-100 rounded">
                                  <div>🌟</div>
                                  <div className="font-medium">{p.emotionPoints.wonder}</div>
                                </div>
                                <div className="text-center p-1 bg-green-100 rounded">
                                  <div>💭</div>
                                  <div className="font-medium">{p.emotionPoints.reflection}</div>
                                </div>
                              </div>
                            </div>

                            {/* 合計ポイント */}
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${index === 0 ? 'text-yellow-600' : 'text-amber-700'}`}>
                                {p.emotionPoints.total}
                              </div>
                              <div className="text-sm text-gray-500">感動pt</div>
                            </div>
                          </div>

                          {/* 訪問空港数 */}
                          <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                            <span>✈️ 訪問空港: {p.visitedAirports.length}か所</span>
                            <span>🎲 ターン数: {p.turnsPlayed}回</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 旅の思い出 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl border border-sky-300">
                  <h3 className="font-bold text-sky-800 mb-2 flex items-center gap-2">
                    <span>🌍</span> 旅の思い出
                  </h3>
                  <div className="text-sm text-sky-700 space-y-1">
                    <p>📍 訪問した目的地: {visitedDestinations.length - 1}か所</p>
                    <p>🎯 スタート地点: {getAirportByCode(startAirport)?.city}</p>
                    <p>👨‍👩‍👧‍👦 参加人数: {players.length}人</p>
                  </div>
                </div>

                {/* ボタン */}
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-lg py-6"
                  >
                    🔄 もう一度遊ぶ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex-1 border-2 border-gray-300 text-lg py-6"
                  >
                    🏠 ホームに戻る
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* お祝いメッセージ */}
            <div className="text-center mt-6 text-white/90">
              <p className="text-lg">🎉 みんなで楽しい旅ができました！ 🎉</p>
              <p className="text-sm mt-1 text-white/70">また一緒に世界を旅しましょう！</p>
            </div>
          </div>
        </div>
      )}

      {/* プレイヤー一覧（マルチプレイヤー時） */}
      {players.length > 1 && (
        <Card className="border-2" style={{ borderColor: currentPlayerColor }}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              {players.map((p, index) => {
                const isCurrentPlayer = index === currentPlayerIndex;
                const playerColorId = gameConfig?.players?.[index]?.color || 'blue';
                const playerColor = PLAYER_COLORS.find(c => c.id === playerColorId)?.color || '#3B82F6';
                const playerEmoji = gameConfig?.players?.[index]?.avatarEmoji || '👤';

                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isCurrentPlayer
                        ? 'ring-2 ring-offset-2 scale-105'
                        : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: `${playerColor}20`,
                      borderColor: playerColor,
                      ...(isCurrentPlayer ? { ringColor: playerColor } : {})
                    }}
                  >
                    <span className="text-2xl">{playerEmoji}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: playerColor }}>{p.name}</p>
                      <p className="text-xs text-gray-600">{p.emotionPoints.total}pt</p>
                    </div>
                    {isCurrentPlayer && <span className="text-xs">🎮</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ヘッダー */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>✈️ 感動・世界旅ゲーム</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                目的地 {visitedDestinations.length - 1}/{destinationCount}
              </Badge>
              <Badge variant="outline" className="text-lg">
                ターン {player.turnsPlayed + 1}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 現在のプレイヤー（単独プレイ時も表示） */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${currentPlayerColor}20` }}>
              <span className="text-2xl">{gameConfig?.players?.[currentPlayerIndex]?.avatarEmoji || '👤'}</span>
              <div>
                <p className="text-sm text-gray-500">現在のプレイヤー</p>
                <p className="font-bold" style={{ color: currentPlayerColor }}>{player.name}</p>
              </div>
            </div>

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

            {/* パワーブースター・チケット表示 */}
            {player.powerBoosterTickets.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-300">
                <span className="text-2xl">🎫</span>
                <div>
                  <p className="text-sm text-yellow-700 font-medium">パワーブースター</p>
                  <div className="flex gap-1">
                    {player.powerBoosterTickets.map((ticket) => (
                      <Badge key={ticket.id} className="bg-amber-500 text-white">
                        {ticket.multiplier}倍
                      </Badge>
                    ))}
                  </div>
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
                      {/* ルートマス表示（クイズマス・メッセージマス含む） */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {player.travelProgress.routeSpaces?.map((space, i) => {
                          const isPassed = i < player.travelProgress!.currentSpace;
                          const isCurrent = i === player.travelProgress!.currentSpace;
                          const isDestination = i === player.travelProgress!.totalSpaces;
                          const isStart = i === 0;

                          let bgColor = "bg-sky-100 border-sky-300";
                          const textClass = "text-xs";

                          if (isCurrent) {
                            bgColor = "bg-yellow-300 border-yellow-500 animate-pulse";
                          } else if (isPassed) {
                            bgColor = "bg-sky-400 border-sky-500";
                          } else if (space.type === 'quiz') {
                            bgColor = "bg-purple-100 border-purple-400";
                          } else if (space.type === 'message') {
                            bgColor = "bg-green-100 border-green-400";
                          } else if (space.type === 'comedy') {
                            bgColor = "bg-orange-100 border-orange-400";
                          }

                          let icon = space.icon;
                          if (isStart) {
                            icon = getAirportByCode(player.travelProgress!.startAirport)?.icon || "🛫";
                          } else if (isDestination) {
                            icon = destinationAirportData?.icon || "🛬";
                          }

                          return (
                            <div
                              key={i}
                              className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${bgColor} flex items-center justify-center ${textClass}`}
                              title={
                                isStart ? "出発" :
                                isDestination ? "目的地" :
                                space.type === 'quiz' ? "クイズマス" :
                                space.type === 'message' ? "メッセージマス" :
                                space.type === 'comedy' ? "お笑いマス" :
                                `${i}マス目`
                              }
                            >
                              {icon}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-sky-600 mt-2">
                        <span>出発</span>
                        <span>残り {player.travelProgress.totalSpaces - player.travelProgress.currentSpace}マス</span>
                        <span>到着</span>
                      </div>
                    </div>

                    {/* パワーブースター・チケット使用UI */}
                    {player.powerBoosterTickets.length > 0 && !activeBoosterTicket && (
                      <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-300">
                        <p className="text-sm text-yellow-700 font-medium mb-2">🎫 パワーブースター・チケットを使う？</p>
                        <div className="flex flex-wrap gap-2">
                          {player.powerBoosterTickets.map((ticket) => (
                            <Button
                              key={ticket.id}
                              variant="outline"
                              size="sm"
                              className="border-amber-400 text-amber-700 hover:bg-amber-100"
                              onClick={() => activateBoosterTicket(ticket.id)}
                            >
                              ✨ {ticket.multiplier}倍チケット
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">使用するとサイコロの目が倍になります</p>
                      </div>
                    )}

                    {/* チケット使用中の表示 */}
                    {activeBoosterTicket && (
                      <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border-2 border-amber-400 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">✨</span>
                            <div>
                              <p className="font-bold text-amber-700">パワーブースター発動中！</p>
                              <p className="text-sm text-amber-600">
                                {player.powerBoosterTickets.find(t => t.id === activeBoosterTicket)?.multiplier}倍
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500"
                            onClick={cancelBoosterTicket}
                          >
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={rollDice}
                      size="lg"
                      className={`w-full text-xl py-6 ${
                        activeBoosterTicket
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                          : "bg-sky-600 hover:bg-sky-700"
                      }`}
                    >
                      {activeBoosterTicket ? "✨🎲 パワーブースターでサイコロを振る！" : "🎲 サイコロを振る"}
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
                    {/* ルーレットボタンはプレイヤー1のみ、かつ共通目的地がない時のみ */}
                    {currentPlayerIndex === 0 && !sharedDestination ? (
                      <>
                        <Button
                          onClick={startDestinationSelection}
                          size="lg"
                          className="w-full text-xl py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          🎰 目的地ルーレットを回す！
                        </Button>
                        <p className="text-sm text-gray-500 text-center">
                          ルーレットで次の目的地を決めよう！
                          {visitedDestinations.length >= destinationCount && (
                            <span className="block text-amber-600 font-medium mt-1">
                              🏁 次が最終目的地！スタート地点に戻ります
                            </span>
                          )}
                        </p>
                      </>
                    ) : (
                      <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-gray-600">
                          {sharedDestination
                            ? `🎯 目的地: ${getAirportByCode(sharedDestination.airport)?.city} に向かおう！`
                            : "プレイヤー1が目的地を決めるのを待っています..."}
                        </p>
                      </div>
                    )}
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

            {/* クイズマス */}
            {gamePhase === "quiz" && currentQuiz && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">❓</span>
                    <p className="font-bold text-purple-800">クイズに挑戦！</p>
                    <Badge className="ml-auto bg-purple-600">{currentQuiz.points}pt</Badge>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-4">{currentQuiz.question}</p>

                  {!showQuizResult ? (
                    <>
                      <div className="space-y-2">
                        {currentQuiz.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              selectedAnswer === index
                                ? "bg-purple-200 border-2 border-purple-500"
                                : "bg-white border-2 border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{" "}
                            {option}
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={confirmQuizAnswer}
                        disabled={selectedAnswer === null}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                      >
                        回答を確定
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg ${
                        selectedAnswer === currentQuiz.correctAnswer
                          ? "bg-green-100 border-2 border-green-400"
                          : "bg-red-100 border-2 border-red-400"
                      }`}>
                        {selectedAnswer === currentQuiz.correctAnswer ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <span className="text-2xl">🎉</span>
                            <p className="font-bold">正解！ +{currentQuiz.points}pt</p>
                          </div>
                        ) : (
                          <div className="text-red-700">
                            <p className="font-bold flex items-center gap-2">
                              <span className="text-2xl">😢</span>
                              残念...不正解
                            </p>
                            <p className="text-sm mt-1">
                              正解: {currentQuiz.options[currentQuiz.correctAnswer]}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-bold">解説:</span> {currentQuiz.explanation}
                        </p>
                      </div>
                      <Button onClick={closeQuiz} className="w-full">
                        次へ進む
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* メッセージマス */}
            {gamePhase === "message_event" && currentMessageQuestion && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  currentMessageQuestion.type === 'question'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-pink-50 border-pink-300'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">
                      {currentMessageQuestion.type === 'question' ? '💬' : '💌'}
                    </span>
                    <p className={`font-bold ${
                      currentMessageQuestion.type === 'question' ? 'text-green-800' : 'text-pink-800'
                    }`}>
                      {currentMessageQuestion.type === 'question' ? 'ひと言しつもん' : 'あなたへのメッセージ'}
                    </p>
                    <Badge className={`ml-auto ${
                      currentMessageQuestion.type === 'question' ? 'bg-green-600' : 'bg-pink-600'
                    }`}>30pt</Badge>
                  </div>

                  {/* メッセージ表示エリア */}
                  <div className={`p-4 bg-white rounded-lg border-2 mb-4 transition-all ${
                    isSpeaking
                      ? currentMessageQuestion.type === 'question'
                        ? "border-green-500 shadow-lg animate-pulse"
                        : "border-pink-500 shadow-lg animate-pulse"
                      : currentMessageQuestion.type === 'question'
                        ? "border-green-200"
                        : "border-pink-200"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{currentMessageQuestion.icon}</span>
                      {isSpeaking && (
                        <span className="text-2xl animate-bounce">🔊</span>
                      )}
                    </div>
                    <p className={`text-xl font-bold ${
                      currentMessageQuestion.type === 'question' ? 'text-green-800' : 'text-pink-800'
                    }`}>
                      {currentMessageQuestion.content}
                    </p>
                  </div>

                  {currentMessageQuestion.type === 'question' && (
                    <p className="text-gray-600 text-sm mb-4">
                      質問に声に出して答えてみよう！
                    </p>
                  )}

                  <div className="space-y-2">
                    <Button
                      className={`w-full ${
                        currentMessageQuestion.type === 'question'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-pink-600 hover:bg-pink-700'
                      }`}
                      disabled={isSpeaking}
                      onClick={() => {
                        setIsSpeaking(true);
                        speakText(currentMessageQuestion.content, {
                          rate: 0.95,
                          onEnd: () => setIsSpeaking(false),
                          onError: () => setIsSpeaking(false),
                        });
                      }}
                    >
                      {isSpeaking ? "読み上げ中..." : "🔊 もう一度読み上げる"}
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full ${
                        currentMessageQuestion.type === 'question'
                          ? 'border-green-400 text-green-700 hover:bg-green-50'
                          : 'border-pink-400 text-pink-700 hover:bg-pink-50'
                      }`}
                      onClick={() => {
                        stopSpeaking();
                        skipMessageEvent();
                      }}
                    >
                      {currentMessageQuestion.type === 'question'
                        ? '答えたよ！次へ進む（+30pt）'
                        : 'ありがとう！次へ進む（+30pt）'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* お笑いマス */}
            {gamePhase === "comedy_event" && currentComedyContent && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border-2 bg-yellow-50 border-yellow-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">😂</span>
                    <p className="font-bold text-yellow-800">
                      {getComedyTypeIcon(currentComedyContent.type)} {getComedyTypeLabel(currentComedyContent.type)}
                    </p>
                    <Badge className="ml-auto bg-yellow-600">40pt</Badge>
                  </div>

                  {/* コンテンツ表示エリア */}
                  <div className={`p-4 bg-white rounded-lg border-2 mb-4 transition-all ${
                    isSpeaking
                      ? "border-yellow-500 shadow-lg animate-pulse"
                      : "border-yellow-200"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{currentComedyContent.icon}</span>
                      {isSpeaking && (
                        <span className="text-2xl animate-bounce">🔊</span>
                      )}
                    </div>

                    {/* 昭和ギャグ・平成ギャグ・令和ギャグ */}
                    {(currentComedyContent.type === 'showa_gag' || currentComedyContent.type === 'heisei_gag' || currentComedyContent.type === 'reiwa_gag') && (
                      <div>
                        <p className="text-2xl font-bold text-yellow-800 mb-2">
                          「{currentComedyContent.content}」
                        </p>
                        {currentComedyContent.performer && (
                          <p className="text-gray-600">
                            — {currentComedyContent.performer}
                          </p>
                        )}
                        {currentComedyContent.hint && (
                          <p className="text-sm text-gray-500 mt-2">
                            💡 {currentComedyContent.hint}
                          </p>
                        )}
                      </div>
                    )}

                    {/* ボケとツッコミ */}
                    {currentComedyContent.type === 'boke_tsukkomi' && (
                      <div className="space-y-3">
                        {currentComedyContent.setup && (
                          <p className="text-gray-600 italic">
                            🎬 {currentComedyContent.setup}
                          </p>
                        )}
                        {currentComedyContent.boke && (
                          <p className="text-lg text-yellow-800">
                            {currentComedyContent.boke}
                          </p>
                        )}
                        {currentComedyContent.tsukkomi && (
                          <p className="text-xl font-bold text-red-600">
                            {currentComedyContent.tsukkomi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    声に出してやってみよう！家族みんなで笑おう！
                  </p>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      disabled={isSpeaking}
                      onClick={() => {
                        setIsSpeaking(true);
                        // speakTextフィールドがあればそれを使う（ギャグのリアル読み上げ）
                        let textToSpeak = currentComedyContent.speakText || currentComedyContent.content;
                        if (currentComedyContent.type === 'boke_tsukkomi' && currentComedyContent.setup && currentComedyContent.boke && currentComedyContent.tsukkomi) {
                          textToSpeak = `${currentComedyContent.setup}。${currentComedyContent.boke}。${currentComedyContent.tsukkomi}`;
                        }
                        speakText(textToSpeak, {
                          rate: 0.9, // 少しゆっくりめに
                          onEnd: () => setIsSpeaking(false),
                          onError: () => setIsSpeaking(false),
                        });
                      }}
                    >
                      {isSpeaking ? "読み上げ中..." : "🔊 もう一度読み上げる"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                      onClick={completeComedyEvent}
                    >
                      笑った！次へ進む（+40pt）
                    </Button>
                  </div>
                </div>
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
          visitedAttractions={visitedAttractions}
          visitedFoods={visitedFoods}
          onVisitAttraction={handleVisitAttraction}
          onVisitFood={handleVisitFood}
          canInteract={!selectedAirport && !player.destinationAirport && !isInFlight}
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
