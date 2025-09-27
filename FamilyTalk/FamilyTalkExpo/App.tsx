import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

// 簡易版の質問データ
const questions = [
  { id: 1, feeling: '関心・興味を示したい', text: '今日はどんな予定があるの？' },
  { id: 2, feeling: '未来への希望を聞きたい', text: 'どんなことができたら嬉しい？' },
  { id: 3, feeling: '相手を大切に思っていることを伝えたい', text: '最近発見した小さな幸せはどんなこと？' },
  { id: 4, feeling: '励ましたい・応援したい', text: '今がんばっていることはどんなこと？' },
  { id: 5, feeling: '感謝を伝えたい', text: '今日嬉しかったことはどんなこと？' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const HomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>ひと言しつもん</Text>
      <Text style={styles.subtitle}>家族の声を聞こう</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setCurrentScreen('questions')}
      >
        <Text style={styles.buttonText}>💬 メッセージを送る</Text>
        <Text style={styles.buttonSubtext}>今日はどんなことを聞いてみる？</Text>
      </TouchableOpacity>

      <View style={styles.familySection}>
        <Text style={styles.sectionTitle}>家族メンバー</Text>
        <View style={styles.familyRow}>
          {['お父さん', 'お母さん', '長男', '次男', 'おばあちゃん'].map((member, index) => (
            <View key={index} style={styles.familyMember}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.charAt(0)}</Text>
              </View>
              <Text style={styles.memberName}>{member}</Text>
            </View>
          ))}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );

  const QuestionScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>今日はどんなことを</Text>
        <Text style={styles.titleEmphasis}>聞いてみたいですか？</Text>

        <Text style={styles.sectionTitle}>気持ちから質問を選ぶ</Text>

        {questions.map((question) => (
          <TouchableOpacity
            key={question.id}
            style={styles.questionButton}
            onPress={() => {
              setSelectedQuestion(question);
              setCurrentScreen('record');
            }}
          >
            <Text style={styles.feelingLabel}>{question.feeling}</Text>
            <Text style={styles.questionText}>{question.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← ホームに戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const RecordScreen = () => (
    <View style={styles.container}>
      <Text style={styles.feelingLabel}>{selectedQuestion?.feeling}</Text>
      <Text style={styles.questionDisplay}>{selectedQuestion?.text}</Text>

      <View style={styles.recordArea}>
        <TouchableOpacity style={styles.recordButton}>
          <Text style={styles.recordIcon}>🎤</Text>
        </TouchableOpacity>
        <Text style={styles.recordText}>タップで録音開始</Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentScreen('questions')}
      >
        <Text style={styles.backButtonText}>← 質問選択に戻る</Text>
      </TouchableOpacity>
    </View>
  );

  if (currentScreen === 'questions') return <QuestionScreen />;
  if (currentScreen === 'record') return <RecordScreen />;
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  content: {
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 40,
  },
  titleEmphasis: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  familySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  familyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  familyMember: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  memberName: {
    fontSize: 12,
    color: '#2c3e50',
  },
  questionButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feelingLabel: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  questionDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  recordArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordIcon: {
    fontSize: 48,
  },
  recordText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
});
