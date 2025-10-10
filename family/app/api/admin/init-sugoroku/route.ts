import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // 管理者チェック（簡易版）
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ギフトデータ
    const gifts = [
      { name: '🌟 スターバッジ', description: '最初のスター！', gift_type: 'badge', rarity: 'common', metadata: { icon: '⭐' } },
      { name: '💙 ハートバッジ', description: '家族への愛を表現', gift_type: 'badge', rarity: 'common', metadata: { icon: '💙' } },
      { name: '🎈 バルーンバッジ', description: '楽しい思い出', gift_type: 'badge', rarity: 'common', metadata: { icon: '🎈' } },
      { name: '🌸 フラワーバッジ', description: 'きれいな花', gift_type: 'badge', rarity: 'common', metadata: { icon: '🌸' } },
      { name: '🍀 クローバーバッジ', description: '幸運のしるし', gift_type: 'badge', rarity: 'common', metadata: { icon: '🍀' } },
      { name: '👑 クラウンバッジ', description: '王冠を手に入れた！', gift_type: 'badge', rarity: 'rare', metadata: { icon: '👑' } },
      { name: '🏆 トロフィーバッジ', description: '勝利の証', gift_type: 'badge', rarity: 'rare', metadata: { icon: '🏆' } },
      { name: '💎 ダイヤモンドバッジ', description: '輝く宝石', gift_type: 'badge', rarity: 'rare', metadata: { icon: '💎' } },
      { name: '🌈 レインボーバッジ', description: '虹色の輝き', gift_type: 'badge', rarity: 'rare', metadata: { icon: '🌈' } },
      { name: '🔥 炎のバッジ', description: '情熱の証', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '🔥' } },
      { name: '⚡ 稲妻バッジ', description: '電撃のパワー', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '⚡' } },
      { name: '🎯 パーフェクトバッジ', description: '完璧な達成', gift_type: 'badge', rarity: 'legendary', metadata: { icon: '🎯' } },
    ];

    // ギフトを一括投入（ON CONFLICTなし）
    const { error: giftError } = await supabase
      .from('gifts')
      .insert(gifts);

    if (giftError) {
      // 重複エラーは無視
      if (giftError.code !== '23505') {
        console.error('Gift insert error:', giftError);
        return NextResponse.json({ error: giftError.message }, { status: 500 });
      }
    }

    // ボード1のマス定義
    const { data: board1 } = await supabase
      .from('sugoroku_boards')
      .select('id')
      .eq('board_number', 1)
      .single();

    if (!board1) {
      return NextResponse.json({ error: 'Board 1 not found' }, { status: 404 });
    }

    const squares = [
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

    const squaresWithBoard = squares.map(sq => ({ ...sq, board_id: board1.id }));

    // まず既存のマスを削除
    await supabase
      .from('sugoroku_squares')
      .delete()
      .eq('board_id', board1.id);

    // 新しいマスを投入
    const { error: squareError } = await supabase
      .from('sugoroku_squares')
      .insert(squaresWithBoard);

    if (squareError) {
      console.error('Square insert error:', squareError);
      return NextResponse.json({ error: squareError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      giftsCount: gifts.length,
      squaresCount: squares.length,
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
