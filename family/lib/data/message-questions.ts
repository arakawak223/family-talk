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


  { id: 'q-feel-6', content: '今日、心がほっとした瞬間はあった？', type: 'question', category: 'feeling', icon: '☕' },
  { id: 'q-feel-7', content: '最近、思わず笑顔になったことは？', type: 'question', category: 'feeling', icon: '😄' },


  { id: 'q-feel-10', content: '最近、心が軽くなったことは？', type: 'question', category: 'feeling', icon: '🎈' },
  { id: 'q-feel-11', content: '今、一番会いたい人は誰？', type: 'question', category: 'feeling', icon: '💭' },

  { id: 'q-feel-13', content: '今日、自分を褒めるとしたら何？', type: 'question', category: 'feeling', icon: '👏' },
  { id: 'q-feel-14', content: '最近、泣くほど感動したことある？', type: 'question', category: 'feeling', icon: '🥹' },

  { id: 'q-feel-16', content: 'リラックスしたい時、何をする？', type: 'question', category: 'feeling', icon: '🧘' },
  { id: 'q-feel-17', content: '元気が出る言葉は何？', type: 'question', category: 'feeling', icon: '💪' },
  { id: 'q-feel-18', content: '最近、ドキドキしたことは？', type: 'question', category: 'feeling', icon: '💓' },

  { id: 'q-feel-20', content: '疲れた時、癒してくれるものは？', type: 'question', category: 'feeling', icon: '🌿' },
  { id: 'q-feel-21', content: '最近、「よかった！」と思ったことは？', type: 'question', category: 'feeling', icon: '😌' },
  { id: 'q-feel-22', content: '今、何パーセントくらい元気？', type: 'question', category: 'feeling', icon: '📊' },

  { id: 'q-feel-24', content: '最近の「小さな幸せ」は何？', type: 'question', category: 'feeling', icon: '🌼' },
  { id: 'q-feel-25', content: 'ぐっすり眠れてる？', type: 'question', category: 'feeling', icon: '😴' },

  // 思い出系
  { id: 'q-mem-1', content: '家族との一番の思い出は？', type: 'question', category: 'memory', icon: '📸' },
  { id: 'q-mem-2', content: '最近行った楽しい場所は？', type: 'question', category: 'memory', icon: '🗺️' },
  { id: 'q-mem-3', content: '子どもの頃の夢は何だった？', type: 'question', category: 'memory', icon: '👶' },
  { id: 'q-mem-4', content: '今まで食べた中で一番おいしかったものは？', type: 'question', category: 'memory', icon: '😋' },
  { id: 'q-mem-5', content: '忘れられない景色は？', type: 'question', category: 'memory', icon: '🌅' },


  { id: 'q-mem-8', content: '大切な人からもらった言葉は？', type: 'question', category: 'memory', icon: '💬' },
  { id: 'q-mem-9', content: '人生で一番笑った日は？', type: 'question', category: 'memory', icon: '🤣' },



  { id: 'q-mem-13', content: '初めての旅行はどこだった？', type: 'question', category: 'memory', icon: '🚂' },
  { id: 'q-mem-14', content: '一番古い記憶は何？', type: 'question', category: 'memory', icon: '👒' },

  { id: 'q-mem-16', content: '忘れられないプレゼントは？', type: 'question', category: 'memory', icon: '🎁' },
  { id: 'q-mem-17', content: '初めて自分で買ったものは？', type: 'question', category: 'memory', icon: '🛒' },

  { id: 'q-mem-19', content: '子どもの頃、よく見たテレビ番組は？', type: 'question', category: 'memory', icon: '📺' },
  { id: 'q-mem-20', content: '一番頑張ったことは何？', type: 'question', category: 'memory', icon: '🏆' },


  // 夢・未来系
  { id: 'q-dream-1', content: '行ってみたい国はどこ？', type: 'question', category: 'dream', icon: '✈️' },
  { id: 'q-dream-5', content: '会ってみたい有名人は？', type: 'question', category: 'dream', icon: '🌠' },
  { id: 'q-dream-6', content: '10年後の自分に伝えたいことは？', type: 'question', category: 'dream', icon: '💌' },
  { id: 'q-dream-7', content: '家族でやってみたいことは？', type: 'question', category: 'dream', icon: '👨‍👩‍👧‍👦' },
  { id: 'q-dream-8', content: '誰かを幸せにするなら、どんなことをする？', type: 'question', category: 'dream', icon: '🎁' },
  { id: 'q-dream-9', content: '習ってみたいことは何？', type: 'question', category: 'dream', icon: '📚' },
  { id: 'q-dream-10', content: '住んでみたい場所は？', type: 'question', category: 'dream', icon: '🏠' },
  { id: 'q-dream-11', content: '作ってみたいものは？', type: 'question', category: 'dream', icon: '🔧' },
  { id: 'q-dream-12', content: 'なりたい自分ってどんな自分？', type: 'question', category: 'dream', icon: '🦋' },

  { id: 'q-dream-18', content: '見てみたい世界遺産は？', type: 'question', category: 'dream', icon: '🏛️' },
  { id: 'q-dream-19', content: '達成したい目標は？', type: 'question', category: 'dream', icon: '🎯' },
  { id: 'q-dream-20', content: '来年の今頃、どうなっていたい？', type: 'question', category: 'dream', icon: '📅' },

  // 感謝系
  { id: 'q-thanks-1', content: '最近、誰かに助けてもらったことは？', type: 'question', category: 'gratitude', icon: '🙏' },
  { id: 'q-thanks-2', content: '大切にしているものは何？', type: 'question', category: 'gratitude', icon: '💎' },

  { id: 'q-thanks-5', content: '「ありがとう」を言いたい人は誰？', type: 'question', category: 'gratitude', icon: '🌷' },
  { id: 'q-thanks-6', content: '当たり前だけど、感謝していることは？', type: 'question', category: 'gratitude', icon: '🌈' },
  { id: 'q-thanks-7', content: '家族がいてよかったと思う瞬間は？', type: 'question', category: 'gratitude', icon: '🏠' },
  { id: 'q-thanks-8', content: '今日、誰かに優しくされた？', type: 'question', category: 'gratitude', icon: '🤝' },
  { id: 'q-thanks-9', content: 'いつも支えてくれる人は誰？', type: 'question', category: 'gratitude', icon: '🤗' },
  { id: 'q-thanks-10', content: '生まれてきてよかったと思うことは？', type: 'question', category: 'gratitude', icon: '🌟' },
  { id: 'q-thanks-11', content: '今週、うれしかったことを3つ！', type: 'question', category: 'gratitude', icon: '✨' },
  { id: 'q-thanks-12', content: '笑顔にしてくれる人は誰？', type: 'question', category: 'gratitude', icon: '😊' },

  { id: 'q-thanks-15', content: '今日という日に感謝！どんな一日だった？', type: 'question', category: 'gratitude', icon: '📆' },

  // おもしろ系

  { id: 'q-fun-3', content: '魔法が使えたら何する？', type: 'question', category: 'fun', icon: '🪄' },
  { id: 'q-fun-5', content: 'タイムマシンがあったらどの時代に行く？', type: 'question', category: 'fun', icon: '⏰' },
  { id: 'q-fun-6', content: '空を飛べたら、どこに行きたい？', type: 'question', category: 'fun', icon: '🦅' },

  { id: 'q-fun-9', content: '何でも一つ願いが叶うなら？', type: 'question', category: 'fun', icon: '🧞' },

  { id: 'q-fun-13', content: '自分のテーマソングを選ぶなら？', type: 'question', category: 'fun', icon: '🎤' },

  { id: 'q-fun-17', content: '映画の主人公になれるなら、どの映画？', type: 'question', category: 'fun', icon: '🎥' },

  { id: 'q-fun-19', content: '世界一になれるとしたら何で？', type: 'question', category: 'fun', icon: '🥇' },




  // 音楽・エンタメ系
  { id: 'q-music-1', content: '好きな歌手は？', type: 'question', category: 'fun', icon: '🎤' },
  { id: 'q-music-2', content: '思い出の曲は何？', type: 'question', category: 'memory', icon: '🎵' },

  { id: 'q-music-4', content: '元気が出る曲は？', type: 'question', category: 'feeling', icon: '🎶' },
  { id: 'q-music-5', content: '好きな映画は？', type: 'question', category: 'fun', icon: '🎬' },
  { id: 'q-music-6', content: '好きなアニメは？', type: 'question', category: 'fun', icon: '📺' },
  { id: 'q-music-7', content: '好きな本や漫画は？', type: 'question', category: 'fun', icon: '📚' },
  { id: 'q-music-8', content: '最近ハマっているものは？', type: 'question', category: 'fun', icon: '💖' },

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
  { id: 'm-snoopy-7', content: '完璧じゃなくていい。そのままの自分が一番すてき。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-8', content: '新しいことを始めるのに遅すぎることはない。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-9', content: '雨の日があるから、晴れの日がうれしい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-10', content: '愛は与えるもの。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-11', content: '本当の友だちは、そばにいなくても心でつながってる。', type: 'message', category: 'memory', icon: '🐕' },
  { id: 'm-snoopy-12', content: 'ハグは言葉よりも温かい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-14', content: '誰かを思いやる気持ちが、世界を優しくする。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-15', content: 'おいしいごはんを食べると、心も満たされる。', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-16', content: 'お昼寝は人生の楽しみ！', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-17', content: '夕焼けを見ると、今日も一日がんばったねって思える。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-18', content: '星を見上げると、小さな悩みも小さく思える。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-19', content: '散歩すると、新しい発見がある。', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-20', content: '夢を持つことは、心に翼を持つこと。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-21', content: '想像力があれば、どこへでも行ける。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-22', content: '小さな一歩が、大きな冒険の始まり。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-23', content: '今日という日は、二度と来ない特別な日。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-24', content: 'きっとうまくいく。そう信じることが大切。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-25', content: '「ありがとう」は魔法の言葉。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-26', content: '誰かの笑顔を見ると、自分も幸せになる。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-27', content: '困っている人を助けると、心がポカポカする。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-28', content: '毎日の小さな幸せを数えてみよう。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-29', content: '踊りたくなったら踊ればいい！', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-30', content: '何もしない日も大切。', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-31', content: '好きなことをしている時間が、一番輝いている。', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-32', content: 'ワクワクする気持ちを大切に！', type: 'message', category: 'fun', icon: '🐕' },

  { id: 'm-snoopy-34', content: '自分を好きでいることが、幸せの第一歩。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-35', content: '比べなくていい。自分のペースで進めばいい。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-36', content: '間違えることは、学ぶこと。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-37', content: '自分にしかできないことがある。', type: 'message', category: 'feeling', icon: '🐕' },
  { id: 'm-snoopy-38', content: '今日の自分に「おつかれさま」を言おう。', type: 'message', category: 'gratitude', icon: '🐕' },


  { id: 'm-snoopy-41', content: '泣きたい時は泣いていい。', type: 'message', category: 'feeling', icon: '🐕' },

  { id: 'm-snoopy-43', content: '優しさは連鎖する。', type: 'message', category: 'gratitude', icon: '🐕' },

  { id: 'm-snoopy-45', content: '自分を信じて！あなたならできる。', type: 'message', category: 'dream', icon: '🐕' },
  { id: 'm-snoopy-46', content: '笑うって最高の薬。', type: 'message', category: 'fun', icon: '🐕' },
  { id: 'm-snoopy-47', content: '大丈夫、君は一人じゃない。', type: 'message', category: 'gratitude', icon: '🐕' },
  { id: 'm-snoopy-48', content: '今日も生きてるって、それだけですごいこと！', type: 'message', category: 'gratitude', icon: '🐕' },

  // くまのプーさん風
  { id: 'm-pooh-1', content: '何もしないって、最高の何かをしてるんだよ。', type: 'message', category: 'feeling', icon: '🐻' },
  { id: 'm-pooh-2', content: '友達と一緒なら、どんな冒険も楽しいね。', type: 'message', category: 'fun', icon: '🐻' },
  { id: 'm-pooh-3', content: '小さな親切は、大きな幸せになるんだ。', type: 'message', category: 'gratitude', icon: '🐻' },
  { id: 'm-pooh-4', content: '僕たちはみんな、誰かの大切な友達。', type: 'message', category: 'gratitude', icon: '🐻' },







  // ムーミン風
  { id: 'm-moomin-1', content: '大切なのは、自分らしくいること。', type: 'message', category: 'feeling', icon: '🦛' },
  { id: 'm-moomin-2', content: '自由って最高！', type: 'message', category: 'feeling', icon: '🦛' },
  { id: 'm-moomin-3', content: '自然の中にいると、心が落ち着くね。', type: 'message', category: 'feeling', icon: '🌲' },
  { id: 'm-moomin-4', content: '家族と過ごす時間は宝物。', type: 'message', category: 'gratitude', icon: '🏠' },
  { id: 'm-moomin-5', content: 'ちょっと変わってるくらいがちょうどいい。', type: 'message', category: 'fun', icon: '🦛' },
  { id: 'm-moomin-6', content: '嵐が過ぎれば、また晴れる。', type: 'message', category: 'feeling', icon: '🌈' },

  { id: 'm-moomin-8', content: '大切なものは、目に見えないところにあるんだ。', type: 'message', category: 'gratitude', icon: '💎' },
  { id: 'm-moomin-9', content: '冬眠みたいに、ゆっくり休むのも大事だよ。', type: 'message', category: 'feeling', icon: '😴' },
  { id: 'm-moomin-10', content: '帰る場所があるって、幸せなこと。', type: 'message', category: 'gratitude', icon: '🏠' },

  // 星の王子さま風
  { id: 'm-prince-1', content: '大切なものは、心で見なくちゃ見えないんだ。', type: 'message', category: 'feeling', icon: '👑' },


  { id: 'm-prince-4', content: '本当に大切なものは、目には見えない。', type: 'message', category: 'gratitude', icon: '👑' },
  { id: 'm-prince-5', content: '毎日見る夕日は、心を穏やかにしてくれる。', type: 'message', category: 'feeling', icon: '🌅' },


  { id: 'm-prince-8', content: '笑うと、星が輝いて見えるよ。', type: 'message', category: 'fun', icon: '😊' },

  { id: 'm-prince-10', content: '小さな星でも、自分の星は特別。', type: 'message', category: 'feeling', icon: '⭐' },


  // 励まし・応援
  { id: 'm-cheer-1', content: 'あなたは、あなたのままで素晴らしい！', type: 'message', category: 'feeling', icon: '💪' },
  { id: 'm-cheer-2', content: '今日も一日、よく頑張ったね！', type: 'message', category: 'gratitude', icon: '🎉' },
  { id: 'm-cheer-3', content: 'ゆっくりでいいよ。焦らなくて大丈夫。', type: 'message', category: 'feeling', icon: '🐢' },
  { id: 'm-cheer-4', content: '失敗は成功のもと！', type: 'message', category: 'feeling', icon: '📈' },
  { id: 'm-cheer-5', content: 'あなたの味方はたくさんいるよ。', type: 'message', category: 'gratitude', icon: '👥' },
  { id: 'm-cheer-6', content: '今日できなくても、明日がある！', type: 'message', category: 'dream', icon: '🌅' },
  { id: 'm-cheer-7', content: '小さな一歩も立派な前進。', type: 'message', category: 'feeling', icon: '👣' },
  { id: 'm-cheer-8', content: 'つらい時は、休んでいいんだよ。', type: 'message', category: 'feeling', icon: '🛋️' },
  { id: 'm-cheer-9', content: '誰かに頼ってもいいんだよ。', type: 'message', category: 'gratitude', icon: '🤝' },
  { id: 'm-cheer-10', content: '自分を責めないで。', type: 'message', category: 'feeling', icon: '💝' },
  { id: 'm-cheer-11', content: 'あなたの存在が、誰かの力になってる。', type: 'message', category: 'gratitude', icon: '✨' },
  { id: 'm-cheer-12', content: '完璧を目指さなくていい。', type: 'message', category: 'feeling', icon: '👌' },
  { id: 'm-cheer-13', content: '頑張りすぎないでね。', type: 'message', category: 'feeling', icon: '⚠️' },
  { id: 'm-cheer-14', content: 'あなたの笑顔が誰かを幸せにしてる。', type: 'message', category: 'gratitude', icon: '😊' },
  { id: 'm-cheer-15', content: '大丈夫、きっとうまくいく。', type: 'message', category: 'feeling', icon: '🍀' },

  // 家族・絆

  { id: 'm-family-3', content: '家族の「いただきます」は、幸せの時間。', type: 'message', category: 'gratitude', icon: '🍚' },
  { id: 'm-family-4', content: '家族の笑い声は、最高の音楽。', type: 'message', category: 'memory', icon: '😆' },
  { id: 'm-family-5', content: '家族って、当たり前じゃない。大切にしよう。', type: 'message', category: 'gratitude', icon: '💕' },
];

// ======================================
// ヘルパー関数
// ======================================

// ランダムに「ひと言しつもん」を取得
export function getRandomQuestionOnly(): MessageQuestion {
  const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[randomIndex];
}

// ランダムに「あなたへのメッセージ」を取得
export function getRandomMessageOnly(): MessageQuestion {
  const randomIndex = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[randomIndex];
}

// ランダムにどちらかを取得
export function getRandomMessage(): MessageQuestion {
  const allMessages = [...QUESTIONS, ...MESSAGES];
  const randomIndex = Math.floor(Math.random() * allMessages.length);
  return allMessages[randomIndex];
}

