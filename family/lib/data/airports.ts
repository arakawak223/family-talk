// ======================================
// 世界の主要空港データ（Phase 1: 50空港）
// 各空港に観光名所とご当地グルメを追加
// ======================================

import { Airport, WorldRegion } from '@/lib/types/world-tour';

export const AIRPORTS: Airport[] = [
  // ========== アジア (Asia) ==========
  {
    code: 'NRT',
    name: '成田国際空港',
    city: '東京',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 35.7647, lng: 140.3864 },
    hub: true,
    icon: '🗼',
    attractions: [
      { name: '東京スカイツリー', description: '高さ634mの世界一高い電波塔', icon: '🗼', emotionPoints: 80, emotionCategory: 'wonder' },
      { name: '浅草寺', description: '東京最古の寺院、雷門が有名', icon: '⛩️', emotionPoints: 70, emotionCategory: 'reflection', isPowerSpot: true },
    ],
    localFood: [
      { name: '寿司', description: '新鮮な魚介を使った江戸前寿司', icon: '🍣', emotionPoints: 50 },
      { name: '天ぷら', description: 'サクサクの衣が特徴の揚げ物', icon: '🍤', emotionPoints: 40 },
    ],
  },
  {
    code: 'HND',
    name: '羽田空港',
    city: '東京',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 35.5494, lng: 139.7798 },
    hub: true,
    icon: '🏯',
    attractions: [
      { name: '富士山', description: '日本の象徴、標高3776mの霊峰', icon: '🗻', emotionPoints: 150, emotionCategory: 'beauty', isPowerSpot: true },
      { name: '皇居', description: '天皇陛下のお住まい、美しい庭園', icon: '🏯', emotionPoints: 60, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'ラーメン', description: '様々なスタイルの日本の麺料理', icon: '🍜', emotionPoints: 45 },
      { name: 'もんじゃ焼き', description: '東京下町の鉄板焼き料理', icon: '🥘', emotionPoints: 35 },
    ],
  },
  {
    code: 'KIX',
    name: '関西国際空港',
    city: '大阪',
    country: '日本',
    region: 'asia',
    coordinates: { lat: 34.4347, lng: 135.2441 },
    hub: true,
    icon: '🏰',
    attractions: [
      { name: '大阪城', description: '豊臣秀吉が築いた名城', icon: '🏰', emotionPoints: 80, emotionCategory: 'reflection' },
      { name: '道頓堀', description: 'グリコ看板で有名な繁華街', icon: '🌃', emotionPoints: 60, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'たこ焼き', description: '大阪名物のまん丸グルメ', icon: '🐙', emotionPoints: 45 },
      { name: 'お好み焼き', description: '関西風の鉄板焼き', icon: '🥞', emotionPoints: 40 },
    ],
  },
  {
    code: 'ICN',
    name: '仁川国際空港',
    city: 'ソウル',
    country: '韓国',
    region: 'asia',
    coordinates: { lat: 37.4602, lng: 126.4407 },
    hub: true,
    icon: '🇰🇷',
    attractions: [
      { name: '景福宮', description: '朝鮮王朝の王宮', icon: '🏛️', emotionPoints: 80, emotionCategory: 'reflection', isPowerSpot: true },
      { name: '明洞', description: 'ショッピングと美食の街', icon: '🛍️', emotionPoints: 50, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'サムギョプサル', description: '豚バラ肉の焼肉', icon: '🥓', emotionPoints: 50 },
      { name: 'ビビンバ', description: '野菜とご飯の混ぜ料理', icon: '🍚', emotionPoints: 40 },
    ],
  },
  {
    code: 'PEK',
    name: '北京首都国際空港',
    city: '北京',
    country: '中国',
    region: 'asia',
    coordinates: { lat: 40.0799, lng: 116.6031 },
    hub: true,
    icon: '🏛️',
    attractions: [
      { name: '万里の長城', description: '人類史上最大の建造物', icon: '🏯', emotionPoints: 200, emotionCategory: 'wonder', isPowerSpot: true },
      { name: '紫禁城', description: '明・清王朝の宮殿', icon: '🏛️', emotionPoints: 150, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: '北京ダック', description: 'パリパリの皮が特徴の名物料理', icon: '🦆', emotionPoints: 60 },
      { name: '炸醤麺', description: '肉味噌をのせた麺料理', icon: '🍜', emotionPoints: 40 },
    ],
  },
  {
    code: 'PVG',
    name: '上海浦東国際空港',
    city: '上海',
    country: '中国',
    region: 'asia',
    coordinates: { lat: 31.1443, lng: 121.8083 },
    hub: true,
    icon: '🌃',
    attractions: [
      { name: '外灘（バンド）', description: '西洋建築が並ぶ歴史的エリア', icon: '🌃', emotionPoints: 80, emotionCategory: 'beauty' },
      { name: '上海タワー', description: '中国一高い超高層ビル', icon: '🗼', emotionPoints: 70, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: '小籠包', description: 'スープたっぷりの蒸し餃子', icon: '🥟', emotionPoints: 55 },
      { name: '生煎包', description: '焼き小籠包', icon: '🥟', emotionPoints: 45 },
    ],
  },
  {
    code: 'HKG',
    name: '香港国際空港',
    city: '香港',
    country: '香港',
    region: 'asia',
    coordinates: { lat: 22.3080, lng: 113.9185 },
    hub: true,
    icon: '🌆',
    attractions: [
      { name: 'ビクトリア・ピーク', description: '香港島の最高峰からの絶景', icon: '🏔️', emotionPoints: 90, emotionCategory: 'beauty' },
      { name: '大仏（天壇大仏）', description: '世界最大級の屋外青銅製大仏', icon: '🧘', emotionPoints: 70, emotionCategory: 'reflection', isPowerSpot: true },
    ],
    localFood: [
      { name: '飲茶', description: '点心を楽しむ香港式ブランチ', icon: '🥢', emotionPoints: 50 },
      { name: 'エッグタルト', description: 'サクサクのポルトガル菓子', icon: '🥧', emotionPoints: 35 },
    ],
  },
  {
    code: 'TPE',
    name: '台湾桃園国際空港',
    city: '台北',
    country: '台湾',
    region: 'asia',
    coordinates: { lat: 25.0777, lng: 121.2328 },
    hub: true,
    icon: '🏮',
    attractions: [
      { name: '九份', description: '千と千尋の神隠しのモデルとも言われる街', icon: '🏮', emotionPoints: 100, emotionCategory: 'beauty' },
      { name: '台北101', description: 'かつて世界一高かったビル', icon: '🏙️', emotionPoints: 70, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: '小籠包', description: '鼎泰豊発祥の絶品点心', icon: '🥟', emotionPoints: 55 },
      { name: 'タピオカミルクティー', description: '台湾発祥の人気ドリンク', icon: '🧋', emotionPoints: 40 },
    ],
  },
  {
    code: 'SIN',
    name: 'チャンギ国際空港',
    city: 'シンガポール',
    country: 'シンガポール',
    region: 'asia',
    coordinates: { lat: 1.3644, lng: 103.9915 },
    hub: true,
    icon: '🦁',
    attractions: [
      { name: 'マリーナベイ・サンズ', description: '船型の屋上プールで有名なホテル', icon: '🏨', emotionPoints: 100, emotionCategory: 'wonder' },
      { name: 'ガーデンズ・バイ・ザ・ベイ', description: '巨大なスーパーツリー', icon: '🌳', emotionPoints: 90, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'チキンライス', description: 'シンガポールの国民食', icon: '🍗', emotionPoints: 45 },
      { name: 'ラクサ', description: 'ココナッツカレー麺', icon: '🍜', emotionPoints: 50 },
    ],
  },
  {
    code: 'BKK',
    name: 'スワンナプーム国際空港',
    city: 'バンコク',
    country: 'タイ',
    region: 'asia',
    coordinates: { lat: 13.6900, lng: 100.7501 },
    hub: true,
    icon: '🛕',
    attractions: [
      { name: 'ワット・プラケオ（エメラルド寺院）', description: 'タイで最も神聖な寺院', icon: '🛕', emotionPoints: 120, emotionCategory: 'reflection', isPowerSpot: true },
      { name: 'ワット・アルン（暁の寺）', description: 'チャオプラヤー川沿いの美しい寺院', icon: '⛪', emotionPoints: 90, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'パッタイ', description: 'タイ風焼きそば', icon: '🍜', emotionPoints: 45 },
      { name: 'トムヤムクン', description: '酸っぱ辛いエビスープ', icon: '🍲', emotionPoints: 50 },
    ],
  },
  {
    code: 'KUL',
    name: 'クアラルンプール国際空港',
    city: 'クアラルンプール',
    country: 'マレーシア',
    region: 'asia',
    coordinates: { lat: 2.7456, lng: 101.7099 },
    hub: true,
    icon: '🗼',
    attractions: [
      { name: 'ペトロナス・ツインタワー', description: 'かつて世界一高かったツインタワー', icon: '🏙️', emotionPoints: 90, emotionCategory: 'wonder' },
      { name: 'バトゥ洞窟', description: 'ヒンドゥー教の聖地、巨大な黄金像', icon: '🕌', emotionPoints: 80, emotionCategory: 'reflection', isPowerSpot: true },
    ],
    localFood: [
      { name: 'ナシレマ', description: 'ココナッツライスのマレーシア国民食', icon: '🍚', emotionPoints: 45 },
      { name: 'サテー', description: 'ピーナッツソースの串焼き', icon: '🍢', emotionPoints: 40 },
    ],
  },
  {
    code: 'DEL',
    name: 'インディラ・ガンディー国際空港',
    city: 'デリー',
    country: 'インド',
    region: 'asia',
    coordinates: { lat: 28.5562, lng: 77.1000 },
    hub: true,
    icon: '🕌',
    attractions: [
      { name: 'タージマハル', description: '愛の象徴、白亜の霊廟（アグラ）', icon: '🕌', emotionPoints: 200, emotionCategory: 'beauty', isPowerSpot: true },
      { name: 'レッド・フォート', description: 'ムガル帝国の象徴', icon: '🏰', emotionPoints: 100, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'ビリヤニ', description: 'スパイシーな炊き込みご飯', icon: '🍚', emotionPoints: 50 },
      { name: 'バターチキン', description: 'クリーミーなカレー', icon: '🍛', emotionPoints: 55 },
    ],
  },
  {
    code: 'MNL',
    name: 'ニノイ・アキノ国際空港',
    city: 'マニラ',
    country: 'フィリピン',
    region: 'asia',
    coordinates: { lat: 14.5086, lng: 121.0194 },
    hub: false,
    icon: '🏝️',
    attractions: [
      { name: 'イントラムロス', description: 'スペイン植民地時代の城塞都市', icon: '🏰', emotionPoints: 70, emotionCategory: 'reflection' },
      { name: 'ボラカイ島', description: '世界最高のビーチの一つ', icon: '🏖️', emotionPoints: 100, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'アドボ', description: '酢と醤油で煮込んだ国民食', icon: '🍖', emotionPoints: 40 },
      { name: 'レチョン', description: '丸焼きの豚', icon: '🐷', emotionPoints: 50 },
    ],
  },
  {
    code: 'CGK',
    name: 'スカルノ・ハッタ国際空港',
    city: 'ジャカルタ',
    country: 'インドネシア',
    region: 'asia',
    coordinates: { lat: -6.1256, lng: 106.6559 },
    hub: true,
    icon: '🌴',
    attractions: [
      { name: 'ボロブドゥール', description: '世界最大の仏教遺跡（ジョグジャカルタ）', icon: '🛕', emotionPoints: 180, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'バリ島', description: '神々の島、リゾート天国', icon: '🏝️', emotionPoints: 120, emotionCategory: 'beauty', isPowerSpot: true },
    ],
    localFood: [
      { name: 'ナシゴレン', description: 'インドネシア風チャーハン', icon: '🍚', emotionPoints: 45 },
      { name: 'サテー', description: 'ピーナッツソースの串焼き', icon: '🍢', emotionPoints: 40 },
    ],
  },
  {
    code: 'HAN',
    name: 'ノイバイ国際空港',
    city: 'ハノイ',
    country: 'ベトナム',
    region: 'asia',
    coordinates: { lat: 21.2212, lng: 105.8072 },
    hub: false,
    icon: '🎋',
    attractions: [
      { name: 'ハロン湾', description: '奇岩が浮かぶ世界遺産', icon: '🏞️', emotionPoints: 150, emotionCategory: 'beauty' },
      { name: 'ホアンキエム湖', description: 'ハノイ中心部の美しい湖', icon: '🌳', emotionPoints: 60, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'フォー', description: 'ベトナムの国民的麺料理', icon: '🍜', emotionPoints: 50 },
      { name: 'バインミー', description: 'ベトナム風サンドイッチ', icon: '🥖', emotionPoints: 40 },
    ],
  },

  // ========== ヨーロッパ (Europe) ==========
  {
    code: 'LHR',
    name: 'ヒースロー空港',
    city: 'ロンドン',
    country: 'イギリス',
    region: 'europe',
    coordinates: { lat: 51.4700, lng: -0.4543 },
    hub: true,
    icon: '🇬🇧',
    attractions: [
      { name: 'ビッグ・ベン', description: '国会議事堂の時計塔', icon: '🏛️', emotionPoints: 90, emotionCategory: 'reflection' },
      { name: 'タワー・ブリッジ', description: 'テムズ川にかかる跳ね橋', icon: '🌉', emotionPoints: 80, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'フィッシュ＆チップス', description: '揚げ魚とポテトの定番', icon: '🐟', emotionPoints: 40 },
      { name: 'アフタヌーンティー', description: '優雅な英国式お茶の時間', icon: '☕', emotionPoints: 50 },
    ],
  },
  {
    code: 'CDG',
    name: 'シャルル・ド・ゴール空港',
    city: 'パリ',
    country: 'フランス',
    region: 'europe',
    coordinates: { lat: 49.0097, lng: 2.5479 },
    hub: true,
    icon: '🗼',
    attractions: [
      { name: 'エッフェル塔', description: 'パリの象徴、鉄の貴婦人', icon: '🗼', emotionPoints: 120, emotionCategory: 'joy' },
      { name: 'ルーブル美術館', description: 'モナリザを収蔵する世界最大級の美術館', icon: '🖼️', emotionPoints: 150, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'クロワッサン', description: 'サクサクのフランス式パン', icon: '🥐', emotionPoints: 40 },
      { name: 'フォアグラ', description: '高級フランス料理', icon: '🍽️', emotionPoints: 60 },
    ],
  },
  {
    code: 'FRA',
    name: 'フランクフルト空港',
    city: 'フランクフルト',
    country: 'ドイツ',
    region: 'europe',
    coordinates: { lat: 50.0379, lng: 8.5622 },
    hub: true,
    icon: '🏰',
    attractions: [
      { name: 'レーマー広場', description: '中世の雰囲気が残る歴史的広場', icon: '🏛️', emotionPoints: 70, emotionCategory: 'reflection' },
      { name: 'ライン川', description: '古城が点在する美しい川', icon: '🏞️', emotionPoints: 90, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'ソーセージ', description: 'ドイツ名物のヴルスト', icon: '🌭', emotionPoints: 45 },
      { name: 'アップルワイン', description: 'フランクフルト名物のリンゴ酒', icon: '🍎', emotionPoints: 35 },
    ],
  },
  {
    code: 'AMS',
    name: 'スキポール空港',
    city: 'アムステルダム',
    country: 'オランダ',
    region: 'europe',
    coordinates: { lat: 52.3105, lng: 4.7683 },
    hub: true,
    icon: '🌷',
    attractions: [
      { name: 'アンネ・フランクの家', description: 'アンネの日記が書かれた隠れ家', icon: '📖', emotionPoints: 80, emotionCategory: 'reflection' },
      { name: 'キューケンホフ公園', description: '世界最大の花の庭園', icon: '🌷', emotionPoints: 100, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'ストロープワッフル', description: 'キャラメル入りワッフル', icon: '🧇', emotionPoints: 40 },
      { name: 'ハーリング', description: '生ニシンの塩漬け', icon: '🐟', emotionPoints: 35 },
    ],
  },
  {
    code: 'FCO',
    name: 'フィウミチーノ空港',
    city: 'ローマ',
    country: 'イタリア',
    region: 'europe',
    coordinates: { lat: 41.8003, lng: 12.2389 },
    hub: true,
    icon: '🏛️',
    attractions: [
      { name: 'コロッセオ', description: '古代ローマの円形闘技場', icon: '🏛️', emotionPoints: 160, emotionCategory: 'reflection', isPowerSpot: true },
      { name: 'トレビの泉', description: 'コインを投げ入れる噴水', icon: '⛲', emotionPoints: 80, emotionCategory: 'joy' },
    ],
    localFood: [
      { name: 'カルボナーラ', description: 'ローマ発祥のパスタ', icon: '🍝', emotionPoints: 55 },
      { name: 'ジェラート', description: 'イタリアンアイスクリーム', icon: '🍨', emotionPoints: 40 },
    ],
  },
  {
    code: 'MAD',
    name: 'マドリード・バラハス空港',
    city: 'マドリード',
    country: 'スペイン',
    region: 'europe',
    coordinates: { lat: 40.4983, lng: -3.5676 },
    hub: true,
    icon: '💃',
    attractions: [
      { name: 'プラド美術館', description: 'ベラスケスやゴヤの名作を収蔵', icon: '🖼️', emotionPoints: 100, emotionCategory: 'beauty' },
      { name: '王宮', description: 'ヨーロッパ最大級の宮殿', icon: '🏰', emotionPoints: 90, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'パエリア', description: 'サフラン風味の米料理', icon: '🥘', emotionPoints: 55 },
      { name: 'タパス', description: 'スペインの小皿料理', icon: '🍽️', emotionPoints: 45 },
    ],
  },
  {
    code: 'BCN',
    name: 'バルセロナ・エル・プラット空港',
    city: 'バルセロナ',
    country: 'スペイン',
    region: 'europe',
    coordinates: { lat: 41.2971, lng: 2.0785 },
    hub: false,
    icon: '⛪',
    attractions: [
      { name: 'サグラダ・ファミリア', description: 'ガウディの未完の傑作教会', icon: '⛪', emotionPoints: 180, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'グエル公園', description: 'ガウディのモザイク庭園', icon: '🦎', emotionPoints: 100, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'パ・アム・トマケット', description: 'トマトを塗ったパン', icon: '🍞', emotionPoints: 35 },
      { name: 'クレマカタラーナ', description: 'カタルーニャ風クリームブリュレ', icon: '🍮', emotionPoints: 45 },
    ],
  },
  {
    code: 'MUC',
    name: 'ミュンヘン空港',
    city: 'ミュンヘン',
    country: 'ドイツ',
    region: 'europe',
    coordinates: { lat: 48.3538, lng: 11.7861 },
    hub: true,
    icon: '🍺',
    attractions: [
      { name: 'ノイシュヴァンシュタイン城', description: 'ディズニー城のモデル', icon: '🏰', emotionPoints: 150, emotionCategory: 'beauty' },
      { name: 'マリエン広場', description: 'からくり時計で有名な広場', icon: '⏰', emotionPoints: 70, emotionCategory: 'joy' },
    ],
    localFood: [
      { name: 'ヴァイスヴルスト', description: '白ソーセージ', icon: '🌭', emotionPoints: 40 },
      { name: 'プレッツェル', description: 'ドイツのパン', icon: '🥨', emotionPoints: 35 },
    ],
  },
  {
    code: 'ZRH',
    name: 'チューリッヒ空港',
    city: 'チューリッヒ',
    country: 'スイス',
    region: 'europe',
    coordinates: { lat: 47.4647, lng: 8.5492 },
    hub: false,
    icon: '⛰️',
    attractions: [
      { name: 'マッターホルン', description: 'アルプスの象徴的な山', icon: '🏔️', emotionPoints: 150, emotionCategory: 'beauty' },
      { name: 'ユングフラウヨッホ', description: 'ヨーロッパの屋根と呼ばれる展望台', icon: '⛰️', emotionPoints: 130, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'チーズフォンデュ', description: 'とろけるチーズ料理', icon: '🧀', emotionPoints: 50 },
      { name: 'スイスチョコレート', description: '世界最高峰のチョコ', icon: '🍫', emotionPoints: 45 },
    ],
  },
  {
    code: 'VIE',
    name: 'ウィーン国際空港',
    city: 'ウィーン',
    country: 'オーストリア',
    region: 'europe',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    hub: false,
    icon: '🎻',
    attractions: [
      { name: 'シェーンブルン宮殿', description: 'ハプスブルク家の夏の離宮', icon: '🏰', emotionPoints: 120, emotionCategory: 'beauty' },
      { name: 'ウィーン国立歌劇場', description: '世界最高峰のオペラハウス', icon: '🎭', emotionPoints: 100, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'ウィンナーシュニッツェル', description: '薄いカツレツ', icon: '🍖', emotionPoints: 50 },
      { name: 'ザッハトルテ', description: '濃厚なチョコレートケーキ', icon: '🍰', emotionPoints: 45 },
    ],
  },
  {
    code: 'ATH',
    name: 'アテネ国際空港',
    city: 'アテネ',
    country: 'ギリシャ',
    region: 'europe',
    coordinates: { lat: 37.9364, lng: 23.9445 },
    hub: false,
    icon: '🏛️',
    attractions: [
      { name: 'パルテノン神殿', description: '古代ギリシャの象徴', icon: '🏛️', emotionPoints: 170, emotionCategory: 'reflection', isPowerSpot: true },
      { name: 'サントリーニ島', description: '白と青の絶景の島', icon: '🏝️', emotionPoints: 200, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'ムサカ', description: 'なすとひき肉のグラタン', icon: '🍆', emotionPoints: 45 },
      { name: 'ギロピタ', description: 'ギリシャ風ドネルケバブ', icon: '🌯', emotionPoints: 40 },
    ],
  },
  {
    code: 'CPH',
    name: 'コペンハーゲン空港',
    city: 'コペンハーゲン',
    country: 'デンマーク',
    region: 'europe',
    coordinates: { lat: 55.6180, lng: 12.6508 },
    hub: false,
    icon: '🧜‍♀️',
    attractions: [
      { name: '人魚姫の像', description: 'アンデルセン童話の象徴', icon: '🧜‍♀️', emotionPoints: 70, emotionCategory: 'reflection' },
      { name: 'チボリ公園', description: '世界最古のテーマパーク', icon: '🎢', emotionPoints: 80, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'スモーブロー', description: 'オープンサンドイッチ', icon: '🥪', emotionPoints: 40 },
      { name: 'デニッシュペストリー', description: '層状のパイ生地菓子', icon: '🥐', emotionPoints: 35 },
    ],
  },
  {
    code: 'ARN',
    name: 'ストックホルム・アーランダ空港',
    city: 'ストックホルム',
    country: 'スウェーデン',
    region: 'europe',
    coordinates: { lat: 59.6519, lng: 17.9186 },
    hub: false,
    icon: '👑',
    attractions: [
      { name: 'ガムラスタン', description: '旧市街の中世の街並み', icon: '🏘️', emotionPoints: 80, emotionCategory: 'reflection' },
      { name: 'ヴァーサ号博物館', description: '17世紀の軍艦を展示', icon: '⛵', emotionPoints: 90, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'ミートボール', description: 'スウェーデン風肉団子', icon: '🧆', emotionPoints: 40 },
      { name: 'シナモンロール', description: 'フィーカ文化の定番', icon: '🥯', emotionPoints: 35 },
    ],
  },
  {
    code: 'HEL',
    name: 'ヘルシンキ・ヴァンター空港',
    city: 'ヘルシンキ',
    country: 'フィンランド',
    region: 'europe',
    coordinates: { lat: 60.3172, lng: 24.9633 },
    hub: false,
    icon: '🎅',
    attractions: [
      { name: 'オーロラ観測', description: '北極圏の神秘の光', icon: '🌌', emotionPoints: 250, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'サンタクロース村', description: 'サンタに会える村', icon: '🎅', emotionPoints: 100, emotionCategory: 'joy' },
    ],
    localFood: [
      { name: 'サーモンスープ', description: 'クリーミーなスープ', icon: '🍲', emotionPoints: 45 },
      { name: 'カレリアンパイ', description: 'お米入りのパイ', icon: '🥧', emotionPoints: 35 },
    ],
  },

  // ========== 北米 (North America) ==========
  {
    code: 'JFK',
    name: 'ジョン・F・ケネディ国際空港',
    city: 'ニューヨーク',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    hub: true,
    icon: '🗽',
    attractions: [
      { name: '自由の女神', description: 'アメリカの自由の象徴', icon: '🗽', emotionPoints: 140, emotionCategory: 'joy' },
      { name: 'タイムズスクエア', description: '世界の交差点', icon: '🌃', emotionPoints: 100, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'ニューヨークピザ', description: '大判の折りたたみピザ', icon: '🍕', emotionPoints: 45 },
      { name: 'ベーグル', description: 'NYスタイルのパン', icon: '🥯', emotionPoints: 35 },
    ],
  },
  {
    code: 'LAX',
    name: 'ロサンゼルス国際空港',
    city: 'ロサンゼルス',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 33.9416, lng: -118.4085 },
    hub: true,
    icon: '🎬',
    attractions: [
      { name: 'ハリウッド', description: '映画の都', icon: '🎬', emotionPoints: 100, emotionCategory: 'fun' },
      { name: 'グランドキャニオン', description: '壮大な渓谷（車で5時間）', icon: '🏜️', emotionPoints: 220, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'タコス', description: 'メキシカン・アメリカン料理', icon: '🌮', emotionPoints: 40 },
      { name: 'イン・アンド・アウト・バーガー', description: 'LA名物ハンバーガー', icon: '🍔', emotionPoints: 45 },
    ],
  },
  {
    code: 'SFO',
    name: 'サンフランシスコ国際空港',
    city: 'サンフランシスコ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 37.6213, lng: -122.3790 },
    hub: true,
    icon: '🌉',
    attractions: [
      { name: 'ゴールデン・ゲート・ブリッジ', description: '赤い吊り橋の象徴', icon: '🌉', emotionPoints: 100, emotionCategory: 'beauty' },
      { name: 'アルカトラズ島', description: '脱獄不可能の刑務所跡', icon: '🏝️', emotionPoints: 80, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'クラムチャウダー', description: 'パンに入ったスープ', icon: '🥣', emotionPoints: 45 },
      { name: 'ギラデリチョコレート', description: '老舗チョコレート', icon: '🍫', emotionPoints: 40 },
    ],
  },
  {
    code: 'ORD',
    name: 'オヘア国際空港',
    city: 'シカゴ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 41.9742, lng: -87.9073 },
    hub: true,
    icon: '🌆',
    attractions: [
      { name: 'ミレニアムパーク', description: 'ビーンズ（クラウドゲート）がある公園', icon: '🫘', emotionPoints: 80, emotionCategory: 'fun' },
      { name: 'ウィリスタワー', description: '高層ビルからの絶景', icon: '🏙️', emotionPoints: 70, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'シカゴピザ', description: '深皿のディープディッシュ', icon: '🍕', emotionPoints: 50 },
      { name: 'シカゴホットドッグ', description: '独特のトッピング', icon: '🌭', emotionPoints: 40 },
    ],
  },
  {
    code: 'MIA',
    name: 'マイアミ国際空港',
    city: 'マイアミ',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 25.7959, lng: -80.2870 },
    hub: true,
    icon: '🏖️',
    attractions: [
      { name: 'サウスビーチ', description: 'アールデコ建築とビーチ', icon: '🏖️', emotionPoints: 90, emotionCategory: 'fun' },
      { name: 'エバーグレーズ国立公園', description: '広大な湿地帯', icon: '🐊', emotionPoints: 80, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'キューバサンドイッチ', description: 'キューバ風プレスサンド', icon: '🥪', emotionPoints: 45 },
      { name: 'ストーンクラブ', description: 'マイアミ名物のカニ', icon: '🦀', emotionPoints: 55 },
    ],
  },
  {
    code: 'DFW',
    name: 'ダラス・フォートワース国際空港',
    city: 'ダラス',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 32.8998, lng: -97.0403 },
    hub: true,
    icon: '🤠',
    attractions: [
      { name: 'シックスフロア博物館', description: 'JFK暗殺の歴史', icon: '🏛️', emotionPoints: 80, emotionCategory: 'reflection' },
      { name: 'ストックヤード', description: 'カウボーイ文化の中心', icon: '🤠', emotionPoints: 70, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'テキサスBBQ', description: 'スモークされた肉料理', icon: '🍖', emotionPoints: 55 },
      { name: 'チリコンカーン', description: 'テキサス風チリ', icon: '🌶️', emotionPoints: 40 },
    ],
  },
  {
    code: 'SEA',
    name: 'シアトル・タコマ国際空港',
    city: 'シアトル',
    country: 'アメリカ',
    region: 'north_america',
    coordinates: { lat: 47.4502, lng: -122.3088 },
    hub: false,
    icon: '☕',
    attractions: [
      { name: 'スペースニードル', description: 'シアトルのシンボル', icon: '🗼', emotionPoints: 80, emotionCategory: 'wonder' },
      { name: 'パイクプレイスマーケット', description: 'スタバ発祥の地', icon: '☕', emotionPoints: 70, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'クラムチャウダー', description: 'シーフードスープ', icon: '🥣', emotionPoints: 45 },
      { name: 'サーモン', description: '新鮮なパシフィックサーモン', icon: '🐟', emotionPoints: 50 },
    ],
  },
  {
    code: 'YYZ',
    name: 'トロント・ピアソン国際空港',
    city: 'トロント',
    country: 'カナダ',
    region: 'north_america',
    coordinates: { lat: 43.6777, lng: -79.6248 },
    hub: true,
    icon: '🍁',
    attractions: [
      { name: 'ナイアガラの滝', description: '世界三大瀑布の一つ', icon: '💧', emotionPoints: 170, emotionCategory: 'wonder' },
      { name: 'CNタワー', description: 'トロントのランドマーク', icon: '🗼', emotionPoints: 80, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'プーティン', description: 'フライドポテトにグレイビーとチーズ', icon: '🍟', emotionPoints: 45 },
      { name: 'メープルシロップ', description: 'カナダの象徴', icon: '🍁', emotionPoints: 35 },
    ],
  },
  {
    code: 'YVR',
    name: 'バンクーバー国際空港',
    city: 'バンクーバー',
    country: 'カナダ',
    region: 'north_america',
    coordinates: { lat: 49.1967, lng: -123.1815 },
    hub: false,
    icon: '🏔️',
    attractions: [
      { name: 'スタンレーパーク', description: '都市公園の傑作', icon: '🌲', emotionPoints: 80, emotionCategory: 'beauty' },
      { name: 'グラウスマウンテン', description: '市内から見える山', icon: '🏔️', emotionPoints: 90, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'スモークサーモン', description: 'パシフィックサーモン', icon: '🐟', emotionPoints: 50 },
      { name: 'ナナイモバー', description: 'BC州発祥のデザート', icon: '🍫', emotionPoints: 40 },
    ],
  },
  {
    code: 'MEX',
    name: 'メキシコシティ国際空港',
    city: 'メキシコシティ',
    country: 'メキシコ',
    region: 'north_america',
    coordinates: { lat: 19.4363, lng: -99.0721 },
    hub: true,
    icon: '🌮',
    attractions: [
      { name: 'テオティワカン', description: '太陽のピラミッドがある遺跡', icon: '🏛️', emotionPoints: 180, emotionCategory: 'wonder' },
      { name: '国立人類学博物館', description: 'アステカ文明の遺物', icon: '🏺', emotionPoints: 100, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'タコス', description: 'メキシコの国民食', icon: '🌮', emotionPoints: 45 },
      { name: 'モーレ', description: 'チョコレート風味のソース', icon: '🍛', emotionPoints: 50 },
    ],
  },

  // ========== 南米 (South America) ==========
  {
    code: 'GRU',
    name: 'グアルーリョス国際空港',
    city: 'サンパウロ',
    country: 'ブラジル',
    region: 'south_america',
    coordinates: { lat: -23.4356, lng: -46.4731 },
    hub: true,
    icon: '🇧🇷',
    attractions: [
      { name: 'パウリスタ大通り', description: 'サンパウロのメインストリート', icon: '🏙️', emotionPoints: 60, emotionCategory: 'fun' },
      { name: 'イビラプエラ公園', description: '南米最大の都市公園', icon: '🌳', emotionPoints: 70, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'フェイジョアーダ', description: '黒豆と肉の煮込み', icon: '🫘', emotionPoints: 50 },
      { name: 'ポン・デ・ケージョ', description: 'チーズパン', icon: '🧀', emotionPoints: 40 },
    ],
  },
  {
    code: 'GIG',
    name: 'ガレオン国際空港',
    city: 'リオデジャネイロ',
    country: 'ブラジル',
    region: 'south_america',
    coordinates: { lat: -22.8100, lng: -43.2505 },
    hub: false,
    icon: '🎭',
    attractions: [
      { name: 'コルコバードのキリスト像', description: '新・世界七不思議', icon: '✝️', emotionPoints: 160, emotionCategory: 'reflection', isPowerSpot: true },
      { name: 'コパカバーナビーチ', description: '世界的に有名なビーチ', icon: '🏖️', emotionPoints: 100, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'シュラスコ', description: 'ブラジル式BBQ', icon: '🍖', emotionPoints: 55 },
      { name: 'アサイーボウル', description: 'アマゾン発祥のスーパーフード', icon: '🫐', emotionPoints: 40 },
    ],
  },
  {
    code: 'EZE',
    name: 'エセイサ国際空港',
    city: 'ブエノスアイレス',
    country: 'アルゼンチン',
    region: 'south_america',
    coordinates: { lat: -34.8222, lng: -58.5358 },
    hub: false,
    icon: '💃',
    attractions: [
      { name: 'カミニート', description: 'カラフルなタンゴ発祥の地', icon: '💃', emotionPoints: 90, emotionCategory: 'fun' },
      { name: 'レコレータ墓地', description: 'エビータが眠る美しい墓地', icon: '⛪', emotionPoints: 70, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'アサード', description: 'アルゼンチン式BBQ', icon: '🥩', emotionPoints: 55 },
      { name: 'エンパナーダ', description: 'ミートパイ', icon: '🥟', emotionPoints: 40 },
    ],
  },
  {
    code: 'LIM',
    name: 'ホルヘ・チャベス国際空港',
    city: 'リマ',
    country: 'ペルー',
    region: 'south_america',
    coordinates: { lat: -12.0219, lng: -77.1143 },
    hub: false,
    icon: '🏔️',
    attractions: [
      { name: 'マチュピチュ', description: '天空の都市、インカの遺跡', icon: '🏔️', emotionPoints: 250, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'ナスカの地上絵', description: '謎の巨大絵画', icon: '🛩️', emotionPoints: 180, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'セビーチェ', description: '新鮮な魚介のマリネ', icon: '🐟', emotionPoints: 55 },
      { name: 'ロモ・サルタード', description: 'ペルー風牛肉炒め', icon: '🥩', emotionPoints: 45 },
    ],
  },
  {
    code: 'SCL',
    name: 'アルトゥーロ・メリノ・ベニテス国際空港',
    city: 'サンティアゴ',
    country: 'チリ',
    region: 'south_america',
    coordinates: { lat: -33.3930, lng: -70.7858 },
    hub: false,
    icon: '🍷',
    attractions: [
      { name: 'イースター島', description: 'モアイ像の謎の島', icon: '🗿', emotionPoints: 200, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'アタカマ砂漠', description: '世界で最も乾燥した場所', icon: '🏜️', emotionPoints: 150, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'エンパナーダ', description: 'チリ風ミートパイ', icon: '🥟', emotionPoints: 40 },
      { name: 'チリワイン', description: '世界的なワイン産地', icon: '🍷', emotionPoints: 50 },
    ],
  },

  // ========== オセアニア (Oceania) ==========
  {
    code: 'SYD',
    name: 'シドニー国際空港',
    city: 'シドニー',
    country: 'オーストラリア',
    region: 'oceania',
    coordinates: { lat: -33.9399, lng: 151.1753 },
    hub: true,
    icon: '🦘',
    attractions: [
      { name: 'シドニー・オペラハウス', description: '世界遺産の建築傑作', icon: '🎭', emotionPoints: 140, emotionCategory: 'beauty' },
      { name: 'グレートバリアリーフ', description: '世界最大のサンゴ礁', icon: '🐠', emotionPoints: 220, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'ベジマイト', description: 'オーストラリアの国民食', icon: '🫙', emotionPoints: 30 },
      { name: 'ミートパイ', description: 'オージーのソウルフード', icon: '🥧', emotionPoints: 40 },
    ],
  },
  {
    code: 'MEL',
    name: 'メルボルン空港',
    city: 'メルボルン',
    country: 'オーストラリア',
    region: 'oceania',
    coordinates: { lat: -37.6690, lng: 144.8410 },
    hub: false,
    icon: '🏏',
    attractions: [
      { name: 'グレートオーシャンロード', description: '12使徒の奇岩', icon: '🏞️', emotionPoints: 150, emotionCategory: 'beauty' },
      { name: 'フィリップ島', description: 'ペンギンパレード', icon: '🐧', emotionPoints: 100, emotionCategory: 'joy' },
    ],
    localFood: [
      { name: 'フラットホワイト', description: 'オーストラリア発祥のコーヒー', icon: '☕', emotionPoints: 35 },
      { name: 'ラミントン', description: 'チョコとココナッツのケーキ', icon: '🍰', emotionPoints: 40 },
    ],
  },
  {
    code: 'AKL',
    name: 'オークランド空港',
    city: 'オークランド',
    country: 'ニュージーランド',
    region: 'oceania',
    coordinates: { lat: -37.0082, lng: 174.7850 },
    hub: false,
    icon: '🥝',
    attractions: [
      { name: 'ミルフォード・サウンド', description: 'フィヨルドの絶景', icon: '⛰️', emotionPoints: 200, emotionCategory: 'beauty' },
      { name: 'ホビット村', description: 'ロード・オブ・ザ・リングのロケ地', icon: '🏠', emotionPoints: 120, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'ハンギ', description: 'マオリ式蒸し料理', icon: '🍖', emotionPoints: 50 },
      { name: 'パブロバ', description: 'メレンゲケーキ', icon: '🍰', emotionPoints: 45 },
    ],
  },

  // ========== 中東 (Middle East) ==========
  {
    code: 'DXB',
    name: 'ドバイ国際空港',
    city: 'ドバイ',
    country: 'アラブ首長国連邦',
    region: 'middle_east',
    coordinates: { lat: 25.2532, lng: 55.3657 },
    hub: true,
    icon: '🏙️',
    attractions: [
      { name: 'ブルジュ・ハリファ', description: '世界一高い建造物（828m）', icon: '🏙️', emotionPoints: 150, emotionCategory: 'wonder' },
      { name: 'パーム・ジュメイラ', description: 'ヤシの木型の人工島', icon: '🌴', emotionPoints: 100, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'シャワルマ', description: '中東風ドネルケバブ', icon: '🌯', emotionPoints: 40 },
      { name: 'フムス', description: 'ひよこ豆のディップ', icon: '🫘', emotionPoints: 35 },
    ],
  },
  {
    code: 'DOH',
    name: 'ハマド国際空港',
    city: 'ドーハ',
    country: 'カタール',
    region: 'middle_east',
    coordinates: { lat: 25.2731, lng: 51.6081 },
    hub: true,
    icon: '⚽',
    attractions: [
      { name: 'ザ・パール', description: '人工島のラグジュアリーエリア', icon: '💎', emotionPoints: 80, emotionCategory: 'beauty' },
      { name: 'イスラム美術館', description: 'I.M.ペイ設計の美術館', icon: '🏛️', emotionPoints: 90, emotionCategory: 'reflection' },
    ],
    localFood: [
      { name: 'マチブース', description: 'スパイシーな米料理', icon: '🍚', emotionPoints: 45 },
      { name: 'カブサ', description: '羊肉の炊き込みご飯', icon: '🍖', emotionPoints: 50 },
    ],
  },
  {
    code: 'IST',
    name: 'イスタンブール空港',
    city: 'イスタンブール',
    country: 'トルコ',
    region: 'middle_east',
    coordinates: { lat: 41.2753, lng: 28.7519 },
    hub: true,
    icon: '🕌',
    attractions: [
      { name: 'アヤソフィア', description: 'ビザンツ建築の傑作', icon: '🕌', emotionPoints: 150, emotionCategory: 'reflection', isPowerSpot: true },
      { name: 'グランドバザール', description: '世界最大級の屋根付き市場', icon: '🛍️', emotionPoints: 80, emotionCategory: 'fun' },
    ],
    localFood: [
      { name: 'ケバブ', description: 'トルコ名物の肉料理', icon: '🍖', emotionPoints: 50 },
      { name: 'バクラヴァ', description: '蜂蜜とナッツの菓子', icon: '🍯', emotionPoints: 45 },
    ],
  },

  // ========== アフリカ (Africa) ==========
  {
    code: 'JNB',
    name: 'O・R・タンボ国際空港',
    city: 'ヨハネスブルグ',
    country: '南アフリカ',
    region: 'africa',
    coordinates: { lat: -26.1392, lng: 28.2460 },
    hub: true,
    icon: '🦁',
    attractions: [
      { name: 'クルーガー国立公園', description: 'ビッグファイブに出会えるサファリ', icon: '🦁', emotionPoints: 200, emotionCategory: 'fun' },
      { name: 'テーブルマウンテン', description: 'ケープタウンの象徴', icon: '🏔️', emotionPoints: 120, emotionCategory: 'beauty' },
    ],
    localFood: [
      { name: 'ブライ', description: '南ア式BBQ', icon: '🍖', emotionPoints: 50 },
      { name: 'ボボティー', description: 'スパイシーなミートローフ', icon: '🥘', emotionPoints: 45 },
    ],
  },
  {
    code: 'CAI',
    name: 'カイロ国際空港',
    city: 'カイロ',
    country: 'エジプト',
    region: 'africa',
    coordinates: { lat: 30.1219, lng: 31.4056 },
    hub: true,
    icon: '🏛️',
    attractions: [
      { name: 'ギザのピラミッド', description: '古代世界七不思議で唯一現存', icon: '🏛️', emotionPoints: 230, emotionCategory: 'wonder', isPowerSpot: true },
      { name: 'スフィンクス', description: 'ライオンの体と人間の頭', icon: '🦁', emotionPoints: 150, emotionCategory: 'wonder' },
    ],
    localFood: [
      { name: 'コシャリ', description: 'エジプトの国民食', icon: '🍜', emotionPoints: 40 },
      { name: 'ファラフェル', description: 'ひよこ豆のコロッケ', icon: '🧆', emotionPoints: 35 },
    ],
  },
];

// ======================================
// ヘルパー関数
// ======================================

/**
 * 空港コードから空港情報を取得
 */
export function getAirportByCode(code: string): Airport | undefined {
  return AIRPORTS.find(airport => airport.code === code);
}

/**
 * 地域で空港をフィルタ
 */
export function getAirportsByRegion(region: WorldRegion): Airport[] {
  return AIRPORTS.filter(airport => airport.region === region);
}

/**
 * ハブ空港のみ取得
 */
export function getHubAirports(): Airport[] {
  return AIRPORTS.filter(airport => airport.hub);
}

/**
 * 2つの空港間の距離を計算（km）
 * ハバーサイン公式を使用
 */
export function calculateDistance(from: Airport, to: Airport): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(to.coordinates.lat - from.coordinates.lat);
  const dLng = toRad(to.coordinates.lng - from.coordinates.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.coordinates.lat)) *
      Math.cos(toRad(to.coordinates.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * 距離からマス数を計算
 * 500kmあたり1マス（端数切り上げ）
 * 例: 400km = 1マス, 800km = 2マス, 3000km = 6マス
 */
export function distanceToSpaces(distanceKm: number): number {
  return Math.ceil(distanceKm / 500);
}

/**
 * サイコロの目で到達可能かどうかを判定
 * 1ターンで移動できるのは最大6マス（3000km）
 */
export function canReachInOneTurn(distanceKm: number, diceRoll: number): boolean {
  const spacesNeeded = distanceToSpaces(distanceKm);
  return spacesNeeded <= diceRoll;
}

/**
 * 中継地点を計算
 * 遠距離の場合、途中の空港を経由地として提案
 */
export function findWaypointAirports(
  from: Airport,
  to: Airport,
  maxSpaces: number
): Airport[] {
  const totalDistance = calculateDistance(from, to);
  const totalSpaces = distanceToSpaces(totalDistance);

  // 1ターンで到達可能なら中継不要
  if (totalSpaces <= maxSpaces) return [];

  // 目的地方向にある空港を探し、到達可能な範囲内の候補を返す
  const maxDistanceKm = maxSpaces * 500;

  // 方向ベクトルを計算
  const dirLat = to.coordinates.lat - from.coordinates.lat;
  const dirLng = to.coordinates.lng - from.coordinates.lng;

  const candidates = AIRPORTS
    .filter(airport => {
      if (airport.code === from.code || airport.code === to.code) return false;

      const distance = calculateDistance(from, airport);
      // 到達可能距離内かつ、目的地に近づく方向にある空港
      if (distance > maxDistanceKm || distance < 500) return false;

      // 目的地に向かう方向にあるかチェック
      const toAirportLat = airport.coordinates.lat - from.coordinates.lat;
      const toAirportLng = airport.coordinates.lng - from.coordinates.lng;

      // 内積が正なら同じ方向
      const dotProduct = dirLat * toAirportLat + dirLng * toAirportLng;
      return dotProduct > 0;
    })
    .map(airport => ({
      airport,
      distance: calculateDistance(from, airport),
      remainingDistance: calculateDistance(airport, to),
    }))
    // 目的地に近い順でソート
    .sort((a, b) => a.remainingDistance - b.remainingDistance)
    .slice(0, 5) // 上位5件
    .map(item => item.airport);

  return candidates;
}

/**
 * 空港の統計情報を取得
 */
export function getAirportStats() {
  const stats = {
    total: AIRPORTS.length,
    hubs: AIRPORTS.filter(a => a.hub).length,
    byRegion: {
      asia: getAirportsByRegion('asia').length,
      europe: getAirportsByRegion('europe').length,
      north_america: getAirportsByRegion('north_america').length,
      south_america: getAirportsByRegion('south_america').length,
      oceania: getAirportsByRegion('oceania').length,
      middle_east: getAirportsByRegion('middle_east').length,
      africa: getAirportsByRegion('africa').length,
    },
  };
  return stats;
}
