/**
 * Procedural Web Audio Sound Engine & Haptic System for Wira Darat
 * Zero external audio assets required; 100% reliable across all browsers,
 * iframe sandboxes, and mobile devices (iOS Safari & Android Chrome).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.75;
  private ambientVolume: number = 0.25;
  private ambientActive: boolean = false;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientTimer: number | null = null;

  constructor() {
    // Load persisted audio settings
    try {
      const storedMute = localStorage.getItem('wd_sound_muted');
      if (storedMute !== null) this.isMuted = storedMute === 'true';
      const storedSfx = localStorage.getItem('wd_sound_sfx');
      if (storedSfx !== null) this.sfxVolume = parseFloat(storedSfx);
      const storedAmbient = localStorage.getItem('wd_sound_ambient');
      if (storedAmbient !== null) this.ambientVolume = parseFloat(storedAmbient);
      const storedAmbientOn = localStorage.getItem('wd_sound_ambient_on');
      if (storedAmbientOn !== null) this.ambientActive = storedAmbientOn === 'true';
    } catch (_) {}
  }

  /**
   * Initializes or resumes the AudioContext on user gesture.
   * Required for iOS Safari and modern Chrome autoplay policies.
   */
  public unlock() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.ambientActive && !this.ambientGain) {
      this.startAmbient();
    }
  }

  public getContext(): AudioContext | null {
    if (!this.ctx) this.unlock();
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('wd_sound_muted', String(muted));
    } catch (_) {}
    if (muted) {
      this.stopAmbient();
    } else if (this.ambientActive) {
      this.startAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('wd_sound_sfx', String(this.sfxVolume));
    } catch (_) {}
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('wd_sound_ambient', String(this.ambientVolume));
    } catch (_) {}
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.15, this.ctx.currentTime);
    }
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public toggleAmbient(active?: boolean) {
    this.ambientActive = active !== undefined ? active : !this.ambientActive;
    try {
      localStorage.setItem('wd_sound_ambient_on', String(this.ambientActive));
    } catch (_) {}
    if (this.ambientActive && !this.isMuted) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.ambientActive;
  }

  public isAmbientActive(): boolean {
    return this.ambientActive && !this.isMuted;
  }

  /**
   * Haptic vibration trigger for Android and iOS touch devices.
   */
  public vibrate(pattern: number | number[] = 15) {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  // ===================== SFX PROCEDURAL SYNTHESIZERS =====================

  /**
   * Quick tactical button blip
   */
  public playTap() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate(10);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Tactical walkie-talkie squelch / radio push-to-talk burst
   */
  public playRadioChirp() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate([15, 20, 15]);
    const t = ctx.currentTime;

    // Dual tone radio preamble
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const toneGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1209, t);
    osc1.frequency.setValueAtTime(1336, t + 0.05);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(697, t);
    osc2.frequency.setValueAtTime(770, t + 0.05);

    toneGain.gain.setValueAtTime(0.08 * this.sfxVolume, t);
    toneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc1.connect(toneGain);
    osc2.connect(toneGain);
    toneGain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.1);
    osc2.stop(t + 0.1);

    // Radio static hiss
    try {
      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 3.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04 * this.sfxVolume, t + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(t + 0.08);
      whiteNoise.stop(t + 0.17);
    } catch (_) {}
  }

  /**
   * Military march drum cadence / boot stomp
   */
  public playMarch() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate([25, 40, 30]);
    const t = ctx.currentTime;

    // 2-step rhythmic cadence
    [0, 0.16, 0.32].forEach((delay, i) => {
      const beatTime = t + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(i === 1 ? 160 : 110, beatTime);
      osc.frequency.exponentialRampToValueAtTime(45, beatTime + 0.1);

      gain.gain.setValueAtTime((i === 2 ? 0.3 : 0.22) * this.sfxVolume, beatTime);
      gain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(beatTime);
      osc.stop(beatTime + 0.13);
    });
  }

  /**
   * Ceremonial military bugle fanfare (G4 -> C5 -> E5 -> G5)
   * Triggered on rank up, medals, or graduation!
   */
  public playFanfare() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate([40, 30, 40, 30, 80]);
    const t = ctx.currentTime;

    // Bugle notes: G4 (392Hz), C5 (523Hz), E5 (659Hz), G5 (784Hz)
    const notes = [
      { f: 392.0, start: 0.00, dur: 0.12 },
      { f: 523.25, start: 0.12, dur: 0.12 },
      { f: 659.25, start: 0.24, dur: 0.14 },
      { f: 783.99, start: 0.38, dur: 0.45 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Brass-like warmth with square + lowpass filter
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, t + n.start);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t + n.start);

      gain.gain.setValueAtTime(0.001, t + n.start);
      gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, t + n.start + 0.02);
      gain.gain.setValueAtTime(0.16 * this.sfxVolume, t + n.start + n.dur - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.start + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + n.start);
      osc.stop(t + n.start + n.dur);
    });
  }

  /**
   * Cash register / salary ping
   */
  public playCash() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate([15, 20, 20]);
    const t = ctx.currentTime;

    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.3);
    });
  }

  /**
   * Warning siren / complication alert
   */
  public playWarning() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate([40, 40, 40, 40]);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.linearRampToValueAtTime(400, t + 0.14);
    osc.frequency.linearRampToValueAtTime(520, t + 0.28);
    osc.frequency.linearRampToValueAtTime(360, t + 0.42);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    gain.gain.setValueAtTime(0.14 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  /**
   * Punchy tactical impact for missions & combat training tests
   */
  public playAction() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate(30);
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * Healing / recovery harmonic chime
   */
  public playHeal() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;

    this.vibrate(15);
    const t = ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.001, t + delay);
      gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, t + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.38);
    });
  }

  // ===================== AMBIENT COMMAND POST SYNTH =====================

  private startAmbient() {
    this.stopAmbient();
    const ctx = this.ctx;
    if (!ctx || this.isMuted || !this.ambientActive) return;

    try {
      const t = ctx.currentTime;
      // Low drone (deep 55Hz & 82.5Hz sub-harmonics representing military operations center air/generator)
      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc2 = ctx.createOscillator();
      this.ambientGain = ctx.createGain();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, t); // A1

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(82.4, t); // E2

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, t);

      this.ambientGain.gain.setValueAtTime(0.001, t);
      this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume * 0.12, t + 1.0);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();

      // Occasional faint high frequency radar blip
      this.scheduleNextRadarBlip();
    } catch (_) {}
  }

  private scheduleNextRadarBlip() {
    if (!this.ambientActive || this.isMuted) return;
    const interval = 12000 + Math.random() * 15000;
    this.ambientTimer = window.setTimeout(() => {
      this.playRadarPing();
      this.scheduleNextRadarBlip();
    }, interval);
  }

  private playRadarPing() {
    if (!this.ambientActive || this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);

      gain.gain.setValueAtTime(0.02 * this.ambientVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.2);
    } catch (_) {}
  }

  private stopAmbient() {
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.ambientOsc1) {
      try { this.ambientOsc1.stop(); } catch (_) {}
      this.ambientOsc1 = null;
    }
    if (this.ambientOsc2) {
      try { this.ambientOsc2.stop(); } catch (_) {}
      this.ambientOsc2 = null;
    }
    if (this.ambientGain) {
      this.ambientGain = null;
    }
  }
}

export const sound = new SoundEngine();
