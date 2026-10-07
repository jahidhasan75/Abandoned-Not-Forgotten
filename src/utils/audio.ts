// Procedural Web Audio API soundscape synthesizer for Mission Control
// Implements distinct Lunar (Vacuum/Seismic) and Martian (Wind/Atmosphere) soundscapes
// plus authentic Apollo Quindar tones, telemetry blips, and real-time frequency analysis.

export type SoundscapeType = 'LUNAR' | 'MARTIAN';

export interface SoundscapeState {
  isPlaying: boolean;
  environment: SoundscapeType;
  volume: number;
}

type StateListener = (state: SoundscapeState) => void;

class MissionControlAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private environment: SoundscapeType = 'MARTIAN';
  private volume: number = 0.4;
  private listeners: Set<StateListener> = new Set();

  // Web Audio Nodes
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Active Environment Nodes
  private activeSourceNodes: (AudioNode | number)[] = [];
  private windIntervalId: number | null = null;
  private cosmicPingIntervalId: number | null = null;

  constructor() {
    this.environment = 'MARTIAN';
  }

  private notify() {
    const state: SoundscapeState = {
      isPlaying: this.isPlaying,
      environment: this.environment,
      volume: this.volume,
    };
    this.listeners.forEach((fn) => fn(state));
  }

  public subscribe(fn: StateListener): () => void {
    this.listeners.add(fn);
    fn({
      isPlaying: this.isPlaying,
      environment: this.environment,
      volume: this.volume,
    });
    return () => this.listeners.delete(fn);
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume * 0.08, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.08, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public getEnvironment(): SoundscapeType {
    return this.environment;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setEnvironment(env: SoundscapeType) {
    if (this.environment === env && this.isPlaying) return;
    this.environment = env;
    if (this.isPlaying) {
      this.stopCurrentSoundscape();
      this.startCurrentSoundscape();
    }
    this.notify();
  }

  public togglePlay(): boolean {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.startCurrentSoundscape();
    this.playTelemetryPing(1046, 0.06);
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.stopCurrentSoundscape();
    this.notify();
  }

  private stopCurrentSoundscape() {
    // Clear scheduled intervals
    if (this.windIntervalId !== null) {
      window.clearInterval(this.windIntervalId);
      this.windIntervalId = null;
    }
    if (this.cosmicPingIntervalId !== null) {
      window.clearInterval(this.cosmicPingIntervalId);
      this.cosmicPingIntervalId = null;
    }

    // Stop and disconnect nodes
    this.activeSourceNodes.forEach((node) => {
      if (typeof node !== 'number') {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {}
      }
    });
    this.activeSourceNodes = [];
  }

  private startCurrentSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    this.stopCurrentSoundscape();

    if (this.environment === 'LUNAR') {
      this.startLunarSoundscape();
    } else {
      this.startMartianSoundscape();
    }
  }

  // -------------------------------------------------------------
  // LUNAR SOUNDSCAPE: Vacuum stillness, low-frequency seismic resonance,
  // cold electromagnetic drone, and periodic cosmic ray ion pings.
  // -------------------------------------------------------------
  private startLunarSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Sub-harmonic seismic hum (Apollo ALSEP ringing frequency ~48 Hz)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(48, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.3, now);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start();
    this.activeSourceNodes.push(subOsc, subGain);

    // 2. High vacuum ether drone (cold overtone at 96 Hz & 192 Hz)
    const etherOsc = this.ctx.createOscillator();
    etherOsc.type = 'sine';
    etherOsc.frequency.setValueAtTime(96.5, now);

    const etherFilter = this.ctx.createBiquadFilter();
    etherFilter.type = 'lowpass';
    etherFilter.frequency.setValueAtTime(200, now);

    const etherGain = this.ctx.createGain();
    etherGain.gain.setValueAtTime(0.18, now);

    etherOsc.connect(etherFilter);
    etherFilter.connect(etherGain);
    etherGain.connect(this.masterGain);
    etherOsc.start();
    this.activeSourceNodes.push(etherOsc, etherFilter, etherGain);

    // 3. Faint cosmic ray ion ping generator (random high-frequency crystal tones)
    this.cosmicPingIntervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      try {
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        const t = this.ctx.currentTime;
        const freq = 1800 + Math.random() * 800; // Crystal chime

        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(freq, t);
        pingGain.gain.setValueAtTime(0.015, t);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        pingOsc.connect(pingGain);
        pingGain.connect(this.masterGain);
        pingOsc.start(t);
        pingOsc.stop(t + 0.36);
      } catch {}
    }, 4500);
  }

  // -------------------------------------------------------------
  // MARTIAN SOUNDSCAPE: Thin atmosphere wind whispers (InSight SEIS model),
  // dusty micro-gusts, and subtle rover electronics drone.
  // -------------------------------------------------------------
  private startMartianSoundscape() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Procedural Pink Noise buffer for atmospheric wind
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Wind filter swept between 90 Hz and 240 Hz
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(140, now);
    windFilter.Q.setValueAtTime(2.5, now);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.35, now);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    noiseSource.start();
    this.activeSourceNodes.push(noiseSource, windFilter, windGain);

    // 2. Rover low-frequency mechanical hum (60 Hz motor gear resonance)
    const chassisOsc = this.ctx.createOscillator();
    chassisOsc.type = 'triangle';
    chassisOsc.frequency.setValueAtTime(62, now);

    const chassisGain = this.ctx.createGain();
    chassisGain.gain.setValueAtTime(0.12, now);

    chassisOsc.connect(chassisGain);
    chassisGain.connect(this.masterGain);
    chassisOsc.start();
    this.activeSourceNodes.push(chassisOsc, chassisGain);

    // 3. Periodic Martian wind gusts (gentle LFO modulation of windFilter)
    this.windIntervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !windFilter) return;
      try {
        const targetFreq = 100 + Math.random() * 160;
        const rampDuration = 2.5 + Math.random() * 2.0;
        windFilter.frequency.linearRampToValueAtTime(targetFreq, this.ctx.currentTime + rampDuration);
      } catch {}
    }, 3800);
  }

  // -------------------------------------------------------------
  // APOLLO QUINDAR TONE: Authentic 2,525 Hz intro or 2,475 Hz outro
  // -------------------------------------------------------------
  public playQuindarTone(isIntro: boolean = true) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const freq = isIntro ? 2525 : 2475;
      const duration = 0.22;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.setValueAtTime(0.04, now + duration - 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  // -------------------------------------------------------------
  // TELEMETRY PING / RADIO CHIRP
  // -------------------------------------------------------------
  public playTelemetryPing(freq: number = 1046.5, duration: number = 0.08) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + duration);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }
}

export const spaceAudio = new MissionControlAudioEngine();
