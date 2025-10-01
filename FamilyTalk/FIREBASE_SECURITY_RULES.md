# Firebase セキュリティルール設定ガイド

## 概要
このガイドでは、FamilyTalkアプリのFirebaseセキュリティルールを設定します。
**これはアプリのセキュリティに必須の設定です。**

---

## 🔒 セキュリティルールとは？

Firebase セキュリティルールは:
- データベースとストレージへのアクセスを制御
- 認証されたユーザーのみがデータにアクセスできるように保護
- 不正なアクセスを防止

**重要**: ルールを設定しないと、誰でもデータにアクセスできてしまいます！

---

## 📋 設定手順

### 1. Firebase Consoleにアクセス

1. **Firebase Console を開く**
   👉 https://console.firebase.google.com

2. **プロジェクトを選択**
   - プロジェクト名: `familytalk-bdcc7`

---

## 🗄️ Firestore セキュリティルール

### ステップ1: Firestoreに移動

1. 左サイドバーから **「Firestore Database」** をクリック
2. 上部タブの **「ルール」** をクリック

### ステップ2: ルールを更新

以下のルールをコピーして貼り付けてください:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザープロフィール
    match /users/{userId} {
      // 自分のプロフィールのみ読み書き可能
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    // 家族グループ
    match /families/{familyId} {
      // 認証済みユーザーで、かつ家族メンバーである場合のみアクセス可能
      allow read: if request.auth != null
        && request.auth.uid in resource.data.members;

      allow create: if request.auth != null
        && request.auth.uid in request.resource.data.members;

      allow update, delete: if request.auth != null
        && request.auth.uid in resource.data.members;
    }

    // 音声メッセージ
    match /voiceMessages/{messageId} {
      // 認証済みユーザーは読み取り可能
      allow read: if request.auth != null;

      // 認証済みユーザーは自分のメッセージを作成可能
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.senderId;

      // 自分のメッセージのみ更新・削除可能
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.senderId;
    }

    // 質問データ
    match /questions/{questionId} {
      // 全ての認証済みユーザーが読み取り可能
      allow read: if request.auth != null;

      // 作成・更新・削除は管理者のみ（必要に応じて調整）
      allow write: if false; // 現在は無効化（管理者機能実装時に変更）
    }

    // 回答データ
    match /answers/{answerId} {
      // 認証済みユーザーは読み取り可能
      allow read: if request.auth != null;

      // 自分の回答のみ作成可能
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;

      // 自分の回答のみ更新・削除可能
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### ステップ3: 公開

1. 右上の **「公開」** ボタンをクリック
2. 確認ダイアログで **「公開」** をクリック

---

## 📦 Storage セキュリティルール

### ステップ1: Storageに移動

1. 左サイドバーから **「Storage」** をクリック
2. 上部タブの **「ルール」** をクリック

### ステップ2: ルールを更新

以下のルールをコピーして貼り付けてください:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // 音声メッセージファイル
    match /voice-messages/{userId}/{allPaths=**} {
      // 認証済みユーザーのみ読み取り可能
      allow read: if request.auth != null;

      // 自分のフォルダにのみアップロード可能
      allow write: if request.auth != null
        && request.auth.uid == userId
        // ファイルサイズ制限: 10MB
        && request.resource.size < 10 * 1024 * 1024
        // 音声ファイルのみ許可
        && request.resource.contentType.matches('audio/.*');
    }

    // プロフィール画像
    match /profile-images/{userId}/{allPaths=**} {
      // 全ての認証済みユーザーが読み取り可能
      allow read: if request.auth != null;

      // 自分のプロフィール画像のみアップロード可能
      allow write: if request.auth != null
        && request.auth.uid == userId
        // ファイルサイズ制限: 5MB
        && request.resource.size < 5 * 1024 * 1024
        // 画像ファイルのみ許可
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### ステップ3: 公開

1. 右上の **「公開」** ボタンをクリック
2. 確認ダイアログで **「公開」** をクリック

---

## ✅ 設定確認

### Firestore ルール確認

1. Firebase Console → Firestore Database → ルール
2. 以下が表示されていることを確認:
   ```
   ルールのバージョン: rules_version = '2'
   公開日時: (最新の日時)
   ```

### Storage ルール確認

1. Firebase Console → Storage → ルール
2. 以下が表示されていることを確認:
   ```
   ルールのバージョン: rules_version = '2'
   公開日時: (最新の日時)
   ```

---

## 🧪 テスト方法

### Firestore ルールテスト

Firebase Console でテストできます:

1. Firestore Database → ルール タブ
2. 「ルールプレイグラウンド」をクリック
3. テストシナリオを実行:

**テスト1: 未認証ユーザー**
```
タイプ: get
場所: /users/test123
認証: なし
結果: ❌ 拒否されるべき
```

**テスト2: 認証済みユーザー（自分のデータ）**
```
タイプ: get
場所: /users/test123
認証: test123
結果: ✅ 許可されるべき
```

### Storage ルールテスト

アプリで実際にテスト:
1. 音声メッセージを録音・アップロード
2. 他のユーザーのデータにアクセスできないことを確認

---

## ⚠️ セキュリティのベストプラクティス

### 1. 認証を必須にする
```javascript
// ❌ 悪い例
allow read, write: if true;

// ✅ 良い例
allow read, write: if request.auth != null;
```

### 2. 所有者チェックを実装
```javascript
// ❌ 悪い例
allow write: if request.auth != null;

// ✅ 良い例
allow write: if request.auth != null
  && request.auth.uid == resource.data.ownerId;
```

### 3. ファイルサイズとタイプを制限
```javascript
// ✅ 良い例
allow write: if request.resource.size < 10 * 1024 * 1024
  && request.resource.contentType.matches('audio/.*');
```

### 4. データバリデーション
```javascript
// ✅ 良い例
allow create: if request.resource.data.keys().hasAll(['name', 'createdAt'])
  && request.resource.data.name is string;
```

---

## 🔧 トラブルシューティング

### エラー: "Permission denied"

**原因**: セキュリティルールが厳しすぎる、または設定ミス

**解決方法**:
1. Firebase Console → Firestore/Storage → ルール を確認
2. ルールが正しくコピーされているか確認
3. ユーザーが正しく認証されているか確認（`request.auth != null`）

---

### エラー: "Invalid argument"

**原因**: ルールの構文エラー

**解決方法**:
1. ルールを再度コピー＆ペースト
2. セミコロンやカッコが正しいか確認
3. `rules_version = '2';` が先頭にあるか確認

---

### ファイルアップロードエラー

**原因**: ファイルサイズまたはタイプの制限

**解決方法**:
1. ファイルサイズを確認（音声: 10MB以下、画像: 5MB以下）
2. ファイルタイプを確認（音声: audio/*, 画像: image/*）
3. エラーメッセージを確認してルールを調整

---

## 📚 参考リンク

- [Firebase セキュリティルール公式ドキュメント](https://firebase.google.com/docs/rules)
- [Firestore セキュリティルールガイド](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage セキュリティルールガイド](https://firebase.google.com/docs/storage/security)
- [ルールのベストプラクティス](https://firebase.google.com/docs/rules/rules-and-auth)

---

## ✅ チェックリスト

設定完了後、以下を確認してください:

- [ ] Firestore セキュリティルールを設定
- [ ] Firestore ルールを公開
- [ ] Storage セキュリティルールを設定
- [ ] Storage ルールを公開
- [ ] ルールプレイグラウンドでテスト
- [ ] アプリで動作確認

---

## 🎉 次のステップ

セキュリティルール設定が完了したら:

1. **Webアプリのテスト**
   - Vercel URL にアクセス
   - ユーザー登録・ログイン
   - 音声メッセージの送受信

2. **モバイルアプリのビルド** (オプション)
   - iOS: `IOS_BUILD_GUIDE.md`
   - Android: `ANDROID_BUILD_GUIDE.md`
