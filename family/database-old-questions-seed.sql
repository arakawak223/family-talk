-- 元の質問テンプレート（その他の質問として表示される）
-- これらの質問は「その他の質問を見る」ボタンから表示されます

-- ステップ1: 必要なカテゴリーを作成（既存チェック付き）
DO $$
BEGIN
  -- 日常の関心
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '日常の関心') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('日常の関心', '相手の日常に興味を示す質問', 'interest');
  END IF;

  -- 今日の予定
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '今日の予定') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('今日の予定', '今日の活動予定について聞く', 'interest');
  END IF;

  -- 一日の振り返り
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '一日の振り返り') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('一日の振り返り', '一日の出来事を振り返る', 'interest');
  END IF;

  -- 将来の希望
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '将来の希望') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('将来の希望', '相手の未来への願いを聞く', 'hope');
  END IF;

  -- 夢や目標
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '夢や目標') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('夢や目標', '相手の夢や目標について', 'hope');
  END IF;

  -- 大切な存在
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '大切な存在') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('大切な存在', '相手への愛情を表現', 'care');
  END IF;

  -- 感謝の気持ち
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '感謝の気持ち') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('感謝の気持ち', '相手への感謝を伝える', 'gratitude');
  END IF;

  -- 応援・励まし
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '応援・励まし') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('応援・励まし', '相手を励ます質問', 'encourage');
  END IF;

  -- 季節の話題
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '季節の話題') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('季節の話題', '季節に関連した質問', 'interest');
  END IF;

  -- 記念日・お祝い
  IF NOT EXISTS (SELECT 1 FROM question_categories WHERE name = '記念日・お祝い') THEN
    INSERT INTO question_categories (name, description, feeling_type)
    VALUES ('記念日・お祝い', '特別な日の質問', 'care');
  END IF;
END $$;

-- ステップ2: 質問テンプレートの挿入
INSERT INTO question_templates (category_id, question_text, is_active) VALUES

-- 日常の関心・興味（朝）
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今日はどんな気分？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '昨日はぐっすり眠れた？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今日はどんな風に過ごしたい？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今日は何か楽しいことあるかな？', true),

-- 一日の振り返り（夜）
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日はどんな一日だった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今はどんな気分？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日はなにかいいことあった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日は何が一番楽しかった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日はどんなこと頑張った？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日はどんな発見があった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日はおもしろいニュースあった？', true),

-- 感情の言語化
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近、心が温かくなった瞬間ってあった？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '今週、誰かに「ありがとう」って言いたくなったことある？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '最近、誰かの優しさに触れたことってある？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'どんな瞬間に「家族っていいな」って思う？', true),

-- 過去の記憶
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '子どもの頃、一番好きだった遊びは何だった？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '家族で一番楽しかった思い出って何？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '一番心に残ってる家族の言葉ってある？', true),

-- 未来への希望
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'どんなことができたら嬉しい？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'どんなことができたら最高？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'どんなことができるようになったら嬉しい？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'それができたらどんな気分？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'どんな自分になりたい？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), '最近どんなことに興味ある？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), '最近はまっていることはどんなこと？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), 'やってみたいことはなにかある？どんなこと？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), 'どんなことを学んでみたい？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), 'どんなところに行ってみたい？', true),

-- 価値観
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'あなたにとって「幸せ」ってどんな状態？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '人生で一番大切にしたいことって何？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'もし時間が無限にあったら、何をして過ごしたい？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), 'どんな人になりたいって思ってる？', true),

-- 一緒に描く未来
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '家族でやってみたいことって何かある？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), '10年後、どんな家族でいたい？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'これから一緒にどんな思い出を作りたい？', true),
((SELECT id FROM question_categories WHERE name = '将来の希望' LIMIT 1), '家族みんなで叶えたい夢ってある？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), 'いつか一緒に行きたい場所ってある？', true),

-- 大切に思う気持ち
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'それができたときはまず誰にそれを伝えたい？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '今一番大切にしていることは何？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'どんなときに幸せを感じる？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '今日はどんなことにありがとうって思った？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '最近嬉しかったことは何？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '今どんなことに感謝してる？', true),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち' LIMIT 1), '今までですごく感謝してることってどんなこと？', true),

-- 存在肯定
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '生まれてきてくれてありがとう。今どんな気持ち？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'あなたがいてくれて、私は本当に幸せ。あなたはどう？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'あなたの笑顔を見ると元気が出る。あなたはどんなとき元気出る？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'いつも頑張ってるね。今、どんな気持ち？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'あなたはあなたのままでいい。そう言われてどう思う？', true),

-- 相互理解
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '私のこと、どんな人だと思ってる？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '私にもっとこうして欲しいってことある？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '一緒にいて楽しいときってどんなとき？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), '私があなたのためにできることって何かある？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '私たち家族の好きなところってどこ？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'どんな言葉をかけられると、一番嬉しい？', true),

-- 励まし・応援
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), '今頑張っていることはある？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), '何か手伝えることはある？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'どんなふうに応援したらいい？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), '今日もお疲れさま！どんな一日だった？', true),

-- 強みの認識
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '自分のどんなところが好き？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), '最近、自分で「よくやった！」って思ったことある？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '周りの人から「すごいね」って言われたことある？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '自分の得意なことって何だと思う？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), 'あなたが家族にしてあげられることって何だと思う？', true),

-- 過去の自分
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '小さい頃の自分に会えるとしたら、何て声をかけたい？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '昔の自分が今の自分を見たら、なんて言うと思う？', true),

-- 季節・特別な日
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '春になったね、なにかやりたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '春だね、どこか行きたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '秋になったね、なにかやりたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '秋だね、どこか行きたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '今年の夏はなにかやりたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '今年の冬はなにかやりたいことある？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '暑いねえ、体調はどう？', true),
((SELECT id FROM question_categories WHERE name = '季節の話題' LIMIT 1), '寒いねえ、体調はどう？', true),
((SELECT id FROM question_categories WHERE name = '記念日・お祝い' LIMIT 1), 'お誕生日おめでとう！○歳になって、どんな一年にしたい？', true),
((SELECT id FROM question_categories WHERE name = '記念日・お祝い' LIMIT 1), '今日はどんな気持ち？', true),
((SELECT id FROM question_categories WHERE name = '記念日・お祝い' LIMIT 1), 'おめでとう！どんな気分？', true),

-- 関西弁（夜の振り返り）
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんかええことあった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日は一日どないやった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんかおもろいことあった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんかがんばった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんか新しいことあった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんか美味しいもん食べた？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日は〇〇お疲れさんやったね！どやった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日誰かとおうたん（会うたん）？どんな人？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日なんかやらかしたん？大丈夫やった？', true),
((SELECT id FROM question_categories WHERE name = '一日の振り返り' LIMIT 1), '今日そっちはどんな天気やったん？', true),

-- 関西弁（気持ち）
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'なんか元気ないけど大丈夫？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近調子どない？元気にしてるん？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'なんか心配事でもあんの？言うてみい？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'なんか悩んでることあんの？聞くで？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今気分どない？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近なんかええことあったん？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近なんかおもろいことあった？', true),
((SELECT id FROM question_categories WHERE name = '応援・励まし' LIMIT 1), 'ストレス溜まってんのちゃう？無理したらあかんで？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今度一緒に遊ばへん？何したい？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '体調どない？ちゃんと食べてる？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '体調どない？ちゃんと寝れてる？', true),

-- 関西弁（楽しい話）
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), '最近ハマってることあんの？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), 'なんかおもろい話ないの？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '今度の休みは何すんの？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), 'おすすめの映画とかドラマなんかある？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '好きな食べもん何？今度一緒に食べよ！', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近なんかおもろい本あった？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '昔やった、あれ、なんやったけ？覚えてる？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), 'なんか欲しいもんとかあんの？', true),
((SELECT id FROM question_categories WHERE name = '日常の関心' LIMIT 1), '最近なんかおもろいとこ行った？', true),
((SELECT id FROM question_categories WHERE name = '夢や目標' LIMIT 1), 'なんかやりたいことあんの？', true),
((SELECT id FROM question_categories WHERE name = '大切な存在' LIMIT 1), '家族で今度どっか旅行行くとしたらどこがええ？', true);
