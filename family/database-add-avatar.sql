-- プロフィールテーブルにアバター情報を追加
-- Supabase SQL Editorで実行してください

-- プロフィールテーブルにavatar_idカラムを追加
ALTER TABLE profiles
ADD COLUMN avatar_id TEXT;

-- 既存のユーザーにデフォルトアバターを設定（ねこ）
UPDATE profiles
SET avatar_id = 'cat'
WHERE avatar_id IS NULL;

-- アバター情報のコメント追加
COMMENT ON COLUMN profiles.avatar_id IS 'ユーザーが選択したアバターキャラクターのID';