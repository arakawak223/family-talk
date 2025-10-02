-- 家族グループ削除ポリシーを追加
-- Supabase SQL Editorで実行してください

-- 家族グループの削除は作成者（管理者）のみ可能
CREATE POLICY "Users can delete own families" ON families
  FOR DELETE USING (auth.uid() = created_by);

-- 注意：family_membersテーブルのDELETE権限は既に存在
-- "Users manage own membership" ポリシーで自分のメンバーシップの削除が可能
