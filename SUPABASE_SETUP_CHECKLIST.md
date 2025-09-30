# Supabase セットアップチェックリスト

本番環境でWebアプリを使用するために、Supabaseの設定を確認してください。

## 1. データベーススキーマの確認

Supabase Dashboard → SQL Editor で以下のSQLファイルを順番に実行済みか確認:

```
family/
├── database-schema.sql           ← テーブル作成
├── database-seed.sql             ← 初期データ
├── database-fix-policies-v3.sql  ← RLSポリシー
├── database-storage-setup.sql    ← ストレージ設定
├── database-add-avatar.sql       ← アバター機能追加
└── database-kansai-questions.sql ← 関西弁質問追加
```

### 実行方法
1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニュー「SQL Editor」をクリック
4. 「New query」をクリック
5. 各SQLファイルの内容をコピー＆ペーストして「Run」

## 2. Row Level Security (RLS) ポリシーの確認

### 確認すべきテーブルとポリシー

#### profiles テーブル
- [ ] `Users can view all profiles` - 全ユーザーが全プロフィールを閲覧可能
- [ ] `Users can update own profile` - 自分のプロフィールのみ更新可能

#### families テーブル
- [ ] `Users can view own families` - 作成者が家族情報を閲覧可能
- [ ] `Users can create families` - ユーザーが家族グループを作成可能
- [ ] `Users can update own families` - 作成者が家族情報を更新可能

#### family_members テーブル
- [ ] `Users manage own membership` - 自分のメンバーシップを管理可能
- [ ] `Users view own membership` - 自分のメンバーシップを閲覧可能

#### voice_messages テーブル
- [ ] `Family members can view messages` - 家族メンバーがメッセージを閲覧可能
- [ ] `Users can create messages` - ユーザーがメッセージを作成可能
- [ ] `Senders can delete own messages` - 送信者が自分のメッセージを削除可能

#### message_recipients テーブル
- [ ] `Recipients can view own messages` - 受信者が自分宛のメッセージを閲覧可能
- [ ] `Users can create recipient records` - ユーザーが受信者レコードを作成可能
- [ ] `Recipients can update listen status` - 受信者が視聴状態を更新可能

### ポリシー確認方法
1. Supabase Dashboard → 「Authentication」→「Policies」
2. 各テーブルのポリシー一覧を確認
3. 上記のポリシーがすべて設定されているか確認

## 3. ストレージバケットの確認

### audio_files バケット
- [ ] バケットが作成されている
- [ ] Public access: **無効** (Private)
- [ ] File size limit: 10MB
- [ ] Allowed MIME types: `audio/*`

### avatars バケット
- [ ] バケットが作成されている
- [ ] Public access: **有効** (Public)
- [ ] File size limit: 5MB
- [ ] Allowed MIME types: `image/*`

### ストレージポリシーの確認
Supabase Dashboard → 「Storage」→ 各バケット → 「Policies」

#### audio_files バケット
- [ ] `Users can upload own audio files` - 認証済みユーザーが音声ファイルをアップロード可能
- [ ] `Family members can view audio files` - 家族メンバーが音声ファイルを閲覧可能

#### avatars バケット
- [ ] `Anyone can view avatars` - 全ユーザーがアバターを閲覧可能
- [ ] `Users can upload own avatar` - ユーザーが自分のアバターをアップロード可能

## 4. 認証設定の確認

Supabase Dashboard → 「Authentication」→「Settings」

### Email確認
- [ ] Enable email confirmations: **有効**（推奨）
- [ ] Confirm email: **有効**（推奨）

### セキュリティ設定
- [ ] Enable secure password: **有効**（推奨）
- [ ] Minimum password length: 8文字以上（推奨）

### Site URL（本番環境）
- [ ] Site URL: 本番環境のURLを設定（例: `https://your-app.vercel.app`）

### Redirect URLs
本番環境のURLを追加:
- [ ] `https://your-app.vercel.app/*`
- [ ] `https://your-app.vercel.app/auth/callback`

## 5. API キーの確認

Supabase Dashboard → 「Settings」→「API」

### 取得する情報
- [ ] Project URL: `https://xxxxx.supabase.co`
- [ ] Anon/Public key: `eyJhbGciOiJIUzI1NiIs...`

⚠️ **重要**: `service_role` キーは絶対にクライアント側で使用しないでください！

### 環境変数への設定
Webアプリの `.env.local` または Vercel の環境変数に設定:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 6. テーブルデータの確認

Supabase Dashboard → 「Table Editor」で以下を確認:

### question_categories テーブル
- [ ] カテゴリデータが登録されている（例: daily, memory, future など）

### question_templates テーブル
- [ ] 質問テンプレートが登録されている（50件以上推奨）
- [ ] 関西弁の質問が含まれている

## 7. ストレージの設定確認

Supabase Dashboard → 「Storage」→「Configuration」

### ファイルサイズ制限
- [ ] Maximum file size: 50MB（デフォルト）

### CORS設定
- [ ] Allowed origins に本番環境のURLを追加

## 8. パフォーマンス設定（オプション）

### データベース最適化
- [ ] インデックスが適切に設定されている（`database-schema.sql`で自動設定済み）
- [ ] 不要なデータの定期削除設定（必要に応じて）

### ストレージ最適化
- [ ] 古い音声ファイルの自動削除設定（必要に応じて）

## 9. セキュリティチェック

### データベース
- [ ] RLS が全テーブルで有効化されている
- [ ] テストユーザーで別ユーザーのデータにアクセスできないことを確認

### ストレージ
- [ ] Private バケットに直接URLでアクセスできないことを確認
- [ ] Public バケットは意図したファイルのみ公開されていることを確認

### API
- [ ] Anon key のみクライアントで使用
- [ ] Service role key はサーバー側でのみ使用（または未使用）

## 10. 本番環境デプロイ前の最終確認

- [ ] すべてのSQLスクリプトが実行済み
- [ ] すべてのRLSポリシーが設定済み
- [ ] ストレージバケットとポリシーが設定済み
- [ ] 認証設定が本番環境用に設定済み
- [ ] 環境変数が正しく設定されている
- [ ] テストユーザーで全機能が動作することを確認

## トラブルシューティング

### 「権限エラー」が発生する
→ RLSポリシーを確認。特に `family_members` テーブルのポリシーが正しいか確認

### 音声ファイルがアップロードできない
→ ストレージバケットのポリシーとファイルサイズ制限を確認

### メール認証が届かない
→ Authentication → Settings で Email Templates を確認

### ログインできない
→ Site URL と Redirect URLs が正しく設定されているか確認

## 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security (RLS) Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)