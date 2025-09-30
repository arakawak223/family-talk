# Firebaseセキュリティルール設定ガイド

## 前提条件
- Firebaseプロジェクトが作成済み
- Firestore Database と Storage が有効化済み

## 手順1: Firestore セキュリティルールの設定

### 1-1. 現在のルールを確認
1. Firebase Console > **Firestore Database** > **ルール** に移動
2. 現在のルール（テストモード）を確認:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

### 1-2. 本番用セキュリティルールに更新
以下のルールをコピーして貼り付け:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザー情報：本人のみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 家族グループ：メンバーのみアクセス可能
    match /families/{familyId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.members;

      // 新規作成時：作成者のみ
      allow create: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }

    // ボイスメッセージ：認証済みユーザーのみ
    match /voice_messages/{messageId} {
      // 読み取り：受信者リストに含まれるユーザーまたは送信者
      allow read: if request.auth != null &&
        (request.auth.uid in resource.data.receiverIds ||
         request.auth.uid == resource.data.senderId);

      // 作成：認証済みユーザー（送信者IDが本人と一致）
      allow create: if request.auth != null &&
        request.auth.uid == resource.data.senderId;

      // 更新：送信者のみ（聞いた状態の更新など）
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.senderId;

      // 削除：送信者のみ
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.senderId;
    }

    // その他の未定義ドキュメント：アクセス拒否
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 1-3. ルールの公開
1. **公開** ボタンをクリック
2. 変更が反映されるまで数分待機

## 手順2: Storage セキュリティルールの設定

### 2-1. 現在のルールを確認
1. Firebase Console > **Storage** > **ルール** に移動
2. 現在のルール（テストモード）を確認

### 2-2. 本番用セキュリティルールに更新
以下のルールをコピーして貼り付け:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // ボイスメッセージファイル
    match /voice-messages/{allPaths=**} {
      // 認証済みユーザーのみアップロード・ダウンロード可能
      allow read, write: if request.auth != null;

      // ファイルサイズ制限（10MB）
      allow write: if request.resource.size < 10 * 1024 * 1024;

      // 音声ファイルのみ許可
      allow write: if request.resource.contentType.matches('audio/.*');
    }

    // アバター画像
    match /avatars/{userId}/{allPaths=**} {
      // 本人のみアップロード可能、すべての認証済みユーザーが閲覧可能
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;

      // ファイルサイズ制限（5MB）
      allow write: if request.resource.size < 5 * 1024 * 1024;

      // 画像ファイルのみ許可
      allow write: if request.resource.contentType.matches('image/.*');
    }

    // その他のファイル：アクセス拒否
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 2-3. ルールの公開
1. **公開** ボタンをクリック
2. 変更が反映されるまで数分待機

## 手順3: セキュリティルールのテスト

### 3-1. Firestore ルールのテスト
1. **Firestore Database** > **ルール** > **ルールプレイグラウンド**
2. テストケース例:

```javascript
// 認証済みユーザーが自分のデータを読み取り
auth: {uid: 'user123'}
path: /databases/(default)/documents/users/user123
operation: read
```

### 3-2. Storage ルールのテスト
1. **Storage** > **ルール** > **ルールプレイグラウンド**
2. テストケース例:

```javascript
// 認証済みユーザーがボイスメッセージをアップロード
auth: {uid: 'user123'}
path: /voice-messages/message123.m4a
operation: create
```

## 手順4: 追加のセキュリティ設定

### 4-1. Authentication セキュリティ設定
1. **Authentication** > **Settings** > **ユーザー アクション**
2. 推奨設定:
   - **メール確認**: オン
   - **SMS 複数要素認証**: オン（必要に応じて）
   - **メール列挙の保護**: オン

### 4-2. プロジェクトレベルのセキュリティ
1. **プロジェクトの設定** > **全般**
2. **Google Cloud Platform (GCP) リソースの場所**: 設定済み確認
3. **公開設定**: 適切な制限を確認

## 手順5: セキュリティルールの監視

### 5-1. セキュリティ監視の設定
1. **Firestore Database** > **使用量**
2. 異常なアクセスパターンを監視
3. **セキュリティ ルール** > **分析情報** で拒否されたリクエストを確認

### 5-2. アラート設定
1. **IAM と管理** > **監査ログ**
2. 必要に応じてログ保存とアラートを設定

## セキュリティルールの説明

### Firestore ルールの要点
- **認証必須**: すべての操作で `request.auth != null` をチェック
- **所有者制限**: ユーザーは自分のデータのみアクセス可能
- **家族グループ**: メンバーシップをチェック
- **ボイスメッセージ**: 送信者・受信者のみアクセス可能

### Storage ルールの要点
- **ファイルタイプ制限**: 音声・画像ファイルのみ許可
- **サイズ制限**: 適切なファイルサイズに制限
- **パス制限**: 決められたパス構造のみ許可

## トラブルシューティング

### よくあるエラー

1. **Permission denied**
   ```
   解決方法：
   - ユーザーが正しく認証されているか確認
   - ルールの条件が正しいか確認
   - データ構造がルールと一致しているか確認
   ```

2. **Resource not found**
   ```
   解決方法：
   - ドキュメントが存在するか確認
   - パスが正しいか確認
   - 読み取り権限があるか確認
   ```

3. **Invalid argument**
   ```
   解決方法：
   - ルールの構文エラーを確認
   - フィールド名が正しいか確認
   - データ型が一致しているか確認
   ```

## 次のステップ

✅ Firebaseセキュリティルール設定完了
→ 次は「アプリケーション設定ファイルの更新」に進んでください

## セキュリティチェックリスト

- [ ] Firestore ルールが本番用に更新されている
- [ ] Storage ルールが本番用に更新されている
- [ ] ルールのテストが完了している
- [ ] Authentication セキュリティ設定が完了している
- [ ] 監視設定が有効になっている

**⚠️ 重要**: セキュリティルールは本番環境では非常に重要です。十分にテストしてから公開してください。