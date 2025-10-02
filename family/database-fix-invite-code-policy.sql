-- 招待コードで家族検索を可能にするポリシーを追加
-- Supabase SQL Editorで実行してください

-- 既存の閲覧ポリシーを削除
DROP POLICY IF EXISTS "Users can view own families" ON families;

-- 新しいポリシー：自分が作成した家族、または招待コードで検索可能
CREATE POLICY "Users can view families" ON families
  FOR SELECT USING (
    auth.uid() = created_by OR
    invite_code IS NOT NULL
  );
