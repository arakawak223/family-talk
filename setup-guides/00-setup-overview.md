# FamilyTalk環境セットアップ 完全ガイド

## 📋 概要
このガイドでは、FamilyTalkアプリ（Webアプリとモバイルアプリ）の開発環境を段階的にセットアップします。

## 🏗️ アーキテクチャ構成

```
FamilyTalk システム構成
┌─────────────────┐    ┌─────────────────┐
│   Webアプリ      │    │  モバイルアプリ   │
│   (Next.js)     │    │ (React Native)  │
│                │    │                │
│   ↓ 接続        │    │   ↓ 接続        │
│                │    │                │
│   Supabase     │    │   Firebase     │
│ ・認証          │    │ ・認証          │
│ ・データベース   │    │ ・Firestore    │
│ ・ストレージ     │    │ ・Storage      │
└─────────────────┘    └─────────────────┘
```

## 📝 セットアップ手順

### 前提条件
- [ ] Node.js 18以上
- [ ] npm または yarn
- [ ] Googleアカウント
- [ ] Android Studio (Android開発用)
- [ ] Xcode (iOS開発用、macOS必須)

### 手順1: Supabaseプロジェクトのセットアップ
**📄 ガイド**: `01-supabase-setup.md`

**所要時間**: 約10分

**実行内容**:
- Supabaseアカウント作成
- 新しいプロジェクト作成
- API情報の取得

**取得する情報**:
- Project URL
- Anon public key

### 手順2: Supabaseデータベースの設定
**📄 ガイド**: `02-database-setup.md`

**所要時間**: 約15分

**実行内容**:
- データベーススキーマの作成
- 初期データの挿入
- Row Level Security (RLS) の設定
- ストレージバケットの作成

**実行するSQLファイル**:
1. `database-schema.sql`
2. `database-seed.sql`
3. `database-fix-policies-v3.sql`
4. `database-storage-setup.sql`
5. `database-add-avatar.sql`
6. `database-kansai-questions.sql`

### 手順3: Firebaseプロジェクトのセットアップ
**📄 ガイド**: `03-firebase-setup.md`

**所要時間**: 約15分

**実行内容**:
- Firebaseプロジェクト作成
- 必要なサービスの有効化
- Android/iOSアプリの追加
- 設定ファイルのダウンロード

**取得するファイル**:
- `google-services.json` (Android)
- `GoogleService-Info.plist` (iOS)
- Firebase config object

### 手順4: Firebaseセキュリティルールの設定
**📄 ガイド**: `04-firebase-security-rules.md`

**所要時間**: 約10分

**実行内容**:
- Firestoreセキュリティルールの設定
- Storageセキュリティルールの設定
- ルールのテストと公開

### 手順5: アプリケーション設定ファイルの更新
**📄 ガイド**: `05-app-configuration.md`

**所要時間**: 約20分

**実行内容**:
- 環境変数ファイルの作成・更新
- Firebase設定ファイルの配置
- アプリケーション設定の更新
- 動作確認

## ⚡ クイックセットアップ

### 開発環境の即座立ち上げ
```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd family-talk

# 2. Webアプリの依存関係インストール
cd family
npm install

# 3. モバイルアプリの依存関係インストール
cd ../FamilyTalk
npm install

# 4. 環境変数ファイルの作成
cd ../family
cp .env.example .env.local
# .env.local を編集してSupabase情報を設定

# 5. Firebase設定ファイルの配置
# google-services.json を FamilyTalk/android/app/ に配置
# GoogleService-Info.plist を Xcode プロジェクトに追加

# 6. 開発サーバーの起動
# Terminal 1: Webアプリ
cd family && npm run dev

# Terminal 2: モバイルアプリ
cd FamilyTalk && npm run android # または npm run ios
```

## 🔐 セキュリティチェックリスト

### 必須設定
- [ ] Supabase RLS ポリシーが設定されている
- [ ] Firebase セキュリティルールが本番用に設定されている
- [ ] 環境変数が正しく設定されている
- [ ] APIキーがコードにハードコードされていない
- [ ] 秘密キーが `.gitignore` されている

### 推奨設定
- [ ] Firebaseでドメイン制限が設定されている
- [ ] Supabaseで認証メール確認が有効になっている
- [ ] ファイルアップロードサイズ制限が設定されている
- [ ] 適切なCORS設定がされている

## 🧪 動作確認テスト

### Webアプリテスト
```bash
cd family
npm run build  # ビルドエラーがないか確認
npm run dev    # 開発サーバー起動
```

**確認項目**:
- [ ] http://localhost:3000 でアクセスできる
- [ ] ユーザー登録ページが表示される
- [ ] Supabase接続エラーがない

### モバイルアプリテスト
```bash
cd FamilyTalk
npm run android  # または npm run ios
```

**確認項目**:
- [ ] アプリが正常に起動する
- [ ] Firebase接続エラーがない
- [ ] 認証機能が動作する

## 🔧 トラブルシューティング

### よくある問題

1. **Node.js バージョンエラー**
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Android ビルドエラー**
   ```bash
   cd FamilyTalk/android
   ./gradlew clean
   ```

3. **iOS ビルドエラー**
   ```bash
   cd FamilyTalk/ios
   pod install
   ```

4. **環境変数が読み込まれない**
   - `.env.local` ファイルの場所を確認
   - 変数名に `NEXT_PUBLIC_` プレフィックスがあるか確認
   - サーバーを再起動

## 📞 サポートリソース

### 公式ドキュメント
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Native Docs](https://reactnative.dev/docs)

### コミュニティ
- [Supabase Discord](https://discord.supabase.com)
- [React Native Community](https://www.reactnative.dev/community/overview)

## 📈 次のステップ

環境準備が完了したら：

1. **開発開始**: 各ガイドに従って機能開発
2. **テスト実行**: ローカル環境での動作確認
3. **デプロイ準備**: `DEPLOYMENT.md` を参照
4. **本番公開**: Vercel/App Store/Google Play へのデプロイ

---

**💡 ヒント**: 各ステップで問題が発生した場合は、該当するガイドのトラブルシューティングセクションを確認してください。

## 🚀 今すぐ始める

**まずは手順1から始めましょう！**

次のファイル `01-supabase-setup.md` を開いて、Supabaseプロジェクトの作成から始めてください。