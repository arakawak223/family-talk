"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QuizEventData } from "@/lib/types/sugoroku";

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizData: QuizEventData;
  onAnswer: (isCorrect: boolean, selectedIndex: number) => void;
}

export function QuizModal({ open, onOpenChange, quizData, onAnswer }: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = index === quizData.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // 2秒後に結果をコールバック
    setTimeout(() => {
      onAnswer(correct, index);
      // リセット
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }, 2000);
  };

  const getCategoryIcon = () => {
    switch (quizData.category) {
      case 'geography': return '🗺️';
      case 'history': return '📜';
      case 'culture': return '🎭';
      case 'politics': return '🏛️';
      case 'nature': return '🌿';
      default: return '❓';
    }
  };

  const getCategoryName = () => {
    switch (quizData.category) {
      case 'geography': return '地理';
      case 'history': return '歴史';
      case 'culture': return '文化';
      case 'politics': return '政治';
      case 'nature': return '自然';
      default: return 'クイズ';
    }
  };

  const getDifficultyColor = () => {
    switch (quizData.difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyName = () => {
    switch (quizData.difficulty) {
      case 'easy': return '初級';
      case 'medium': return '中級';
      case 'hard': return '上級';
      default: return '';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getCategoryIcon()}</span>
              <AlertDialogTitle className="text-xl">
                {getCategoryName()}クイズ
              </AlertDialogTitle>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor()}`}>
              {getDifficultyName()}
            </span>
          </div>
          <AlertDialogDescription className="text-lg font-semibold text-gray-800 leading-relaxed">
            {quizData.question}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-3">
          {quizData.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === quizData.correctAnswer;

            let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";

            if (showResult) {
              if (isCorrectOption) {
                buttonClass += "bg-green-100 border-green-500 text-green-900 font-bold";
              } else if (isSelected && !isCorrect) {
                buttonClass += "bg-red-100 border-red-500 text-red-900";
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
              }
            } else {
              buttonClass += "hover:bg-blue-50 hover:border-blue-400 border-gray-300";
            }

            return (
              <Button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                variant="outline"
                className={buttonClass}
              >
                <span className="flex items-center gap-3">
                  <span className="font-bold text-lg min-w-[24px]">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrectOption && <span className="text-2xl">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                </span>
              </Button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <p className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? '🎉 正解！' : '😢 不正解...'}
            </p>
            {isCorrect && (
              <p className="text-green-700">
                +{quizData.points}ポイント獲得！
              </p>
            )}
            {quizData.explanation && (
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-semibold">💡 解説：</span>{quizData.explanation}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          正解すると <span className="font-bold text-blue-600">{quizData.points}ポイント</span> 獲得！
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
