// ======================================
// 双六ゲーム API関数
// ======================================

import { createClient } from "@/lib/supabase/client";
import {
  SugorokuBoard,
  SugorokuSquare,
  UserBoardProgressWithBoard,
  RollType,
  UserGift,
  FamilyRanking,
  QuizEventData,
} from "@/lib/types/sugoroku";
import { consumePoints } from "./points";
import { getRandomQuiz } from "@/lib/data/quiz-pool";

// サイコロ/ルーレット設定
const ROLL_COSTS = {
  dice: 50,
  roulette: 70,
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
    .limit(1);

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching user progress:", error);
    return null;
  }

  if (!data || data.length === 0) {
    // 初回の場合、ボード1を開始
    return await startNewBoard(userId, familyId, 1);
  }

  return data[0] as UserBoardProgressWithBoard;
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

    // 既存の進捗があるか確認
    const { data: existingProgress } = await supabase
      .from("user_board_progress")
      .select(`
        *,
        board:sugoroku_boards!board_id (*)
      `)
      .eq("user_id", userId)
      .eq("family_id", familyId)
      .eq("board_id", board.id)
      .maybeSingle();

    if (existingProgress) {
      // 既に存在する場合はそれを返す
      return existingProgress as UserBoardProgressWithBoard;
    }

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
    if (error && typeof error === 'object') {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
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
  eventMessage?: string;
  giftName?: string;
  giftRarity?: string;
  quizData?: QuizEventData;
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
    const result = rollType === 'dice'
      ? Math.floor(Math.random() * 6) + 1  // 1-6
      : Math.floor(Math.random() * 10) + 1; // 1-10

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
    const updateData: {
      current_position: number;
      updated_at: string;
      is_completed?: boolean;
      completed_at?: string;
    } = {
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

    console.log("Square data retrieved:", square);
    console.log("Square type:", square?.square_type);
    console.log("Square event_data:", square?.event_data);

    // マスイベントを処理
    let eventMessage = '';
    let giftName: string | undefined;
    let giftRarity: string | undefined;
    let quizData: QuizEventData | undefined;
    if (square) {
      console.log("Calling processSquareEvent for square:", square);
      const eventResult = await processSquareEvent(userId, familyId, square);
      eventMessage = eventResult.message;
      giftName = eventResult.giftName;
      giftRarity = eventResult.giftRarity;
      quizData = eventResult.quizData;
    } else {
      console.log("No square data found for position:", newPosition);
    }

    return {
      success: true,
      result,
      newPosition,
      square: square || undefined,
      eventMessage,
      giftName,
      giftRarity,
      quizData,
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
): Promise<{ message: string; giftName?: string; giftRarity?: string; quizData?: QuizEventData }> {
  const supabase = createClient();

  try {
    console.log("=== processSquareEvent called ===");
    console.log("Square type:", square.square_type);
    console.log("Square event_data:", square.event_data);

    switch (square.square_type) {
      case 'quiz':
        // クイズマスに止まった場合、クイズデータを返す
        if (square.event_data && 'question' in square.event_data) {
          const quizData = square.event_data as QuizEventData;
          return {
            message: '',
            quizData,
          };
        }
        break;

      case 'gift':
        // ギフトを付与
        const giftInfo = await grantRandomGift(userId, square);
        if (giftInfo) {
          const rarityLabel = giftInfo.rarity === 'legendary' ? '伝説' : giftInfo.rarity === 'rare' ? 'レア' : 'コモン';
          return {
            message: `🎁 ${giftInfo.name} を獲得しました！\n✨ レアリティ: ${rarityLabel}`,
            giftName: giftInfo.name,
            giftRarity: giftInfo.rarity,
          };
        }
        break;

      case 'bonus':
        // ボーナスポイント付与
        if (square.event_data && 'points' in square.event_data) {
          await addBonusPoints(
            userId,
            familyId,
            square.event_data.points as number,
            `ボーナスマス: +${square.event_data.points}pt`
          );
          return { message: `💰 ボーナス +${square.event_data.points}pt を獲得！` };
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
              await addBonusPoints(
                member.user_id,
                familyId,
                square.event_data.pointsPerMember as number,
                `家族イベントボーナス: +${square.event_data.pointsPerMember}pt`
              );
            }
          }
          return { message: `👨‍👩‍👧‍👦 家族全員に +${square.event_data.pointsPerMember}pt を配布しました！` };
        }
        break;

      case 'goal':
        // ゴール報酬
        if (square.event_data && 'points' in square.event_data) {
          await addBonusPoints(
            userId,
            familyId,
            square.event_data.points as number,
            `ボードクリア: +${square.event_data.points}pt`
          );
          return { message: `🏁 ゴール！クリアボーナス +${square.event_data.points}pt を獲得！` };
        }
        break;
    }
  } catch (error) {
    console.error("Error processing square event:", error);
  }
  return { message: '' };
}

/**
 * ボーナスポイントを付与（任意のポイント数）
 */
async function addBonusPoints(
  userId: string,
  familyId: string,
  points: number,
  description: string
): Promise<void> {
  const supabase = createClient();

  try {
    // user_pointsを更新
    const { data: currentPoints } = await supabase
      .from("user_points")
      .select("total_points, current_points")
      .eq("user_id", userId)
      .eq("family_id", familyId)
      .maybeSingle();

    if (currentPoints) {
      await supabase
        .from("user_points")
        .update({
          total_points: currentPoints.total_points + points,
          current_points: currentPoints.current_points + points,
        })
        .eq("user_id", userId)
        .eq("family_id", familyId);
    } else {
      // 初回の場合は作成
      await supabase
        .from("user_points")
        .insert({
          user_id: userId,
          family_id: familyId,
          total_points: points,
          current_points: points,
        });
    }

    // 履歴記録
    await supabase
      .from("point_history")
      .insert({
        user_id: userId,
        family_id: familyId,
        points_earned: points,
        action_type: 'send',
        description,
      });

    console.log(`Bonus points granted: ${points} to user ${userId}`);
  } catch (error) {
    console.error("Error adding bonus points:", error);
  }
}

/**
 * ランダムなギフトを付与
 */
async function grantRandomGift(userId: string, square: SugorokuSquare): Promise<{ name: string; rarity: string } | null> {
  const supabase = createClient();

  try {
    console.log("grantRandomGift called for user:", userId, "square:", square);

    let rarity = 'common';
    if (square.event_data && 'rarity' in square.event_data) {
      rarity = square.event_data.rarity as string;
    }

    console.log("Gift rarity:", rarity);

    // レアリティに応じたギフトを取得
    const { data: gifts, error: giftsError } = await supabase
      .from("gifts")
      .select("*")
      .eq("rarity", rarity)
      .eq("is_active", true);

    console.log("Available gifts:", gifts?.length, "Error:", giftsError);

    if (giftsError) {
      console.error("Error fetching gifts:", giftsError);
      return null;
    }

    if (gifts && gifts.length > 0) {
      // ランダムに選択
      const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
      console.log("Selected gift:", randomGift.name);

      // ユーザーにギフトを付与
      const { error: insertError } = await supabase.from("user_gifts").insert({
        user_id: userId,
        gift_id: randomGift.id,
        square_id: square.id,
      });

      if (insertError) {
        console.error("Error inserting gift:", insertError);
        return null;
      } else {
        console.log("Gift granted successfully:", randomGift.name);
        return { name: randomGift.name, rarity: randomGift.rarity };
      }
    } else {
      console.warn(`No gifts available for rarity: ${rarity}`);
      return null;
    }
  } catch (error) {
    console.error("Error granting gift:", error);
    return null;
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
 * クイズ回答を処理してポイントを付与
 */
export async function submitQuizAnswer(
  userId: string,
  familyId: string,
  isCorrect: boolean,
  points: number
): Promise<{ success: boolean; message: string }> {
  if (!isCorrect) {
    return {
      success: true,
      message: '不正解でした。次回頑張りましょう！',
    };
  }

  try {
    await addBonusPoints(
      userId,
      familyId,
      points,
      `クイズ正解ボーナス: +${points}pt`
    );

    return {
      success: true,
      message: `正解！ +${points}ポイント獲得しました！`,
    };
  } catch (error) {
    console.error("Error submitting quiz answer:", error);
    return {
      success: false,
      message: 'エラーが発生しました',
    };
  }
}

/**
 * 家族内のランキングを取得
 */
export async function getFamilyRanking(familyId: string): Promise<FamilyRanking[]> {
  const supabase = createClient();

  // user_board_progressを取得
  const { data: progressData, error: progressError } = await supabase
    .from("user_board_progress")
    .select(`
      user_id,
      current_position,
      board:sugoroku_boards!board_id (board_number)
    `)
    .eq("family_id", familyId)
    .eq("is_completed", false)
    .order("board_id", { ascending: false })
    .order("current_position", { ascending: false });

  if (progressError) {
    console.error("Error fetching family ranking:", progressError);
    return [];
  }

  if (!progressData || progressData.length === 0) {
    return [];
  }

  // 各ユーザーのポイントとプロフィールを取得
  const rankings: FamilyRanking[] = [];

  for (const progress of progressData) {
    // プロフィール取得
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", progress.user_id)
      .maybeSingle();

    // ポイント取得
    const { data: points } = await supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", progress.user_id)
      .eq("family_id", familyId)
      .maybeSingle();

    const board = (progress.board as unknown as { board_number: number }[] | null);
    const boardNumber = Array.isArray(board) && board.length > 0 ? board[0].board_number : 1;

    rankings.push({
      user_id: progress.user_id,
      user_name: profile?.display_name || '不明',
      avatar_url: profile?.avatar_url,
      current_position: progress.current_position,
      board_number: boardNumber,
      total_points: points?.total_points || 0,
      rank: rankings.length + 1,
    });
  }

  return rankings;
}
