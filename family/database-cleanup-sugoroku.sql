-- ======================================
-- 双六・イベントシステム クリーンアップ
-- ======================================
-- 既存のテーブルを削除してから再作成するためのスクリプト

-- まずトリガーを削除
DROP TRIGGER IF EXISTS on_family_member_added ON family_members;
DROP TRIGGER IF EXISTS update_user_points_updated_at ON user_points;
DROP TRIGGER IF EXISTS update_sugoroku_boards_updated_at ON sugoroku_boards;
DROP TRIGGER IF EXISTS update_user_board_progress_updated_at ON user_board_progress;
DROP TRIGGER IF EXISTS update_family_events_updated_at ON family_events;
DROP TRIGGER IF EXISTS update_event_notification_settings_updated_at ON event_notification_settings;

-- 関数を削除
DROP FUNCTION IF EXISTS get_upcoming_events(UUID, INTEGER);
DROP FUNCTION IF EXISTS create_default_event_notification_settings();
DROP FUNCTION IF EXISTS update_sugoroku_updated_at_column();

-- ビューを削除
DROP VIEW IF EXISTS calendar_events;

-- イベント関連テーブルを削除
DROP TABLE IF EXISTS event_notifications_sent CASCADE;
DROP TABLE IF EXISTS event_notification_settings CASCADE;
DROP TABLE IF EXISTS family_events CASCADE;

-- 双六関連テーブルを削除（依存関係の逆順）
DROP TABLE IF EXISTS user_gifts CASCADE;
DROP TABLE IF EXISTS dice_history CASCADE;
DROP TABLE IF EXISTS user_board_progress CASCADE;
DROP TABLE IF EXISTS sugoroku_squares CASCADE;
DROP TABLE IF EXISTS gifts CASCADE;
DROP TABLE IF EXISTS sugoroku_boards CASCADE;
DROP TABLE IF EXISTS point_history CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;

-- プロフィールから誕生日カラムを削除（追加されている場合）
ALTER TABLE profiles DROP COLUMN IF EXISTS birthday;
