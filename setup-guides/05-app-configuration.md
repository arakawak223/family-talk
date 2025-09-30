# アプリケーション設定ファイル更新ガイド

## 前提条件
- Supabaseプロジェクトの設定情報を取得済み
- Firebaseプロジェクトの設定情報を取得済み
- 設定ファイル（google-services.json, GoogleService-Info.plist）をダウンロード済み

## 手順1: Next.js Webアプリの環境変数設定

### 1-1. 開発環境用の設定
`family/.env.local` ファイルを作成：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 開発環境設定
NODE_ENV=development
NEXT_PUBLIC_ENV=development
```

### 1-2. 本番環境用の設定
`family/.env.production` ファイルの内容を更新：

```env
# Supabase設定（本番環境用）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 本番環境設定
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

### 1-3. 環境変数の確認
Supabaseプロジェクトから以下の情報を取得してください：

1. **Project Settings** > **API** で確認
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOi...`

⚠️ **注意**: `service_role` キーは使用しないでください（セキュリティリスク）

## 手順2: React Native モバイルアプリのFirebase設定

### 2-1. Firebase設定ファイルの更新
`FamilyTalk/src/config/firebase.ts` ファイルを更新：

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase設定（Firebase Consoleから取得）
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Analytics用（オプション）
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// サービスの初期化
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

### 2-2. Firebase設定情報の取得
Firebase Console で以下の手順で設定情報を取得：

1. **プロジェクトの設定** (歯車アイコン)
2. **全般** タブ > **Firebase SDK snippet**
3. **構成** を選択してオブジェクトをコピー

### 2-3. Android設定ファイルの配置
```bash
# google-services.jsonを正しい場所に配置
cp google-services.json FamilyTalk/android/app/
```

配置確認：
```
FamilyTalk/
├── android/
│   └── app/
│       ├── google-services.json  ← ここに配置
│       └── build.gradle
```

### 2-4. iOS設定ファイルの配置
1. Xcodeで `FamilyTalk.xcworkspace` を開く
2. `GoogleService-Info.plist` をプロジェクトにドラッグ&ドロップ
3. **Copy items if needed** をチェック
4. **Add to target: FamilyTalk** をチェック

## 手順3: 設定の動作確認

### 3-1. Next.js Webアプリの確認
```bash
cd family
npm run dev
```

1. http://localhost:3000 にアクセス
2. ブラウザのコンソールでエラーがないか確認
3. ユーザー登録画面で登録テスト（メール確認は後で）

### 3-2. React Native アプリの確認

#### Android
```bash
cd FamilyTalk
npm run android
```

#### iOS
```bash
cd FamilyTalk
npm run ios
```

### 3-3. Firebase接続の確認
アプリで以下の機能をテスト：
1. ユーザー登録・ログイン
2. Firestoreへのデータ書き込み
3. Storageへのファイルアップロード

## 手順4: 本番環境用の追加設定

### 4-1. Vercel環境変数の設定（Webアプリ）
Vercelプロジェクトで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

### 4-2. アプリのビルド確認

#### Webアプリ
```bash
cd family
npm run build
```

#### Android アプリ
```bash
cd FamilyTalk/android
./gradlew assembleDebug
```

#### iOS アプリ
Xcodeでビルドを確認

## 手順5: セキュリティ設定の確認

### 5-1. APIキーの制限（Firebase）
Firebase Console > **プロジェクトの設定** > **全般** > **ウェブ API キー**:
- HTTP リファラーによる制限を設定
- 必要なAPIのみ有効化

### 5-2. ドメイン制限（Supabase）
Supabase > **Authentication** > **Settings**:
- **Site URL**: 本番ドメインを設定
- **Redirect URLs**: 許可するリダイレクトURLのみ設定

## トラブルシューティング

### よくある問題と解決方法

1. **「No Firebase App '[DEFAULT]' has been created」エラー**
   ```
   解決方法：
   - firebase.ts の import が正しいか確認
   - initializeApp() が実行されているか確認
   - google-services.json / GoogleService-Info.plist の配置確認
   ```

2. **Supabase接続エラー**
   ```
   解決方法：
   - 環境変数が正しく設定されているか確認
   - .env.local ファイルがgitignoreされているか確認
   - ブラウザでネットワークタブを確認
   ```

3. **ビルドエラー**
   ```
   解決方法：
   - Node.js バージョンを確認（18以上推奨）
   - npm install で依存関係を再インストール
   - キャッシュクリア: npm run build --清除
   ```

### ログの確認方法

#### Webアプリ
```javascript
// ブラウザコンソールで確認
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

#### モバイルアプリ
```javascript
// アプリ内でログ確認
import { auth } from './src/config/firebase';
console.log('Firebase Auth:', auth.currentUser);
```

## 次のステップ

✅ アプリケーション設定完了
→ 次は「開発サーバーでの動作テスト」に進んでください

## 設定完了チェックリスト

### Webアプリ (Next.js)
- [ ] `.env.local` に正しい環境変数が設定されている
- [ ] Supabase接続が正常に動作する
- [ ] ビルドが成功する
- [ ] ローカルサーバーが起動する

### モバイルアプリ (React Native)
- [ ] `firebase.ts` に正しい設定が記載されている
- [ ] `google-services.json` が正しい場所に配置されている
- [ ] `GoogleService-Info.plist` がXcodeプロジェクトに追加されている
- [ ] Android/iOS両方でビルドが成功する
- [ ] Firebase接続が正常に動作する

### セキュリティ
- [ ] APIキーの制限が設定されている
- [ ] ドメイン制限が設定されている
- [ ] 秘密キーがコードに含まれていない