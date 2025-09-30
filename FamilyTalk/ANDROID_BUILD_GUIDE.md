# FamilyTalk Android ビルドガイド

## 前提条件

- Android Studio がインストールされていること
- Android SDK (API Level 36 以上)
- Java JDK 17 以上
- Node.js 20 以上

## 1. 環境準備

### Android Studio のセットアップ
1. [Android Studio](https://developer.android.com/studio) をダウンロード・インストール
2. Android Studio を起動し、SDK Manager で以下をインストール:
   - Android SDK Platform 36
   - Android SDK Build-Tools 36.0.0
   - Android SDK Command-line Tools

### 環境変数の設定
```bash
# macOS/Linux
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

## 2. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd family-talk/FamilyTalk

# 依存関係のインストール
npm install

# Android 依存関係の確認
cd android
./gradlew --version
```

## 3. Firebase 設定の確認

`google-services.json` が正しく配置されているか確認:
```bash
ls -la android/app/google-services.json
```

ファイルが存在しない場合は、Firebase Console からダウンロードして配置してください。

## 4. デバッグビルド（開発用）

```bash
# エミュレーターまたは実機を接続

# デバッグビルドの実行
npm run android

# または
cd android
./gradlew installDebug
```

## 5. リリースビルド（本番用）

### 5.1 署名キーの作成

本番用のリリースビルドには、独自の署名キーが必要です。

```bash
# キーストアの生成
keytool -genkeypair -v -storetype PKCS12 \
  -keystore familytalk-release-key.keystore \
  -alias familytalk-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# プロンプトで以下を入力:
# - キーストアのパスワード（覚えておくこと！）
# - 名前、組織などの情報
# - キーのパスワード（覚えておくこと！）
```

**重要**: 生成したキーストアファイルは安全に保管してください。このキーを紛失すると、アプリの更新ができなくなります。

### 5.2 gradle.properties の設定

`android/gradle.properties` に以下を追加（実際のパスワードに置き換える）:

```properties
MYAPP_RELEASE_STORE_FILE=familytalk-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=familytalk-key-alias
MYAPP_RELEASE_STORE_PASSWORD=あなたのストアパスワード
MYAPP_RELEASE_KEY_PASSWORD=あなたのキーパスワード
```

**重要**: このファイルは Git にコミットしないでください（`.gitignore` に追加済み）。

### 5.3 build.gradle の更新

`android/app/build.gradle` の `signingConfigs` セクションを更新:

```gradle
android {
    ...
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
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
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 5.4 リリースビルドの実行

#### APK ビルド（直接インストール用）
```bash
cd android
./gradlew assembleRelease

# APK は以下に生成されます:
# android/app/build/outputs/apk/release/app-release.apk
```

#### AAB ビルド（Google Play 用）
```bash
cd android
./gradlew bundleRelease

# AAB は以下に生成されます:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 6. APK/AAB のインストール

### APK の直接インストール（テスト配布用）

1. **実機へのインストール**:
   ```bash
   # USB デバッグを有効にした Android 端末を接続
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

2. **メール/メッセンジャーで配布**:
   - APK ファイルを家族にメールで送信
   - または Google Drive/Dropbox などで共有
   - 受信者は「提供元不明のアプリ」のインストールを許可する必要があります

### AAB の Google Play アップロード

1. [Google Play Console](https://play.google.com/console) にログイン
2. 新しいアプリを作成
3. リリース → 製品版 → 新しいリリースを作成
4. AAB ファイルをアップロード
5. リリースノートを記入
6. 審査に提出

## 7. トラブルシューティング

### ビルドエラー: SDK location not found
```bash
# local.properties ファイルを作成
echo "sdk.dir=/path/to/Android/sdk" > android/local.properties

# または環境変数を設定
export ANDROID_HOME=/path/to/Android/sdk
```

### ビルドエラー: google-services.json not found
Firebase Console から `google-services.json` をダウンロードし、`android/app/` に配置してください。

### 署名エラー
- キーストアのパスワードが正しいか確認
- `gradle.properties` のパスが正しいか確認
- キーストアファイルが存在するか確認

### メモリエラー
`android/gradle.properties` で JVM ヒープサイズを増やす:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

## 8. ビルドサイズの最適化

### ProGuard の有効化
`android/app/build.gradle`:
```gradle
def enableProguardInReleaseBuilds = true
```

### 不要なアーキテクチャの除外
特定のアーキテクチャのみビルドする場合:
```gradle
android {
    defaultConfig {
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a"
        }
    }
}
```

## 9. バージョン管理

アプリを更新する際は、`android/app/build.gradle` でバージョンを更新:
```gradle
defaultConfig {
    versionCode 2      // 整数値を増やす
    versionName "1.1"  // ユーザーに表示されるバージョン
}
```

## チェックリスト

リリース前に確認:
- [ ] Firebase 設定が本番環境用になっている
- [ ] バージョンコードとバージョン名を更新
- [ ] 署名キーが正しく設定されている
- [ ] ProGuard が有効（必要に応じて）
- [ ] すべての機能をテスト
- [ ] アプリのアイコンとスプラッシュスクリーンを確認
- [ ] 必要な権限が AndroidManifest.xml に記載されている

## 参考リンク

- [React Native - Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Android Developers - Sign your app](https://developer.android.com/studio/publish/app-signing)
- [Firebase - Add Firebase to Android](https://firebase.google.com/docs/android/setup)