// ======================================
// 双六ゲームシステム TypeScript型定義
// ======================================

// ユーザーポイント
export interface UserPoints {
  id: string;
  user_id: string;
  family_id: string;
  total_points: number;
  current_points: number;
  messages_sent: number;
  messages_received: number;
  messages_replied: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

// ポイント履歴
export type PointActionType =
  | 'send'
  | 'listen'
  | 'reply'
  | 'streak'
  | 'first_time'
  | 'all_listened';

export interface PointHistory {
  id: string;
  user_id: string;
  family_id: string;
  points_earned: number;
  action_type: PointActionType;
  message_id: string | null;
  description: string | null;
  created_at: string;
}

// 双六ボード
export interface SugorokuBoard {
  id: string;
  name: string;
  description: string | null;
  board_number: number;
  total_squares: number;
  unlock_condition: string | null;
  theme_color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// マスの種類
export type SquareType =
  | 'normal'
  | 'gift'
  | 'bonus'
  | 'chance'
  | 'family_event'
  | 'mission'
  | 'rest'
  | 'goal';

// マスイベントデータの型
export interface GiftEventData {
  rarity: 'common' | 'rare' | 'legendary';
  message: string;
}

export interface BonusEventData {
  points: number;
}

export interface ChanceEventData {
  reward: 'extra_roll';
  message: string;
}

export interface FamilyEventData {
  reward: 'family_bonus';
  pointsPerMember: number;
  message: string;
}

export interface MissionEventData {
  mission: string;
  reward: number;
  description: string;
}

export interface RestEventData {
  animation: string;
  message: string;
}

export interface GoalEventData {
  reward: 'board_clear';
  points: number;
  message: string;
}

export type EventData =
  | GiftEventData
  | BonusEventData
  | ChanceEventData
  | FamilyEventData
  | MissionEventData
  | RestEventData
  | GoalEventData;

// 双六マス
export interface SugorokuSquare {
  id: string;
  board_id: string;
  position: number;
  square_type: SquareType;
  event_data: EventData | null;
  description: string | null;
  created_at: string;
}

// ユーザーのボード進捗
export interface UserBoardProgress {
  id: string;
  user_id: string;
  family_id: string;
  board_id: string;
  current_position: number;
  is_completed: boolean;
  completed_at: string | null;
  started_at: string;
  updated_at: string;
}

// サイコロ/ルーレット
export type RollType = 'dice' | 'roulette';

export interface DiceHistory {
  id: string;
  user_id: string;
  family_id: string;
  board_id: string;
  roll_type: RollType;
  points_used: number;
  result: number;
  position_before: number;
  position_after: number;
  created_at: string;
}

// ギフト
export type GiftType = 'badge' | 'color' | 'frame' | 'sticker' | 'effect' | 'template' | 'special';
export type GiftRarity = 'common' | 'rare' | 'legendary';

export interface GiftMetadata {
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderImage?: string;
  imageUrl?: string;
  animationType?: string;
  duration?: string;
  questionPackId?: string;
  giftType?: string;
  pointsPerMember?: number;
  featureUnlock?: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  gift_type: GiftType;
  rarity: GiftRarity;
  icon_url: string | null;
  metadata: GiftMetadata | null;
  is_active: boolean;
  created_at: string;
}

// ユーザーが獲得したギフト
export interface UserGift {
  id: string;
  user_id: string;
  gift_id: string;
  square_id: string | null;
  acquired_at: string;
  is_equipped: boolean;
  gift?: Gift; // JOIN時に含まれる
}

// ======================================
// UI表示用の拡張型
// ======================================

// ボード進捗（ボード情報含む）
export interface UserBoardProgressWithBoard extends UserBoardProgress {
  board: SugorokuBoard;
}

// マス情報（進捗情報含む）
export interface SugorokuSquareWithProgress extends SugorokuSquare {
  isCurrentPosition: boolean;
  isPassed: boolean;
}

// ランキング表示用
export interface FamilyRanking {
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  current_position: number;
  board_number: number;
  total_points: number;
  rank: number;
}

// ポイント獲得情報（通知用）
export interface PointsEarned {
  points: number;
  action_type: PointActionType;
  description: string;
  bonus?: {
    type: string;
    amount: number;
  };
}
