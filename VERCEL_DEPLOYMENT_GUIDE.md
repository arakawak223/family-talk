# Vercel デプロイメントガイド

FamilyTalk Webアプリ（Next.js）をVercelにデプロイする手順を説明します。

## 前提条件

- [ ] GitHubアカウント
- [ ] Vercelアカウント（無料プランで可）
- [ ] Supabaseプロジェクトが設定済み
- [ ] 環境変数の準備（Supabase URL と Anon Key）

## 1. GitHubリポジトリの準備

### 1.1 リポジトリへのプッシュ

ローカルの変更をGitHubにプッシュ:

```bash
# すべての変更をステージング
git add .

# コミット
git commit -m "Prepare for production deployment"

# リモートにプッシュ
git push origin main
```

### 1.2 リポジトリの公開設定確認

- リポジトリがパブリックまたはVercelがアクセス可能な状態になっているか確認

## 2. Vercelアカウントの作成

### 2.1 Vercelサインアップ

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントでログイン
5. Vercelのアクセス許可を承認

## 3. プロジェクトのインポート

### 3.1 新しいプロジェクトの作成

1. Vercel Dashboard で「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションで該当リポジトリを選択
3. 「Import」をクリック

### 3.2 プロジェクト設定

#### Framework Preset
- **Framework**: Next.js（自動検出されるはず）

#### Root Directory
- **Root Directory**: `family`（重要！）
- 「Edit」をクリックして `family` を選択

#### Build and Output Settings
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）
- **Install Command**: `npm install`（デフォルト）

### 3.3 環境変数の設定

「Environment Variables」セクションで以下を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Production |

**重要**:
- `NEXT_PUBLIC_` プレフィックスは必須
- Supabase の `service_role` キーは使用しないこと

環境変数の取得方法:
1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. Settings → API
4. Project URL と anon public キーをコピー

### 3.4 デプロイの開始

「Deploy」ボタンをクリック

## 4. デプロイの確認

### 4.1 デプロイステータスの監視

- ビルドログがリアルタイムで表示される
- エラーがあればログで確認できる
- 通常3〜5分でデプロイ完了

### 4.2 デプロイ完了

✅ デプロイが成功すると:
- 「Congratulations!」メッセージが表示される
- 本番URL（例: `https://your-app.vercel.app`）が発行される

## 5. 本番環境の確認

### 5.1 アプリケーションのテスト

発行されたURLにアクセスして以下を確認:

- [ ] トップページが正常に表示される
- [ ] ユーザー登録ができる
- [ ] ログインができる
- [ ] Supabaseに接続できる（ブラウザのコンソールでエラーがないか確認）

### 5.2 パフォーマンスチェック

Vercel Dashboard で:
- [ ] ビルド時間を確認
- [ ] ページロード時間を確認
- [ ] Core Web Vitals を確認

## 6. カスタムドメインの設定（オプション）

### 6.1 ドメインの追加

1. Vercel Dashboard → プロジェクト → Settings → Domains
2. 「Add」ボタンをクリック
3. 独自ドメイン（例: `familytalk.com`）を入力
4. DNS設定の指示に従う

### 6.2 DNS設定

ドメインレジストラ（お名前.comなど）で:
- **Aレコード**: Vercelが指定するIPアドレス
- **CNAMEレコード**: `cname.vercel-dns.com`

設定後、反映まで最大48時間かかる場合があります。

### 6.3 SSL証明書

- Vercelが自動でSSL証明書を発行（Let's Encrypt）
- HTTPSが自動で有効になる

## 7. Supabase設定の更新

### 7.1 Site URL の更新

Supabase Dashboard → Authentication → Settings:
- **Site URL**: `https://your-app.vercel.app` に更新

### 7.2 Redirect URLs の追加

Supabase Dashboard → Authentication → URL Configuration:
- **Redirect URLs** に以下を追加:
  - `https://your-app.vercel.app/*`
  - `https://your-app.vercel.app/auth/callback`

### 7.3 CORS設定（必要に応じて）

Supabase Dashboard → Settings → API:
- CORS設定で本番URLを許可

## 8. 継続的デプロイメント (CI/CD)

### 8.1 自動デプロイの設定

Vercelはデフォルトで自動デプロイが有効:
- `main` ブランチへのプッシュ → 本番環境へ自動デプロイ
- その他のブランチへのプッシュ → プレビュー環境が自動生成

### 8.2 デプロイ設定のカスタマイズ

Vercel Dashboard → プロジェクト → Settings → Git:

- **Production Branch**: `main`（デフォルト）
- **Ignored Build Step**: ビルドをスキップする条件を設定可能

### 8.3 プレビューデプロイ

プルリクエストを作成すると:
- 自動的にプレビュー環境が生成される
- プレビューURLがPRのコメントに追加される
- マージ前にテスト可能

## 9. 環境変数の管理

### 9.1 本番環境とプレビュー環境

Vercel Dashboard → Settings → Environment Variables:

環境ごとに異なる値を設定可能:
- **Production**: 本番環境
- **Preview**: プレビュー環境
- **Development**: ローカル開発

### 9.2 環境変数の更新

1. Settings → Environment Variables
2. 該当する変数の「Edit」をクリック
3. 新しい値を入力
4. **重要**: 環境変数を更新後は「Redeploy」が必要

## 10. モニタリングとログ

### 10.1 ログの確認

Vercel Dashboard → プロジェクト → Deployments → 該当デプロイ → Function Logs

確認できる情報:
- ビルドログ
- ランタイムログ
- エラーログ

### 10.2 Analytics（Pro プラン以上）

- ページビュー
- ユーザー数
- Core Web Vitals
- トラフィック解析

### 10.3 エラートラッキング

外部サービスとの連携推奨:
- Sentry
- LogRocket
- Datadog

## 11. パフォーマンス最適化

### 11.1 ビルド最適化

`next.config.js` で設定:

```javascript
module.exports = {
  compress: true, // Gzip圧縮
  images: {
    domains: ['xxxxx.supabase.co'], // 外部画像ドメイン
  },
  // その他の最適化設定
}
```

### 11.2 キャッシング戦略

Vercel Edge Network:
- 静的ファイルは自動でキャッシュ
- APIルートのキャッシュも設定可能

### 11.3 Edge Functions（オプション）

グローバルに分散されたエッジロケーションで実行:
- レイテンシの削減
- パフォーマンスの向上

## 12. セキュリティ設定

### 12.1 環境変数の保護

- 環境変数は暗号化されて保存される
- `NEXT_PUBLIC_` プレフィックスのない変数はクライアントに公開されない

### 12.2 HTTPS の強制

Vercel は自動で HTTPS を強制（HTTP → HTTPS リダイレクト）

### 12.3 セキュリティヘッダー

`next.config.js` でセキュリティヘッダーを設定:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

## 13. トラブルシューティング

### ビルドエラー: Module not found

```bash
# ローカルでビルドテスト
cd family
npm install
npm run build
```

エラーがあれば修正してから再デプロイ

### 環境変数が反映されない

- 環境変数の設定後、必ず「Redeploy」すること
- 変数名に `NEXT_PUBLIC_` プレフィックスがあるか確認（クライアントサイドで使用する場合）

### Supabase接続エラー

- ブラウザのコンソールでエラーメッセージを確認
- Supabase の URL と Anon Key が正しいか確認
- Supabase の CORS 設定を確認

### ページが表示されない (404)

- Root Directory が `family` に設定されているか確認
- Build Command が正しいか確認

### デプロイが遅い

- 不要な依存関係を削除
- `.vercelignore` で不要なファイルを除外:

```
node_modules
.next
.git
```

## 14. ロールバック

### 14.1 以前のデプロイに戻す

1. Vercel Dashboard → Deployments
2. 戻したいデプロイを選択
3. 「Promote to Production」をクリック

### 14.2 緊急ロールバック

Vercel CLI を使用:

```bash
npm i -g vercel
vercel login
vercel rollback
```

## 15. チェックリスト

デプロイ前の最終確認:

- [ ] Supabase プロジェクトが設定済み
- [ ] 環境変数が正しく設定されている
- [ ] ローカルでビルドが成功する
- [ ] すべての機能がローカルで動作確認済み
- [ ] GitHubにプッシュ済み
- [ ] Root Directory が `family` に設定
- [ ] Supabase の Site URL と Redirect URLs を更新

デプロイ後の確認:

- [ ] 本番URLでアプリが正常に表示される
- [ ] ユーザー登録・ログインが動作する
- [ ] Supabase接続が正常
- [ ] すべての主要機能が動作する
- [ ] モバイル表示も確認
- [ ] パフォーマンスが許容範囲内

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase with Vercel](https://supabase.com/docs/guides/hosting/vercel)
- [Vercel CLI Reference](https://vercel.com/docs/cli)