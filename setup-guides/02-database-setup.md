# Supabaseデータベースセットアップガイド

## 前提条件
- Supabaseプロジェクトが作成済み
- Supabaseダッシュボードにアクセス可能

## 手順1: SQL Editorでスキーマを作成

1. Supabaseダッシュボードで **SQL Editor** に移動
2. 以下のSQLファイルを順番に実行してください

### 1-1. 基本スキーマとテーブル作成
**ファイル**: `family/database-schema.sql`

Supabase SQL Editorで新しいクエリを作成し、`database-schema.sql`の内容をコピー・ペーストして実行

### 1-2. 初期データの挿入
**ファイル**: `family/database-seed.sql`

基本的な質問カテゴリとテンプレートを挿入

### 1-3. セキュリティポリシーの設定
**ファイル**: `family/database-fix-policies-v3.sql`

Row Level Security (RLS) ポリシーを設定

### 1-4. ストレージの設定
**ファイル**: `family/database-storage-setup.sql`

ボイスメッセージとアバター画像用のストレージバケットを作成

### 1-5. アバター機能の追加
**ファイル**: `family/database-add-avatar.sql`

アバター関連の機能を追加

### 1-6. 関西弁質問の追加
**ファイル**: `family/database-kansai-questions.sql`

関西弁カテゴリと質問を追加

## 手順2: 実行手順

### 2-1. SQL実行方法
1. **SQL Editor** > **New query** をクリック
2. ファイルの内容をコピー&ペースト
3. **Run** ボタンをクリック
4. エラーがないことを確認

### 2-2. 実行順序（重要）
以下の順序で実行してください：

```
1. database-schema.sql       ← テーブル作成
2. database-seed.sql         ← 基本データ挿入
3. database-fix-policies-v3.sql ← セキュリティ設定
4. database-storage-setup.sql ← ストレージ設定
5. database-add-avatar.sql   ← アバター機能
6. database-kansai-questions.sql ← 関西弁機能
```

## 手順3: 設定確認

### 3-1. テーブル確認
**Table Editor** で以下のテーブルが作成されていることを確認：

- [ ] `profiles` - ユーザープロフィール
- [ ] `families` - 家族グループ
- [ ] `family_members` - 家族メンバー関係
- [ ] `question_categories` - 質問カテゴリ
- [ ] `question_templates` - 質問テンプレート
- [ ] `voice_messages` - ボイスメッセージ

### 3-2. RLS (Row Level Security) 確認
**Authentication** > **Policies** で各テーブルにポリシーが設定されていることを確認

### 3-3. ストレージ確認
**Storage** で以下のバケットが作成されていることを確認：

- [ ] `voice-messages` - ボイスメッセージファイル
- [ ] `avatars` - アバター画像

## 手順4: 認証設定

### 4-1. 認証プロバイダー設定
**Authentication** > **Providers** で：

1. **Email** を有効化（デフォルトで有効）
2. 必要に応じて **Google** や **GitHub** も有効化

### 4-2. メール設定
**Authentication** > **Settings** で：

- **Site URL**: `http://localhost:3000` (開発時)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

## 手順5: 動作テスト

### 5-1. SQL Editor でのテストクエリ
```sql
-- 質問カテゴリが正しく挿入されているか確認
SELECT * FROM question_categories;

-- 質問テンプレートが正しく挿入されているか確認
SELECT qt.question_text, qc.name as category_name
FROM question_templates qt
JOIN question_categories qc ON qt.category_id = qc.id
LIMIT 10;
```

### 5-2. RLSポリシーのテスト
```sql
-- RLSが有効になっているか確認
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;
```

## トラブルシューティング

### よくあるエラー

1. **Permission denied**
   - RLSポリシーの設定を確認
   - 認証状態を確認

2. **Table does not exist**
   - スキーマの実行順序を確認
   - 前のステップが正常に完了しているか確認

3. **Foreign key constraint**
   - 関連テーブルが先に作成されているか確認
   - 依存関係の順序を確認

### 解決方法

1. **SQL Editor** でエラーログを確認
2. **Table Editor** でテーブル構造を確認
3. 必要に応じてテーブルを削除して再作成

## 次のステップ

✅ Supabaseデータベースセットアップ完了
→ 次は「Firebaseプロジェクトのセットアップ」に進んでください

## セットアップ完了チェックリスト

- [ ] 全てのテーブルが作成されている
- [ ] 初期データが挿入されている
- [ ] RLSポリシーが設定されている
- [ ] ストレージバケットが作成されている
- [ ] 認証設定が完了している
- [ ] テストクエリが正常に実行される