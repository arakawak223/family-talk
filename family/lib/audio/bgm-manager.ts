// ======================================
// BGM管理システム
// 桃太郎電鉄風の楽しいBGM切り替えシステム
// mp3がない場合はトーンジェネレーターにフォールバック
// ======================================

import { playTone, stopTone, setToneVolume } from './tone-generator';

export type BGMScene =
  | 'title'           // タイトル/メニュー
  | 'roulette'        // 目的地ルーレット
  | 'dice_wait'       // サイコロ待機
  | 'flying'          // 飛行中
  | 'quiz'            // クイズマス
  | 'comedy'          // お笑いマス
  | 'message'         // メッセージマス
  | 'arrival'         // 目的地到着
  | 'power_spot'      // パワースポット
  | 'ending';         // ゲーム終了/結果発表

export interface BGMTrack {
  scene: BGMScene;
  name: string;           // 曲名
  description: string;    // 説明
  src: string;            // 音源URL
  volume: number;         // デフォルト音量 (0-1)
  loop: boolean;          // ループするか
  fadeInDuration?: number;  // フェードイン時間(ms)
  fadeOutDuration?: number; // フェードアウト時間(ms)
}

// BGMトラック定義（フリー素材を使用予定）
// 実際のURLは後で設定
export const BGM_TRACKS: BGMTrack[] = [
  {
    scene: 'title',
    name: 'ワクワク冒険の始まり',
    description: 'タイトル画面・メニュー用の明るく楽しい曲',
    src: '/audio/bgm/title.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 500
  },
  {
    scene: 'roulette',
    name: 'ドキドキルーレット',
    description: '目的地決定のドキドキ感を演出',
    src: '/audio/bgm/roulette.mp3',
    volume: 0.6,
    loop: true,
    fadeInDuration: 300,
    fadeOutDuration: 300
  },
  {
    scene: 'dice_wait',
    name: 'サイコロタイム',
    description: 'サイコロを振る前の軽快なBGM',
    src: '/audio/bgm/dice.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 300
  },
  {
    scene: 'flying',
    name: '大空への旅立ち',
    description: '飛行中の冒険感あふれるBGM',
    src: '/audio/bgm/flying.mp3',
    volume: 0.4,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000
  },
  {
    scene: 'quiz',
    name: 'シンキングタイム',
    description: 'クイズ考え中の緊張感あるBGM',
    src: '/audio/bgm/quiz.mp3',
    volume: 0.4,
    loop: true,
    fadeInDuration: 500,
    fadeOutDuration: 300
  },
  {
    scene: 'comedy',
    name: 'お笑いショータイム',
    description: 'お笑いマスのコミカルなBGM',
    src: '/audio/bgm/comedy.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 300,
    fadeOutDuration: 300
  },
  {
    scene: 'message',
    name: 'やさしい時間',
    description: 'メッセージマスの優しく感動的なBGM',
    src: '/audio/bgm/message.mp3',
    volume: 0.4,
    loop: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000
  },
  {
    scene: 'arrival',
    name: '目的地到着ファンファーレ',
    description: '到着時の達成感を演出するファンファーレ',
    src: '/audio/bgm/arrival.mp3',
    volume: 0.6,
    loop: false,
    fadeInDuration: 0,
    fadeOutDuration: 500
  },
  {
    scene: 'power_spot',
    name: '神秘のパワースポット',
    description: 'パワースポットの神秘的な雰囲気',
    src: '/audio/bgm/power_spot.mp3',
    volume: 0.5,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 1500
  },
  {
    scene: 'ending',
    name: '感動のフィナーレ',
    description: 'ゲーム終了時の壮大なエンディング',
    src: '/audio/bgm/ending.mp3',
    volume: 0.6,
    loop: false,
    fadeInDuration: 500,
    fadeOutDuration: 2000
  }
];

// BGM管理クラス
class BGMManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentScene: BGMScene | null = null;
  private masterVolume: number = 1.0;
  private isMuted: boolean = false;
  private isEnabled: boolean = true;
  private fadeInterval: NodeJS.Timeout | null = null;
  private useToneGenerator: boolean = false; // mp3が読み込めない場合のフォールバック

  constructor() {
    // ブラウザ環境チェック
    if (typeof window !== 'undefined') {
      // ローカルストレージから設定を復元
      const savedVolume = localStorage.getItem('bgm_volume');
      const savedMuted = localStorage.getItem('bgm_muted');
      const savedEnabled = localStorage.getItem('bgm_enabled');

      if (savedVolume) this.masterVolume = parseFloat(savedVolume);
      if (savedMuted) this.isMuted = savedMuted === 'true';
      if (savedEnabled) this.isEnabled = savedEnabled === 'true';
    }
  }

  // BGMを再生
  async play(scene: BGMScene): Promise<void> {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // 同じシーンなら何もしない
    if (this.currentScene === scene) {
      if (this.useToneGenerator) return;
      if (this.currentAudio && !this.currentAudio.paused) return;
    }

    const track = BGM_TRACKS.find(t => t.scene === scene);
    if (!track) {
      console.warn(`BGM track not found for scene: ${scene}`);
      return;
    }

    // 現在のBGMをフェードアウト
    await this.fadeOut();

    // トーンジェネレーターモードの場合
    if (this.useToneGenerator) {
      this.currentScene = scene;
      setToneVolume(this.masterVolume * (this.isMuted ? 0 : 1));
      playTone(scene);
      return;
    }

    // 新しいオーディオを作成
    this.currentAudio = new Audio(track.src);
    this.currentAudio.loop = track.loop;
    this.currentAudio.volume = 0; // フェードイン用に0から開始
    this.currentScene = scene;

    // エラーハンドリング - mp3が読み込めない場合はトーンジェネレーターにフォールバック
    this.currentAudio.onerror = () => {
      console.warn(`Failed to load BGM: ${track.src}, falling back to tone generator`);
      this.useToneGenerator = true;
      this.currentAudio = null;
      setToneVolume(this.masterVolume * (this.isMuted ? 0 : 1));
      playTone(scene);
    };

    // 再生開始
    try {
      await this.currentAudio.play();
      // フェードイン
      this.fadeIn(track.volume * this.masterVolume * (this.isMuted ? 0 : 1), track.fadeInDuration || 500);
    } catch {
      // ユーザーインタラクション前の自動再生ブロック対策
      console.warn('BGM autoplay blocked, trying tone generator');
      this.useToneGenerator = true;
      this.currentAudio = null;
      setToneVolume(this.masterVolume * (this.isMuted ? 0 : 1));
      playTone(scene);
    }
  }

  // フェードイン
  private fadeIn(targetVolume: number, duration: number): void {
    if (!this.currentAudio) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    const startVolume = 0;
    const steps = duration / 50;
    const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      if (!this.currentAudio || currentStep >= steps) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        if (this.currentAudio) this.currentAudio.volume = targetVolume;
        return;
      }
      currentStep++;
      this.currentAudio.volume = Math.min(startVolume + volumeStep * currentStep, 1);
    }, 50);
  }

  // フェードアウト
  private fadeOut(): Promise<void> {
    return new Promise((resolve) => {
      // トーンジェネレーターモードの場合
      if (this.useToneGenerator) {
        stopTone();
        this.currentScene = null;
        resolve();
        return;
      }

      if (!this.currentAudio || this.currentAudio.paused) {
        resolve();
        return;
      }

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      const track = BGM_TRACKS.find(t => t.scene === this.currentScene);
      const duration = track?.fadeOutDuration || 500;
      const startVolume = this.currentAudio.volume;
      const steps = duration / 50;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        if (!this.currentAudio || currentStep >= steps) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
          }
          this.currentScene = null;
          resolve();
          return;
        }
        currentStep++;
        this.currentAudio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
      }, 50);
    });
  }

  // BGMを停止
  async stop(): Promise<void> {
    await this.fadeOut();
  }

  // 一時停止
  pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  }

  // 再開
  resume(): void {
    if (this.currentAudio && this.currentAudio.paused && this.isEnabled) {
      this.currentAudio.play().catch(() => {});
    }
  }

  // マスターボリューム設定
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgm_volume', this.masterVolume.toString());
    }

    // トーンジェネレーターの場合
    if (this.useToneGenerator) {
      setToneVolume(this.masterVolume * (this.isMuted ? 0 : 1));
      return;
    }

    if (this.currentAudio && !this.isMuted) {
      const track = BGM_TRACKS.find(t => t.scene === this.currentScene);
      if (track) {
        this.currentAudio.volume = track.volume * this.masterVolume;
      }
    }
  }

  // ボリューム取得
  getVolume(): number {
    return this.masterVolume;
  }

  // ミュート切り替え
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgm_muted', this.isMuted.toString());
    }

    // トーンジェネレーターの場合
    if (this.useToneGenerator) {
      setToneVolume(this.isMuted ? 0 : this.masterVolume);
      return this.isMuted;
    }

    if (this.currentAudio) {
      const track = BGM_TRACKS.find(t => t.scene === this.currentScene);
      if (track) {
        this.currentAudio.volume = this.isMuted ? 0 : track.volume * this.masterVolume;
      }
    }
    return this.isMuted;
  }

  // ミュート状態取得
  getMuted(): boolean {
    return this.isMuted;
  }

  // BGM有効/無効切り替え
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgm_enabled', enabled.toString());
    }
    if (!enabled) {
      this.stop();
    }
  }

  // 有効状態取得
  getEnabled(): boolean {
    return this.isEnabled;
  }

  // 現在のシーン取得
  getCurrentScene(): BGMScene | null {
    return this.currentScene;
  }

  // 再生中かどうか
  isPlaying(): boolean {
    if (this.useToneGenerator) {
      return this.currentScene !== null;
    }
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // トーンジェネレーターモードかどうか
  isToneGeneratorMode(): boolean {
    return this.useToneGenerator;
  }
}

// シングルトンインスタンス
let bgmManagerInstance: BGMManager | null = null;

export function getBGMManager(): BGMManager {
  if (!bgmManagerInstance) {
    bgmManagerInstance = new BGMManager();
  }
  return bgmManagerInstance;
}

// 便利なヘルパー関数
export const playBGM = (scene: BGMScene) => getBGMManager().play(scene);
export const stopBGM = () => getBGMManager().stop();
export const pauseBGM = () => getBGMManager().pause();
export const resumeBGM = () => getBGMManager().resume();
export const setBGMVolume = (volume: number) => getBGMManager().setVolume(volume);
export const toggleBGMMute = () => getBGMManager().toggleMute();
