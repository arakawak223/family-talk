# FamilyTalk iOS ビルドガイド

## 前提条件

- **macOS** が必須（iOS アプリは macOS でのみビルド可能）
- Xcode 15 以上
- CocoaPods
- Node.js 20 以上
- Apple Developer Account（App Store 配布の場合は有料アカウント必須）

## 1. 環境準備

### Xcode のインストール
```bash
# App Store から Xcode をインストール

# Command Line Tools のインストール確認
xcode-select --install

# Xcode バージョン確認
xcodebuild -version
```

### CocoaPods のインストール
```bash
# CocoaPods インストール
sudo gem install cocoapods

# バージョン確認
pod --version
```

## 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd family-talk/FamilyTalk

# 依存関係のインストール
npm install

# iOS 依存関係のインストール
cd ios
pod install
cd ..
```

## 3. Firebase 設定

### GoogleService-Info.plist の配置

1. Firebase Console から `GoogleService-Info.plist` をダウンロード
2. Xcode でプロジェクトを開く:
   ```bash
   open ios/FamilyTalk.xcworkspace
   ```
3. `GoogleService-Info.plist` をプロジェクトにドラッグ&ドロップ
4. 「Copy items if needed」にチェックを入れて「Finish」

## 4. Xcode プロジェクト設定

### 4.1 基本設定

1. Xcode でプロジェクトを開く
2. プロジェクトナビゲーターで「FamilyTalk」を選択
3. 「Signing & Capabilities」タブを開く

### 4.2 Bundle Identifier の設定

```
例: com.yourcompany.familytalk
```

**重要**: この Bundle ID は Firebase と一致している必要があります。

### 4.3 Signing の設定

#### 開発ビルド（Development）
- **Team**: Apple Developer アカウントを選択
- **Signing Certificate**: Apple Development
- **Provisioning Profile**: Automatic

#### リリースビルド（App Store）
- **Team**: Apple Developer アカウントを選択
- **Signing Certificate**: Apple Distribution
- **Provisioning Profile**: App Store（自動生成）

### 4.4 必要な Capabilities の追加

「+ Capability」ボタンをクリックして以下を追加:
- **Push Notifications**（プッシュ通知用）
- **Background Modes** → Audio（音声再生用）

### 4.5 Info.plist の権限設定

以下の権限説明を追加（既に追加済みの場合はスキップ）:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>このアプリは音声メッセージを録音するためにマイクへのアクセスが必要です。</string>

<key>NSCameraUsageDescription</key>
<string>このアプリはプロフィール写真を撮影するためにカメラへのアクセスが必要です。</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>このアプリはプロフィール写真を選択するためにフォトライブラリへのアクセスが必要です。</string>
```

## 5. デバッグビルド（開発用）

### シミュレーターで実行
```bash
# iOS シミュレーター起動
npm run ios

# 特定のデバイスで起動
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### 実機で実行
1. iOS デバイスを Mac に接続
2. Xcode で「Product」→「Destination」→ 接続したデバイスを選択
3. 「Product」→「Run」（⌘R）

または:
```bash
npx react-native run-ios --device
```

## 6. リリースビルド

### 6.1 バージョンの更新

Xcode で:
- **Version**: ユーザーに表示されるバージョン（例: 1.0.0）
- **Build**: ビルド番号（整数、更新ごとに増やす）

または `ios/FamilyTalk/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### 6.2 App Store Connect の準備

1. [App Store Connect](https://appstoreconnect.apple.com) にログイン
2. 「マイApp」→「+」→ 新規 App
3. 必要情報を入力:
   - **プラットフォーム**: iOS
   - **名前**: FamilyTalk
   - **プライマリ言語**: 日本語
   - **Bundle ID**: Xcode で設定したものと同じ
   - **SKU**: 任意の一意な識別子

### 6.3 Archive の作成

1. Xcode で「Product」→「Destination」→「Any iOS Device」を選択
2. 「Product」→「Archive」
3. アーカイブが完成したら Organizer が自動で開く

### 6.4 App Store Connect へのアップロード

1. Organizer で作成した Archive を選択
2. 「Distribute App」をクリック
3. 「App Store Connect」を選択
4. 「Upload」を選択
5. 署名オプションを確認して「Upload」

アップロード完了後、App Store Connect でビルドが処理されます（通常10〜30分）。

### 6.5 TestFlight でのテスト配布

App Store Connect で:
1. 「TestFlight」タブを開く
2. アップロードしたビルドが表示されるまで待つ
3. 「内部テスト」グループにテスターを追加
4. ビルドをテスターに配布

テスターは:
1. TestFlight アプリをインストール
2. 招待メールのリンクから FamilyTalk をインストール

### 6.6 App Store への提出

App Store Connect で:
1. 「App Store」タブを開く
2. 「+ バージョンまたはプラットフォーム」→「iOS」
3. アプリ情報を記入:
   - スクリーンショット（必須サイズ: 6.5", 5.5"）
   - アプリの説明
   - キーワード
   - サポート URL
   - プライバシーポリシー URL

4. 「ビルド」セクションでアップロードしたビルドを選択
5. 「審査に提出」

## 7. アイコンとスプラッシュスクリーンの設定

### アプリアイコン

1. 1024×1024 のアイコン画像を用意
2. [App Icon Generator](https://appicon.co/) で各サイズを生成
3. Xcode で `Images.xcassets/AppIcon` に各サイズを配置

### スプラッシュスクリーン

`ios/FamilyTalk/LaunchScreen.storyboard` を編集:
- アプリのロゴやブランドカラーを設定
- シンプルなデザインを推奨

## 8. トラブルシューティング

### ビルドエラー: Pod install failed
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### 署名エラー: No signing certificate found
1. Apple Developer アカウントが有効か確認
2. Xcode → Preferences → Accounts でアカウントを追加/更新
3. 「Download Manual Profiles」をクリック

### ビルドエラー: Module not found
```bash
# キャッシュをクリア
cd ios
xcodebuild clean
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 再インストール
cd ..
npm install
cd ios
pod install
```

### Firebase 設定エラー
- `GoogleService-Info.plist` が正しく配置されているか確認
- Bundle ID が Firebase プロジェクトと一致しているか確認

### Archive 作成時のエラー
- Build Configuration が「Release」になっているか確認
- Product → Scheme → Edit Scheme → Archive → Build Configuration: Release

## 9. パフォーマンス最適化

### Hermes エンジンの有効化（既に有効）

`ios/Podfile` で確認:
```ruby
:hermes_enabled => true
```

### ビルドサイズの最適化

Xcode で:
- Build Settings → Optimization Level → Fastest, Smallest [-Os]
- Build Settings → Strip Debug Symbols During Copy → Yes

## 10. プライバシーとセキュリティ

### Privacy Manifest (iOS 17+)

`ios/PrivacyInfo.xcprivacy` を作成:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryMicrophone</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>3B52.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

## チェックリスト

リリース前に確認:
- [ ] Firebase 設定ファイルが配置されている
- [ ] Bundle ID が正しく設定されている
- [ ] バージョンとビルド番号を更新
- [ ] アプリアイコンが設定されている
- [ ] スプラッシュスクリーンが設定されている
- [ ] 必要な権限説明が Info.plist に記載されている
- [ ] すべての機能をシミュレーターと実機でテスト
- [ ] TestFlight でテスト配布して動作確認

## 参考リンク

- [React Native - Running On Device](https://reactnative.dev/docs/running-on-device)
- [Apple Developer - Distributing Your App](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Firebase - Add Firebase to iOS](https://firebase.google.com/docs/ios/setup)