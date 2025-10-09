// ======================================
// ポイントシステム API関数
// ======================================

import { createClient } from "@/lib/supabase/client";
import {
  UserPoints,
  PointHistory,
  PointActionType,
  PointsEarned
} from "@/lib/types/sugoroku";

// ポイント設定
const POINT_RULES = {
  send: 10,
  listen: 5,
  reply: 15,
  streak: 20,
  first_time: 5,
  all_listened: 10,
} as const;

/**
 * ユーザーのポイント情報を取得
 */
export async function getUserPoints(
  userId: string,
  familyId: string
): Promise<UserPoints | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_points")
    .select("*")
    .eq("user_id", userId)
    .eq("family_id", familyId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user points:", error);
    console.error("Error code:", error.code, "Message:", error.message);
    return null;
  }

  return data;
}

/**
 * ポイントを付与（トランザクション処理）
 */
export async function addPoints(
  userId: string,
  familyId: string,
  actionType: PointActionType,
  messageId?: string,
  description?: string
): Promise<PointsEarned | null> {
  const supabase = createClient();

  const points = POINT_RULES[actionType];

  try {
    // ポイント情報を取得または作成
    let userPoints = await getUserPoints(userId, familyId);

    if (!userPoints) {
      // 初回の場合は作成
      const { data: newPoints, error: createError } = await supabase
        .from("user_points")
        .insert({
          user_id: userId,
          family_id: familyId,
          total_points: points,
          current_points: points,
          messages_sent: actionType === 'send' ? 1 : 0,
          messages_received: actionType === 'listen' ? 1 : 0,
          messages_replied: actionType === 'reply' ? 1 : 0,
          last_activity_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (createError) throw createError;
      userPoints = newPoints;
    } else {
      // 更新
      const updateData: {
        total_points: number;
        current_points: number;
        last_activity_date: string;
        messages_sent?: number;
        messages_received?: number;
        messages_replied?: number;
      } = {
        total_points: userPoints.total_points + points,
        current_points: userPoints.current_points + points,
        last_activity_date: new Date().toISOString().split('T')[0],
      };

      if (actionType === 'send') {
        updateData.messages_sent = userPoints.messages_sent + 1;
      } else if (actionType === 'listen') {
        updateData.messages_received = userPoints.messages_received + 1;
      } else if (actionType === 'reply') {
        updateData.messages_replied = userPoints.messages_replied + 1;
      }

      const { error: updateError } = await supabase
        .from("user_points")
        .update(updateData)
        .eq("user_id", userId)
        .eq("family_id", familyId);

      if (updateError) throw updateError;
    }

    // ポイント履歴を記録
    const { error: historyError } = await supabase
      .from("point_history")
      .insert({
        user_id: userId,
        family_id: familyId,
        points_earned: points,
        action_type: actionType,
        message_id: messageId,
        description: description || getDefaultDescription(actionType),
      });

    if (historyError) throw historyError;

    return {
      points,
      action_type: actionType,
      description: description || getDefaultDescription(actionType),
    };
  } catch (error) {
    console.error("Error adding points:", error);
    if (error && typeof error === 'object') {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    return null;
  }
}

/**
 * ストリークをチェック＆更新
 */
export async function checkAndUpdateStreak(
  userId: string,
  familyId: string
): Promise<PointsEarned | null> {
  const supabase = createClient();

  try {
    const userPoints = await getUserPoints(userId, familyId);
    if (!userPoints) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userPoints.last_activity_date;

    if (!lastActivityDate) return null;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 昨日アクティビティがあった場合、ストリーク継続
    if (lastActivityDate === yesterdayStr) {
      const newStreak = userPoints.current_streak + 1;
      const longestStreak = Math.max(newStreak, userPoints.longest_streak);

      const { error } = await supabase
        .from("user_points")
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
        })
        .eq("user_id", userId)
        .eq("family_id", familyId);

      if (error) throw error;

      // ストリークボーナスポイント付与
      return await addPoints(
        userId,
        familyId,
        'streak',
        undefined,
        `${newStreak}日連続！ストリークボーナス`
      );
    }
    // 今日が最終アクティビティでない場合、ストリークリセット
    else if (lastActivityDate !== today) {
      const { error } = await supabase
        .from("user_points")
        .update({
          current_streak: 1,
        })
        .eq("user_id", userId)
        .eq("family_id", familyId);

      if (error) throw error;
    }

    return null;
  } catch (error) {
    console.error("Error checking streak:", error);
    return null;
  }
}

/**
 * 全員視聴ボーナスをチェック
 */
export async function checkAllListenedBonus(
  messageId: string,
  senderId: string,
  familyId: string
): Promise<boolean> {
  const supabase = createClient();

  try {
    // メッセージの受信者を取得
    const { data: recipients, error: recipientsError } = await supabase
      .from("message_recipients")
      .select("recipient_id, listened_at")
      .eq("message_id", messageId);

    if (recipientsError) throw recipientsError;

    // 全員が聴いたかチェック
    const allListened = recipients?.every(r => r.listened_at !== null) || false;

    if (allListened && recipients && recipients.length > 0) {
      // ボーナスポイント付与
      await addPoints(
        senderId,
        familyId,
        'all_listened',
        messageId,
        '全員が聴いてくれました！'
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking all listened bonus:", error);
    return false;
  }
}

/**
 * ポイント履歴を取得
 */
export async function getPointHistory(
  userId: string,
  familyId: string,
  limit: number = 50
): Promise<PointHistory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("point_history")
    .select("*")
    .eq("user_id", userId)
    .eq("family_id", familyId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching point history:", error);
    return [];
  }

  return data || [];
}

/**
 * 家族全体のポイントランキングを取得
 */
export async function getFamilyPointsRanking(
  familyId: string
): Promise<Array<UserPoints & { profile: { display_name: string; avatar_url: string | null } }>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_points")
    .select(`
      *,
      profile:profiles!user_id (
        display_name,
        avatar_url
      )
    `)
    .eq("family_id", familyId)
    .order("total_points", { ascending: false });

  if (error) {
    console.error("Error fetching family ranking:", error);
    return [];
  }

  return data || [];
}

/**
 * ポイントを消費
 */
export async function consumePoints(
  userId: string,
  familyId: string,
  points: number,
  reason: string
): Promise<boolean> {
  const supabase = createClient();

  try {
    const userPoints = await getUserPoints(userId, familyId);
    if (!userPoints || userPoints.current_points < points) {
      return false;
    }

    const { error } = await supabase
      .from("user_points")
      .update({
        current_points: userPoints.current_points - points,
      })
      .eq("user_id", userId)
      .eq("family_id", familyId);

    if (error) throw error;

    // 履歴記録（負の値で記録）
    await supabase
      .from("point_history")
      .insert({
        user_id: userId,
        family_id: familyId,
        points_earned: -points,
        action_type: 'send', // 消費専用のタイプが必要なら追加
        description: reason,
      });

    return true;
  } catch (error) {
    console.error("Error consuming points:", error);
    return false;
  }
}

// ヘルパー関数
function getDefaultDescription(actionType: PointActionType): string {
  const descriptions: Record<PointActionType, string> = {
    send: 'メッセージを送信しました',
    listen: 'メッセージを聴きました',
    reply: 'メッセージに返信しました',
    streak: '連続送信ボーナス',
    first_time: '初めての人に送信しました',
    all_listened: '全員が聴いてくれました',
  };
  return descriptions[actionType];
}
