import type { OpenSound } from "./config";

export type Sfx = "tick" | "shot" | "open" | "detail" | "close" | "glitch";

/**
 * Every sound on the site is synthesized at runtime — no audio files except the
 * movie voice lines. An ambient drone runs continuously under the SFX and is
 * faded in and out by the master gain rather than started and stopped.
 */
export class SoundEngine {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  enabled = false;
  openSound: OpenSound = "cinematic-hit";

  private ensure(): AudioContext {
    if (this.ac) return this.ac;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = (this.ac = new Ctor());

    const master = (this.master = ac.createGain());
    master.gain.value = 0;
    master.connect(ac.destination);

    // ambient drone: three detuned lows behind a lowpass, breathing on a slow LFO
    const drone = ac.createGain();
    drone.gain.value = 0.16;
    drone.connect(master);
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    lp.connect(drone);
    ([[55, "sine"], [82.4, "triangle"], [110.5, "sine"]] as const).forEach(([f, type], i) => {
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = i * 4;
      const g = ac.createGain();
      g.gain.value = i === 0 ? 1 : 0.4;
      o.connect(g);
      g.connect(lp);
      o.start();
    });
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ac.createGain();
    lg.gain.value = 0.07;
    lfo.connect(lg);
    lg.connect(drone.gain);
    lfo.start();

    const noise = (this.noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate));
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    // air: a thin band of noise over the drone
    const air = ac.createBufferSource();
    air.buffer = noise;
    air.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.6;
    const ag = ac.createGain();
    ag.gain.value = 0.012;
    air.connect(bp);
    bp.connect(ag);
    ag.connect(master);
    air.start();

    return ac;
  }

  setEnabled(on: boolean) {
    const ac = this.ensure();
    if (ac.state === "suspended") void ac.resume();
    this.enabled = on;
    const master = this.master!;
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.linearRampToValueAtTime(on ? 1 : 0, ac.currentTime + (on ? 1.5 : 0.4));
  }

  /** Pull the ambient bed down so a voice line sits on top of it. */
  duck(on: boolean) {
    if (!this.ac || !this.master || !this.enabled) return;
    this.master.gain.cancelScheduledValues(this.ac.currentTime);
    this.master.gain.linearRampToValueAtTime(
      on ? 0.25 : 1,
      this.ac.currentTime + (on ? 0.3 : 0.8),
    );
  }

  play(kind: Sfx) {
    if (!this.enabled || !this.ac || !this.master || !this.noise) return;
    const ac = this.ac;
    const master = this.master;
    const t = ac.currentTime;
    const variant: OpenSound = kind === "detail" ? "dark-whisper" : this.openSound;
    if (kind === "detail") kind = "open";

    const noise = (dur: number, freq: number, q: number, gain: number) => {
      const s = ac.createBufferSource();
      s.buffer = this.noise;
      const f = ac.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ac.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(t);
      s.stop(t + dur + 0.05);
    };
    const tone = (
      freq: number,
      dur: number,
      gain: number,
      type: OscillatorType = "sine",
      to?: number,
      dest: AudioNode = master,
    ) => {
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(dest);
      o.start(t);
      o.stop(t + dur + 0.05);
    };

    if (kind === "tick") {
      tone(1400, 0.05, 0.05);
      return;
    }

    if (kind === "shot") {
      // camera shutter: mirror clack (two clicks) then a short mechanical whirr
      const click = (at: number, gain: number, freq: number) => {
        const s = ac.createBufferSource();
        s.buffer = this.noise;
        const f = ac.createBiquadFilter();
        f.type = "highpass";
        f.frequency.value = freq;
        const g = ac.createGain();
        g.gain.setValueAtTime(gain, at);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
        s.connect(f);
        f.connect(g);
        g.connect(master);
        s.start(at);
        s.stop(at + 0.05);
      };
      click(t, 0.55, 2500);
      click(t + 0.075, 0.4, 1800);
      const o = ac.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime(3200, t);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.02, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.1);
      const w = ac.createBufferSource();
      w.buffer = this.noise;
      const wf = ac.createBiquadFilter();
      wf.type = "bandpass";
      wf.frequency.value = 900;
      wf.Q.value = 3;
      const wg = ac.createGain();
      wg.gain.setValueAtTime(0.0001, t + 0.09);
      wg.gain.linearRampToValueAtTime(0.06, t + 0.13);
      wg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      w.connect(wf);
      wf.connect(wg);
      wg.connect(master);
      w.start(t + 0.09);
      w.stop(t + 0.32);
      return;
    }

    if (kind === "close") {
      tone(160, 0.35, 0.18, "sine", 70);
      tone(392, 0.5, 0.04);
      return;
    }

    if (kind === "glitch") {
      for (let i = 0; i < 9; i++) {
        const s = ac.createBufferSource();
        s.buffer = this.noise;
        const f = ac.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 400 + Math.random() * 4000;
        f.Q.value = 2;
        const g = ac.createGain();
        const st = t + i * 0.09 + Math.random() * 0.03;
        g.gain.setValueAtTime(0.3, st);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.05);
        s.connect(f);
        f.connect(g);
        g.connect(master);
        s.start(st);
        s.stop(st + 0.1);
      }
      tone(60, 1.2, 0.5, "sine", 30);
      return;
    }

    if (variant === "dark-whisper") {
      // reversed breath swelling into a dissonant low cluster
      const b = ac.createBufferSource();
      b.buffer = this.noise;
      const bf = ac.createBiquadFilter();
      bf.type = "bandpass";
      bf.frequency.setValueAtTime(300, t);
      bf.frequency.exponentialRampToValueAtTime(1600, t + 0.9);
      bf.Q.value = 1.5;
      const bg = ac.createGain();
      bg.gain.setValueAtTime(0.0001, t);
      bg.gain.exponentialRampToValueAtTime(0.32, t + 0.85);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      b.connect(bf);
      bf.connect(bg);
      bg.connect(master);
      b.start(t);
      b.stop(t + 1.2);
      [41.2, 43.65, 61.74].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = i === 1 ? "triangle" : "sine";
        o.frequency.value = f;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t + 0.8);
        g.gain.linearRampToValueAtTime(0.25, t + 0.95);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
        o.connect(g);
        g.connect(master);
        o.start(t + 0.8);
        o.stop(t + 2.7);
      });
      return;
    }

    if (variant === "bell-in-the-void") {
      // one detuned bell, long decay, faint sub underneath
      ([[220, 1], [220 * 2.76, 0.35], [220 * 5.4, 0.12]] as const).forEach(([f, a]) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.detune.value = (Math.random() - 0.5) * 12;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.16 * a, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + 3.3);
      });
      tone(55, 2, 0.2, "sine", 40);
      return;
    }

    if (variant === "radio-signal") {
      // static, three morse blips, then a falling carrier
      noise(0.6, 1200, 0.5, 0.12);
      [0, 0.13, 0.26].forEach((d, i) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = 880;
        const g = ac.createGain();
        const st = t + 0.1 + d;
        g.gain.setValueAtTime(0.09, st);
        g.gain.setValueAtTime(0.09, st + (i === 2 ? 0.16 : 0.06));
        g.gain.exponentialRampToValueAtTime(0.0001, st + (i === 2 ? 0.2 : 0.09));
        o.connect(g);
        g.connect(master);
        o.start(st);
        o.stop(st + 0.25);
      });
      const c = ac.createOscillator();
      c.type = "sine";
      c.frequency.setValueAtTime(1600, t + 0.55);
      c.frequency.exponentialRampToValueAtTime(120, t + 1.3);
      const cg = ac.createGain();
      cg.gain.setValueAtTime(0.05, t + 0.55);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
      c.connect(cg);
      cg.connect(master);
      c.start(t + 0.55);
      c.stop(t + 1.4);
      return;
    }

    // cinematic hit: warm sub impact with a soft chime tail and a low pad
    tone(48, 1.8, 0.8, "sine", 30);
    tone(96, 1.2, 0.25, "triangle", 60);
    const k = ac.createBufferSource();
    k.buffer = this.noise;
    const kf = ac.createBiquadFilter();
    kf.type = "lowpass";
    kf.frequency.value = 120;
    const kg = ac.createGain();
    kg.gain.setValueAtTime(0.35, t);
    kg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    k.connect(kf);
    kf.connect(kg);
    kg.connect(master);
    k.start(t);
    k.stop(t + 0.35);
    const warm = ac.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 900;
    warm.Q.value = 0.5;
    warm.connect(master);
    [261.63, 329.63, 392].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      const g = ac.createGain();
      const st = t + 0.08 + i * 0.05;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.linearRampToValueAtTime(0.07, st + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 2.2);
      o.connect(g);
      g.connect(warm);
      o.start(st);
      o.stop(st + 2.3);
    });
    const pad = ac.createOscillator();
    pad.type = "sine";
    pad.frequency.value = 130.81;
    const pg = ac.createGain();
    pg.gain.setValueAtTime(0.0001, t + 0.05);
    pg.gain.linearRampToValueAtTime(0.09, t + 0.4);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    pad.connect(pg);
    pg.connect(warm);
    pad.start(t + 0.05);
    pad.stop(t + 2.5);
  }

  dispose() {
    void this.ac?.close();
    this.ac = null;
  }
}
