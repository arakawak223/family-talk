# FamilyTalk デプロイ状況 (2025-10-01)

## ✅ 完了済み設定

### 1. Webアプリ (Next.js + Supabase)

#### Supabase設定
- **プロジェクトID**: `psnlgyisnpwoafjiyhwn`
- **URL**: `https://psnlgyisnpwoafjiyhwn.supabase.co`
- **環境変数**: 設定済み (`VERCEL_DEPLOY_STEPS.md` 参照)

#### Vercelデプロイ準備
- **リポジトリ**: `arakawak223/family-talk`
- **Root Directory**: `family`
- **ビルド**: 確認済み
- **デプロイ手順**: `VERCEL_DEPLOY_STEPS.md` 参照

**次のステップ**: Vercel Dashboard または CLI からデプロイを実行

---

### 2. モバイルアプリ (React Native + Firebase)

#### Firebaseプロジェクト設定
- **プロジェクトID**: `familytalk-bdcc7`
- **ストレージバケット**: `familytalk-bdcc7.firebasestorage.app`
- **設定ファイル**: `src/config/firebase.ts` (設定済み)

#### iOS設定 ✅
- **Bundle Identifier**: `com.familytalk.ios` (修正済み)
- **GoogleService-Info.plist**:
  - ファイルパス: `ios/FamilyTalk/GoogleService-Info.plist`
  - Xcodeプロジェクトに追加済み
- **Firebase App ID**: `1:501975430349:ios:a0adbf2e33585c3791a584`

#### Android設定 ✅
- **Package Name**: `com.familytalk`
- **google-services.json**: `android/app/google-services.json` (配置済み)
- **Firebase App ID**: `1:501975430349:android:f2f5e7b645db00c491a584`

---

## 📋 次のデプロイ手順

### オプション1: Webアプリのみデプロイ (推奨)

1. **Vercelデプロイ**
   ```bash
   # Dashboard から (推奨)
   # VERCEL_DEPLOY_STEPS.md の「オプション1」参照
   ```

2. **Supabase設定の更新**
   - Site URL を Vercel URL に更新
   - Redirect URLs を追加

3. **動作確認**
   - ユーザー登録・ログイン
   - 音声録音・再生
   - 家族グループ機能

---

### オプション2: モバイルアプリもビルド

#### iOS ビルド (macOS必須)

1. **Xcode セットアップ**
   ```bash
   cd FamilyTalk
   open ios/FamilyTalk.xcworkspace
   ```

2. **Signing & Capabilities 設定**
   - Team: Apple Developer アカウントを選択
   - Bundle ID: `com.familytalk.ios` (設定済み)

3. **デバッグビルド (シミュレーター)**
   ```bash
   npm run ios
   ```

4. **リリースビルド**
   - Xcode → Product → Archive
   - 詳細は `IOS_BUILD_GUIDE.md` 参照

#### Android ビルド

1. **デバッグビルド (エミュレーター/実機)**
   ```bash
   cd FamilyTalk
   npm run android
   ```

2. **リリースビルド (APK)**
   ```bash
   cd android
   ./gradlew assembleRelease
   # 出力: android/app/build/outputs/apk/release/app-release.apk
   ```

3. **リリースビルド (AAB - Google Play用)**
   - 署名キーの作成が必要
   - 詳細は `ANDROID_BUILD_GUIDE.md` 参照

---

## 🔒 セキュリティ設定 (必須)

### Firebase セキュリティルール

#### Firestore ルール
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
    match /voiceMessages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage ルール
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

**設定方法**: Firebase Console → Firestore/Storage → Rules タブ

---

## 🧪 テスト項目

### Webアプリ (Vercel デプロイ後)
- [ ] トップページが表示される
- [ ] 新規ユーザー登録ができる
- [ ] ログインができる
- [ ] 音声録音・再生が動作する
- [ ] 家族グループ作成・参加ができる
- [ ] レスポンシブデザインが正しく表示される

### モバイルアプリ
- [ ] Firebase認証が動作する
- [ ] マイク権限が正しく要求される
- [ ] 音声録音・アップロードができる
- [ ] プッシュ通知が受信できる (設定済みの場合)
- [ ] オフライン時の動作確認

---

## 📚 関連ドキュメント

### デプロイガイド
- **Webアプリ**: `VERCEL_DEPLOY_STEPS.md`
- **iOS**: `IOS_BUILD_GUIDE.md`
- **Android**: `ANDROID_BUILD_GUIDE.md`

### セットアップガイド
- **Supabase**: `SUPABASE_SETUP_CHECKLIST.md`
- **環境構築**: `ENVIRONMENT_SETUP.md`

### テストガイド
- **総合テスト**: `TESTING_GUIDE.md`
- **Supabase検証**: `SUPABASE_VERIFICATION_STEPS.md`

---

## ⚠️ 注意事項

1. **iOS ビルド**: macOS + Xcode が必須
2. **署名キー**: Android リリースビルドには署名キーが必要 (紛失注意)
3. **環境変数**: 本番環境用の環境変数は Git にコミットしない
4. **Firebase ルール**: デプロイ前に必ずセキュリティルールを設定
5. **Supabase URL**: Vercel デプロイ後、Supabase の Site URL を更新

---

## 🎯 推奨デプロイ順序

1. **Webアプリ (Vercel)** ← まずはこちらから
2. **Firebaseセキュリティルール設定**
3. **Android デバッグビルド** (テスト用)
4. **iOS デバッグビルド** (テスト用・macOSのみ)
5. **動作確認・テスト**
6. **リリースビルド作成** (本番配布用)

---

## 📞 サポート

問題が発生した場合:
- 各ビルドガイドの「トラブルシューティング」セクションを参照
- Firebase Console / Supabase Dashboard でログを確認
- Vercel Dashboard でビルドログを確認
