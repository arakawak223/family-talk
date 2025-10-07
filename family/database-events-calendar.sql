-- ======================================
-- イベント・カレンダー機能 データベーススキーマ
-- ======================================

-- 1. プロフィールテーブルに誕生日カラムを追加
ALTER TABLE profiles
ADD COLUMN birthday DATE;

-- 2. 家族イベントテーブル
CREATE TABLE family_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'birthday', 'anniversary', 'seasonal', 'custom'
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false, -- 毎年繰り返すか
  color TEXT DEFAULT '#3B82F6', -- イベントの表示カラー
  icon TEXT, -- 絵文字やアイコン名
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. イベント通知設定テーブル（ユーザーごと）
CREATE TABLE event_notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  notify_enabled BOOLEAN DEFAULT true, -- 通知を受け取るか
  notify_3_days_before BOOLEAN DEFAULT true,
  notify_1_day_before BOOLEAN DEFAULT true,
  notify_on_day BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, family_id)
);

-- 4. 送信済み通知履歴テーブル（重複送信防止）
CREATE TABLE event_notifications_sent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES family_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT NOT NULL, -- '3_days', '1_day', 'on_day'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id, notification_type)
);

-- インデックス作成
CREATE INDEX idx_family_events_family_id ON family_events(family_id);
CREATE INDEX idx_family_events_event_date ON family_events(event_date);
CREATE INDEX idx_event_notification_settings_user_family ON event_notification_settings(user_id, family_id);
CREATE INDEX idx_event_notifications_sent_event_user ON event_notifications_sent(event_id, user_id);

-- RLS (Row Level Security) ポリシー設定
ALTER TABLE family_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notifications_sent ENABLE ROW LEVEL SECURITY;

-- ポリシー: 家族メンバーは家族のイベントを閲覧可能
CREATE POLICY "Family members can view family events" ON family_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = family_events.family_id AND user_id = auth.uid()
    )
  );

-- ポリシー: 家族メンバーは自由にイベントを作成可能
CREATE POLICY "Family members can create events" ON family_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = family_events.family_id AND user_id = auth.uid()
    )
  );

-- ポリシー: イベント作成者のみ更新・削除可能
CREATE POLICY "Event creators can update their events" ON family_events
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Event creators can delete their events" ON family_events
  FOR DELETE USING (created_by = auth.uid());

-- ポリシー: 自分の通知設定のみ閲覧・更新可能
CREATE POLICY "Users can view their own notification settings" ON event_notification_settings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notification settings" ON event_notification_settings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own notification settings" ON event_notification_settings
  FOR UPDATE USING (user_id = auth.uid());

-- ポリシー: 通知履歴は本人のみ閲覧可能
CREATE POLICY "Users can view their own notification history" ON event_notifications_sent
  FOR SELECT USING (user_id = auth.uid());

-- トリガー関数: updated_at自動更新
CREATE TRIGGER update_family_events_updated_at
  BEFORE UPDATE ON family_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_notification_settings_updated_at
  BEFORE UPDATE ON event_notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================
-- ビュー: カレンダー表示用（誕生日 + イベント統合）
-- ======================================

CREATE OR REPLACE VIEW calendar_events AS
-- 家族イベント
SELECT
  e.id,
  e.family_id,
  e.event_type,
  e.title,
  e.description,
  e.event_date,
  e.is_recurring,
  e.color,
  e.icon,
  e.created_by,
  p.display_name as created_by_name
FROM family_events e
LEFT JOIN profiles p ON e.created_by = p.id

UNION ALL

-- 誕生日（プロフィールから自動生成）
SELECT
  p.id,
  fm.family_id,
  'birthday' as event_type,
  p.display_name || 'の誕生日' as title,
  NULL as description,
  p.birthday as event_date,
  true as is_recurring,
  '#FF6B9D' as color,
  '🎂' as icon,
  p.id as created_by,
  p.display_name as created_by_name
FROM profiles p
JOIN family_members fm ON p.id = fm.user_id
WHERE p.birthday IS NOT NULL;

-- ======================================
-- 関数: 今後のイベント取得
-- ======================================

CREATE OR REPLACE FUNCTION get_upcoming_events(
  p_family_id UUID,
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  event_type TEXT,
  title TEXT,
  description TEXT,
  event_date DATE,
  days_until INTEGER,
  color TEXT,
  icon TEXT,
  created_by_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.event_type,
    ce.title,
    ce.description,
    ce.event_date,
    (ce.event_date - CURRENT_DATE)::INTEGER as days_until,
    ce.color,
    ce.icon,
    ce.created_by_name
  FROM calendar_events ce
  WHERE ce.family_id = p_family_id
    AND ce.event_date >= CURRENT_DATE
    AND ce.event_date <= CURRENT_DATE + p_days_ahead
  ORDER BY ce.event_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================
-- 初期データ: デフォルト通知設定（新規ユーザー用）
-- ======================================

-- トリガー関数: 新規家族メンバー追加時に通知設定を自動作成
CREATE OR REPLACE FUNCTION create_default_event_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_notification_settings (user_id, family_id)
  VALUES (NEW.user_id, NEW.family_id)
  ON CONFLICT (user_id, family_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_family_member_added
  AFTER INSERT ON family_members
  FOR EACH ROW EXECUTE FUNCTION create_default_event_notification_settings();
