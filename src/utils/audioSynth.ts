// High-Tech Cybernetic Sound Synthesizer & Technological Music Engine

export interface MusicTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  genre: string;
}

export const TECH_TRACKS: MusicTrack[] = [
  {
    id: 'cyber-synthwave',
    title: 'Cyber Synthwave',
    subtitle: 'Fütüristik AI & Dark Synthwave Fon Müziği',
    src: '/audio/cyber-synthwave.mp3',
    genre: 'Dark Synthwave'
  },
  {
    id: 'cyberspace-drift',
    title: 'Cyberspace Drift',
    subtitle: 'Siber Uzay & Yüksek Teknoloji Elektronik',
    src: '/audio/cyberspace-drift.mp3',
    genre: 'Cyber Beats'
  },
  {
    id: 'neural-pulse',
    title: 'Neural Pulse',
    subtitle: 'Derin Nöral Ağ & Atmosferik Siber Ritim',
    src: '/audio/neural-pulse.mp3',
    genre: 'Atmospheric Cyber'
  },
];

// Backwards compatibility alias
export const PEACEFUL_TRACKS = TECH_TRACKS;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private audioElement: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private isMusicPlaying: boolean = false;
  private listeners: Set<(playing: boolean, track: MusicTrack) => void> = new Set();

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public subscribe(fn: (playing: boolean, track: MusicTrack) => void): () => void {
    this.listeners.add(fn);
    fn(this.isMusicPlaying, TECH_TRACKS[this.currentTrackIndex]);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    const currentTrack = TECH_TRACKS[this.currentTrackIndex];
    this.listeners.forEach(fn => fn(this.isMusicPlaying, currentTrack));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  /**
   * Futuristic Holographic HUD / Cyber Touch Click
   * Resonant frequency-modulated digital pulse with sub-tactile snap
   */
  public playGlassClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Carrier Oscillator (High-tech digital chirp)
      const carrier = this.ctx.createOscillator();
      const carrierGain = this.ctx.createGain();

      // Modulator Oscillator (Produces laser/cyber metallic texture)
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();

      // Bandpass Filter for futuristic resonant resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.frequency.exponentialRampToValueAtTime(750, t + 0.045);
      filter.Q.setValueAtTime(6.0, t);

      // Carrier setup
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(1850, t);
      carrier.frequency.exponentialRampToValueAtTime(540, t + 0.045);

      // Modulator setup
      modulator.type = 'triangle';
      modulator.frequency.setValueAtTime(3200, t);
      modulator.frequency.exponentialRampToValueAtTime(1100, t + 0.045);

      modGain.gain.setValueAtTime(450, t);
      modGain.gain.exponentialRampToValueAtTime(0.01, t + 0.045);

      carrierGain.gain.setValueAtTime(0.065, t);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      // Connect FM synthesis
      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      carrier.connect(filter);
      filter.connect(carrierGain);
      carrierGain.connect(this.ctx.destination);

      carrier.start(t);
      modulator.start(t);
      carrier.stop(t + 0.05);
      modulator.stop(t + 0.05);

      // Add slight tactile sub punch
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, t);
      sub.frequency.exponentialRampToValueAtTime(45, t + 0.035);
      subGain.gain.setValueAtTime(0.04, t);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(t);
      sub.stop(t + 0.04);

    } catch {}
  }

  /**
   * Futuristic Cyber Warp / Laser Transition Swoosh
   */
  public playSwoosh() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.0, t);
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(2600, t + 0.07);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.16);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.07);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.16);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.17);
    } catch {}
  }

  /**
   * Cybernetic Data Route / Tab Switch Chirp
   */
  public playTabSwitch() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Note 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1250, t);
      osc1.frequency.exponentialRampToValueAtTime(1600, t + 0.025);
      gain1.gain.setValueAtTime(0.04, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.026);

      // Note 2 (micro delay)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1800, t + 0.028);
      osc2.frequency.exponentialRampToValueAtTime(2400, t + 0.055);
      gain2.gain.setValueAtTime(0.035, t + 0.028);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.028);
      osc2.stop(t + 0.056);
    } catch {}
  }

  /**
   * Futuristic High-Tech Task Completed / Authorization Granted Chime
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const freqs = [987.7, 1318.5, 1661.2, 2093.0]; // Sci-Fi Harmonic Triad + Octave

      freqs.forEach((freq, idx) => {
        const noteTime = t + idx * 0.045;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.04, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.33);
      });
    } catch {}
  }

  /**
   * Cyber Anomaly / Glitch Tone Warning
   */
  public playErrorBeep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.setValueAtTime(190, t + 0.04);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.095);
    } catch {}
  }

  /**
   * AI Quantum Neural Sparkle / Processing Indicator
   */
  public playAiSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [1350, 1680, 2020, 2460, 2900];

      notes.forEach((freq, idx) => {
        const noteTime = t + idx * 0.03;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.03, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.13);
      });
    } catch {}
  }

  /**
   * Cyber Mechanical Keystroke Tick (for Terminal & inputs)
   */
  public playTerminalKey() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.015);

      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.018);
    } catch {}
  }

  /**
   * Synthesized Cute Cat Meow Sound Effect
   */
  public playCatMeow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Frequency glide: starts at 480Hz, glides up to 780Hz, gently drops to 520Hz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + 0.35);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(460, t);
      osc.frequency.linearRampToValueAtTime(740, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(510, t + 0.32);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    } catch {}
  }

  /**
   * Synthesized Cute Cat Purr Sound Effect
   */
  public playCatPurr() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const mainGain = this.ctx.createGain();

      lfo.frequency.setValueAtTime(26, t); // 26Hz purr vibration
      lfoGain.gain.setValueAtTime(0.04, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, t);

      mainGain.gain.setValueAtTime(0.04, t);
      mainGain.gain.linearRampToValueAtTime(0.06, t + 0.3);
      mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      lfo.connect(lfoGain.gain);
      osc.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      lfo.start(t);
      osc.start(t);
      lfo.stop(t + 0.9);
      osc.stop(t + 0.9);
    } catch {}
  }

  /**
   * Synthesized Toy Ball Bouncing / Swat sound effect
   */
  public playBallBounce() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch {}
  }

  /**
   * Synthesized playful cat jump / pounce sound
   */
  public playCatPounce() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.15);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.19);
    } catch {}
  }

  private getOrCreateAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioElement) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = this.isMuted ? 0 : 0.42;
      audio.preload = 'auto';

      audio.addEventListener('play', () => {
        this.isMusicPlaying = true;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        this.isMusicPlaying = false;
        this.notify();
      });

      audio.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audioElement = audio;
    }
    return this.audioElement;
  }

  public toggleAmbientFocusSoundscape(): boolean {
    const audio = this.getOrCreateAudio();
    if (!audio) return false;

    if (this.isMusicPlaying) {
      audio.pause();
      this.isMusicPlaying = false;
      this.notify();
      return false;
    } else {
      const track = TECH_TRACKS[this.currentTrackIndex];
      if (!audio.src || !audio.src.includes(track.src)) {
        audio.src = track.src;
      }
      audio.muted = this.isMuted;
      audio.volume = 0.42;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            this.notify();
          })
          .catch((err) => {
            console.warn('Audio playback error:', err);
            this.isMusicPlaying = false;
            this.notify();
          });
      }
      return true;
    }
  }

  public nextTrack(): MusicTrack {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % TECH_TRACKS.length;
    const track = TECH_TRACKS[this.currentTrackIndex];
    const audio = this.getOrCreateAudio();
    if (audio) {
      audio.src = track.src;
      if (this.isMusicPlaying) {
        audio.play().catch(() => {});
      }
    }
    this.notify();
    return track;
  }

  public getCurrentTrack(): MusicTrack {
    return TECH_TRACKS[this.currentTrackIndex];
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundEngine = new SoundEngine();
