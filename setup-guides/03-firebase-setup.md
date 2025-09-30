# Firebaseプロジェクトセットアップガイド

## 前提条件
- Googleアカウント
- Android Studio (Android開発用)
- Xcode (iOS開発用、macOS必須)

## 手順1: Firebaseプロジェクトの作成

### 1-1. Firebase Consoleでプロジェクト作成
1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. Googleアカウントでログイン
3. **プロジェクトを作成** をクリック
4. プロジェクト設定:
   - **プロジェクト名**: `FamilyTalk` または `family-talk-mobile`
   - **Google Analytics**: オンにする（推奨）
   - **アカウント**: デフォルトまたは新規作成

5. **プロジェクトを作成** をクリック
6. プロジェクト作成完了まで待機

### 1-2. 必要なサービスの有効化
プロジェクト作成後、以下のサービスを有効化します：

1. **Authentication** (認証)
2. **Firestore Database** (データベース)
3. **Storage** (ファイルストレージ)
4. **Cloud Messaging** (プッシュ通知)

## 手順2: Authenticationの設定

### 2-1. 認証方法の有効化
1. **Authentication** > **Sign-in method** に移動
2. **メール/パスワード** を有効化:
   - スイッチをオンにする
   - **保存** をクリック

### 2-2. 認証設定の調整
**Authentication** > **Settings** で：
- **ユーザー アクション** > **メール認証** を有効化（推奨）

## 手順3: Firestore Databaseの設定

### 3-1. データベース作成
1. **Firestore Database** に移動
2. **データベースの作成** をクリック
3. セキュリティルール:
   - **テストモードで開始** を選択（後で変更）
4. ロケーション:
   - **asia-northeast1 (東京)** を選択
5. **完了** をクリック

### 3-2. コレクション構造の準備
後でアプリから以下のコレクションが作成されます：
- `users` - ユーザー情報
- `families` - 家族グループ
- `voice_messages` - ボイスメッセージ

## 手順4: Storageの設定

### 4-1. ストレージ作成
1. **Storage** に移動
2. **使ってみる** をクリック
3. セキュリティルール:
   - **テストモードで開始** を選択（後で変更）
4. ロケーション:
   - **asia-northeast1 (東京)** を選択
5. **完了** をクリック

## 手順5: Android/iOSアプリの追加

### 5-1. Androidアプリの追加
1. プロジェクト概要で **Android** アイコンをクリック
2. アプリの登録:
   - **パッケージ名**: `com.familytalk`
   - **アプリのニックネーム**: `FamilyTalk Android`
   - **SHA-1証明書**: 後で設定（デバッグ用は空でOK）
3. **アプリを登録** をクリック

4. **google-services.json** をダウンロード
5. ファイルを `FamilyTalk/android/app/` に配置

### 5-2. iOSアプリの追加
1. プロジェクト概要で **iOS** アイコンをクリック
2. アプリの登録:
   - **iOS バンドル ID**: `com.familytalk.ios`
   - **アプリのニックネーム**: `FamilyTalk iOS`
3. **アプリを登録** をクリック

4. **GoogleService-Info.plist** をダウンロード
5. Xcodeでプロジェクトにファイルを追加

## 手順6: Cloud Messagingの設定

### 6-1. FCM設定
1. **Cloud Messaging** に移動
2. Android/iOS用のサーバーキーを確認
3. 後でアプリ側で設定

## 手順7: 設定情報の取得

### 7-1. Firebase設定の取得
1. **プロジェクトの設定** (歯車アイコン) に移動
2. **全般** タブで **Firebase SDK snippet** を確認
3. **構成** を選択し、以下の情報をコピー：

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

⚠️ **重要**: この設定情報は後でアプリの設定ファイルに使用します

## 手順8: 設定ファイルの配置確認

### 8-1. Android設定ファイル
```
FamilyTalk/
├── android/
│   └── app/
│       └── google-services.json  ← ここに配置
```

### 8-2. iOS設定ファイル
XcodeでFamilyTalkプロジェクトを開き、`GoogleService-Info.plist`をプロジェクトに追加

## 次のステップ

✅ Firebaseプロジェクト作成完了
→ 次は「Firebaseサービスとセキュリティルールの設定」に進んでください

## 取得した情報の確認

以下の情報が取得できていることを確認してください：

- [ ] Firebase config object (apiKey, authDomain, etc.)
- [ ] google-services.json (Android用)
- [ ] GoogleService-Info.plist (iOS用)
- [ ] プロジェクトID

これらの情報は次のステップで使用します。

## トラブルシューティング

### よくある問題

1. **パッケージ名の不一致**
   - `android/app/build.gradle`の`applicationId`と一致させる
   - `ios/FamilyTalk.xcodeproj`のBundle Identifierと一致させる

2. **設定ファイルが認識されない**
   - ファイルの配置場所を確認
   - Android: プロジェクトをクリーンビルド
   - iOS: Xcodeでプロジェクトに追加されているか確認

3. **ビルドエラー**
   - Android: `./gradlew clean` を実行
   - iOS: Xcode で Product > Clean Build Folder