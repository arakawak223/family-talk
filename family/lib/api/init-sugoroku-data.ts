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

  const board1Squares = [
    { position: 0, square_type: 'normal', event_data: {}, description: 'スタート！' },
    { position: 1, square_type: 'normal', event_data: {}, description: '' },
    { position: 2, square_type: 'gift', event_data: { rarity: 'common' }, description: '🎁 ギフトをゲット！' },
    { position: 3, square_type: 'normal', event_data: {}, description: '' },
    { position: 4, square_type: 'bonus', event_data: { points: 30 }, description: '💰 ボーナス +30pt' },
    { position: 5, square_type: 'normal', event_data: {}, description: '' },
    { position: 6, square_type: 'normal', event_data: {}, description: '' },
    { position: 7, square_type: 'gift', event_data: { rarity: 'common' }, description: '🎁 ギフトをゲット！' },
    { position: 8, square_type: 'normal', event_data: {}, description: '' },
    { position: 9, square_type: 'normal', event_data: {}, description: '' },
    { position: 10, square_type: 'bonus', event_data: { points: 50 }, description: '💰 ボーナス +50pt' },
    { position: 11, square_type: 'normal', event_data: {}, description: '' },
    { position: 12, square_type: 'normal', event_data: {}, description: '' },
    { position: 13, square_type: 'gift', event_data: { rarity: 'common' }, description: '🎁 ギフトをゲット！' },
    { position: 14, square_type: 'normal', event_data: {}, description: '' },
    { position: 15, square_type: 'family_event', event_data: { pointsPerMember: 20 }, description: '👨‍👩‍👧‍👦 家族全員に +20pt' },
    { position: 16, square_type: 'normal', event_data: {}, description: '' },
    { position: 17, square_type: 'normal', event_data: {}, description: '' },
    { position: 18, square_type: 'gift', event_data: { rarity: 'rare' }, description: '🎁 レアギフト！' },
    { position: 19, square_type: 'normal', event_data: {}, description: '' },
    { position: 20, square_type: 'bonus', event_data: { points: 70 }, description: '💰 ボーナス +70pt' },
    { position: 21, square_type: 'normal', event_data: {}, description: '' },
    { position: 22, square_type: 'normal', event_data: {}, description: '' },
    { position: 23, square_type: 'gift', event_data: { rarity: 'common' }, description: '🎁 ギフトをゲット！' },
    { position: 24, square_type: 'normal', event_data: {}, description: '' },
    { position: 25, square_type: 'bonus', event_data: { points: 100 }, description: '💰 大ボーナス +100pt' },
    { position: 26, square_type: 'normal', event_data: {}, description: '' },
    { position: 27, square_type: 'normal', event_data: {}, description: '' },
    { position: 28, square_type: 'gift', event_data: { rarity: 'rare' }, description: '🎁 レアギフト！' },
    { position: 29, square_type: 'normal', event_data: {}, description: '' },
    { position: 30, square_type: 'family_event', event_data: { pointsPerMember: 30 }, description: '👨‍👩‍👧‍👦 家族全員に +30pt' },
    { position: 31, square_type: 'normal', event_data: {}, description: '' },
    { position: 32, square_type: 'normal', event_data: {}, description: '' },
    { position: 33, square_type: 'gift', event_data: { rarity: 'rare' }, description: '🎁 レアギフト！' },
    { position: 34, square_type: 'normal', event_data: {}, description: '' },
    { position: 35, square_type: 'bonus', event_data: { points: 120 }, description: '💰 大ボーナス +120pt' },
    { position: 36, square_type: 'normal', event_data: {}, description: '' },
    { position: 37, square_type: 'normal', event_data: {}, description: '' },
    { position: 38, square_type: 'gift', event_data: { rarity: 'rare' }, description: '🎁 レアギフト！' },
    { position: 39, square_type: 'normal', event_data: {}, description: '' },
    { position: 40, square_type: 'bonus', event_data: { points: 150 }, description: '💰 特大ボーナス +150pt' },
    { position: 41, square_type: 'normal', event_data: {}, description: '' },
    { position: 42, square_type: 'normal', event_data: {}, description: '' },
    { position: 43, square_type: 'gift', event_data: { rarity: 'legendary' }, description: '🎁 伝説のギフト！！' },
    { position: 44, square_type: 'normal', event_data: {}, description: '' },
    { position: 45, square_type: 'family_event', event_data: { pointsPerMember: 50 }, description: '👨‍👩‍👧‍👦 家族全員に +50pt' },
    { position: 46, square_type: 'normal', event_data: {}, description: '' },
    { position: 47, square_type: 'normal', event_data: {}, description: '' },
    { position: 48, square_type: 'gift', event_data: { rarity: 'legendary' }, description: '🎁 伝説のギフト！！' },
    { position: 49, square_type: 'bonus', event_data: { points: 200 }, description: '💰 超特大ボーナス +200pt' },
    { position: 50, square_type: 'goal', event_data: { points: 500 }, description: '🏁 ゴール！クリアボーナス +500pt' },
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
