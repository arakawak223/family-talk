# Supabaseプロジェクトセットアップガイド

## 手順1: Supabaseアカウント作成

1. [Supabase](https://supabase.com) にアクセス
2. "Start your project" をクリック
3. GitHubアカウントでサインアップ（推奨）
4. アカウント作成完了

## 手順2: 新しいプロジェクトの作成

1. Supabaseダッシュボードで "New project" をクリック
2. プロジェクト設定:
   - **Organization**: 個人アカウントを選択
   - **Name**: `FamilyTalk` または `family-talk-app`
   - **Database Password**: 強力なパスワードを生成（保存してください）
   - **Region**: `Northeast Asia (Tokyo)` を選択（日本のユーザー向け）
   - **Pricing Plan**: "Free tier" を選択

3. "Create new project" をクリック
4. プロジェクト作成完了まで数分待機

## 手順3: プロジェクト情報の取得

プロジェクト作成後、以下の情報を取得してください：

1. **Project Settings** > **API** に移動
2. 以下の情報をコピー・保存:
   - **Project URL** (例: `https://xxxxx.supabase.co`)
   - **Anon public key** (例: `eyJhbGci...`)

⚠️ **重要**:
- **Project URL** と **Anon public key** は後で環境変数に設定します
- **service_role secret** は使用しません（セキュリティリスクのため）

## 手順4: 認証設定

1. **Authentication** > **Settings** に移動
2. 基本設定:
   - **Site URL**: `http://localhost:3000` (開発時)
   - **Redirect URLs**: `http://localhost:3000/auth/callback` (開発時)

3. **Email** 設定:
   - "Enable email confirmations" をオン
   - "Secure email change" をオン

## 手順5: データベース接続確認

1. **SQL Editor** に移動
2. "Welcome to Supabase" クエリを実行してデータベース接続を確認
3. 正常に実行されればセットアップ完了

## 次のステップ

✅ Supabaseプロジェクト作成完了
→ 次は「データベーススキーマとポリシーの設定」に進んでください

## 取得した情報の確認

以下の情報が取得できていることを確認してください：

- [ ] Project URL
- [ ] Anon public key
- [ ] Database password（安全な場所に保存）

これらの情報は次のステップで使用します。
