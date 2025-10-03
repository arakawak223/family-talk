-- カテゴリーの順序を調整
-- 1. シンプル質問-標準語: 1-99
-- 2. シンプル質問-関西弁: 1-99
-- 3. 今の暮らし: 100番台
-- 4. その他のカテゴリー: 200番台以降

-- 今の暮らしのsort_orderを100番台に変更
UPDATE questions
SET sort_order = sort_order + 99
WHERE primary_category = '今の暮らし';
