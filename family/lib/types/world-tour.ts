// ======================================
// 世界感動旅行ゲーム TypeScript型定義
// ======================================

// ======================================
// 空港関連
// ======================================

// 空港マスター
export interface Airport {
  code: string;           // IATA空港コード (例: "NRT", "JFK")
  name: string;           // 空港名
  city: string;           // 都市名
  country: string;        // 国名
  region: WorldRegion;    // 地域
  coordinates: {
    lat: number;          // 緯度
    lng: number;          // 経度
  };
  hub: boolean;           // 主要ハブ空港かどうか
  icon: string;           // 絵文字アイコン
}

// 世界の地域
export type WorldRegion =
  | 'asia'           // アジア
  | 'europe'         // ヨーロッパ
  | 'north_america'  // 北米
  | 'south_america'  // 南米
  | 'africa'         // アフリカ
  | 'oceania'        // オセアニア
  | 'middle_east';   // 中東

// 空港間のルート
export interface FlightRoute {
  from: string;           // 出発空港コード
  to: string;             // 到着空港コード
  distance: number;       // 距離 (km)
  flightTime: number;     // 飛行時間 (分)
  spaces: number;         // マス数（距離に基づく）
}

// ======================================
// 観光地・感動スポット
// ======================================

// 感動カテゴリー
export type EmotionCategory =
  | 'fun'           // たのしい感動
  | 'joy'           // うれしい感動
  | 'beauty'        // うつくしい感動
  | 'wonder'        // おどろき感動
  | 'reflection';   // しみじみ感動

// 観光地/感動スポット
export interface TouristSpot {
  id: string;
  name: string;                    // スポット名
  description: string;             // 説明
  nearestAirport: string;          // 最寄り空港コード
  transportFromAirport: {
    method: 'train' | 'bus' | 'boat' | 'car';
    duration: number;              // 所要時間（分）
    description: string;           // 移動の説明
  };
  emotionCategory: EmotionCategory;
  emotionPoints: number;           // 獲得感動ポイント
  icon: string;                    // 絵文字アイコン
  imageUrl?: string;               // 画像URL
  country: string;
  isWorldHeritage: boolean;        // 世界遺産かどうか
  visitEvent?: SpotEvent;          // 訪問時イベント
}

// スポット訪問イベント
export interface SpotEvent {
  title: string;
  description: string;
  choices?: {
    text: string;
    result: {
      emotionPoints: number;
      message: string;
    };
  }[];
}

// ======================================
// ゲーム状態
// ======================================

// プレイヤー状態
export interface PlayerState {
  id: string;
  name: string;
  avatarUrl?: string;
  currentAirport: string;          // 現在の空港コード
  emotionPoints: {
    total: number;
    fun: number;
    joy: number;
    beauty: number;
    wonder: number;
    reflection: number;
  };
  visitedAirports: string[];       // 訪問済み空港
  visitedSpots: string[];          // 訪問済み観光地
  inventory: InventoryItem[];      // 所持アイテム
  turnsPlayed: number;             // プレイしたターン数
  // 長距離移動用
  destinationAirport?: string;     // 最終目的地（設定中の場合）
  travelProgress?: TravelProgress; // 移動進捗
}

// 長距離移動の進捗状態
export interface TravelProgress {
  startAirport: string;            // 出発空港コード
  finalDestination: string;        // 最終目的地の空港コード
  totalDistance: number;           // 総距離（km）
  totalSpaces: number;             // 総マス数
  currentSpace: number;            // 現在のマス位置（0=出発地、totalSpaces=目的地）
  // 現在位置の座標（空路上）
  currentPosition: {
    lat: number;
    lng: number;
  };
}

// インベントリアイテム
export interface InventoryItem {
  id: string;
  type: 'souvenir' | 'ticket' | 'special';
  name: string;
  description: string;
  icon: string;
  effect?: ItemEffect;
}

// アイテム効果
export interface ItemEffect {
  type: 'extra_roll' | 'double_points' | 'skip_trouble' | 'free_flight';
  value?: number;
}

// ======================================
// ゲームイベント
// ======================================

// イベントタイプ
export type GameEventType =
  | 'arrival'           // 空港到着
  | 'spot_visit'        // 観光地訪問
  | 'quiz'              // クイズ
  | 'chance'            // チャンスカード
  | 'trouble'           // トラブル（台風、ストライキなど）
  | 'encounter';        // 他プレイヤーとの遭遇

// ゲームイベント
export interface GameEvent {
  type: GameEventType;
  title: string;
  description: string;
  icon: string;
  data: unknown;
}

// トラブルイベント
export interface TroubleEvent {
  id: string;
  type: 'weather' | 'strike' | 'overbooking' | 'lost_luggage';
  title: string;
  description: string;
  effect: {
    skipTurns?: number;           // スキップするターン数
    losePoints?: number;          // 失うポイント
    forcedMove?: string;          // 強制移動先
  };
  icon: string;
}

// ======================================
// BGM関連
// ======================================

// BGMタイプ
export type BGMType =
  | 'title'             // タイトル画面
  | 'map'               // マップ移動中
  | 'flight'            // フライト中
  | 'arrival'           // 到着時
  | 'quiz'              // クイズ
  | 'emotion'           // 感動イベント
  | 'lucky'             // ラッキーイベント
  | 'trouble'           // トラブル
  | 'encounter'         // 他プレイヤー接近
  | 'ending';           // エンディング

// BGM設定
export interface BGMConfig {
  type: BGMType;
  src: string;
  volume: number;
  loop: boolean;
}

// ======================================
// マップ表示関連
// ======================================

// マップビューポート
export interface MapViewport {
  zoom: number;           // ズームレベル (0.5 - 4.0)
  center: {
    x: number;            // 中心X座標 (0-100%)
    y: number;            // 中心Y座標 (0-100%)
  };
}

// マップマーカー
export interface MapMarker {
  id: string;
  type: 'airport' | 'spot' | 'player';
  coordinates: {
    lat: number;
    lng: number;
  };
  label: string;
  icon: string;
  isActive: boolean;
}

// ======================================
// ゲーム設定
// ======================================

// ゲームモード
export type GameMode = 'solo' | 'family' | 'versus';

// ゲーム設定
export interface GameSettings {
  mode: GameMode;
  goalType: 'points' | 'airports' | 'time';
  goalValue: number;                    // 目標値
  startAirport: string;                 // 開始空港
  enableTroubles: boolean;              // トラブルイベント有効
  enableQuiz: boolean;                  // クイズ有効
  bgmEnabled: boolean;                  // BGM有効
  sfxEnabled: boolean;                  // 効果音有効
}

// ゲームセッション
export interface GameSession {
  id: string;
  settings: GameSettings;
  players: PlayerState[];
  currentPlayerIndex: number;
  turn: number;
  status: 'waiting' | 'playing' | 'paused' | 'finished';
  winner?: string;
  createdAt: string;
  updatedAt: string;
}
