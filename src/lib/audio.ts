import { config } from '../config';

// ── Background music (the .mp3 the user drops into /public) ───────────

let musicEl: HTMLAudioElement | null = null;

function getMusic(): HTMLAudioElement {
  if (!musicEl) {
    musicEl = new Audio(`${import.meta.env.BASE_URL}${config.musicUrl}`);
    musicEl.loop = true;
    musicEl.volume = 0.6;
    musicEl.preload = 'auto';
  }
  return musicEl;
}

/** Start the looping birthday song. Safe to call even if the file is missing. */
export function playMusic(): void {
  getMusic()
    .play()
    .catch(() => {
      /* file not added yet, or blocked — the surprise still works fine */
    });
}

export function setMusicMuted(muted: boolean): void {
  if (musicEl) musicEl.muted = muted;
}

// ── Sound effects (synthesized — no files needed) ────────────────────

type Sfx = 'click' | 'pop' | 'blow';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Tiny, cute UI sound. Triggered from user gestures so it's never blocked. */
export function playSfx(type: Sfx): void {
  if (!config.enableSfx) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  if (type === 'blow') {
    // Soft filtered noise — a little puff of air.
    const dur = 0.28;
    const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 850;
    const g = ac.createGain();
    g.gain.value = 0.3;
    src.connect(lp).connect(g).connect(ac.destination);
    src.start(now);
    return;
  }

  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.connect(g).connect(ac.destination);

  if (type === 'click') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.13);
  } else {
    // 'pop' — a cute upward blip.
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.32, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}
