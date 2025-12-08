// ======================================
// 音声読み上げモジュール
// より自然な音声合成を提供
// ======================================

/**
 * テキストから絵文字や特殊記号を除去
 */
function removeEmojis(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // 顔文字
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // シンボル・ピクトグラフ
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // 乗り物・地図記号
    .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // 錬金術記号
    .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // 幾何学的形状
    .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // 補足矢印
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // 補足シンボル
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // チェス記号
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // シンボル・ピクトグラフ拡張
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // その他の記号
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // 装飾記号
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // 異体字セレクタ
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // 国旗
    .trim();
}

/**
 * 日本語の高品質な音声を取得
 */
function getJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // 優先順位付きで音声を検索
  // Google日本語音声が最も自然
  const preferredVoices = [
    'Google 日本語',
    'Microsoft Nanami Online',  // Edge/Windows の高品質音声
    'Microsoft Haruka',
    'Kyoko',                     // macOS
    'O-Ren',                     // macOS
    'Hattori',                   // macOS
  ];

  for (const preferred of preferredVoices) {
    const voice = voices.find(v => v.name.includes(preferred));
    if (voice) return voice;
  }

  // フォールバック: 任意の日本語音声
  return voices.find(v => v.lang.includes('ja')) || null;
}

/**
 * 音声が読み込まれるまで待機
 */
function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // タイムアウト
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

/**
 * テキストを音声で読み上げる
 * @param text 読み上げるテキスト
 * @param options オプション設定
 */
export async function speakText(
  text: string,
  options: {
    rate?: number;      // 速度 (0.1 - 10, デフォルト: 1.0)
    pitch?: number;     // ピッチ (0 - 2, デフォルト: 1.0)
    volume?: number;    // 音量 (0 - 1, デフォルト: 1.0)
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    options.onError?.(new Error('Speech synthesis not supported'));
    return;
  }

  // 絵文字を除去
  const cleanText = removeEmojis(text);
  if (!cleanText) {
    options.onEnd?.();
    return;
  }

  // 既存の読み上げをキャンセル
  window.speechSynthesis.cancel();

  // 音声が読み込まれるまで待機
  await waitForVoices();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // 高品質な日本語音声を選択
    const voice = getJapaneseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
      resolve();
    };

    utterance.onerror = (event) => {
      // 'interrupted' はユーザーによるキャンセルなのでエラーとして扱わない
      // 'canceled' も同様
      if (event.error === 'interrupted' || event.error === 'canceled') {
        options.onEnd?.();
        resolve();
        return;
      }
      // その他のエラーのみログ出力
      if (event.error && event.error !== 'not-allowed') {
        console.warn('Speech synthesis error:', event.error);
      }
      options.onError?.(new Error(event.error || 'Unknown speech error'));
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * 読み上げを停止
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 読み上げ中かどうか
 */
export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
}

/**
 * 感情のタイプ
 */
export type EmotionType = 'neutral' | 'happy' | 'excited' | 'warm' | 'funny' | 'question';

/**
 * 感情タイプに応じた音声パラメータを取得
 */
function getEmotionParams(emotion: EmotionType): { rate: number; pitch: number } {
  switch (emotion) {
    case 'happy':
      return { rate: 1.05, pitch: 1.15 };
    case 'excited':
      return { rate: 1.1, pitch: 1.2 };
    case 'warm':
      return { rate: 0.9, pitch: 1.05 };
    case 'funny':
      return { rate: 0.95, pitch: 1.1 };
    case 'question':
      return { rate: 0.95, pitch: 1.1 };
    case 'neutral':
    default:
      return { rate: 1.0, pitch: 1.0 };
  }
}

/**
 * テキストを分析して感情を推定
 */
function analyzeEmotion(text: string): EmotionType {
  // 質問系
  if (text.includes('？') || text.includes('?') || text.includes('ですか') || text.includes('かな')) {
    return 'question';
  }
  // お笑い系
  if (text.includes('なんでやねん') || text.includes('ボケ') || text.includes('ツッコミ') ||
      text.includes('笑') || text.includes('ワロタ') || text.includes('草') ||
      text.includes('ギャグ') || text.includes('！！')) {
    return 'funny';
  }
  // 興奮系
  if (text.includes('！！') || text.includes('すごい') || text.includes('やったー') ||
      text.includes('おめでとう') || text.includes('最高')) {
    return 'excited';
  }
  // 幸せ・ポジティブ系
  if (text.includes('ありがとう') || text.includes('嬉しい') || text.includes('楽しい') ||
      text.includes('素敵') || text.includes('大好き') || text.includes('！')) {
    return 'happy';
  }
  // 温かい系（メッセージマス向け）
  if (text.includes('いつも') || text.includes('あなた') || text.includes('一緒に') ||
      text.includes('感謝') || text.includes('大切') || text.includes('宝物')) {
    return 'warm';
  }
  return 'neutral';
}

/**
 * テキストを句読点で分割し、それぞれに適切な間を入れる
 */
function splitIntoSegments(text: string): { text: string; pauseAfter: number }[] {
  // 句読点で分割
  const segments: { text: string; pauseAfter: number }[] = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    current += char;

    if (char === '。' || char === '！' || char === '?' || char === '？') {
      segments.push({ text: current.trim(), pauseAfter: 400 });
      current = '';
    } else if (char === '、' || char === ',' || char === '…') {
      segments.push({ text: current.trim(), pauseAfter: 200 });
      current = '';
    }
  }

  if (current.trim()) {
    segments.push({ text: current.trim(), pauseAfter: 0 });
  }

  return segments.filter(s => s.text.length > 0);
}

/**
 * 感情を込めてテキストを読み上げる（自動で感情を推定）
 */
export async function speakWithEmotion(
  text: string,
  options: {
    emotion?: EmotionType;  // 手動で感情を指定（省略時は自動推定）
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    options.onError?.(new Error('Speech synthesis not supported'));
    return;
  }

  const cleanText = removeEmojis(text);
  if (!cleanText) {
    options.onEnd?.();
    return;
  }

  // 既存の読み上げをキャンセル
  window.speechSynthesis.cancel();

  // 音声が読み込まれるまで待機
  await waitForVoices();

  // 感情を推定または指定された感情を使用
  const emotion = options.emotion || analyzeEmotion(cleanText);
  const emotionParams = getEmotionParams(emotion);

  // テキストを分割
  const segments = splitIntoSegments(cleanText);

  options.onStart?.();

  // セグメントを順番に読み上げ
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(removeEmojis(segment.text));
      utterance.lang = 'ja-JP';

      // 感情パラメータを適用（セグメントごとに微妙に変化させて自然に）
      const variation = (Math.random() - 0.5) * 0.05; // -0.025 ~ +0.025
      utterance.rate = emotionParams.rate + variation;
      utterance.pitch = emotionParams.pitch + variation;
      utterance.volume = 1.0;

      // 高品質な日本語音声を選択
      const voice = getJapaneseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        // セグメント後の間
        if (segment.pauseAfter > 0 && i < segments.length - 1) {
          setTimeout(resolve, segment.pauseAfter);
        } else {
          resolve();
        }
      };

      utterance.onerror = (event) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve();
          return;
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  options.onEnd?.();
}
