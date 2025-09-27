// 基本的なタイプ定義

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'parent' | 'child' | 'grandparent' | 'sibling';
}

export interface VoiceMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverIds: string[];
  audioUrl: string;
  question: string;
  greeting: string;
  duration: number;
  timestamp: Date;
  listenedBy: string[];
}

export interface Question {
  id: string;
  category: QuestionCategory;
  feeling: QuestionFeeling;
  timing: QuestionTiming;
  text: string;
  targetRole?: User['role'];
}

export type QuestionCategory = 'daily' | 'special';

export type QuestionFeeling =
  | 'interest' // 関心・興味を示したい
  | 'hope' // 未来への希望を聞きたい
  | 'care' // 相手を大切に思っていることを伝えたい
  | 'encourage' // 励ましたい・応援したい
  | 'gratitude'; // 感謝を伝えたい

export type QuestionTiming = 'morning' | 'evening' | 'special' | 'anytime';

export interface Greeting {
  id: string;
  text: string;
  timing: QuestionTiming;
  feeling: QuestionFeeling;
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: User[];
  createdBy: string;
  createdAt: Date;
}