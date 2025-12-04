// ======================================
// 世界の主要空港データ（Phase 1: 50空港）
// ======================================

import { Airport, WorldRegion } from '@/lib/types/world-tour';

export const AIRPORTS: Airport[] = [
  // ========== アジア (Asia) ==========
  {
    code: 'NRT',
    name: '成田国際空港',
    city: '東京',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 35.7647, lng: 140.3864 },
    hub: true,
    icon: '🗼',
  },
  {
    code: 'HND',
    name: '羽田空港',
    city: '東京',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 35.5494, lng: 139.7798 },
    hub: true,
    icon: '🏯',
  },
  {
    code: 'KIX',
    name: '関西国際空港',
    city: '大阪',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 34.4347, lng: 135.2441 },
    hub: true,
    icon: '🏰',
  },
  {
    code: 'ICN',
    name: '仁川国際空港',
    city: 'ソウル',
    country: '韓国',
    region: 'asia',
    coordinates: { lat: 37.4602, lng: 126.4407 },
    hub: true,
    icon: '🇰🇷',
  },
  {
    code: 'PEK',
    name: '北京首都国際空港',
    city: '北京',
    country: '中国',
    region: 'asia',
    coordinates: { lat: 40.0799, lng: 116.6031 },
    hub: true,
    icon: '🏛️',
  },
  {
    code: 'PVG',
    name: '上海浦東国際空港',
    city: '上海',
    country: '中国',
    region: 'asia',
    coordinates: { lat: 31.1443, lng: 121.8083 },
    hub: true,
    icon: '🌃',
  },
  {
    code: 'HKG',
    name: '香港国際空港',
    city: '香港',
    country: '香港',
    region: 'asia',
    coordinates: { lat: 22.3080, lng: 113.9185 },
    hub: true,
    icon: '🌆',
  },
  {
    code: 'TPE',
    name: '台湾桃園国際空港',
    city: '台北',
    country: '台湾',
    region: 'asia',
    coordinates: { lat: 25.0777, lng: 121.2328 },
    hub: true,
    icon: '🏮',
  },
  {
    code: 'SIN',
    name: 'チャンギ国際空港',
    city: 'シンガポール',
    country: 'シンガポール',
    region: 'asia',
    coordinates: { lat: 1.3644, lng: 103.9915 },
    hub: true,
    icon: '🦁',
  },
  {
    code: 'BKK',
    name: 'スワンナプーム国際空港',
    city: 'バンコク',
    country: 'タイ',
    region: 'asia',
    coordinates: { lat: 13.6900, lng: 100.7501 },
    hub: true,
    icon: '🛕',
  },
  {
    code: 'KUL',
    name: 'クアラルンプール国際空港',
    city: 'クアラルンプール',
    country: 'マレーシア',
    region: 'asia',
    coordinates: { lat: 2.7456, lng: 101.7099 },
    hub: true,
    icon: '🗼',
  },
  {
    code: 'DEL',
    name: 'インディラ・ガンディー国際空港',
    city: 'デリー',
    country: 'インド',
    region: 'asia',
    coordinates: { lat: 28.5562, lng: 77.1000 },
    hub: true,
    icon: '🕌',
  },
  {
    code: 'MNL',
    name: 'ニノイ・アキノ国際空港',
    city: 'マニラ',
    country: 'フィリピン',
    region: 'asia',
    coordinates: { lat: 14.5086, lng: 121.0194 },
    hub: false,
    icon: '🏝️',
  },
  {
    code: 'CGK',
    name: 'スカルノ・ハッタ国際空港',
    city: 'ジャカルタ',
    country: 'インドネシア',
    region: 'asia',
    coordinates: { lat: -6.1256, lng: 106.6559 },
    hub: true,
    icon: '🌴',
  },
  {
    code: 'HAN',
    name: 'ノイバイ国際空港',
    city: 'ハノイ',
    country: 'ベトナム',
    region: 'asia',
    coordinates: { lat: 21.2212, lng: 105.8072 },
    hub: false,
    icon: '🎋',
  },

  // ========== ヨーロッパ (Europe) ==========
  {
    code: 'LHR',
    name: 'ヒースロー空港',
    city: 'ロンドン',
    country: 'イギリス',
    region: 'europe',
    coordinates: { lat: 51.4700, lng: -0.4543 },
    hub: true,
    icon: '🇬🇧',
  },
  {
    code: 'CDG',
    name: 'シャルル・ド・ゴール空港',
    city: 'パリ',
    country: 'フランス',
    region: 'europe',
    coordinates: { lat: 49.0097, lng: 2.5479 },
    hub: true,
    icon: '🗼',
  },
  {
    code: 'FRA',
    name: 'フランクフルト空港',
    city: 'フランクフルト',
    country: 'ドイツ',
    region: 'europe',
    coordinates: { lat: 50.0379, lng: 8.5622 },
    hub: true,
    icon: '🏰',
  },
  {
    code: 'AMS',
    name: 'スキポール空港',
    city: 'アムステルダム',
    country: 'オランダ',
    region: 'europe',
    coordinates: { lat: 52.3105, lng: 4.7683 },
    hub: true,
    icon: '🌷',
  },
  {
    code: 'FCO',
    name: 'フィウミチーノ空港',
    city: 'ローマ',
    country: 'イタリア',
    region: 'europe',
    coordinates: { lat: 41.8003, lng: 12.2389 },
    hub: true,
    icon: '🏛️',
  },
  {
    code: 'MAD',
    name: 'マドリード・バラハス空港',
    city: 'マドリード',
    country: 'スペイン',
    region: 'europe',
    coordinates: { lat: 40.4983, lng: -3.5676 },
    hub: true,
    icon: '💃',
  },
  {
    code: 'BCN',
    name: 'バルセロナ・エル・プラット空港',
    city: 'バルセロナ',
    country: 'スペイン',
    region: 'europe',
    coordinates: { lat: 41.2971, lng: 2.0785 },
    hub: false,
    icon: '⛪',
  },
  {
    code: 'MUC',
    name: 'ミュンヘン空港',
    city: 'ミュンヘン',
    country: 'ドイツ',
    region: 'europe',
    coordinates: { lat: 48.3538, lng: 11.7861 },
    hub: true,
    icon: '🍺',
  },
  {
    code: 'ZRH',
    name: 'チューリッヒ空港',
    city: 'チューリッヒ',
    country: 'スイス',
    region: 'europe',
    coordinates: { lat: 47.4647, lng: 8.5492 },
    hub: false,
    icon: '⛰️',
  },
  {
    code: 'VIE',
    name: 'ウィーン国際空港',
    city: 'ウィーン',
    country: 'オーストリア',
    region: 'europe',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    hub: false,
    icon: '🎻',
  },
  {
    code: 'ATH',
    name: 'アテネ国際空港',
    city: 'アテネ',
    country: 'ギリシャ',
    region: 'europe',
    coordinates: { lat: 37.9364, lng: 23.9445 },
    hub: false,
    icon: '🏛️',
  },
  {
    code: 'CPH',
    name: 'コペンハーゲン空港',
    city: 'コペンハーゲン',
    country: 'デンマーク',
    region: 'europe',
    coordinates: { lat: 55.6180, lng: 12.6508 },
    hub: false,
    icon: '🧜‍♀️',
  },
  {
    code: 'ARN',
    name: 'ストックホルム・アーランダ空港',
    city: 'ストックホルム',
    country: 'スウェーデン',
    region: 'europe',
    coordinates: { lat: 59.6519, lng: 17.9186 },
    hub: false,
    icon: '👑',
  },
  {
    code: 'HEL',
    name: 'ヘルシンキ・ヴァンター空港',
    city: 'ヘルシンキ',
    country: 'フィンランド',
    region: 'europe',
    coordinates: { lat: 60.3172, lng: 24.9633 },
    hub: false,
    icon: '🎅',
  },

  // ========== 北米 (North America) ==========
  {
    code: 'JFK',
    name: 'ジョン・F・ケネディ国際空港',
    city: 'ニューヨーク',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    hub: true,
    icon: '🗽',
  },
  {
    code: 'LAX',
    name: 'ロサンゼルス国際空港',
    city: 'ロサンゼルス',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 33.9416, lng: -118.4085 },
    hub: true,
    icon: '🎬',
  },
  {
    code: 'SFO',
    name: 'サンフランシスコ国際空港',
    city: 'サンフランシスコ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 37.6213, lng: -122.3790 },
    hub: true,
    icon: '🌉',
  },
  {
    code: 'ORD',
    name: 'オヘア国際空港',
    city: 'シカゴ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 41.9742, lng: -87.9073 },
    hub: true,
    icon: '🌆',
  },
  {
    code: 'MIA',
    name: 'マイアミ国際空港',
    city: 'マイアミ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 25.7959, lng: -80.2870 },
    hub: true,
    icon: '🏖️',
  },
  {
    code: 'DFW',
    name: 'ダラス・フォートワース国際空港',
    city: 'ダラス',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 32.8998, lng: -97.0403 },
    hub: true,
    icon: '🤠',
  },
  {
    code: 'SEA',
    name: 'シアトル・タコマ国際空港',
    city: 'シアトル',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 47.4502, lng: -122.3088 },
    hub: false,
    icon: '☕',
  },
  {
    code: 'YYZ',
    name: 'トロント・ピアソン国際空港',
    city: 'トロント',
    country: 'カナダ',
    region: 'north_america',
    coordinates: { lat: 43.6777, lng: -79.6248 },
    hub: true,
    icon: '🍁',
  },
  {
    code: 'YVR',
    name: 'バンクーバー国際空港',
    city: 'バンクーバー',
    country: 'カナダ',
    region: 'north_america',
    coordinates: { lat: 49.1967, lng: -123.1815 },
    hub: false,
    icon: '🏔️',
  },
  {
    code: 'MEX',
    name: 'メキシコシティ国際空港',
    city: 'メキシコシティ',
    country: 'メキシコ',
    region: 'north_america',
    coordinates: { lat: 19.4363, lng: -99.0721 },
    hub: true,
    icon: '🌮',
  },

  // ========== 南米 (South America) ==========
  {
    code: 'GRU',
    name: 'グアルーリョス国際空港',
    city: 'サンパウロ',
    country: 'ブラジル',
    region: 'south_america',
    coordinates: { lat: -23.4356, lng: -46.4731 },
    hub: true,
    icon: '🇧🇷',
  },
  {
    code: 'GIG',
    name: 'ガレオン国際空港',
    city: 'リオデジャネイロ',
    country: 'ブラジル',
    region: 'south_america',
    coordinates: { lat: -22.8100, lng: -43.2505 },
    hub: false,
    icon: '🎭',
  },
  {
    code: 'EZE',
    name: 'エセイサ国際空港',
    city: 'ブエノスアイレス',
    country: 'アルゼンチン',
    region: 'south_america',
    coordinates: { lat: -34.8222, lng: -58.5358 },
    hub: false,
    icon: '💃',
  },
  {
    code: 'LIM',
    name: 'ホルヘ・チャベス国際空港',
    city: 'リマ',
    country: 'ペルー',
    region: 'south_america',
    coordinates: { lat: -12.0219, lng: -77.1143 },
    hub: false,
    icon: '🏔️',
  },
  {
    code: 'SCL',
    name: 'アルトゥーロ・メリノ・ベニテス国際空港',
    city: 'サンティアゴ',
    country: 'チリ',
    region: 'south_america',
    coordinates: { lat: -33.3930, lng: -70.7858 },
    hub: false,
    icon: '🍷',
  },

  // ========== オセアニア (Oceania) ==========
  {
    code: 'SYD',
    name: 'シドニー国際空港',
    city: 'シドニー',
    country: 'オーストラリア',
    region: 'oceania',
    coordinates: { lat: -33.9399, lng: 151.1753 },
    hub: true,
    icon: '🦘',
  },
  {
    code: 'MEL',
    name: 'メルボルン空港',
    city: 'メルボルン',
    country: 'オーストラリア',
    region: 'oceania',
    coordinates: { lat: -37.6690, lng: 144.8410 },
    hub: false,
    icon: '🏏',
  },
  {
    code: 'AKL',
    name: 'オークランド空港',
    city: 'オークランド',
    country: 'ニュージーランド',
    region: 'oceania',
    coordinates: { lat: -37.0082, lng: 174.7850 },
    hub: false,
    icon: '🥝',
  },

  // ========== 中東 (Middle East) ==========
  {
    code: 'DXB',
    name: 'ドバイ国際空港',
    city: 'ドバイ',
    country: 'アラブ首長国連邦',
    region: 'middle_east',
    coordinates: { lat: 25.2532, lng: 55.3657 },
    hub: true,
    icon: '🏙️',
  },
  {
    code: 'DOH',
    name: 'ハマド国際空港',
    city: 'ドーハ',
    country: 'カタール',
    region: 'middle_east',
    coordinates: { lat: 25.2731, lng: 51.6081 },
    hub: true,
    icon: '⚽',
  },
  {
    code: 'IST',
    name: 'イスタンブール空港',
    city: 'イスタンブール',
    country: 'トルコ',
    region: 'middle_east',
    coordinates: { lat: 41.2753, lng: 28.7519 },
    hub: true,
    icon: '🕌',
  },

  // ========== アフリカ (Africa) ==========
  {
    code: 'JNB',
    name: 'O・R・タンボ国際空港',
    city: 'ヨハネスブルグ',
    country: '南アフリカ',
    region: 'africa',
    coordinates: { lat: -26.1392, lng: 28.2460 },
    hub: true,
    icon: '🦁',
  },
  {
    code: 'CAI',
    name: 'カイロ国際空港',
    city: 'カイロ',
    country: 'エジプト',
    region: 'africa',
    coordinates: { lat: 30.1219, lng: 31.4056 },
    hub: true,
    icon: '🏛️',
  },
];

// ======================================
// ヘルパー関数
// ======================================

/**
 * 空港コードから空港情報を取得
 */
export function getAirportByCode(code: string): Airport | undefined {
  return AIRPORTS.find(airport => airport.code === code);
}

/**
 * 地域で空港をフィルタ
 */
export function getAirportsByRegion(region: WorldRegion): Airport[] {
  return AIRPORTS.filter(airport => airport.region === region);
}

/**
 * ハブ空港のみ取得
 */
export function getHubAirports(): Airport[] {
  return AIRPORTS.filter(airport => airport.hub);
}

/**
 * 2つの空港間の距離を計算（km）
 * ハバーサイン公式を使用
 */
export function calculateDistance(from: Airport, to: Airport): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(to.coordinates.lat - from.coordinates.lat);
  const dLng = toRad(to.coordinates.lng - from.coordinates.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.coordinates.lat)) *
      Math.cos(toRad(to.coordinates.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * 距離からマス数を計算
 * 1000kmあたり1マス（端数切り上げ）
 * 例: 800km = 1マス, 1200km = 2マス, 5500km = 6マス
 */
export function distanceToSpaces(distanceKm: number): number {
  return Math.ceil(distanceKm / 1000);
}

/**
 * サイコロの目で到達可能かどうかを判定
 * 1ターンで移動できるのは最大6マス（6000km）
 */
export function canReachInOneTurn(distanceKm: number, diceRoll: number): boolean {
  const spacesNeeded = distanceToSpaces(distanceKm);
  return spacesNeeded <= diceRoll;
}

/**
 * 中継地点を計算
 * 遠距離の場合、途中の空港を経由地として提案
 */
export function findWaypointAirports(
  from: Airport,
  to: Airport,
  maxSpaces: number
): Airport[] {
  const totalDistance = calculateDistance(from, to);
  const totalSpaces = distanceToSpaces(totalDistance);

  // 1ターンで到達可能なら中継不要
  if (totalSpaces <= maxSpaces) return [];

  // 目的地方向にある空港を探し、到達可能な範囲内の候補を返す
  const maxDistanceKm = maxSpaces * 1000;

  // 方向ベクトルを計算
  const dirLat = to.coordinates.lat - from.coordinates.lat;
  const dirLng = to.coordinates.lng - from.coordinates.lng;

  const candidates = AIRPORTS
    .filter(airport => {
      if (airport.code === from.code || airport.code === to.code) return false;

      const distance = calculateDistance(from, airport);
      // 到達可能距離内かつ、目的地に近づく方向にある空港
      if (distance > maxDistanceKm || distance < 500) return false;

      // 目的地に向かう方向にあるかチェック
      const toAirportLat = airport.coordinates.lat - from.coordinates.lat;
      const toAirportLng = airport.coordinates.lng - from.coordinates.lng;

      // 内積が正なら同じ方向
      const dotProduct = dirLat * toAirportLat + dirLng * toAirportLng;
      return dotProduct > 0;
    })
    .map(airport => ({
      airport,
      distance: calculateDistance(from, airport),
      remainingDistance: calculateDistance(airport, to),
    }))
    // 目的地に近い順でソート
    .sort((a, b) => a.remainingDistance - b.remainingDistance)
    .slice(0, 5) // 上位5件
    .map(item => item.airport);

  return candidates;
}

/**
 * 空港の統計情報を取得
 */
export function getAirportStats() {
  const stats = {
    total: AIRPORTS.length,
    hubs: AIRPORTS.filter(a => a.hub).length,
    byRegion: {
      asia: getAirportsByRegion('asia').length,
      europe: getAirportsByRegion('europe').length,
      north_america: getAirportsByRegion('north_america').length,
      south_america: getAirportsByRegion('south_america').length,
      oceania: getAirportsByRegion('oceania').length,
      middle_east: getAirportsByRegion('middle_east').length,
      africa: getAirportsByRegion('africa').length,
    },
  };
  return stats;
}
