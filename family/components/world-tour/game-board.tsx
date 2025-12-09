"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { speakText, speakWithEmotion, stopSpeaking, type EmotionType } from "@/lib/speech";
import { playBGM, stopBGM, type BGMScene } from "@/lib/audio/bgm-manager";
import { playDiceStepSound } from "@/lib/audio/tone-generator";
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
    "idle" | "setting_destination" | "roulette" | "rolling" | "moving" | "arrived" | "visiting" | "quiz" | "message_event" | "comedy_event" | "spot_selection"
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
  const [showTicketTransfer, setShowTicketTransfer] = useState(false); // チケット譲渡モーダル
  const [selectedTicketForTransfer, setSelectedTicketForTransfer] = useState<string | null>(null); // 譲渡対象チケットID

  // 到着管理の状態
  const [firstArrivalPlayerIndex, setFirstArrivalPlayerIndex] = useState<number | null>(null); // 最初に到着したプレイヤー
  const [arrivedPlayers, setArrivedPlayers] = useState<number[]>([]); // 到着済みプレイヤーのインデックス
  const [pendingSpotSelection, setPendingSpotSelection] = useState(false); // 名所・グルメ選択待ち
  const [currentDestinationDistance, setCurrentDestinationDistance] = useState<number>(0); // 現在の目的地への距離
  const [playerSelectedSpots, setPlayerSelectedSpots] = useState<Map<number, string[]>>(new Map()); // プレイヤーごとの選択済みスポット（空港コード単位）

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

  // ルーレットで目的地が選ばれた時
  // - 初回または全員到着後：全プレイヤーに新しい目的地を設定
  // - 最初の到着者が先に進む場合：到着済みプレイヤーのみ新しい目的地を設定
  const handleDestinationSelected = useCallback((airport: Airport) => {
    stopBGM();
    setShowRoulette(false);
    setVisitedDestinations(prev => [...prev, airport.code]);

    // 現在のプレイヤーの位置から距離を計算
    const currentPlayer = players[currentPlayerIndex];
    const current = getAirportByCode(currentPlayer.currentAirport);
    const destination = getAirportByCode(airport.code);
    if (!current || !destination) return;

    const distance = calculateDistance(current, destination);
    const totalSpaces = distanceToSpaces(distance);
    const routeSpaces = generateRouteSpaces(currentPlayer.currentAirport, airport.code, totalSpaces);

    // 共通目的地を更新
    setSharedDestination({
      airport: airport.code,
      totalSpaces,
      routeSpaces,
    });

    // プレイヤーに目的地を設定（到着済み or 初回のみ）
    setPlayers(prevPlayers => prevPlayers.map((p, idx) => {
      // まだ前の目的地に向かっているプレイヤーはそのまま
      if (p.travelProgress && p.travelProgress.currentSpace < p.travelProgress.totalSpaces) {
        return p;
      }

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

    // 到着状態をリセット（新しい目的地への出発準備）
    // firstArrivalPlayerIndexはリセットしない（後続プレイヤーの判定に必要）
    // 全員が次の目的地に向けて出発したらリセットする
    setArrivedPlayers([]);
    setPendingSpotSelection(false);
    setCurrentDestinationDistance(distance);
    setPlayerSelectedSpots(new Map()); // 新しい目的地なのでプレイヤーごとの選択もリセット

    setSelectedAirport(null);
    setGamePhase("idle");
    setMessage(`🎯 次の目的地: ${destination.city} (${totalSpaces}マス)${specialInfo} サイコロを振って進もう！`);
  }, [players, currentPlayerIndex]);

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

  // 後続プレイヤーを共通目的地に向かわせる
  const setPlayerToSharedDestination = useCallback(() => {
    if (!sharedDestination) return;

    const destination = getAirportByCode(sharedDestination.airport);
    const playerCurrent = getAirportByCode(players[currentPlayerIndex].currentAirport);

    if (!destination || !playerCurrent) return;

    const playerDistance = calculateDistance(playerCurrent, destination);
    const playerTotalSpaces = distanceToSpaces(playerDistance);
    const playerRouteSpaces = generateRouteSpaces(players[currentPlayerIndex].currentAirport, sharedDestination.airport, playerTotalSpaces);

    // このプレイヤーの目的地を更新
    setPlayers(prevPlayers => prevPlayers.map((p, idx) => {
      if (idx !== currentPlayerIndex) return p;

      const travelProgress: TravelProgress = {
        startAirport: p.currentAirport,
        finalDestination: sharedDestination.airport,
        totalDistance: playerDistance,
        totalSpaces: playerTotalSpaces,
        currentSpace: 0,
        currentPosition: playerCurrent.coordinates,
        routeSpaces: playerRouteSpaces,
      };

      return {
        ...p,
        destinationAirport: sharedDestination.airport,
        travelProgress,
      };
    }));

    // ルートスペースの中で特殊マスがあるか確認
    const quizCount = playerRouteSpaces.filter(s => s.type === 'quiz').length;
    const messageCount = playerRouteSpaces.filter(s => s.type === 'message').length;
    const comedyCount = playerRouteSpaces.filter(s => s.type === 'comedy').length;
    let specialInfo = '';
    if (quizCount > 0 || messageCount > 0 || comedyCount > 0) {
      const parts = [];
      if (quizCount > 0) parts.push(`❓クイズ×${quizCount}`);
      if (messageCount > 0) parts.push(`✉️メッセージ×${messageCount}`);
      if (comedyCount > 0) parts.push(`😂お笑い×${comedyCount}`);
      specialInfo = ` (${parts.join(', ')})`;
    }

    // 全員が次の目的地に向けて出発したかチェック
    // 現在のプレイヤーを除いて、全員がtravelProgressを持っているか確認
    const allOthersHaveTravelProgress = players.every((p, idx) =>
      idx === currentPlayerIndex || (p.travelProgress && p.travelProgress.currentSpace < p.travelProgress.totalSpaces)
    );
    if (allOthersHaveTravelProgress) {
      // 全員出発したのでfirstArrivalPlayerIndexをリセット
      setFirstArrivalPlayerIndex(null);
    }

    setMessage(`🎯 ${destination.city}へ出発！(${playerTotalSpaces}マス)${specialInfo} サイコロを振って進もう！`);
  }, [sharedDestination, players, currentPlayerIndex]);

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

  // チケット譲渡機能
  const transferTicket = useCallback((ticketId: string, toPlayerIndex: number) => {
    if (toPlayerIndex === currentPlayerIndex || toPlayerIndex < 0 || toPlayerIndex >= players.length) return;

    const ticket = player.powerBoosterTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // 譲渡元からチケットを削除し、200ptを追加
    // 譲渡先にチケットを追加
    setPlayers(prevPlayers => prevPlayers.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        // 譲渡元：チケット削除、200pt獲得
        return {
          ...p,
          powerBoosterTickets: p.powerBoosterTickets.filter(t => t.id !== ticketId),
          emotionPoints: {
            ...p.emotionPoints,
            total: p.emotionPoints.total + 200,
            joy: p.emotionPoints.joy + 200,
          },
        };
      } else if (idx === toPlayerIndex) {
        // 譲渡先：チケット追加
        return {
          ...p,
          powerBoosterTickets: [...p.powerBoosterTickets, ticket],
        };
      }
      return p;
    }));

    const toPlayerName = players[toPlayerIndex].name;
    const toPlayerEmoji = gameConfig?.players?.[toPlayerIndex]?.avatarEmoji || '👤';
    setShowTicketTransfer(false);
    setSelectedTicketForTransfer(null);
    setMessage(`🎁 ${toPlayerEmoji} ${toPlayerName}さんにチケットを譲渡しました！感動ポイント +200pt`);
    speakText(`${toPlayerName}さんにチケットを譲渡しました。感動ポイント200ポイント獲得！`, { rate: 0.95 });
  }, [currentPlayerIndex, players, player.powerBoosterTickets, gameConfig?.players]);

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
  const confirmMove = useCallback(async () => {
    if (!player.travelProgress || diceResult === null) return;

    const currentSpace = player.travelProgress.currentSpace;
    const totalSpaces = player.travelProgress.totalSpaces;
    const actualMove = Math.min(diceResult, totalSpaces - currentSpace); // 実際に進むマス数
    const newSpace = currentSpace + actualMove;
    const isArrived = newSpace >= totalSpaces;

    // 新しい位置を計算
    const routeStartAirport = getAirportByCode(player.travelProgress.startAirport);
    const destAirport = getAirportByCode(player.travelProgress.finalDestination);
    if (!routeStartAirport || !destAirport) return;

    // マス数に応じて「トン・トン・トン」効果音を再生
    setMessage(`🎲 ${actualMove}マス進みます... トン♪`);
    await playDiceStepSound(actualMove);

    const progress = newSpace / totalSpaces;
    const newPosition = interpolatePosition(
      routeStartAirport.coordinates,
      destAirport.coordinates,
      progress
    );

    if (isArrived) {
      // 目的地到着
      const destination = player.travelProgress.finalDestination;
      const destinationAirport = getAirportByCode(destination);
      const isNewAirport = !player.visitedAirports.includes(destination);

      // 最初の到着者かどうか判定
      const isFirstArrival = firstArrivalPlayerIndex === null;

      // 距離に応じたボーナスポイント計算（最初の到着者のみ）
      // 基本: 50pt + 距離ボーナス（1000kmごとに10pt、最大200pt）+ 新規空港ボーナス50pt
      let arrivalBonus = 0;
      if (isFirstArrival) {
        const distanceBonus = Math.min(Math.floor(currentDestinationDistance / 1000) * 10, 200);
        arrivalBonus = 50 + distanceBonus + (isNewAirport ? 50 : 0);
      }

      // 到着したプレイヤーの状態を更新（他のプレイヤーは現在地維持）
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
            emotionPoints: isFirstArrival ? {
              ...p.emotionPoints,
              total: p.emotionPoints.total + arrivalBonus,
              joy: p.emotionPoints.joy + arrivalBonus,
            } : p.emotionPoints,
          };
        }
        // 他のプレイヤーはそのまま維持
        return p;
      }));

      // 到着状態を更新
      if (isFirstArrival) {
        setFirstArrivalPlayerIndex(currentPlayerIndex);
      }
      setArrivedPlayers(prev => [...prev, currentPlayerIndex]);

      // 最終目的地に到着した場合はゲーム終了
      // ただし、実際に最終目的地（sharedDestinationの目的地）に到着した場合のみ
      const isActualFinalDestination = isFinalDestination && sharedDestination && destination === sharedDestination.airport;
      if (isActualFinalDestination) {
        playBGM('ending');
        setMessage(`🏆 ゲームクリア！${destinationAirport?.city}（スタート地点）に戻ってきました！お疲れさまでした！`);
        setTimeout(() => {
          setGameCompleted(true);
          setGamePhase("idle");
        }, 2000);
        return;
      }

      // スタート地点でなければ名所・グルメ選択待ちフラグを立てる
      const isAtStartAirport = destination === startAirport;

      // ファンファーレと到着メッセージ
      if (isFirstArrival) {
        playBGM('arrival');
        if (isAtStartAirport) {
          setMessage(`🎉 ${destinationAirport?.city}に最初に到着！🏆 到着ボーナス +${arrivalBonus}pt！`);
        } else {
          setMessage(`🎉 ${destinationAirport?.city}に最初に到着！🏆 到着ボーナス +${arrivalBonus}pt！名所かグルメを1つ選ぼう！`);
        }
      } else {
        if (isAtStartAirport) {
          setMessage(`✈️ ${destinationAirport?.city}に到着！`);
        } else {
          setMessage(`✈️ ${destinationAirport?.city}に到着！名所かグルメを1つ選んでポイントを獲得しよう！`);
        }
      }

      // スタート地点でなければ名所・グルメ選択画面へ
      if (!isAtStartAirport) {
        setPendingSpotSelection(true);
        setGamePhase("arrived");
      } else {
        // スタート地点の場合は次のプレイヤーへ or 次の目的地へ
        const otherPlayersStillTraveling = players.some((p, idx) =>
          idx !== currentPlayerIndex && p.travelProgress && p.travelProgress.currentSpace < p.travelProgress.totalSpaces
        );
        if (otherPlayersStillTraveling) {
          setTimeout(() => nextPlayer(), 2000);
        } else {
          setSharedDestination(null);
          setTimeout(() => {
            setCurrentPlayerIndex(0);
            setGamePhase("idle");
          }, 2000);
        }
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

        // 少し遅延してから感情を込めて音声読み上げ
        setTimeout(() => {
          setIsSpeaking(true);
          // メッセージタイプに応じて感情を設定
          const emotion: EmotionType = messageItem.type === 'question' ? 'question' : 'warm';
          speakWithEmotion(messageItem.content, {
            emotion,
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

        // 少し遅延してから感情を込めて音声読み上げ
        setTimeout(() => {
          setIsSpeaking(true);
          // speakTextフィールドがあればそれを使う（昭和ギャグのリアル読み上げ）
          // ボケツッコミの場合は全体を読み上げ
          let textToSpeak = comedyContent.speakText || comedyContent.content;
          if (comedyContent.type === 'boke_tsukkomi' && comedyContent.setup && comedyContent.boke && comedyContent.tsukkomi) {
            textToSpeak = `${comedyContent.setup}。${comedyContent.boke}。${comedyContent.tsukkomi}`;
          }
          speakWithEmotion(textToSpeak, {
            emotion: 'funny',
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
  }, [player.travelProgress, player.visitedAirports, diceResult, nextPlayer, currentPlayerIndex, setPlayer, isFinalDestination, sharedDestination]);

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

  // 名所・グルメ選択完了後の次のステップ処理
  const handleSpotSelectionComplete = useCallback(() => {
    setPendingSpotSelection(false);

    // 最初の到着者の場合：次の目的地ルーレットへ
    if (firstArrivalPlayerIndex === currentPlayerIndex) {
      setTimeout(() => {
        // このプレイヤーのターンで次の目的地を決める
        setGamePhase("idle");
        setMessage("🎯 次の目的地を決めよう！ルーレットを回してください");
      }, 2000);
      return;
    }

    // 後続の到着者の場合：次のプレイヤーへターンを渡す
    // 次のターンで自動的に共通目的地に向かう（sharedDestinationがあれば）
    setTimeout(() => nextPlayer(), 2000);
  }, [currentPlayerIndex, nextPlayer, firstArrivalPlayerIndex]);

  // 観光名所を訪問（各空港で各プレイヤーが1つのみ選択可能）
  const handleVisitAttraction = useCallback((
    airportCode: string,
    index: number,
    name: string,
    points: number,
    category: EmotionCategory,
    isPowerSpot?: boolean
  ) => {
    // 現在のプレイヤーがこの空港で既に選択済みかチェック
    const playerSpots = playerSelectedSpots.get(currentPlayerIndex) || [];
    if (playerSpots.includes(airportCode)) {
      setMessage("この空港では既に選択済みです");
      return;
    }

    // 既に他のプレイヤーに選ばれているスポットかチェック
    const attractionId = `${airportCode}-attraction-${index}`;
    if (visitedAttractions.includes(attractionId)) {
      setMessage("このスポットは既に他のプレイヤーが選択しています");
      return;
    }

    // グローバルリストに追加（グレーアウト表示用）
    setVisitedAttractions((prev) => [...prev, attractionId]);

    // プレイヤーごとの選択済みリストに追加
    setPlayerSelectedSpots(prev => {
      const newMap = new Map(prev);
      const spots = newMap.get(currentPlayerIndex) || [];
      newMap.set(currentPlayerIndex, [...spots, airportCode]);
      return newMap;
    });

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

    // 到着時の名所・グルメ選択待ち状態なら完了処理
    if (pendingSpotSelection) {
      handleSpotSelectionComplete();
    }
  }, [visitedAttractions, playerSelectedSpots, currentPlayerIndex, setPlayer, pendingSpotSelection, handleSpotSelectionComplete]);

  // ご当地グルメを味わう（各空港で各プレイヤーが1つのみ選択可能）
  const handleVisitFood = useCallback((
    airportCode: string,
    index: number,
    name: string,
    points: number
  ) => {
    // 現在のプレイヤーがこの空港で既に選択済みかチェック
    const playerSpots = playerSelectedSpots.get(currentPlayerIndex) || [];
    if (playerSpots.includes(airportCode)) {
      setMessage("この空港では既に選択済みです");
      return;
    }

    // 既に他のプレイヤーに選ばれているグルメかチェック
    const foodId = `${airportCode}-food-${index}`;
    if (visitedFoods.includes(foodId)) {
      setMessage("このグルメは既に他のプレイヤーが選択しています");
      return;
    }

    // グローバルリストに追加（グレーアウト表示用）
    setVisitedFoods((prev) => [...prev, foodId]);

    // プレイヤーごとの選択済みリストに追加
    setPlayerSelectedSpots(prev => {
      const newMap = new Map(prev);
      const spots = newMap.get(currentPlayerIndex) || [];
      newMap.set(currentPlayerIndex, [...spots, airportCode]);
      return newMap;
    });

    setPlayer((prev) => ({
      ...prev,
      emotionPoints: {
        ...prev.emotionPoints,
        total: prev.emotionPoints.total + points,
        joy: prev.emotionPoints.joy + points,
      },
    }));
    setMessage(`🍽️ ${name}を味わった！ +${points}pt 獲得！`);

    // 到着時の名所・グルメ選択待ち状態なら完了処理
    if (pendingSpotSelection) {
      handleSpotSelectionComplete();
    }
  }, [visitedFoods, playerSelectedSpots, currentPlayerIndex, setPlayer, pendingSpotSelection, handleSpotSelectionComplete]);

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
    <div className="world-tour-bg min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 relative z-10">
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
              <p className="text-white/80 mt-2">ライトフライヤー21 〜感動・世界旅〜 クリア！</p>
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
      <div className="glass-card p-4 md:p-6 fade-in">
        {/* タイトル行 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white title-glow flex items-center gap-2">
            <span className="airplane-flying">✈️</span>
            <div>
              <span>ライトフライヤー21</span>
              <span className="text-sm text-yellow-300 ml-2">感動・世界旅</span>
            </div>
          </h1>
          <div className="flex items-center gap-3">
            <div className="glass-card-light px-4 py-2 text-center">
              <p className="text-white/60 text-xs">目的地</p>
              <p className="text-yellow-400 font-bold text-lg">
                {visitedDestinations.length - 1}/{destinationCount}
              </p>
            </div>
            <div className="glass-card-light px-4 py-2 text-center">
              <p className="text-white/60 text-xs">ターン</p>
              <p className="text-white font-bold text-lg">{player.turnsPlayed + 1}</p>
            </div>
          </div>
        </div>

        {/* ステータス行 */}
        <div className="flex flex-wrap items-center gap-4">
          {/* 現在のプレイヤー */}
          <div
            className="player-card px-4 py-2 flex items-center gap-3"
            style={{
              borderColor: `${currentPlayerColor}60`,
              background: `linear-gradient(135deg, ${currentPlayerColor}20 0%, transparent 100%)`
            }}
          >
            <span className="text-3xl">{gameConfig?.players?.[currentPlayerIndex]?.avatarEmoji || '👤'}</span>
            <div>
              <p className="text-white/60 text-xs">プレイヤー</p>
              <p className="font-bold text-white" style={{ textShadow: `0 0 10px ${currentPlayerColor}` }}>{player.name}</p>
            </div>
          </div>

          {/* 現在地 */}
          <div className="glass-card-light px-4 py-2 flex items-center gap-3">
            <span className={`text-3xl ${isInFlight ? 'airplane-flying' : ''}`}>
              {isInFlight ? "✈️" : currentAirport?.icon}
            </span>
            <div>
              <p className="text-white/60 text-xs">現在地</p>
              <p className="font-bold text-white">
                {isInFlight ? (
                  <span className="text-cyan-300">
                    {getAirportByCode(player.travelProgress?.startAirport || "")?.city}
                    <span className="mx-2">→</span>
                    {destinationAirportData?.city}
                  </span>
                ) : (
                  `${currentAirport?.city}`
                )}
              </p>
            </div>
          </div>

          {/* 目的地表示 */}
          {destinationAirportData && player.travelProgress && (
            <div className="destination-card px-4 py-2 flex items-center gap-3">
              <span className="text-3xl">{destinationAirportData.icon}</span>
              <div>
                <p className="text-yellow-400/80 text-xs">目的地</p>
                <p className="font-bold text-yellow-300">{destinationAirportData.city}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flight-progress w-20 h-2">
                    <div
                      className="flight-progress-bar h-full"
                      style={{
                        width: `${(player.travelProgress.currentSpace / player.travelProgress.totalSpaces) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-white/60 text-xs">
                    {player.travelProgress.currentSpace}/{player.travelProgress.totalSpaces}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* パワーブースター・チケット */}
          {player.powerBoosterTickets.length > 0 && (
            <div className="glass-card-light px-4 py-2 flex items-center gap-3 border border-yellow-400/50">
              <span className="text-2xl">🎫</span>
              <div className="flex-1">
                <p className="text-yellow-400 text-xs font-medium">パワーブースター</p>
                <div className="flex gap-1 mt-1">
                  {player.powerBoosterTickets.map((ticket) => (
                    <span key={ticket.id} className="emotion-badge emotion-fun text-xs">
                      {ticket.multiplier}倍
                    </span>
                  ))}
                </div>
              </div>
              {/* 譲渡ボタン（2人以上でプレイ時のみ表示） */}
              {players.length > 1 && (
                <button
                  className="text-xs px-2 py-1 bg-pink-500/30 text-pink-300 rounded hover:bg-pink-500/50 transition-colors"
                  onClick={() => setShowTicketTransfer(!showTicketTransfer)}
                >
                  🎁 譲渡
                </button>
              )}
            </div>
          )}

          {/* チケット譲渡モーダル */}
          {showTicketTransfer && player.powerBoosterTickets.length > 0 && players.length > 1 && (
            <div className="glass-card p-4 border border-pink-400/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold text-sm">🎁 チケットを譲渡</h4>
                <button
                  className="text-white/50 hover:text-white"
                  onClick={() => {
                    setShowTicketTransfer(false);
                    setSelectedTicketForTransfer(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <p className="text-white/60 text-xs mb-3">
                チケットを譲渡すると<span className="text-yellow-400 font-bold">感動ポイント+200pt</span>獲得！
              </p>

              {/* チケット選択 */}
              {!selectedTicketForTransfer ? (
                <div className="space-y-2">
                  <p className="text-white/80 text-xs">譲渡するチケットを選択:</p>
                  <div className="flex flex-wrap gap-2">
                    {player.powerBoosterTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        className="px-3 py-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg text-yellow-300 text-sm hover:bg-yellow-500/30 transition-colors"
                        onClick={() => setSelectedTicketForTransfer(ticket.id)}
                      >
                        🎫 {ticket.multiplier}倍チケット
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-white/80 text-xs">譲渡先のプレイヤーを選択:</p>
                  <div className="flex flex-wrap gap-2">
                    {players.map((p, idx) => {
                      if (idx === currentPlayerIndex) return null;
                      const playerEmoji = gameConfig?.players?.[idx]?.avatarEmoji || '👤';
                      const playerColor = PLAYER_COLORS.find(c => c.id === (gameConfig?.players?.[idx]?.color || 'blue'))?.color || '#3B82F6';
                      return (
                        <button
                          key={p.id}
                          className="px-3 py-2 rounded-lg text-white text-sm hover:scale-105 transition-all"
                          style={{ backgroundColor: `${playerColor}40`, border: `1px solid ${playerColor}80` }}
                          onClick={() => {
                            transferTicket(selectedTicketForTransfer, idx);
                          }}
                        >
                          {playerEmoji} {p.name}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="text-white/50 text-xs hover:text-white"
                    onClick={() => setSelectedTicketForTransfer(null)}
                  >
                    ← 戻る
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 感動ポイント */}
          <EmotionPointsDisplay points={player.emotionPoints} />

          {/* 訪問数 */}
          <div className="glass-card-light px-4 py-2 text-center">
            <p className="text-white/60 text-xs">訪問空港</p>
            <p className="text-2xl font-bold text-white">
              {player.visitedAirports.length}
              <span className="text-white/40 text-sm">/{AIRPORTS.length}</span>
            </p>
          </div>
        </div>

        {/* メッセージ */}
        {message && (
          <div className="message-banner mt-4 text-center">
            <p className="text-yellow-100 font-medium">{message}</p>
          </div>
        )}
      </div>

      {/* メインマップとルーレット（横並び） */}
      <div className={`grid gap-4 ${showRoulette ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* マップコンテナ */}
        <div className="map-container">
          <div className={`w-full relative ${showRoulette ? 'h-[400px] md:h-[500px]' : 'h-[500px] md:h-[600px]'}`}>
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
              playerPositions={players.map((p, idx) => {
                const playerColorId = gameConfig?.players?.[idx]?.color || 'blue';
                const playerColor = PLAYER_COLORS.find(c => c.id === playerColorId)?.color || '#3B82F6';
                const playerEmoji = gameConfig?.players?.[idx]?.avatarEmoji || '👤';
                const isInFlightPlayer = p.travelProgress && p.travelProgress.currentSpace > 0;
                return {
                  playerId: p.id,
                  playerName: p.name,
                  avatarEmoji: playerEmoji,
                  color: playerColor,
                  airportCode: isInFlightPlayer ? undefined : p.currentAirport,
                  currentPosition: isInFlightPlayer ? p.travelProgress?.currentPosition : undefined,
                  isInFlight: !!isInFlightPlayer,
                  isCurrentPlayer: idx === currentPlayerIndex,
                };
              })}
              destinationAirport={player.destinationAirport}
              travelProgress={player.travelProgress}
              routePositions={routePositions}
            />
          </div>
        </div>

        {/* ルーレットパネル（横並び表示） */}
        {showRoulette && (
          <div className="flex items-center justify-center">
            <DestinationRoulette
              excludeAirports={visitedDestinations}
              onDestinationSelected={handleDestinationSelected}
              isFinalDestination={isFinalDestination}
              startAirport={startAirport}
            />
          </div>
        )}
      </div>

      {/* コントロールパネル */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* アクションパネル */}
        <div className="glass-card p-4 md:p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎮</span> アクション
          </h2>
          <div className="space-y-4">
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
                    {/* ルーレットボタン表示条件:
                        - ゲーム開始時：共通目的地がまだない場合（最初のプレイヤーのみ）
                        - 到着後：最初の到着者（firstArrivalPlayerIndex === currentPlayerIndex）のみ
                        ※ 後続プレイヤーは自動的に共通目的地に向かう（ルーレットは回さない）
                    */}
                    {(() => {
                      // ゲーム開始時：共通目的地がなく、最初のプレイヤー
                      const isInitialSetup = !sharedDestination && currentPlayerIndex === 0;

                      // 最初の到着者がルーレットを回すべき状態
                      const isFirstArrivalAndShouldSelectNext =
                        firstArrivalPlayerIndex === currentPlayerIndex &&
                        firstArrivalPlayerIndex !== null &&
                        !player.travelProgress &&
                        !pendingSpotSelection;

                      // 後続プレイヤーが次の目的地に向かうべき状態
                      // （sharedDestinationが現在地と異なる＝先行者が新しい目的地を設定済み）
                      const hasNextDestination = sharedDestination && sharedDestination.airport !== player.currentAirport;

                      // 後続プレイヤーが待機すべき状態
                      // （最初の到着者ではなく、まだ次の目的地が設定されていない）
                      const isWaitingForFirstArrival =
                        firstArrivalPlayerIndex !== null &&
                        firstArrivalPlayerIndex !== currentPlayerIndex &&
                        !player.travelProgress &&
                        !hasNextDestination;

                      if (isInitialSetup || isFirstArrivalAndShouldSelectNext) {
                        return (
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
                        );
                      } else if (hasNextDestination) {
                        return (
                          <div className="space-y-3">
                            <Button
                              onClick={setPlayerToSharedDestination}
                              size="lg"
                              className="w-full text-xl py-6 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                            >
                              🎯 {getAirportByCode(sharedDestination.airport)?.city} に向かう！
                            </Button>
                            <p className="text-sm text-gray-500 text-center">
                              先行プレイヤーが決めた目的地に向かいます
                            </p>
                          </div>
                        );
                      } else if (isWaitingForFirstArrival) {
                        return (
                          <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-gray-600">
                              先行プレイヤーが次の目的地を決めるのを待っています...
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-gray-600">
                              目的地を設定してください
                            </p>
                          </div>
                        );
                      }
                    })()}
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

            {/* 観光スポット（旧visiting） */}
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

            {/* 目的地到着・名所グルメ選択 */}
            {gamePhase === "arrived" && pendingSpotSelection && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-400">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <p className="font-bold text-emerald-800">目的地に到着！</p>
                      <p className="text-sm text-emerald-600">
                        {currentAirport?.city}の名所かグルメを1つ選んでください
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>👇</span>
                      <span>下の「空港情報パネル」から選択してください</span>
                    </p>
                  </div>
                </div>
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
          </div>
        </div>

        {/* 空港情報パネル */}
        <AirportPanel
          airport={selectedAirport || player.currentAirport}
          isCurrentLocation={!selectedAirport}
          nearbySpots={
            selectedAirport
              ? getSpotsByAirport(selectedAirport)
              : nearbySpots
          }
          visitedAttractions={visitedAttractions}
          visitedFoods={visitedFoods}
          onVisitAttraction={handleVisitAttraction}
          onVisitFood={handleVisitFood}
          canInteract={gamePhase === "arrived" && pendingSpotSelection && !selectedAirport}
          isStartAirport={(selectedAirport || player.currentAirport) === startAirport}
          hasPlayerSelectedHere={(playerSelectedSpots.get(currentPlayerIndex) || []).includes(selectedAirport || player.currentAirport)}
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
    </div>
  );
}
