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
  // 飛行機エンジン音用
  private engineNoiseSource: AudioBufferSourceNode | null = null;
  private engineGainNode: GainNode | null = null;
  private engineLowOscillator: OscillatorNode | null = null;
  private engineLowGain: GainNode | null = null;
  private engineLfo: OscillatorNode | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // ジェット機頭上通過音を生成・再生
  // YouTubeの音をベースに：近づいてくる→最大→遠ざかって消える のサイクル
  public startEngineSound(): void {
    if (typeof window === 'undefined') return;

    // 既にエンジン音が再生中なら何もしない
    if (this.engineNoiseSource) {
      return;
    }

    const ctx = this.getAudioContext();

    // AudioContextがsuspended状態なら再開
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // === ジェットノイズ（ゴーッという音） ===
    const bufferSize = ctx.sampleRate * 10;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // ブラウンノイズ（低音寄りの重厚な音）
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      output[i] = lastOut * 3.5;
    }

    this.engineNoiseSource = ctx.createBufferSource();
    this.engineNoiseSource.buffer = noiseBuffer;
    this.engineNoiseSource.loop = true;

    // ローパスフィルター（重低音を強調）
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;
    lowpass.Q.value = 0.5;

    // ゲインノード
    this.engineGainNode = ctx.createGain();
    this.engineGainNode.gain.setValueAtTime(0, ctx.currentTime);

    // 接続
    this.engineNoiseSource.connect(lowpass);
    lowpass.connect(this.engineGainNode);
    this.engineGainNode.connect(ctx.destination);

    this.engineNoiseSource.start();

    // === 低周波のゴーという重低音 ===
    this.engineLowOscillator = ctx.createOscillator();
    this.engineLowOscillator.type = 'sawtooth';
    this.engineLowOscillator.frequency.setValueAtTime(60, ctx.currentTime);

    const lowOscFilter = ctx.createBiquadFilter();
    lowOscFilter.type = 'lowpass';
    lowOscFilter.frequency.value = 200;

    this.engineLowGain = ctx.createGain();
    this.engineLowGain.gain.setValueAtTime(0, ctx.currentTime);

    this.engineLowOscillator.connect(lowOscFilter);
    lowOscFilter.connect(this.engineLowGain);
    this.engineLowGain.connect(ctx.destination);

    this.engineLowOscillator.start();

    // === 通過サイクルのアニメーション ===
    // 約8秒で1サイクル：近づく(3秒) → 最大(2秒) → 遠ざかる(3秒)
    this.startPassByCycle(ctx);
  }

  // 通過サイクルをループ
  private passByCycleInterval: NodeJS.Timeout | null = null;

  private startPassByCycle(ctx: AudioContext): void {
    const maxNoiseVolume = 0.8;
    const maxLowVolume = 0.5;
    const cycleDuration = 8000; // 8秒で1サイクル

    const runCycle = () => {
      if (!this.engineGainNode || !this.engineLowGain) return;

      const now = ctx.currentTime;

      // ノイズ音量：0 → 最大 → 0
      this.engineGainNode.gain.cancelScheduledValues(now);
      this.engineGainNode.gain.setValueAtTime(0.05, now);
      this.engineGainNode.gain.linearRampToValueAtTime(maxNoiseVolume, now + 3); // 3秒で最大へ
      this.engineGainNode.gain.setValueAtTime(maxNoiseVolume, now + 5); // 2秒キープ
      this.engineGainNode.gain.linearRampToValueAtTime(0.05, now + 8); // 3秒で消える

      // 低音音量：同様に変化
      this.engineLowGain.gain.cancelScheduledValues(now);
      this.engineLowGain.gain.setValueAtTime(0.02, now);
      this.engineLowGain.gain.linearRampToValueAtTime(maxLowVolume, now + 3);
      this.engineLowGain.gain.setValueAtTime(maxLowVolume, now + 5);
      this.engineLowGain.gain.linearRampToValueAtTime(0.02, now + 8);

      // 周波数も変化（ドップラー効果）：高い→低い
      if (this.engineLowOscillator) {
        this.engineLowOscillator.frequency.cancelScheduledValues(now);
        this.engineLowOscillator.frequency.setValueAtTime(80, now); // 近づく時は高め
        this.engineLowOscillator.frequency.linearRampToValueAtTime(60, now + 4); // 真上で中間
        this.engineLowOscillator.frequency.linearRampToValueAtTime(45, now + 8); // 遠ざかると低め
      }
    };

    // 最初のサイクル開始
    runCycle();

    // サイクルをループ
    this.passByCycleInterval = setInterval(runCycle, cycleDuration);
  }

  // 追加LFO保存用
  private additionalLfos: OscillatorNode[] = [];

  // エンジン音を停止（publicにして外部から呼び出し可能に）
  // forceがtrueでない限り、飛行中シーンなら停止しない
  public stopEngineSound(force: boolean = false): void {
    // 飛行中シーンなら停止しない（強制停止でない限り）
    if (!force && this.currentScene === 'flying') {
      return;
    }

    // 通過サイクルのインターバルを停止
    if (this.passByCycleInterval) {
      clearInterval(this.passByCycleInterval);
      this.passByCycleInterval = null;
    }

    const ctx = this.audioContext;
    if (!ctx) return;

    // フェードアウト
    if (this.engineGainNode) {
      this.engineGainNode.gain.cancelScheduledValues(ctx.currentTime);
      this.engineGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }
    if (this.engineLowGain) {
      this.engineLowGain.gain.cancelScheduledValues(ctx.currentTime);
      this.engineLowGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }

    // 少し待ってから停止
    setTimeout(() => {
      if (this.engineNoiseSource) {
        try { this.engineNoiseSource.stop(); } catch {}
        this.engineNoiseSource = null;
      }
      if (this.engineLowOscillator) {
        try { this.engineLowOscillator.stop(); } catch {}
        this.engineLowOscillator = null;
      }
      if (this.engineLfo) {
        try { this.engineLfo.stop(); } catch {}
        this.engineLfo = null;
      }
      // 追加のLFOも停止
      for (const lfo of this.additionalLfos) {
        try { lfo.stop(); } catch {}
      }
      this.additionalLfos = [];
      this.engineGainNode = null;
      this.engineLowGain = null;
    }, 600);
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

    // 飛行中シーンかどうか
    const willFly = scene === 'flying';

    // 飛行中に入る場合はエンジン音を維持してstop
    this.stop(willFly);

    this.currentScene = scene;
    this.isPlaying = true;

    // 飛行中シーンの場合はエンジン音のみ（メロディなし）
    if (willFly) {
      if (!this.engineNoiseSource) {
        this.startEngineSound();
      }
      return; // メロディは再生しない
    }

    // 非ループシーン
    const nonLoopScenes = ['arrival', 'ending'];
    const shouldLoop = !nonLoopScenes.includes(scene);

    this.playMelody(scene, shouldLoop);
  }

  // 停止（keepEngineがtrueならエンジン音は維持）
  stop(keepEngine: boolean = false): void {
    const wasFlying = this.currentScene === 'flying';

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

    // エンジン音も停止（keepEngineがfalseで、かつ飛行中だった場合のみ強制停止）
    if (!keepEngine && wasFlying) {
      this.stopEngineSound(true); // 強制停止
    }
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
export const stopTone = (keepEngine: boolean = false) => getToneGenerator().stop(keepEngine);
export const setToneVolume = (volume: number) => getToneGenerator().setVolume(volume);
export const startEngineSound = () => getToneGenerator().startEngineSound();
export const stopEngineSound = () => getToneGenerator().stopEngineSound();

// ======================================
// サイコロ効果音生成
// マス数に応じて「トン・トン・トン」と軽快な音を鳴らす
// ======================================

class DiceSoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // マス数に応じた効果音を再生（非同期でnote回分の音を連続再生）
  async playDiceSteps(count: number, onStep?: (step: number) => void): Promise<void> {
    if (typeof window === 'undefined' || count <= 0) return;

    const ctx = this.getAudioContext();

    // AudioContextがsuspended状態なら再開
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // 各ステップの音を順番に再生
    for (let i = 0; i < count; i++) {
      await this.playStep(ctx, i);
      onStep?.(i + 1);
      // 次の音まで待機（最後は待たない）
      if (i < count - 1) {
        await this.sleep(180); // 180msの間隔
      }
    }
  }

  // 1ステップの効果音を再生
  private playStep(ctx: AudioContext, stepIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const now = ctx.currentTime;

      // 木琴風の「トン」という音
      // 音程をステップごとに上げていく（ドレミファソラシド風）
      const baseFrequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50]; // C5〜C6
      const freq = baseFrequencies[stepIndex % baseFrequencies.length];

      // メインの音（明るい木琴風）
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // 柔らかい音色
      osc.frequency.setValueAtTime(freq, now);

      // 軽快なアタックと短い減衰
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.01); // 瞬間アタック
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // 短い減衰

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);

      // 倍音を追加（キラキラ感）
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.5, now);

      overtoneGain.gain.setValueAtTime(0, now);
      overtoneGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      overtone.start(now);
      overtone.stop(now + 0.15);

      // クリック音（アタック感を強める）
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();

      click.type = 'square';
      click.frequency.setValueAtTime(freq * 4, now);

      clickGain.gain.setValueAtTime(0, now);
      clickGain.gain.linearRampToValueAtTime(0.08, now + 0.002);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      click.connect(clickGain);
      clickGain.connect(ctx.destination);

      click.start(now);
      click.stop(now + 0.05);

      // 音の長さ分待ってからresolve
      setTimeout(resolve, 100);
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// シングルトン
let diceSoundInstance: DiceSoundGenerator | null = null;

export function getDiceSoundGenerator(): DiceSoundGenerator {
  if (!diceSoundInstance) {
    diceSoundInstance = new DiceSoundGenerator();
  }
  return diceSoundInstance;
}

// ヘルパー関数：マス数に応じた効果音を再生
export const playDiceStepSound = (count: number, onStep?: (step: number) => void) =>
  getDiceSoundGenerator().playDiceSteps(count, onStep);
