"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPrimaryCategories,
  getSecondaryCategories,
  getQuestionsByCategory,
  Question,
  getQuestionCategories,
  getAllQuestionTemplates,
  QuestionCategory,
  QuestionTemplate
} from "@/lib/questions";

interface QuestionSelectorProps {
  onQuestionSelect: (question: string) => void;
  selectedQuestion: string;
}

export function QuestionSelector({ onQuestionSelect, selectedQuestion }: QuestionSelectorProps) {
  const [primaryCategories, setPrimaryCategories] = useState<string[]>([]);
  const [secondaryCategories, setSecondaryCategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [selectedPrimary, setSelectedPrimary] = useState<string>("");
  const [selectedSecondary, setSelectedSecondary] = useState<string>("");
  const [showSecondaryList, setShowSecondaryList] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [loading, setLoading] = useState(true);

  // 元の質問テンプレート用
  const [oldQuestionCategories, setOldQuestionCategories] = useState<QuestionCategory[]>([]);
  const [oldQuestionTemplates, setOldQuestionTemplates] = useState<QuestionTemplate[]>([]);
  const [showOldQuestions, setShowOldQuestions] = useState(false);

  useEffect(() => {
    loadPrimaryCategories();
    loadOldQuestionCategories();
  }, []);

  const loadPrimaryCategories = async () => {
    const categories = await getPrimaryCategories();
    setPrimaryCategories(categories);
    setLoading(false);
  };

  const loadOldQuestionCategories = async () => {
    const categories = await getQuestionCategories();
    setOldQuestionCategories(categories);
  };

  const handlePrimaryCategorySelect = async (category: string) => {
    setSelectedPrimary(category);
    setSelectedSecondary("");
    setShowSecondaryList(true);
    setShowQuestionList(false);
    onQuestionSelect(""); // 質問をクリア

    // 2次カテゴリーを取得
    const secondary = await getSecondaryCategories(category);
    setSecondaryCategories(secondary);
  };

  const handleSecondaryCategorySelect = async (category: string) => {
    setSelectedSecondary(category);
    setShowQuestionList(true);

    // 質問を取得
    const questionsData = await getQuestionsByCategory(selectedPrimary, category);
    setQuestions(questionsData);
  };

  const handleQuestionSelect = (question: string) => {
    onQuestionSelect(question);
    setShowQuestionList(false); // 質問を選択したら一覧を閉じる
  };

  const handleBack = () => {
    if (showQuestionList) {
      setShowQuestionList(false);
      setSelectedSecondary("");
    } else if (showSecondaryList) {
      setShowSecondaryList(false);
      setSelectedPrimary("");
    } else if (showOldQuestions) {
      setShowOldQuestions(false);
    }
  };

  const handleShowOldQuestions = async () => {
    setShowOldQuestions(true);
    setShowSecondaryList(false);
    setShowQuestionList(false);
    const templates = await getAllQuestionTemplates();
    setOldQuestionTemplates(templates);
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
      {/* 1次カテゴリー選択 */}
      {!showSecondaryList && !showQuestionList && !showOldQuestions && (
        <div>
          <h3 className="font-semibold mb-3 text-base">どんなことを話したい？（ひと言しつもん例）</h3>
          <div className="grid grid-cols-2 gap-2">
            {primaryCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => handlePrimaryCategorySelect(category)}
                className="h-auto py-3 px-2 text-sm font-medium whitespace-normal"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 2次カテゴリー選択 */}
      {showSecondaryList && !showQuestionList && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{selectedPrimary}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                ← 戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {secondaryCategories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => handleSecondaryCategorySelect(category)}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 質問一覧 */}
      {showQuestionList && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">{selectedPrimary}</div>
                <CardTitle className="text-base">{selectedSecondary}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                ← 戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((question) => (
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
          </CardContent>
        </Card>
      )}

      {/* 元の質問テンプレート一覧 */}
      {showOldQuestions && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">その他の質問</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                ← 戻る
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {oldQuestionTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => {
                    handleQuestionSelect(template.question_text);
                    setShowOldQuestions(false);
                  }}
                  className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs text-gray-500">{template.category.name}</span>
                    <span>{template.question_text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 選択された質問の表示 */}
      {selectedQuestion && !showQuestionList && !showOldQuestions && (
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
                    onClick={() => {
                      setShowSecondaryList(true);
                      setShowQuestionList(false);
                    }}
                  >
                    別の質問を選ぶ
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPrimary("");
                      setSelectedSecondary("");
                      setShowSecondaryList(false);
                      setShowQuestionList(false);
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
