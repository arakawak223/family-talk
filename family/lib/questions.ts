import { createClient } from "@/lib/supabase/client";

// 2段階カテゴリー構造の型定義
export interface Question {
  id: number;
  primary_category: string;
  secondary_category: string;
  question_text: string;
  sort_order: number;
}

export interface PrimaryCategory {
  name: string;
  secondaryCategories: string[];
}

// 元の質問テンプレートの型定義
export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  feeling_type: string;
}

export interface QuestionTemplate {
  id: string;
  question_text: string;
  category_id: string;
  category: QuestionCategory;
}

/**
 * 1次カテゴリーの一覧を取得
 */
export async function getPrimaryCategories(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('primary_category, sort_order')
    .order('sort_order');

  if (error) {
    console.error('1次カテゴリー取得エラー:', error);
    return [];
  }

  // 重複を除いて返す（順序を保持）
  const seen = new Set<string>();
  const uniqueCategories: string[] = [];

  data?.forEach(item => {
    if (!seen.has(item.primary_category)) {
      seen.add(item.primary_category);
      uniqueCategories.push(item.primary_category);
    }
  });

  return uniqueCategories;
}

/**
 * 1次カテゴリーごとの2次カテゴリー一覧を取得
 */
export async function getSecondaryCategories(primaryCategory: string): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('secondary_category')
    .eq('primary_category', primaryCategory)
    .order('sort_order');

  if (error) {
    console.error('2次カテゴリー取得エラー:', error);
    return [];
  }

  // 重複を除いて返す
  const uniqueCategories = [...new Set(data.map(item => item.secondary_category))];
  return uniqueCategories;
}

/**
 * 2次カテゴリーに紐づく質問を取得
 */
export async function getQuestionsByCategory(
  primaryCategory: string,
  secondaryCategory: string
): Promise<Question[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('primary_category', primaryCategory)
    .eq('secondary_category', secondaryCategory)
    .order('sort_order');

  if (error) {
    console.error('質問取得エラー:', error);
    return [];
  }

  return data || [];
}

/**
 * すべての質問を取得（カテゴリー別に整理）
 */
export async function getAllQuestionsGrouped(): Promise<Record<string, Record<string, Question[]>>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('質問取得エラー:', error);
    return {};
  }

  // 1次カテゴリー → 2次カテゴリー → 質問のリスト という階層構造に整理
  const grouped: Record<string, Record<string, Question[]>> = {};

  data?.forEach((question) => {
    const { primary_category, secondary_category } = question;

    if (!grouped[primary_category]) {
      grouped[primary_category] = {};
    }

    if (!grouped[primary_category][secondary_category]) {
      grouped[primary_category][secondary_category] = [];
    }

    grouped[primary_category][secondary_category].push(question);
  });

  return grouped;
}

/**
 * ランダムに質問を取得
 */
export async function getRandomQuestions(count: number = 5): Promise<Question[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('*');

  if (error) {
    console.error('質問取得エラー:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // ランダムにシャッフル
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 質問IDから質問を取得
 */
export async function getQuestionById(id: number): Promise<Question | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('質問取得エラー:', error);
    return null;
  }

  return data;
}

// ============================================
// 元の質問テンプレート関連の関数
// ============================================

/**
 * 元の質問カテゴリー一覧を取得
 */
export async function getQuestionCategories(): Promise<QuestionCategory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('question_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('カテゴリー取得エラー:', error);
    return [];
  }

  return data || [];
}

/**
 * カテゴリー別に元の質問テンプレートを取得
 */
export async function getQuestionTemplatesByCategory(categoryId: string): Promise<QuestionTemplate[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('question_templates')
    .select(`
      *,
      question_categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true);

  if (error) {
    console.error('質問テンプレート取得エラー:', error);
    return [];
  }

  const templates = data?.filter(item => item.question_categories).map(item => ({
    ...item,
    category: item.question_categories
  })) || [];

  return templates;
}

/**
 * すべての元の質問テンプレートを取得
 */
export async function getAllQuestionTemplates(): Promise<QuestionTemplate[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('question_templates')
    .select(`
      *,
      question_categories(*)
    `)
    .eq('is_active', true);

  if (error) {
    console.error('質問テンプレート取得エラー:', error);
    return [];
  }

  const templates = data?.filter(item => item.question_categories).map(item => ({
    ...item,
    category: item.question_categories
  })) || [];

  return templates;
}
