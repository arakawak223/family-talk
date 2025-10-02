"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  feeling_type: string;
}

interface QuestionWithCategory {
  id: string;
  question_text: string;
  category_id: string;
  category: QuestionCategory;
}

interface QuestionSelectorProps {
  onQuestionSelect: (question: string) => void;
  selectedQuestion: string;
}

const FEELING_TYPES = {
  interest: { label: "関心・興味", emoji: "🤔", color: "bg-blue-100 text-blue-800" },
  hope: { label: "未来への希望", emoji: "✨", color: "bg-purple-100 text-purple-800" },
  care: { label: "大切に思う気持ち", emoji: "💕", color: "bg-pink-100 text-pink-800" },
  encourage: { label: "励まし・応援", emoji: "💪", color: "bg-green-100 text-green-800" },
  gratitude: { label: "感謝", emoji: "🙏", color: "bg-yellow-100 text-yellow-800" },
  kansai: { label: "関西弁で話そう", emoji: "🗣️", color: "bg-orange-100 text-orange-800" },
} as const;


export function QuestionSelector({ onQuestionSelect, selectedQuestion }: QuestionSelectorProps) {
  const [questions, setQuestions] = useState<QuestionWithCategory[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const supabase = createClient();

    // カテゴリーを取得
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('question_categories')
      .select('*')
      .order('name');

    if (categoriesError) {
      console.error('カテゴリー取得エラー:', categoriesError);
      return;
    }

    // 質問を取得
    const { data: questionsData, error: questionsError } = await supabase
      .from('question_templates')
      .select(`
        *,
        question_categories(*)
      `)
      .eq('is_active', true);

    if (questionsError) {
      console.error('質問取得エラー:', questionsError);
      return;
    }

    const questionsWithCategory = questionsData?.filter(item => item.question_categories).map(item => ({
      ...item,
      category: item.question_categories
    })) || [];

    setCategories(categoriesData || []);
    setQuestions(questionsWithCategory);
    setLoading(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowQuestionList(true);
    onQuestionSelect(""); // 質問をクリア
  };

  const handleQuestionSelect = (question: string) => {
    onQuestionSelect(question);
    setShowQuestionList(false); // 質問を選択したら一覧を閉じる
  };

  const getQuestionsByCategory = (categoryId: string) => {
    return questions.filter(q => q.category_id === categoryId);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">質問を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">カテゴリーから質問を選ぶ</h3>

        {/* カテゴリーボタン */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategorySelect(category.id)}
              className="h-auto py-3 text-sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* 質問なしで録音ボタン */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategory("");
            setShowQuestionList(false);
            onQuestionSelect("");
          }}
          className="w-full"
        >
          質問なしで録音
        </Button>
      </div>

      {/* 選択されたカテゴリーの質問一覧 */}
      {showQuestionList && selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {categories.find(c => c.id === selectedCategory)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getQuestionsByCategory(selectedCategory).map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  onClick={() => handleQuestionSelect(question.question_text)}
                  className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                >
                  {question.question_text}
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuestionList(false)}
                className="w-full"
              >
                閉じる
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 選択された質問の表示 */}
      {selectedQuestion && !showQuestionList && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-2">選択された質問：</p>
                <p className="text-blue-800">{selectedQuestion}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowQuestionList(true)}
                  >
                    別の質問を選ぶ
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedCategory("");
                      onQuestionSelect("");
                    }}
                  >
                    クリア
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}