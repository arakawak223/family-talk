-- Supabase Storage設定
-- Supabase SQL Editorで実行してください

-- 音声メッセージ用のStorageバケット作成
-- これはSupabase DashboardのStorageページで手動作成する必要があります
-- バケット名: "voice-messages"
-- Public: false (プライベート)

-- voice-messagesバケットのRLSポリシー設定
-- まずStorageのRLSを有効化（既に有効な場合はスキップ）

-- 1. 家族メンバーのみファイルをアップロード可能
CREATE POLICY "Family members can upload voice messages" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'voice-messages' AND
    EXISTS (
      SELECT 1 FROM family_members
      WHERE user_id = auth.uid()
    )
  );

-- 2. 家族メンバーのみファイルを閲覧可能
CREATE POLICY "Family members can view voice messages" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'voice-messages' AND
    EXISTS (
      -- アップロードしたユーザーか、同じ家族のメンバーかをチェック
      SELECT 1 FROM voice_messages vm
      JOIN family_members fm ON vm.family_id = fm.family_id
      WHERE vm.audio_file_url = storage.objects.name AND
      (vm.sender_id = auth.uid() OR fm.user_id = auth.uid())
    )
  );

-- 3. 自分がアップロードしたファイルのみ削除可能
CREATE POLICY "Users can delete their own voice messages" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'voice-messages' AND
    EXISTS (
      SELECT 1 FROM voice_messages
      WHERE audio_file_url = storage.objects.name AND sender_id = auth.uid()
    )
  );