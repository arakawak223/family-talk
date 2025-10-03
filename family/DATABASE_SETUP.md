# データベースセットアップ手順

## 概要

このアプリには2つの質問システムがあります:

1. **新しい2段階カテゴリー質問** (177問) - メインの質問セレクター
2. **元の質問テンプレート** (約120問) - 「その他の質問を見る」ボタンで表示

## セットアップ手順

### 1. 基本スキーマの作成

Supabase Dashboard > SQL Editor で以下のファイルを順番に実行:

```sql
-- 1. メインスキーマ
family/database-schema.sql

-- 2. ストレージ設定
family/database-storage-setup.sql

-- 3. 基本シードデータ（カテゴリーと基本的な質問）
family/database-seed.sql
```

### 2. 新しい2段階カテゴリー質問の作成 (177問)

```sql
-- 新しい質問システム（1次カテゴリー → 2次カテゴリー → 質問）
family/database-questions-v5.sql
```

### 3. 元の質問テンプレートの作成（「その他の質問」用）

```sql
-- 元の質問テンプレートを充実させる（約120問）
family/database-old-questions-seed.sql
```

### 4. オプション: 検索機能の追加

```sql
-- 質問にタグとキーワードを追加（検索機能用）
family/database-question-search.sql
```

## トラブルシューティング

### 「その他の質問を見る」ボタンを押しても質問が表示されない

**原因:** `question_templates` テーブルにデータがない

**解決策:**
```sql
-- database-old-questions-seed.sql を実行
-- このファイルは約120問の元の質問テンプレートを追加します
```

### 新しいカテゴリー質問が表示されない

**原因:** `questions` テーブルにデータがない

**解決策:**
```sql
-- database-questions-v5.sql を実行
-- このファイルは177問の2段階カテゴリー質問を追加します
```

### テーブルが存在しないエラー

**原因:** 基本スキーマが作成されていない

**解決策:**
```sql
-- database-schema.sql を実行
-- これでメインのテーブル構造が作成されます
```

## データベース構造

### 新しい2段階カテゴリーシステム

```
questions テーブル
├── primary_category (1次カテゴリー)
│   └── secondary_category (2次カテゴリー)
│       └── question_text (質問)
```

**1次カテゴリー:**
- 今の暮らし
- 思い出話
- 気持ち・想い
- ルーツ・歴史
- これから

### 元の質問テンプレートシステム

```
question_categories テーブル (カテゴリー)
└── question_templates テーブル (質問)
```

**カテゴリー:**
- 日常の関心
- 今日の予定
- 一日の振り返り
- 将来の希望
- 夢や目標
- 大切な存在
- 感謝の気持ち
- 応援・励まし
- 季節の話題
- 記念日・お祝い

## 確認用SQL

データが正しく登録されているか確認:

```sql
-- 新しい質問システムの確認（177問あるはず）
SELECT COUNT(*) FROM questions;

-- 元の質問テンプレートの確認（120問前後あるはず）
SELECT COUNT(*) FROM question_templates WHERE is_active = true;

-- カテゴリーの確認
SELECT * FROM question_categories ORDER BY name;

-- 1次カテゴリーの確認
SELECT DISTINCT primary_category FROM questions;
```

## 注意事項

- **両方のシステムを実装する理由:** 古いユーザーとの互換性を保ちつつ、新しい2段階カテゴリーシステムも提供するため
- **「その他の質問を見る」の位置づけ:** メインの177問に含まれない、より柔軟な質問やユニークな質問を提供
