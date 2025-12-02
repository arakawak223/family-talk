/**
 * 双六ゲームの初期データをセットアップ
 * 管理者が手動で実行する関数
 */

import { createClient } from "@/lib/supabase/client";

export async function initializeSugorokuGifts() {
  const supabase = createClient();

  const gifts = [
    // バッジ系（Common）
    { name: '🌟 スターバッジ', description: '最初のスター！', gift_type: 'badge', rarity: 'common', metadata: { icon: '⭐' } },
    { name: '💙 ハートバッジ', description: '家族への愛を表現', gift_type: 'badge', rarity: 'common', metadata: { icon: '💙' } },
    { name: '🎈 バルーンバッジ', description: '楽しい思い出', gift_type: 'badge', rarity: 'common', metadata: { icon: '🎈' } },
    { name: '🌸 フラワーバッジ', description: 'きれいな花', gift_type: 'badge', rarity: 'common', metadata: { icon: '🌸' } },
    { name: '🍀 クローバーバッジ', description: '幸運のしるし', gift_type: 'badge', rarity: 'common', metadata: { icon: '🍀' } },

    // バッジ系（Rare）
    { name: '👑 クラウンバッジ', description: '王冠を手に入れた！', gift_type: 'badge', rarity: 'rare', metadata: { icon: '👑' } },
    { name: '🏆 トロフィーバッジ', description: '勝利の証', gift_type: 'badge', rarity: 'rare', metadata: { icon: '🏆' } },
    { name: '💎 ダイヤモンドバッジ', description: '輝く宝石', gift_type: 'badge', rarity: 'rare', metadata: { icon: '💎' } },
    { name: '🌈 レインボーバッジ', description: '虹色の輝き', gift_type: 'badge', rarity: 'rare', metadata: { icon: '🌈' } },

    // バッジ系（Legendary）
    { name: '🔥 炎のバッジ', description: '情熱の証', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '🔥' } },
    { name: '⚡ 稲妻バッジ', description: '電撃のパワー', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '⚡' } },
    { name: '🎯 パーフェクトバッジ', description: '完璧な達成', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '🎯' } },

    // フレーム系（Rare）
    { name: 'ゴールドフレーム', description: 'メッセージを金色の枠で飾る', gift_type: 'frame', rarity: 'rare', metadata: { color: '#FFD700', border: '3px solid #FFD700' } },
    { name: 'シルバーフレーム', description: 'メッセージを銀色の枠で飾る', gift_type: 'frame', rarity: 'rare', metadata: { color: '#C0C0C0', border: '3px solid #C0C0C0' } },

    // カラー系（Common）
    { name: 'パステルピンク', description: 'やさしいピンク色', gift_type: 'color', rarity: 'common', metadata: { color: '#FFB6C1' } },
    { name: 'スカイブルー', description: '爽やかな青色', gift_type: 'color', rarity: 'common', metadata: { color: '#87CEEB' } },
    { name: 'ミントグリーン', description: '涼しげな緑色', gift_type: 'color', rarity: 'common', metadata: { color: '#98FF98' } },

    // エフェクト系（Legendary）
    { name: '✨ キラキラエフェクト', description: 'メッセージがキラキラ輝く', gift_type: 'effect', rarity: 'legendary', metadata: { effect: 'sparkle' } },
    { name: '🎆 花火エフェクト', description: 'メッセージに花火が上がる', gift_type: 'effect', rarity: 'legendary', metadata: { effect: 'fireworks' } },
  ];

  console.log('Initializing gifts...');

  for (const gift of gifts) {
    const { error } = await supabase
      .from('gifts')
      .upsert(gift, { onConflict: 'name', ignoreDuplicates: true });

    if (error) {
      console.error(`Error inserting gift ${gift.name}:`, error);
    } else {
      console.log(`✓ Gift added: ${gift.name}`);
    }
  }

  console.log('Gifts initialization complete!');
  return { success: true, count: gifts.length };
}

export async function initializeBoardSquares(boardNumber: number) {
  const supabase = createClient();

  // ボードIDを取得
  const { data: board } = await supabase
    .from('sugoroku_boards')
    .select('id')
    .eq('board_number', boardNumber)
    .single();

  if (!board) {
    console.error(`Board ${boardNumber} not found`);
    return { success: false, error: 'Board not found' };
  }

  // 世界の名所を巡る30マスの旅
  const board1Squares = [
    {
      position: 0, square_type: 'normal', event_data: {}, description: 'スタート！東京から世界一周の旅へ',
      location: { country: '日本', region: '東京', landmark: '東京タワー', icon: '🗼', description: '東京のシンボル、333mの電波塔' }
    },
    {
      position: 1, square_type: 'normal', event_data: {}, description: '富士山を眺めよう',
      location: { country: '日本', region: '静岡・山梨', landmark: '富士山', icon: '🗻', description: '日本最高峰、標高3,776mの霊峰' }
    },
    {
      position: 2, square_type: 'gift', event_data: { rarity: 'common' }, description: '中国の大都市に到着',
      location: { country: '中国', region: '北京', landmark: '万里の長城', icon: '🏯', description: '全長2万キロ超の世界最大の城壁' }
    },
    {
      position: 3, square_type: 'bonus', event_data: { points: 30 }, description: 'タイの首都でボーナス',
      location: { country: 'タイ', region: 'バンコク', landmark: 'ワット・アルン', icon: '🛕', description: '暁の寺として知られる美しい寺院' }
    },
    {
      position: 4, square_type: 'normal', event_data: {}, description: '世界遺産の遺跡',
      location: { country: 'カンボジア', region: 'シェムリアップ', landmark: 'アンコールワット', icon: '🏛️', description: '12世紀建造の巨大な石造寺院' }
    },
    {
      position: 5, square_type: 'family_event', event_data: { pointsPerMember: 20 }, description: 'インドの名所で家族イベント',
      location: { country: 'インド', region: 'アーグラ', landmark: 'タージマハル', icon: '🕌', description: '白大理石の美しい霊廟' }
    },
    {
      position: 6, square_type: 'normal', event_data: {}, description: '世界最高峰の近くへ',
      location: { country: 'ネパール', region: 'カトマンズ', landmark: 'エベレスト', icon: '🏔️', description: '標高8,849mの世界最高峰' }
    },
    {
      position: 7, square_type: 'gift', event_data: { rarity: 'common' }, description: 'アラブの都市でギフト',
      location: { country: 'UAE', region: 'ドバイ', landmark: 'ブルジュ・ハリファ', icon: '🏙️', description: '世界一高い超高層ビル、828m' }
    },
    {
      position: 8, square_type: 'normal', event_data: {}, description: '古代文明の遺跡',
      location: { country: 'エジプト', region: 'カイロ', landmark: 'ピラミッド', icon: '🏜️', description: '紀元前2500年建造の巨大な墳墓' }
    },
    {
      position: 9, square_type: 'bonus', event_data: { points: 50 }, description: 'サハラ砂漠でボーナス',
      location: { country: 'モロッコ', region: 'マラケシュ', landmark: 'サハラ砂漠', icon: '🐫', description: '世界最大級の砂漠' }
    },
    {
      position: 10, square_type: 'normal', event_data: {}, description: 'アフリカのサバンナ',
      location: { country: 'タンザニア', region: 'セレンゲティ', landmark: 'セレンゲティ国立公園', icon: '🦁', description: '野生動物の大移動で有名' }
    },
    {
      position: 11, square_type: 'gift', event_data: { rarity: 'rare' }, description: '南アフリカの大自然',
      location: { country: 'ジンバブエ', region: 'ビクトリアフォールズ', landmark: 'ビクトリアの滝', icon: '💧', description: '世界三大瀑布の一つ' }
    },
    {
      position: 12, square_type: 'normal', event_data: {}, description: 'ギリシャの古代遺跡',
      location: { country: 'ギリシャ', region: 'アテネ', landmark: 'パルテノン神殿', icon: '🏛️', description: '紀元前5世紀建造の女神アテナの神殿' }
    },
    {
      position: 13, square_type: 'bonus', event_data: { points: 70 }, description: 'イタリアの首都でボーナス',
      location: { country: 'イタリア', region: 'ローマ', landmark: 'コロッセオ', icon: '🏟️', description: '古代ローマの円形闘技場' }
    },
    {
      position: 14, square_type: 'normal', event_data: {}, description: '傾いた塔で有名',
      location: { country: 'イタリア', region: 'ピサ', landmark: 'ピサの斜塔', icon: '🗼', description: '傾いた鐘楼として世界的に有名' }
    },
    {
      position: 15, square_type: 'family_event', event_data: { pointsPerMember: 30 }, description: 'フランスの首都で家族イベント',
      location: { country: 'フランス', region: 'パリ', landmark: 'エッフェル塔', icon: '🗼', description: 'パリのシンボル、高さ324mの鉄塔' }
    },
    {
      position: 16, square_type: 'normal', event_data: {}, description: '海に浮かぶ修道院',
      location: { country: 'フランス', region: 'ノルマンディー', landmark: 'モンサンミッシェル', icon: '🏰', description: '海に浮かぶ神秘的な修道院' }
    },
    {
      position: 17, square_type: 'gift', event_data: { rarity: 'rare' }, description: 'スペインの名建築',
      location: { country: 'スペイン', region: 'バルセロナ', landmark: 'サグラダファミリア', icon: '⛪', description: 'ガウディ設計の未完成の大聖堂' }
    },
    {
      position: 18, square_type: 'normal', event_data: {}, description: 'イギリスの首都',
      location: { country: 'イギリス', region: 'ロンドン', landmark: 'ビッグベン', icon: '🕰️', description: 'ウェストミンスター宮殿の時計塔' }
    },
    {
      position: 19, square_type: 'bonus', event_data: { points: 100 }, description: 'カナダの大自然でボーナス',
      location: { country: 'カナダ', region: 'アルバータ', landmark: 'バンフ国立公園', icon: '🦌', description: 'カナディアンロッキーの美しい国立公園' }
    },
    {
      position: 20, square_type: 'normal', event_data: {}, description: 'アメリカの象徴',
      location: { country: 'アメリカ', region: 'ニューヨーク', landmark: '自由の女神', icon: '🗽', description: '自由と民主主義の象徴' }
    },
    {
      position: 21, square_type: 'gift', event_data: { rarity: 'rare' }, description: 'アメリカの大自然',
      location: { country: 'アメリカ', region: 'アリゾナ', landmark: 'グランドキャニオン', icon: '🏞️', description: '地球の歴史が刻まれた大峡谷' }
    },
    {
      position: 22, square_type: 'normal', event_data: {}, description: '西海岸の名橋',
      location: { country: 'アメリカ', region: 'サンフランシスコ', landmark: 'ゴールデンゲートブリッジ', icon: '🌉', description: '赤い美しい吊り橋' }
    },
    {
      position: 23, square_type: 'family_event', event_data: { pointsPerMember: 40 }, description: 'ハワイで家族イベント',
      location: { country: 'アメリカ', region: 'ハワイ', landmark: 'キラウエア火山', icon: '🌋', description: '活発な火山活動で有名' }
    },
    {
      position: 24, square_type: 'normal', event_data: {}, description: '天空の遺跡',
      location: { country: 'ペルー', region: 'クスコ', landmark: 'マチュピチュ', icon: '⛰️', description: '15世紀インカ帝国の空中都市' }
    },
    {
      position: 25, square_type: 'bonus', event_data: { points: 150 }, description: 'ブラジルの大自然でボーナス',
      location: { country: 'ブラジル', region: 'イグアス', landmark: 'イグアスの滝', icon: '🌴', description: '世界最大級の滝' }
    },
    {
      position: 26, square_type: 'normal', event_data: {}, description: '謎の石像',
      location: { country: 'チリ', region: 'イースター島', landmark: 'モアイ像', icon: '🗿', description: '巨大な石像モアイが並ぶ神秘の島' }
    },
    {
      position: 27, square_type: 'gift', event_data: { rarity: 'legendary' }, description: 'オーストラリアの名建築',
      location: { country: 'オーストラリア', region: 'シドニー', landmark: 'オペラハウス', icon: '🎭', description: '貝殻のような独特な形の歌劇場' }
    },
    {
      position: 28, square_type: 'normal', event_data: {}, description: 'オーストラリアの大自然',
      location: { country: 'オーストラリア', region: 'ニューサウスウェールズ', landmark: 'ブルーマウンテンズ', icon: '🌲', description: 'ユーカリの森が広がる山岳地帯' }
    },
    {
      position: 29, square_type: 'bonus', event_data: { points: 200 }, description: 'もうすぐゴール！',
      location: { country: 'シンガポール', region: 'マリーナベイ', landmark: 'マリーナベイサンズ', icon: '🏨', description: '屋上プールで有名な統合リゾート' }
    },
    {
      position: 30, square_type: 'goal', event_data: { points: 500 }, description: '世界一周完了！',
      location: { country: '日本', region: '東京', landmark: '東京タワー', icon: '🎌', description: '東京に帰還！世界一周達成おめでとう！' }
    },
  ];

  console.log(`Initializing squares for board ${boardNumber}...`);

  for (const square of board1Squares) {
    const { error } = await supabase
      .from('sugoroku_squares')
      .upsert(
        { ...square, board_id: board.id },
        { onConflict: 'board_id,position', ignoreDuplicates: true }
      );

    if (error) {
      console.error(`Error inserting square at position ${square.position}:`, error);
    } else {
      console.log(`✓ Square ${square.position} added`);
    }
  }

  console.log('Squares initialization complete!');
  return { success: true, count: board1Squares.length };
}
