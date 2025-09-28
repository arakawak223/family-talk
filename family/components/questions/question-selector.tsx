"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionWithCategory {
  id: string;
  question_text: string;
  category: {
    feeling_type: string;
    name: string;
  };
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
} as const;

export function QuestionSelector({ onQuestionSelect, selectedQuestion }: QuestionSelectorProps) {
  const [questions, setQuestions] = useState<QuestionWithCategory[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('question_templates')
      .select(`
        *,
        question_categories(*)
      `)
      .eq('is_active', true);

    if (error) {
      console.error('質問取得エラー:', error);
      return;
    }

    const questionsWithCategory = data?.filter(item => item.question_categories).map(item => ({
      ...item,
      category: item.question_categories
    })) || [];

    setQuestions(questionsWithCategory);
    setLoading(false);
  };

  const getRandomQuestionByFeeling = (feelingType: string) => {
    const filteredQuestions = questions.filter(q => q.category.feeling_type === feelingType);
    if (filteredQuestions.length === 0) return "";

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex].question_text;
  };

  const handleFeelingSelect = (feelingType: string) => {
    setSelectedFeeling(feelingType);
    const randomQuestion = getRandomQuestionByFeeling(feelingType);
    onQuestionSelect(randomQuestion);
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
        <h3 className="font-semibold mb-3">今日はどんなことを聞いてみたいですか？</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(FEELING_TYPES).map(([key, feeling]) => (
            <Button
              key={key}
              variant={selectedFeeling === key ? "default" : "outline"}
              onClick={() => handleFeelingSelect(key)}
              className="justify-start h-auto p-3"
            >
              <span className="mr-2">{feeling.emoji}</span>
              <span className="text-sm">{feeling.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedQuestion && (
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-2">提案された質問：</p>
                <p className="text-blue-800">{selectedQuestion}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFeelingSelect(selectedFeeling)}
                  >
                    🎲 別の質問
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedFeeling("");
                      onQuestionSelect("");
                    }}
                  >
                    質問なしで録音
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedQuestion && selectedFeeling && (
        <div className="text-center py-4 text-gray-500">
          この気持ちに合う質問が見つかりませんでした
        </div>
      )}
    </div>
  );
}