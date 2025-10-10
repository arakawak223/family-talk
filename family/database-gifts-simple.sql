-- ギフトデータの投入（Supabase SQLエディタで実行）
INSERT INTO gifts (name, description, gift_type, rarity, metadata, is_active) VALUES
('🌟 スターバッジ', '最初のスター！', 'badge', 'common', '{"icon": "⭐"}', true),
('💙 ハートバッジ', '家族への愛を表現', 'badge', 'common', '{"icon": "💙"}', true),
('🎈 バルーンバッジ', '楽しい思い出', 'badge', 'common', '{"icon": "🎈"}', true),
('🌸 フラワーバッジ', 'きれいな花', 'badge', 'common', '{"icon": "🌸"}', true),
('🍀 クローバーバッジ', '幸運のしるし', 'badge', 'common', '{"icon": "🍀"}', true),
('👑 クラウンバッジ', '王冠を手に入れた！', 'badge', 'rare', '{"icon": "👑"}', true),
('🏆 トロフィーバッジ', '勝利の証', 'badge', 'rare', '{"icon": "🏆"}', true),
('💎 ダイヤモンドバッジ', '輝く宝石', 'badge', 'rare', '{"icon": "💎"}', true),
('🌈 レインボーバッジ', '虹色の輝き', 'badge', 'rare', '{"icon": "🌈"}', true),
('🔥 炎のバッジ', '情熱の証', 'badge', 'legendary', '{"icon": "🔥"}', true),
('⚡ 稲妻バッジ', '電撃のパワー', 'badge', 'legendary', '{"icon": "⚡"}', true),
('🎯 パーフェクトバッジ', '完璧な達成', 'badge', 'legendary', '{"icon": "🎯"}', true);

-- マス定義（ボード1のみ、主要なイベントマスのみ記載）
-- 実際にはSupabase SQLエディタで全マス分を実行する必要があります
