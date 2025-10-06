--- プロフィールテーブルに写真アバター機能を追加

-- avatar_photo_urlカラムを追加（写真アバターのストレージURL）
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_photo_url TEXT;

-- アバタータイプカラムを追加（'emoji' または 'photo'）
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_type TEXT DEFAULT 'emoji' CHECK (avatar_type IN ('emoji', 'photo'));

-- コメント追加
COMMENT ON COLUMN profiles.avatar_photo_url IS 'ユーザーがアップロードした写真アバターのURL';
COMMENT ON COLUMN profiles.avatar_type IS 'アバタータイプ: emoji (絵文字) または photo (写真)';

-- アバター用ストレージバケットを作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージポリシーはSupabaseダッシュボードの Storage > Policies から設定してください
-- 必要なポリシー:
-- 1. SELECT: 誰でもアバター画像を閲覧可能
-- 2. INSERT: 認証済みユーザーは自分のアバターをアップロード可能
-- 3. UPDATE: 認証済みユーザーは自分のアバターを更新可能
-- 4. DELETE: 認証済みユーザーは自分のアバターを削除可能
