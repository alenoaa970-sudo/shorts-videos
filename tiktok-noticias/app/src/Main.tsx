import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadMont } from '@remotion/google-fonts/Montserrat';
import { Robot, Expression, Costume, ArmPose, RobotProps } from './Robot';
import { TL, Seg, lerp, pop, wordAt, talkAt, segAt, rnd } from './util';
import { IntroScene, DebateScene, CanariasScene, TiempoScene, BebesScene, IranScene, ChinaScene, VoyagerScene, ShenzhenScene, PrestamoScene, DecretosScene, HuelgaScene } from './Scenes';

loadAnton();
loadMont('normal', { weights: ['700', '800', '900'], subsets: ['latin', 'latin-ext'] });

const HEAD = "'Anton', Impact, sans-serif";
const BODY = "'Montserrat', 'DejaVu Sans', sans-serif";

const SCENES: Record<string, React.FC<{ f: number; seg: Seg; T: number }>> = {
  intro: IntroScene, debate: DebateScene, canarias: CanariasScene, tiempo: TiempoScene,
  bebes: BebesScene, iran: IranScene, china: ChinaScene, voyager: VoyagerScene,
  shenzhen: ShenzhenScene, prestamo: PrestamoScene, decretos: DecretosScene, huelga: HuelgaScene,
};

/* ---------- configuración del robot por noticia ---------- */
const robotFor = (seg: Seg, f: number, T: number): Omit<RobotProps, 't' | 'talk' | 'timer' | 'blink'> => {
  const after = (w: string, n = 0) => f >= wordAt(seg, w, n);
  switch (seg.key) {
    case 'intro':
      return { costume: 'anchor', arm: 'thumb', expression: after('vamos') ? 'wink' : after('minuto') ? 'stars' : 'happy', armLift: pop(f, wordAt(seg, 'vamos'), 6) * 0.6 };
    case 'debate': {
      const memT = wordAt(seg, 'memoria');
      const punch = (s: number) => Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, (f - s) / 6) * Math.PI)));
      const lift = Math.max(punch(wordAt(seg, 'cara')), punch(wordAt(seg, 'cara', 1)), punch(wordAt(seg, 'feijoo')));
      const e: Expression = f >= memT ? 'dizzy' : after('cafe') ? 'shock' : 'happy';
      return { costume: 'boxing', arm: 'punch', expression: e, armLift: lift, coffee: pop(f, wordAt(seg, 'cafe') - 3, 10) };
    }
    case 'canarias':
      return { costume: 'vest', arm: 'down', expression: 'serious' };
    case 'tiempo': {
      const flipT = wordAt(seg, 'paraguas', 1);
      const vT = wordAt(seg, 'vuela');
      return {
        costume: 'raincoat', arm: 'hold', item: 'umbrella',
        expression: f >= vT ? 'shock' : 'happy',
        umbrellaFlip: lerp(f, [flipT + 4, flipT + 10], [0, 1]),
        umbrellaFly: lerp(f, [vT - 2, vT + 30], [0, 1], (t) => t * t),
      };
    }
    case 'bebes':
      return { costume: 'baby', arm: 'hold', item: 'bottle', expression: f < 30 ? 'stars' : after('fiesta') ? 'stars' : 'happy', partyHat: pop(f, wordAt(seg, 'fiesta') - 4, 8) };
    case 'iran':
      return { costume: 'helmet', arm: 'down', expression: 'serious' };
    case 'china': {
      const hT = wordAt(seg, 'abrazo');
      return { costume: 'diplomat', arm: 'hold', item: 'flags', expression: f >= hT - 2 && f < hT + 45 ? 'hearts' : 'happy' };
    }
    case 'shenzhen':
      return { costume: 'diplomat', arm: 'hold', item: 'flags', expression: after('kiev') ? 'serious' : 'happy' };
    case 'prestamo':
      return { costume: 'business', arm: 'hold', item: 'briefcase', expression: after('cuarenta') && !after('veinticinco') ? 'stars' : after('oponen') ? 'shock' : 'happy' };
    case 'decretos':
      return { costume: 'deputy', arm: 'down', expression: 'serious' };
    case 'huelga': {
      const sT = wordAt(seg, 'sigueme');
      return { costume: 'conductor', arm: 'thumb', expression: f >= sT ? 'wink' : after('maquinistas') && !after('horario') ? 'shock' : 'happy', armLift: pop(f, sT, 6) * 0.7 };
    }
    case 'voyager': {
      const sT = wordAt(seg, 'sigueme');
      return { costume: 'astronaut', arm: 'thumb', expression: f >= sT ? 'wink' : after('ex') ? 'shock' : 'happy', armLift: pop(f, sT, 6) * 0.7 };
    }
  }
  // por defecto (noticias nuevas sin configuración propia): según el disfraz y si es seria
  const c = (seg.costume || 'anchor') as Costume;
  const item = c === 'business' ? 'briefcase' : c === 'judge' ? 'gavel' : undefined;
  if (seg.serious) return { costume: c, arm: item ? 'hold' : 'down', item, expression: 'serious' };
  return { costume: c, arm: item ? 'hold' : 'thumb', item, expression: 'happy' };
};

/* ---------- Robot en escena ---------- */
const RobotLayer: React.FC<{ T: number; seg: Seg; f: number; idx: number }> = ({ T, seg, f, idx }) => {
  const cfg = robotFor(seg, f, T);
  const talk = talkAt(T);
  const remaining = Math.max(0, Math.ceil(60 - T / 30));
  const timer = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  const bc = T % 97;
  const blink = bc < 5 ? 1 - Math.abs(bc - 2) / 2.5 : 0;
  const isVoy = seg.key === 'voyager';
  const bob = Math.sin(T * 0.12) * (isVoy ? 22 : 8) + talk * 4;
  const tilt = Math.sin(T * 0.05) * (isVoy ? 5 : 2) + (cfg.expression === 'shock' ? Math.sin(T * 1.2) * 2 : 0);
  // entrada en la intro
  const drop = seg.key === 'intro' ? lerp(f, [0, 16], [-1500, 0], (t) => t) : 0;
  const land = seg.key === 'intro' ? pop(f, 16, 6) : 1;
  const squashIntro = seg.key === 'intro' && f >= 16 && f < 30 ? 1 - 0.12 * Math.sin(((f - 16) / 14) * Math.PI) : 1;
  // cambio de disfraz
  const change = idx > 0 ? pop(f, 0, 7) : 1;
  const sc = 0.82 * (idx > 0 ? 0.85 + 0.15 * change : 1);
  const shakeX = seg.key === 'iran' ? Math.sin(T * 0.9) * (f < 8 ? 6 : 0) : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <ellipse cx={540} cy={1880} rx={300} ry={30} fill="#000" opacity={0.3} />
      <g transform={`translate(${540 + shakeX} ${1330 + bob + drop}) rotate(${tilt}) scale(${sc / squashIntro} ${sc * squashIntro * (land > 0 ? 1 : 1)}) translate(-540 -430)`}>
        <Robot t={T} talk={talk} timer={timer} blink={blink} {...cfg} />
      </g>
      {/* humo de cambio de disfraz */}
      {idx > 0 && f < 18 && (
        <g opacity={1 - f / 18}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r = 160 + f * 22;
            return <circle key={i} cx={540 + Math.cos(a) * r} cy={1300 + Math.sin(a) * r * 0.8} r={70 + f * 4 + rnd(i) * 30} fill="#ffffff" />;
          })}
        </g>
      )}
      {seg.key === 'intro' && f >= 16 && f < 34 && (
        <g opacity={1 - (f - 16) / 18}>
          {Array.from({ length: 10 }).map((_, i) => {
            const side = i % 2 ? 1 : -1;
            const g = f - 16;
            return <circle key={i} cx={540 + side * (180 + g * 20 + i * 12)} cy={1840 - i * 8} r={40 + g * 3} fill="#bfd0ff" />;
          })}
        </g>
      )}
    </svg>
  );
};

/* ---------- Titular ---------- */
const Headline: React.FC<{ seg: Seg; f: number; idx: number }> = ({ seg, f, idx }) => {
  if (seg.key === 'intro') return null;
  const s = pop(f, 2, 12);
  const x = lerp(f, [0, 12], [-1100, 0]);
  const tagCol = seg.serious ? '#ff5a3c' : '#ff2d55';
  const n = TL.segments.length - 1;
  return (
    <div style={{ position: 'absolute', top: 210, left: 40, width: 1000, transform: `translateX(${x}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: tagCol, color: '#fff', fontFamily: HEAD, fontSize: 44, padding: '6px 26px', borderRadius: 14, border: '5px solid #05080f', letterSpacing: 2, transform: `scale(${s})`, transformOrigin: 'left center' }}>
          NOTICIA {idx}/{n}
        </div>
      </div>
      <div style={{ marginTop: 14, background: 'rgba(5,8,15,0.82)', borderLeft: `14px solid ${tagCol}`, borderRadius: 20, padding: '16px 26px', boxShadow: '0 12px 0 rgba(0,0,0,0.35)' }}>
        <div style={{ fontFamily: HEAD, fontSize: 70, lineHeight: 1.05, color: '#fff', letterSpacing: 1 }}>{seg.title}</div>
      </div>
      {/* barra de progreso */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {Array.from({ length: n }).map((_, i) => {
          const fill = i + 1 < idx ? 1 : i + 1 === idx ? Math.min(1, f / seg.dur) : 0;
          return (
            <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.25)', overflow: 'hidden', border: '2px solid rgba(5,8,15,0.6)' }}>
              <div style={{ width: `${fill * 100}%`, height: '100%', background: tagCol }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Subtítulos palabra a palabra ---------- */
type Chunk = { words: { w: string; s: number; e: number }[]; s: number; e: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const seg of TL.segments) {
    let cur: Chunk | null = null;
    seg.words.forEach((w, i) => {
      const prev = seg.words[i - 1];
      const gap = prev ? w.s - prev.e : 0;
      if (!cur || cur.words.length >= 3 || gap > 7 || cur.words.map((x) => x.w).join(' ').length + w.w.length > 15) {
        if (cur) out.push(cur);
        cur = { words: [], s: w.s, e: w.e };
      }
      cur.words.push(w);
      cur.e = w.e;
    });
    if (cur) out.push(cur);
  }
  for (let i = 0; i < out.length; i++) out[i].e = i + 1 < out.length ? Math.min(out[i + 1].s, out[i].e + 12) : out[i].e + 12;
  return out;
})();

const Captions: React.FC<{ T: number }> = ({ T }) => {
  const c = CHUNKS.find((k) => T >= k.s && T < k.e);
  if (!c || T < TL.segments[1].from) return null;
  const s = pop(T, c.s, 10);
  return (
    <div style={{ position: 'absolute', top: 975, left: 0, width: 1080, display: 'flex', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * s}) rotate(${(1 - s) * -4}deg)`, display: 'flex', gap: 34, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000 }}>
        {c.words.map((w, i) => {
          const active = T >= w.s && (T < w.e + 2 || i === c.words.length - 1);
          const done = T >= w.s;
          return (
            <span key={i} style={{
              fontFamily: BODY, fontWeight: 900, fontSize: 80, textTransform: 'uppercase',
              color: active ? '#ffe14d' : '#ffffff', opacity: done ? 1 : 0.55,
              WebkitTextStroke: '14px #05080f', paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgba(0,0,0,0.45)',
              transform: active ? 'translateY(-6px)' : 'none', display: 'inline-block',
            }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Transiciones ---------- */
const Wipes: React.FC<{ T: number }> = ({ T }) => {
  const b = TL.segments.slice(1).find((s) => T >= s.from - 9 && T <= s.from + 9);
  if (!b) return null;
  const p = (T - (b.from - 9)) / 18;
  const cols = ['#2fd8ff', '#ff2d55', '#0b1434'];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      {cols.map((c, i) => {
        const x = -1900 + (p * 1.0 + (2 - i) * 0.0) * 3900 - i * 120;
        return <path key={i} d={`M${x} 0 L${x + 1500} 0 L${x + 900} 1920 L${x - 600} 1920 Z`} fill={c} />;
      })}
    </svg>
  );
};

/* ---------- Composición ---------- */
export const Noticias: React.FC = () => {
  const T = useCurrentFrame();
  const { seg, idx } = segAt(T);
  const f = T - seg.from;
  const Scene = SCENES[seg.key];
  const vignette = 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)';
  const endFade = lerp(T, [TL.total - 8, TL.total], [0, 1], null);
  return (
    <AbsoluteFill style={{ background: '#03050f' }}>
      <Scene f={f} seg={seg} T={T} />
      <AbsoluteFill style={{ background: vignette }} />
      <RobotLayer T={T} seg={seg} f={f} idx={idx} />
      <Headline seg={seg} f={f} idx={idx} />
      <Captions T={T} />
      <Wipes T={T} />
      <AbsoluteFill style={{ background: '#000', opacity: endFade * 0 }} />
    </AbsoluteFill>
  );
};
