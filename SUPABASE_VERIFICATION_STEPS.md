# Supabase 設定確認手順

このドキュメントは、Supabaseの設定が正しく行われているか確認する手順をまとめたものです。

## 前提条件

- Supabase プロジェクト `psnlgyisnpwoafjiyhwn` が作成済み
- Webアプリがデプロイ済み

## 1. データベーススキーマの確認

### 1.1 Supabase Dashboard にアクセス

1. https://supabase.com/dashboard にアクセス
2. プロジェクト **psnlgyisnpwoafjiyhwn** を選択
3. 左メニューから「Table Editor」をクリック

### 1.2 必要なテーブルの確認

以下のテーブルが存在するか確認:

- [ ] `profiles` - ユーザープロフィール
- [ ] `families` - 家族グループ
- [ ] `family_members` - 家族メンバー（中間テーブル）
- [ ] `question_categories` - 質問カテゴリ
- [ ] `question_templates` - 質問テンプレート
- [ ] `voice_messages` - 音声メッセージ
- [ ] `message_recipients` - メッセージ受信者

### 1.3 初期データの確認

**question_categories テーブル**:
- [ ] データが登録されている（5件以上）
- [ ] `daily`, `memory`, `future` などのカテゴリがある

**question_templates テーブル**:
- [ ] データが登録されている（50件以上）
- [ ] 関西弁の質問が含まれている（`feeling_type = 'kansai'`）

## 2. Row Level Security (RLS) ポリシーの確認

### 2.1 RLS が有効か確認

Table Editor → 各テーブルを選択 → 右上の設定アイコン

すべてのテーブルで RLS が有効になっているか確認:
- [ ] `profiles` - RLS Enabled
- [ ] `families` - RLS Enabled
- [ ] `family_members` - RLS Enabled
- [ ] `question_categories` - RLS Enabled
- [ ] `question_templates` - RLS Enabled
- [ ] `voice_messages` - RLS Enabled
- [ ] `message_recipients` - RLS Enabled

### 2.2 ポリシーの確認

Authentication → Policies で各テーブルのポリシーを確認:

#### profiles テーブル
- [ ] `Users can view all profiles` (SELECT)
- [ ] `Users can update own profile` (UPDATE)

#### families テーブル
- [ ] `Users can view own families` (SELECT)
- [ ] `Users can create families` (INSERT)
- [ ] `Users can update own families` (UPDATE)

#### family_members テーブル
- [ ] `Users manage own membership` (ALL)
- [ ] `Users view own membership` (SELECT)

#### voice_messages テーブル
- [ ] `Family members can view messages` (SELECT)
- [ ] `Users can create messages` (INSERT)
- [ ] `Senders can delete own messages` (DELETE)

#### message_recipients テーブル
- [ ] `Recipients can view own messages` (SELECT)
- [ ] `Users can create recipient records` (INSERT)
- [ ] `Recipients can update listen status` (UPDATE)

### 2.3 ポリシーのテスト（オプション）

SQL Editor で実行:

```sql
-- 現在のユーザー情報を取得
SELECT auth.uid();

-- 自分のプロフィールを取得（成功するはず）
SELECT * FROM profiles WHERE id = auth.uid();

-- 全プロフィールを取得（成功するはず）
SELECT * FROM profiles;
```

## 3. ストレージバケットの確認

### 3.1 Storage にアクセス

左メニューから「Storage」をクリック

### 3.2 必要なバケットの確認

以下のバケットが存在するか確認:

#### audio_files バケット
- [ ] バケットが作成されている
- [ ] Public access: **無効** (Private)
- [ ] ポリシーが設定されている

ポリシー確認（バケット選択 → Policies タブ）:
- [ ] `Users can upload own audio files` (INSERT)
- [ ] `Family members can view audio files` (SELECT)

#### avatars バケット
- [ ] バケットが作成されている
- [ ] Public access: **有効** (Public)
- [ ] ポリシーが設定されている

ポリシー確認:
- [ ] `Anyone can view avatars` (SELECT)
- [ ] `Users can upload own avatar` (INSERT, UPDATE)

### 3.3 バケットの設定確認

各バケットを選択 → Configuration:

**audio_files**:
- File size limit: 10MB（推奨）
- Allowed MIME types: `audio/*`

**avatars**:
- File size limit: 5MB（推奨）
- Allowed MIME types: `image/*`

## 4. 認証設定の確認

### 4.1 Authentication Settings にアクセス

左メニュー「Authentication」→「Settings」

### 4.2 Email 認証設定

**Email Auth**:
- [ ] Enable email sign-up: **有効**
- [ ] Enable email confirmations: **有効**（推奨）

### 4.3 Site URL の設定

**Site URL**:
- [ ] 本番環境のURL（例: `https://family-talk-xxx.vercel.app`）が設定されている

⚠️ **重要**: Vercelデプロイ後、実際のURLに更新してください。

### 4.4 Redirect URLs の設定

**Redirect URLs** に以下が追加されているか確認:
- [ ] `https://family-talk-xxx.vercel.app/*`
- [ ] `https://family-talk-xxx.vercel.app/auth/callback`
- [ ] `http://localhost:3000/*`（開発用）

⚠️ **重要**: `family-talk-xxx` を実際のVercel URLに置き換えてください。

### 4.5 パスワードポリシー

**Password requirements**:
- [ ] Minimum length: 8文字以上（推奨）

## 5. API キーの確認

### 5.1 Settings → API にアクセス

左メニュー「Settings」→「API」

### 5.2 API キー情報の確認

以下の情報が正しいか確認:

**Project URL**:
```
https://psnlgyisnpwoafjiyhwn.supabase.co
```

**Anon/Public Key**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmxneWlzbnB3b2Fmaml5aHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI0ODksImV4cCI6MjA3NDU1ODQ4OX0.qC_XjVNSSjAJmcUWaeYzduUSYeJCmLFgZmcy9VDqipc
```

⚠️ **重要**: `service_role` キーは絶対にクライアント側で使用しないでください。

### 5.3 環境変数の確認

Webアプリ（Vercel）の環境変数が正しいか確認:

Vercel Dashboard → プロジェクト → Settings → Environment Variables:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` が設定されている
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されている
- [ ] 値が上記のものと一致している

## 6. CORS 設定の確認（オプション）

### 6.1 Settings → API にアクセス

「CORS Settings」セクションを確認

### 6.2 Allowed origins の確認

以下が許可されているか確認:
- [ ] `https://family-talk-xxx.vercel.app`（本番環境URL）
- [ ] `http://localhost:3000`（開発環境）

⚠️ 設定されていない場合は追加してください。

## 7. SQLスクリプトの実行確認

### 7.1 SQL Editor にアクセス

左メニュー「SQL Editor」

### 7.2 実行済みSQLの確認

以下のSQLスクリプトが実行されているか確認（History タブで確認可能）:

1. [ ] `database-schema.sql` - テーブル作成
2. [ ] `database-seed.sql` - 初期データ投入
3. [ ] `database-fix-policies-v3.sql` - RLSポリシー設定
4. [ ] `database-storage-setup.sql` - ストレージ設定
5. [ ] `database-add-avatar.sql` - アバター機能追加
6. [ ] `database-kansai-questions.sql` - 関西弁質問追加

### 7.3 未実行のSQLがある場合

リポジトリの `family/` ディレクトリにある該当SQLファイルを開いて、SQL Editorで実行してください。

## 8. 動作テスト

### 8.1 テストユーザーの作成

Authentication → Users で:
1. 「Add user」→「Create new user」
2. メールアドレスとパスワードを入力
3. 「Create user」

### 8.2 データベース接続テスト

SQL Editor で:

```sql
-- テストユーザーのプロフィールを作成
INSERT INTO profiles (id, email, display_name)
VALUES (
  'TEST_USER_ID',  -- 上記で作成したユーザーのID
  'test@example.com',
  'テストユーザー'
);

-- プロフィールを取得
SELECT * FROM profiles WHERE email = 'test@example.com';
```

### 8.3 RLS テスト

```sql
-- 認証コンテキストをシミュレート（実際の認証が必要）
-- SQL Editor では RLS のテストは限定的

-- 代わりに、Webアプリでログインして動作確認を推奨
```

## 9. トラブルシューティング

### テーブルが存在しない

**解決方法**:
1. `family/database-schema.sql` を SQL Editor で実行
2. テーブルが作成されたか確認

### RLS ポリシーがない

**解決方法**:
1. `family/database-fix-policies-v3.sql` を SQL Editor で実行
2. Authentication → Policies で確認

### ストレージバケットがない

**解決方法**:
1. `family/database-storage-setup.sql` を SQL Editor で実行
2. Storage でバケットが作成されたか確認

### 質問データがない

**解決方法**:
1. `family/database-seed.sql` を SQL Editor で実行
2. `family/database-kansai-questions.sql` を SQL Editor で実行
3. Table Editor で question_templates テーブルを確認

### Webアプリから接続できない

**原因と解決方法**:
1. 環境変数が正しいか確認（Vercel Dashboard）
2. Site URL が正しいか確認（Supabase Settings）
3. Redirect URLs が正しいか確認
4. ブラウザのコンソールでエラーメッセージを確認

## 10. チェックリスト

すべての設定が完了したか確認:

### データベース
- [ ] すべてのテーブルが作成されている
- [ ] RLS がすべてのテーブルで有効
- [ ] RLS ポリシーが設定されている
- [ ] 質問データが登録されている（50件以上）

### ストレージ
- [ ] audio_files バケットが作成されている（Private）
- [ ] avatars バケットが作成されている（Public）
- [ ] ストレージポリシーが設定されている

### 認証
- [ ] Email 認証が有効
- [ ] Site URL が本番環境に設定されている
- [ ] Redirect URLs が設定されている
- [ ] パスワードポリシーが設定されている

### API
- [ ] Project URL を確認
- [ ] Anon Key を確認
- [ ] Vercel の環境変数に設定済み
- [ ] CORS 設定が正しい

### SQLスクリプト
- [ ] database-schema.sql 実行済み
- [ ] database-seed.sql 実行済み
- [ ] database-fix-policies-v3.sql 実行済み
- [ ] database-storage-setup.sql 実行済み
- [ ] database-add-avatar.sql 実行済み
- [ ] database-kansai-questions.sql 実行済み

## 次のステップ

Supabase設定の確認が完了したら:

1. ✅ **テスト実行** → `TESTING_GUIDE.md`
2. ✅ **モバイルアプリビルド** → `FamilyTalk/ANDROID_BUILD_GUIDE.md` / `FamilyTalk/IOS_BUILD_GUIDE.md`

## 参考情報

**Supabase プロジェクト情報**:
- Project Ref: `psnlgyisnpwoafjiyhwn`
- Project URL: `https://psnlgyisnpwoafjiyhwn.supabase.co`
- Dashboard: https://supabase.com/dashboard/project/psnlgyisnpwoafjiyhwn

**SQLファイルの場所**:
- `family/database-schema.sql`
- `family/database-seed.sql`
- `family/database-fix-policies-v3.sql`
- `family/database-storage-setup.sql`
- `family/database-add-avatar.sql`
- `family/database-kansai-questions.sql`

**詳細ガイド**:
- `SUPABASE_SETUP_CHECKLIST.md` - 設定チェックリスト
- `setup-guides/01-supabase-setup.md` - Supabase初期設定
- `setup-guides/02-database-setup.md` - データベース設定