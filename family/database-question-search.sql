-- 質問検索機能の実装
-- question_templatesテーブルにタグ・キーワードフィールドを追加

-- タグカラムを追加（複数のタグをJSON配列で保存）
ALTER TABLE question_templates
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS search_keywords TEXT[] DEFAULT '{}';

-- 既存の質問にタグとキーワードを追加
-- ========================================
-- 日常の関心・興味
-- ========================================
UPDATE question_templates SET
  tags = ARRAY['朝', '気分', '今日'],
  search_keywords = ARRAY['今日の気分', '朝の挨拶', '元気', '調子']
WHERE question_text = '今日はどんな気分？';

UPDATE question_templates SET
  tags = ARRAY['朝', '睡眠', '健康'],
  search_keywords = ARRAY['睡眠', '眠れた', '健康', '体調']
WHERE question_text = '昨日はぐっすり眠れた？';

UPDATE question_templates SET
  tags = ARRAY['朝', '予定', '今日'],
  search_keywords = ARRAY['今日の予定', '過ごし方', '計画']
WHERE question_text = '今日はどんな風に過ごしたい？';

UPDATE question_templates SET
  tags = ARRAY['朝', '楽しみ', '今日'],
  search_keywords = ARRAY['楽しいこと', '今日の予定', 'イベント']
WHERE question_text = '今日は何か楽しいことあるかな？';

UPDATE question_templates SET
  tags = ARRAY['夜', '振り返り', '今日'],
  search_keywords = ARRAY['今日どうだった', '一日の振り返り', '報告']
WHERE question_text = '今日はどんな一日だった？';

UPDATE question_templates SET
  tags = ARRAY['夜', '気分', '感情'],
  search_keywords = ARRAY['今の気分', '感情', '心境']
WHERE question_text = '今はどんな気分？';

UPDATE question_templates SET
  tags = ARRAY['夜', '今日', '嬉しいこと'],
  search_keywords = ARRAY['いいこと', '良かったこと', 'ポジティブ']
WHERE question_text = '今日はなにかいいことあった？';

UPDATE question_templates SET
  tags = ARRAY['夜', '今日', '楽しい'],
  search_keywords = ARRAY['楽しかったこと', 'ハイライト', '一番']
WHERE question_text = '今日は何が一番楽しかった？';

UPDATE question_templates SET
  tags = ARRAY['夜', '今日', '頑張り'],
  search_keywords = ARRAY['頑張ったこと', '努力', '成果']
WHERE question_text = '今日はどんなこと頑張った？';

UPDATE question_templates SET
  tags = ARRAY['夜', '今日', '発見'],
  search_keywords = ARRAY['発見', '学び', '新しいこと']
WHERE question_text = '今日はどんな発見があった？';

UPDATE question_templates SET
  tags = ARRAY['夜', '今日', 'ニュース'],
  search_keywords = ARRAY['ニュース', '話題', '面白い話']
WHERE question_text = '今日はおもしろいニュースあった？';

-- 感情の言語化
UPDATE question_templates SET
  tags = ARRAY['感情', '幸せ', '最近'],
  search_keywords = ARRAY['温かい気持ち', '幸せな瞬間', '感動']
WHERE question_text = '最近、心が温かくなった瞬間ってあった？';

UPDATE question_templates SET
  tags = ARRAY['感謝', '最近', '気持ち'],
  search_keywords = ARRAY['ありがとう', '感謝', 'お礼']
WHERE question_text = '今週、誰かに「ありがとう」って言いたくなったことある？';

UPDATE question_templates SET
  tags = ARRAY['感謝', '優しさ', '最近'],
  search_keywords = ARRAY['優しさ', '親切', '思いやり']
WHERE question_text = '最近、誰かの優しさに触れたことってある？';

UPDATE question_templates SET
  tags = ARRAY['家族', '幸せ', '気持ち'],
  search_keywords = ARRAY['家族っていいな', '家族の良さ', '家族愛']
WHERE question_text = 'どんな瞬間に「家族っていいな」って思う？';

-- 過去の記憶
UPDATE question_templates SET
  tags = ARRAY['過去', '思い出', '子ども'],
  search_keywords = ARRAY['子どもの頃', '昔の遊び', '思い出']
WHERE question_text = '子どもの頃、一番好きだった遊びは何だった？';

UPDATE question_templates SET
  tags = ARRAY['家族', '思い出', '過去'],
  search_keywords = ARRAY['家族の思い出', '楽しかったこと', '思い出話']
WHERE question_text = '家族で一番楽しかった思い出って何？';

UPDATE question_templates SET
  tags = ARRAY['家族', '言葉', '思い出'],
  search_keywords = ARRAY['心に残る言葉', '印象的な言葉', '大切な言葉']
WHERE question_text = '一番心に残ってる家族の言葉ってある？';

-- ========================================
-- 未来への希望
-- ========================================

UPDATE question_templates SET
  tags = ARRAY['未来', '希望', '目標'],
  search_keywords = ARRAY['できたら嬉しい', '願い', '希望']
WHERE question_text = 'どんなことができたら嬉しい？';

UPDATE question_templates SET
  tags = ARRAY['未来', '希望', '理想'],
  search_keywords = ARRAY['最高', '理想', '夢']
WHERE question_text = 'どんなことができたら最高？';

UPDATE question_templates SET
  tags = ARRAY['未来', '成長', '目標'],
  search_keywords = ARRAY['できるようになりたい', '成長', 'スキル']
WHERE question_text = 'どんなことができるようになったら嬉しい？';

UPDATE question_templates SET
  tags = ARRAY['感情', '想像', '未来'],
  search_keywords = ARRAY['気分', '達成感', '想像']
WHERE question_text = 'それができたらどんな気分？';

UPDATE question_templates SET
  tags = ARRAY['未来', '自分', '理想'],
  search_keywords = ARRAY['なりたい自分', '理想の自分', '目標']
WHERE question_text = 'どんな自分になりたい？';

UPDATE question_templates SET
  tags = ARRAY['興味', '最近', '趣味'],
  search_keywords = ARRAY['興味あること', '関心', '好き']
WHERE question_text = '最近どんなことに興味ある？';

UPDATE question_templates SET
  tags = ARRAY['趣味', 'ハマる', '最近'],
  search_keywords = ARRAY['ハマってること', '夢中', '趣味']
WHERE question_text = '最近はまっていることはどんなこと？';

UPDATE question_templates SET
  tags = ARRAY['未来', 'やりたいこと', '挑戦'],
  search_keywords = ARRAY['やってみたい', 'チャレンジ', '新しいこと']
WHERE question_text = 'やってみたいことはなにかある？どんなこと？';

UPDATE question_templates SET
  tags = ARRAY['学び', '興味', '未来'],
  search_keywords = ARRAY['学びたい', '勉強', 'スキルアップ']
WHERE question_text = 'どんなことを学んでみたい？';

UPDATE question_templates SET
  tags = ARRAY['未来', '旅行', '場所'],
  search_keywords = ARRAY['行きたい場所', '旅行', '訪れたい']
WHERE question_text = 'どんなところに行ってみたい？';

-- 価値観
UPDATE question_templates SET
  tags = ARRAY['価値観', '幸せ', '人生'],
  search_keywords = ARRAY['幸せとは', '価値観', '人生観']
WHERE question_text = 'あなたにとって「幸せ」ってどんな状態？';

UPDATE question_templates SET
  tags = ARRAY['価値観', '大切', '人生'],
  search_keywords = ARRAY['大切なこと', '価値観', '優先順位']
WHERE question_text = '人生で一番大切にしたいことって何？';

UPDATE question_templates SET
  tags = ARRAY['未来', '想像', 'やりたいこと'],
  search_keywords = ARRAY['時間が無限', '理想の過ごし方', '夢']
WHERE question_text = 'もし時間が無限にあったら、何をして過ごしたい？';

UPDATE question_templates SET
  tags = ARRAY['未来', '理想', '自分'],
  search_keywords = ARRAY['なりたい人', '理想像', '目標']
WHERE question_text = 'どんな人になりたいって思ってる？';

-- 一緒に描く未来
UPDATE question_templates SET
  tags = ARRAY['家族', '未来', 'やりたいこと'],
  search_keywords = ARRAY['家族でやりたい', '一緒に', '家族活動']
WHERE question_text = '家族でやってみたいことって何かある？';

UPDATE question_templates SET
  tags = ARRAY['家族', '未来', '10年後'],
  search_keywords = ARRAY['10年後', '将来の家族', 'ビジョン']
WHERE question_text = '10年後、どんな家族でいたい？';

UPDATE question_templates SET
  tags = ARRAY['家族', '未来', '思い出'],
  search_keywords = ARRAY['これから作る思い出', '一緒に', '未来']
WHERE question_text = 'これから一緒にどんな思い出を作りたい？';

UPDATE question_templates SET
  tags = ARRAY['家族', '夢', '未来'],
  search_keywords = ARRAY['家族の夢', 'みんなで', '目標']
WHERE question_text = '家族みんなで叶えたい夢ってある？';

UPDATE question_templates SET
  tags = ARRAY['家族', '旅行', '未来'],
  search_keywords = ARRAY['一緒に行きたい', '旅行', '場所']
WHERE question_text = 'いつか一緒に行きたい場所ってある？';

-- ========================================
-- 大切に思う気持ち
-- ========================================

UPDATE question_templates SET
  tags = ARRAY['大切', '報告', '関係'],
  search_keywords = ARRAY['伝えたい人', '大切な人', '誰に']
WHERE question_text = 'それができたときはまず誰にそれを伝えたい？';

UPDATE question_templates SET
  tags = ARRAY['大切', '今', '価値観'],
  search_keywords = ARRAY['大切にしてること', '優先', '重要']
WHERE question_text = '今一番大切にしていることは何？';

UPDATE question_templates SET
  tags = ARRAY['幸せ', '感情', '瞬間'],
  search_keywords = ARRAY['幸せを感じる', '嬉しい瞬間', 'ハッピー']
WHERE question_text = 'どんなときに幸せを感じる？';

UPDATE question_templates SET
  tags = ARRAY['感謝', '今日', '気持ち'],
  search_keywords = ARRAY['ありがとう', '感謝', '今日']
WHERE question_text = '今日はどんなことにありがとうって思った？';

UPDATE question_templates SET
  tags = ARRAY['嬉しい', '最近', '感情'],
  search_keywords = ARRAY['嬉しかったこと', '最近', 'ポジティブ']
WHERE question_text = '最近嬉しかったことは何？';

UPDATE question_templates SET
  tags = ARRAY['感謝', '今', '気持ち'],
  search_keywords = ARRAY['感謝してること', 'ありがたい', '今']
WHERE question_text = '今どんなことに感謝してる？';

UPDATE question_templates SET
  tags = ARRAY['感謝', '過去', '大切'],
  search_keywords = ARRAY['すごく感謝', '今まで', '大きな感謝']
WHERE question_text = '今までですごく感謝してることってどんなこと？';

-- 存在肯定
UPDATE question_templates SET
  tags = ARRAY['愛', '感謝', '存在'],
  search_keywords = ARRAY['生まれてきてくれて', '感謝', '愛してる']
WHERE question_text = '生まれてきてくれてありがとう。今どんな気持ち？';

UPDATE question_templates SET
  tags = ARRAY['愛', '幸せ', '存在'],
  search_keywords = ARRAY['いてくれて幸せ', '存在', '大切']
WHERE question_text = 'あなたがいてくれて、私は本当に幸せ。あなたはどう？';

UPDATE question_templates SET
  tags = ARRAY['愛', '元気', '笑顔'],
  search_keywords = ARRAY['笑顔', '元気', '励まし']
WHERE question_text = 'あなたの笑顔を見ると元気が出る。あなたはどんなとき元気出る？';

UPDATE question_templates SET
  tags = ARRAY['励まし', '頑張り', '認める'],
  search_keywords = ARRAY['頑張ってる', '努力', '認める']
WHERE question_text = 'いつも頑張ってるね。今、どんな気持ち？';

UPDATE question_templates SET
  tags = ARRAY['愛', '肯定', 'そのまま'],
  search_keywords = ARRAY['そのままでいい', '肯定', '受け入れ']
WHERE question_text = 'あなたはあなたのままでいい。そう言われてどう思う？';

-- 相互理解
UPDATE question_templates SET
  tags = ARRAY['関係', '相互理解', '印象'],
  search_keywords = ARRAY['どう思ってる', '印象', '見方']
WHERE question_text = '私のこと、どんな人だと思ってる？';

UPDATE question_templates SET
  tags = ARRAY['関係', '改善', '要望'],
  search_keywords = ARRAY['こうして欲しい', '要望', '改善']
WHERE question_text = '私にもっとこうして欲しいってことある？';

UPDATE question_templates SET
  tags = ARRAY['関係', '楽しい', '一緒'],
  search_keywords = ARRAY['楽しいとき', '一緒', '嬉しい']
WHERE question_text = '一緒にいて楽しいときってどんなとき？';

UPDATE question_templates SET
  tags = ARRAY['関係', 'サポート', '手伝い'],
  search_keywords = ARRAY['できること', 'サポート', '手伝い']
WHERE question_text = '私があなたのためにできることって何かある？';

UPDATE question_templates SET
  tags = ARRAY['家族', '好き', '良いところ'],
  search_keywords = ARRAY['家族の好きなところ', '良いところ', '家族愛']
WHERE question_text = '私たち家族の好きなところってどこ？';

UPDATE question_templates SET
  tags = ARRAY['言葉', '嬉しい', '愛'],
  search_keywords = ARRAY['嬉しい言葉', 'かけて欲しい言葉', '励まし']
WHERE question_text = 'どんな言葉をかけられると、一番嬉しい？';

-- ========================================
-- 励まし・応援
-- ========================================

UPDATE question_templates SET
  tags = ARRAY['頑張り', '今', '応援'],
  search_keywords = ARRAY['頑張ってること', '努力', '取り組み']
WHERE question_text = '今頑張っていることはある？';

UPDATE question_templates SET
  tags = ARRAY['サポート', '手伝い', '応援'],
  search_keywords = ARRAY['手伝えること', 'サポート', '助け']
WHERE question_text = '何か手伝えることはある？';

UPDATE question_templates SET
  tags = ARRAY['応援', 'サポート', '方法'],
  search_keywords = ARRAY['応援の仕方', 'どう応援', 'サポート方法']
WHERE question_text = 'どんなふうに応援したらいい？';

UPDATE question_templates SET
  tags = ARRAY['夜', '労い', '今日'],
  search_keywords = ARRAY['お疲れさま', '労い', '一日の終わり']
WHERE question_text = '今日もお疲れさま！どんな一日だった？';

-- 強みの認識
UPDATE question_templates SET
  tags = ARRAY['自己肯定', '好き', '自分'],
  search_keywords = ARRAY['自分の好きなところ', '長所', '良いところ']
WHERE question_text = '自分のどんなところが好き？';

UPDATE question_templates SET
  tags = ARRAY['自己肯定', '達成', '最近'],
  search_keywords = ARRAY['よくやった', '達成', '成果']
WHERE question_text = '最近、自分で「よくやった！」って思ったことある？';

UPDATE question_templates SET
  tags = ARRAY['自己肯定', '褒められた', '強み'],
  search_keywords = ARRAY['すごいね', '褒められた', '認められた']
WHERE question_text = '周りの人から「すごいね」って言われたことある？';

UPDATE question_templates SET
  tags = ARRAY['強み', '得意', '自分'],
  search_keywords = ARRAY['得意なこと', '強み', 'できること']
WHERE question_text = '自分の得意なことって何だと思う？';

UPDATE question_templates SET
  tags = ARRAY['貢献', '家族', '役割'],
  search_keywords = ARRAY['家族にできること', '貢献', '役割']
WHERE question_text = 'あなたが家族にしてあげられることって何だと思う？';

-- 過去の自分
UPDATE question_templates SET
  tags = ARRAY['過去', '自分', '励まし'],
  search_keywords = ARRAY['小さい頃の自分', '声をかける', 'メッセージ']
WHERE question_text = '小さい頃の自分に会えるとしたら、何て声をかけたい？';

UPDATE question_templates SET
  tags = ARRAY['過去', '自分', '成長'],
  search_keywords = ARRAY['昔の自分', '成長', '変化']
WHERE question_text = '昔の自分が今の自分を見たら、なんて言うと思う？';

-- ========================================
-- 季節・特別な日
-- ========================================

UPDATE question_templates SET
  tags = ARRAY['春', '季節', 'やりたいこと'],
  search_keywords = ARRAY['春', '季節', '新しいこと']
WHERE question_text = '春になったね、なにかやりたいことある？';

UPDATE question_templates SET
  tags = ARRAY['春', '季節', '行きたい'],
  search_keywords = ARRAY['春', 'お出かけ', '場所']
WHERE question_text = '春だね、どこか行きたいことある？';

UPDATE question_templates SET
  tags = ARRAY['秋', '季節', 'やりたいこと'],
  search_keywords = ARRAY['秋', '季節', '新しいこと']
WHERE question_text = '秋になったね、なにかやりたいことある？';

UPDATE question_templates SET
  tags = ARRAY['秋', '季節', '行きたい'],
  search_keywords = ARRAY['秋', 'お出かけ', '場所']
WHERE question_text = '秋だね、どこか行きたいことある？';

UPDATE question_templates SET
  tags = ARRAY['夏', '季節', 'やりたいこと'],
  search_keywords = ARRAY['夏', '計画', '楽しみ']
WHERE question_text = '今年の夏はなにかやりたいことある？';

UPDATE question_templates SET
  tags = ARRAY['冬', '季節', 'やりたいこと'],
  search_keywords = ARRAY['冬', '計画', '楽しみ']
WHERE question_text = '今年の冬はなにかやりたいことある？';

UPDATE question_templates SET
  tags = ARRAY['夏', '健康', '体調'],
  search_keywords = ARRAY['暑い', '体調', '健康']
WHERE question_text = '暑いねえ、体調はどう？';

UPDATE question_templates SET
  tags = ARRAY['冬', '健康', '体調'],
  search_keywords = ARRAY['寒い', '体調', '健康']
WHERE question_text = '寒いねえ、体調はどう？';

UPDATE question_templates SET
  tags = ARRAY['誕生日', 'お祝い', '未来'],
  search_keywords = ARRAY['誕生日', 'おめでとう', '一年']
WHERE question_text = 'お誕生日おめでとう！○歳になって、どんな一年にしたい？';

UPDATE question_templates SET
  tags = ARRAY['特別な日', '気持ち', '感情'],
  search_keywords = ARRAY['今日', '特別な日', '気持ち']
WHERE question_text = '今日はどんな気持ち？';

UPDATE question_templates SET
  tags = ARRAY['お祝い', '喜び', '気分'],
  search_keywords = ARRAY['おめでとう', 'お祝い', '気分']
WHERE question_text = 'おめでとう！どんな気分？';

-- ========================================
-- 関西弁
-- ========================================

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', 'いいこと'],
  search_keywords = ARRAY['今日いいこと', '関西弁', '夜']
WHERE question_text = '今日なんかええことあった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '振り返り'],
  search_keywords = ARRAY['今日どうだった', '関西弁', '一日']
WHERE question_text = '今日は一日どないやった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '面白い'],
  search_keywords = ARRAY['面白いこと', '関西弁', '笑える']
WHERE question_text = '今日なんかおもろいことあった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '頑張り'],
  search_keywords = ARRAY['頑張ったこと', '関西弁', '努力']
WHERE question_text = '今日なんかがんばった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '新しい'],
  search_keywords = ARRAY['新しいこと', '関西弁', '発見']
WHERE question_text = '今日なんか新しいことあった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '食事'],
  search_keywords = ARRAY['美味しいもの', '関西弁', '食べ物']
WHERE question_text = '今日なんか美味しいもん食べた？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '労い', 'お疲れ'],
  search_keywords = ARRAY['お疲れさま', '関西弁', '労い']
WHERE question_text = '今日は〇〇お疲れさんやったね！どやった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '会った人'],
  search_keywords = ARRAY['誰かと会った', '関西弁', '人間関係']
WHERE question_text = '今日誰かとおうたん（会うたん）？どんな人？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', 'ミス', '失敗'],
  search_keywords = ARRAY['やらかした', '関西弁', '失敗']
WHERE question_text = '今日なんかやらかしたん？大丈夫やった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '夜', '今日', '天気'],
  search_keywords = ARRAY['天気', '関西弁', '今日']
WHERE question_text = '今日そっちはどんな天気やったん？';

-- 関西弁 気持ち
UPDATE question_templates SET
  tags = ARRAY['関西弁', '励まし', '元気', '心配'],
  search_keywords = ARRAY['元気ない', '関西弁', '大丈夫']
WHERE question_text = 'なんか元気ないけど大丈夫？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '最近', '元気', '調子'],
  search_keywords = ARRAY['最近どう', '関西弁', '調子']
WHERE question_text = '最近調子どない？元気にしてるん？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '心配', '悩み', 'サポート'],
  search_keywords = ARRAY['心配事', '関西弁', '悩み']
WHERE question_text = 'なんか心配事でもあんの？言うてみい？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '悩み', 'サポート', '聞く'],
  search_keywords = ARRAY['悩んでる', '関西弁', '相談']
WHERE question_text = 'なんか悩んでることあんの？聞くで？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '気分', '今', '感情'],
  search_keywords = ARRAY['今の気分', '関西弁', 'どう']
WHERE question_text = '今気分どない？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '最近', 'いいこと', '嬉しい'],
  search_keywords = ARRAY['最近いいこと', '関西弁', '良かったこと']
WHERE question_text = '最近なんかええことあったん？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '最近', '面白い', '笑える'],
  search_keywords = ARRAY['面白いこと', '関西弁', '笑い']
WHERE question_text = '最近なんかおもろいことあった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', 'ストレス', '健康', '無理'],
  search_keywords = ARRAY['ストレス', '関西弁', '無理しない']
WHERE question_text = 'ストレス溜まってんのちゃう？無理したらあかんで？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '遊び', '誘い', '一緒'],
  search_keywords = ARRAY['一緒に遊ぶ', '関西弁', '誘い']
WHERE question_text = '今度一緒に遊ばへん？何したい？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '健康', '体調', '食事'],
  search_keywords = ARRAY['体調', '関西弁', '食事']
WHERE question_text = '体調どない？ちゃんと食べてる？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '健康', '体調', '睡眠'],
  search_keywords = ARRAY['体調', '関西弁', '睡眠']
WHERE question_text = '体調どない？ちゃんと寝れてる？';

-- 関西弁 楽しい話
UPDATE question_templates SET
  tags = ARRAY['関西弁', '趣味', 'ハマる', '最近'],
  search_keywords = ARRAY['ハマってること', '関西弁', '趣味']
WHERE question_text = '最近ハマってることあんの？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '面白い話', '話題', '笑い'],
  search_keywords = ARRAY['面白い話', '関西弁', '話題']
WHERE question_text = 'なんかおもろい話ないの？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '休み', '予定', '未来'],
  search_keywords = ARRAY['休みの予定', '関西弁', '何する']
WHERE question_text = '今度の休みは何すんの？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '映画', 'ドラマ', 'おすすめ'],
  search_keywords = ARRAY['おすすめ', '関西弁', '映画ドラマ']
WHERE question_text = 'おすすめの映画とかドラマなんかある？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '食べ物', '好き', '一緒'],
  search_keywords = ARRAY['好きな食べ物', '関西弁', '一緒に食べる']
WHERE question_text = '好きな食べもん何？今度一緒に食べよ！';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '本', 'おすすめ', '最近'],
  search_keywords = ARRAY['面白い本', '関西弁', 'おすすめ']
WHERE question_text = '最近なんかおもろい本あった？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '思い出', '過去', '昔'],
  search_keywords = ARRAY['昔のこと', '関西弁', '思い出']
WHERE question_text = '昔やった、あれ、なんやったけ？覚えてる？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '欲しいもの', '願い', '物欲'],
  search_keywords = ARRAY['欲しいもの', '関西弁', '買いたい']
WHERE question_text = 'なんか欲しいもんとかあんの？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '最近', 'お出かけ', '場所'],
  search_keywords = ARRAY['面白いとこ', '関西弁', 'お出かけ']
WHERE question_text = '最近なんかおもろいとこ行った？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', 'やりたいこと', '未来', '願い'],
  search_keywords = ARRAY['やりたいこと', '関西弁', '夢']
WHERE question_text = 'なんかやりたいことあんの？';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '褒める', '世界一', 'ユーモア'],
  search_keywords = ARRAY['世界一', '関西弁', '褒める', '知らんけど']
WHERE question_text = '〇〇はすごいな、たぶん世界一ちゃう？知らんけど！';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '美味しい', '褒める', 'ユーモア'],
  search_keywords = ARRAY['日本一', '関西弁', '美味しい', '知らんけど']
WHERE question_text = '〇〇は旨いな、たぶん関西一やで、いや日本一ちゃう？知らんけど！';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '宝くじ', '想像', 'ユーモア'],
  search_keywords = ARRAY['宝くじ', '関西弁', 'もしも', '知らんけど']
WHERE question_text = 'もし宝くじ当たったら何する？今回絶対当たると思うねん、知らんけど！';

UPDATE question_templates SET
  tags = ARRAY['関西弁', '家族', '旅行', '一緒'],
  search_keywords = ARRAY['家族旅行', '関西弁', 'どこ行く']
WHERE question_text = '家族で今度どっか旅行行くとしたらどこがええ？';

-- 全文検索用のインデックスを作成
-- tagsとsearch_keywordsの配列検索を高速化
CREATE INDEX IF NOT EXISTS idx_question_templates_tags ON question_templates USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_question_templates_search_keywords ON question_templates USING GIN (search_keywords);

-- question_textの検索用インデックス（シンプルなテキスト検索用）
-- 日本語設定が不要なデフォルト設定を使用
CREATE INDEX IF NOT EXISTS idx_question_templates_question_text ON question_templates USING GIN (to_tsvector('simple', question_text));
