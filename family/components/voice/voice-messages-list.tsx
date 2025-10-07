"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getFamilyVoiceMessages,
  markMessageAsListened,
  getVoiceMessageUrl,
  deleteVoiceMessage,
  VoiceMessageWithProfile
} from "@/lib/voice-messages";
import { getAvatarDisplay } from "@/lib/avatars";
import { VoiceEnvelope } from "./voice-envelope";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VoiceMessagesListProps {
  familyId: string;
  currentUserId: string;
}

export function VoiceMessagesList({ familyId, currentUserId }: VoiceMessagesListProps) {
  const [messages, setMessages] = useState<VoiceMessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // メッセージ取得
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedMessages = await getFamilyVoiceMessages(familyId);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error('メッセージ取得エラー:', err);
      setError(err instanceof Error ? err.message : "メッセージの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [familyId]);

  // 初回読み込み
  useEffect(() => {
    fetchMessages();
  }, [familyId, fetchMessages]);

  // 音声再生
  const playMessage = async (message: VoiceMessageWithProfile) => {
    try {
      setPlayingMessageId(message.id);

      // 音声URL取得
      const audioUrl = await getVoiceMessageUrl(message.audio_file_url);

      // 音声再生
      const audio = new Audio(audioUrl);
      audio.play();

      // 再生終了時の処理
      audio.onended = () => {
        setPlayingMessageId(null);
      };

      // エラー処理
      audio.onerror = () => {
        setPlayingMessageId(null);
        alert("音声の再生に失敗しました");
      };

      // 他人からのメッセージの場合は既読にする
      if (message.sender_id !== currentUserId && !message.is_listened) {
        await markMessageAsListened(message.id, familyId);
        // 既読状態を更新
        setMessages(prev => prev.map(m =>
          m.id === message.id ? { ...m, is_listened: true } : m
        ));
      }

    } catch (err) {
      console.error('音声再生エラー:', err);
      setPlayingMessageId(null);
      alert("音声の再生に失敗しました");
    }
  };

  // メッセージ削除
  const handleDeleteMessage = async (messageId: string) => {
    try {
      setLoading(true);
      setError("");
      await deleteVoiceMessage(messageId);
      // メッセージリストから削除
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (err) {
      console.error('メッセージ削除エラー:', err);
      setError(err instanceof Error ? err.message : "メッセージの削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 時刻フォーマット
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      // 今日の場合
      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // 今日以外の場合
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // 時間フォーマット
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            📡 メッセージを読み込んでいます...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <Button onClick={fetchMessages} variant="outline">
              再読み込み
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">📭 まだボイスメッセージがありません</div>
            <p className="text-sm">家族と最初のひと言を交換してみましょう！</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            📝 最近の家族のひと言
            <Badge variant="secondary">{messages.length}</Badge>
          </span>
          <Button onClick={fetchMessages} variant="ghost" size="sm">
            🔄
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((message) => {
            const isSentByMe = message.sender_id === currentUserId;
            const isPlaying = playingMessageId === message.id;
            const shouldShowAsEnvelope = !isSentByMe && !message.is_listened;

            // Show as sealed envelope for unplayed messages from others
            if (shouldShowAsEnvelope) {
              return (
                <div key={message.id} className="flex justify-start">
                  <VoiceEnvelope
                    message={message}
                    onOpen={playMessage}
                    formatDateTime={formatDateTime}
                  />
                </div>
              );
            }

            // Show as regular message for sent messages or already played messages
            return (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  isSentByMe
                    ? "bg-blue-50 border-blue-200 ml-4"
                    : "bg-gray-50 border-gray-200 mr-4"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {/* アバター表示 */}
                      <span className="text-2xl">
                        {getAvatarDisplay(message.sender_profile?.avatar_id)}
                      </span>
                      <span className="font-medium text-sm">
                        {isSentByMe ? "あなた" : message.sender_profile?.display_name || "家族"}
                      </span>
                      {!isSentByMe && message.is_listened && (
                        <Badge variant="secondary" className="text-xs">
                          開封済み
                        </Badge>
                      )}
                    </div>
                    {/* 宛先表示 */}
                    {message.recipients && message.recipients.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 ml-8">
                        <span>→</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {message.recipients?.map((recipient, index) => (
                            <span key={recipient.recipient_id} className="flex items-center gap-1">
                              <span>{getAvatarDisplay(recipient.recipient_profile?.avatar_id)}</span>
                              <span>{recipient.recipient_profile?.display_name || "家族"}</span>
                              {recipient.listened_at && (
                                <span className="text-green-600">✓</span>
                              )}
                              {index < (message.recipients?.length ?? 0) - 1 && <span>,</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(message.created_at)}
                  </span>
                </div>

                {message.custom_question && (
                  <div className="text-sm text-gray-600 mb-2">
                    💭 &ldquo;{message.custom_question}&rdquo;
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => playMessage(message)}
                    disabled={isPlaying}
                    size="sm"
                    className={isSentByMe ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {isPlaying ? "⏸️ 再生中" : "▶️ 再生"}
                  </Button>

                  <span className="text-sm text-gray-500">
                    {message.duration_seconds ? formatDuration(message.duration_seconds) : ""}
                  </span>

                  {message.audio_file_size && (
                    <span className="text-xs text-gray-400">
                      {Math.round(message.audio_file_size / 1024)}KB
                    </span>
                  )}

                  {/* 削除ボタン（自分のメッセージのみ） */}
                  {isSentByMe && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️ 削除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>メッセージを削除しますか？</AlertDialogTitle>
                          <AlertDialogDescription>
                            この操作は取り消せません。メッセージと音声ファイルが完全に削除されます。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMessage(message.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            削除する
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}