import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleCreateMessage = () => {
    navigation.navigate('QuestionSelect');
  };

  const handleViewMessages = () => {
    navigation.navigate('MessageList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>ひと言しつもん</Text>
          <Text style={styles.subtitle}>家族の声を聞こう</Text>
        </View>

        {/* メイン機能ボタン */}
        <View style={styles.mainActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleCreateMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              💬 メッセージを送る
            </Text>
            <Text style={styles.buttonSubtext}>
              今日はどんなことを聞いてみる？
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleViewMessages}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              📱 メッセージを見る
            </Text>
            <Text style={styles.buttonSubtext}>
              家族からの声を聞こう
            </Text>
          </TouchableOpacity>
        </View>

        {/* 最近のメッセージプレビュー */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>最近のやりとり</Text>

          <View style={styles.messagePreview}>
            <View style={styles.messageItem}>
              <Text style={styles.messageSender}>お母さんから</Text>
              <Text style={styles.messageQuestion}>
                「今日はどんな気分？」
              </Text>
              <Text style={styles.messageTime}>2時間前</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>すべて見る</Text>
          </TouchableOpacity>
        </View>

        {/* 家族メンバー */}
        <View style={styles.familySection}>
          <Text style={styles.sectionTitle}>家族メンバー</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.familyScroll}
          >
            {/* サンプル家族メンバー */}
            {['お父さん', 'お母さん', '長男', '次男', 'おばあちゃん'].map((member, index) => (
              <View key={index} style={styles.familyMember}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.memberName}>{member}</Text>
              </View>
            ))}
          </ScrollView>
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
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  mainActions: {
    marginBottom: 40,
  },
  actionButton: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  secondaryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  messagePreview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageItem: {
    // メッセージアイテムのスタイル
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 4,
  },
  messageQuestion: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 12,
  },
  viewAllText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  familySection: {
    // 家族セクションのスタイル
  },
  familyScroll: {
    // 水平スクロールのスタイル
  },
  familyMember: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  memberName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default HomeScreen;