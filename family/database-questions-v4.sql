-- 質問テンプレートをVersion4に置き換え
-- 「関係性を深める質問」を既存カテゴリーに統合
-- カテゴリーを6分類に維持：標準語5分類＋関西弁1分類
-- Supabase SQL Editorで実行してください

-- 既存の質問テンプレートとカテゴリを削除
DELETE FROM question_templates;
DELETE FROM question_categories;

-- ========================================
-- 標準語バージョン（5分類）
-- ========================================

-- カテゴリを作成
INSERT INTO question_categories (name, description, feeling_type, timing_type, target_type) VALUES
('日常の関心・興味', '今日の予定や一日の振り返り', 'interest', 'all', 'all'),
('未来への希望', '将来の希望や夢・目標について', 'hope', 'all', 'all'),
('大切に思う気持ち', '相手を大切に思っていることを伝える', 'care', 'all', 'all'),
('励まし・応援', '相手を励ます・応援する質問', 'encourage', 'all', 'all'),
('季節・特別な日', '季節の話題や記念日・お祝い', 'interest', 'seasonal', 'all'),
('関西弁', '関西弁で気軽に話しかける', 'interest', 'all', 'all');

-- ========================================
-- 1. 日常の関心・興味
-- ========================================

-- 今日の予定（朝向け）
INSERT INTO question_templates (category_id, question_text)
SELECT id, '今日はどんな気分？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '昨日はぐっすり眠れた？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日はどんな風に過ごしたい？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日は何か楽しいことあるかな？' FROM question_categories WHERE name = '日常の関心・興味';

-- 一日の振り返り（夜向け）
INSERT INTO question_templates (category_id, question_text)
SELECT id, '今日はどんな一日だった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今はどんな気分？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日はなにかいいことあった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日は何が一番楽しかった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日はどんなこと頑張った？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日はどんな発見があった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今日はおもしろいニュースあった？' FROM question_categories WHERE name = '日常の関心・興味';

-- 【追加】感情の言語化を促す質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '最近、心が温かくなった瞬間ってあった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '今週、誰かに「ありがとう」って言いたくなったことある？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '最近、誰かの優しさに触れたことってある？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, 'どんな瞬間に「家族っていいな」って思う？' FROM question_categories WHERE name = '日常の関心・興味';

-- 【追加】過去の記憶を共有する質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '子どもの頃、一番好きだった遊びは何だった？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '家族で一番楽しかった思い出って何？' FROM question_categories WHERE name = '日常の関心・興味'
UNION ALL
SELECT id, '一番心に残ってる家族の言葉ってある？' FROM question_categories WHERE name = '日常の関心・興味';

-- ========================================
-- 2. 未来への希望
-- ========================================

-- 将来の希望
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'どんなことができたら嬉しい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんなことができたら最高？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんなことができるようになったら嬉しい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'それができたらどんな気分？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんな自分になりたい？' FROM question_categories WHERE name = '未来への希望';

-- 夢や目標
INSERT INTO question_templates (category_id, question_text)
SELECT id, '最近どんなことに興味ある？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, '最近はまっていることはどんなこと？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'やってみたいことはなにかある？どんなこと？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんなことを学んでみたい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんなところに行ってみたい？' FROM question_categories WHERE name = '未来への希望';

-- 【追加】価値観を知る質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'あなたにとって「幸せ」ってどんな状態？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, '人生で一番大切にしたいことって何？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'もし時間が無限にあったら、何をして過ごしたい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'どんな人になりたいって思ってる？' FROM question_categories WHERE name = '未来への希望';

-- 【追加】未来を一緒に描く質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '家族でやってみたいことって何かある？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, '10年後、どんな家族でいたい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'これから一緒にどんな思い出を作りたい？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, '家族みんなで叶えたい夢ってある？' FROM question_categories WHERE name = '未来への希望'
UNION ALL
SELECT id, 'いつか一緒に行きたい場所ってある？' FROM question_categories WHERE name = '未来への希望';

-- ========================================
-- 3. 大切に思う気持ち
-- ========================================

-- 大切な存在
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'それができたときはまず誰にそれを伝えたい？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '今一番大切にしていることは何？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, 'どんなときに幸せを感じる？' FROM question_categories WHERE name = '大切に思う気持ち';

-- 感謝の気持ち
INSERT INTO question_templates (category_id, question_text)
SELECT id, '今日はどんなことにありがとうって思った？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '最近嬉しかったことは何？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '今どんなことに感謝してる？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '今までですごく感謝してることってどんなこと？' FROM question_categories WHERE name = '大切に思う気持ち';

-- 【追加】存在を肯定する質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '生まれてきてくれてありがとう。今どんな気持ち？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, 'あなたがいてくれて、私は本当に幸せ。あなたはどう？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, 'あなたの笑顔を見ると元気が出る。あなたはどんなとき元気出る？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, 'いつも頑張ってるね。今、どんな気持ち？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, 'あなたはあなたのままでいい。そう言われてどう思う？' FROM question_categories WHERE name = '大切に思う気持ち';

-- 【追加】相互理解を深める質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '私のこと、どんな人だと思ってる？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '私にもっとこうして欲しいってことある？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '一緒にいて楽しいときってどんなとき？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '私があなたのためにできることって何かある？' FROM question_categories WHERE name = '大切に思う気持ち'
UNION ALL
SELECT id, '私たち家族の好きなところってどこ？' FROM question_categories WHERE name = '大切に思う気持ち';

-- 【追加】感情の言語化（愛情表現）
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'どんな言葉をかけられると、一番嬉しい？' FROM question_categories WHERE name = '大切に思う気持ち';

-- ========================================
-- 4. 励まし・応援
-- ========================================

INSERT INTO question_templates (category_id, question_text)
SELECT id, '今頑張っていることはある？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '何か手伝えることはある？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, 'どんなふうに応援したらいい？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '今日もお疲れさま！どんな一日だった？' FROM question_categories WHERE name = '励まし・応援';

-- 【追加】相手の強みを認識させる質問
INSERT INTO question_templates (category_id, question_text)
SELECT id, '自分のどんなところが好き？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '最近、自分で「よくやった！」って思ったことある？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '周りの人から「すごいね」って言われたことある？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '自分の得意なことって何だと思う？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, 'あなたが家族にしてあげられることって何だと思う？' FROM question_categories WHERE name = '励まし・応援';

-- 【追加】過去の記憶を振り返る質問（自己肯定感を高める）
INSERT INTO question_templates (category_id, question_text)
SELECT id, '小さい頃の自分に会えるとしたら、何て声をかけたい？' FROM question_categories WHERE name = '励まし・応援'
UNION ALL
SELECT id, '昔の自分が今の自分を見たら、なんて言うと思う？' FROM question_categories WHERE name = '励まし・応援';

-- ========================================
-- 5. 季節・特別な日
-- ========================================

-- 季節の話題
INSERT INTO question_templates (category_id, question_text)
SELECT id, '春になったね、なにかやりたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '春だね、どこか行きたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '秋になったね、なにかやりたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '秋だね、どこか行きたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '今年の夏はなにかやりたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '今年の冬はなにかやりたいことある？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '暑いねえ、体調はどう？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '寒いねえ、体調はどう？' FROM question_categories WHERE name = '季節・特別な日';

-- 記念日・お祝い
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'お誕生日おめでとう！○歳になって、どんな一年にしたい？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, '今日はどんな気持ち？' FROM question_categories WHERE name = '季節・特別な日'
UNION ALL
SELECT id, 'おめでとう！どんな気分？' FROM question_categories WHERE name = '季節・特別な日';

-- ========================================
-- 6. 関西弁（全ての関西弁質問を統合）
-- ========================================

-- 関西弁で今日のこと（夜向け）
INSERT INTO question_templates (category_id, question_text)
SELECT id, '今日なんかええことあった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日は一日どないやった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日なんかおもろいことあった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日なんかがんばった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日なんか新しいことあった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日なんか美味しいもん食べた？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日は〇〇お疲れさんやったね！どやった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日誰かとおうたん（会うたん）？どんな人？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日なんかやらかしたん？大丈夫やった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今日そっちはどんな天気やったん？' FROM question_categories WHERE name = '関西弁';

-- 関西弁で気持ち
INSERT INTO question_templates (category_id, question_text)
SELECT id, 'なんか元気ないけど大丈夫？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '最近調子どない？元気にしてるん？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'なんか心配事でもあんの？言うてみい？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'なんか悩んでることあんの？聞くで？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今気分どない？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '最近なんかええことあったん？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '最近なんかおもろいことあった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'ストレス溜まってんのちゃう？無理したらあかんで？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今度一緒に遊ばへん？何したい？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '体調どない？ちゃんと食べてる？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '体調どない？ちゃんと寝れてる？' FROM question_categories WHERE name = '関西弁';

-- 関西弁で楽しい話
INSERT INTO question_templates (category_id, question_text)
SELECT id, '最近ハマってることあんの？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'なんかおもろい話ないの？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '今度の休みは何すんの？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'おすすめの映画とかドラマなんかある？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '好きな食べもん何？今度一緒に食べよ！' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '最近なんかおもろい本あった？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '昔やった、あれ、なんやったけ？覚えてる？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'なんか欲しいもんとかあんの？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '最近なんかおもろいとこ行った？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'なんかやりたいことあんの？' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '〇〇はすごいな、たぶん世界一ちゃう？知らんけど！' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '〇〇は旨いな、たぶん関西一やで、いや日本一ちゃう？知らんけど！' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, 'もし宝くじ当たったら何する？今回絶対当たると思うねん、知らんけど！' FROM question_categories WHERE name = '関西弁'
UNION ALL
SELECT id, '家族で今度どっか旅行行くとしたらどこがええ？' FROM question_categories WHERE name = '関西弁';
