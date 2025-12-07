"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorldMap } from "./world-map";
import { AirportPanel } from "./airport-panel";
import { EmotionPointsDisplay } from "./emotion-points-display";
import { SpotVisitModal } from "./spot-visit-modal";
import { PlayerState, EmotionCategory, TravelProgress, RouteSpace, RouteSpaceType } from "@/lib/types/world-tour";
import { AIRPORTS, getAirportByCode, calculateDistance, distanceToSpaces } from "@/lib/data/airports";
import { getSpotsByAirport } from "@/lib/data/tourist-spots";
import { getRandomQuiz } from "@/lib/data/quiz-pool";
import { getRandomQuestionOnly, getRandomMessageOnly, MessageQuestion } from "@/lib/data/message-questions";
import { getRandomComedy, getComedyTypeLabel, getComedyTypeIcon, ComedyContent } from "@/lib/data/comedy-content";
import { speakText, stopSpeaking } from "@/lib/speech";

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
    "idle" | "setting_destination" | "rolling" | "moving" | "arrived" | "visiting" | "quiz" | "message_event" | "comedy_event"
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

    // ルートスペース（クイズマス、メッセージマス含む）を生成
    const routeSpaces = generateRouteSpaces(player.currentAirport, destinationCode, totalSpaces);

    const travelProgress: TravelProgress = {
      startAirport: player.currentAirport,
      finalDestination: destinationCode,
      totalDistance: distance,
      totalSpaces,
      currentSpace: 0,
      currentPosition: current.coordinates,
      routeSpaces,
    };

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

    setPlayer((prev) => ({
      ...prev,
      destinationAirport: destinationCode,
      travelProgress,
    }));

    setSelectedAirport(null);
    setGamePhase("idle");
    setMessage(`目的地: ${destination.city} (${totalSpaces}マス)${specialInfo} 設定完了！サイコロを振って進みましょう`);
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
  }, [player.travelProgress, player.powerBoosterTickets, activeBoosterTicket]);

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
        setGamePhase("idle");
        setMessage(`${diceResult}マス進みました！残り${totalSpaces - newSpace}マス`);
      }
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
  }, [currentQuiz, selectedAnswer]);

  // クイズを終了
  const closeQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    setGamePhase("idle");
  }, []);

  // メッセージイベントをスキップ
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
    setGamePhase("idle");
  }, []);

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
    setGamePhase("idle");
  }, []);

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
  }, [visitedAttractions]);

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
  }, [visitedFoods]);

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
            <span>✈️ 感動・世界旅ゲーム</span>
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
