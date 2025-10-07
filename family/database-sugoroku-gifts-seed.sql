-- ======================================
-- 双六ギフト 初期データ
-- ======================================

-- ギフトマスターデータ投入
INSERT INTO gifts (name, description, gift_type, rarity, icon_url, metadata) VALUES

-- レベル1: よく出るギフト (common)
('メッセージマスター', '100通送信達成の証', 'badge', 'common', '🏆', '{"color": "#FFD700"}'),
('おしゃべり王', '毎日欠かさずメッセージを送る達人', 'badge', 'common', '💬', '{"color": "#4A90E2"}'),
('リスナー', '家族の声に耳を傾ける優しい心', 'badge', 'common', '👂', '{"color": "#9B59B6"}'),
('返信名人', '返信スピードNo.1', 'badge', 'common', '⚡', '{"color": "#F39C12"}'),
('朝陽カラー', 'メッセージを明るいオレンジ色に', 'color', 'common', '🌅', '{"backgroundColor": "#FF9A56", "textColor": "#FFFFFF"}'),
('空色カラー', 'メッセージを爽やかな青色に', 'color', 'common', '☁️', '{"backgroundColor": "#6ECAFF", "textColor": "#FFFFFF"}'),
('桜色カラー', 'メッセージを優しいピンク色に', 'color', 'common', '🌸', '{"backgroundColor": "#FFB7C5", "textColor": "#FFFFFF"}'),
('若葉カラー', 'メッセージを新緑の緑色に', 'color', 'common', '🌿', '{"backgroundColor": "#90EE90", "textColor": "#333333"}'),
('シンプルフレーム', 'プロフィールにシンプルな枠', 'frame', 'common', '⬜', '{"borderColor": "#CCCCCC", "borderWidth": "2px"}'),
('ドットフレーム', 'プロフィールに点線の枠', 'frame', 'common', '⚪', '{"borderColor": "#4A90E2", "borderWidth": "2px", "borderStyle": "dotted"}'),

-- レベル2: 時々出るギフト (rare)
('家族の絆', '家族全員からのメッセージを受信', 'badge', 'rare', '👨‍👩‍👧‍👦', '{"color": "#E91E63"}'),
('100日戦士', '100日連続でメッセージ送信', 'badge', 'rare', '🔥', '{"color": "#FF5722"}'),
('夕焼けカラー', 'メッセージを温かいオレンジに', 'color', 'rare', '🌇', '{"backgroundColor": "#FF6B6B", "textColor": "#FFFFFF"}'),
('星空カラー', 'メッセージを深い青に', 'color', 'rare', '🌌', '{"backgroundColor": "#2C3E50", "textColor": "#FFFFFF"}'),
('虹色カラー', 'メッセージにグラデーション効果', 'color', 'rare', '🌈', '{"background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "textColor": "#FFFFFF"}'),
('ハートスタンプ', '感謝の気持ちを伝えるスタンプ', 'sticker', 'rare', '❤️', '{"imageUrl": "/stickers/heart.png"}'),
('サムズアップ', '応援を伝えるスタンプ', 'sticker', 'rare', '👍', '{"imageUrl": "/stickers/thumbsup.png"}'),
('拍手スタンプ', '称賛を伝えるスタンプ', 'sticker', 'rare', '👏', '{"imageUrl": "/stickers/clap.png"}'),
('ゴールドフレーム', 'プロフィールに金色の枠', 'frame', 'rare', '🥇', '{"borderColor": "#FFD700", "borderWidth": "3px"}'),
('パパありがとう質問パック', 'お父さん専用の特別な質問集', 'template', 'rare', '👨', '{"questionPackId": "dad_special"}'),
('ママありがとう質問パック', 'お母さん専用の特別な質問集', 'template', 'rare', '👩', '{"questionPackId": "mom_special"}'),

-- レベル3: レアギフト (legendary)
('伝説の語り部', '1000通のメッセージ送信達成', 'badge', 'legendary', '👑', '{"color": "#FF1493"}'),
('365日マスター', '1年間毎日連続送信', 'badge', 'legendary', '🎖️', '{"color": "#C0C0C0"}'),
('家族の太陽', '家族全員を明るく照らす存在', 'badge', 'legendary', '☀️', '{"color": "#FFA500"}'),
('オーロラカラー', 'メッセージに幻想的な輝き', 'color', 'legendary', '✨', '{"background": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", "textColor": "#FFFFFF"}'),
('宇宙カラー', 'メッセージに星空の輝き', 'color', 'legendary', '🌠', '{"background": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", "textColor": "#FFFFFF"}'),
('キラキラエフェクト', 'メッセージ送信時に輝くアニメーション', 'effect', 'legendary', '💫', '{"animationType": "sparkle", "duration": "2s"}'),
('ハートエフェクト', 'メッセージ送信時にハートが舞う', 'effect', 'legendary', '💕', '{"animationType": "hearts", "duration": "3s"}'),
('ダイヤモンドフレーム', 'プロフィールに虹色に輝く枠', 'frame', 'legendary', '💎', '{"borderImage": "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)", "borderWidth": "4px"}'),
('家族全員ギフトボックス', '家族全員に小さなギフトをプレゼント', 'special', 'legendary', '🎁', '{"giftType": "family_bonus", "pointsPerMember": 50}'),
('タイムカプセル', '1年前の今日のメッセージを聴ける特別な機能', 'special', 'legendary', '⏳', '{"featureUnlock": "time_capsule"}');

-- ======================================
-- 双六マス配置の基本設定（ボード1）
-- ======================================

-- ボード1「はじめての冒険」のマス配置
-- 50マス構成: 通常20, ギフト15, ボーナス5, チャンス3, 家族イベント3, ミッション3, 休憩0

DO $$
DECLARE
  board_1_id UUID;
  gift_ids UUID[];
BEGIN
  -- ボード1のIDを取得
  SELECT id INTO board_1_id FROM sugoroku_boards WHERE board_number = 1;

  -- ギフトIDを配列に格納（ランダムに配布するため）
  SELECT array_agg(id) INTO gift_ids FROM gifts WHERE rarity = 'common';

  -- マス配置
  -- 1マス目: スタート
  INSERT INTO sugoroku_squares (board_id, position, square_type, description) VALUES
  (board_1_id, 1, 'normal', 'スタート！家族との冒険の始まりです');

  -- 2-50マス目
  INSERT INTO sugoroku_squares (board_id, position, square_type, event_data, description) VALUES
  -- ギフトマス (15箇所)
  (board_1_id, 3, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 6, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 9, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 12, 'gift', '{"rarity": "rare", "message": "レアギフト獲得！"}', 'レアギフトがもらえるマス'),
  (board_1_id, 15, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 18, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 21, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 25, 'gift', '{"rarity": "rare", "message": "レアギフト獲得！"}', 'レアギフトがもらえるマス'),
  (board_1_id, 28, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 32, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 35, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 38, 'gift', '{"rarity": "rare", "message": "レアギフト獲得！"}', 'レアギフトがもらえるマス'),
  (board_1_id, 42, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 45, 'gift', '{"rarity": "common", "message": "おめでとう！ギフトを獲得しました"}', 'ギフトがもらえるマス'),
  (board_1_id, 48, 'gift', '{"rarity": "legendary", "message": "伝説のギフト獲得！！"}', '伝説のギフトがもらえるマス'),

  -- ボーナスポイントマス (5箇所)
  (board_1_id, 5, 'bonus', '{"points": 50}', '+50ポイント獲得！'),
  (board_1_id, 14, 'bonus', '{"points": 100}', '+100ポイント獲得！'),
  (board_1_id, 24, 'bonus', '{"points": 50}', '+50ポイント獲得！'),
  (board_1_id, 34, 'bonus', '{"points": 100}', '+100ポイント獲得！'),
  (board_1_id, 44, 'bonus', '{"points": 150}', '+150ポイント獲得！'),

  -- チャンスマス (3箇所)
  (board_1_id, 10, 'chance', '{"reward": "extra_roll", "message": "もう一回サイコロを振れます！"}', 'もう一度振れるチャンス'),
  (board_1_id, 27, 'chance', '{"reward": "extra_roll", "message": "もう一回サイコロを振れます！"}', 'もう一度振れるチャンス'),
  (board_1_id, 40, 'chance', '{"reward": "extra_roll", "message": "もう一回サイコロを振れます！"}', 'もう一度振れるチャンス'),

  -- 家族イベントマス (3箇所)
  (board_1_id, 17, 'family_event', '{"reward": "family_bonus", "pointsPerMember": 30, "message": "家族全員に30ポイント配布！"}', '家族みんなにプレゼント'),
  (board_1_id, 30, 'family_event', '{"reward": "family_bonus", "pointsPerMember": 30, "message": "家族全員に30ポイント配布！"}', '家族みんなにプレゼント'),
  (board_1_id, 43, 'family_event', '{"reward": "family_bonus", "pointsPerMember": 50, "message": "家族全員に50ポイント配布！"}', '家族みんなにプレゼント'),

  -- ミッションマス (3箇所)
  (board_1_id, 8, 'mission', '{"mission": "send_3_messages", "reward": 100, "description": "今日3人にメッセージを送ろう"}', 'ミッションに挑戦'),
  (board_1_id, 20, 'mission', '{"mission": "reply_to_all", "reward": 100, "description": "全員のメッセージに返信しよう"}', 'ミッションに挑戦'),
  (board_1_id, 36, 'mission', '{"mission": "send_voice_30sec", "reward": 150, "description": "30秒以上のメッセージを送ろう"}', 'ミッションに挑戦'),

  -- ゴールマス (50マス目)
  (board_1_id, 50, 'goal', '{"reward": "board_clear", "points": 500, "message": "おめでとう！ボード1クリア！次のボードが解放されました"}', 'ゴール！'),

  -- 残りは通常マス (2, 4, 7, 11, 13, 16, 19, 22, 23, 26, 29, 31, 33, 37, 39, 41, 46, 47, 49)
  (board_1_id, 2, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 4, 'normal', NULL, '家族との絆を深めよう'),
  (board_1_id, 7, 'normal', NULL, 'その調子！'),
  (board_1_id, 11, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 13, 'normal', NULL, 'もうすぐボーナスマス'),
  (board_1_id, 16, 'normal', NULL, '家族との絆を深めよう'),
  (board_1_id, 19, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 22, 'normal', NULL, 'その調子！'),
  (board_1_id, 23, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 26, 'normal', NULL, '家族との絆を深めよう'),
  (board_1_id, 29, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 31, 'normal', NULL, 'その調子！'),
  (board_1_id, 33, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 37, 'normal', NULL, '家族との絆を深めよう'),
  (board_1_id, 39, 'normal', NULL, '順調に進んでいます'),
  (board_1_id, 41, 'normal', NULL, 'その調子！'),
  (board_1_id, 46, 'normal', NULL, 'もうすぐゴール！'),
  (board_1_id, 47, 'normal', NULL, 'あと少し！'),
  (board_1_id, 49, 'normal', NULL, 'ゴール目前！');

END $$;
