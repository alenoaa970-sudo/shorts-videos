import { interpolate, Easing, spring } from 'remotion';
import timeline from './timeline.json';

export type Word = { w: string; s: number; e: number };
export type Seg = {
  key: string; from: number; dur: number; words: Word[]; tag: string; title: string; costume: string; serious?: boolean;
};
export const TL = timeline as { fps: number; total: number; tipo?: string; segments: Seg[] };
export const FPS = 30;

export const OUT_EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const lerp = (f: number, input: number[], output: number[], ease: ((t: number) => number) | null = OUT_EASE) =>
  interpolate(f, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    ...(ease ? { easing: ease } : {}),
  });

export const pop = (f: number, start: number, damping = 9) =>
  f < start ? 0 : spring({ frame: f - start, fps: FPS, config: { damping, stiffness: 180, mass: 0.7 } });

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** frame LOCAL (relativo a la escena) en que empieza la palabra */
export const wordAt = (seg: Seg, text: string, nth = 0) => {
  const n = norm(text);
  let k = 0;
  for (const w of seg.words) {
    if (norm(w.w).startsWith(n)) {
      if (k === nth) return w.s - seg.from;
      k++;
    }
  }
  return 99999;
};

/** apertura de boca (0..1) en el frame global */
export const talkAt = (frame: number) => {
  for (const s of TL.segments) {
    for (const w of s.words) {
      if (frame >= w.s && frame <= w.e + 1) {
        const p = (frame - w.s) / Math.max(1, w.e - w.s);
        return 0.35 + 0.65 * Math.abs(Math.sin(p * Math.PI * Math.max(1, Math.round(w.w.length / 3))));
      }
    }
  }
  return 0;
};

export const segAt = (frame: number) => {
  const segs = TL.segments;
  for (let i = segs.length - 1; i >= 0; i--) if (frame >= segs[i].from) return { seg: segs[i], idx: i };
  return { seg: segs[0], idx: 0 };
};

export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
