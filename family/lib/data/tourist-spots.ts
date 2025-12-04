// ======================================
// 世界の感動スポットデータ（Phase 1）
// ======================================

import { TouristSpot, EmotionCategory } from '@/lib/types/world-tour';

export const TOURIST_SPOTS: TouristSpot[] = [
  // ========== アジア ==========
  {
    id: 'fuji',
    name: '富士山',
    description: '日本の象徴である美しい霊峰。四季折々の表情を見せる世界遺産。',
    nearestAirport: 'HND',
    transportFromAirport: {
      method: 'bus',
      duration: 150,
      description: '羽田空港からバスで約2時間30分',
    },
    emotionCategory: 'beauty',
    emotionPoints: 150,
    icon: '🗻',
    country: '日本',
    isWorldHeritage: true,
    visitEvent: {
      title: '富士山の絶景',
      description: '雲海から頭を出す富士山の姿に息を呑む...',
      choices: [
        { text: '写真を撮る', result: { emotionPoints: 20, message: '最高の一枚が撮れた！' } },
        { text: 'しばらく眺める', result: { emotionPoints: 30, message: '心が洗われるような体験...' } },
      ],
    },
  },
  {
    id: 'great-wall',
    name: '万里の長城',
    description: '全長21,000kmを超える人類史上最大の建造物。',
    nearestAirport: 'PEK',
    transportFromAirport: {
      method: 'bus',
      duration: 90,
      description: '北京市内からバスで約1時間30分',
    },
    emotionCategory: 'wonder',
    emotionPoints: 200,
    icon: '🏯',
    country: '中国',
    isWorldHeritage: true,
    visitEvent: {
      title: '万里の長城を歩く',
      description: '山々を縫うように続く長城の壮大さに圧倒される...',
    },
  },
  {
    id: 'angkor-wat',
    name: 'アンコールワット',
    description: '世界最大級の宗教建築物。カンボジアの誇る神秘の遺跡。',
    nearestAirport: 'BKK',
    transportFromAirport: {
      method: 'bus',
      duration: 480,
      description: 'バンコクから陸路で約8時間（またはシェムリアップへ飛行機）',
    },
    emotionCategory: 'wonder',
    emotionPoints: 180,
    icon: '🛕',
    country: 'カンボジア',
    isWorldHeritage: true,
  },
  {
    id: 'taj-mahal',
    name: 'タージマハル',
    description: '愛の象徴として知られる白亜の霊廟。ムガル帝国の傑作。',
    nearestAirport: 'DEL',
    transportFromAirport: {
      method: 'train',
      duration: 180,
      description: 'デリーから特急列車で約3時間',
    },
    emotionCategory: 'beauty',
    emotionPoints: 200,
    icon: '🕌',
    country: 'インド',
    isWorldHeritage: true,
    visitEvent: {
      title: '白亜の宮殿',
      description: '朝日に照らされたタージマハルの荘厳な美しさ...',
      choices: [
        { text: '建築の細部を観察', result: { emotionPoints: 25, message: '職人技に感嘆！' } },
        { text: '愛の物語に思いを馳せる', result: { emotionPoints: 35, message: '深い感動に包まれた' } },
      ],
    },
  },

  // ========== ヨーロッパ ==========
  {
    id: 'eiffel-tower',
    name: 'エッフェル塔',
    description: 'パリのシンボル。夜のライトアップは格別の美しさ。',
    nearestAirport: 'CDG',
    transportFromAirport: {
      method: 'train',
      duration: 60,
      description: 'シャルル・ド・ゴール空港から電車で約1時間',
    },
    emotionCategory: 'joy',
    emotionPoints: 120,
    icon: '🗼',
    country: 'フランス',
    isWorldHeritage: false,
    visitEvent: {
      title: 'パリの夜景',
      description: 'エッフェル塔からのパリの夜景は言葉を失う美しさ...',
    },
  },
  {
    id: 'colosseum',
    name: 'コロッセオ',
    description: '古代ローマの円形闘技場。2000年の歴史を感じる世界遺産。',
    nearestAirport: 'FCO',
    transportFromAirport: {
      method: 'train',
      duration: 50,
      description: 'フィウミチーノ空港から電車で約50分',
    },
    emotionCategory: 'reflection',
    emotionPoints: 160,
    icon: '🏛️',
    country: 'イタリア',
    isWorldHeritage: true,
  },
  {
    id: 'sagrada-familia',
    name: 'サグラダ・ファミリア',
    description: 'ガウディの未完の傑作。130年以上建設が続く奇跡の教会。',
    nearestAirport: 'BCN',
    transportFromAirport: {
      method: 'train',
      duration: 40,
      description: 'バルセロナ空港から電車で約40分',
    },
    emotionCategory: 'wonder',
    emotionPoints: 180,
    icon: '⛪',
    country: 'スペイン',
    isWorldHeritage: true,
    visitEvent: {
      title: '光のステンドグラス',
      description: '色とりどりの光が降り注ぐ聖堂内部の神秘的な空間...',
      choices: [
        { text: '塔に登る', result: { emotionPoints: 40, message: 'バルセロナの絶景！' } },
        { text: '静かに祈る', result: { emotionPoints: 30, message: '心が安らいだ' } },
      ],
    },
  },
  {
    id: 'santorini',
    name: 'サントリーニ島',
    description: 'エーゲ海に浮かぶ白と青の美しい島。世界一の夕日スポット。',
    nearestAirport: 'ATH',
    transportFromAirport: {
      method: 'boat',
      duration: 300,
      description: 'アテネからフェリーで約5時間',
    },
    emotionCategory: 'beauty',
    emotionPoints: 200,
    icon: '🏝️',
    country: 'ギリシャ',
    isWorldHeritage: false,
    visitEvent: {
      title: 'エーゲ海の夕日',
      description: '白い街並みと青い海に沈む黄金の夕日...',
      choices: [
        { text: 'ワインを片手に', result: { emotionPoints: 35, message: '至福のひととき' } },
        { text: '写真に収める', result: { emotionPoints: 25, message: '一生の思い出' } },
      ],
    },
  },
  {
    id: 'northern-lights',
    name: 'オーロラ観測',
    description: '北極圏で見る神秘のカーテン。自然が生み出す最高の芸術。',
    nearestAirport: 'HEL',
    transportFromAirport: {
      method: 'bus',
      duration: 240,
      description: 'ヘルシンキからラップランドへバスで約4時間',
    },
    emotionCategory: 'wonder',
    emotionPoints: 250,
    icon: '🌌',
    country: 'フィンランド',
    isWorldHeritage: false,
    visitEvent: {
      title: '天空のカーテン',
      description: '緑と紫に揺らめくオーロラが夜空を舞う...',
      choices: [
        { text: '静かに見つめる', result: { emotionPoints: 50, message: '言葉にならない感動...' } },
        { text: '願い事をする', result: { emotionPoints: 40, message: '夢が叶いそう！' } },
      ],
    },
  },

  // ========== 北米 ==========
  {
    id: 'statue-of-liberty',
    name: '自由の女神',
    description: 'アメリカの自由と民主主義の象徴。ニューヨークのシンボル。',
    nearestAirport: 'JFK',
    transportFromAirport: {
      method: 'train',
      duration: 90,
      description: 'JFK空港からマンハッタン経由フェリーで約1時間30分',
    },
    emotionCategory: 'joy',
    emotionPoints: 140,
    icon: '🗽',
    country: 'アメリカ',
    isWorldHeritage: true,
  },
  {
    id: 'grand-canyon',
    name: 'グランドキャニオン',
    description: '数十億年の地球の歴史を刻む大渓谷。圧倒的なスケール。',
    nearestAirport: 'LAX',
    transportFromAirport: {
      method: 'car',
      duration: 420,
      description: 'ロサンゼルスから車で約7時間',
    },
    emotionCategory: 'wonder',
    emotionPoints: 220,
    icon: '🏜️',
    country: 'アメリカ',
    isWorldHeritage: true,
    visitEvent: {
      title: '大地の芸術',
      description: '見渡す限り続く赤茶色の渓谷。地球の偉大さを感じる...',
      choices: [
        { text: 'ヘリコプターツアー', result: { emotionPoints: 50, message: '空から見る絶景！' } },
        { text: '谷底までハイキング', result: { emotionPoints: 60, message: '達成感と感動！' } },
      ],
    },
  },
  {
    id: 'niagara-falls',
    name: 'ナイアガラの滝',
    description: '世界三大瀑布の一つ。毎分1億6千万リットルの水が落下。',
    nearestAirport: 'YYZ',
    transportFromAirport: {
      method: 'bus',
      duration: 90,
      description: 'トロントからバスで約1時間30分',
    },
    emotionCategory: 'wonder',
    emotionPoints: 170,
    icon: '💧',
    country: 'カナダ',
    isWorldHeritage: false,
  },

  // ========== 南米 ==========
  {
    id: 'machu-picchu',
    name: 'マチュピチュ',
    description: '空中都市と呼ばれるインカ帝国の遺跡。世界で最も神秘的な場所の一つ。',
    nearestAirport: 'LIM',
    transportFromAirport: {
      method: 'train',
      duration: 480,
      description: 'リマからクスコ経由、列車で約8時間',
    },
    emotionCategory: 'wonder',
    emotionPoints: 250,
    icon: '🏔️',
    country: 'ペルー',
    isWorldHeritage: true,
    visitEvent: {
      title: '天空の都市',
      description: '雲海の上に浮かぶ古代都市の姿に時を忘れる...',
      choices: [
        { text: 'ワイナピチュに登る', result: { emotionPoints: 60, message: '最高の眺め！' } },
        { text: '遺跡をゆっくり散策', result: { emotionPoints: 45, message: 'インカの知恵に感動' } },
      ],
    },
  },
  {
    id: 'rio-carnival',
    name: 'リオのカーニバル',
    description: '世界最大のカーニバル。音楽とダンスの祭典。',
    nearestAirport: 'GIG',
    transportFromAirport: {
      method: 'car',
      duration: 30,
      description: 'ガレオン空港から車で約30分',
    },
    emotionCategory: 'fun',
    emotionPoints: 200,
    icon: '🎭',
    country: 'ブラジル',
    isWorldHeritage: false,
    visitEvent: {
      title: 'サンバの熱狂',
      description: 'リズムに身を任せ、踊り明かす一夜...',
      choices: [
        { text: 'パレードに参加', result: { emotionPoints: 60, message: '最高に楽しい！' } },
        { text: '観客として楽しむ', result: { emotionPoints: 40, message: '華やかな衣装に感動' } },
      ],
    },
  },
  {
    id: 'christ-redeemer',
    name: 'コルコバードのキリスト像',
    description: 'リオデジャネイロを見守る巨大なキリスト像。新・世界七不思議の一つ。',
    nearestAirport: 'GIG',
    transportFromAirport: {
      method: 'train',
      duration: 60,
      description: 'ガレオン空港から登山電車で約1時間',
    },
    emotionCategory: 'reflection',
    emotionPoints: 160,
    icon: '✝️',
    country: 'ブラジル',
    isWorldHeritage: false,
  },

  // ========== オセアニア ==========
  {
    id: 'sydney-opera',
    name: 'シドニー・オペラハウス',
    description: '帆のような屋根が特徴的な20世紀を代表する建築物。',
    nearestAirport: 'SYD',
    transportFromAirport: {
      method: 'train',
      duration: 30,
      description: 'シドニー空港から電車で約30分',
    },
    emotionCategory: 'beauty',
    emotionPoints: 140,
    icon: '🎭',
    country: 'オーストラリア',
    isWorldHeritage: true,
  },
  {
    id: 'great-barrier-reef',
    name: 'グレートバリアリーフ',
    description: '世界最大のサンゴ礁。宇宙からも見える生きた芸術。',
    nearestAirport: 'SYD',
    transportFromAirport: {
      method: 'bus',
      duration: 1440,
      description: 'シドニーからケアンズへ国内線、そこから船で',
    },
    emotionCategory: 'beauty',
    emotionPoints: 220,
    icon: '🐠',
    country: 'オーストラリア',
    isWorldHeritage: true,
    visitEvent: {
      title: '海の宝石',
      description: '色とりどりのサンゴと熱帯魚が織りなす海中の楽園...',
      choices: [
        { text: 'スキューバダイビング', result: { emotionPoints: 55, message: '海中世界に感動！' } },
        { text: 'グラスボートで観察', result: { emotionPoints: 35, message: '美しいサンゴ礁' } },
      ],
    },
  },
  {
    id: 'milford-sound',
    name: 'ミルフォード・サウンド',
    description: 'フィヨルドが作り出す神秘的な景観。世界で最も美しい場所の一つ。',
    nearestAirport: 'AKL',
    transportFromAirport: {
      method: 'car',
      duration: 720,
      description: 'オークランドからクイーンズタウン経由で約12時間',
    },
    emotionCategory: 'beauty',
    emotionPoints: 200,
    icon: '⛰️',
    country: 'ニュージーランド',
    isWorldHeritage: true,
  },

  // ========== 中東・アフリカ ==========
  {
    id: 'pyramids',
    name: 'ギザのピラミッド',
    description: '古代エジプト文明の象徴。世界七不思議で唯一現存する建造物。',
    nearestAirport: 'CAI',
    transportFromAirport: {
      method: 'car',
      duration: 45,
      description: 'カイロ空港から車で約45分',
    },
    emotionCategory: 'wonder',
    emotionPoints: 230,
    icon: '🏛️',
    country: 'エジプト',
    isWorldHeritage: true,
    visitEvent: {
      title: '4500年の時を超えて',
      description: '砂漠にそびえる巨大なピラミッドの前に立つ...',
      choices: [
        { text: '内部を探検', result: { emotionPoints: 45, message: '古代の謎に触れた' } },
        { text: 'ラクダに乗って周遊', result: { emotionPoints: 40, message: '砂漠の冒険！' } },
      ],
    },
  },
  {
    id: 'burj-khalifa',
    name: 'ブルジュ・ハリファ',
    description: '世界一高い建造物（828m）。近未来都市ドバイのシンボル。',
    nearestAirport: 'DXB',
    transportFromAirport: {
      method: 'train',
      duration: 25,
      description: 'ドバイ空港からメトロで約25分',
    },
    emotionCategory: 'wonder',
    emotionPoints: 150,
    icon: '🏙️',
    country: 'アラブ首長国連邦',
    isWorldHeritage: false,
    visitEvent: {
      title: '天空の展望台',
      description: '地上555mからの眺め。雲を見下ろす体験...',
    },
  },
  {
    id: 'safari',
    name: 'アフリカンサファリ',
    description: '野生動物の楽園で出会うビッグファイブ。命の躍動を感じる。',
    nearestAirport: 'JNB',
    transportFromAirport: {
      method: 'car',
      duration: 300,
      description: 'ヨハネスブルグからクルーガー国立公園へ車で約5時間',
    },
    emotionCategory: 'fun',
    emotionPoints: 200,
    icon: '🦁',
    country: '南アフリカ',
    isWorldHeritage: false,
    visitEvent: {
      title: '野生の王国',
      description: 'ライオン、ゾウ、キリン...野生動物との遭遇...',
      choices: [
        { text: '早朝サファリ', result: { emotionPoints: 50, message: 'ライオンの狩りを目撃！' } },
        { text: '夕暮れサファリ', result: { emotionPoints: 45, message: '夕日と動物たちの共演' } },
      ],
    },
  },
];

// ======================================
// ヘルパー関数
// ======================================

/**
 * IDからスポット情報を取得
 */
export function getSpotById(id: string): TouristSpot | undefined {
  return TOURIST_SPOTS.find(spot => spot.id === id);
}

/**
 * 最寄り空港でフィルタ
 */
export function getSpotsByAirport(airportCode: string): TouristSpot[] {
  return TOURIST_SPOTS.filter(spot => spot.nearestAirport === airportCode);
}

/**
 * 感動カテゴリーでフィルタ
 */
export function getSpotsByEmotion(category: EmotionCategory): TouristSpot[] {
  return TOURIST_SPOTS.filter(spot => spot.emotionCategory === category);
}

/**
 * 世界遺産のみ取得
 */
export function getWorldHeritageSpots(): TouristSpot[] {
  return TOURIST_SPOTS.filter(spot => spot.isWorldHeritage);
}

/**
 * ランダムにスポットを1つ選択
 */
export function getRandomSpot(): TouristSpot {
  const randomIndex = Math.floor(Math.random() * TOURIST_SPOTS.length);
  return TOURIST_SPOTS[randomIndex];
}

/**
 * 統計情報を取得
 */
export function getSpotStats() {
  return {
    total: TOURIST_SPOTS.length,
    worldHeritage: TOURIST_SPOTS.filter(s => s.isWorldHeritage).length,
    byEmotion: {
      fun: getSpotsByEmotion('fun').length,
      joy: getSpotsByEmotion('joy').length,
      beauty: getSpotsByEmotion('beauty').length,
      wonder: getSpotsByEmotion('wonder').length,
      reflection: getSpotsByEmotion('reflection').length,
    },
  };
}
