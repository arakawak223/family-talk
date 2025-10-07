-- ======================================
-- 双六ゲームシステム データベーススキーマ
-- ======================================

-- 1. ユーザーポイントテーブル
CREATE TABLE user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  total_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0, -- 使用可能ポイント
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  messages_replied INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0, -- 連続日数
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, family_id)
);

-- 2. ポイント履歴テーブル
CREATE TABLE point_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  points_earned INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'send', 'listen', 'reply', 'streak', 'first_time', 'all_listened'
  message_id UUID REFERENCES voice_messages(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 双六ボード定義テーブル
CREATE TABLE sugoroku_boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  board_number INTEGER NOT NULL, -- 1, 2, 3... ボードの順番
  total_squares INTEGER DEFAULT 50,
  unlock_condition TEXT, -- 例: "前のボードをクリア"
  theme_color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 双六マス定義テーブル
CREATE TABLE sugoroku_squares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES sugoroku_boards(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL, -- 1〜50
  square_type TEXT NOT NULL, -- 'normal', 'gift', 'bonus', 'chance', 'family_event', 'mission', 'rest', 'goal'
  event_data JSONB, -- イベントの詳細情報（ギフトID、ボーナス量など）
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(board_id, position)
);

-- 5. ユーザーのボード進捗テーブル
CREATE TABLE user_board_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES sugoroku_boards(id) ON DELETE CASCADE NOT NULL,
  current_position INTEGER DEFAULT 0, -- 0はスタート地点
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, family_id, board_id)
);

-- 6. サイコロ/ルーレット履歴テーブル
CREATE TABLE dice_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES sugoroku_boards(id) ON DELETE CASCADE NOT NULL,
  roll_type TEXT NOT NULL, -- 'dice' or 'roulette'
  points_used INTEGER NOT NULL, -- 50 or 100
  result INTEGER NOT NULL, -- 1〜6 or 1〜10
  position_before INTEGER NOT NULL,
  position_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ギフトマスターテーブル（後で詳細決定）
CREATE TABLE gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  gift_type TEXT NOT NULL, -- 'badge', 'color', 'frame', 'sticker', 'effect', 'template'
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'legendary'
  icon_url TEXT,
  metadata JSONB, -- カラーコード、画像URL、エフェクト設定など
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ユーザーが獲得したギフトテーブル
CREATE TABLE user_gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE NOT NULL,
  square_id UUID REFERENCES sugoroku_squares(id) ON DELETE SET NULL,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT false, -- 使用中かどうか
  UNIQUE(user_id, gift_id)
);

-- インデックス作成
CREATE INDEX idx_user_points_user_family ON user_points(user_id, family_id);
CREATE INDEX idx_point_history_user_id ON point_history(user_id);
CREATE INDEX idx_point_history_created_at ON point_history(created_at DESC);
CREATE INDEX idx_sugoroku_squares_board_position ON sugoroku_squares(board_id, position);
CREATE INDEX idx_user_board_progress_user_family ON user_board_progress(user_id, family_id);
CREATE INDEX idx_dice_history_user_family ON dice_history(user_id, family_id);
CREATE INDEX idx_user_gifts_user_id ON user_gifts(user_id);

-- RLS (Row Level Security) ポリシー設定
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugoroku_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugoroku_squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_board_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gifts ENABLE ROW LEVEL SECURITY;

-- ポリシー: 自分の家族のポイント情報を閲覧可能
CREATE POLICY "Family members can view family points" ON user_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = user_points.family_id AND user_id = auth.uid()
    )
  );

-- ポリシー: 自分のポイントのみ更新可能（実際はトリガーで更新）
CREATE POLICY "Users can view their own points" ON user_points
  FOR UPDATE USING (user_id = auth.uid());

-- ポリシー: 自分の家族のポイント履歴を閲覧可能
CREATE POLICY "Family members can view point history" ON point_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = point_history.family_id AND user_id = auth.uid()
    )
  );

-- ポリシー: ボードとマスは全員閲覧可能
CREATE POLICY "Everyone can view sugoroku boards" ON sugoroku_boards
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view sugoroku squares" ON sugoroku_squares
  FOR SELECT USING (true);

-- ポリシー: 自分の家族の進捗を閲覧可能
CREATE POLICY "Family members can view board progress" ON user_board_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = user_board_progress.family_id AND user_id = auth.uid()
    )
  );

-- ポリシー: 自分の進捗のみ更新可能
CREATE POLICY "Users can update their own progress" ON user_board_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress" ON user_board_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ポリシー: サイコロ履歴は家族メンバーが閲覧可能
CREATE POLICY "Family members can view dice history" ON dice_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = dice_history.family_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own dice history" ON dice_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ポリシー: ギフトは全員閲覧可能
CREATE POLICY "Everyone can view gifts" ON gifts
  FOR SELECT USING (true);

-- ポリシー: 自分のギフトのみ閲覧・更新可能
CREATE POLICY "Users can view their own gifts" ON user_gifts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own gifts" ON user_gifts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own gifts" ON user_gifts
  FOR UPDATE USING (user_id = auth.uid());

-- トリガー関数: updated_at自動更新
CREATE OR REPLACE FUNCTION update_sugoroku_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー作成
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_sugoroku_updated_at_column();

CREATE TRIGGER update_sugoroku_boards_updated_at
  BEFORE UPDATE ON sugoroku_boards
  FOR EACH ROW EXECUTE FUNCTION update_sugoroku_updated_at_column();

CREATE TRIGGER update_user_board_progress_updated_at
  BEFORE UPDATE ON user_board_progress
  FOR EACH ROW EXECUTE FUNCTION update_sugoroku_updated_at_column();

-- ======================================
-- 初期データ投入: 最初のボード
-- ======================================

INSERT INTO sugoroku_boards (name, description, board_number, total_squares, theme_color)
VALUES
  ('はじめての冒険', '家族との絆を深める最初の双六ボードです', 1, 50, '#FF6B6B'),
  ('なかよし街道', '2つ目のチャレンジボード', 2, 50, '#4ECDC4'),
  ('きずなの旅', '3つ目のアドベンチャーボード', 3, 50, '#FFE66D');

-- 注: マス定義とギフトは後で詳細決定後に追加します
