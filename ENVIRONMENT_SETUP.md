# 環境設定ガイド

## 必要なアカウント・サービス

### 1. Supabase (Webアプリ用)
1. [Supabase](https://supabase.com)でアカウント作成
2. 新しいプロジェクトを作成
3. Project Settings > API から以下を取得:
   - Project URL
   - Anon/Public key

### 2. Firebase (モバイルアプリ用)
1. [Firebase Console](https://console.firebase.google.com)でプロジェクト作成
2. 以下のサービスを有効化:
   - Authentication
   - Firestore Database
   - Storage
   - Cloud Messaging (プッシュ通知用)

### 3. 開発環境
- Node.js 18以上
- npm または yarn
- Android Studio (Android開発用)
- Xcode (iOS開発用、macOS必須)

## 環境変数の設定

### Webアプリ (Next.js)

#### 開発環境
`family/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 本番環境
Vercelの環境変数に設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### モバイルアプリ (React Native)

#### Firebase設定ファイル
1. Android: `google-services.json` を `android/app/` に配置
2. iOS: `GoogleService-Info.plist` を Xcode プロジェクトに追加

#### 設定ファイル更新
`FamilyTalk/src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## データベース設定

### Supabase (Webアプリ)
1. SQL Editor で以下のファイルを順番に実行:
   ```
   family/database-schema.sql
   family/database-seed.sql
   family/database-fix-policies-v3.sql
   family/database-storage-setup.sql
   family/database-add-avatar.sql
   family/database-kansai-questions.sql
   ```

2. Authentication > Settings で:
   - Email confirmationを設定
   - 必要に応じてソーシャルログインを有効化

### Firebase (モバイルアプリ)
1. Firestore セキュリティルールの設定:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /families/{familyId} {
         allow read, write: if request.auth != null
           && request.auth.uid in resource.data.members;
       }
       match /voice_messages/{messageId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

2. Storage セキュリティルール:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /voice-messages/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
       match /avatars/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 開発サーバーの起動

### Webアプリ
```bash
cd family
npm install
npm run dev
```
http://localhost:3000 でアクセス

### モバイルアプリ
```bash
cd FamilyTalk
npm install

# iOS
npm run ios

# Android
npm run android
```

## 本番環境の設定

### セキュリティ設定

#### Supabase
1. Project Settings > API:
   - RLS (Row Level Security) を有効化
   - 不要なテーブルのpublic accessを無効化

2. Auth > Settings:
   - Site URLにプロダクションURLを設定
   - Redirect URLsを制限

#### Firebase
1. Project Settings > General:
   - APIキーの制限設定
   - ドメイン制限の設定

2. Authentication > Settings:
   - 認証方法の制限
   - パスワードポリシーの設定

### パフォーマンス最適化

#### Webアプリ
- Next.js Image Optimizationの活用
- Bundle Analyzerでバンドルサイズ確認
- CDN設定 (Vercel Edge Functions)

#### モバイルアプリ
- Hermes JSエンジンの有効化
- ProGuard/R8による最適化
- Bundle分割の検討

## トラブルシューティング

### よくある問題

1. **Node.js バージョンエラー**
   ```bash
   nvm use 18
   npm install
   ```

2. **権限エラー (Android)**
   - `android/gradle.properties` の権限確認
   - Android SDK の更新

3. **iOS ビルドエラー**
   - Xcode Command Line Tools の更新
   - CocoaPods の再インストール:
     ```bash
     cd ios && pod install
     ```

4. **Firebase接続エラー**
   - 設定ファイルの配置確認
   - パッケージ名とBundle IDの一致確認

5. **Supabase接続エラー**
   - 環境変数の確認
   - CORSエラーの場合はドメイン設定確認

### ログの確認方法

#### Webアプリ
- ブラウザの開発者ツール
- Vercel Function Logs

#### モバイルアプリ
- React Native Debugger
- Firebase Console > Analytics

## デプロイ前チェックリスト

### 共通
- [ ] 環境変数の設定
- [ ] セキュリティルールの確認
- [ ] テスト実行
- [ ] エラーログの確認

### Webアプリ
- [ ] ビルドの成功確認 (`npm run build`)
- [ ] Lighthouse スコアの確認
- [ ] SEO設定の確認

### モバイルアプリ
- [ ] リリースビルドの成功
- [ ] 各種権限の動作確認
- [ ] アプリアイコンとスプラッシュスクリーンの設定
- [ ] アプリストア審査ガイドラインの確認