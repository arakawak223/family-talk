import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/database";
import { addPoints, checkAllListenedBonus } from "@/lib/api/points";

type VoiceMessage = Database['public']['Tables']['voice_messages']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface VoiceMessageWithProfile extends VoiceMessage {
  sender_profile: Profile | null;
  is_listened: boolean;
  recipients?: Array<{
    recipient_id: string;
    recipient_profile: Profile | null;
    listened_at: string | null;
  }>;
}

// 家族のボイスメッセージを取得（受信・送信両方）
export async function getFamilyVoiceMessages(familyId: string): Promise<VoiceMessageWithProfile[]> {
  const supabase = createClient();

  try {
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('認証が必要です');
    }

    // 家族のボイスメッセージを取得（送信者プロフィール情報も含む）
    const { data: messages, error: messagesError } = await supabase
      .from('voice_messages')
      .select(`
        *,
        sender_profile:profiles!voice_messages_sender_id_fkey(*)
      `)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false }); // 新しい順

    if (messagesError) {
      throw new Error(`メッセージ取得エラー: ${messagesError.message}`);
    }

    // 各メッセージの既読状態と受信者情報をチェック
    const messagesWithStatus: VoiceMessageWithProfile[] = [];

    for (const message of messages || []) {
      let isListened = false;

      // 受信者情報を取得
      const { data: recipients } = await supabase
        .from('message_recipients')
        .select(`
          recipient_id,
          listened_at,
          recipient_profile:profiles!message_recipients_recipient_id_fkey(*)
        `)
        .eq('message_id', message.id);

      // 自分が送信したメッセージは常に「既読」とする
      if (message.sender_id === user.id) {
        isListened = true;
      } else {
        // 他人のメッセージは受信レコードの既読状態をチェック
        const myRecipient = recipients?.find(r => r.recipient_id === user.id);
        isListened = !!myRecipient?.listened_at;
      }

      messagesWithStatus.push({
        ...message,
        sender_profile: message.sender_profile,
        is_listened: isListened,
        recipients: recipients?.map(r => ({
          recipient_id: r.recipient_id,
          recipient_profile: r.recipient_profile,
          listened_at: r.listened_at,
        })) || [],
      });
    }

    return messagesWithStatus;

  } catch (error) {
    console.error('ボイスメッセージ取得エラー:', error);
    throw error;
  }
}

// メッセージを既読にする
export async function markMessageAsListened(messageId: string, familyId?: string): Promise<void> {
  const supabase = createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('認証が必要です');
    }

    // 既読状態を確認
    const { data: existingRecipient } = await supabase
      .from('message_recipients')
      .select('listened_at')
      .eq('message_id', messageId)
      .eq('recipient_id', user.id)
      .single();

    // 既に既読の場合は何もしない
    if (existingRecipient?.listened_at) {
      return;
    }

    const { error } = await supabase
      .from('message_recipients')
      .update({ listened_at: new Date().toISOString() })
      .eq('message_id', messageId)
      .eq('recipient_id', user.id);

    if (error) {
      throw new Error(`既読更新エラー: ${error.message}`);
    }

    // ポイント付与（メッセージを聴いた）
    if (familyId) {
      console.log('[markMessageAsListened] Starting point addition for familyId:', familyId);
      try {
        // メッセージ情報を取得して送信者を確認
        const { data: message } = await supabase
          .from('voice_messages')
          .select('sender_id')
          .eq('id', messageId)
          .single();

        console.log('[markMessageAsListened] Message data:', message);

        if (message) {
          // 聴いた人にポイント付与
          console.log('[markMessageAsListened] Adding listen points to user:', user.id);
          const listenResult = await addPoints(user.id, familyId, 'listen', messageId);
          console.log('[markMessageAsListened] Listen points result:', listenResult);

          // 送信者：全員が聴いたかチェック
          console.log('[markMessageAsListened] Checking all listened bonus for sender:', message.sender_id);
          const bonusResult = await checkAllListenedBonus(messageId, message.sender_id, familyId);
          console.log('[markMessageAsListened] All listened bonus result:', bonusResult);
        }
      } catch (pointsError) {
        console.error('ポイント付与エラー:', pointsError);
        // ポイント付与エラーでも既読更新自体は成功とする
      }
    } else {
      console.log('[markMessageAsListened] No familyId provided, skipping points');
    }

  } catch (error) {
    console.error('既読更新エラー:', error);
    throw error;
  }
}

// 音声ファイルの再生用URL取得（voice-upload.tsから移動）
export async function getVoiceMessageUrl(filePath: string): Promise<string> {
  const supabase = createClient();

  const { data } = await supabase.storage
    .from('voice-messages')
    .createSignedUrl(filePath, 3600); // 1時間有効

  if (!data?.signedUrl) {
    throw new Error('音声ファイルのURL取得に失敗しました');
  }

  return data.signedUrl;
}

// メッセージを削除する（送信者のみ）
export async function deleteVoiceMessage(messageId: string): Promise<void> {
  const supabase = createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('認証が必要です');
    }

    // メッセージ情報を取得して、送信者であることを確認
    const { data: message, error: fetchError } = await supabase
      .from('voice_messages')
      .select('sender_id, audio_file_url')
      .eq('id', messageId)
      .single();

    if (fetchError) {
      throw new Error(`メッセージ取得エラー: ${fetchError.message}`);
    }

    if (message.sender_id !== user.id) {
      throw new Error('自分のメッセージのみ削除できます');
    }

    // 音声ファイルを削除
    if (message.audio_file_url) {
      const { error: storageError } = await supabase.storage
        .from('voice-messages')
        .remove([message.audio_file_url]);

      if (storageError) {
        console.error('音声ファイル削除エラー:', storageError);
        // ストレージ削除エラーは続行（データベースは削除する）
      }
    }

    // データベースからメッセージを削除（受信者レコードはカスケード削除される）
    const { error: deleteError } = await supabase
      .from('voice_messages')
      .delete()
      .eq('id', messageId);

    if (deleteError) {
      throw new Error(`メッセージ削除エラー: ${deleteError.message}`);
    }

  } catch (error) {
    console.error('メッセージ削除エラー:', error);
    throw error;
  }
}