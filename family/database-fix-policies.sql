-- プロフィール作成・更新権限の追加修正
-- Supabase SQL Editorで実行してください

-- 既存のプロフィールポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- プロフィールの包括的なポリシーを作成
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 家族メンバーテーブルのポリシーも修正
DROP POLICY IF EXISTS "Family members can view their family" ON families;

-- 家族テーブルの包括的なポリシー
CREATE POLICY "Users can manage families they belong to" ON families
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_id = id AND user_id = auth.uid()
    )
  );

-- 家族作成者は自分が作成した家族を管理可能
CREATE POLICY "Users can create families" ON families
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 家族メンバーテーブルのポリシー修正
CREATE POLICY "Users can manage family memberships" ON family_members
  FOR ALL USING (auth.uid() = user_id);

-- 家族の管理者は他のメンバーも管理可能
CREATE POLICY "Family admins can manage members" ON family_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id
      AND fm.user_id = auth.uid()
      AND fm.role = 'admin'
    )
  );

-- メッセージ受信者テーブルのポリシー
CREATE POLICY "Users can view their message receipts" ON message_recipients
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their message receipts" ON message_recipients
  FOR UPDATE USING (auth.uid() = recipient_id);

-- 自動作成されるプロフィール用のトリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時に自動でプロフィールを作成するトリガー
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();