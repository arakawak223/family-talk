# Firebase セキュリティルール デプロイ手順

このドキュメントは、Firebaseセキュリティルールを実際に設定する手順をまとめたものです。

## 前提条件

- Firebase プロジェクト `familytalk-bdcc7` が作成済み
- Firebase Console へのアクセス権限あり
- Firestore Database が有効化済み
- Firebase Storage が有効化済み

## 方法1: Firebase Console から設定（推奨・簡単）

### 1. Firestore セキュリティルールの設定

#### 1.1 Firebase Console にアクセス

1. https://console.firebase.google.com にアクセス
2. プロジェクト **familytalk-bdcc7** を選択
3. 左メニューから「Firestore Database」をクリック
4. 「ルール」タブをクリック

#### 1.2 ルールを編集

エディタで以下の内容に置き換える:

**ファイルパス**: `FamilyTalk/firebase-firestore-rules.rules`

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザーデータ: 自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 家族グループ: メンバーのみアクセス可能
    match /families/{familyId} {
      function isFamilyMember() {
        return request.auth != null &&
               request.auth.uid in resource.data.members;
      }

      function isCreatorInMembers() {
        return request.auth != null &&
               request.auth.uid in request.resource.data.members;
      }

      allow read: if isFamilyMember();
      allow create: if request.auth != null && isCreatorInMembers();
      allow update: if isFamilyMember();
      allow delete: if isFamilyMember();
    }

    // 音声メッセージ: 認証済みユーザーのみアクセス可能
    match /voice_messages/{messageId} {
      function isMessageParticipant() {
        return request.auth != null &&
               (request.auth.uid == resource.data.senderId ||
                request.auth.uid in resource.data.recipientIds);
      }

      allow read: if isMessageParticipant();
      allow create: if request.auth != null &&
                       request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth != null &&
                       request.auth.uid == resource.data.senderId;
      allow delete: if request.auth != null &&
                       request.auth.uid == resource.data.senderId;
    }

    // 質問データ: 全ユーザーが読み取り可能
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }

    // 挨拶メッセージ: 全ユーザーが読み取り可能
    match /greetings/{greetingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }

    // ユーザープロフィール画像メタデータ
    match /user_avatars/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 家族招待リンク
    match /family_invites/{inviteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.createdBy;
    }

    // デフォルトルール: すべてを拒否
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### 1.3 ルールを公開

1. 「公開」ボタンをクリック
2. 確認ダイアログで「公開」をクリック
3. ✅ ルールが有効になります

### 2. Storage セキュリティルールの設定

#### 2.1 Firebase Console にアクセス

1. Firebase Console で同じプロジェクトを選択
2. 左メニューから「Storage」をクリック
3. 「ルール」タブをクリック

#### 2.2 ルールを編集

エディタで以下の内容に置き換える:

**ファイルパス**: `FamilyTalk/firebase-storage-rules.rules`

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // 音声メッセージファイル
    match /voice-messages/{familyId}/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.resource.size < 10 * 1024 * 1024 &&
                      (request.resource.contentType.matches('audio/.*') ||
                       request.resource.contentType == 'application/octet-stream');
      allow delete: if request.auth != null;
    }

    // ユーザーアバター画像
    match /avatars/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null &&
                       request.auth.uid == userId;
    }

    // 家族共有画像
    match /family-photos/{familyId}/{photoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.resource.size < 10 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }

    // デフォルトルール: すべてを拒否
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

#### 2.3 ルールを公開

1. 「公開」ボタンをクリック
2. 確認ダイアログで「公開」をクリック
3. ✅ ルールが有効になります

## 方法2: Firebase CLI から設定（上級者向け）

### 前提条件

Firebase CLI がインストールされている必要があります:
```bash
npm install -g firebase-tools
```

### 手順

#### 1. Firebase にログイン

```bash
firebase login
```

ブラウザが開くので、Googleアカウントでログインします。

#### 2. Firebase プロジェクトを初期化

```bash
cd /workspaces/family-talk/FamilyTalk
firebase init
```

質問に回答:
- Which Firebase features: `Firestore`, `Storage` を選択（スペースキーで選択、Enterで確定）
- Select a default Firebase project: `familytalk-bdcc7` を選択
- Firestore rules file: `firebase-firestore-rules.rules` を指定
- Firestore indexes file: そのまま Enter（デフォルト）
- Storage rules file: `firebase-storage-rules.rules` を指定

#### 3. ルールをデプロイ

```bash
# Firestore ルールのみデプロイ
firebase deploy --only firestore:rules

# Storage ルールのみデプロイ
firebase deploy --only storage:rules

# 両方デプロイ
firebase deploy --only firestore:rules,storage:rules
```

#### 4. デプロイ完了確認

```
✔  Deploy complete!
```

が表示されれば成功です。

## ルールのテスト

### Firestore ルールのテスト

Firebase Console → Firestore Database → ルール → Rules Playground

#### テストケース 1: 自分のユーザーデータにアクセス
```
Simulation type: get
Location: /users/YOUR_USER_ID
Auth: Authenticated (YOUR_USER_ID)
Expected: ✅ Allow
```

#### テストケース 2: 他人のユーザーデータにアクセス
```
Simulation type: get
Location: /users/OTHER_USER_ID
Auth: Authenticated (YOUR_USER_ID)
Expected: ❌ Deny
```

#### テストケース 3: 未認証でアクセス
```
Simulation type: get
Location: /users/SOME_USER_ID
Auth: Unauthenticated
Expected: ❌ Deny
```

### Storage ルールのテスト

Firebase Console → Storage → ルール → Rules Playground

#### テストケース 1: 音声ファイルのアップロード（正常）
```
Simulation type: create
Location: voice-messages/family123/message456
Auth: Authenticated
File: audio/mpeg, 5MB
Expected: ✅ Allow
```

#### テストケース 2: 大きすぎるファイル（エラー）
```
Simulation type: create
Location: voice-messages/family123/message456
Auth: Authenticated
File: audio/mpeg, 15MB
Expected: ❌ Deny (サイズ制限)
```

## デプロイ後の確認

### 1. Firebase Console で確認

#### Firestore ルール
1. Firestore Database → ルール
2. 最終更新日時を確認
3. ルールの内容が正しいか確認

#### Storage ルール
1. Storage → ルール
2. 最終更新日時を確認
3. ルールの内容が正しいか確認

### 2. モバイルアプリで動作確認

アプリを起動して:
- [ ] ログインできるか
- [ ] ユーザー情報が取得できるか
- [ ] 音声メッセージがアップロードできるか
- [ ] 音声メッセージが再生できるか

### 3. セキュリティの確認

別のユーザーアカウントで:
- [ ] 他人のユーザーデータにアクセスできないことを確認
- [ ] 自分が所属していない家族グループのデータにアクセスできないことを確認

## トラブルシューティング

### エラー: "permission-denied"

**原因**: ルールが厳しすぎる、またはユーザーが認証されていない

**解決方法**:
1. ユーザーがログインしているか確認
2. Rules Playground でルールをテスト
3. アプリ側のコードでドキュメントパスが正しいか確認

### エラー: "PERMISSION_DENIED: Missing or insufficient permissions"

**原因**: ルールが公開されていない、または間違ったパスでアクセスしている

**解決方法**:
1. Firebase Console でルールが公開されているか確認
2. ドキュメントパスとルールのパスパターンが一致するか確認

### ファイルアップロードが失敗する

**原因**: ファイルサイズ制限またはファイル形式の制限

**解決方法**:
1. ファイルサイズを確認（音声: 10MB以下、画像: 5MB以下）
2. ファイル形式を確認（音声: audio/*, 画像: image/*）
3. Storage ルールを確認

## セキュリティのベストプラクティス

### 本番環境のチェックリスト

- [ ] Firestore ルールが公開されている
- [ ] Storage ルールが公開されている
- [ ] Rules Playground でテスト済み
- [ ] デフォルトで拒否するルールが設定されている
- [ ] ファイルサイズ制限が設定されている
- [ ] ファイル形式の制限が設定されている
- [ ] 認証済みユーザーのみがアクセスできる
- [ ] ユーザーは自分のデータのみアクセスできる

### 定期的なレビュー

- 月に1回、セキュリティルールを見直す
- Firebase Console でアクセスログを確認
- 異常なアクセスパターンを検出

## 次のステップ

Firebaseセキュリティルールの設定が完了したら:

1. ✅ **Supabase設定確認** → `SUPABASE_SETUP_CHECKLIST.md`
2. ✅ **テスト実行** → `TESTING_GUIDE.md`
3. ✅ **モバイルアプリビルド** → `ANDROID_BUILD_GUIDE.md` / `IOS_BUILD_GUIDE.md`

## 参考情報

**Firebase プロジェクト情報**:
- Project ID: `familytalk-bdcc7`
- Project Number: `501975430349`
- Console: https://console.firebase.google.com/project/familytalk-bdcc7

**ルールファイル**:
- Firestore: `FamilyTalk/firebase-firestore-rules.rules`
- Storage: `FamilyTalk/firebase-storage-rules.rules`
- セットアップガイド: `FamilyTalk/FIREBASE_SECURITY_SETUP.md`