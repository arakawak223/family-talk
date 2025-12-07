// ======================================
// お笑いマスデータ
// 「昭和ギャグ」「平成ギャグ」「令和ギャグ」「ボケとツッコミ」の4種類
// ======================================

export type ComedyType = 'showa_gag' | 'heisei_gag' | 'reiwa_gag' | 'boke_tsukkomi';

export interface ComedyContent {
  id: string;
  type: ComedyType;
  content: string;           // メインのコンテンツ（ギャグなど）
  speakText?: string;        // 音声読み上げ用テキスト（リアルな発音）
  performer?: string;        // 芸人名（昭和ギャグの場合）
  setup?: string;            // ボケの前振り（ボケツッコミの場合）
  boke?: string;             // ボケ（ボケツッコミの場合）
  tsukkomi?: string;         // ツッコミ（ボケツッコミの場合）
  hint?: string;             // ヒント
  icon: string;
}

// ======================================
// ① 昭和ギャグ（懐かしの名ギャグ）
// 表示用contentと読み上げ用speakTextを分けてリアル感を出す
// ======================================
export const SHOWA_GAGS: ComedyContent[] = [
  // ドリフターズ
  {
    id: 'showa-3', type: 'showa_gag',
    content: 'ちょっとだけよ〜、あんたも好きね〜',
    speakText: 'ちょっとだけよぉー、あんたもぉ、好きねぇー',
    performer: '加藤茶', hint: 'タブー（曲）に合わせて', icon: '💃'
  },
  {
    id: 'showa-4', type: 'showa_gag',
    content: 'カラスの勝手でしょ〜',
    speakText: 'カーラースー、なぜ鳴くのー、カラスの勝手でしょー',
    performer: '志村けん', hint: '童謡「七つの子」の替え歌', icon: '🐦‍⬛'
  },
  {
    id: 'showa-5', type: 'showa_gag',
    content: 'アイーン',
    speakText: 'アイーーーーン！',
    performer: '志村けん', hint: '手をあごに当てて', icon: '🤪'
  },

  // コント55号
  {
    id: 'showa-8', type: 'showa_gag',
    content: '飛びます飛びます',
    speakText: 'とびます、とびます！',
    performer: '坂上二郎', hint: '両手を広げて', icon: '✈️'
  },

  // 植木等
  {
    id: 'showa-10', type: 'showa_gag',
    content: 'わかっちゃいるけどやめられない',
    speakText: 'スイスイスーダラダッタ、スラスラスイスイスイー、わかっちゃいるけどやめられないっ',
    performer: '植木等', hint: 'スーダラ節より', icon: '🎵'
  },

  // コメディアン
  {
    id: 'showa-15', type: 'showa_gag',
    content: 'ガチョーン',
    speakText: 'ガッチョーーーーーーーン！',
    performer: '谷啓', hint: '手を合わせて後ろに', icon: '🙌'
  },

  // 小松政夫
  {
    id: 'showa-18', type: 'showa_gag',
    content: '電線音頭',
    speakText: 'でんせんに、スズメが三羽とまってた、それを猟師が鉄砲で撃ってさー、煮てさー、焼いてさー、食ってさー、ヨイヨイヨイヨイ、おっとっとっとー',
    performer: '小松政夫・伊東四朗', hint: '電線にとまってるスズメの歌', icon: '🐦'
  },

  // 漫才
  {
    id: 'showa-23', type: 'showa_gag',
    content: '小さなことからコツコツと',
    speakText: 'ちいさなことから、コツコツとっ！',
    performer: '西川きよし', hint: '座右の銘', icon: '👁️'
  },

  // ビートたけし
  {
    id: 'showa-24', type: 'showa_gag',
    content: 'コマネチ！',
    speakText: 'コマネチッ！',
    performer: 'ビートたけし', hint: 'ルーマニアの体操選手から', icon: '🤸'
  },
  {
    id: 'showa-25', type: 'showa_gag',
    content: '赤信号、みんなで渡れば怖くない',
    speakText: 'あかしんごう、みんなでわたれば、こわくないっ！',
    performer: 'ビートたけし', hint: 'ツービートの漫才', icon: '🚦'
  },

  // 志村けん
  {
    id: 'showa-30', type: 'showa_gag',
    content: 'だいじょうぶだぁ',
    speakText: 'だいじょうぶだぁーーー',
    performer: '志村けん', hint: '変なおじさんの後で', icon: '👍'
  },
];

// ======================================
// ② ボケとツッコミ（親子で楽しめる健全なもの）
// ======================================
export const BOKE_TSUKKOMI: ComedyContent[] = [
  {
    id: 'bt-4',
    type: 'boke_tsukkomi',
    content: '',
    setup: '天気の話',
    boke: '「今日は雨降るかな？」「傘を持っていけば降らないし、持っていかなければ降る」',
    tsukkomi: '「マーフィーの法則か！」',
    icon: '☔'
  },
  {
    id: 'bt-5',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'お買い物で',
    boke: '「このりんご、いくらですか？」「1個100円です」「じゃあ2個で50円にしてください」',
    tsukkomi: '「値切り方おかしいやろ！増えてるわ！」',
    icon: '🍎'
  },
  {
    id: 'bt-7',
    type: 'boke_tsukkomi',
    content: '',
    setup: '道を聞かれて',
    boke: '「駅はどっちですか？」「あっちです」「あっちってどっち？」「こっちの反対です」',
    tsukkomi: '「わからんわ！」',
    icon: '🚉'
  },
  {
    id: 'bt-9',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'ダイエット中',
    boke: '「ダイエット中なんです」「じゃあケーキはダメですね」「大丈夫、食べなかったことにするから」',
    tsukkomi: '「カロリーはそういうシステムちゃうねん！」',
    icon: '🍰'
  },
  {
    id: 'bt-13',
    type: 'boke_tsukkomi',
    content: '',
    setup: '早起きして',
    boke: '「早起きは三文の徳って言うよね」「うん」「でも三文って今のお金で何円？」「30円くらいかな」「寝るわ」',
    tsukkomi: '「安すぎて諦めるな！」',
    icon: '🌅'
  },
  {
    id: 'bt-15',
    type: 'boke_tsukkomi',
    content: '',
    setup: '自己紹介で',
    boke: '「趣味は読書です。最近読んだ本は...あ、タイトル忘れました」',
    tsukkomi: '「趣味ちゃうやろそれ！」',
    icon: '📖'
  },
  {
    id: 'bt-17',
    type: 'boke_tsukkomi',
    content: '',
    setup: '占い師に',
    boke: '「私の将来を占ってください」「あなたは...お金持ちになります」「いつですか？」「それは分かりません」',
    tsukkomi: '「一番大事なとこやないか！」',
    icon: '🔮'
  },
  {
    id: 'bt-19',
    type: 'boke_tsukkomi',
    content: '',
    setup: '映画館で',
    boke: '「この映画、ネタバレしないでね」「OK。でもタイトルで犯人わかるやつだよ」',
    tsukkomi: '「それネタバレやないか！」',
    icon: '🎬'
  },

  // ========== レストラン・食事シーン ==========
  {
    id: 'bt-20', type: 'boke_tsukkomi', content: '',
    setup: 'レストランで',
    boke: '「すみません、このパスタ、もう少し長くできますか？」',
    tsukkomi: '「麺の長さは調整できません！」',
    icon: '🍝'
  },

  // ========== 学校・勉強シーン ==========
  {
    id: 'bt-30', type: 'boke_tsukkomi', content: '',
    setup: '算数の授業で',
    boke: '「1+1は？」「田んぼの田！」',
    tsukkomi: '「漢字の問題ちゃうわ！」',
    icon: '📐'
  },
  {
    id: 'bt-37', type: 'boke_tsukkomi', content: '',
    setup: '体育の授業で',
    boke: '「50メートル走、何秒だった？」「えーと...50メートル」',
    tsukkomi: '「秒を聞いてるねん！」',
    icon: '🏃'
  },

  // ========== 家族の日常シーン ==========
  {
    id: 'bt-41', type: 'boke_tsukkomi', content: '',
    setup: 'お風呂で',
    boke: '「お父さん、背中流して」「はいよ」「...お父さん、それ前」',
    tsukkomi: '「ごめん」',
    icon: '🛁'
  },
  {
    id: 'bt-44', type: 'boke_tsukkomi', content: '',
    setup: '晩ご飯の時',
    boke: '「今日のご飯何？」「カレー」「昨日もカレー」「だって残ってるから」「明日は？」「カレー」',
    tsukkomi: '「いつまで続くねん！」',
    icon: '🍛'
  },
  {
    id: 'bt-47', type: 'boke_tsukkomi', content: '',
    setup: 'ゲーム中',
    boke: '「何回死んだ？」「数えてない」「何時間やってる？」「数えてない」「宿題は？」「...数えてない」',
    tsukkomi: '「宿題は数えるもんちゃうわ！」',
    icon: '🎮'
  },

  // ========== 買い物シーン ==========
  {
    id: 'bt-50', type: 'boke_tsukkomi', content: '',
    setup: '洋服屋で',
    boke: '「このシャツ、他の色ありますか？」「白と黒があります」「じゃあグレーで」',
    tsukkomi: '「混ぜようとすな！」',
    icon: '👕'
  },
  {
    id: 'bt-51', type: 'boke_tsukkomi', content: '',
    setup: '靴屋で',
    boke: '「26cmありますか？」「はい」「じゃあ左だけください」',
    tsukkomi: '「両方買えや！」',
    icon: '👟'
  },
  {
    id: 'bt-52', type: 'boke_tsukkomi', content: '',
    setup: '本屋で',
    boke: '「この本おもしろいですか？」「読んでみないと...」「じゃあ読みます」「買ってからね」「立ち読みで」',
    tsukkomi: '「買ってから読め！」',
    icon: '📗'
  },
  // ========== 乗り物・移動シーン ==========
  {
    id: 'bt-61', type: 'boke_tsukkomi', content: '',
    setup: '電車で',
    boke: '「この電車どこ行き？」「新宿です」「大阪行きたいんやけど」「乗り換えですね」「乗り換えは苦手で」',
    tsukkomi: '「じゃあ歩けや！」',
    icon: '🚃'
  },
  {
    id: 'bt-67', type: 'boke_tsukkomi', content: '',
    setup: '船着き場で',
    boke: '「船酔いしますか？」「たまに」「じゃあ今日は？」「乗ってみないと」「乗らずにわかります？」',
    tsukkomi: '「無理に決まってるやろ！」',
    icon: '⛴️'
  },
  {
    id: 'bt-68', type: 'boke_tsukkomi', content: '',
    setup: 'エレベーターで',
    boke: '「何階ですか？」「3階」「...ここ3階ですよ」「じゃあ降ります」',
    tsukkomi: '「最初から乗るな！」',
    icon: '🛗'
  },

  // ========== 病院・健康シーン ==========
  {
    id: 'bt-71', type: 'boke_tsukkomi', content: '',
    setup: '歯医者で',
    boke: '「痛かったら手を上げてください」「はい」「まだ何もしてません」「予防です」',
    tsukkomi: '「早すぎるわ！」',
    icon: '🦷'
  },
  {
    id: 'bt-73', type: 'boke_tsukkomi', content: '',
    setup: '健康診断で',
    boke: '「最近運動してますか？」「してます」「何を？」「指」',
    tsukkomi: '「スマホいじってるだけやろ！」',
    icon: '🩺'
  },
  {
    id: 'bt-75', type: 'boke_tsukkomi', content: '',
    setup: '注射の前に',
    boke: '「ちょっとチクッとしますよ」「無理です」「まだ何も」「想像しただけで」',
    tsukkomi: '「覚悟決めろや！」',
    icon: '💉'
  },
  {
    id: 'bt-79', type: 'boke_tsukkomi', content: '',
    setup: 'ドラッグストアで',
    boke: '「風邪薬ください」「症状は？」「まだ風邪じゃないです」「...じゃあいらないのでは」「予防です」',
    tsukkomi: '「予防で薬飲むな！」',
    icon: '🏪'
  },

  // ========== 仕事・職場シーン ==========
  {
    id: 'bt-80', type: 'boke_tsukkomi', content: '',
    setup: '面接で',
    boke: '「長所は？」「短所がないことです」',
    tsukkomi: '「それが短所や！」',
    icon: '💼'
  },
  {
    id: 'bt-87', type: 'boke_tsukkomi', content: '',
    setup: 'ランチタイム',
    boke: '「今日何食べる？」「なんでもいい」「じゃあラーメン」「ラーメン以外で」「うどん」「うどん以外で」',
    tsukkomi: '「なんでもよくないやん！」',
    icon: '🍴'
  },
  {
    id: 'bt-88', type: 'boke_tsukkomi', content: '',
    setup: '朝礼で',
    boke: '「今日の目標は？」「定時退社」',
    tsukkomi: '「仕事の目標言えや！」',
    icon: '🏢'
  },

  // ========== スポーツ・趣味シーン ==========
  {
    id: 'bt-91', type: 'boke_tsukkomi', content: '',
    setup: 'サッカーで',
    boke: '「シュート打て！」「どこに？」「ゴールに！」「どっちの？」',
    tsukkomi: '「相手のに決まってるやろ！」',
    icon: '⚽'
  },
  {
    id: 'bt-92', type: 'boke_tsukkomi', content: '',
    setup: 'ゴルフ場で',
    boke: '「ナイスショット！」「どこ飛んだ？」「見てなかった」',
    tsukkomi: '「見てから言えや！」',
    icon: '⛳'
  },
  {
    id: 'bt-96', type: 'boke_tsukkomi', content: '',
    setup: '釣りで',
    boke: '「何が釣れた？」「ゴミ」「魚は？」「ゴミしか釣れん」',
    tsukkomi: '「場所変えろや！」',
    icon: '🎣'
  },

  // ========== 季節・イベントシーン ==========
  {
    id: 'bt-100', type: 'boke_tsukkomi', content: '',
    setup: 'お正月',
    boke: '「今年の抱負は？」「去年と同じ」「去年何やった？」「覚えてない」',
    tsukkomi: '「意味ないやん！」',
    icon: '🎍'
  },

  // ========== 動物・ペットシーン ==========
  {
    id: 'bt-110', type: 'boke_tsukkomi', content: '',
    setup: '犬を飼って',
    boke: '「犬の名前何？」「ネコ」',
    tsukkomi: '「ややこしいわ！」',
    icon: '🐕'
  },
  {
    id: 'bt-117', type: 'boke_tsukkomi', content: '',
    setup: '亀を飼って',
    boke: '「亀って何年生きる？」「100年くらい」「え、自分より長いやん」「飼い主引き継ぎやな」',
    tsukkomi: '「ペットに飼われてるみたいや！」',
    icon: '🐢'
  },

  // ========== その他の日常シーン ==========
  {
    id: 'bt-121', type: 'boke_tsukkomi', content: '',
    setup: '時計を見て',
    boke: '「今何時？」「短い針が3で長い針が12」「...何時やねん」「3時」',
    tsukkomi: '「最初から言えや！」',
    icon: '⏰'
  },
  {
    id: 'bt-125', type: 'boke_tsukkomi', content: '',
    setup: 'かくれんぼで',
    boke: '「もういいかい？」「まあだだよ」「...」「もういいよ」「どこ？」「ここ！見えてるやん！」',
    tsukkomi: '「隠れてないやん！隠れろよ！」',
    icon: '🙈'
  },
];

// ======================================
// ③ 平成ギャグ（1989-2019）
// ======================================
export const HEISEI_GAGS: ComedyContent[] = [
  // ダンディ坂野
  {
    id: 'heisei-5', type: 'heisei_gag',
    content: 'ゲッツ！',
    speakText: 'ゲッツ！！',
    performer: 'ダンディ坂野', hint: '指を立てて', icon: '👉'
  },

  // テツandトモ
  {
    id: 'heisei-7', type: 'heisei_gag',
    content: 'なんでだろう〜',
    speakText: 'なんでだろー、なんでだろー、なんでだなんでだろー',
    performer: 'テツandトモ', hint: 'ジャージ姿で', icon: '🤷'
  },

  // とにかく明るい安村
  {
    id: 'heisei-20', type: 'heisei_gag',
    content: '安心してください、穿いてますよ',
    speakText: 'あんしんしてください、はいてますよ',
    performer: 'とにかく明るい安村', hint: '裸に見えるポーズ', icon: '😌'
  },

  // オードリー春日
  {
    id: 'heisei-21', type: 'heisei_gag',
    content: 'トゥース！',
    speakText: 'トゥーース！',
    performer: 'オードリー春日', hint: '胸を張って', icon: '💪'
  },

  // ブルゾンちえみ
  {
    id: 'heisei-23', type: 'heisei_gag',
    content: '35億',
    speakText: 'さんじゅうごおく',
    performer: 'ブルゾンちえみ', hint: '地球上の男の数', icon: '🌍'
  },

  // 平野ノラ
  {
    id: 'heisei-25', type: 'heisei_gag',
    content: 'おったまげー！',
    speakText: 'おったまげーーー！',
    performer: '平野ノラ', hint: 'バブリーに', icon: '📞'
  },
];

// ======================================
// ④ 令和ギャグ（2019-現在）
// ======================================
export const REIWA_GAGS: ComedyContent[] = [
  // ぺこぱ
  {
    id: 'reiwa-1', type: 'reiwa_gag',
    content: '時を戻そう',
    speakText: 'ときをもどそう',
    performer: 'ぺこぱ', hint: 'ノリツッコまないボケ', icon: '⏪'
  },
  // バッテリィズ
  {
    id: 'reiwa-20', type: 'reiwa_gag',
    content: 'ちょっと何言ってるかわかんない',
    speakText: 'ちょっとなにゆってるかわかんない',
    performer: 'バッテリィズ', hint: '困惑した時に', icon: '❓'
  },
];

// 全お笑いコンテンツ
export const ALL_COMEDY: ComedyContent[] = [
  ...SHOWA_GAGS,
  ...HEISEI_GAGS,
  ...REIWA_GAGS,
  ...BOKE_TSUKKOMI,
];

/**
 * ランダムな昭和ギャグを取得
 */
export function getRandomShowaGag(): ComedyContent {
  const index = Math.floor(Math.random() * SHOWA_GAGS.length);
  return SHOWA_GAGS[index];
}

/**
 * ランダムなボケツッコミを取得
 */
export function getRandomBokeTsukkomi(): ComedyContent {
  const index = Math.floor(Math.random() * BOKE_TSUKKOMI.length);
  return BOKE_TSUKKOMI[index];
}

/**
 * ランダムな平成ギャグを取得
 */
export function getRandomHeiseiGag(): ComedyContent {
  const index = Math.floor(Math.random() * HEISEI_GAGS.length);
  return HEISEI_GAGS[index];
}

/**
 * ランダムな令和ギャグを取得
 */
export function getRandomReiwaGag(): ComedyContent {
  const index = Math.floor(Math.random() * REIWA_GAGS.length);
  return REIWA_GAGS[index];
}

/**
 * ランダムなお笑いコンテンツを取得（全カテゴリーから）
 */
export function getRandomComedy(): ComedyContent {
  const categories = [SHOWA_GAGS, HEISEI_GAGS, REIWA_GAGS, BOKE_TSUKKOMI];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const index = Math.floor(Math.random() * category.length);
  return category[index];
}

/**
 * カテゴリーラベルを取得
 */
export function getComedyTypeLabel(type: ComedyType): string {
  switch (type) {
    case 'showa_gag': return '昭和ギャグ';
    case 'heisei_gag': return '平成ギャグ';
    case 'reiwa_gag': return '令和ギャグ';
    case 'boke_tsukkomi': return 'ボケとツッコミ';
  }
}

/**
 * カテゴリーアイコンを取得
 */
export function getComedyTypeIcon(type: ComedyType): string {
  switch (type) {
    case 'showa_gag': return '📺';
    case 'heisei_gag': return '📱';
    case 'reiwa_gag': return '🎭';
    case 'boke_tsukkomi': return '🎤';
  }
}
