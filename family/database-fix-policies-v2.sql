-- 家族メンバーポリシー無限再帰エラーの修正
-- Supabase SQL Editorで実行してください

-- 問題のあるポリシーを削除
DROP POLICY IF EXISTS "Users can manage family memberships" ON family_members;
DROP POLICY IF EXISTS "Family admins can manage members" ON family_members;

-- 家族メンバーテーブルのポリシーを修正（無限再帰を回避）
-- 自分自身のメンバーシップのみ管理可能
CREATE POLICY "Users can manage own membership" ON family_members
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 家族作成時の初期メンバー追加を許可（INSERT専用）
CREATE POLICY "Users can create family membership" ON family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 家族メンバー情報の閲覧（同じ家族のメンバーのみ）
CREATE POLICY "Family members can view family members" ON family_members
  FOR SELECT USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );