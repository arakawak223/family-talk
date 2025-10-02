import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/database";

type VoiceMessage = Database['public']['Tables']['voice_messages']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface VoiceMessageWithProfile extends VoiceMessage {
  sender_profile: Profile | null;
  is_listened: boolean;
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

    // 各メッセージの既読状態をチェック
    const messagesWithStatus: VoiceMessageWithProfile[] = [];

    for (const message of messages || []) {
      let isListened = false;

      // 自分が送信したメッセージは常に「既読」とする
      if (message.sender_id === user.id) {
        isListened = true;
      } else {
        // 他人のメッセージは受信レコードの既読状態をチェック
        const { data: recipient } = await supabase
          .from('message_recipients')
          .select('listened_at')
          .eq('message_id', message.id)
          .eq('recipient_id', user.id)
          .maybeSingle();

        isListened = !!recipient?.listened_at;
      }

      messagesWithStatus.push({
        ...message,
        sender_profile: message.sender_profile,
        is_listened: isListened,
      });
    }

    return messagesWithStatus;

  } catch (error) {
    console.error('ボイスメッセージ取得エラー:', error);
    throw error;
  }
}

// メッセージを既読にする
export async function markMessageAsListened(messageId: string): Promise<void> {
  const supabase = createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('認証が必要です');
    }

    const { error } = await supabase
      .from('message_recipients')
      .update({ listened_at: new Date().toISOString() })
      .eq('message_id', messageId)
      .eq('recipient_id', user.id);

    if (error) {
      throw new Error(`既読更新エラー: ${error.message}`);
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