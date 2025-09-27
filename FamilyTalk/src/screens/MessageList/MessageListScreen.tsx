import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DatabaseService } from '../../services/DatabaseService';
import { StorageService } from '../../services/StorageService';
import { AuthService } from '../../services/AuthService';
import { AudioRecorder } from '../../utils/AudioRecorder';
import type { VoiceMessage, User } from '../../types';
import { feelingLabels } from '../../data/questions';

interface MessageListScreenProps {
  navigation: any;
}

interface MessageItemProps {
  message: VoiceMessage;
  currentUser: User | null;
  onPlay: (message: VoiceMessage) => void;
  onMarkAsListened: (messageId: string) => void;
  isPlaying: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUser,
  onPlay,
  onMarkAsListened,
  isPlaying,
}) => {
  const isListened = currentUser ? message.listenedBy.includes(currentUser.id) : false;
  const isFromCurrentUser = currentUser?.id === message.senderId;

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `今日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `昨日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays}日前 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    onPlay(message);
    if (!isFromCurrentUser && !isListened) {
      onMarkAsListened(message.id);
    }
  };

  return (
    <View style={[styles.messageCard, !isListened && !isFromCurrentUser && styles.unreadMessage]}>
      <View style={styles.messageHeader}>
        <View style={styles.senderInfo}>
          <View style={[styles.senderAvatar, isFromCurrentUser && styles.currentUserAvatar]}>
            <Text style={styles.senderInitial}>
              {message.senderName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.senderDetails}>
            <Text style={styles.senderName}>
              {isFromCurrentUser ? 'あなた' : message.senderName}
            </Text>
            <Text style={styles.messageTime}>{formatDate(message.timestamp)}</Text>
          </View>
        </View>

        {!isListened && !isFromCurrentUser && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>NEW</Text>
          </View>
        )}
      </View>

      {message.question && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>質問:</Text>
          <Text style={styles.questionText}>{message.question}</Text>
        </View>
      )}

      {message.greeting && (
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{message.greeting}</Text>
        </View>
      )}

      <View style={styles.audioSection}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={handlePlay}
          disabled={isPlaying}
        >
          <Text style={styles.playButtonIcon}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>

        <View style={styles.audioInfo}>
          <Text style={styles.durationText}>
            {formatDuration(message.duration)}
          </Text>
          {isPlaying && (
            <Text style={styles.playingText}>再生中...</Text>
          )}
        </View>

        <View style={styles.listenedInfo}>
          <Text style={styles.listenedCount}>
            👥 {message.listenedBy.length}人が聞きました
          </Text>
        </View>
      </View>
    </View>
  );
};

const MessageListScreen: React.FC<MessageListScreenProps> = ({ navigation }) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const firebaseUser = AuthService.getCurrentUser();
      if (firebaseUser) {
        const userData = await DatabaseService.getUser(firebaseUser.uid);
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
    }
  };

  const loadMessages = async () => {
    try {
      if (!currentUser) return;

      // 実装では、ユーザーの家族グループのメッセージを取得
      const receiverIds = [currentUser.id]; // 実際には家族メンバーのIDリストを取得
      const familyMessages = await DatabaseService.getFamilyMessages(receiverIds);
      setMessages(familyMessages);
    } catch (error) {
      console.error('メッセージ読み込みエラー:', error);
      Alert.alert('エラー', 'メッセージの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMessage = async (message: VoiceMessage) => {
    try {
      setPlayingMessageId(message.id);

      const success = await audioRecorder.current.playSound(message.audioUrl);

      if (!success) {
        Alert.alert('エラー', '音声を再生できませんでした。');
        setPlayingMessageId(null);
        return;
      }

      // 再生時間後に自動停止
      setTimeout(() => {
        setPlayingMessageId(null);
        audioRecorder.current.stopSound();
      }, message.duration * 1000);

    } catch (error) {
      console.error('再生エラー:', error);
      Alert.alert('エラー', '音声を再生できませんでした。');
      setPlayingMessageId(null);
    }
  };

  const handleMarkAsListened = async (messageId: string) => {
    try {
      if (!currentUser) return;

      await DatabaseService.markMessageAsListened(messageId, currentUser.id);

      // ローカル状態を更新
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, listenedBy: [...msg.listenedBy, currentUser.id] }
            : msg
        )
      );
    } catch (error) {
      console.error('既読マークエラー:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const messageDate = new Date(message.timestamp);
    return (
      messageDate.getDate() === selectedDate.getDate() &&
      messageDate.getMonth() === selectedDate.getMonth() &&
      messageDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const getDateString = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今日';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const navigatePreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const navigateNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const renderMessageItem = ({ item }: { item: VoiceMessage }) => (
    <MessageItem
      message={item}
      currentUser={currentUser}
      onPlay={handlePlayMessage}
      onMarkAsListened={handleMarkAsListened}
      isPlaying={playingMessageId === item.id}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>メッセージを読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>家族のメッセージ</Text>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={() => navigation.navigate('FamilyGroup')}
        >
          <Text style={styles.newMessageButtonText}>+ 新しいメッセージ</Text>
        </TouchableOpacity>
      </View>

      {/* 日付ナビゲーション */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity style={styles.dateNavButton} onPress={navigatePreviousDay}>
          <Text style={styles.dateNavButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{getDateString(selectedDate)}</Text>
          <Text style={styles.dateSubText}>
            {selectedDate.toLocaleDateString('ja-JP', { weekday: 'short' })}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.dateNavButton,
            selectedDate.toDateString() === new Date().toDateString() && styles.dateNavButtonDisabled
          ]}
          onPress={navigateNextDay}
          disabled={selectedDate.toDateString() === new Date().toDateString()}
        >
          <Text style={[
            styles.dateNavButtonText,
            selectedDate.toDateString() === new Date().toDateString() && styles.dateNavButtonTextDisabled
          ]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* メッセージリスト */}
      {filteredMessages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📮</Text>
          <Text style={styles.emptyTitle}>
            {getDateString(selectedDate)}のメッセージはありません
          </Text>
          <Text style={styles.emptyDescription}>
            家族とのコミュニケーションを始めませんか？
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('FamilyGroup')}
          >
            <Text style={styles.emptyButtonText}>メッセージを送る</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  newMessageButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newMessageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  dateNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavButtonDisabled: {
    backgroundColor: '#f8f9fa',
  },
  dateNavButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateNavButtonTextDisabled: {
    color: '#bdc3c7',
  },
  dateDisplay: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dateSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  messagesList: {
    padding: 20,
  },
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentUserAvatar: {
    backgroundColor: '#27ae60',
  },
  senderInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  senderDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  messageTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: '#e8f6f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 12,
    color: '#16a085',
    fontWeight: '600',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  audioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#e74c3c',
  },
  playButtonIcon: {
    fontSize: 20,
  },
  audioInfo: {
    flex: 1,
    marginLeft: 16,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  playingText: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 2,
  },
  listenedInfo: {
    alignItems: 'flex-end',
  },
  listenedCount: {
    fontSize: 12,
    color: '#27ae60',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MessageListScreen;