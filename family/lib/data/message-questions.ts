// ======================================
// メッセージマスデータ
// 「ひと言しつもん」と「あなたへのメッセージ」の2種類
// ======================================

export type MessageType = 'question' | 'message';

export interface MessageQuestion {
  id: string;
  content: string;           // 質問文またはメッセージ
  type: MessageType;         // 'question' = ひと言しつもん, 'message' = あなたへのメッセージ
  category: 'feeling' | 'memory' | 'dream' | 'gratitude' | 'fun';
  icon: string;
}

// ======================================
// ひと言しつもん（回答を求める質問形式）
// ======================================
export const QUESTIONS: MessageQuestion[] = [
  // 気持ち系
  { id: 'q-feel-1', content: '今日はどんな気分？', type: 'question', category: 'feeling', icon: '😊' },
  { id: 'q-feel-2', content: '最近うれしかったことは？', type: 'question', category: 'feeling', icon: '🥰' },
  { id: 'q-feel-3', content: '今、一番楽しみにしていることは？', type: 'question', category: 'feeling', icon: '✨' },
  { id: 'q-feel-4', content: '今日のごはん、何が食べたい？', type: 'question', category: 'feeling', icon: '🍽️' },
  { id: 'q-feel-5', content: '今の気持ちを色で表すと何色？', type: 'question', category: 'feeling', icon: '🎨' },
  { id: 'q-feel-11', content: '今、一番会いたい人は誰？', type: 'question', category: 'feeling', icon: '💭' },
  { id: 'q-feel-12', content: '朝起きた時、最初に思うことは？', type: 'question', category: 'feeling', icon: '🌅' },
  { id: 'q-feel-14', content: '最近、泣くほど感動したことある？', type: 'question', category: 'feeling', icon: '🥹' },
  { id: 'q-feel-15', content: '今の気持ちを天気で表すと？', type: 'question', category: 'feeling', icon: '⛅' },
  { id: 'q-feel-17', content: '元気が出る言葉は何？', type: 'question', category: 'feeling', icon: '💪' },
  { id: 'q-feel-18', content: '最近、ドキドキしたことは？', type: 'question', category: 'feeling', icon: '💓' },
  { id: 'q-feel-22', content: '今、何パーセントくらい元気？', type: 'question', category: 'feeling', icon: '📊' },
  { id: 'q-feel-24', content: '最近の「小さな幸せ」は何？', type: 'question', category: 'feeling', icon: '🌼' },
  { id: 'q-feel-25', content: 'ぐっすり眠れてる？', type: 'question', category: 'feeling', icon: '😴' },

  // 思い出系
  { id: 'q-mem-1', content: '家族との一番の思い出は？', type: 'question', category: 'memory', icon: '📸' },
  { id: 'q-mem-2', content: '最近行った楽しい場所は？', type: 'question', category: 'memory', icon: '🗺️' },
  { id: 'q-mem-3', content: '子どもの頃の夢は何だった？', type: 'question', category: 'memory', icon: '👒' },
  { id: 'q-mem-4', content: '今まで食べた中で一番おいしかったものは？', type: 'question', category: 'memory', icon: '😋' },
  { id: 'q-mem-5', content: '忘れられない景色は？', type: 'question', category: 'memory', icon: '🌅' },
  { id: 'q-mem-6', content: '最近、家族と一緒に笑ったのはいつ？', type: 'question', category: 'memory', icon: '😂' },
  { id: 'q-mem-7', content: '小さい頃、よく遊んだ場所はどこ？', type: 'question', category: 'memory', icon: '🎠' },
  { id: 'q-mem-8', content: '大切な人からもらった言葉は？', type: 'question', category: 'memory', icon: '💬' },
  { id: 'q-mem-9', content: '人生で一番笑った日は？', type: 'question', category: 'memory', icon: '🤣' },
  { id: 'q-mem-10', content: '初めて自分で作った料理は？', type: 'question', category: 'memory', icon: '🍳' },
  { id: 'q-mem-12', content: '子どもの頃、好きだったおもちゃは？', type: 'question', category: 'memory', icon: '🧸' },
  { id: 'q-mem-13', content: '初めての旅行はどこだった？', type: 'question', category: 'memory', icon: '🚂' },
  { id: 'q-mem-14', content: '一番古い記憶は何？', type: 'question', category: 'memory', icon: '👒' },
  { id: 'q-mem-16', content: '忘れられないプレゼントは？', type: 'question', category: 'memory', icon: '🎁' },
  { id: 'q-mem-17', content: '初めて自分で買ったものは？', type: 'question', category: 'memory', icon: '🛒' },
  { id: 'q-mem-18', content: '家族旅行の思い出は？', type: 'question', category: 'memory', icon: '🚗' },
  { id: 'q-mem-19', content: '子どもの頃、よく見たテレビ番組は？', type: 'question', category: 'memory', icon: '📺' },
  { id: 'q-mem-20', content: '一番頑張ったことは何？', type: 'question', category: 'memory', icon: '🏆' },
  { id: 'q-mem-21', content: '初めて海を見た時のこと覚えてる？', type: 'question', category: 'memory', icon: '🌊' },
  { id: 'q-mem-22', content: '家族で一緒に作った思い出の料理は？', type: 'question', category: 'memory', icon: '🥘' },
  { id: 'q-mem-24', content: '誕生日の一番の思い出は？', type: 'question', category: 'memory', icon: '🎂' },
  { id: 'q-mem-25', content: 'おじいちゃん・おばあちゃんとの思い出は？', type: 'question', category: 'memory', icon: '👴' },

  // 夢・未来系
  { id: 'q-dream-1', content: '行ってみたい国はどこ？', type: 'question', category: 'dream', icon: '✈️' },
  { id: 'q-dream-2', content: '将来やってみたいことは？', type: 'question', category: 'dream', icon: '🌟' },
  { id: 'q-dream-3', content: '宝くじが当たったら何する？', type: 'question', category: 'dream', icon: '💰' },
  { id: 'q-dream-4', content: '明日が休みなら何したい？', type: 'question', category: 'dream', icon: '🎉' },
  { id: 'q-dream-5', content: '会ってみたい有名人は？', type: 'question', category: 'dream', icon: '🌠' },
  { id: 'q-dream-6', content: '10年後の自分に伝えたいことは？', type: 'question', category: 'dream', icon: '💌' },
  { id: 'q-dream-7', content: '家族でやってみたいことは？', type: 'question', category: 'dream', icon: '👨‍👩‍👧‍👦' },
  { id: 'q-dream-9', content: '習ってみたいことは何？', type: 'question', category: 'dream', icon: '📚' },
  { id: 'q-dream-10', content: '住んでみたい場所は？', type: 'question', category: 'dream', icon: '🏠' },
  { id: 'q-dream-12', content: 'なりたい自分ってどんな自分？', type: 'question', category: 'dream', icon: '🦋' },
  { id: 'q-dream-13', content: '叶えたい小さな夢は？', type: 'question', category: 'dream', icon: '⭐' },
  { id: 'q-dream-16', content: '飼ってみたい動物は？', type: 'question', category: 'dream', icon: '🐕' },
  { id: 'q-dream-18', content: '見てみたい世界遺産は？', type: 'question', category: 'dream', icon: '🏛️' },
  { id: 'q-dream-20', content: '来年の今頃、どうなっていたい？', type: 'question', category: 'dream', icon: '📅' },

  // 感謝系
  { id: 'q-thanks-1', content: '最近、誰かに助けてもらったことは？', type: 'question', category: 'gratitude', icon: '🙏' },
  { id: 'q-thanks-2', content: '大切にしているものは何？', type: 'question', category: 'gratitude', icon: '💎' },
  { id: 'q-thanks-3', content: '家族の好きなところを教えて！', type: 'question', category: 'gratitude', icon: '❤️' },
  { id: 'q-thanks-4', content: '今日、いいことあった？', type: 'question', category: 'gratitude', icon: '🍀' },
  { id: 'q-thanks-5', content: '「ありがとう」を言いたい人は誰？', type: 'question', category: 'gratitude', icon: '🌷' },
  { id: 'q-thanks-7', content: '家族がいてよかったと思う瞬間は？', type: 'question', category: 'gratitude', icon: '🏠' },
  { id: 'q-thanks-9', content: 'いつも支えてくれる人は誰？', type: 'question', category: 'gratitude', icon: '🤗' },
  { id: 'q-thanks-11', content: '今週、うれしかったことを3つ！', type: 'question', category: 'gratitude', icon: '✨' },
  { id: 'q-thanks-12', content: '笑顔にしてくれる人は誰？', type: 'question', category: 'gratitude', icon: '😊' },

  // おもしろ系
  { id: 'q-fun-1', content: '動物に生まれ変わるなら何になりたい？', type: 'question', category: 'fun', icon: '🐾' },
  { id: 'q-fun-2', content: '無人島に一つだけ持っていくなら？', type: 'question', category: 'fun', icon: '🏝️' },
  { id: 'q-fun-3', content: '魔法が使えたら何する？', type: 'question', category: 'fun', icon: '🪄' },
  { id: 'q-fun-5', content: 'タイムマシンがあったらどの時代に行く？', type: 'question', category: 'fun', icon: '⏰' },
  { id: 'q-fun-6', content: '空を飛べたら、どこに行きたい？', type: 'question', category: 'fun', icon: '🦅' },
  { id: 'q-fun-7', content: '透明人間になれたら何する？', type: 'question', category: 'fun', icon: '👻' },
  { id: 'q-fun-8', content: '世界中のどこにでもドアがあったら？', type: 'question', category: 'fun', icon: '🚪' },
  { id: 'q-fun-9', content: '何でも一つ願いが叶うなら？', type: 'question', category: 'fun', icon: '🧞' },
  { id: 'q-fun-10', content: '動物と話せたら、何を聞く？', type: 'question', category: 'fun', icon: '🐶' },
  { id: 'q-fun-11', content: '宇宙人に会ったら、何を伝える？', type: 'question', category: 'fun', icon: '👽' },
  { id: 'q-fun-12', content: '100歳まで生きたら何したい？', type: 'question', category: 'fun', icon: '🎂' },
  { id: 'q-fun-15', content: 'スーパーヒーローになれたら、どんな能力がほしい？', type: 'question', category: 'fun', icon: '🦸' },
  { id: 'q-fun-17', content: '映画の主人公になれるなら、どの映画？', type: 'question', category: 'fun', icon: '🎥' },
  { id: 'q-fun-19', content: '世界一になれるとしたら何で？', type: 'question', category: 'fun', icon: '🥇' },
  { id: 'q-fun-20', content: '好きな匂いは何？', type: 'question', category: 'fun', icon: '👃' },

  // 家族系
  { id: 'q-family-1', content: '家の好きな場所は？', type: 'question', category: 'memory', icon: '🏡' },
  { id: 'q-family-2', content: 'お父さんの好きなところは？', type: 'question', category: 'gratitude', icon: '👨' },
  { id: 'q-family-3', content: 'お母さんの好きなところは？', type: 'question', category: 'gratitude', icon: '👩' },
  { id: 'q-family-5', content: '家族で一番笑うのは誰？', type: 'question', category: 'fun', icon: '😂' },
  { id: 'q-family-6', content: '家族の中で一番料理が上手なのは？', type: 'question', category: 'fun', icon: '👨‍🍳' },
  { id: 'q-family-7', content: '家族の口癖は何？', type: 'question', category: 'fun', icon: '💬' },
  { id: 'q-family-9', content: '家族の好きな食べ物は何？', type: 'question', category: 'fun', icon: '🍖' },
  { id: 'q-family-10', content: '家族で行きたい場所は？', type: 'question', category: 'dream', icon: '🗺️' },
  { id: 'q-family-13', content: '10年後の家族はどうなってると思う？', type: 'question', category: 'dream', icon: '🔮' },

  // 食べ物系
  { id: 'q-food-1', content: '世界で一番好きな食べ物は？', type: 'question', category: 'fun', icon: '🍜' },
  { id: 'q-food-2', content: '最後の晩餐、何食べたい？', type: 'question', category: 'fun', icon: '🍽️' },
  { id: 'q-food-3', content: 'お母さんの手料理で一番好きなのは？', type: 'question', category: 'memory', icon: '🍱' },
  { id: 'q-food-4', content: '食べると元気が出る食べ物は？', type: 'question', category: 'feeling', icon: '🍖' },
  { id: 'q-food-5', content: '思い出の味は何？', type: 'question', category: 'memory', icon: '👅' },
  { id: 'q-food-6', content: '好きなおやつは？', type: 'question', category: 'fun', icon: '🍪' },
  { id: 'q-food-7', content: 'おにぎりの具、何が好き？', type: 'question', category: 'fun', icon: '🍙' },
  { id: 'q-food-8', content: 'カレーは甘口？辛口？', type: 'question', category: 'fun', icon: '🍛' },

  // 音楽・エンタメ系
  { id: 'q-music-2', content: '思い出の曲は何？', type: 'question', category: 'memory', icon: '🎵' },
  { id: 'q-music-3', content: 'カラオケで歌う十八番は？', type: 'question', category: 'fun', icon: '🎙️' },
  { id: 'q-music-4', content: '元気が出る曲は？', type: 'question', category: 'feeling', icon: '🎶' },
  { id: 'q-music-5', content: '好きな映画は？', type: 'question', category: 'fun', icon: '🎬' },
  { id: 'q-music-6', content: '好きなアニメは？', type: 'question', category: 'fun', icon: '📺' },
  { id: 'q-music-7', content: '好きな本や漫画は？', type: 'question', category: 'fun', icon: '📚' },
  { id: 'q-music-8', content: '最近ハマっているものは？', type: 'question', category: 'fun', icon: '💖' },

  // 動物系
  { id: 'q-animal-1', content: '好きな動物は何？', type: 'question', category: 'fun', icon: '🦁' },
  { id: 'q-animal-2', content: '飼ってみたいペットは？', type: 'question', category: 'dream', icon: '🐕' },
  { id: 'q-animal-3', content: '自分を動物に例えると？', type: 'question', category: 'fun', icon: '🐻' },
  { id: 'q-animal-4', content: '昔飼っていたペットの思い出は？', type: 'question', category: 'memory', icon: '🐕' },

  // 旅行系
  { id: 'q-travel-1', content: '行ってみたい国はどこ？', type: 'question', category: 'dream', icon: '🌍' },
  { id: 'q-travel-2', content: '今まで行った中で一番良かった場所は？', type: 'question', category: 'memory', icon: '📍' },
  { id: 'q-travel-3', content: '日本で行きたい場所は？', type: 'question', category: 'dream', icon: '🗾' },
  { id: 'q-travel-4', content: '旅行で食べた美味しいものは？', type: 'question', category: 'memory', icon: '🍴' },
  { id: 'q-travel-5', content: '次の旅行はどこに行きたい？', type: 'question', category: 'dream', icon: '🗺️' },
];

// ======================================
// あなたへのメッセージ（励まし・名言・心温まる言葉）
// ======================================
export const MESSAGES: MessageQuestion[] = [
  // スヌーピー風
  { id: 'm-snoopy-1', content: '幸せって、温かいごはんと、大好きな人がそばにいること。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-2', content: '人生で大切なのは、自分らしくいること。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-3', content: '笑顔は最高のプレゼント！', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-5', content: '失敗しても大丈夫。大切なのは、また立ち上がること。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-6', content: '明日は明日の風が吹く。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-9', content: '雨の日があるから、晴れの日がうれしい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-12', content: 'ハグは言葉よりも温かい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-14', content: '誰かを思いやる気持ちが、世界を優しくする。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-20', content: '夢を持つことは、心に翼を持つこと。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-21', content: '想像力があれば、どこへでも行ける。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-22', content: '小さな一歩が、大きな冒険の始まり。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-23', content: '今日という日は、二度と来ない特別な日。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-25', content: '「ありがとう」は魔法の言葉。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-26', content: '誰かの笑顔を見ると、自分も幸せになる。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-29', content: '踊りたくなったら踊ればいい！', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-32', content: 'ワクワクする気持ちを大切に！', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-33', content: '子どもの頃の気持ちを忘れずに。', type: 'message', category: 'memory', icon: '🐕' },
  { id: 'm-snoopy-35', content: '比べなくていい。自分のペースで進めばいい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-36', content: '間違えることは、学ぶこと。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-38', content: '今日の自分に「おつかれさま」を言おう。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-40', content: '勇気を出して一歩踏み出そう。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-42', content: '人生は冒険！', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-43', content: '優しさは連鎖する。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-44', content: '心配しなくても大丈夫。なんとかなるさ！', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-45', content: '自分を信じて！あなたならできる。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-46', content: '笑うって最高の薬。', type: 'message', category: 'fun', icon: '🐕' },

  // くまのプーさん風
  { id: 'm-pooh-1', content: '何もしないって、最高の何かをしてるんだよ。', type: 'message', category: 'feeling', icon: '🐻' },
  { id: 'm-pooh-2', content: '友達と一緒なら、どんな冒険も楽しいね。', type: 'message', category: 'fun', icon: '🐻' },
  { id: 'm-pooh-3', content: '小さな親切は、大きな幸せになるんだ。', type: 'message', category: 'gratitude', icon: '🐻' },
  { id: 'm-pooh-5', content: '思い出は心の中にずっとあるから、いつでも会えるんだよ。', type: 'message', category: 'memory', icon: '🐻' },
  { id: 'm-pooh-8', content: '風船があれば空を飛べる気がするね。', type: 'message', category: 'dream', icon: '🎈' },
  { id: 'm-pooh-9', content: 'ぬいぐるみを抱きしめると安心するね。', type: 'message', category: 'feeling', icon: '🧸' },
  { id: 'm-pooh-10', content: '「また明日ね」って言える人がいるって幸せだね。', type: 'message', category: 'gratitude', icon: '🐻' },

  // ムーミン風
  { id: 'm-moomin-2', content: '自由って最高！', type: 'message', category: 'feeling', icon: '🦛' },
  { id: 'm-moomin-3', content: '自然の中にいると、心が落ち着くね。', type: 'message', category: 'feeling', icon: '🌲' },
  { id: 'm-moomin-4', content: '家族と過ごす時間は宝物。', type: 'message', category: 'gratitude', icon: '🏠' },
  { id: 'm-moomin-5', content: 'ちょっと変わってるくらいがちょうどいい。', type: 'message', category: 'fun', icon: '🦛' },
  { id: 'm-moomin-6', content: '嵐が過ぎれば、また晴れる。', type: 'message', category: 'feeling', icon: '🌈' },
  { id: 'm-moomin-9', content: '冬眠みたいに、ゆっくり休むのも大事だよ。', type: 'message', category: 'feeling', icon: '😴' },
  { id: 'm-moomin-10', content: '帰る場所があるって、幸せなこと。', type: 'message', category: 'gratitude', icon: '🏠' },

  // 星の王子さま風
  { id: 'm-prince-1', content: '大切なものは、心で見なくちゃ見えないんだ。', type: 'message', category: 'feeling', icon: '👑' },
  { id: 'm-prince-2', content: '君だけのバラを大切にしよう。', type: 'message', category: 'gratitude', icon: '🌹' },
  { id: 'm-prince-4', content: '本当に大切なものは、目には見えない。', type: 'message', category: 'gratitude', icon: '👑' },
  { id: 'm-prince-5', content: '毎日見る夕日は、心を穏やかにしてくれる。', type: 'message', category: 'feeling', icon: '🌅' },
  { id: 'm-prince-8', content: '笑うと、星が輝いて見えるよ。', type: 'message', category: 'fun', icon: '😊' },
  { id: 'm-prince-10', content: '小さな星でも、自分の星は特別。', type: 'message', category: 'feeling', icon: '⭐' },
  { id: 'm-prince-11', content: '別れは悲しいけど、心の中ではずっと一緒。', type: 'message', category: 'memory', icon: '💕' },

  // 励まし・応援
  { id: 'm-cheer-1', content: 'あなたは、あなたのままで素晴らしい！', type: 'message', category: 'feeling', icon: '💪' },
  { id: 'm-cheer-2', content: '今日も一日、よく頑張ったね！', type: 'message', category: 'gratitude', icon: '🎉' },
  { id: 'm-cheer-3', content: 'ゆっくりでいいよ。焦らなくて大丈夫。', type: 'message', category: 'feeling', icon: '🐢' },
  { id: 'm-cheer-4', content: '失敗は成功のもと！', type: 'message', category: 'feeling', icon: '📈' },
  { id: 'm-cheer-6', content: '今日できなくても、明日がある！', type: 'message', category: 'dream', icon: '🌅' },
  { id: 'm-cheer-7', content: '小さな一歩も立派な前進。', type: 'message', category: 'feeling', icon: '👣' },
  { id: 'm-cheer-8', content: 'つらい時は、休んでいいんだよ。', type: 'message', category: 'feeling', icon: '🛋️' },
  { id: 'm-cheer-11', content: 'あなたの存在が、誰かの力になってる。', type: 'message', category: 'gratitude', icon: '✨' },
  { id: 'm-cheer-14', content: 'あなたの笑顔が誰かを幸せにしてる。', type: 'message', category: 'gratitude', icon: '😊' },
  { id: 'm-cheer-15', content: '大丈夫、きっとうまくいく。', type: 'message', category: 'feeling', icon: '🍀' },

  // 名言・ことわざ風
  { id: 'm-quote-1', content: '笑う門には福来る。', type: 'message', category: 'feeling', icon: '📜' },
  { id: 'm-quote-2', content: '七転び八起き。', type: 'message', category: 'feeling', icon: '📜' },
  { id: 'm-quote-3', content: '継続は力なり。', type: 'message', category: 'dream', icon: '📜' },
  { id: 'm-quote-4', content: '急がば回れ。', type: 'message', category: 'feeling', icon: '📜' },
  { id: 'm-quote-6', content: '千里の道も一歩から。', type: 'message', category: 'dream', icon: '📜' },
  { id: 'm-quote-8', content: '案ずるより産むが易し。', type: 'message', category: 'feeling', icon: '📜' },
  { id: 'm-quote-9', content: '好きこそものの上手なれ。', type: 'message', category: 'fun', icon: '📜' },
  { id: 'm-quote-10', content: '一期一会。', type: 'message', category: 'gratitude', icon: '📜' },
  { id: 'm-quote-14', content: '今日という日は贈り物。', type: 'message', category: 'gratitude', icon: '🎀' },
  { id: 'm-quote-15', content: '可能性は無限大。', type: 'message', category: 'dream', icon: '∞' },

  // 自然・季節
  { id: 'm-nature-1', content: '春は新しい始まり。', type: 'message', category: 'dream', icon: '🌸' },
  { id: 'm-nature-2', content: '虹を見ると、いいことありそう！', type: 'message', category: 'fun', icon: '🌈' },
  { id: 'm-nature-3', content: '満月を見ると、心が穏やかになる。', type: 'message', category: 'feeling', icon: '🌕' },
  { id: 'm-nature-4', content: '雨の音を聞くと、心が落ち着く。', type: 'message', category: 'feeling', icon: '🌧️' },
  { id: 'm-nature-7', content: '星空を見上げると、不思議な気持ちになるね。', type: 'message', category: 'feeling', icon: '⭐' },
  { id: 'm-nature-8', content: '自然からパワーをもらおう。', type: 'message', category: 'feeling', icon: '🌿' },

  // 家族・絆
  { id: 'm-family-1', content: 'おうちに帰ると、ほっとするね。', type: 'message', category: 'memory', icon: '🏡' },
  { id: 'm-family-2', content: '家族と一緒にいると、安心する。', type: 'message', category: 'gratitude', icon: '👨‍👩‍👧' },
  { id: 'm-family-3', content: '家族の「いただきます」は、幸せの時間。', type: 'message', category: 'gratitude', icon: '🍚' },
  { id: 'm-family-4', content: '家族の笑い声は、最高の音楽。', type: 'message', category: 'memory', icon: '😆' },
  { id: 'm-family-5', content: '家族って、当たり前じゃない。大切にしよう。', type: 'message', category: 'gratitude', icon: '💕' },
];

// 全メッセージ（質問＋メッセージ）
export const MESSAGE_QUESTIONS: MessageQuestion[] = [...QUESTIONS, ...MESSAGES];

/**
 * ランダムな質問またはメッセージを取得
 */
export function getRandomQuestion(): MessageQuestion {
  const index = Math.floor(Math.random() * MESSAGE_QUESTIONS.length);
  return MESSAGE_QUESTIONS[index];
}

/**
 * ランダムなひと言しつもんを取得
 */
export function getRandomQuestionOnly(): MessageQuestion {
  const index = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[index];
}

/**
 * ランダムなあなたへのメッセージを取得
 */
export function getRandomMessageOnly(): MessageQuestion {
  const index = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[index];
}

/**
 * カテゴリー別に取得
 */
export function getQuestionsByCategory(category: MessageQuestion['category']): MessageQuestion[] {
  return MESSAGE_QUESTIONS.filter(q => q.category === category);
}

/**
 * タイプ別に取得
 */
export function getByType(type: MessageType): MessageQuestion[] {
  return MESSAGE_QUESTIONS.filter(q => q.type === type);
}
