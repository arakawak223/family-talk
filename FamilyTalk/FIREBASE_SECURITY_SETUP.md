# Firebase セキュリティルール設定ガイド

モバイルアプリ用のFirebaseセキュリティルールを設定します。

## 前提条件

- Firebase プロジェクトが作成済み
- Firestore Database が有効化されている
- Firebase Storage が有効化されている
- Firebase Console へのアクセス権限

## 1. Firestore セキュリティルールの設定

### 1.1 Firebase Console へのアクセス

1. [Firebase Console](https://console.firebase.google.com) にログイン
2. FamilyTalk プロジェクトを選択
3. 左メニューから「Firestore Database」をクリック
4. 「ルール」タブをクリック

### 1.2 セキュリティルールの適用

`firebase-firestore-rules.rules` の内容をコピーして貼り付け:

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

### 1.3 ルールの公開

1. 「公開」ボタンをクリック
2. 確認ダイアログで「公開」をクリック
3. ✅ ルールが有効化されます

### 1.4 ルールのテスト

Firebase Console の「ルール」タブで「Rules Playground」を使用:

**テスト例 1: 自分のユーザーデータの読み取り**
```
Location: /users/{your-user-id}
Type: get
Authenticated: Yes (your-user-id)
Expected: ✅ Allow
```

**テスト例 2: 他人のユーザーデータの読み取り**
```
Location: /users/other-user-id
Type: get
Authenticated: Yes (your-user-id)
Expected: ❌ Deny
```

## 2. Firebase Storage セキュリティルールの設定

### 2.1 Firebase Console へのアクセス

1. Firebase Console で FamilyTalk プロジェクトを選択
2. 左メニューから「Storage」をクリック
3. 「ルール」タブをクリック

### 2.2 セキュリティルールの適用

`firebase-storage-rules.rules` の内容をコピーして貼り付け:

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

### 2.3 ルールの公開

1. 「公開」ボタンをクリック
2. 確認ダイアログで「公開」をクリック
3. ✅ ルールが有効化されます

## 3. セキュリティルールの説明

### 3.1 Firestore ルールのポイント

#### ユーザーデータ (`/users/{userId}`)
- **読み取り**: 本人のみ
- **書き込み**: 本人のみ
- **目的**: プロフィール情報の保護

#### 家族グループ (`/families/{familyId}`)
- **読み取り**: メンバーのみ
- **作成**: 認証済みユーザー（自分をメンバーに含める必要あり）
- **更新・削除**: メンバーのみ
- **目的**: 家族グループ情報の保護

#### 音声メッセージ (`/voice_messages/{messageId}`)
- **読み取り**: 送信者または受信者のみ
- **作成**: 認証済みユーザー（送信者IDが自分である必要あり）
- **更新・削除**: 送信者のみ
- **目的**: プライベートメッセージの保護

#### 質問データ (`/questions/{questionId}`)
- **読み取り**: 全認証済みユーザー
- **書き込み**: 管理者のみ
- **目的**: 質問テンプレートの管理

### 3.2 Storage ルールのポイント

#### 音声メッセージ (`/voice-messages/{familyId}/{messageId}`)
- **読み取り**: 認証済みユーザーのみ
- **書き込み**: 認証済みユーザー、10MB以下、音声ファイル形式のみ
- **目的**: 音声ファイルの保護とサイズ制限

#### アバター画像 (`/avatars/{userId}/{fileName}`)
- **読み取り**: 全認証済みユーザー
- **書き込み**: 本人のみ、5MB以下、画像形式のみ
- **目的**: プロフィール画像の管理

## 4. セキュリティルールのテスト

### 4.1 Firestore ルールのテスト

Firebase Console → Firestore Database → ルール → Rules Playground

#### テストケース 1: 自分のデータにアクセス
```
Simulation type: get
Location: /users/test-user-id
Auth: Authenticated (test-user-id)
Result: ✅ Allowed
```

#### テストケース 2: 他人のデータにアクセス
```
Simulation type: get
Location: /users/other-user-id
Auth: Authenticated (test-user-id)
Result: ❌ Denied
```

#### テストケース 3: 未認証でアクセス
```
Simulation type: get
Location: /users/test-user-id
Auth: Unauthenticated
Result: ❌ Denied
```

### 4.2 Storage ルールのテスト

Firebase Console → Storage → ルール → Rules Playground

#### テストケース 1: 音声ファイルのアップロード
```
Simulation type: create
Location: /voice-messages/family123/msg456
Auth: Authenticated
File: audio/mpeg, 5MB
Result: ✅ Allowed
```

#### テストケース 2: 大きすぎるファイルのアップロード
```
Simulation type: create
Location: /voice-messages/family123/msg456
Auth: Authenticated
File: audio/mpeg, 15MB
Result: ❌ Denied (size limit)
```

## 5. 本番環境への適用

### 5.1 環境の確認

Firebase Console → プロジェクト設定:
- プロジェクトIDが正しいか確認
- 本番環境用のプロジェクトであることを確認

### 5.2 ルールのバックアップ

現在のルールをローカルに保存:
```bash
# Firestore ルール
firebase firestore:rules:get > firestore-rules-backup.txt

# Storage ルール
firebase storage:rules:get > storage-rules-backup.txt
```

### 5.3 ルールの適用

Firebase CLI を使用（オプション）:
```bash
# Firebase CLI のインストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクトの初期化
firebase init

# Firestore ルールのデプロイ
firebase deploy --only firestore:rules

# Storage ルールのデプロイ
firebase deploy --only storage:rules
```

## 6. モニタリングとデバッグ

### 6.1 ルール違反のログ確認

Firebase Console → Firestore Database または Storage → 使用状況:
- 拒否されたリクエストの数を確認
- 異常なアクセスパターンを検出

### 6.2 デバッグモード

開発中は詳細なログを有効化:
```javascript
// アプリ側で Firestore のログを有効化
import { enableIndexedDbPersistence } from 'firebase/firestore';
// デバッグ用の設定
```

## 7. セキュリティのベストプラクティス

### 7.1 定期的なレビュー
- [ ] 月に1回、セキュリティルールを見直す
- [ ] 不要なルールを削除
- [ ] 新機能に対応したルールを追加

### 7.2 最小権限の原則
- 必要最小限のアクセス権のみ付与
- デフォルトはすべて拒否

### 7.3 テストの実施
- 新しいルール適用前に必ずテスト
- CI/CD にルールテストを組み込む

### 7.4 監査ログの確認
- Firebase Console で定期的にアクセスログを確認
- 異常なアクセスパターンを検出

## 8. トラブルシューティング

### 問題: "permission-denied" エラー

**原因**:
- ユーザーが認証されていない
- ルールが厳しすぎる
- ドキュメントパスが間違っている

**解決方法**:
1. ユーザーがログインしているか確認
2. Rules Playground でルールをテスト
3. ドキュメントパスとルールのパスが一致するか確認

### 問題: ファイルアップロードが失敗

**原因**:
- ファイルサイズがルール制限を超えている
- ファイル形式が許可されていない
- ユーザーに書き込み権限がない

**解決方法**:
1. ファイルサイズを確認（音声: 10MB以下、画像: 5MB以下）
2. ファイル形式を確認（音声: audio/*, 画像: image/*）
3. Storage ルールを確認

### 問題: ルールが反映されない

**原因**:
- ブラウザまたはアプリのキャッシュ
- ルールの公開を忘れている

**解決方法**:
1. ルールを公開したか確認
2. アプリを再起動
3. ブラウザのキャッシュをクリア

## 9. チェックリスト

デプロイ前の確認:
- [ ] Firestore ルールが設定されている
- [ ] Storage ルールが設定されている
- [ ] Rules Playground でテスト済み
- [ ] ローカルでアプリの動作確認済み
- [ ] 本番環境のプロジェクトで設定している

本番公開後の確認:
- [ ] 実際のアプリでログイン・登録が動作する
- [ ] 音声メッセージのアップロード・再生が動作する
- [ ] 不正アクセスが拒否されることを確認
- [ ] Firebase Console でエラーログを確認

## 参考リンク

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Rules Playground](https://firebase.google.com/docs/rules/simulator)