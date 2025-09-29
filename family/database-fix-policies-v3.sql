-- 家族メンバーポリシー完全修正（無限再帰エラー解決）
-- Supabase SQL Editorで実行してください

-- family_membersテーブルのすべてのポリシーを削除
DROP POLICY IF EXISTS "Users can manage own membership" ON family_members;
DROP POLICY IF EXISTS "Users can create family membership" ON family_members;
DROP POLICY IF EXISTS "Family members can view family members" ON family_members;
DROP POLICY IF EXISTS "Users can manage family memberships" ON family_members;
DROP POLICY IF EXISTS "Family admins can manage members" ON family_members;

-- シンプルで再帰のないポリシーを作成
-- 自分のメンバーシップのみ管理可能（INSERT/UPDATE/DELETE）
CREATE POLICY "Users manage own membership" ON family_members
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分のメンバーシップのみ閲覧可能（SELECT）
CREATE POLICY "Users view own membership" ON family_members
  FOR SELECT USING (auth.uid() = user_id);

-- 同じ家族のメンバー情報も閲覧可能（ただし再帰を避けるため直接JOINしない）
-- この部分は一旦削除して、アプリケーション側で別途対応する

-- families テーブルのポリシーも確認・修正
DROP POLICY IF EXISTS "Users can manage families they belong to" ON families;

-- 家族の閲覧は作成者のみ（シンプルに）
CREATE POLICY "Users can view own families" ON families
  FOR SELECT USING (auth.uid() = created_by);

-- 家族の更新は作成者のみ
CREATE POLICY "Users can update own families" ON families
  FOR UPDATE USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- 家族作成はそのまま
-- CREATE POLICY "Users can create families" ON families
--   FOR INSERT WITH CHECK (auth.uid() = created_by);
-- 既に存在しているのでそのまま