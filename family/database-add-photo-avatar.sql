-- プロフィールテーブルに写真アバター機能を追加

-- avatar_photo_urlカラムを追加（写真アバターのストレージURL）
ALTER TABLE profiles
ADD COLUMN avatar_photo_url TEXT;

-- アバタータイプカラムを追加（'emoji' または 'photo'）
ALTER TABLE profiles
ADD COLUMN avatar_type TEXT DEFAULT 'emoji' CHECK (avatar_type IN ('emoji', 'photo'));

-- コメント追加
COMMENT ON COLUMN profiles.avatar_photo_url IS 'ユーザーがアップロードした写真アバターのURL';
COMMENT ON COLUMN profiles.avatar_type IS 'アバタータイプ: emoji (絵文字) または photo (写真)';

-- アバター用ストレージバケットを作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージポリシー: 誰でもアバター画像を閲覧可能
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- ストレージポリシー: 認証済みユーザーは自分のアバターをアップロード可能
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ストレージポリシー: 認証済みユーザーは自分のアバターを更新可能
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ストレージポリシー: 認証済みユーザーは自分のアバターを削除可能
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
