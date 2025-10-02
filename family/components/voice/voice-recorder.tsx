"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VoiceRecorderProps {
  familyId: string;
  question?: string;
  onComplete: () => void;
  onCancel: () => void;
}

type RecordingState = "idle" | "recording" | "stopped" | "uploading" | "completed";

export function VoiceRecorder({ familyId, question, onComplete, onCancel }: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && recordingState === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [recordingState]);

  const startRecording = async () => {
    try {
      setError("");

      // マイクアクセス許可を取得
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 利用可能なMIMEタイプを確認
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // iOSの場合、audio/mp4がサポートされている
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          // フォールバック
          mimeType = '';
        }
      }

      // MediaRecorderを初期化
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // タイマー停止
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState("stopped");

        // ストリームを停止
        stream.getTracks().forEach(track => track.stop());
      };

      // 録音開始
      mediaRecorder.start();

      // 状態とタイマーを同時に開始
      setRecordingState("recording");
      setRecordingTime(0);

      // タイマー開始（少し遅延させて状態更新後に実行）
      setTimeout(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      }, 100);

    } catch (err) {
      console.error('録音開始エラー:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError("マイクアクセスが拒否されました。SafariのアドレスバーのAA → Webサイトの設定 → マイクを「許可」に変更してください。");
        } else if (err.name === 'NotFoundError') {
          setError("マイクが見つかりませんでした。");
        } else {
          setError(`録音エラー: ${err.message}`);
        }
      } else {
        setError("マイクアクセスが許可されていません。ブラウザの設定を確認してください。");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      // タイマーの停止はonstopイベントで処理される
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const uploadRecording = async () => {
    if (!audioBlob) return;

    setRecordingState("uploading");
    setError("");

    try {
      // 実際のアップロード処理
      const { uploadVoiceMessage } = await import('@/lib/voice-upload');

      const result = await uploadVoiceMessage(
        audioBlob,
        familyId,
        question
      );

      console.log('アップロード成功:', result);
      setRecordingState("completed");

      // 2秒後に完了
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (err) {
      console.error('アップロードエラー:', err);
      const errorMessage = err instanceof Error ? err.message : "アップロードに失敗しました。";
      setError(errorMessage);
      setRecordingState("stopped");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateDisplay = () => {
    switch (recordingState) {
      case "idle":
        return { text: "録音準備完了", color: "bg-gray-100 text-gray-800" };
      case "recording":
        return { text: "録音中", color: "bg-red-100 text-red-800" };
      case "stopped":
        return { text: "録音完了", color: "bg-green-100 text-green-800" };
      case "uploading":
        return { text: "送信中", color: "bg-blue-100 text-blue-800" };
      case "completed":
        return { text: "送信完了", color: "bg-green-100 text-green-800" };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 質問表示 */}
          {question && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">今回の質問：</p>
              <p className="text-blue-900 font-medium">{question}</p>
            </div>
          )}

          {/* 状態表示 */}
          <div className="text-center">
            <Badge className={`mb-4 ${getStateDisplay().color}`}>
              {getStateDisplay().text}
            </Badge>

            {recordingState === "recording" && (
              <div className="mb-4">
                <div className="text-3xl font-mono text-red-600">
                  {formatTime(recordingTime)}
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {recordingState === "stopped" && audioBlob && (
              <div className="mb-4">
                <div className="text-lg text-gray-600 mb-2">
                  録音時間: {formatTime(recordingTime)}
                </div>
              </div>
            )}

            {recordingState === "uploading" && (
              <div className="mb-4">
                <div className="text-blue-600">📤 送信中...</div>
              </div>
            )}

            {recordingState === "completed" && (
              <div className="mb-4">
                <div className="text-green-600 text-lg">✅ 送信完了！</div>
                <p className="text-sm text-gray-600">家族にメッセージが届きました</p>
              </div>
            )}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* 操作ボタン */}
          <div className="flex gap-2 justify-center">
            {recordingState === "idle" && (
              <>
                <Button onClick={startRecording} className="flex-1" size="lg">
                  🎤 録音開始
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1">
                  キャンセル
                </Button>
              </>
            )}

            {recordingState === "recording" && (
              <Button onClick={stopRecording} variant="destructive" size="lg" className="flex-1">
                ⏹️ 録音停止
              </Button>
            )}

            {recordingState === "stopped" && (
              <>
                <Button onClick={playRecording} variant="outline">
                  ▶️ 再生
                </Button>
                <Button onClick={startRecording} variant="outline">
                  🔄 録音し直し
                </Button>
                <Button onClick={uploadRecording} className="flex-1">
                  📤 送信
                </Button>
                <Button onClick={onCancel} variant="outline">
                  キャンセル
                </Button>
              </>
            )}

            {(recordingState === "uploading" || recordingState === "completed") && (
              <div className="text-center text-gray-500">
                処理中です...
              </div>
            )}
          </div>

          {/* 録音のヒント */}
          {recordingState === "idle" && (
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>💡 録音のコツ：</p>
              <p>• 静かな場所で録音しましょう</p>
              <p>• マイクに近づきすぎないよう注意</p>
              <p>• 家族への気持ちを込めて話しましょう</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}