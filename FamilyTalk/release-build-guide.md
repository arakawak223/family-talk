# React Native App Release Build Guide

## Android Release Build

### 1. キーストアの生成
```bash
cd FamilyTalk/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore family-talk-release-key.keystore -alias family-talk -keyalg RSA -keysize 2048 -validity 10000
```

### 2. gradle.propertiesの設定
`android/gradle.properties`に追加:
```properties
MYAPP_RELEASE_STORE_FILE=family-talk-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=family-talk
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

### 3. build.gradleの更新
`android/app/build.gradle`のsigningConfigsに追加:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ...
    }
}
```

### 4. リリースビルド実行
```bash
cd FamilyTalk
# AABファイル生成（Google Play推奨）
cd android && ./gradlew bundleRelease

# APKファイル生成
cd android && ./gradlew assembleRelease
```

## iOS Release Build

### 1. Xcodeプロジェクトを開く
```bash
cd FamilyTalk
open ios/FamilyTalk.xcworkspace
```

### 2. Signing & Capabilities設定
- Team選択
- Bundle Identifierの確認
- Provisioning Profile設定

### 3. Archive作成
1. Product > Scheme > Edit Scheme
2. Run > Build Configuration > Release
3. Product > Archive
4. Window > Organizer
5. Distribute App

## Firebase設定ファイルの配置

### Android
```bash
# google-services.jsonをダウンロード
cp google-services.json FamilyTalk/android/app/
```

### iOS
```bash
# GoogleService-Info.plistをダウンロード
# Xcodeでプロジェクトに追加
```

## 環境設定

### 本番環境用Firebase設定
`src/config/firebase.ts`を更新:
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

## テスト手順

### 1. デバッグビルドテスト
```bash
cd FamilyTalk
npm run android  # Android
npm run ios      # iOS
```

### 2. リリースビルドテスト
```bash
# Androidリリースビルドテスト
cd FamilyTalk/android
./gradlew installRelease

# iOSリリースビルドテスト
# Xcodeで Scheme > Release でビルド・実行
```

## アプリストア申請

### Google Play Console
1. AABファイルをアップロード
2. アプリ情報入力
3. 価格設定
4. 審査申請

### Apple App Store
1. App Store Connectでアプリ作成
2. Xcodeからアップロード
3. アプリ情報入力
4. 審査申請

## セキュリティチェックリスト

- [ ] APIキーの環境変数化
- [ ] デバッグログの無効化
- [ ] 不要な権限の削除
- [ ] ネットワークセキュリティ設定
- [ ] コード署名の確認