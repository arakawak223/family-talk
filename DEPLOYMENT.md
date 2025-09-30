# FamilyTalkアプリ デプロイガイド

## 概要
FamilyTalkは2つのアプリケーションで構成されています：
- **Webアプリ** (`family`フォルダ): Next.js + Supabase
- **モバイルアプリ** (`FamilyTalk`フォルダ): React Native + Firebase

## 1. Webアプリのデプロイ (Vercel)

### 前提条件
- Vercelアカウント
- Supabaseプロジェクト
- GitHubリポジトリ

### 手順

#### 1.1 Supabaseプロジェクトの準備
1. [Supabase](https://supabase.com)にログイン
2. 新しいプロジェクトを作成
3. データベーススキーマをセットアップ:
   ```bash
   cd family
   # データベーススキーマとシードデータの実行
   # Supabase SQLエディタで以下のファイルを順番に実行：
   # - database-schema.sql
   # - database-seed.sql
   # - database-fix-policies-v3.sql
   # - database-storage-setup.sql
   # - database-add-avatar.sql
   # - database-kansai-questions.sql
   ```

#### 1.2 環境変数の設定
1. Supabaseプロジェクトの設定から以下を取得：
   - Project URL
   - Anon public key

2. `.env.local`ファイルを作成：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

#### 1.3 Vercelでのデプロイ
1. [Vercel](https://vercel.com)にログイン
2. "New Project"をクリック
3. GitHubリポジトリを接続
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `family`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Deployをクリック

### 1.4 ビルド確認
ローカルでのビルドテスト：
```bash
cd family
npm run build
npm run start
```

## 2. React Nativeアプリのデプロイ

### 前提条件
- Firebase プロジェクト
- Android Studio (Android用)
- Xcode (iOS用)
- Apple Developer Account (iOS App Store用)
- Google Play Console Account (Google Play用)

### 手順

#### 2.1 Firebaseプロジェクトの設定
1. [Firebase Console](https://console.firebase.google.com)でプロジェクト作成
2. 以下のサービスを有効化：
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Cloud Messaging (プッシュ通知用)

3. Android/iOSアプリを追加:
   - パッケージ名: `com.familytalk.app` (例)
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)

#### 2.2 設定ファイルの配置
```bash
cd FamilyTalk
# Android
cp google-services.json android/app/
# iOS
cp GoogleService-Info.plist ios/FamilyTalk/
```

#### 2.3 Firebase設定ファイルの更新
`src/config/firebase.ts`を本番環境用に更新:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Firebase Console から取得
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

#### 2.4 Android APK/AABビルド
```bash
cd FamilyTalk
# デバッグビルド
npm run android

# リリースビルド準備
cd android
./gradlew assembleRelease
# または AAB形式
./gradlew bundleRelease
```

#### 2.5 iOS IPAビルド
```bash
cd FamilyTalk
# Xcodeでプロジェクトを開く
open ios/FamilyTalk.xcworkspace

# Xcodeで:
# 1. Signing & Capabilities設定
# 2. Release configurationでArchive
# 3. App Store Connect へアップロード
```

## 3. 環境変数とセキュリティ設定

### 3.1 本番環境用セキュリティ設定

#### Supabase (Webアプリ)
1. Row Level Security (RLS) を有効化
2. 認証プロバイダー設定
3. CORS設定でドメインを制限

#### Firebase (モバイルアプリ)
1. セキュリティルールの設定:
   ```javascript
   // Firestore セキュリティルール
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
     }
   }
   ```

## 4. デプロイ後の確認事項

### 4.1 Webアプリ
- [ ] ユーザー登録・ログイン動作確認
- [ ] 音声録音・再生機能確認
- [ ] 家族グループ機能確認
- [ ] レスポンシブデザイン確認

### 4.2 モバイルアプリ
- [ ] Firebase接続確認
- [ ] 音声録音権限確認
- [ ] プッシュ通知設定確認
- [ ] アプリストア審査ガイドライン準拠確認

## 5. 継続的デプロイメント (CI/CD)

### GitHub Actions設定例
`.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd family && npm ci
      - run: cd family && npm run build
      - run: cd family && npm run test # テストがある場合

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      - run: cd FamilyTalk && npm ci
      - run: cd FamilyTalk/android && ./gradlew assembleRelease
```

## 6. 監視とメンテナンス

### 6.1 ログ監視
- Vercel: 組み込まれたログ機能
- Firebase: Analytics と Crashlytics

### 6.2 パフォーマンス監視
- Vercel Analytics
- Firebase Performance Monitoring

### 6.3 セキュリティ更新
- 定期的な依存関係更新
- セキュリティアラートの監視

## トラブルシューティング

### よくある問題
1. **ビルドエラー**: Node.jsバージョン確認 (>=18)
2. **音声機能エラー**: ブラウザ権限設定確認
3. **認証エラー**: 環境変数設定確認
4. **データベース接続エラー**: セキュリティルール確認

### サポート
- [Vercel ドキュメント](https://vercel.com/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [React Native ドキュメント](https://reactnative.dev/docs)