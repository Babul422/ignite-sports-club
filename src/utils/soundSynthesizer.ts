// Web Audio API Procedural Funky Sports Synthesizer & Soundscape Engine
// Zero external mp3 dependencies - fully synthesized in real time

class SportsAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private isTrackPlaying: boolean = false;
  private beatStep: number = 0;

  constructor() {
    // Check saved mute preference if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ignite_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ignite_audio_muted', muted ? 'true' : 'false');
    }
    if (!muted) {
      this.initContext();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0.75, this.ctx.currentTime, 0.05);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- FUNKY PROCEDURAL ELECTRONIC SPORTS GROOVE ---
  // A funky, punchy electronic groove (~114 BPM) with syncopated synth bass, crisp drums, and brass-like synth stabs
  public startFunkyGroove() {
    if (this.isTrackPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isTrackPlaying = true;
    this.beatStep = 0;

    const tempo = 114;
    const stepDuration = 60 / tempo / 4; // 16th notes (~131ms)

    // Funky bassline notes in D minor / Dorian (D, F, G, G#, A, C)
    const basslineFreqs = [
      73.42, 0, 73.42, 87.31, // D2, -, D2, F2
      98.0, 0, 110.0, 0,     // G2, -, A2, -
      130.81, 0, 110.0, 98.0, // C3, -, A2, G2
      87.31, 73.42, 0, 146.83, // F2, D2, -, D3
    ];

    // Synth chord frequencies (D minor 9 / A minor 7 stabs)
    const chordDmin = [146.83, 220.0, 261.63, 329.63]; // D3, A3, C4, E4
    const chordGdom = [196.0, 246.94, 293.66, 349.23]; // G3, B3, D4, F4

    this.musicInterval = window.setInterval(() => {
      if (!this.isTrackPlaying || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const step = this.beatStep % 16;

      // 1. Drum Machine: Kick drum on steps 0, 6, 8, 14
      if (step === 0 || step === 6 || step === 8 || step === 14) {
        this.triggerKick(now, step === 0 ? 0.9 : 0.65);
      }

      // 2. Snappy electronic snare / clap on steps 4 and 12
      if (step === 4 || step === 12) {
        this.triggerSnare(now, 0.55);
      }

      // 3. Crisp funk hi-hats on all 16ths with swing accents
      if (step % 2 === 0 || step === 3 || step === 7 || step === 11 || step === 15) {
        this.triggerHiHat(now, step % 4 === 2 ? 0.35 : 0.18, step % 4 === 2);
      }

      // 4. Punchy syncopated funk bass note
      const freq = basslineFreqs[step];
      if (freq > 0) {
        this.triggerBassNote(now, freq, stepDuration * 1.5);
      }

      // 5. Funky rhythmic synth stabs on steps 2, 7, 10
      if (step === 2 || step === 7 || step === 10) {
        const chord = step === 10 ? chordGdom : chordDmin;
        this.triggerSynthChord(now, chord, 0.14);
      }

      this.beatStep++;
    }, stepDuration * 1000);
  }

  public stopFunkyGroove() {
    this.isTrackPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public stopAllAudio() {
    this.stopFunkyGroove();
  }

  // --- PROCEDURAL DRUM VOICES ---
  private triggerKick(time: number, velocity = 0.8) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, time);
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);

      gain.gain.setValueAtTime(0.55 * velocity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.24);
    } catch {
      // Audio fallback
    }
  }

  private triggerSnare(time: number, velocity = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    try {
      // Noise burst for snap
      const bufferSize = this.ctx.sampleRate * 0.14;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35 * velocity, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

      // Body tone
      const body = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      body.type = 'triangle';
      body.frequency.setValueAtTime(185, time);
      body.frequency.exponentialRampToValueAtTime(90, time + 0.08);
      bodyGain.gain.setValueAtTime(0.25 * velocity, time);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      body.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + 0.15);
      body.start(time);
      body.stop(time + 0.1);
    } catch {
      // Audio fallback
    }
  }

  private triggerHiHat(time: number, velocity = 0.2, open = false) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const dur = open ? 0.15 : 0.045;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(velocity * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(time);
      source.stop(time + dur);
    } catch {
      // Audio fallback
    }
  }

  // --- FUNKY SYNTH BASS ---
  private triggerBassNote(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4.5, time);
      filter.frequency.setValueAtTime(freq * 1.5, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 6.5, time + 0.03);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.8, time + duration);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.24, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    } catch {
      // Audio fallback
    }
  }

  // --- FUNKY SYNTH CHORD STAB ---
  private triggerSynthChord(time: number, freqs: number[], duration: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      freqs.forEach((f) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, time);
        filter.frequency.exponentialRampToValueAtTime(800, time + duration);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.045, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + duration + 0.02);
      });
    } catch {
      // Audio fallback
    }
  }

  // --- SCENE 2: FOOTBALL IMPACTS ---
  // Heavy strike when the player kicks the ball
  public playFootballKick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);

      this.playWhoosh(1.2);
    } catch {
      // Audio fallback
    }
  }

  // Satisfying stadium-style impact when the ball strikes the net
  public playGoalNetHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Net ripple noise flutter
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      // Deep sub thump
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.3);
      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      sub.connect(subGain);
      subGain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.48);
      sub.start(now);
      sub.stop(now + 0.38);
    } catch {
      // Audio fallback
    }
  }

  // --- SCENE 3: CRICKET BAT HIT ---
  // Crisp resonant wooden willow crack + deep percussive strike
  public playCricketBatHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. High wood crack
      const crack = this.ctx.createOscillator();
      const crackGain = this.ctx.createGain();
      crack.type = 'triangle';
      crack.frequency.setValueAtTime(1280, now);
      crack.frequency.exponentialRampToValueAtTime(420, now + 0.06);

      crackGain.gain.setValueAtTime(0.7, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      // 2. Willow body hollow pop
      const body = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      body.type = 'sine';
      body.frequency.setValueAtTime(320, now);
      body.frequency.exponentialRampToValueAtTime(75, now + 0.18);

      bodyGain.gain.setValueAtTime(0.55, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      crack.connect(crackGain);
      crackGain.connect(this.masterGain);

      body.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      crack.start(now);
      crack.stop(now + 0.09);
      body.start(now);
      body.stop(now + 0.24);

      this.playWhoosh(1.6);
    } catch {
      // Audio fallback
    }
  }

  // --- SCENE 4: BADMINTON SMASH ---
  // Sharp racket string snap and hypersonic zip
  public playBadmintonSmash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // High-frequency nylon string whip
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'sawtooth';
      snap.frequency.setValueAtTime(2600, now);
      snap.frequency.exponentialRampToValueAtTime(680, now + 0.05);

      snapGain.gain.setValueAtTime(0.65, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      // Low whip snap
      const whip = this.ctx.createOscillator();
      const whipGain = this.ctx.createGain();
      whip.type = 'triangle';
      whip.frequency.setValueAtTime(450, now);
      whip.frequency.exponentialRampToValueAtTime(90, now + 0.12);

      whipGain.gain.setValueAtTime(0.4, now);
      whipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      snap.connect(snapGain);
      snapGain.connect(this.masterGain);

      whip.connect(whipGain);
      whipGain.connect(this.masterGain);

      snap.start(now);
      snap.stop(now + 0.08);
      whip.start(now);
      whip.stop(now + 0.15);

      this.playWhoosh(2.1);
    } catch {
      // Audio fallback
    }
  }

  // --- SCENE 5: BASKETBALL SHOT & SWISH ---
  // Rim metallic contact + soft nylon swish
  public playBasketballSwish() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Soft rim clink
      const rim = this.ctx.createOscillator();
      const rimGain = this.ctx.createGain();
      rim.type = 'sine';
      rim.frequency.setValueAtTime(740, now);
      rim.frequency.exponentialRampToValueAtTime(410, now + 0.08);
      rimGain.gain.setValueAtTime(0.28, now);
      rimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      // 2. Crisp nylon net swish
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const swishSource = this.ctx.createBufferSource();
      swishSource.buffer = buffer;

      const swishFilter = this.ctx.createBiquadFilter();
      swishFilter.type = 'bandpass';
      swishFilter.frequency.setValueAtTime(1600, now + 0.04);
      swishFilter.Q.setValueAtTime(2.2, now);

      const swishGain = this.ctx.createGain();
      swishGain.gain.setValueAtTime(0.001, now);
      swishGain.gain.linearRampToValueAtTime(0.42, now + 0.06);
      swishGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      rim.connect(rimGain);
      rimGain.connect(this.masterGain);

      swishSource.connect(swishFilter);
      swishFilter.connect(swishGain);
      swishGain.connect(this.masterGain);

      rim.start(now);
      rim.stop(now + 0.12);
      swishSource.start(now + 0.04);
      swishSource.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // --- SCENE 6: FIRE VORTEX RISING SWEEP ---
  // Rising electronic filter sweep that builds anticipation
  public playFireVortexSweep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 1.8);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(6.0, now);
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.exponentialRampToValueAtTime(4500, now + 1.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch {
      // Audio fallback
    }
  }

  // Massive low-frequency impact and harmonic logo reveal chord
  public playLogoRevealImpact() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Heavy 38Hz sub-bass shockwave
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 0.7);

      subGain.gain.setValueAtTime(0.75, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      sub.connect(subGain);
      subGain.connect(this.masterGain);

      sub.start(now);
      sub.stop(now + 1.3);

      // Shimmering celestial chord (IGNITE theme in D major: D, F#, A, D, F#)
      const notes = [293.66, 369.99, 440.0, 587.33, 739.99];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + 1.7);
      });
    } catch {
      // Audio fallback
    }
  }

  // Atmospheric aerodynamic swoosh
  public playWhoosh(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.2, now);
      filter.frequency.setValueAtTime(280 * pitchMultiplier, now);
      filter.frequency.exponentialRampToValueAtTime(1400 * pitchMultiplier, now + 0.16);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.36);
    } catch {
      // Audio fallback
    }
  }

  public playButtonHover() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback
    }
  }
}

export const sportsAudio = new SportsAudioSynthesizer();
