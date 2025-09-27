import { Question, Greeting } from '../types';

// 聞きたい気持ち別の質問データベース
export const questions: Question[] = [
  // 関心・興味を示したい質問
  {
    id: 'q1',
    category: 'daily',
    feeling: 'interest',
    timing: 'morning',
    text: '今日はどんな予定があるの？',
  },
  {
    id: 'q2',
    category: 'daily',
    feeling: 'interest',
    timing: 'morning',
    text: '今日はどんな風に過ごしたい？',
  },
  {
    id: 'q3',
    category: 'daily',
    feeling: 'interest',
    timing: 'evening',
    text: '今日はどんな一日だった？',
  },
  {
    id: 'q4',
    category: 'daily',
    feeling: 'interest',
    timing: 'evening',
    text: '今日はどんないいことがあった？',
  },
  {
    id: 'q5',
    category: 'daily',
    feeling: 'interest',
    timing: 'anytime',
    text: '最近どんなことを考えてる？',
  },
  {
    id: 'q6',
    category: 'daily',
    feeling: 'interest',
    timing: 'anytime',
    text: '今度どんなことをしてみたい？',
  },

  // 未来への希望を聞きたい質問
  {
    id: 'q7',
    category: 'daily',
    feeling: 'hope',
    timing: 'anytime',
    text: 'どんなことができたら嬉しい？',
  },
  {
    id: 'q8',
    category: 'daily',
    feeling: 'hope',
    timing: 'anytime',
    text: 'それができたときはどんな気分？',
  },
  {
    id: 'q9',
    category: 'daily',
    feeling: 'hope',
    timing: 'anytime',
    text: '将来どんなことをやってみたい？',
  },
  {
    id: 'q10',
    category: 'daily',
    feeling: 'hope',
    timing: 'morning',
    text: '今日はどんないいことが起こりそう？',
  },

  // 相手を大切に思っていることを伝えたい質問
  {
    id: 'q11',
    category: 'daily',
    feeling: 'care',
    timing: 'anytime',
    text: 'それができたときはまず誰にそのことを伝えたい？',
  },
  {
    id: 'q12',
    category: 'daily',
    feeling: 'care',
    timing: 'anytime',
    text: '今一番大切にしていることはどんなこと？',
  },
  {
    id: 'q13',
    category: 'daily',
    feeling: 'care',
    timing: 'evening',
    text: '今日は誰とどんな話をした？',
  },
  {
    id: 'q14',
    category: 'daily',
    feeling: 'care',
    timing: 'anytime',
    text: '最近発見した小さな幸せはどんなこと？',
  },

  // 励ましたい・応援したい質問
  {
    id: 'q15',
    category: 'daily',
    feeling: 'encourage',
    timing: 'anytime',
    text: '今がんばっていることはどんなこと？',
  },
  {
    id: 'q16',
    category: 'daily',
    feeling: 'encourage',
    timing: 'anytime',
    text: 'それをがんばれる理由はどんなこと？',
  },
  {
    id: 'q17',
    category: 'daily',
    feeling: 'encourage',
    timing: 'evening',
    text: '今日がんばったことはどんなこと？',
  },
  {
    id: 'q18',
    category: 'daily',
    feeling: 'encourage',
    timing: 'morning',
    text: '今日チャレンジしてみたいことはある？',
  },

  // 感謝を伝えたい質問
  {
    id: 'q19',
    category: 'daily',
    feeling: 'gratitude',
    timing: 'anytime',
    text: '最近ありがたいなと思ったことはどんなこと？',
  },
  {
    id: 'q20',
    category: 'daily',
    feeling: 'gratitude',
    timing: 'evening',
    text: '今日嬉しかったことはどんなこと？',
  },
  {
    id: 'q21',
    category: 'daily',
    feeling: 'gratitude',
    timing: 'anytime',
    text: '子どもの頃を思い出すのはどんな時？',
  },

  // 特別な日の質問
  {
    id: 'q22',
    category: 'special',
    feeling: 'care',
    timing: 'special',
    text: '今日という日をどんな風に過ごしたい？',
  },
  {
    id: 'q23',
    category: 'special',
    feeling: 'gratitude',
    timing: 'special',
    text: 'この一年でどんなことが一番思い出に残ってる？',
  },
  {
    id: 'q24',
    category: 'special',
    feeling: 'hope',
    timing: 'special',
    text: '来年はどんな一年にしたい？',
  },
];

// 挨拶メッセージ
export const greetings: Greeting[] = [
  {
    id: 'g1',
    text: 'おはよう！',
    timing: 'morning',
    feeling: 'interest',
  },
  {
    id: 'g2',
    text: 'おやすみ！',
    timing: 'evening',
    feeling: 'care',
  },
  {
    id: 'g3',
    text: 'おめでとう！',
    timing: 'special',
    feeling: 'gratitude',
  },
  {
    id: 'g4',
    text: 'がんばったね！',
    timing: 'anytime',
    feeling: 'encourage',
  },
  {
    id: 'g5',
    text: 'いつもありがとう！',
    timing: 'anytime',
    feeling: 'gratitude',
  },
];

// 聞きたい気持ちによる質問の取得
export const getQuestionsByFeeling = (feeling: Question['feeling']): Question[] => {
  return questions.filter(q => q.feeling === feeling);
};

// タイミングによる質問の取得
export const getQuestionsByTiming = (timing: Question['timing']): Question[] => {
  return questions.filter(q => q.timing === timing || q.timing === 'anytime');
};

// 聞きたい気持ちとタイミングによる質問の取得
export const getQuestions = (feeling: Question['feeling'], timing: Question['timing']): Question[] => {
  return questions.filter(q =>
    q.feeling === feeling && (q.timing === timing || q.timing === 'anytime')
  );
};

// ランダムな質問の取得
export const getRandomQuestion = (feeling: Question['feeling'], timing: Question['timing']): Question | null => {
  const filteredQuestions = getQuestions(feeling, timing);
  if (filteredQuestions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

// 聞きたい気持ちの表示名
export const feelingLabels = {
  interest: '関心・興味を示したい',
  hope: '未来への希望を聞きたい',
  care: '相手を大切に思っていることを伝えたい',
  encourage: '励ましたい・応援したい',
  gratitude: '感謝を伝えたい',
};