-- プロフィールポリシー修正 - 家族メンバーが互いのプロフィールを表示可能にする
-- Supabase SQL Editorで実行してください

-- 既存のプロフィールポリシーを削除
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON profiles;

-- SECURITY DEFINER関数を使用して、家族メンバーのユーザーIDリストを取得
CREATE OR REPLACE FUNCTION get_family_member_user_ids(requesting_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT DISTINCT fm.user_id
  FROM family_members fm
  WHERE fm.family_id IN (
    SELECT family_id
    FROM family_members
    WHERE user_id = requesting_user_id
  );
$$;

-- 新しいプロフィールポリシーを作成

-- 1. 自分のプロフィールを作成可能
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. 自分のプロフィールまたは同じ家族のメンバーのプロフィールを表示可能
CREATE POLICY "Users can view family profiles" ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR
    id IN (SELECT get_family_member_user_ids(auth.uid()))
  );

-- 3. 自分のプロフィールのみ更新可能
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. 自分のプロフィールのみ削除可能
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);
