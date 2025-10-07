# 双六ゲーム＆イベント機能 実装ガイド

## 📦 実装完了項目

### 1. データベーススキーマ
- ✅ `database-sugoroku-system.sql` - 双六ゲームシステム全体
- ✅ `database-sugoroku-gifts-seed.sql` - ギフトデータとマス配置
- ✅ `database-events-calendar.sql` - イベント・カレンダー機能

### 2. TypeScript型定義
- ✅ `lib/types/sugoroku.ts` - 双六ゲーム関連の型
- ✅ `lib/types/events.ts` - イベント・カレンダー関連の型

### 3. API関数
- ✅ `lib/api/points.ts` - ポイントシステム
- ✅ `lib/api/sugoroku.ts` - 双六ゲーム
- ✅ `lib/api/events.ts` - イベント・カレンダー

### 4. UIコンポーネント
- ✅ `components/sugoroku/sugoroku-board.tsx` - 双六ボードメイン
- ✅ `components/sugoroku/sugoroku-square.tsx` - 双六マス
- ✅ `components/sugoroku/dice-roller.tsx` - サイコロ/ルーレット
- ✅ `components/dashboard/message-calendar.tsx` - イベント表示機能追加済み

---

## 🚀 セットアップ手順

### Step 1: データベースのセットアップ

Supabaseの管理画面で以下のSQLを順番に実行してください：

```bash
# 1. 双六システムの基本スキーマ
family/database-sugoroku-system.sql

# 2. イベント・カレンダーシステム
family/database-events-calendar.sql

# 3. ギフトとマス配置の初期データ
family/database-sugoroku-gifts-seed.sql
```

### Step 2: ダッシュボードに双六ボードを追加

`family/app/dashboard/page.tsx` に以下を追加：

```tsx
import { SugorokuBoard } from "@/components/sugoroku/sugoroku-board";

// DashboardContentコンポーネント内に追加
<div className="mb-8">
  <SugorokuBoard
    userId={user.profile?.id || ""}
    familyId={selectedFamily.id}
  />
</div>
```

### Step 3: イベント作成UIの追加（オプション）

イベント作成フォームを追加する場合：

```tsx
// 新しいコンポーネント: components/events/event-form.tsx を作成
// イベント作成、編集、削除機能を実装
```

---

## 🎮 機能説明

### 双六ゲーム

#### ポイント獲得ルール
```
送信: 10pt
聴く: 5pt
返信: 15pt
連続送信: +20pt
初めての人に送信: +5pt
全員が聴いた: +10pt
```

#### サイコロ/ルーレット
```
サイコロ: 50pt消費、1〜6マス進む
ルーレット: 100pt消費、1〜10マス進む
```

#### マスの種類
- 🎁 ギフトマス: ランダムなギフト獲得
- 💰 ボーナスマス: 追加ポイント
- 🎰 チャンスマス: もう一度振れる
- 👨‍👩‍👧‍👦 家族イベント: 全員にポイント
- 📝 ミッション: お題クリアで報酬
- ☕ 休憩マス: アニメーション
- 🏁 ゴール: 次のボード解放

#### ギフトの種類
```
レベル1（よく出る）:
- バッジ（メッセージマスター、おしゃべり王など）
- カラー（朝陽、空色、桜色など）
- フレーム（シンプル、ドットなど）

レベル2（時々出る）:
- 特別バッジ（家族の絆、100日戦士など）
- レアカラー（虹色、星空など）
- スタンプ（ハート、サムズアップなど）
- 特別質問パック

レベル3（レア）:
- 伝説バッジ（伝説の語り部など）
- エフェクト（キラキラ、ハートなど）
- ダイヤモンドフレーム
- 特別機能（タイムカプセルなど）
```

### イベント・カレンダー

#### イベントタイプ
- 🎂 誕生日: プロフィールから自動表示
- 🎉 記念日: 結婚記念日、入学式など
- 🎄 季節イベント: お正月、クリスマスなど
- 📌 カスタム: 自由に追加

#### 通知設定
- 3日前
- 前日
- 当日
- 個人ごとに有効/無効を設定可能

---

## 🔧 カスタマイズポイント

### ギフト内容の追加・変更

`database-sugoroku-gifts-seed.sql` を編集して、新しいギフトを追加：

```sql
INSERT INTO gifts (name, description, gift_type, rarity, icon_url, metadata) VALUES
('新しいギフト', '説明', 'badge', 'common', '🎁', '{"color": "#FF0000"}');
```

### マスイベントの追加

50マスの配置は `database-sugoroku-gifts-seed.sql` で設定済み。
後から特定のマスのイベント内容を変更する場合：

```sql
UPDATE sugoroku_squares
SET event_data = '{"rarity": "legendary", "message": "超レア！"}'::jsonb
WHERE board_id = 'ボードID' AND position = 25;
```

### ボードの追加

2つ目以降のボードのマス配置を作成：

```sql
-- ボード2「なかよし街道」のマス配置
-- board_numberが2のボードIDを取得して、同様にマスを配置
```

---

## 📝 次のステップ（今後の拡張案）

### 1. メッセージ送信時にポイント自動付与
`components/voice/voice-recorder.tsx` の送信完了時に：
```tsx
import { addPoints } from "@/lib/api/points";

// メッセージ送信後
await addPoints(userId, familyId, 'send', messageId);
```

### 2. メッセージ再生時にポイント付与
`components/voice/voice-messages-list.tsx` の再生時に：
```tsx
await addPoints(userId, familyId, 'listen', messageId);
```

### 3. イベント通知メール送信
Supabase Edge Functionsで日次バッチ処理を実装：
- 今後3日以内のイベントをチェック
- 通知設定に基づいてメール送信
- `event_notifications_sent`に記録

### 4. ギフト装備システム
ユーザーが獲得したギフトを装備・使用できるUI：
```tsx
// components/profile/gift-inventory.tsx
// 獲得ギフト一覧表示
// 装備/解除機能
```

### 5. ミッションシステムの実装
マスイベントの`mission`タイプの判定ロジック：
```tsx
// lib/api/missions.ts
// ミッション達成判定
// 報酬付与
```

---

## ⚠️ 注意事項

1. **データベース順序**: SQLファイルは番号順に実行してください
2. **RLSポリシー**: 既存のポリシーと競合しないように注意
3. **エラーハンドリング**: API関数でエラーが発生した場合のUI表示を実装してください
4. **パフォーマンス**: 大量のデータがある場合はページネーション実装を推奨

---

## 🎯 完成イメージ

### ダッシュボード構成（提案）
```
1. ヘッダー（ユーザー情報、ナビゲーション）
2. ボイスメッセージ送信フォーム
3. 双六ボード ← 新規追加
4. メッセージカレンダー（イベント表示対応済み）
5. 最近のメッセージ一覧
```

### 双六ボード表示内容
```
- 現在のポイント、順位、進捗
- サイコロ/ルーレットボタン
- 50マスのビジュアル表示
- 家族ランキング
```

---

## 🐛 トラブルシューティング

### Q: データベースエラーが出る
A: 以下を確認してください：
- SQLファイルが順番に実行されているか
- 既存のテーブルと名前が競合していないか
- RLSポリシーが正しく設定されているか

### Q: ポイントが付与されない
A: 以下を確認：
- `user_points`テーブルにレコードが作成されているか
- メッセージ送信・受信のコールバックで`addPoints`が呼ばれているか

### Q: イベントがカレンダーに表示されない
A: 以下を確認：
- `calendar_events`ビューが正しく作成されているか
- `event_date`の形式が`YYYY-MM-DD`になっているか
- `getMonthEvents`API関数が正しく呼ばれているか

---

## 📚 参考情報

- Supabase公式ドキュメント: https://supabase.com/docs
- React Hooks: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com/docs

---

以上で実装完了です！🎉
