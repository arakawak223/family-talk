import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { AudioRecorder } from '../../utils/AudioRecorder';
import { DatabaseService } from '../../services/DatabaseService';
import { StorageService } from '../../services/StorageService';
import type { Question, QuestionFeeling, QuestionTiming, VoiceMessage } from '../../types';
import { feelingLabels } from '../../data/questions';

interface RecordMessageScreenProps {
  navigation: any;
  route?: {
    params?: {
      selectedQuestion?: Question;
      feeling?: QuestionFeeling;
      timing?: QuestionTiming;
    };
  };
}

const RecordMessageScreen: React.FC<RecordMessageScreenProps> = ({ navigation, route }) => {
  const { selectedQuestion, feeling } = route?.params || {};

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingPath, setRecordingPath] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pulseAnimation] = useState(new Animated.Value(1));

  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      // パルスアニメーションを開始
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }
  }, [isRecording, pulseAnimation]);

  // クリーンアップ処理
  useEffect(() => {
    const currentAudioRecorder = audioRecorder.current;
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      currentAudioRecorder.cleanup();
    };
  }, []);

  const startRecording = async () => {
    try {
      const success = await audioRecorder.current.startRecording();

      if (!success) {
        Alert.alert('エラー', '録音を開始できませんでした。マイクの許可を確認してください。');
        return;
      }

      setIsRecording(true);
      setRecordingDuration(0);

      // 録音時間のカウント
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // 自動停止（60秒後）
      setTimeout(() => {
        stopRecording();
      }, 60000);

    } catch (error) {
      console.error('録音開始エラー:', error);
      Alert.alert('エラー', '録音を開始できませんでした。');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);

      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      const uri = await audioRecorder.current.stopRecording();

      if (uri) {
        setRecordingPath(uri);
        console.log('録音完了:', uri);
      } else {
        Alert.alert('エラー', '録音の保存に失敗しました。');
      }

    } catch (error) {
      console.error('録音停止エラー:', error);
      Alert.alert('エラー', '録音を停止できませんでした。');
    }
  };

  const playRecording = async () => {
    if (!recordingPath) return;

    try {
      setIsPlaying(true);

      const success = await audioRecorder.current.playSound(recordingPath);

      if (!success) {
        Alert.alert('エラー', '音声を再生できませんでした。');
        setIsPlaying(false);
        return;
      }

      // 再生時間後に自動停止
      setTimeout(() => {
        setIsPlaying(false);
        audioRecorder.current.stopSound();
      }, recordingDuration * 1000);

    } catch (error) {
      console.error('再生エラー:', error);
      Alert.alert('エラー', '音声を再生できませんでした。');
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    Alert.alert(
      '録音を削除',
      '録音した音声を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setRecordingPath(null);
            setRecordingDuration(0);
          },
        },
      ]
    );
  };

  const sendMessage = async () => {
    if (!recordingPath) {
      Alert.alert('録音してください', 'まず音声を録音してください。');
      return;
    }

    Alert.alert(
      'メッセージを送信',
      '家族にメッセージを送信しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '送信',
          onPress: async () => {
            await uploadAndSendMessage();
          },
        },
      ]
    );
  };

  const uploadAndSendMessage = async () => {
    if (!recordingPath) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // メッセージIDを生成
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 音声ファイルをFirebase Storageにアップロード
      const audioUrl = await StorageService.uploadVoiceMessage(
        messageId,
        recordingPath,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // メッセージデータを準備
      const messageData = {
        senderId: 'current_user_id', // 実際のユーザーIDに置き換える
        senderName: 'Current User', // 実際のユーザー名に置き換える
        audioUrl,
        duration: recordingDuration,
        question: selectedQuestion?.text || '',
        greeting: feeling ? feelingLabels[feeling] : '',
        receiverIds: ['family_member_1', 'family_member_2'], // 実際の家族メンバーIDに置き換える
        listenedBy: [],
      };

      // Firestoreにメッセージを保存
      await DatabaseService.createVoiceMessage(messageData);

      setIsUploading(false);
      Alert.alert('送信完了', 'メッセージを家族に送信しました！', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);

    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      setIsUploading(false);
      Alert.alert('送信エラー', 'メッセージの送信に失敗しました。もう一度お試しください。');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.feelingLabel}>{feeling ? feelingLabels[feeling] : ''}</Text>
          <Text style={styles.questionText}>{selectedQuestion?.text || 'メッセージを録音してください'}</Text>
        </View>

        {/* 録音エリア */}
        <View style={styles.recordingArea}>
          {!recordingPath ? (
            <>
              {/* 録音ボタン */}
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && styles.recordButtonActive,
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.recordButtonInner,
                    { transform: [{ scale: pulseAnimation }] },
                  ]}
                >
                  <Text style={styles.recordButtonIcon}>
                    {isRecording ? '⏹' : '🎤'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>

              <Text style={styles.recordButtonText}>
                {isRecording ? 'タップで録音停止' : 'タップで録音開始'}
              </Text>

              {isRecording && (
                <Text style={styles.recordingDuration}>
                  {formatDuration(recordingDuration)}
                </Text>
              )}
            </>
          ) : (
            <>
              {/* 再生コントロール */}
              <View style={styles.playbackArea}>
                <Text style={styles.recordingInfo}>
                  録音時間: {formatDuration(recordingDuration)}
                </Text>

                <View style={styles.playbackControls}>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.playButton]}
                    onPress={playRecording}
                    disabled={isPlaying}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.controlButtonText}>
                      {isPlaying ? '▶️ 再生中...' : '▶️ 再生'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, styles.deleteButton]}
                    onPress={deleteRecording}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.controlButtonText}>🗑 やり直し</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* 送信エリア */}
        {recordingPath && (
          <View style={styles.sendArea}>
            <TouchableOpacity
              style={[styles.sendButton, isUploading && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={isUploading}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>
                {isUploading ? '📤 送信中...' : '📤 家族に送信する'}
              </Text>
            </TouchableOpacity>

            {isUploading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${uploadProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(uploadProgress)}% 完了
                </Text>
              </View>
            )}

            <Text style={styles.sendHelpText}>
              💡 メッセージは家族全員に送信されます
            </Text>
          </View>
        )}

        {/* ヘルプテキスト */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            {!recordingPath
              ? '🎙 質問を読み上げて、自然な声で話しかけてみてください'
              : '✅ 録音が完了しました。再生で確認してから送信してください'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  feelingLabel: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 32,
  },
  recordingArea: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  recordButtonActive: {
    backgroundColor: '#c0392b',
  },
  recordButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonIcon: {
    fontSize: 48,
    color: '#ffffff',
  },
  recordButtonText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 16,
  },
  recordingDuration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
    fontFamily: 'monospace',
  },
  playbackArea: {
    alignItems: 'center',
  },
  recordingInfo: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 32,
  },
  playbackControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  playButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#95a5a6',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  sendArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  sendHelpText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  helpSection: {
    backgroundColor: '#e8f6f3',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1abc9c',
  },
  helpText: {
    fontSize: 14,
    color: '#16a085',
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default RecordMessageScreen;