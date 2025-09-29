"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AVATAR_CATEGORIES,
  getAvatarsByCategory,
  getAvatarById,
  getDefaultAvatar,
  Avatar
} from "@/lib/avatars";

interface AvatarSelectorProps {
  currentAvatarId?: string | null;
  onAvatarSelect: (avatarId: string) => void;
  onClose?: () => void;
}

export function AvatarSelector({ currentAvatarId, onAvatarSelect, onClose }: AvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(AVATAR_CATEGORIES[0].id);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(
    currentAvatarId ? getAvatarById(currentAvatarId) : getDefaultAvatar()
  );

  const currentCategoryAvatars = getAvatarsByCategory(selectedCategory);

  const handleAvatarClick = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar.id);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          🎭 あなたのキャラクターを選んでください
        </CardTitle>
        <div className="text-center text-sm text-gray-600">
          家族とのメッセージで表示されるアバターです
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 現在選択中のアバター */}
        <div className="text-center">
          <div className="mb-2 text-lg font-medium">選択中</div>
          <div className="inline-flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <span className="text-6xl">{selectedAvatar?.emoji}</span>
            <div>
              <div className="font-medium">{selectedAvatar?.name}</div>
              <div className="text-sm text-gray-600">
                {AVATAR_CATEGORIES.find(cat => cat.id === selectedAvatar?.category)?.name}
              </div>
            </div>
          </div>
        </div>

        {/* カテゴリ選択 */}
        <div>
          <div className="mb-3 font-medium">カテゴリ</div>
          <div className="flex flex-wrap gap-2">
            {AVATAR_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* アバター選択グリッド */}
        <div>
          <div className="mb-3 font-medium flex items-center gap-2">
            <span>{AVATAR_CATEGORIES.find(cat => cat.id === selectedCategory)?.icon}</span>
            {AVATAR_CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
            <Badge variant="secondary">{currentCategoryAvatars.length}個</Badge>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {currentCategoryAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleAvatarClick(avatar)}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105
                  ${selectedAvatar?.id === avatar.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }
                `}
                title={avatar.name}
              >
                <span className="text-3xl">{avatar.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 確定ボタン */}
        <div className="flex gap-2 justify-end">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
          )}
          <Button onClick={handleConfirm} disabled={!selectedAvatar}>
            この子に決定！
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}