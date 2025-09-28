-- 家族ボイスメッセージアプリ データベーススキーマ設計
-- Supabaseで実行するSQLスクリプト

-- 1. プロフィール（ユーザー情報）テーブル
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 家族グループテーブル
CREATE TABLE families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 家族メンバーテーブル（中間テーブル）
CREATE TABLE family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- 4. 質問カテゴリテーブル
CREATE TABLE question_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  feeling_type TEXT NOT NULL, -- 'interest', 'hope', 'care', 'encourage', 'gratitude'
  timing_type TEXT, -- 'morning', 'evening', 'special', 'seasonal'
  target_type TEXT, -- 'child', 'spouse', 'parent', 'sibling'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 質問テンプレートテーブル
CREATE TABLE question_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES question_categories(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ボイスメッセージテーブル
CREATE TABLE voice_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  audio_file_url TEXT NOT NULL,
  audio_file_size INTEGER,
  duration_seconds INTEGER,
  question_template_id UUID REFERENCES question_templates(id),
  custom_question TEXT,
  is_group_message BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. メッセージ受信者テーブル（個人メッセージ用）
CREATE TABLE message_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES voice_messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, recipient_id)
);

-- インデックス作成
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_families_invite_code ON families(invite_code);
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_voice_messages_family_id ON voice_messages(family_id);
CREATE INDEX idx_voice_messages_sender_id ON voice_messages(sender_id);
CREATE INDEX idx_voice_messages_created_at ON voice_messages(created_at DESC);
CREATE INDEX idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX idx_message_recipients_recipient_id ON message_recipients(recipient_id);

-- RLS (Row Level Security) ポリシー設定
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;

-- プロフィールのポリシー
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 家族メンバーのポリシー
CREATE POLICY "Family members can view their family" ON families
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = id AND user_id = auth.uid()
    )
  );

-- ボイスメッセージのポリシー
CREATE POLICY "Family members can view family messages" ON voice_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = voice_messages.family_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can create messages" ON voice_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = voice_messages.family_id AND user_id = auth.uid()
    )
  );

-- 質問カテゴリとテンプレートは全員が閲覧可能
CREATE POLICY "Everyone can view question categories" ON question_categories
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view question templates" ON question_templates
  FOR SELECT USING (true);

-- トリガー関数：updated_at自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー作成
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();