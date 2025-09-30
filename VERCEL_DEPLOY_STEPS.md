# Vercel デプロイ実行手順

このファイルは、実際にVercelへデプロイする際の手順をまとめたものです。

## 前提条件

- [x] Webアプリのビルドが成功している
- [x] Supabase環境変数が設定されている
- [x] GitHubリポジトリにプッシュ済み

## オプション1: Vercel Dashboard からデプロイ（推奨・簡単）

### 手順

1. **Vercelにログイン**
   - https://vercel.com にアクセス
   - 「Sign Up」または「Log In」
   - 「Continue with GitHub」を選択

2. **新しいプロジェクトをインポート**
   - Dashboard で「Add New...」→「Project」をクリック
   - GitHubリポジトリ `arakawak223/family-talk` を選択
   - 「Import」をクリック

3. **プロジェクト設定**

   **Framework Preset**: Next.js（自動検出）

   **Root Directory**:
   - 「Edit」をクリック
   - `family` を選択 ⚠️ 重要！

   **Build Settings**:
   - Build Command: `npm run build`（デフォルト）
   - Output Directory: `.next`（デフォルト）
   - Install Command: `npm install`（デフォルト）

4. **環境変数の設定**

   「Environment Variables」セクションで以下を追加:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://psnlgyisnpwoafjiyhwn.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmxneWlzbnB3b2Fmaml5aHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI0ODksImV4cCI6MjA3NDU1ODQ4OX0.qC_XjVNSSjAJmcUWaeYzduUSYeJCmLFgZmcy9VDqipc` |

   Environment: **Production** を選択

5. **デプロイ開始**
   - 「Deploy」ボタンをクリック
   - ビルドログを確認（3〜5分）
   - ✅ デプロイ完了を待つ

6. **本番URLの取得**
   - デプロイ完了後、本番URL（例: `https://family-talk-xxx.vercel.app`）が表示される
   - URLをメモする

## オプション2: Vercel CLI からデプロイ（上級者向け）

### 前提条件
- Vercel CLI がインストール済み（`npm install -g vercel`）

### 手順

1. **Vercelにログイン**
   ```bash
   cd /workspaces/family-talk/family
   vercel login
   ```
   - ブラウザが開くのでGitHubアカウントでログイン

2. **初回セットアップ**
   ```bash
   vercel
   ```

   質問に回答:
   - Set up and deploy: `y`
   - Which scope: 自分のアカウントを選択
   - Link to existing project: `n`（初回）
   - Project name: `family-talk`（またはお好きな名前）
   - In which directory: `./`（現在のディレクトリ）
   - Override settings: `n`

3. **環境変数の設定**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # 値: https://psnlgyisnpwoafjiyhwn.supabase.co

   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   # 値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmxneWlzbnB3b2Fmaml5aHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI0ODksImV4cCI6MjA3NDU1ODQ4OX0.qC_XjVNSSjAJmcUWaeYzduUSYeJCmLFgZmcy9VDqipc
   ```

4. **本番環境へデプロイ**
   ```bash
   vercel --prod
   ```

5. **デプロイ完了**
   - 本番URLが表示される（例: `https://family-talk.vercel.app`）
   - ブラウザで確認

## デプロイ後の確認

### 1. アプリケーションの動作確認

発行されたURLにアクセスして確認:
- [ ] トップページが表示される
- [ ] 「新規登録」ページが表示される
- [ ] ブラウザのコンソールにエラーがない

### 2. Supabase接続の確認

ブラウザの開発者ツール（F12）→ Console で:
- Supabase接続エラーがないか確認
- 「Failed to load resource」エラーがないか確認

### 3. 実際の動作テスト

- [ ] 新規ユーザー登録を試す
- [ ] ログインを試す
- [ ] ダッシュボードが表示されるか確認

## Supabase設定の更新（重要！）

デプロイ後、Supabaseの設定を更新する必要があります。

### 1. Site URL の更新

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクト `psnlgyisnpwoafjiyhwn` を選択
3. Settings → Authentication → URL Configuration
4. **Site URL** を更新:
   ```
   https://your-app.vercel.app
   ```
   （実際のVercel URLに置き換える）

### 2. Redirect URLs の追加

同じページの **Redirect URLs** に以下を追加:
```
https://your-app.vercel.app/*
https://your-app.vercel.app/auth/callback
```

### 3. CORS設定（必要に応じて）

Settings → API → CORS で Vercel URL を許可

## トラブルシューティング

### ビルドエラー: "Module not found"

**原因**: 依存関係の問題

**解決方法**:
```bash
cd family
rm -rf node_modules package-lock.json
npm install
npm run build
```

### エラー: "Root Directory not found"

**原因**: Root Directory が設定されていない

**解決方法**:
- Vercel Dashboard → Project Settings → General
- Root Directory を `family` に設定
- Redeploy

### 環境変数が反映されない

**原因**: 環境変数設定後に Redeploy していない

**解決方法**:
- Vercel Dashboard → Deployments → 最新デプロイの「...」→「Redeploy」

### Supabase接続エラー

**原因**: 環境変数が間違っている、またはSupabase設定が更新されていない

**解決方法**:
1. 環境変数が正しいか確認
2. Supabase の Site URL と Redirect URLs を確認
3. ブラウザのコンソールで詳細なエラーメッセージを確認

## 継続的デプロイメント

### 自動デプロイの設定

Vercelはデフォルトで自動デプロイが有効:
- `main` ブランチへのプッシュ → 本番環境へ自動デプロイ
- その他のブランチへのプッシュ → プレビュー環境が自動生成

### 更新のデプロイ方法

コードを更新して本番環境に反映する手順:

```bash
# 1. コードを編集
# 2. Git コミット
git add .
git commit -m "Update feature"

# 3. GitHubにプッシュ
git push origin main

# 4. Vercelが自動でデプロイ（数分待つ）
```

## 次のステップ

Webアプリのデプロイが完了したら:

1. ✅ **Firebaseセキュリティルール設定** → `FamilyTalk/FIREBASE_SECURITY_SETUP.md`
2. ✅ **Supabase設定確認** → `SUPABASE_SETUP_CHECKLIST.md`
3. ✅ **テスト実行** → `TESTING_GUIDE.md`
4. ✅ **モバイルアプリビルド** → `FamilyTalk/ANDROID_BUILD_GUIDE.md` / `FamilyTalk/IOS_BUILD_GUIDE.md`

## 参考情報

**Vercel プロジェクト情報**:
- リポジトリ: `arakawak223/family-talk`
- Root Directory: `family`
- Framework: Next.js 15.5.4
- Node.js: 20.x

**Supabase プロジェクト情報**:
- Project Ref: `psnlgyisnpwoafjiyhwn`
- URL: `https://psnlgyisnpwoafjiyhwn.supabase.co`
- Dashboard: https://supabase.com/dashboard/project/psnlgyisnpwoafjiyhwn