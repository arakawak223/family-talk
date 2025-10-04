-- メッセージ削除ポリシーを追加
-- 送信者のみが自分のメッセージを削除できる

-- voice_messagesテーブルの削除ポリシー
CREATE POLICY "Senders can delete their own messages" ON voice_messages
  FOR DELETE USING (
    auth.uid() = sender_id
  );

-- message_recipientsテーブルの削除ポリシー（カスケード削除のため）
CREATE POLICY "Allow delete for message cascade" ON message_recipients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM voice_messages
      WHERE voice_messages.id = message_recipients.message_id
      AND voice_messages.sender_id = auth.uid()
    )
  );
