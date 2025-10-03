import { createClient } from "@/lib/supabase/client";

// 音声ファイルのアップロードと保存
export async function uploadVoiceMessage(
  audioBlob: Blob,
  familyId: string,
  question?: string,
  recipientIds?: string[]
) {
  const supabase = createClient();

  try {
    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('認証が必要です');
    }

    // ファイル名を生成（ユニーク）
    const timestamp = Date.now();
    const fileName = `${user.id}/${familyId}/${timestamp}.webm`;

    // Supabase Storageにアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-messages')
      .upload(fileName, audioBlob, {
        contentType: 'audio/webm;codecs=opus',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error(`ファイルアップロードエラー: ${uploadError.message}`);
    }

    // 音声の長さを計算（概算）
    const durationSeconds = Math.round(audioBlob.size / 16000); // 概算値

    // データベースにボイスメッセージレコードを作成
    const { data: messageData, error: messageError } = await supabase
      .from('voice_messages')
      .insert([{
        family_id: familyId,
        sender_id: user.id,
        audio_file_url: uploadData.path,
        audio_file_size: audioBlob.size,
        duration_seconds: durationSeconds,
        custom_question: question,
        is_group_message: true
      }])
      .select()
      .single();

    if (messageError) {
      // アップロードしたファイルを削除
      await supabase.storage
        .from('voice-messages')
        .remove([uploadData.path]);

      throw new Error(`メッセージ保存エラー: ${messageError.message}`);
    }

    // 受信者レコードを作成
    if (recipientIds && recipientIds.length > 0) {
      // 指定された受信者のみ
      const recipientRecords = recipientIds.map(recipientId => ({
        message_id: messageData.id,
        recipient_id: recipientId,
      }));

      await supabase
        .from('message_recipients')
        .insert(recipientRecords);
    } else {
      // 受信者が指定されていない場合は全員に送信（後方互換性）
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('user_id')
        .eq('family_id', familyId)
        .neq('user_id', user.id); // 送信者以外

      if (familyMembers && familyMembers.length > 0) {
        const recipientRecords = familyMembers.map(member => ({
          message_id: messageData.id,
          recipient_id: member.user_id,
        }));

        await supabase
          .from('message_recipients')
          .insert(recipientRecords);
      }
    }

    return {
      success: true,
      messageId: messageData.id,
      filePath: uploadData.path,
    };

  } catch (error) {
    console.error('音声メッセージアップロードエラー:', error);
    throw error;
  }
}

// 音声ファイルの再生URL取得
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