# FamilyTalk Webアプリ - 今すぐデプロイ

## ✅ 準備完了
- ビルド確認済み (2025-10-01)
- 環境変数設定済み
- GitHubリポジトリ準備完了

---

## 🚀 デプロイ手順 (5分で完了)

### ステップ1: Vercelにアクセス

1. **Vercel Dashboard を開く**
   👉 https://vercel.com/dashboard

2. **GitHubアカウントでログイン**
   - 「Continue with GitHub」をクリック
   - GitHubアカウントでログイン

---

### ステップ2: プロジェクトをインポート

1. **「Add New...」→「Project」をクリック**

2. **GitHubリポジトリを選択**
   - リポジトリ名: `arakawak223/family-talk`
   - 見つからない場合は「Import Git Repository」で検索

3. **「Import」をクリック**

---

### ステップ3: プロジェクト設定

#### Framework Preset
- **Next.js** (自動検出されるはず)

#### Root Directory ⚠️ 重要！
- 「Edit」ボタンをクリック
- **`family`** を選択
- このステップは必須です！

#### Build Settings (デフォルトのまま)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

### ステップ4: 環境変数の設定

「Environment Variables」セクションで以下を追加:

#### 変数1
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://psnlgyisnpwoafjiyhwn.supabase.co
```

#### 変数2
```
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbmxneWlzbnB3b2Fmaml5aHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI0ODksImV4cCI6MjA3NDU1ODQ4OX0.qC_XjVNSSjAJmcUWaeYzduUSYeJCmLFgZmcy9VDqipc
```

**Environment**: 両方とも **Production** を選択

---

### ステップ5: デプロイ開始

1. **「Deploy」ボタンをクリック**
2. ビルドログを確認 (3〜5分かかります)
3. ✅ 「Congratulations!」が表示されたら完了

---

## 📝 デプロイ後の作業

### 1. 本番URLを取得

デプロイ完了後に表示されるURL (例: `https://family-talk-xxx.vercel.app`) をコピーしてください。

---

### 2. Supabase設定の更新 ⚠️ 必須

1. **Supabase Dashboardを開く**
   👉 https://supabase.com/dashboard/project/psnlgyisnpwoafjiyhwn

2. **Settings → Authentication → URL Configuration**

3. **Site URL を更新**
   ```
   https://your-app.vercel.app
   ```
   (⬆️ 実際のVercel URLに置き換える)

4. **Redirect URLs に追加**
   ```
   https://your-app.vercel.app/*
   https://your-app.vercel.app/auth/callback
   ```

5. **「Save」をクリック**

---

### 3. 動作確認

Vercel URLにアクセスして確認:

- [ ] トップページが表示される
- [ ] 新規登録ページが開ける
- [ ] ブラウザのコンソール (F12) にエラーがない

---

## ❌ トラブルシューティング

### ビルドエラー: "Root Directory not found"
**原因**: Root Directory が設定されていない

**解決方法**:
1. Vercel Dashboard → Project Settings → General
2. Root Directory を `family` に設定
3. 「Save」をクリック
4. Deployments → 最新デプロイの「...」→「Redeploy」

---

### ビルドエラー: "Module not found"
**原因**: 依存関係の問題

**解決方法**:
1. ローカルで確認:
   ```bash
   cd /workspaces/family-talk/family
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
2. 問題なければ Git にプッシュ
3. Vercel で Redeploy

---

### Supabase接続エラー
**原因**: 環境変数が間違っている

**解決方法**:
1. Vercel Dashboard → Project Settings → Environment Variables
2. 環境変数が正しいか確認
3. 変更した場合は Redeploy が必要

---

### 認証エラー: "Invalid redirect URL"
**原因**: Supabase の Redirect URLs が更新されていない

**解決方法**:
1. Supabase Dashboard で Redirect URLs を確認
2. Vercel URL を追加
3. 数分待ってから再試行

---

## 🎉 次のステップ

Webアプリのデプロイが完了したら:

1. ✅ **Firebaseセキュリティルール設定**
   - Firestore ルール
   - Storage ルール
   - 詳細は `DEPLOYMENT_STATUS.md` 参照

2. 📱 **モバイルアプリのビルド** (オプション)
   - iOS: `FamilyTalk/IOS_BUILD_GUIDE.md`
   - Android: `FamilyTalk/ANDROID_BUILD_GUIDE.md`

---

## 📞 サポート

- **Vercel ドキュメント**: https://vercel.com/docs
- **Supabase ドキュメント**: https://supabase.com/docs
- **ビルドログの確認**: Vercel Dashboard → Deployments → ビルドをクリック
