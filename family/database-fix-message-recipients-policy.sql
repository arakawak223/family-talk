-- メッセージ受信者ポリシー修正 - 送信者が受信者情報を表示可能にする
-- Supabase SQL Editorで実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their message receipts" ON message_recipients;
DROP POLICY IF EXISTS "Users can update their message receipts" ON message_recipients;

-- 新しいポリシーを作成

-- 1. 自分が受信者として登録されているレコード、または自分が送信したメッセージの受信者情報を表示可能
CREATE POLICY "Users can view message recipients" ON message_recipients
  FOR SELECT
  USING (
    -- 自分が受信者の場合
    auth.uid() = recipient_id
    OR
    -- 自分が送信者の場合（送信したメッセージの受信者情報を見られる）
    EXISTS (
      SELECT 1
      FROM voice_messages
      WHERE voice_messages.id = message_recipients.message_id
        AND voice_messages.sender_id = auth.uid()
    )
  );

-- 2. 自分の受信レコードのみ更新可能（既読マーク用）
CREATE POLICY "Users can update own receipts" ON message_recipients
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- 3. メッセージ送信時に受信者レコードを作成可能
CREATE POLICY "Senders can create recipient records" ON message_recipients
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM voice_messages
      WHERE voice_messages.id = message_recipients.message_id
        AND voice_messages.sender_id = auth.uid()
    )
  );
