-- 質問カテゴリとテンプレートの初期データ

-- 1. 質問カテゴリの挿入
INSERT INTO question_categories (name, description, feeling_type, timing_type, target_type) VALUES
-- 関心・興味を示したい
('日常の関心', '相手の日常に興味を示す質問', 'interest', 'morning', 'child'),
('今日の予定', '今日の活動予定について聞く', 'interest', 'morning', 'all'),
('一日の振り返り', '一日の出来事を振り返る', 'interest', 'evening', 'all'),

-- 未来への希望を聞きたい
('将来の希望', '相手の未来への願いを聞く', 'hope', 'special', 'child'),
('夢や目標', '相手の夢や目標について', 'hope', null, 'all'),

-- 相手を大切に思っていることを伝えたい
('大切な存在', '相手への愛情を表現', 'care', 'special', 'all'),
('感謝の気持ち', '相手への感謝を伝える', 'gratitude', 'evening', 'all'),

-- 励ましたい・応援したい
('応援・励まし', '相手を励ます質問', 'encourage', null, 'all'),

-- 季節・特別な日
('季節の話題', '季節に関連した質問', 'interest', 'seasonal', 'all'),
('記念日・お祝い', '特別な日の質問', 'care', 'special', 'all');

-- 2. 質問テンプレートの挿入
INSERT INTO question_templates (category_id, question_text) VALUES

-- 日常の関心（朝）
((SELECT id FROM question_categories WHERE name = '今日の予定'), '今日はどんな予定があるの？'),
((SELECT id FROM question_categories WHERE name = '今日の予定'), '今日はどんな風に過ごしたい？'),
((SELECT id FROM question_categories WHERE name = '今日の予定'), '今日は何か楽しいことある？'),
((SELECT id FROM question_categories WHERE name = '今日の予定'), '今日はどんな気分？'),

-- 一日の振り返り（夜）
((SELECT id FROM question_categories WHERE name = '一日の振り返り'), '今日はどんな一日だった？'),
((SELECT id FROM question_categories WHERE name = '一日の振り返り'), '今日はどんないいことがあった？'),
((SELECT id FROM question_categories WHERE name = '一日の振り返り'), '今日は何が一番楽しかった？'),
((SELECT id FROM question_categories WHERE name = '一日の振り返り'), '今日はどんなことを頑張った？'),
((SELECT id FROM question_categories WHERE name = '一日の振り返り'), '今日はどんな発見があった？'),

-- 将来の希望
((SELECT id FROM question_categories WHERE name = '将来の希望'), 'どんなことができたら嬉しい？'),
((SELECT id FROM question_categories WHERE name = '将来の希望'), 'それができたときはどんな気分になると思う？'),
((SELECT id FROM question_categories WHERE name = '将来の希望'), 'どんな自分になりたい？'),

-- 夢や目標
((SELECT id FROM question_categories WHERE name = '夢や目標'), '最近どんなことに興味がある？'),
((SELECT id FROM question_categories WHERE name = '夢や目標'), 'やってみたいことはある？'),
((SELECT id FROM question_categories WHERE name = '夢や目標'), 'どんなことを学んでみたい？'),

-- 大切な存在
((SELECT id FROM question_categories WHERE name = '大切な存在'), 'それができたときはまず誰にそのことを伝えたい？'),
((SELECT id FROM question_categories WHERE name = '大切な存在'), '今一番大切にしていることは何？'),
((SELECT id FROM question_categories WHERE name = '大切な存在'), 'どんなときに幸せを感じる？'),

-- 感謝の気持ち
((SELECT id FROM question_categories WHERE name = '感謝の気持ち'), '今日はありがとうって思ったことある？'),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち'), '最近嬉しかったことは何？'),
((SELECT id FROM question_categories WHERE name = '感謝の気持ち'), 'どんなことに感謝している？'),

-- 応援・励まし
((SELECT id FROM question_categories WHERE name = '応援・励まし'), '今頑張っていることはある？'),
((SELECT id FROM question_categories WHERE name = '応援・励まし'), '何か手伝えることはある？'),
((SELECT id FROM question_categories WHERE name = '応援・励まし'), 'どんなふうに応援したらいい？'),
((SELECT id FROM question_categories WHERE name = '応援・励まし'), '今日もお疲れさま！どんな一日だった？'),

-- 季節の話題
((SELECT id FROM question_categories WHERE name = '季節の話題'), '今の季節で好きなことは何？'),
((SELECT id FROM question_categories WHERE name = '季節の話題'), '今の時期にやりたいことはある？'),
((SELECT id FROM question_categories WHERE name = '季節の話題'), '季節の変わり目、体調はどう？'),

-- 記念日・お祝い
((SELECT id FROM question_categories WHERE name = '記念日・お祝い'), 'お誕生日おめでとう！どんな一年にしたい？'),
((SELECT id FROM question_categories WHERE name = '記念日・お祝い'), '今日という特別な日、どんな気持ち？'),
((SELECT id FROM question_categories WHERE name = '記念日・お祝い'), 'おめでとう！一番嬉しかったことは何？');