-- 家族メンバーポリシー修正 - 同じ家族のメンバー全員を表示可能にする
-- Supabase SQL Editorで実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users manage own membership" ON family_members;
DROP POLICY IF EXISTS "Users view own membership" ON family_members;
DROP POLICY IF EXISTS "Users can manage own membership" ON family_members;
DROP POLICY IF EXISTS "Users can create family membership" ON family_members;
DROP POLICY IF EXISTS "Family members can view family members" ON family_members;
DROP POLICY IF EXISTS "Users can manage family memberships" ON family_members;
DROP POLICY IF EXISTS "Family admins can manage members" ON family_members;
DROP POLICY IF EXISTS "Users can view same family members" ON family_members;
DROP POLICY IF EXISTS "Users can create own membership" ON family_members;
DROP POLICY IF EXISTS "Users can update own membership" ON family_members;
DROP POLICY IF EXISTS "Users can delete own membership" ON family_members;
DROP POLICY IF EXISTS "Admins can delete family members" ON family_members;

-- セキュリティ・デファイナー関数を作成（無限再帰を回避）
-- ユーザーが所属する家族IDのリストを返す
CREATE OR REPLACE FUNCTION get_user_family_ids(user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT family_id FROM family_members WHERE family_members.user_id = user_id;
$$;

-- ユーザーが管理者である家族IDのリストを返す
CREATE OR REPLACE FUNCTION get_user_admin_family_ids(user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT family_id FROM family_members WHERE family_members.user_id = user_id AND family_members.role = 'admin';
$$;

-- 新しいポリシーを作成

-- 1. 自分のメンバーシップを作成可能（家族参加時）
CREATE POLICY "Users can create own membership" ON family_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2. 自分のメンバーシップを更新可能
CREATE POLICY "Users can update own membership" ON family_members
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. 自分のメンバーシップを削除可能（退出時）
CREATE POLICY "Users can delete own membership" ON family_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. 同じ家族のメンバー全員を表示可能（関数を使用して無限再帰を回避）
CREATE POLICY "Users can view same family members" ON family_members
  FOR SELECT
  USING (
    family_id IN (SELECT get_user_family_ids(auth.uid()))
  );

-- 5. 管理者は同じ家族のメンバーを削除可能（関数を使用して無限再帰を回避）
CREATE POLICY "Admins can delete family members" ON family_members
  FOR DELETE
  USING (
    family_id IN (SELECT get_user_admin_family_ids(auth.uid()))
    AND auth.uid() != user_id  -- 自分自身は削除できない（別のポリシーで対応）
  );
