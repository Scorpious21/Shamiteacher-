// Web Audio API Synthesizer for Indian Classical Ambient, Temple Bell, Birds, Wind, and Diya Sounds
class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private timerIds: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = this.isMuted ? 0 : 0.25;
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startBGM() {
    this.initContext();
    if (!this.ctx || !this.bgmGain || this.isBgmPlaying) return;

    this.isBgmPlaying = true;

    // Tanpura Drone frequencies (Sa-Pa-Sa harmonic root D2 = ~73.4Hz, A2 = ~110Hz, D3 = ~146.8Hz)
    const freqs = [73.42, 110.0, 146.83, 220.0, 293.66, 440.0];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.bgmGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      // Soft LFO modulation for warm acoustic resonance
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.1 + idx * 0.05;
      lfoGain.gain.value = 0.03;
      lfo.connect(gain.gain);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.value = 800 + idx * 200;

      gain.gain.value = 0.04 / (idx + 1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start();
    });

    // Schedule melodic Indian Classical Flute (Bansuri style notes in Raag Yaman/Bhupali)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 554.37, 587.33]; // D major / Yaman scale notes
    const playRandomFluteNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const note = scale[Math.floor(Math.random() * scale.length)];
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      // Graceful pitch portamento bend
      osc.frequency.exponentialRampToValueAtTime(
        note * (Math.random() > 0.5 ? 1.05 : 0.95),
        this.ctx.currentTime + 1.2
      );

      filter.type = 'lowpass';
      filter.frequency.value = 1200;

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.06, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 2.6);

      const nextInterval = 2000 + Math.random() * 3500;
      const tid = window.setTimeout(playRandomFluteNote, nextInterval);
      this.timerIds.push(tid);
    };

    playRandomFluteNote();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playTempleBell() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.value = this.isMuted ? 0 : 0.4;
    masterGain.connect(this.ctx.destination);

    // Traditional temple bell multi-harmonic frequencies (metallic chime resonance)
    const partials = [
      { f: 432, g: 0.5, d: 4.0 },
      { f: 864, g: 0.3, d: 3.2 },
      { f: 1296, g: 0.2, d: 2.5 },
      { f: 1728, g: 0.15, d: 1.8 },
      { f: 2160, g: 0.1, d: 1.2 },
      { f: 3024, g: 0.05, d: 0.8 },
    ];

    partials.forEach((p) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);

      gain.gain.setValueAtTime(p.g, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + p.d);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + p.d);
    });
  }

  public playDiyaSound() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.gain.value = this.isMuted ? 0 : 0.3;
    gain.connect(this.ctx.destination);

    // Flame ignition / soft match strike noise + warm whoosh swell
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);

    noise.start(now);
  }

  public playBirdChirp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.exponentialRampToValueAtTime(3600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.16);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playClick() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const audioEngine = new AudioEngine();
