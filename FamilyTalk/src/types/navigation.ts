import type { Question, QuestionFeeling, QuestionTiming } from './index';

export type RootStackParamList = {
  Home: undefined;
  QuestionSelect: undefined;
  RecordMessage: {
    selectedQuestion: Question;
    feeling: QuestionFeeling;
    timing: QuestionTiming;
  };
  MessageList: undefined;
};