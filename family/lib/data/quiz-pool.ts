// ======================================
// 双六ゲーム クイズプール
// ======================================

import { QuizEventData } from "@/lib/types/sugoroku";

/**
 * クイズの問題プール
 * クイズマスに止まった時にランダムに選択される
 */
export const QUIZ_POOL: QuizEventData[] = [
  // ========== 地理クイズ（初級） ==========
  {
    category: 'geography',
    difficulty: 'easy',
    question: '富士山の標高は何メートル？',
    options: ['3,776m', '3,333m', '4,000m', '3,500m'],
    correctAnswer: 0,
    points: 30,
    explanation: '富士山の標高は3,776mで、日本最高峰の山です。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: 'エッフェル塔の高さは約何メートル？',
    options: ['330m', '250m', '400m', '180m'],
    correctAnswer: 0,
    points: 30,
    explanation: 'エッフェル塔は約330mの高さがあり、パリのシンボルです。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: '自由の女神があるのはどこ？',
    options: ['ニューヨーク', 'ロサンゼルス', 'シカゴ', 'マイアミ'],
    correctAnswer: 0,
    points: 30,
    explanation: '自由の女神はニューヨーク港のリバティ島に立っています。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: '日本で一番大きい湖は？',
    options: ['琵琶湖', '霞ヶ浦', '浜名湖', '猪苗代湖'],
    correctAnswer: 0,
    points: 30,
    explanation: '琵琶湖は滋賀県にある日本最大の湖で、面積は約670km²です。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: 'オーストラリアの首都はどこ？',
    options: ['キャンベラ', 'シドニー', 'メルボルン', 'パース'],
    correctAnswer: 0,
    points: 30,
    explanation: 'オーストラリアの首都はキャンベラです。シドニーは最大の都市ですが首都ではありません。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: '世界で一番長い川は？',
    options: ['ナイル川', 'アマゾン川', '長江', 'ミシシッピ川'],
    correctAnswer: 0,
    points: 30,
    explanation: 'ナイル川は約6,650kmで世界最長の川です。',
  },
  {
    category: 'geography',
    difficulty: 'easy',
    question: '北海道の道庁所在地は？',
    options: ['札幌市', '函館市', '旭川市', '小樽市'],
    correctAnswer: 0,
    points: 30,
    explanation: '北海道の道庁所在地は札幌市です。人口約200万人の大都市です。',
  },

  // ========== 地理クイズ（中級） ==========
  {
    category: 'geography',
    difficulty: 'medium',
    question: 'グランドキャニオンがあるアメリカの州は？',
    options: ['アリゾナ州', 'カリフォルニア州', 'テキサス州', 'ネバダ州'],
    correctAnswer: 0,
    points: 50,
    explanation: 'グランドキャニオンはアリゾナ州にある巨大な渓谷で、世界遺産に登録されています。',
  },
  {
    category: 'geography',
    difficulty: 'medium',
    question: 'ヴェネツィアは何本の島で構成されている？',
    options: ['118の島', '50の島', '200の島', '80の島'],
    correctAnswer: 0,
    points: 50,
    explanation: 'ヴェネツィアは118の島々と400以上の橋で構成されています。',
  },
  {
    category: 'geography',
    difficulty: 'medium',
    question: 'マチュピチュがある国は？',
    options: ['ペルー', 'ブラジル', 'チリ', 'アルゼンチン'],
    correctAnswer: 0,
    points: 50,
    explanation: 'マチュピチュはペルーのアンデス山脈にある古代インカ帝国の遺跡です。',
  },
  {
    category: 'geography',
    difficulty: 'medium',
    question: 'アンコールワットがある国は？',
    options: ['カンボジア', 'タイ', 'ベトナム', 'ラオス'],
    correctAnswer: 0,
    points: 50,
    explanation: 'アンコールワットはカンボジアにある世界最大級の宗教建築物です。',
  },

  // ========== 歴史クイズ（初級） ==========
  {
    category: 'history',
    difficulty: 'easy',
    question: '明治維新が起こったのは西暦何年？',
    options: ['1868年', '1853年', '1900年', '1912年'],
    correctAnswer: 0,
    points: 30,
    explanation: '明治維新は1868年に起こり、日本の近代化が始まりました。',
  },
  {
    category: 'history',
    difficulty: 'easy',
    question: 'コロンブスがアメリカ大陸を「発見」したのは？',
    options: ['1492年', '1500年', '1450年', '1520年'],
    correctAnswer: 0,
    points: 30,
    explanation: 'クリストファー・コロンブスは1492年にアメリカ大陸に到達しました。',
  },

  // ========== 歴史クイズ（中級） ==========
  {
    category: 'history',
    difficulty: 'medium',
    question: 'エジプトのピラミッドが建てられたのはどこ？',
    options: ['ギザ', 'カイロ市街', 'ルクソール', 'アレクサンドリア'],
    correctAnswer: 0,
    points: 50,
    explanation: '最も有名なピラミッドはギザの台地に建てられています。',
  },
  {
    category: 'history',
    difficulty: 'medium',
    question: '万里の長城の全長は約何km？',
    options: ['21,000km', '10,000km', '5,000km', '30,000km'],
    correctAnswer: 0,
    points: 50,
    explanation: '万里の長城の総延長は約21,000kmと言われています。',
  },
  {
    category: 'history',
    difficulty: 'medium',
    question: 'ベルリンの壁が崩壊したのは何年？',
    options: ['1989年', '1991年', '1985年', '1995年'],
    correctAnswer: 0,
    points: 50,
    explanation: 'ベルリンの壁は1989年11月9日に崩壊し、東西ドイツ統一への道が開かれました。',
  },

  // ========== 歴史クイズ（上級） ==========
  {
    category: 'history',
    difficulty: 'hard',
    question: 'タージマハルが完成したのは何年？',
    options: ['1653年', '1700年', '1600年', '1750年'],
    correctAnswer: 0,
    points: 100,
    explanation: 'タージマハルは1653年に完成したムガル帝国の霊廟です。',
  },
  {
    category: 'history',
    difficulty: 'hard',
    question: 'ローマ帝国が東西に分裂したのは何年？',
    options: ['395年', '476年', '330年', '410年'],
    correctAnswer: 0,
    points: 100,
    explanation: 'ローマ帝国は395年に東ローマ帝国と西ローマ帝国に分裂しました。',
  },

  // ========== 文化クイズ（初級） ==========
  {
    category: 'culture',
    difficulty: 'easy',
    question: '寿司の発祥地として知られる日本の都市は？',
    options: ['東京', '大阪', '京都', '福岡'],
    correctAnswer: 0,
    points: 30,
    explanation: '江戸前寿司は東京（江戸）で発祥し、世界中に広まりました。',
  },
  {
    category: 'culture',
    difficulty: 'easy',
    question: 'モナ・リザを描いた画家は？',
    options: ['レオナルド・ダ・ヴィンチ', 'ミケランジェロ', 'ピカソ', 'ゴッホ'],
    correctAnswer: 0,
    points: 30,
    explanation: 'モナ・リザはレオナルド・ダ・ヴィンチが16世紀初頭に描いた世界的名画です。',
  },

  // ========== 文化クイズ（中級） ==========
  {
    category: 'culture',
    difficulty: 'medium',
    question: 'フラメンコの発祥国は？',
    options: ['スペイン', 'メキシコ', 'イタリア', 'ポルトガル'],
    correctAnswer: 0,
    points: 50,
    explanation: 'フラメンコはスペイン南部アンダルシア地方で生まれた伝統的な音楽と踊りです。',
  },
  {
    category: 'culture',
    difficulty: 'medium',
    question: '歌舞伎が始まったのは何時代？',
    options: ['江戸時代', '平安時代', '鎌倉時代', '室町時代'],
    correctAnswer: 0,
    points: 50,
    explanation: '歌舞伎は江戸時代初期（17世紀）に始まった日本の伝統芸能です。',
  },

  // ========== 文化クイズ（上級） ==========
  {
    category: 'culture',
    difficulty: 'hard',
    question: 'シドニーオペラハウスを設計した建築家は？',
    options: ['ヨーン・ウツソン', 'フランク・ロイド・ライト', 'ル・コルビュジエ', 'アントニ・ガウディ'],
    correctAnswer: 0,
    points: 100,
    explanation: 'シドニーオペラハウスはデンマークの建築家ヨーン・ウツソンが設計しました。',
  },
  {
    category: 'culture',
    difficulty: 'hard',
    question: 'ノーベル賞の授賞式が行われる都市は？',
    options: ['ストックホルム（平和賞以外）', 'ロンドン', 'パリ', 'コペンハーゲン'],
    correctAnswer: 0,
    points: 100,
    explanation: 'ノーベル賞の授賞式はストックホルムで行われます（平和賞のみオスロ）。',
  },

  // ========== 自然クイズ（初級） ==========
  {
    category: 'nature',
    difficulty: 'easy',
    question: '地球上で最も高い山は？',
    options: ['エベレスト', 'K2', 'キリマンジャロ', '富士山'],
    correctAnswer: 0,
    points: 30,
    explanation: 'エベレストは標高8,849mで地球上で最も高い山です。',
  },
  {
    category: 'nature',
    difficulty: 'easy',
    question: '世界最大のサンゴ礁はどこにある？',
    options: ['オーストラリア', 'フィリピン', 'モルディブ', 'ハワイ'],
    correctAnswer: 0,
    points: 30,
    explanation: 'グレートバリアリーフはオーストラリア北東岸にある世界最大のサンゴ礁です。',
  },

  // ========== 自然クイズ（中級） ==========
  {
    category: 'nature',
    difficulty: 'medium',
    question: 'アマゾン熱帯雨林の面積は地球の陸地の約何％？',
    options: ['2%', '5%', '10%', '1%'],
    correctAnswer: 0,
    points: 50,
    explanation: 'アマゾン熱帯雨林は約550万km²で、地球の陸地の約2%を占めます。',
  },
  {
    category: 'nature',
    difficulty: 'medium',
    question: 'サハラ砂漠があるのは？',
    options: ['アフリカ大陸', 'アジア大陸', 'オーストラリア大陸', '南アメリカ大陸'],
    correctAnswer: 0,
    points: 50,
    explanation: 'サハラ砂漠はアフリカ北部に広がる世界最大の砂漠です。',
  },

  // ========== 自然クイズ（上級） ==========
  {
    category: 'nature',
    difficulty: 'hard',
    question: 'ガラパゴス諸島で進化論の着想を得た科学者は？',
    options: ['チャールズ・ダーウィン', 'アルバート・アインシュタイン', 'アイザック・ニュートン', 'ガリレオ・ガリレイ'],
    correctAnswer: 0,
    points: 100,
    explanation: 'チャールズ・ダーウィンはガラパゴス諸島での観察から進化論を着想しました。',
  },
];

/**
 * ランダムにクイズを1つ選択
 */
export function getRandomQuiz(): QuizEventData {
  const randomIndex = Math.floor(Math.random() * QUIZ_POOL.length);
  return QUIZ_POOL[randomIndex];
}

/**
 * 難易度を指定してランダムにクイズを選択
 */
export function getRandomQuizByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizEventData {
  const filtered = QUIZ_POOL.filter(quiz => quiz.difficulty === difficulty);
  if (filtered.length === 0) return getRandomQuiz();
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * カテゴリーを指定してランダムにクイズを選択
 */
export function getRandomQuizByCategory(category: QuizEventData['category']): QuizEventData {
  const filtered = QUIZ_POOL.filter(quiz => quiz.category === category);
  if (filtered.length === 0) return getRandomQuiz();
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * クイズの統計情報を取得
 */
export function getQuizStats() {
  const stats = {
    total: QUIZ_POOL.length,
    byDifficulty: {
      easy: QUIZ_POOL.filter(q => q.difficulty === 'easy').length,
      medium: QUIZ_POOL.filter(q => q.difficulty === 'medium').length,
      hard: QUIZ_POOL.filter(q => q.difficulty === 'hard').length,
    },
    byCategory: {
      geography: QUIZ_POOL.filter(q => q.category === 'geography').length,
      history: QUIZ_POOL.filter(q => q.category === 'history').length,
      culture: QUIZ_POOL.filter(q => q.category === 'culture').length,
      politics: QUIZ_POOL.filter(q => q.category === 'politics').length,
      nature: QUIZ_POOL.filter(q => q.category === 'nature').length,
    },
  };
  return stats;
}
