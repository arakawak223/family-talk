// ======================================
// ひと言しつもんメッセージデータ
// メッセージマスで読み上げられる質問集
// ======================================

export interface MessageQuestion {
  id: string;
  question: string;      // 質問文
  category: 'feeling' | 'memory' | 'dream' | 'gratitude' | 'fun';  // カテゴリー
  icon: string;          // 絵文字アイコン
}

export const MESSAGE_QUESTIONS: MessageQuestion[] = [
  // 気持ち系
  { id: 'feel-1', question: '今日はどんな気分？', category: 'feeling', icon: '😊' },
  { id: 'feel-2', question: '最近うれしかったことは？', category: 'feeling', icon: '🥰' },
  { id: 'feel-3', question: '今、一番楽しみにしていることは？', category: 'feeling', icon: '✨' },
  { id: 'feel-4', question: '今日のごはん、何が食べたい？', category: 'feeling', icon: '🍽️' },
  { id: 'feel-5', question: '今の気持ちを色で表すと何色？', category: 'feeling', icon: '🎨' },

  // 思い出系
  { id: 'mem-1', question: '家族との一番の思い出は？', category: 'memory', icon: '📸' },
  { id: 'mem-2', question: '最近行った楽しい場所は？', category: 'memory', icon: '🗺️' },
  { id: 'mem-3', question: '子どもの頃の夢は何だった？', category: 'memory', icon: '👶' },
  { id: 'mem-4', question: '今まで食べた中で一番おいしかったものは？', category: 'memory', icon: '😋' },
  { id: 'mem-5', question: '忘れられない景色は？', category: 'memory', icon: '🌅' },

  // 夢・未来系
  { id: 'dream-1', question: '行ってみたい国はどこ？', category: 'dream', icon: '✈️' },
  { id: 'dream-2', question: '将来やってみたいことは？', category: 'dream', icon: '🌟' },
  { id: 'dream-3', question: '宝くじが当たったら何する？', category: 'dream', icon: '💰' },
  { id: 'dream-4', question: '明日が休みなら何したい？', category: 'dream', icon: '🎉' },
  { id: 'dream-5', question: '会ってみたい有名人は？', category: 'dream', icon: '🌠' },

  // 感謝系
  { id: 'thanks-1', question: '家族に「ありがとう」を伝えよう！', category: 'gratitude', icon: '💖' },
  { id: 'thanks-2', question: '最近、誰かに助けてもらったことは？', category: 'gratitude', icon: '🙏' },
  { id: 'thanks-3', question: '大切にしているものは何？', category: 'gratitude', icon: '💎' },
  { id: 'thanks-4', question: '家族の好きなところを教えて！', category: 'gratitude', icon: '❤️' },
  { id: 'thanks-5', question: '今日、いいことあった？', category: 'gratitude', icon: '🍀' },

  // おもしろ系
  { id: 'fun-1', question: '動物に生まれ変わるなら何になりたい？', category: 'fun', icon: '🐾' },
  { id: 'fun-2', question: '無人島に一つだけ持っていくなら？', category: 'fun', icon: '🏝️' },
  { id: 'fun-3', question: '魔法が使えたら何する？', category: 'fun', icon: '🪄' },
  { id: 'fun-4', question: '好きな季節とその理由は？', category: 'fun', icon: '🌸' },
  { id: 'fun-5', question: 'タイムマシンがあったらどの時代に行く？', category: 'fun', icon: '⏰' },
];

/**
 * ランダムな質問を取得
 */
export function getRandomQuestion(): MessageQuestion {
  const index = Math.floor(Math.random() * MESSAGE_QUESTIONS.length);
  return MESSAGE_QUESTIONS[index];
}

/**
 * カテゴリー別に質問を取得
 */
export function getQuestionsByCategory(category: MessageQuestion['category']): MessageQuestion[] {
  return MESSAGE_QUESTIONS.filter(q => q.category === category);
}
