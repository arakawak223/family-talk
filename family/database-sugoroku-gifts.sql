-- ======================================
-- 双六ゲーム: ギフトとマス定義の初期データ
-- ======================================

-- ギフトマスターデータ
INSERT INTO gifts (name, description, gift_type, rarity, metadata)
VALUES
  -- バッジ系（Common）
  ('🌟 スターバッジ', '最初のスター！', 'badge', 'common', '{"icon": "⭐"}'),
  ('💙 ハートバッジ', '家族への愛を表現', 'badge', 'common', '{"icon": "💙"}'),
  ('🎈 バルーンバッジ', '楽しい思い出', 'badge', 'common', '{"icon": "🎈"}'),
  ('🌸 フラワーバッジ', 'きれいな花', 'badge', 'common', '{"icon": "🌸"}'),
  ('🍀 クローバーバッジ', '幸運のしるし', 'badge', 'common', '{"icon": "🍀"}'),

  -- バッジ系（Rare）
  ('👑 クラウンバッジ', '王冠を手に入れた！', 'badge', 'rare', '{"icon": "👑"}'),
  ('🏆 トロフィーバッジ', '勝利の証', 'badge', 'rare', '{"icon": "🏆"}'),
  ('💎 ダイヤモンドバッジ', '輝く宝石', 'badge', 'rare', '{"icon": "💎"}'),
  ('🌈 レインボーバッジ', '虹色の輝き', 'badge', 'rare', '{"icon": "🌈"}'),

  -- バッジ系（Legendary）
  ('🔥 炎のバッジ', '情熱の証', 'badge', 'legendary', '{"icon": "🔥"}'),
  ('⚡ 稲妻バッジ', '電撃のパワー', 'badge', 'legendary', '{"icon": "⚡"}'),
  ('🎯 パーフェクトバッジ', '完璧な達成', 'badge', 'legendary', '{"icon": "🎯"}'),

  -- フレーム系（Rare）
  ('ゴールドフレーム', 'メッセージを金色の枠で飾る', 'frame', 'rare', '{"color": "#FFD700", "border": "3px solid #FFD700"}'),
  ('シルバーフレーム', 'メッセージを銀色の枠で飾る', 'frame', 'rare', '{"color": "#C0C0C0", "border": "3px solid #C0C0C0"}'),

  -- カラー系（Common）
  ('パステルピンク', 'やさしいピンク色', 'color', 'common', '{"color": "#FFB6C1"}'),
  ('スカイブルー', '爽やかな青色', 'color', 'common', '{"color": "#87CEEB"}'),
  ('ミントグリーン', '涼しげな緑色', 'color', 'common', '{"color": "#98FF98"}'),

  -- エフェクト系（Legendary）
  ('✨ キラキラエフェクト', 'メッセージがキラキラ輝く', 'effect', 'legendary', '{"effect": "sparkle"}'),
  ('🎆 花火エフェクト', 'メッセージに花火が上がる', 'effect', 'legendary', '{"effect": "fireworks"}')
ON CONFLICT (name) DO NOTHING;

-- ボード1（はじめての冒険）のマス定義
INSERT INTO sugoroku_squares (board_id, position, square_type, event_data, description)
SELECT
  b.id,
  s.position,
  s.square_type,
  s.event_data::jsonb,
  s.description
FROM sugoroku_boards b
CROSS JOIN (
  VALUES
    -- スタート
    (0, 'normal', '{}', 'スタート！'),

    -- マス1-10
    (1, 'normal', '{}', ''),
    (2, 'gift', '{"rarity": "common"}', '🎁 ギフトをゲット！'),
    (3, 'normal', '{}', ''),
    (4, 'bonus', '{"points": 30}', '💰 ボーナス +30pt'),
    (5, 'normal', '{}', ''),
    (6, 'normal', '{}', ''),
    (7, 'gift', '{"rarity": "common"}', '🎁 ギフトをゲット！'),
    (8, 'normal', '{}', ''),
    (9, 'normal', '{}', ''),
    (10, 'bonus', '{"points": 50}', '💰 ボーナス +50pt'),

    -- マス11-20
    (11, 'normal', '{}', ''),
    (12, 'normal', '{}', ''),
    (13, 'gift', '{"rarity": "common"}', '🎁 ギフトをゲット！'),
    (14, 'normal', '{}', ''),
    (15, 'family_event', '{"pointsPerMember": 20}', '👨‍👩‍👧‍👦 家族全員に +20pt'),
    (16, 'normal', '{}', ''),
    (17, 'normal', '{}', ''),
    (18, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (19, 'normal', '{}', ''),
    (20, 'bonus', '{"points": 70}', '💰 ボーナス +70pt'),

    -- マス21-30
    (21, 'normal', '{}', ''),
    (22, 'normal', '{}', ''),
    (23, 'gift', '{"rarity": "common"}', '🎁 ギフトをゲット！'),
    (24, 'normal', '{}', ''),
    (25, 'bonus', '{"points": 100}', '💰 大ボーナス +100pt'),
    (26, 'normal', '{}', ''),
    (27, 'normal', '{}', ''),
    (28, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (29, 'normal', '{}', ''),
    (30, 'family_event', '{"pointsPerMember": 30}', '👨‍👩‍👧‍👦 家族全員に +30pt'),

    -- マス31-40
    (31, 'normal', '{}', ''),
    (32, 'normal', '{}', ''),
    (33, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (34, 'normal', '{}', ''),
    (35, 'bonus', '{"points": 120}', '💰 大ボーナス +120pt'),
    (36, 'normal', '{}', ''),
    (37, 'normal', '{}', ''),
    (38, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (39, 'normal', '{}', ''),
    (40, 'bonus', '{"points": 150}', '💰 特大ボーナス +150pt'),

    -- マス41-49
    (41, 'normal', '{}', ''),
    (42, 'normal', '{}', ''),
    (43, 'gift', '{"rarity": "legendary"}', '🎁 伝説のギフト！！'),
    (44, 'normal', '{}', ''),
    (45, 'family_event', '{"pointsPerMember": 50}', '👨‍👩‍👧‍👦 家族全員に +50pt'),
    (46, 'normal', '{}', ''),
    (47, 'normal', '{}', ''),
    (48, 'gift', '{"rarity": "legendary"}', '🎁 伝説のギフト！！'),
    (49, 'bonus', '{"points": 200}', '💰 超特大ボーナス +200pt'),

    -- ゴール
    (50, 'goal', '{"points": 500}', '🏁 ゴール！クリアボーナス +500pt')
) AS s(position, square_type, event_data, description)
WHERE b.board_number = 1
ON CONFLICT (board_id, position) DO NOTHING;

-- ボード2（なかよし街道）のマス定義（より難易度が高い）
INSERT INTO sugoroku_squares (board_id, position, square_type, event_data, description)
SELECT
  b.id,
  s.position,
  s.square_type,
  s.event_data::jsonb,
  s.description
FROM sugoroku_boards b
CROSS JOIN (
  VALUES
    -- スタート
    (0, 'normal', '{}', 'なかよし街道 スタート！'),

    -- マス1-10（通常より間隔が広い）
    (1, 'normal', '{}', ''),
    (2, 'normal', '{}', ''),
    (3, 'gift', '{"rarity": "common"}', '🎁 ギフトをゲット！'),
    (4, 'normal', '{}', ''),
    (5, 'bonus', '{"points": 40}', '💰 ボーナス +40pt'),
    (6, 'normal', '{}', ''),
    (7, 'normal', '{}', ''),
    (8, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (9, 'normal', '{}', ''),
    (10, 'bonus', '{"points": 60}', '💰 ボーナス +60pt'),

    -- マス11-20
    (11, 'normal', '{}', ''),
    (12, 'normal', '{}', ''),
    (13, 'normal', '{}', ''),
    (14, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (15, 'normal', '{}', ''),
    (16, 'family_event', '{"pointsPerMember": 30}', '👨‍👩‍👧‍👦 家族全員に +30pt'),
    (17, 'normal', '{}', ''),
    (18, 'normal', '{}', ''),
    (19, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (20, 'bonus', '{"points": 100}', '💰 大ボーナス +100pt'),

    -- マス21-30
    (21, 'normal', '{}', ''),
    (22, 'normal', '{}', ''),
    (23, 'normal', '{}', ''),
    (24, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (25, 'normal', '{}', ''),
    (26, 'bonus', '{"points": 120}', '💰 大ボーナス +120pt'),
    (27, 'normal', '{}', ''),
    (28, 'normal', '{}', ''),
    (29, 'gift', '{"rarity": "legendary"}', '🎁 伝説のギフト！！'),
    (30, 'family_event', '{"pointsPerMember": 40}', '👨‍👩‍👧‍👦 家族全員に +40pt'),

    -- マス31-40
    (31, 'normal', '{}', ''),
    (32, 'normal', '{}', ''),
    (33, 'normal', '{}', ''),
    (34, 'gift', '{"rarity": "rare"}', '🎁 レアギフト！'),
    (35, 'normal', '{}', ''),
    (36, 'bonus', '{"points": 150}', '💰 特大ボーナス +150pt'),
    (37, 'normal', '{}', ''),
    (38, 'normal', '{}', ''),
    (39, 'gift', '{"rarity": "legendary"}', '🎁 伝説のギフト！！'),
    (40, 'bonus', '{"points": 180}', '💰 特大ボーナス +180pt'),

    -- マス41-49
    (41, 'normal', '{}', ''),
    (42, 'normal', '{}', ''),
    (43, 'normal', '{}', ''),
    (44, 'gift', '{"rarity": "legendary"}', '🎁 伝説のギフト！！'),
    (45, 'normal', '{}', ''),
    (46, 'family_event', '{"pointsPerMember": 60}', '👨‍👩‍👧‍👦 家族全員に +60pt'),
    (47, 'normal', '{}', ''),
    (48, 'normal', '{}', ''),
    (49, 'bonus', '{"points": 250}', '💰 超特大ボーナス +250pt'),

    -- ゴール
    (50, 'goal', '{"points": 800}', '🏁 ゴール！クリアボーナス +800pt')
) AS s(position, square_type, event_data, description)
WHERE b.board_number = 2
ON CONFLICT (board_id, position) DO NOTHING;
