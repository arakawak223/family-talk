-- 関西弁の質問テンプレートを追加
-- Supabase SQL Editorで実行してください

-- 関西弁カテゴリを追加
INSERT INTO question_categories (name, description, feeling_type, timing_type, target_type) VALUES
('関西弁で今日のこと', '関西弁で今日あったことを聞いてみよう！', 'interest', 'evening', 'all'),
('関西弁で気持ち', '関西弁で気持ちを聞いてみよう！', 'care', 'all', 'all'),
('関西弁で楽しい話', '関西弁で楽しい話を聞いてみよう！', 'encourage', 'all', 'all');

-- 関西弁質問テンプレートを追加
-- 今日のことカテゴリ
INSERT INTO question_templates (category_id, question_text)
SELECT id, '今日なんかええことあった？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日はどんな一日やった？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日一番おもろかったこと教えて？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日頑張ったこと何かある？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日新しく知ったこと何かあるー？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日美味しいもん食べた？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日疲れたことある？お疲れさん！' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日誰かに会った？どんな人？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日失敗したこととかある？大丈夫？' FROM question_categories WHERE name = '関西弁で今日のこと'
UNION ALL
SELECT id, '今日の天気どうやった？' FROM question_categories WHERE name = '関西弁で今日のこと';

-- 気持ちカテゴリ
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'なんか元気ないけど大丈夫？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '最近調子どう？元気にしてる？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, 'なんか心配事とかない？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '今の気分教えて？機嫌どう？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '最近うれしかったことある？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, 'ストレス溜まってない？無理したらあかんで？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '今度一緒に遊ばへん？何したい？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '最近よー笑ってる？笑顔が一番やで！' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, '体調どう？ちゃんと食べてる？' FROM question_categories WHERE name = '関西弁で気持ち'
UNION ALL
SELECT id, 'なんか悩んでることない？聞くで？' FROM question_categories WHERE name = '関西弁で気持ち';

-- 楽しい話カテゴリ
INSERT INTO question_templates (category_id, question_text)
SELECT id, '最近ハマってることある？教えて！' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, 'なんかおもろい話ない？聞かせて！' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '今度の休みは何するん？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, 'おすすめの映画とかドラマある？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '好きな食べもん何？今度一緒に食べよ！' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '最近読んだ本で面白いのあった？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '子どもの頃好きやった遊び覚えてる？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '今欲しいもんとかある？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '最近行ったところでよかったとこある？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, 'なんか新しいことチャレンジしたい？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '一番好きな季節いつ？なんでそれが好き？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '昔よく遊んだ場所とかある？懐かしいなあ' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, 'もし宝くじ当たったら何する？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '家族でどっか旅行行くとしたらどこがええ？' FROM question_categories WHERE name = '関西弁で楽しい話'
UNION ALL
SELECT id, '今年中にやりたいことある？' FROM question_categories WHERE name = '関西弁で楽しい話';