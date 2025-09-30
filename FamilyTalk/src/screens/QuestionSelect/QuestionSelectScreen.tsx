import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { feelingLabels, getQuestions, getRandomQuestion } from '../../data/questions';
import type { QuestionFeeling, QuestionTiming, Question } from '../../types';

interface QuestionSelectScreenProps {
  navigation: any;
}

const QuestionSelectScreen: React.FC<QuestionSelectScreenProps> = ({ navigation }) => {
  const [selectedFeeling, setSelectedFeeling] = useState<QuestionFeeling | null>(null);
  const [selectedTiming, setSelectedTiming] = useState<QuestionTiming>('anytime');
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);

  const feelings: { key: QuestionFeeling; icon: string }[] = [
    { key: 'interest', icon: '🤔' },
    { key: 'hope', icon: '✨' },
    { key: 'care', icon: '💝' },
    { key: 'encourage', icon: '💪' },
    { key: 'gratitude', icon: '🙏' },
    { key: 'kansai', icon: '🗣️' },
  ];

  const timings: { key: QuestionTiming; label: string; icon: string }[] = [
    { key: 'morning', label: '朝のあいさつ', icon: '🌅' },
    { key: 'evening', label: '夜のあいさつ', icon: '🌙' },
    { key: 'anytime', label: 'いつでも', icon: '💬' },
    { key: 'special', label: '特別な日', icon: '🎉' },
  ];

  const handleFeelingSelect = (feeling: QuestionFeeling) => {
    setSelectedFeeling(feeling);
    const questions = getQuestions(feeling, selectedTiming);
    setSuggestedQuestions(questions);
  };

  const handleTimingSelect = (timing: QuestionTiming) => {
    setSelectedTiming(timing);
    if (selectedFeeling) {
      const questions = getQuestions(selectedFeeling, timing);
      setSuggestedQuestions(questions);
    }
  };

  const handleQuestionSelect = (question: Question) => {
    navigation.navigate('RecordMessage', {
      selectedQuestion: question,
      feeling: selectedFeeling,
      timing: selectedTiming,
    });
  };

  const handleRandomQuestion = () => {
    if (!selectedFeeling) {
      Alert.alert('気持ちを選択してください', 'まず、どんな気持ちで聞きたいかを選んでください。');
      return;
    }

    const randomQuestion = getRandomQuestion(selectedFeeling, selectedTiming);
    if (randomQuestion) {
      handleQuestionSelect(randomQuestion);
    } else {
      Alert.alert('質問が見つかりません', '別の設定を試してみてください。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>家族との会話を</Text>
          <Text style={styles.titleEmphasis}>始めませんか？</Text>
          <Text style={styles.subtitle}>カテゴリを選んで、質問を見つけよう</Text>
        </View>

        {/* 気持ち選択 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>どんな会話をしたいですか？</Text>
          <View style={styles.feelingContainer}>
            {feelings.map((feeling) => (
              <TouchableOpacity
                key={feeling.key}
                style={[
                  styles.feelingButton,
                  selectedFeeling === feeling.key && styles.feelingButtonSelected,
                ]}
                onPress={() => handleFeelingSelect(feeling.key)}
                activeOpacity={0.8}
              >
                <Text style={styles.feelingIcon}>{feeling.icon}</Text>
                <Text
                  style={[
                    styles.feelingText,
                    selectedFeeling === feeling.key && styles.feelingTextSelected,
                  ]}
                >
                  {feelingLabels[feeling.key]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* タイミング選択 */}
        {selectedFeeling && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>いつ送りますか？</Text>
            <View style={styles.timingContainer}>
              {timings.map((timing) => (
                <TouchableOpacity
                  key={timing.key}
                  style={[
                    styles.timingButton,
                    selectedTiming === timing.key && styles.timingButtonSelected,
                  ]}
                  onPress={() => handleTimingSelect(timing.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.timingIcon}>{timing.icon}</Text>
                  <Text
                    style={[
                      styles.timingText,
                      selectedTiming === timing.key && styles.timingTextSelected,
                    ]}
                  >
                    {timing.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* おすすめの質問 */}
        {selectedFeeling && suggestedQuestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>おすすめの質問</Text>

            {/* ランダム質問ボタン */}
            <TouchableOpacity
              style={styles.randomButton}
              onPress={handleRandomQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.randomButtonText}>🎲 おまかせで質問を選ぶ</Text>
            </TouchableOpacity>

            {/* 質問リスト */}
            <View style={styles.questionList}>
              {suggestedQuestions.slice(0, 5).map((question) => (
                <TouchableOpacity
                  key={question.id}
                  style={styles.questionButton}
                  onPress={() => handleQuestionSelect(question)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.questionText}>{question.text}</Text>
                  <Text style={styles.questionArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 説明文 */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            💡 まず会話のタイプを選んでください。関西弁カテゴリも含めて、家族に合った質問をお選びいただけます
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleEmphasis: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '400',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  timingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timingButtonSelected: {
    backgroundColor: '#e8f4fd',
    borderColor: '#3498db',
  },
  timingIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  timingText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  timingTextSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  feelingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  feelingButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '48%',
    minHeight: 120,
  },
  feelingButtonSelected: {
    backgroundColor: '#e8f4fd',
    borderColor: '#3498db',
  },
  feelingIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  feelingText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  feelingTextSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  randomButton: {
    backgroundColor: '#9b59b6',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  randomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  questionList: {
    gap: 12,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 24,
  },
  questionArrow: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  helpText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default QuestionSelectScreen;