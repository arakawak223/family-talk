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

/**
 * 1次カテゴリーの一覧を取得
 */
export async function getPrimaryCategories(): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('primary_category')
    .order('sort_order');

  if (error) {
    console.error('1次カテゴリー取得エラー:', error);
    return [];
  }

  // 重複を除いて返す
  const uniqueCategories = [...new Set(data.map(item => item.primary_category))];
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
