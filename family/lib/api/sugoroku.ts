// ======================================
// 双六ゲーム API関数
// ======================================

import { createClient } from "@/lib/supabase/client";
import {
  SugorokuBoard,
  SugorokuSquare,
  UserBoardProgress,
  UserBoardProgressWithBoard,
  DiceHistory,
  RollType,
  Gift,
  UserGift,
  FamilyRanking,
} from "@/lib/types/sugoroku";
import { consumePoints, addPoints } from "./points";

// サイコロ/ルーレット設定
const ROLL_COSTS = {
  dice: 50,
  roulette: 100,
} as const;

/**
 * ボード一覧を取得
 */
export async function getBoards(): Promise<SugorokuBoard[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sugoroku_boards")
    .select("*")
    .eq("is_active", true)
    .order("board_number", { ascending: true });

  if (error) {
    console.error("Error fetching boards:", error);
    return [];
  }

  return data || [];
}

/**
 * ボードのマス一覧を取得
 */
export async function getBoardSquares(boardId: string): Promise<SugorokuSquare[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sugoroku_squares")
    .select("*")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching board squares:", error);
    return [];
  }

  return data || [];
}

/**
 * ユーザーの現在の進捗を取得
 */
export async function getUserProgress(
  userId: string,
  familyId: string
): Promise<UserBoardProgressWithBoard | null> {
  const supabase = createClient();

  // 未完了のボードを取得
  const { data, error } = await supabase
    .from("user_board_progress")
    .select(`
      *,
      board:sugoroku_boards!board_id (*)
    `)
    .eq("user_id", userId)
    .eq("family_id", familyId)
    .eq("is_completed", false)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching user progress:", error);
    return null;
  }

  if (!data) {
    // 初回の場合、ボード1を開始
    return await startNewBoard(userId, familyId, 1);
  }

  return data as UserBoardProgressWithBoard;
}

/**
 * 新しいボードを開始
 */
export async function startNewBoard(
  userId: string,
  familyId: string,
  boardNumber: number
): Promise<UserBoardProgressWithBoard | null> {
  const supabase = createClient();

  try {
    // ボードを取得
    const { data: board, error: boardError } = await supabase
      .from("sugoroku_boards")
      .select("*")
      .eq("board_number", boardNumber)
      .single();

    if (boardError) throw boardError;

    // 進捗を作成
    const { data: progress, error: progressError } = await supabase
      .from("user_board_progress")
      .insert({
        user_id: userId,
        family_id: familyId,
        board_id: board.id,
        current_position: 0,
      })
      .select()
      .single();

    if (progressError) throw progressError;

    return {
      ...progress,
      board,
    };
  } catch (error) {
    console.error("Error starting new board:", error);
    return null;
  }
}

/**
 * サイコロ/ルーレットを振る
 */
export async function rollDice(
  userId: string,
  familyId: string,
  rollType: RollType
): Promise<{
  success: boolean;
  result?: number;
  newPosition?: number;
  square?: SugorokuSquare;
  message?: string;
}> {
  const supabase = createClient();

  try {
    // ポイントチェック
    const cost = ROLL_COSTS[rollType];
    const canAfford = await consumePoints(
      userId,
      familyId,
      cost,
      `${rollType === 'dice' ? 'サイコロ' : 'ルーレット'}を使用`
    );

    if (!canAfford) {
      return {
        success: false,
        message: 'ポイントが足りません',
      };
    }

    // 現在の進捗を取得
    const progress = await getUserProgress(userId, familyId);
    if (!progress) {
      return {
        success: false,
        message: '進捗情報が見つかりません',
      };
    }

    // ランダムな結果を生成
    const maxRoll = rollType === 'dice' ? 6 : 10;
    const result = Math.floor(Math.random() * maxRoll) + 1;

    // 新しい位置を計算
    let newPosition = progress.current_position + result;
    const totalSquares = progress.board.total_squares;

    // ゴールを超えた場合
    let boardCompleted = false;
    if (newPosition >= totalSquares) {
      newPosition = totalSquares;
      boardCompleted = true;
    }

    // 進捗を更新
    const updateData: any = {
      current_position: newPosition,
      updated_at: new Date().toISOString(),
    };

    if (boardCompleted) {
      updateData.is_completed = true;
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("user_board_progress")
      .update(updateData)
      .eq("id", progress.id);

    if (updateError) throw updateError;

    // 履歴を記録
    await supabase.from("dice_history").insert({
      user_id: userId,
      family_id: familyId,
      board_id: progress.board_id,
      roll_type: rollType,
      points_used: cost,
      result,
      position_before: progress.current_position,
      position_after: newPosition,
    });

    // マス情報を取得
    const { data: square } = await supabase
      .from("sugoroku_squares")
      .select("*")
      .eq("board_id", progress.board_id)
      .eq("position", newPosition)
      .single();

    // マスイベントを処理
    if (square) {
      await processSquareEvent(userId, familyId, square);
    }

    return {
      success: true,
      result,
      newPosition,
      square: square || undefined,
    };
  } catch (error) {
    console.error("Error rolling dice:", error);
    return {
      success: false,
      message: 'エラーが発生しました',
    };
  }
}

/**
 * マスイベントを処理
 */
async function processSquareEvent(
  userId: string,
  familyId: string,
  square: SugorokuSquare
): Promise<void> {
  const supabase = createClient();

  try {
    switch (square.square_type) {
      case 'gift':
        // ギフトを付与
        await grantRandomGift(userId, square);
        break;

      case 'bonus':
        // ボーナスポイント付与
        if (square.event_data && 'points' in square.event_data) {
          await addPoints(
            userId,
            familyId,
            'send', // 適切なタイプに変更する必要あり
            undefined,
            `ボーナスマス: +${square.event_data.points}pt`
          );
        }
        break;

      case 'family_event':
        // 家族全員にポイント配布
        if (square.event_data && 'pointsPerMember' in square.event_data) {
          const { data: familyMembers } = await supabase
            .from("family_members")
            .select("user_id")
            .eq("family_id", familyId);

          if (familyMembers) {
            for (const member of familyMembers) {
              await addPoints(
                member.user_id,
                familyId,
                'send',
                undefined,
                `家族イベントボーナス: +${square.event_data.pointsPerMember}pt`
              );
            }
          }
        }
        break;

      case 'goal':
        // ゴール報酬
        if (square.event_data && 'points' in square.event_data) {
          await addPoints(
            userId,
            familyId,
            'send',
            undefined,
            `ボードクリア: +${square.event_data.points}pt`
          );
        }
        break;
    }
  } catch (error) {
    console.error("Error processing square event:", error);
  }
}

/**
 * ランダムなギフトを付与
 */
async function grantRandomGift(userId: string, square: SugorokuSquare): Promise<void> {
  const supabase = createClient();

  try {
    let rarity = 'common';
    if (square.event_data && 'rarity' in square.event_data) {
      rarity = square.event_data.rarity;
    }

    // レアリティに応じたギフトを取得
    const { data: gifts } = await supabase
      .from("gifts")
      .select("*")
      .eq("rarity", rarity)
      .eq("is_active", true);

    if (gifts && gifts.length > 0) {
      // ランダムに選択
      const randomGift = gifts[Math.floor(Math.random() * gifts.length)];

      // ユーザーにギフトを付与
      await supabase.from("user_gifts").insert({
        user_id: userId,
        gift_id: randomGift.id,
        square_id: square.id,
      });
    }
  } catch (error) {
    console.error("Error granting gift:", error);
  }
}

/**
 * ユーザーの獲得ギフト一覧を取得
 */
export async function getUserGifts(userId: string): Promise<UserGift[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_gifts")
    .select(`
      *,
      gift:gifts!gift_id (*)
    `)
    .eq("user_id", userId)
    .order("acquired_at", { ascending: false });

  if (error) {
    console.error("Error fetching user gifts:", error);
    return [];
  }

  return data || [];
}

/**
 * 家族内のランキングを取得
 */
export async function getFamilyRanking(familyId: string): Promise<FamilyRanking[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_board_progress")
    .select(`
      user_id,
      current_position,
      board:sugoroku_boards!board_id (board_number),
      profile:profiles!user_id (display_name, avatar_url),
      points:user_points!user_id (total_points)
    `)
    .eq("family_id", familyId)
    .eq("is_completed", false)
    .order("board_id", { ascending: false })
    .order("current_position", { ascending: false });

  if (error) {
    console.error("Error fetching family ranking:", error);
    return [];
  }

  // ランキング形式に整形
  const rankings: FamilyRanking[] = (data || []).map((item: any, index: number) => ({
    user_id: item.user_id,
    user_name: item.profile?.display_name || '不明',
    avatar_url: item.profile?.avatar_url || null,
    current_position: item.current_position,
    board_number: item.board?.board_number || 1,
    total_points: item.points?.total_points || 0,
    rank: index + 1,
  }));

  return rankings;
}
