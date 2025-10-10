-- ======================================
-- RLSポリシー修正: gifts テーブル
-- ======================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Everyone can view gifts" ON gifts;
DROP POLICY IF EXISTS "Admins can insert gifts" ON gifts;

-- 新しいポリシーを作成
-- 1. 全員がギフトを閲覧可能
CREATE POLICY "Everyone can view gifts" ON gifts
  FOR SELECT USING (true);

-- 2. 認証済みユーザーがギフトを挿入可能（初期化用）
CREATE POLICY "Authenticated users can insert gifts" ON gifts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. sugoroku_squares テーブルのINSERTポリシーも追加
DROP POLICY IF EXISTS "Authenticated users can insert squares" ON sugoroku_squares;
CREATE POLICY "Authenticated users can insert squares" ON sugoroku_squares
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. sugoroku_squares テーブルのDELETEポリシーも追加
DROP POLICY IF EXISTS "Authenticated users can delete squares" ON sugoroku_squares;
CREATE POLICY "Authenticated users can delete squares" ON sugoroku_squares
  FOR DELETE USING (auth.uid() IS NOT NULL);
