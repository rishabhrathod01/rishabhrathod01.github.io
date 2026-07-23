// Synthesized drone audio (no samples): a sawtooth+triangle motor hum through
// a bandpass filter whose pitch follows throttle, plus collect/crash SFX.
// Must be initialised from a user gesture (the takeoff long-press qualifies).

class EngineAudio {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private targetGain = 0;
  private masterVolume = 1;
  enabled = true;

  init() {
    if (this.ctx) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      this.ctx = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sawtooth = rotor-tooth whirring; triangle octave fattens the tone.
      osc1.type = "sawtooth";
      osc1.frequency.value = 65;
      osc2.type = "triangle";
      osc2.frequency.value = 130;

      filter.type = "bandpass";
      filter.frequency.value = 180;
      filter.Q.value = 1.8;

      gain.gain.value = 0;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(0);
      osc2.start(0);

      this.osc1 = osc1;
      this.osc2 = osc2;
      this.gain = gain;
      this.filter = filter;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  private now() {
    return this.ctx?.currentTime ?? 0;
  }

  /** volume: 0..1 fraction of the base 0.05 hum gain (prop spin-up ramps this),
   *  further scaled by the user-controlled masterVolume. */
  setHum(volume: number) {
    if (!this.gain) return;
    this.targetGain = this.enabled ? 0.05 * volume * this.masterVolume : 0;
    this.gain.gain.setTargetAtTime(this.targetGain, this.now(), 0.08);
  }

  /** User-controlled master volume, 0..1. Scales the hum and all SFX. */
  setMasterVolume(v: number) {
    this.masterVolume = Math.min(1, Math.max(0, v));
  }

  /** totalThrottle: 0..~3 — pitch and filter track effort like a real drone. */
  setThrottle(totalThrottle: number) {
    if (!this.osc1 || !this.osc2 || !this.filter) return;
    const pitch = 1.0 + totalThrottle * 0.45;
    const t = this.now();
    this.osc1.frequency.setTargetAtTime(65 * pitch, t, 0.05);
    this.osc2.frequency.setTargetAtTime(130 * pitch, t, 0.05);
    this.filter.frequency.setTargetAtTime(180 + totalThrottle * 90, t, 0.05);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.gain) {
      this.gain.gain.setTargetAtTime(enabled ? this.targetGain : 0, this.now(), 0.05);
    }
  }

  playCollect() {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35); // C6
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.1 * this.masterVolume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /** Rising arpeggio for the 8/8 battery easter egg. */
  playArpeggio() {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.masterVolume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  /** Two-tone descending "buzzer" for a race timeout — distinct from the
   *  crash thud, softer and more "clock ran out" than "you broke something". */
  playTimeout() {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    [392, 293.66].forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.masterVolume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  playCrash() {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    gain.gain.setValueAtTime(0.1 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  suspend() {
    this.ctx?.suspend();
  }

  resume() {
    this.ctx?.resume();
  }

  dispose() {
    this.osc1?.stop();
    this.osc2?.stop();
    this.ctx?.close();
    this.ctx = null;
    this.osc1 = this.osc2 = null;
    this.gain = null;
    this.filter = null;
  }
}

export const engineAudio = new EngineAudio();
