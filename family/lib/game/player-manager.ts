// ======================================
// プレイヤー管理システム
// 1〜4人対応、ニックネーム入力機能
// ======================================

export interface Player {
  id: string;
  nickname: string;
  avatarEmoji: string;
  color: string;
  emotionPoints: {
    total: number;
    fun: number;        // たのしい感動
    joy: number;        // うれしい感動
    beauty: number;     // うつくしい感動
    wonder: number;     // おどろき感動
    reflection: number; // しみじみ感動
  };
  currentAirport: string;
  visitedAirports: string[];
  turnsPlayed: number;
  powerBoosterTickets: {
    id: string;
    multiplier: number;
    spotName: string;
    obtainedAt: string;
  }[];
}

// プレイヤーカラーパレット
export const PLAYER_COLORS = [
  { id: 'red', name: '赤', color: '#EF4444', bgClass: 'bg-red-500', textClass: 'text-red-500' },
  { id: 'blue', name: '青', color: '#3B82F6', bgClass: 'bg-blue-500', textClass: 'text-blue-500' },
  { id: 'green', name: '緑', color: '#22C55E', bgClass: 'bg-green-500', textClass: 'text-green-500' },
  { id: 'yellow', name: '黄', color: '#EAB308', bgClass: 'bg-yellow-500', textClass: 'text-yellow-500' },
];

// プレイヤーアバター絵文字
export const PLAYER_AVATARS = [
  '👦', '👧', '👨', '👩', '👴', '👵',
  '🧒', '🧑', '🧓', '👶',
  '🐱', '🐶', '🐰', '🐻', '🦊', '🐼',
  '🦁', '🐯', '🐸', '🐵',
  '🌟', '🌈', '🎈', '🎀', '🎯', '🎪'
];

// デフォルトのニックネーム
export const DEFAULT_NICKNAMES = [
  'プレイヤー1', 'プレイヤー2', 'プレイヤー3', 'プレイヤー4'
];

// プレイヤーを作成
export function createPlayer(
  index: number,
  nickname?: string,
  avatarEmoji?: string,
  startAirport: string = 'NRT'
): Player {
  return {
    id: `player-${index + 1}`,
    nickname: nickname || DEFAULT_NICKNAMES[index],
    avatarEmoji: avatarEmoji || PLAYER_AVATARS[index % PLAYER_AVATARS.length],
    color: PLAYER_COLORS[index % PLAYER_COLORS.length].id,
    emotionPoints: {
      total: 0,
      fun: 0,
      joy: 0,
      beauty: 0,
      wonder: 0,
      reflection: 0
    },
    currentAirport: startAirport,
    visitedAirports: [startAirport],
    turnsPlayed: 0,
    powerBoosterTickets: []
  };
}

// プレイヤーの感動ポイントを追加
export function addEmotionPoints(
  player: Player,
  category: 'fun' | 'joy' | 'beauty' | 'wonder' | 'reflection',
  points: number
): Player {
  return {
    ...player,
    emotionPoints: {
      ...player.emotionPoints,
      total: player.emotionPoints.total + points,
      [category]: player.emotionPoints[category] + points
    }
  };
}

// プレイヤーの現在位置を更新
export function updatePlayerPosition(player: Player, airportCode: string): Player {
  const newVisited = player.visitedAirports.includes(airportCode)
    ? player.visitedAirports
    : [...player.visitedAirports, airportCode];

  return {
    ...player,
    currentAirport: airportCode,
    visitedAirports: newVisited
  };
}

// プレイヤーの色を取得
export function getPlayerColor(player: Player) {
  return PLAYER_COLORS.find(c => c.id === player.color) || PLAYER_COLORS[0];
}

// ランキングを取得（感動ポイント順）
export function getPlayerRanking(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.emotionPoints.total - a.emotionPoints.total);
}

// 勝者を取得
export function getWinner(players: Player[]): Player | null {
  if (players.length === 0) return null;
  return getPlayerRanking(players)[0];
}
