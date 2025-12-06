// ======================================
// お笑いマスデータ
// 「昭和ギャグ」「ボケとツッコミ」「だじゃれ」「逆さ言葉」の4種類
// ======================================

export type ComedyType = 'showa_gag' | 'boke_tsukkomi' | 'dajare' | 'sakasa_kotoba';

export interface ComedyContent {
  id: string;
  type: ComedyType;
  content: string;           // メインのコンテンツ（ギャグ、だじゃれなど）
  performer?: string;        // 芸人名（昭和ギャグの場合）
  setup?: string;            // ボケの前振り（ボケツッコミの場合）
  boke?: string;             // ボケ（ボケツッコミの場合）
  tsukkomi?: string;         // ツッコミ（ボケツッコミの場合）
  answer?: string;           // 答え（逆さ言葉の場合）
  hint?: string;             // ヒント
  icon: string;
}

// ======================================
// ① 昭和ギャグ（懐かしの名ギャグ）
// ======================================
export const SHOWA_GAGS: ComedyContent[] = [
  // ドリフターズ
  { id: 'showa-1', type: 'showa_gag', content: 'だめだこりゃ', performer: 'いかりや長介', hint: '志村けんのボケに対して', icon: '🎭' },
  { id: 'showa-2', type: 'showa_gag', content: '最初はグー！じゃんけんポン！', performer: '志村けん', hint: 'じゃんけんの掛け声を発明', icon: '✊' },
  { id: 'showa-3', type: 'showa_gag', content: 'ちょっとだけよ〜、あんたも好きね〜', performer: '加藤茶', hint: 'タブー（曲）に合わせて', icon: '💃' },
  { id: 'showa-4', type: 'showa_gag', content: 'カラスの勝手でしょ〜', performer: '志村けん', hint: '童謡「七つの子」の替え歌', icon: '🐦‍⬛' },
  { id: 'showa-5', type: 'showa_gag', content: 'アイーン', performer: '志村けん', hint: '手をあごに当てて', icon: '🤪' },
  { id: 'showa-6', type: 'showa_gag', content: 'ヒゲダンス', performer: 'ドリフターズ', hint: 'テディペンダーグラスの曲に合わせて', icon: '🕺' },

  // 欽ちゃん
  { id: 'showa-7', type: 'showa_gag', content: 'なんでそうなるの！', performer: '萩本欽一', hint: '相方のボケに対して', icon: '😤' },

  // コント55号
  { id: 'showa-8', type: 'showa_gag', content: '飛びます飛びます', performer: '坂上二郎', hint: '両手を広げて', icon: '✈️' },

  // 植木等
  { id: 'showa-9', type: 'showa_gag', content: 'お呼びでない？...こりゃまた失礼しました！', performer: '植木等', hint: 'シャボン玉ホリデーにて', icon: '🎩' },
  { id: 'showa-10', type: 'showa_gag', content: 'わかっちゃいるけどやめられない', performer: '植木等', hint: 'スーダラ節より', icon: '🎵' },

  // てんぷくトリオ
  { id: 'showa-11', type: 'showa_gag', content: 'びっくりしたなぁ、もう！', performer: '三波伸介', hint: '驚いた時に', icon: '😲' },

  // 東京ぼん太
  { id: 'showa-12', type: 'showa_gag', content: 'あたり前田のクラッカー', performer: '藤田まこと', hint: '前田製菓のCMから', icon: '🎉' },

  // 国定忠治
  { id: 'showa-13', type: 'showa_gag', content: '赤城の山も今夜限り', performer: '国定忠治', hint: '講談の名セリフ', icon: '🏔️' },

  // コメディアン
  { id: 'showa-14', type: 'showa_gag', content: 'あっと驚く為五郎', performer: 'ハナ肇', hint: '巨泉×前武ゲバゲバ90分にて', icon: '😱' },
  { id: 'showa-15', type: 'showa_gag', content: 'ガチョーン', performer: '谷啓', hint: '手を合わせて後ろに', icon: '🙌' },

  // 由利徹
  { id: 'showa-16', type: 'showa_gag', content: 'オシャマンベ', performer: '由利徹', hint: '北海道の地名をもじって', icon: '🦀' },

  // 小松政夫
  { id: 'showa-17', type: 'showa_gag', content: 'しらけ鳥飛んでいく〜', performer: '小松政夫', hint: '場がしらけた時に歌う', icon: '🐤' },
  { id: 'showa-18', type: 'showa_gag', content: '電線音頭', performer: '小松政夫・伊東四朗', hint: '電線にとまってるスズメの歌', icon: '🐦' },

  // 林家三平
  { id: 'showa-19', type: 'showa_gag', content: 'どうもすいません', performer: '林家三平', hint: '噺家の決め台詞', icon: '🙇' },

  // ケーシー高峰
  { id: 'showa-20', type: 'showa_gag', content: '医学漫談', performer: 'ケーシー高峰', hint: '白衣を着て黒板で解説', icon: '👨‍⚕️' },

  // 牧伸二
  { id: 'showa-21', type: 'showa_gag', content: 'あ〜あ、やんなっちゃった', performer: '牧伸二', hint: 'ウクレレを弾きながら', icon: '🎸' },

  // 漫才
  { id: 'showa-22', type: 'showa_gag', content: 'もうええわ', performer: '横山やすし', hint: '西川きよしとの漫才で', icon: '🤝' },
  { id: 'showa-23', type: 'showa_gag', content: '小さなことからコツコツと', performer: '西川きよし', hint: '座右の銘', icon: '👁️' },

  // 他
  { id: 'showa-24', type: 'showa_gag', content: 'コマネチ！', performer: 'ビートたけし', hint: 'ルーマニアの体操選手から', icon: '🤸' },
  { id: 'showa-25', type: 'showa_gag', content: '赤信号、みんなで渡れば怖くない', performer: 'ビートたけし', hint: 'ツービートの漫才', icon: '🚦' },
];

// ======================================
// ② ボケとツッコミ（親子で楽しめる健全なもの）
// ======================================
export const BOKE_TSUKKOMI: ComedyContent[] = [
  {
    id: 'bt-1',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'カレンダーを見ながら',
    boke: '「今日は何曜日だっけ？」「金曜日だよ」「えー！お金もらえるの？」',
    tsukkomi: '「曜日の金やないか！」',
    icon: '📅'
  },
  {
    id: 'bt-2',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'レストランにて',
    boke: '「すみません、お水ください」「お冷やでよろしいですか？」「いえ、普通の温度で」',
    tsukkomi: '「お冷やは冷たい水のことやないか！」',
    icon: '🍽️'
  },
  {
    id: 'bt-3',
    type: 'boke_tsukkomi',
    content: '',
    setup: '算数の授業で',
    boke: '「1+1は？」「田んぼの田！」',
    tsukkomi: '「漢字の問題ちゃうわ！」',
    icon: '📝'
  },
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
    id: 'bt-6',
    type: 'boke_tsukkomi',
    content: '',
    setup: '電話にて',
    boke: '「もしもし、田中ですけど」「はい、もしもし」「あ、もしもし」「はい」「もしもし」',
    tsukkomi: '「いつまでもしもし言うとんねん！」',
    icon: '📞'
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
    id: 'bt-8',
    type: 'boke_tsukkomi',
    content: '',
    setup: '時計を見ながら',
    boke: '「今何時？」「えーと、短い針が3で、長い針が12だから...」「3時でしょ」「あ、答え言わんといて！」',
    tsukkomi: '「クイズちゃうねん！」',
    icon: '⏰'
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
    id: 'bt-10',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'お寿司屋さんで',
    boke: '「大将、今日のおすすめは？」「マグロがいいですよ」「じゃあサーモンで」',
    tsukkomi: '「聞いた意味！」',
    icon: '🍣'
  },
  {
    id: 'bt-11',
    type: 'boke_tsukkomi',
    content: '',
    setup: '迷子センターで',
    boke: '「迷子のお知らせです。お母さんを探しています」',
    tsukkomi: '「逆！子どもを探すんやろ！」',
    icon: '📢'
  },
  {
    id: 'bt-12',
    type: 'boke_tsukkomi',
    content: '',
    setup: '試験前',
    boke: '「明日テストだけど全然勉強してない」「じゃあ今からやれば？」「いや、今からやっても間に合わないし」',
    tsukkomi: '「何もせんより100倍マシやろ！」',
    icon: '📚'
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
    id: 'bt-14',
    type: 'boke_tsukkomi',
    content: '',
    setup: 'カフェにて',
    boke: '「ホットコーヒーをアイスで」',
    tsukkomi: '「それはアイスコーヒーや！」',
    icon: '☕'
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
    id: 'bt-16',
    type: 'boke_tsukkomi',
    content: '',
    setup: '運動会で',
    boke: '「よーい、ドン！」（全員座る）',
    tsukkomi: '「丼ちゃう！走れ！」',
    icon: '🏃'
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
    id: 'bt-18',
    type: 'boke_tsukkomi',
    content: '',
    setup: '英語の授業で',
    boke: '「This is a pen を訳しなさい」「これはペンです」「正解！じゃあ使い道は？」「書くことです」',
    tsukkomi: '「そこは問題に入ってへんわ！」',
    icon: '🖊️'
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
  {
    id: 'bt-20',
    type: 'boke_tsukkomi',
    content: '',
    setup: '野球観戦で',
    boke: '「今の審判、目が悪いんじゃない？」「メガネかけてるよ」「ほら、やっぱり目が悪い」',
    tsukkomi: '「理屈としてはそうやけど！」',
    icon: '⚾'
  },
];

// ======================================
// ③ だじゃれ（センスの良いもの）
// ======================================
export const DAJARE: ComedyContent[] = [
  { id: 'dj-1', type: 'dajare', content: '布団が吹っ飛んだ', hint: 'ふとん → ふっとんだ', icon: '🛏️' },
  { id: 'dj-2', type: 'dajare', content: 'アルミ缶の上にあるみかん', hint: 'アルミ缶 → あるみかん', icon: '🍊' },
  { id: 'dj-3', type: 'dajare', content: 'イカが怒った、イカった！', hint: 'イカ → 怒った（いかった）', icon: '🦑' },
  { id: 'dj-4', type: 'dajare', content: 'トイレにいっトイレ', hint: 'トイレ → 行っといれ', icon: '🚻' },
  { id: 'dj-5', type: 'dajare', content: 'カレーは辛いだけに、華麗だ', hint: 'カレー → 華麗', icon: '🍛' },
  { id: 'dj-6', type: 'dajare', content: 'スイカは安いか？', hint: 'スイカ → 安いか', icon: '🍉' },
  { id: 'dj-7', type: 'dajare', content: '猫が寝転んだ', hint: 'ねこ → ねころんだ', icon: '🐱' },
  { id: 'dj-8', type: 'dajare', content: '電話には誰も出んわ', hint: 'でんわ → 出んわ', icon: '📞' },
  { id: 'dj-9', type: 'dajare', content: 'コーディネートはこーでねーと', hint: 'コーディネート → こうでないと', icon: '👔' },
  { id: 'dj-10', type: 'dajare', content: '内臓がないぞう', hint: 'ないぞう → ないぞう', icon: '🐘' },
  { id: 'dj-11', type: 'dajare', content: 'ラクダはとても楽だ', hint: 'ラクダ → 楽だ', icon: '🐫' },
  { id: 'dj-12', type: 'dajare', content: '傘がない、貸さない？', hint: 'かさ → 貸さ', icon: '☂️' },
  { id: 'dj-13', type: 'dajare', content: 'ダンスはだんだん上達す', hint: 'ダンス → だんだん〜す', icon: '💃' },
  { id: 'dj-14', type: 'dajare', content: 'パンダがパンだけ食べた', hint: 'パンダ → パンだ', icon: '🐼' },
  { id: 'dj-15', type: 'dajare', content: 'このイスいいっすね', hint: 'イス → いいっす', icon: '🪑' },
  { id: 'dj-16', type: 'dajare', content: 'メロンが目論んでいる', hint: 'メロン → 目論（もくろ）む', icon: '🍈' },
  { id: 'dj-17', type: 'dajare', content: '靴下を暗い靴屋で買った', hint: 'くつした → くつや → くらい', icon: '🧦' },
  { id: 'dj-18', type: 'dajare', content: '梨を無しにしないで', hint: 'なし → 無し', icon: '🍐' },
  { id: 'dj-19', type: 'dajare', content: 'レモンはどれもん？', hint: 'レモン → どれもん（どれ？）', icon: '🍋' },
  { id: 'dj-20', type: 'dajare', content: 'トマトを取ると、真っ赤になっとまと', hint: 'トマト → とまと', icon: '🍅' },
  { id: 'dj-21', type: 'dajare', content: 'おかゆをお粥いしく食べる', hint: 'おかゆ → おいしく', icon: '🍚' },
  { id: 'dj-22', type: 'dajare', content: 'イルカがいるか？', hint: 'イルカ → いるか', icon: '🐬' },
  { id: 'dj-23', type: 'dajare', content: 'カモがネギを背負ってきた、カモがネギしょってきた', hint: 'カモネギ', icon: '🦆' },
  { id: 'dj-24', type: 'dajare', content: '馬が走ってウマくいった', hint: 'うま → うまく', icon: '🐴' },
  { id: 'dj-25', type: 'dajare', content: 'サルが去る', hint: 'サル → 去る', icon: '🐵' },
  { id: 'dj-26', type: 'dajare', content: 'クマが来ると困まる', hint: 'クマ → こまる', icon: '🐻' },
  { id: 'dj-27', type: 'dajare', content: 'タイで鯛を食べたい', hint: 'タイ → たい', icon: '🐟' },
  { id: 'dj-28', type: 'dajare', content: 'カニを見かにいく', hint: 'カニ → 見かに（見に）', icon: '🦀' },
  { id: 'dj-29', type: 'dajare', content: 'サイを見ていいですか？いいですよ、どうサイ', hint: 'サイ → どうぞ', icon: '🦏' },
  { id: 'dj-30', type: 'dajare', content: 'シカたがないね', hint: 'シカ → しかたがない', icon: '🦌' },
];

// ======================================
// ④ 逆さ言葉（回文・アナグラム）
// ======================================
export const SAKASA_KOTOBA: ComedyContent[] = [
  // 回文（前から読んでも後ろから読んでも同じ）
  { id: 'sk-1', type: 'sakasa_kotoba', content: '「たけやぶやけた」', answer: 'たけやぶやけた', hint: '竹藪焼けた', icon: '🎋' },
  { id: 'sk-2', type: 'sakasa_kotoba', content: '「しんぶんし」', answer: 'しんぶんし', hint: '新聞紙', icon: '📰' },
  { id: 'sk-3', type: 'sakasa_kotoba', content: '「よのなかばかなのよ」', answer: 'よのなかばかなのよ', hint: '世の中バカなのよ', icon: '🌍' },
  { id: 'sk-4', type: 'sakasa_kotoba', content: '「わたしまけましたわ」', answer: 'わたしまけましたわ', hint: '私負けましたわ', icon: '😢' },
  { id: 'sk-5', type: 'sakasa_kotoba', content: '「たいやきやいた」', answer: 'たいやきやいた', hint: 'たい焼き焼いた', icon: '🐟' },
  { id: 'sk-6', type: 'sakasa_kotoba', content: '「とまと」', answer: 'とまと', hint: 'トマト', icon: '🍅' },
  { id: 'sk-7', type: 'sakasa_kotoba', content: '「きつつき」', answer: 'きつつき', hint: 'キツツキ', icon: '🐦' },
  { id: 'sk-8', type: 'sakasa_kotoba', content: '「しかし」', answer: 'しかし', hint: 'しかし（接続詞）', icon: '📝' },
  { id: 'sk-9', type: 'sakasa_kotoba', content: '「るする』', answer: 'るする', hint: 'ルスル（留守る）', icon: '🏠' },
  { id: 'sk-10', type: 'sakasa_kotoba', content: '「いかたべたかい」', answer: 'いかたべたかい', hint: 'イカ食べたかい？', icon: '🦑' },
  { id: 'sk-11', type: 'sakasa_kotoba', content: '「ながきよのとおのねふりのみなめさめ」', answer: 'ながきよのとおのねふりのみなめさめ', hint: '長き夜の遠の眠りの皆目覚め（七福神の回文）', icon: '⛩️' },
  { id: 'sk-12', type: 'sakasa_kotoba', content: '「まさかさかさま」', answer: 'まさかさかさま', hint: 'まさか逆さま', icon: '🙃' },
  { id: 'sk-13', type: 'sakasa_kotoba', content: '「すきやきやきす」', answer: 'すきやきやきす', hint: 'すき焼き焼きす', icon: '🍲' },
  { id: 'sk-14', type: 'sakasa_kotoba', content: '「にわのわに」', answer: 'にわのわに', hint: '庭のワニ', icon: '🐊' },
  { id: 'sk-15', type: 'sakasa_kotoba', content: '「いかにもかもにかい」', answer: 'いかにもかもにかい', hint: '如何にも鴨に貝', icon: '🦆' },

  // 面白い言葉遊び
  { id: 'sk-16', type: 'sakasa_kotoba', content: '「ねこ」を逆から読むと？', answer: 'こね（子猫みたい）', hint: 'ネコ → コネ', icon: '🐱' },
  { id: 'sk-17', type: 'sakasa_kotoba', content: '「イス」を逆から読むと？', answer: 'すい（水みたい）', hint: 'イス → スイ', icon: '🪑' },
  { id: 'sk-18', type: 'sakasa_kotoba', content: '「カバ」を逆から読むと？', answer: 'バカ', hint: 'カバ → バカ', icon: '🦛' },
  { id: 'sk-19', type: 'sakasa_kotoba', content: '「サル」を逆から読むと？', answer: 'ルサ（露差？）', hint: 'サル → ルサ', icon: '🐵' },
  { id: 'sk-20', type: 'sakasa_kotoba', content: '「ナス」を逆から読むと？', answer: 'スナ（砂）', hint: 'ナス → スナ', icon: '🍆' },
  { id: 'sk-21', type: 'sakasa_kotoba', content: '「クマ」を逆から読むと？', answer: 'マク（幕）', hint: 'クマ → マク', icon: '🐻' },
  { id: 'sk-22', type: 'sakasa_kotoba', content: '「タイ」を逆から読むと？', answer: 'イタ（板）', hint: 'タイ → イタ', icon: '🐟' },
  { id: 'sk-23', type: 'sakasa_kotoba', content: '「シカ」を逆から読むと？', answer: 'カシ（樫・菓子）', hint: 'シカ → カシ', icon: '🦌' },
  { id: 'sk-24', type: 'sakasa_kotoba', content: '「カメ」を逆から読むと？', answer: 'メカ', hint: 'カメ → メカ', icon: '🐢' },
  { id: 'sk-25', type: 'sakasa_kotoba', content: '「ワニ」を逆から読むと？', answer: 'ニワ（庭）', hint: 'ワニ → ニワ', icon: '🐊' },
];

// 全お笑いコンテンツ
export const ALL_COMEDY: ComedyContent[] = [
  ...SHOWA_GAGS,
  ...BOKE_TSUKKOMI,
  ...DAJARE,
  ...SAKASA_KOTOBA,
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
 * ランダムなだじゃれを取得
 */
export function getRandomDajare(): ComedyContent {
  const index = Math.floor(Math.random() * DAJARE.length);
  return DAJARE[index];
}

/**
 * ランダムな逆さ言葉を取得
 */
export function getRandomSakasaKotoba(): ComedyContent {
  const index = Math.floor(Math.random() * SAKASA_KOTOBA.length);
  return SAKASA_KOTOBA[index];
}

/**
 * ランダムなお笑いコンテンツを取得（全カテゴリーから）
 */
export function getRandomComedy(): ComedyContent {
  const categories = [SHOWA_GAGS, BOKE_TSUKKOMI, DAJARE, SAKASA_KOTOBA];
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
    case 'boke_tsukkomi': return 'ボケとツッコミ';
    case 'dajare': return 'だじゃれ';
    case 'sakasa_kotoba': return '逆さ言葉';
  }
}

/**
 * カテゴリーアイコンを取得
 */
export function getComedyTypeIcon(type: ComedyType): string {
  switch (type) {
    case 'showa_gag': return '📺';
    case 'boke_tsukkomi': return '🎭';
    case 'dajare': return '😂';
    case 'sakasa_kotoba': return '🔄';
  }
}
