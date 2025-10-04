-- Message recipients policy fix - Allow senders to view recipient information
-- Execute this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their message receipts" ON message_recipients;
DROP POLICY IF EXISTS "Users can update their message receipts" ON message_recipients;

-- Create new policies

-- 1. Users can view recipient records where they are the recipient OR the sender
CREATE POLICY "Users can view message recipients" ON message_recipients
  FOR SELECT
  USING (
    -- If user is the recipient
    auth.uid() = recipient_id
    OR
    -- If user is the sender (can see recipients of their own messages)
    EXISTS (
      SELECT 1
      FROM voice_messages
      WHERE voice_messages.id = message_recipients.message_id
        AND voice_messages.sender_id = auth.uid()
    )
  );

-- 2. Users can update only their own recipient records (for marking as read)
CREATE POLICY "Users can update own receipts" ON message_recipients
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- 3. Senders can create recipient records when sending messages
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
