// ======================================
// Web Audio API を使ったシンプルなBGM生成
// 低音域でゆっくりリズミカルな楽しい曲
// ======================================

type NoteFrequency = number;

// 音符の周波数（低めの音域を追加）
const NOTES: Record<string, NoteFrequency> = {
  // 低音域
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  // 中音域
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  // 高音域（控えめに使用）
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

// メロディパターン定義
interface MelodyPattern {
  notes: string[];      // 音符配列
  durations: number[];  // 各音符の長さ（秒）
  tempo: number;        // BPM
  waveType?: OscillatorType; // 波形タイプ
  hasRhythm?: boolean;  // リズム感を出すか
}

// 各シーン用のメロディ（低音域・ゆっくり・リズミカル）
const MELODIES: Record<string, MelodyPattern> = {
  // タイトル：明るく楽しいマーチ風
  title: {
    notes: ['C3', 'G3', 'E3', 'G3', 'C4', 'G3', 'E3', 'C3', 'D3', 'G3', 'F3', 'G3', 'E3', 'D3', 'C3', 'G2'],
    durations: [0.4, 0.2, 0.2, 0.4, 0.4, 0.2, 0.2, 0.4, 0.4, 0.2, 0.2, 0.4, 0.4, 0.2, 0.2, 0.6],
    tempo: 80,
    waveType: 'triangle',
    hasRhythm: true
  },
  // ルーレット：ワクワクするスウィング風
  roulette: {
    notes: ['C3', 'E3', 'G3', 'C4', 'A3', 'G3', 'E3', 'C3', 'D3', 'F3', 'A3', 'D4', 'B3', 'A3', 'F3', 'D3'],
    durations: [0.3, 0.15, 0.3, 0.15, 0.3, 0.15, 0.3, 0.3, 0.3, 0.15, 0.3, 0.15, 0.3, 0.15, 0.3, 0.3],
    tempo: 90,
    waveType: 'triangle',
    hasRhythm: true
  },
  // サイコロ待機：軽快でポップな感じ
  dice_wait: {
    notes: ['G2', 'C3', 'E3', 'G3', 'E3', 'C3', 'G2', 'C3', 'F3', 'A3', 'F3', 'C3', 'G2', 'B2', 'D3', 'G3'],
    durations: [0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.5],
    tempo: 75,
    waveType: 'triangle',
    hasRhythm: true
  },
  // 飛行中：ゆったり冒険感のある曲
  flying: {
    notes: ['C3', 'E3', 'G3', 'C4', 'B3', 'G3', 'E3', 'G3', 'A3', 'C4', 'E4', 'C4', 'G3', 'E3', 'D3', 'C3'],
    durations: [0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 1.0],
    tempo: 60,
    waveType: 'sine',
    hasRhythm: false
  },
  // クイズ：考え中のゆったりした曲
  quiz: {
    notes: ['E3', 'G3', 'B3', 'E3', 'A3', 'C4', 'A3', 'E3', 'F3', 'A3', 'C4', 'F3', 'G3', 'B3', 'D4', 'G3'],
    durations: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8],
    tempo: 55,
    waveType: 'sine',
    hasRhythm: false
  },
  // お笑い：明るく穏やかなコミカル曲
  comedy: {
    notes: ['C3', 'E3', 'G3', 'E3', 'C3', 'G3', 'E3', 'C3', 'D3', 'F3', 'A3', 'F3', 'D3', 'G3', 'E3', 'C3'],
    durations: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6],
    tempo: 70,
    waveType: 'triangle',
    hasRhythm: false
  },
  // メッセージ：心温まるやさしい曲
  message: {
    notes: ['C3', 'E3', 'G3', 'C4', 'E4', 'C4', 'G3', 'E3', 'F3', 'A3', 'C4', 'F4', 'C4', 'A3', 'G3', 'C3'],
    durations: [0.8, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 1.2],
    tempo: 50,
    waveType: 'sine',
    hasRhythm: false
  },
  // 到着：華やかでめでたいファンファーレ
  arrival: {
    notes: ['C4', 'E4', 'G4', 'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'G4', 'C5', 'E5', 'C5', 'G4', 'C5', 'E5', 'G5', 'C5', 'E5', 'G5', 'C5'],
    durations: [0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.3, 0.5],
    tempo: 120,
    waveType: 'triangle',
    hasRhythm: true
  },
  // パワースポット：神秘的でゆったり（中音域で確実に鳴るように）
  power_spot: {
    notes: ['E3', 'B3', 'E4', 'G4', 'B3', 'E4', 'G4', 'E4', 'A3', 'E4', 'A4', 'C5', 'A4', 'E4', 'A3', 'E3'],
    durations: [0.8, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.2, 0.8, 0.8, 0.8, 1.2],
    tempo: 50,
    waveType: 'sine',
    hasRhythm: false
  },
  // エンディング：喜びに満ちためでたいフィナーレ
  ending: {
    notes: ['C4', 'E4', 'G4', 'C5', 'E4', 'G4', 'C5', 'E5', 'G4', 'C5', 'E5', 'G5', 'E5', 'G5', 'C5', 'E5', 'G5', 'C5', 'E5', 'G5', 'E5', 'C5', 'G4', 'C5', 'E5', 'G5', 'C5'],
    durations: [0.2, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.3, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.3, 0.3, 0.4, 0.8],
    tempo: 110,
    waveType: 'triangle',
    hasRhythm: true
  }
};

class ToneGenerator {
  private audioContext: AudioContext | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private currentGainNodes: GainNode[] = [];
  private isPlaying: boolean = false;
  private currentScene: string | null = null;
  private loopInterval: NodeJS.Timeout | null = null;
  private masterVolume: number = 0.25;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // メロディを再生
  private playMelody(scene: string, loop: boolean = true): void {
    const melody = MELODIES[scene];
    if (!melody) return;

    const ctx = this.getAudioContext();
    let time = ctx.currentTime;
    const tempoMultiplier = 60 / melody.tempo;

    melody.notes.forEach((note, index) => {
      const freq = NOTES[note];
      if (!freq) return;

      const duration = melody.durations[index] * tempoMultiplier;
      const waveType = melody.waveType || 'triangle';

      // メインのオシレーター
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(freq, time);

      // リズム感を出す場合はアタックを強めに
      const attackTime = melody.hasRhythm ? 0.01 : 0.05;
      const sustainLevel = melody.hasRhythm ? this.masterVolume : this.masterVolume * 0.8;

      // エンベロープ（音の立ち上がりと減衰）
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(sustainLevel, time + attackTime);
      gainNode.gain.linearRampToValueAtTime(sustainLevel * 0.6, time + duration * 0.5);
      gainNode.gain.linearRampToValueAtTime(0, time + duration * 0.95);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(time);
      oscillator.stop(time + duration);

      this.currentOscillators.push(oscillator);
      this.currentGainNodes.push(gainNode);

      // ベース音を追加（1オクターブ下）- リズミカルな曲のみ
      if (melody.hasRhythm && index % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();

        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(freq / 2, time);

        bassGain.gain.setValueAtTime(0, time);
        bassGain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, time + 0.01);
        bassGain.gain.linearRampToValueAtTime(0, time + duration * 0.4);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(time);
        bassOsc.stop(time + duration * 0.5);

        this.currentOscillators.push(bassOsc);
        this.currentGainNodes.push(bassGain);
      }

      time += duration;
    });

    // ループ処理
    if (loop) {
      const totalDuration = melody.notes.reduce((sum, _, i) =>
        sum + melody.durations[i] * tempoMultiplier, 0);

      this.loopInterval = setTimeout(() => {
        if (this.isPlaying && this.currentScene === scene) {
          this.playMelody(scene, true);
        }
      }, totalDuration * 1000);
    }
  }

  // BGMを再生
  play(scene: string): void {
    if (typeof window === 'undefined') return;

    // 同じシーンなら何もしない
    if (this.currentScene === scene && this.isPlaying) return;

    this.stop();
    this.currentScene = scene;
    this.isPlaying = true;

    // 非ループシーン
    const nonLoopScenes = ['arrival', 'ending'];
    const shouldLoop = !nonLoopScenes.includes(scene);

    this.playMelody(scene, shouldLoop);
  }

  // 停止
  stop(): void {
    if (this.loopInterval) {
      clearTimeout(this.loopInterval);
      this.loopInterval = null;
    }

    this.currentOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.currentOscillators = [];
    this.currentGainNodes = [];
    this.isPlaying = false;
    this.currentScene = null;
  }

  // ボリューム設定
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume)) * 0.25;
  }

  // 状態取得
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentScene(): string | null {
    return this.currentScene;
  }
}

// シングルトン
let toneGeneratorInstance: ToneGenerator | null = null;

export function getToneGenerator(): ToneGenerator {
  if (!toneGeneratorInstance) {
    toneGeneratorInstance = new ToneGenerator();
  }
  return toneGeneratorInstance;
}

// ヘルパー関数
export const playTone = (scene: string) => getToneGenerator().play(scene);
export const stopTone = () => getToneGenerator().stop();
export const setToneVolume = (volume: number) => getToneGenerator().setVolume(volume);
