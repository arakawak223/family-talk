// 家族メンバー用アバターキャラクター

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  category: 'animal' | 'insect' | 'vegetable' | 'fruit';
}

export const AVATAR_LIST: Avatar[] = [
  // 動物
  { id: 'cat', emoji: '🐱', name: 'ねこ', category: 'animal' },
  { id: 'dog', emoji: '🐶', name: 'いぬ', category: 'animal' },
  { id: 'bear', emoji: '🐻', name: 'くま', category: 'animal' },
  { id: 'panda', emoji: '🐼', name: 'パンダ', category: 'animal' },
  { id: 'koala', emoji: '🐨', name: 'コアラ', category: 'animal' },
  { id: 'lion', emoji: '🦁', name: 'ライオン', category: 'animal' },
  { id: 'tiger', emoji: '🐯', name: 'トラ', category: 'animal' },
  { id: 'rabbit', emoji: '🐰', name: 'うさぎ', category: 'animal' },
  { id: 'fox', emoji: '🦊', name: 'きつね', category: 'animal' },
  { id: 'pig', emoji: '🐷', name: 'ぶた', category: 'animal' },
  { id: 'frog', emoji: '🐸', name: 'かえる', category: 'animal' },
  { id: 'monkey', emoji: '🐵', name: 'さる', category: 'animal' },

  // 虫
  { id: 'bee', emoji: '🐝', name: 'みつばち', category: 'insect' },
  { id: 'butterfly', emoji: '🦋', name: 'ちょう', category: 'insect' },
  { id: 'ladybug', emoji: '🐞', name: 'てんとうむし', category: 'insect' },
  { id: 'ant', emoji: '🐜', name: 'あり', category: 'insect' },
  { id: 'spider', emoji: '🕷️', name: 'くも', category: 'insect' },

  // 野菜
  { id: 'tomato', emoji: '🍅', name: 'トマト', category: 'vegetable' },
  { id: 'carrot', emoji: '🥕', name: 'にんじん', category: 'vegetable' },
  { id: 'corn', emoji: '🌽', name: 'とうもろこし', category: 'vegetable' },
  { id: 'broccoli', emoji: '🥦', name: 'ブロッコリー', category: 'vegetable' },
  { id: 'eggplant', emoji: '🍆', name: 'なす', category: 'vegetable' },
  { id: 'potato', emoji: '🥔', name: 'じゃがいも', category: 'vegetable' },
  { id: 'onion', emoji: '🧅', name: 'たまねぎ', category: 'vegetable' },
  { id: 'bell_pepper', emoji: '🫑', name: 'ピーマン', category: 'vegetable' },

  // 果物
  { id: 'apple', emoji: '🍎', name: 'りんご', category: 'fruit' },
  { id: 'banana', emoji: '🍌', name: 'バナナ', category: 'fruit' },
  { id: 'orange', emoji: '🍊', name: 'オレンジ', category: 'fruit' },
  { id: 'strawberry', emoji: '🍓', name: 'いちご', category: 'fruit' },
  { id: 'grapes', emoji: '🍇', name: 'ぶどう', category: 'fruit' },
  { id: 'watermelon', emoji: '🍉', name: 'すいか', category: 'fruit' },
  { id: 'peach', emoji: '🍑', name: 'もも', category: 'fruit' },
  { id: 'pineapple', emoji: '🍍', name: 'パイナップル', category: 'fruit' },
  { id: 'kiwi', emoji: '🥝', name: 'キウイ', category: 'fruit' },
  { id: 'avocado', emoji: '🥑', name: 'アボカド', category: 'fruit' },
];

export const AVATAR_CATEGORIES = [
  { id: 'animal', name: '動物', icon: '🐾' },
  { id: 'insect', name: '虫', icon: '🦋' },
  { id: 'vegetable', name: '野菜', icon: '🥬' },
  { id: 'fruit', name: '果物', icon: '🍎' },
] as const;

// アバターIDから情報を取得
export function getAvatarById(id: string): Avatar | null {
  return AVATAR_LIST.find(avatar => avatar.id === id) || null;
}

// デフォルトアバター
export function getDefaultAvatar(): Avatar {
  return AVATAR_LIST[0]; // 最初のねこ
}

// アバター表示用の関数（絵文字のみ）
export function getAvatarDisplay(avatarId?: string | null): string {
  if (!avatarId) return getDefaultAvatar().emoji;
  const avatar = getAvatarById(avatarId);
  return avatar ? avatar.emoji : getDefaultAvatar().emoji;
}

// プロフィール情報から適切なアバターを表示
export function getProfileAvatar(profile: { avatar_type?: string | null; avatar_photo_url?: string | null; avatar_id?: string | null }): { type: 'emoji' | 'photo'; content: string } {
  // 写真アバターの場合
  if (profile.avatar_type === 'photo' && profile.avatar_photo_url) {
    return {
      type: 'photo',
      content: profile.avatar_photo_url
    };
  }

  // 絵文字アバターの場合（デフォルト）
  return {
    type: 'emoji',
    content: getAvatarDisplay(profile.avatar_id)
  };
}

// カテゴリ別のアバター取得
export function getAvatarsByCategory(categoryId: string): Avatar[] {
  return AVATAR_LIST.filter(avatar => avatar.category === categoryId);
}