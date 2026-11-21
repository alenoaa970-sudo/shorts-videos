import React from 'react';
import { Seg, lerp, pop, wordAt, rnd, TL } from './util';
import { USFlag, ChinaFlag, RussiaFlag } from './Robot';

const OUT = '#05080f';
const HEAD = "'Anton', Impact, sans-serif";
const BODY = "'Montserrat', 'DejaVu Sans', sans-serif";

type P = { f: number; seg: Seg; T: number };

const Pill: React.FC<{ x: number; y: number; text: string; s: number; bg?: string; color?: string; size?: number; rot?: number }> = ({
  x, y, text, s, bg = '#ff2d55', color = '#fff', size = 46, rot = 0,
}) => {
  const w = text.length * size * 0.56 + 70;
  const h = size + 40;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={h / 2} fill={OUT} opacity={0.45} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={bg} stroke={OUT} strokeWidth={6} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={HEAD} fontSize={size} fill={color} letterSpacing={1}>
        {text}
      </text>
    </g>
  );
};

const BigText: React.FC<{ x: number; y: number; text: string; s: number; size: number; fill?: string; rot?: number }> = ({
  x, y, text, s, size, fill = '#fff', rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={Math.min(1, s * 1.4)}>
    <text x={6} y={8} textAnchor="middle" fontFamily={HEAD} fontSize={size} fill={OUT} opacity={0.55}>{text}</text>
    <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={size} fill={fill} stroke={OUT} strokeWidth={size * 0.08} paintOrder="stroke" letterSpacing={2}>
      {text}
    </text>
  </g>
);

const Particles: React.FC<{ T: number; n: number; color: string; seed: number; speed?: number; size?: number; op?: number }> = ({
  T, n, color, seed, speed = 0.6, size = 4, op = 0.6,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = rnd(i + seed) * 1080;
      const y = ((rnd(i * 3 + seed) * 1920 - T * speed * (0.5 + rnd(i + 7))) % 1920 + 1920) % 1920;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(T * 0.05 + i));
      return <circle key={i} cx={x} cy={y} r={size * (0.5 + rnd(i * 5 + seed))} fill={color} opacity={op * tw} />;
    })}
  </g>
);

/* ===================== INTRO ===================== */
export const IntroScene: React.FC<P> = ({ f, T, seg }) => {
  const beams = [0, 1, 2, 3, 4, 5];
  const l1 = pop(f, 2, 10), l2 = pop(f, 9, 10), l3 = pop(f, 17, 11);
  const tMin = wordAt(seg, 'minuto');
  const badge = pop(f, tMin - 4, 8);
  const go = pop(f, wordAt(seg, 'vamos'), 7);
  const shake = f > tMin - 4 && f < tMin + 6 ? Math.sin(f * 3) * 8 : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="in-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0" stopColor="#2848b8" />
          <stop offset="0.5" stopColor="#0d1748" />
          <stop offset="1" stopColor="#03050f" />
        </radialGradient>
        <linearGradient id="in-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5ff0ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5ff0ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="in-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4d6a" />
          <stop offset="1" stopColor="#c4001f" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#in-bg)" />
      {beams.map((i) => {
        const a = -60 + i * 24 + Math.sin(T * 0.03 + i) * 10;
        return (
          <g key={i} transform={`rotate(${a} 540 1900)`}>
            <path d="M540 1900 L470 -200 L610 -200 Z" fill="url(#in-beam)" opacity={0.6} />
          </g>
        );
      })}
      {/* suelo LED */}
      <g stroke="#5ff0ff" strokeOpacity={0.18} strokeWidth={2}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M540 1250 L${-600 + i * 205} 1920`} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 1250 + Math.pow((i + ((T * 0.04) % 1)) / 8, 2) * 670;
          return <path key={`h${i}`} d={`M0 ${y} H1080`} />;
        })}
      </g>
      <Particles T={T} n={50} color="#7fe9ff" seed={3} />
      <g transform={`translate(${shake} 0)`}>
        <BigText x={540} y={560} text={TL.tipo === 'semanal' ? 'LO MÁS IMPORTANTE' : 'LAS NOTICIAS'} s={l1} size={TL.tipo === 'semanal' ? 112 : 150} />
        <BigText x={540} y={710} text={TL.tipo === 'semanal' ? 'DE LA SEMANA' : 'MÁS IMPORTANTES'} s={l2} size={124} fill="#ffe14d" />
        <BigText x={540} y={810} text={TL.tipo === 'semanal' ? 'EL RESUMEN DE 7 DÍAS' : 'DE LAS ÚLTIMAS 24 HORAS'} s={l3} size={74} />
        {/* insignia */}
        <g transform={`translate(540 950) scale(${badge}) rotate(${-4 + (1 - badge) * 20})`}>
          <rect x={-350} y={-78} width={700} height={156} rx={78} fill={OUT} opacity={0.5} transform="translate(10 12)" />
          <rect x={-350} y={-78} width={700} height={156} rx={78} fill="url(#in-red)" stroke={OUT} strokeWidth={8} />
          <g transform="translate(-262 0)">
            <circle r={52} fill="#fff" stroke={OUT} strokeWidth={7} />
            <rect x={-12} y={-74} width={24} height={20} rx={4} fill="#fff" stroke={OUT} strokeWidth={6} />
            <path d={`M0 0 L${Math.sin(T * 0.25) * 34} ${-Math.cos(T * 0.25) * 34}`} stroke="#ff2d55" strokeWidth={8} strokeLinecap="round" />
            <circle r={7} fill={OUT} />
          </g>
          <text x={60} y={33} textAnchor="middle" fontFamily={HEAD} fontSize={94} fill="#fff">EN 1 MINUTO</text>
        </g>
      </g>
      {go > 0.01 && (
        <g opacity={lerp(f, [wordAt(seg, 'vamos'), wordAt(seg, 'vamos') + 30], [1, 0], null)}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r = 120 + go * 380;
            return <path key={i} d={`M${540 + Math.cos(a) * r * 0.6} ${950 + Math.sin(a) * r * 0.6} L${540 + Math.cos(a) * r} ${950 + Math.sin(a) * r}`} stroke="#ffe14d" strokeWidth={10} strokeLinecap="round" />;
          })}
        </g>
      )}
    </svg>
  );
};

/* ===================== DEBATE ===================== */
const Podium: React.FC<{ x: number; name: string; s: number; T: number; side: number }> = ({ x, name, s, T, side }) => (
  <g transform={`translate(${x} 900) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={150} ry={26} fill="#000" opacity={0.35} />
    <path d="M-120 0 L-100 -300 L100 -300 L120 0 Z" fill="#2a2350" stroke={OUT} strokeWidth={7} />
    <path d="M-100 -300 L100 -300 L90 -270 L-90 -270 Z" fill="#ffd23f" stroke={OUT} strokeWidth={5} />
    <path d="M-95 -230 L95 -230" stroke="#7a6cff" strokeWidth={4} opacity={0.6} />
    <rect x={-104} y={-200} width={208} height={64} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={6} />
    <text x={0} y={-155} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>{name}</text>
    <path d={`M${side * 30} -300 Q ${side * 60} -380 ${side * 20} -420`} fill="none" stroke={OUT} strokeWidth={8} />
    <ellipse cx={side * 20} cy={-428} rx={16} ry={22} fill="#3a3a48" stroke={OUT} strokeWidth={5} />
    <circle cx={side * 20} cy={-438} r={5} fill="#ff3b4e" opacity={Math.floor(T / 10) % 2 ? 1 : 0.3} />
    <path d="M-80 -120 L-80 -20 M0 -120 L0 -20 M80 -120 L80 -20" stroke="#4a3f86" strokeWidth={6} />
  </g>
);

export const DebateScene: React.FC<P> = ({ f, T, seg }) => {
  const vsT = wordAt(seg, 'cara');
  const vs = pop(f, vsT, 7);
  const pods = pop(f, 4, 12);
  const clock = pop(f, wordAt(seg, 'jueves') - 2, 10);
  const elec = pop(f, wordAt(seg, 'elecciones') - 3, 10);
  const mit = pop(f, wordAt(seg, 'cancelan') - 2, 10);
  const memT = wordAt(seg, 'memoria');
  const mem = pop(f, memT - 4, 8);
  const flash = lerp(f, [vsT, vsT + 8], [0.7, 0], null);
  const glitch = f > memT ? (Math.floor(f / 3) % 2 ? 6 : -6) : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="db-bg" cx="50%" cy="45%" r="80%">
          <stop offset="0" stopColor="#5a2a9a" />
          <stop offset="0.55" stopColor="#1d0f3e" />
          <stop offset="1" stopColor="#07030f" />
        </radialGradient>
        <linearGradient id="db-spot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#db-bg)" />
      {/* público */}
      <g fill="#0b0620">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = i * 44 - 10;
          const y = 1080 + Math.sin(i * 1.7) * 12 + Math.sin(T * 0.2 + i) * 4;
          return <g key={i}><circle cx={x} cy={y} r={26} /><rect x={x - 32} y={y + 18} width={64} height={120} rx={26} /></g>;
        })}
      </g>
      {/* focos */}
      {[0, 1, 2, 3].map((i) => {
        const a = Math.sin(T * 0.04 + i * 1.6) * 18;
        return (
          <g key={i} transform={`rotate(${a} ${150 + i * 260} 380)`}>
            <path d={`M${150 + i * 260} 380 L${70 + i * 260} 1300 L${230 + i * 260} 1300 Z`} fill="url(#db-spot)" opacity={0.5} />
            <circle cx={150 + i * 260} cy={380} r={18} fill="#fff6d0" />
          </g>
        );
      })}
      {/* cuerdas del ring */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M-20 ${960 + i * 52} Q 540 ${930 + i * 52} 1100 ${960 + i * 52}`} fill="none" stroke={i === 1 ? '#ffffff' : '#ff2d55'} strokeWidth={14} opacity={0.9} />
      ))}
      <rect x={30} y={900} width={30} height={220} rx={8} fill="#c9cfdb" stroke={OUT} strokeWidth={5} />
      <rect x={1020} y={900} width={30} height={220} rx={8} fill="#c9cfdb" stroke={OUT} strokeWidth={5} />
      <Podium x={190} name="SÁNCHEZ" s={pods} T={T} side={1} />
      <Podium x={890} name="FEIJÓO" s={pods} T={T + 5} side={-1} />
      {/* reloj */}
      <g opacity={1 - mit}>
        <Pill x={540} y={530} text="JUEVES · 22:00 H" s={clock} bg="#ffe14d" color={OUT} size={50} />
      </g>
      <g opacity={1 - mem}>
        <Pill x={540} y={530} text="LOS DOS CANCELAN MÍTINES" s={mit} bg="#7a5cff" size={42} />
      </g>
      <Pill x={540} y={880} text="ELECCIONES 29-N" s={elec * (1 - mem)} bg="#ffffff" color={OUT} size={40} rot={-3} />
      {/* VS */}
      <g transform={`translate(540 710) scale(${0.8 * vs * (1 - mem)}) rotate(${-8 + (1 - vs) * 30})`}>
        <path d="M-120 -40 L40 -140 L10 -30 L130 -60 L-40 140 L-10 20 L-130 50 Z" fill="#ffe14d" stroke={OUT} strokeWidth={9} strokeLinejoin="round" />
        <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={150} fill="#ff2d55" stroke={OUT} strokeWidth={10} paintOrder="stroke">VS</text>
      </g>
      {/* memoria 0% */}
      <g transform={`translate(${540 + glitch} 640) scale(${mem})`}>
        <rect x={-320} y={-90} width={640} height={250} rx={24} fill="#0a0f1f" stroke="#ff2d55" strokeWidth={8} />
        <text x={0} y={-12} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#ff2d55">MEMORIA: 0%</text>
        <rect x={-250} y={22} width={500} height={38} rx={10} fill="none" stroke="#ff2d55" strokeWidth={5} />
        <rect x={-246} y={26} width={Math.max(0, 30 - (f - memT) * 2)} height={30} rx={8} fill="#ff2d55" />
        <text x={0} y={120} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={27} fill="#ffe14d">ERROR 404: DATOS NO ENCONTRADOS</text>
      </g>
      <rect width={1080} height={1920} fill="#ffffff" opacity={flash} />
    </svg>
  );
};

/* ===================== CANARIAS ===================== */
const ISLANDS: { name: string; x: number; y: number; d: string }[] = [
  { name: 'El Hierro', x: 130, y: 735, d: 'M-40 0 Q -30 -30 0 -26 Q 34 -20 40 6 Q 10 26 -40 0 Z' },
  { name: 'La Palma', x: 175, y: 600, d: 'M-18 -50 Q 14 -46 20 0 Q 16 46 -6 50 Q -24 10 -18 -50 Z' },
  { name: 'La Gomera', x: 265, y: 680, d: 'M-30 -18 Q 10 -34 32 -8 Q 26 26 -10 26 Q -36 14 -30 -18 Z' },
  { name: 'Tenerife', x: 400, y: 640, d: 'M-90 30 Q -60 -40 40 -56 Q 100 -60 92 -36 Q 30 0 -20 44 Q -70 60 -90 30 Z' },
  { name: 'Gran Canaria', x: 590, y: 700, d: 'M-56 0 Q -50 -50 0 -56 Q 54 -50 56 0 Q 50 52 0 56 Q -52 50 -56 0 Z' },
  { name: 'Fuerteventura', x: 840, y: 650, d: 'M-90 90 Q -60 40 0 0 Q 50 -60 96 -80 Q 80 -30 40 20 Q -20 80 -90 90 Z' },
  { name: 'Lanzarote', x: 955, y: 540, d: 'M-50 40 Q -20 -10 30 -50 Q 60 -54 54 -30 Q 20 20 -30 54 Q -56 60 -50 40 Z' },
];

export const CanariasScene: React.FC<P> = ({ f, T, seg }) => {
  const map = pop(f, 2, 14);
  const hT = wordAt(seg, 'hierro');
  const hosp = pop(f, wordAt(seg, 'hospital') - 2, 10);
  const recT = wordAt(seg, 'record');
  const rec = pop(f, recT - 2, 9);
  const count = Math.round(lerp(f, [recT, recT + 40], [0, 1488]));
  const countTxt = count >= 1000 ? `${Math.floor(count / 1000)}.${String(count % 1000).padStart(3, '0')}` : String(count);
  const gam = pop(f, wordAt(seg, 'gambia') - 4, 10);
  const pulse = (f - hT) % 30;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="cn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060d22" />
          <stop offset="0.45" stopColor="#123059" />
          <stop offset="0.7" stopColor="#1d5b78" />
          <stop offset="1" stopColor="#04121e" />
        </linearGradient>
        <radialGradient id="cn-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fdf6d8" />
          <stop offset="1" stopColor="#fdf6d8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#cn-sky)" />
      <Particles T={T} n={40} color="#ffffff" seed={11} speed={0.05} size={2.5} op={0.5} />
      <circle cx={870} cy={430} r={160} fill="url(#cn-moon)" opacity={0.35} />
      <circle cx={870} cy={430} r={44} fill="#fdf6d8" />
      {/* olas */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 860 + i * 70;
        const ph = T * 0.06 * (1 + i * 0.1) + i;
        let d = `M-20 ${y}`;
        for (let x = -20; x <= 1100; x += 40) d += ` L${x} ${y + Math.sin(x * 0.012 + ph) * (10 + i * 2)}`;
        return <path key={i} d={d} fill="none" stroke="#7fd6ff" strokeOpacity={0.12 + i * 0.03} strokeWidth={3 + i * 0.6} />;
      })}
      {/* reflejo luna */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={830 - (i % 3) * 20 + Math.sin(T * 0.1 + i) * 14} y={880 + i * 40} width={80 - i * 6} height={6} rx={3} fill="#fdf6d8" opacity={0.35 - i * 0.03} />
      ))}
      {/* mapa */}
      <g opacity={map} transform={`translate(0 ${(1 - map) * 40})`}>
        <text x={540} y={520} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#9fd8ff" letterSpacing={6}>ISLAS CANARIAS</text>
        {ISLANDS.map((is) => {
          const hl = is.name === 'El Hierro' && f >= hT;
          return (
            <g key={is.name} transform={`translate(${is.x} ${is.y})`}>
              <path d={is.d} fill={hl ? '#ffb020' : '#e9dcb8'} stroke={OUT} strokeWidth={5} />
              <text x={0} y={is.name === 'Lanzarote' ? -66 : is.name === 'La Palma' ? -64 : is.name === 'Fuerteventura' ? 120 : 54} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={is.name === 'El Hierro' ? 26 : 20} fill={hl ? '#ffb020' : '#cfe6ff'}>
                {is.name.toUpperCase()}
              </text>
            </g>
          );
        })}
        {f >= hT && (
          <g transform="translate(130 735)">
            <circle r={40 + pulse * 3} fill="none" stroke="#ffb020" strokeWidth={6} opacity={1 - pulse / 30} />
            <circle r={40 + ((pulse + 15) % 30) * 3} fill="none" stroke="#ffb020" strokeWidth={4} opacity={1 - ((pulse + 15) % 30) / 30} />
          </g>
        )}
        {/* hospital de campaña */}
        <g transform={`translate(80 640) scale(${hosp})`}>
          <path d="M-70 40 L0 -40 L70 40 Z" fill="#f5f7fb" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-20 40 L0 0 L20 40 Z" fill="#9aa6bd" />
          <rect x={-14} y={-20} width={28} height={10} fill="#e3122b" />
          <rect x={-5} y={-29} width={10} height={28} fill="#e3122b" />
        </g>
      </g>
      {/* contador */}
      <g transform={`translate(560 895) scale(${0.85 * rec * (1 - gam)})`} opacity={rec * (1 - gam)}>
        <rect x={-330} y={-90} width={660} height={190} rx={28} fill="#0a1830" stroke="#ffb020" strokeWidth={6} opacity={0.92} />
        <text x={0} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={110} fill="#ffffff">{countTxt}</text>
        <text x={0} y={76} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#ffb020" letterSpacing={2}>LLEGADAS EN UN DÍA · RÉCORD</text>
      </g>
      <g opacity={gam}>
        <Pill x={540} y={880} text="SÁNCHEZ PIDE AYUDA A GAMBIA" s={gam} bg="#ffffff" color={OUT} size={36} />
      </g>
    </svg>
  );
};

/* ===================== TIEMPO ===================== */
const SPAIN = 'M6 34 L45 8 L75 13 L111 11 L165 17 L195 19 L231 20 L255 34 L306 42 L336 53 L381 57 L381 76 L351 95 L315 110 L303 125 L279 152 L276 167 L291 196 L270 213 L261 239 L237 251 L222 272 L180 273 L153 274 L125 296 L105 293 L96 277 L78 255 L63 255 L60 224 L75 194 L66 167 L78 141 L81 110 L99 87 L75 72 L39 68 L18 68 Z';
const Cloud: React.FC<{ x: number; y: number; s: number; c?: string }> = ({ x, y, s, c = '#aab4c8' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={20} rx={120} ry={46} fill={c} />
    <circle cx={-50} cy={0} r={52} fill={c} />
    <circle cx={20} cy={-24} r={66} fill={c} />
    <circle cx={80} cy={8} r={44} fill={c} />
  </g>
);

export const TiempoScene: React.FC<P> = ({ f, T, seg }) => {
  const map = pop(f, 3, 12);
  const vT = wordAt(seg, 'viento');
  const flash = Math.max(lerp(f, [vT, vT + 6], [0.8, 0], null), lerp(f, [vT + 12, vT + 16], [0.5, 0], null));
  const hasta = pop(f, wordAt(seg, 'viernes') - 4, 10);
  const bolt = f >= vT && f < vT + 18;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="tm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2230" />
          <stop offset="0.5" stopColor="#3a4a63" />
          <stop offset="1" stopColor="#151b26" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#tm-sky)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Cloud key={i} x={((i * 300 + T * (1.2 + i * 0.3)) % 1500) - 200} y={380 + (i % 2) * 90} s={1.2 + (i % 3) * 0.3} c={i % 2 ? '#56627a' : '#6b7690'} />
      ))}
      {bolt && (
        <path d="M760 420 L700 620 L760 620 L680 860 L820 580 L750 580 L820 420 Z" fill="#fff7a8" stroke="#ffe14d" strokeWidth={6} opacity={0.95} />
      )}
      {/* mapa España */}
      <g transform={`translate(310 540) scale(${1.15 * map})`} opacity={map}>
        <path d={SPAIN} fill="#2f6d4f" stroke="#e8f0ff" strokeWidth={5} strokeLinejoin="round" />
        <Cloud x={110} y={60} s={0.4} c="#dfe6f1" />
        <Cloud x={280} y={90} s={0.36} c="#dfe6f1" />
        <Cloud x={190} y={190} s={0.34} c="#dfe6f1" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${80 + i * 110} ${110 + (i % 2) * 90})`}>
            {[0, 1, 2].map((j) => (
              <path key={j} d={`M${j * 14} ${((T * 3 + j * 9) % 30)} l-6 14`} stroke="#7fd6ff" strokeWidth={5} strokeLinecap="round" />
            ))}
          </g>
        ))}
        <g transform={`translate(${(T * 4) % 120 - 40} 0)`} stroke="#ffffff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85}>
          <path d="M30 170 Q 90 150 150 170 Q 190 185 170 205" />
          <path d="M200 260 Q 260 240 320 260" />
        </g>
      </g>
      {/* lluvia */}
      <g stroke="#a9d6ff" strokeWidth={4} strokeLinecap="round" opacity={0.55}>
        {Array.from({ length: 120 }).map((_, i) => {
          const x = (rnd(i) * 1300 - 100 + T * 6) % 1300 - 100;
          const y = (rnd(i + 50) * 2000 + T * (40 + rnd(i) * 20)) % 2000 - 60;
          return <path key={i} d={`M${x} ${y} l-14 46`} />;
        })}
      </g>
      {/* charcos */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((T + i * 9) % 30) / 30;
        return <ellipse key={i} cx={100 + i * 180} cy={1700 + (i % 2) * 60} rx={20 + p * 60} ry={6 + p * 16} fill="none" stroke="#a9d6ff" strokeWidth={3} opacity={1 - p} />;
      })}
      <Pill x={540} y={920} text="LLUVIA Y VIENTO HASTA EL VIERNES" s={hasta} bg="#ffe14d" color={OUT} size={36} rot={-2} />
      <rect width={1080} height={1920} fill="#ffffff" opacity={flash} />
    </svg>
  );
};

/* ===================== BEBÉS ===================== */
const Stork: React.FC<{ x: number; y: number; T: number }> = ({ x, y, T }) => {
  const flap = Math.sin(T * 0.45) * 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${-flap} 0 -10)`}>
        <path d="M-10 -10 Q -60 -120 -170 -110 Q -100 -60 -40 0 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
        <path d="M-170 -110 Q -140 -90 -120 -70 L -150 -98 Z" fill={OUT} />
      </g>
      <ellipse cx={0} cy={0} rx={90} ry={40} fill="#ffffff" stroke={OUT} strokeWidth={6} />
      <path d="M-80 0 Q -110 30 -150 30" stroke={OUT} strokeWidth={5} fill="none" />
      <path d="M70 -20 Q 110 -60 140 -60" stroke={OUT} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d="M70 -20 Q 110 -60 140 -60" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" fill="none" />
      <circle cx={150} cy={-62} r={24} fill="#ffffff" stroke={OUT} strokeWidth={6} />
      <circle cx={156} cy={-68} r={5} fill={OUT} />
      <path d="M170 -64 L250 -48 L172 -52 Z" fill="#ff8a1e" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <path d="M240 -50 Q 250 0 230 40" stroke={OUT} strokeWidth={4} fill="none" />
      {/* hatillo */}
      <g transform={`translate(225 ${70 + Math.sin(T * 0.3) * 6}) rotate(${Math.sin(T * 0.3) * 8})`}>
        <path d="M-40 -30 Q 0 -60 40 -30 Q 50 30 0 46 Q -50 30 -40 -30 Z" fill="#ffd6e8" stroke={OUT} strokeWidth={5} />
        <circle cx={0} cy={-8} r={18} fill="#ffd2a8" stroke={OUT} strokeWidth={4} />
        <path d="M-6 -6 q6 6 12 0" stroke={OUT} strokeWidth={3} fill="none" />
        <path d="M-40 -30 Q 0 -10 40 -30" stroke={OUT} strokeWidth={4} fill="none" />
      </g>
      <g transform={`rotate(${flap} 0 -10)`}>
        <path d="M10 -10 Q 50 -130 160 -130 Q 100 -70 40 0 Z" fill="#f2f5fb" stroke={OUT} strokeWidth={6} />
        <path d="M160 -130 Q 130 -105 112 -86 L 140 -118 Z" fill={OUT} />
      </g>
      <path d="M-60 30 L -110 80 M -40 34 L -86 90" stroke="#ff8a1e" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

export const BebesScene: React.FC<P> = ({ f, T, seg }) => {
  const sx = lerp(f, [0, 150], [1300, -500], null);
  const chartT = wordAt(seg, 'suben');
  const ch = pop(f, chartT - 6, 12);
  const grow = lerp(f, [chartT, chartT + 18], [0, 1]);
  const decT = wordAt(seg, 'decada');
  const dec = pop(f, decT - 2, 9);
  const fiesta = wordAt(seg, 'fiesta');
  const pan = pop(f, wordAt(seg, 'panales') - 2, 10);
  const bars = [0.82, 0.74, 0.7, 0.66];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="bb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb7d5" />
          <stop offset="0.5" stopColor="#bfd8ff" />
          <stop offset="1" stopColor="#8fb2f0" />
        </linearGradient>
        <linearGradient id="bb-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d8fb3" />
          <stop offset="1" stopColor="#4f5f80" />
        </linearGradient>
        <linearGradient id="bb-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4dff9a" />
          <stop offset="1" stopColor="#0ea85a" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#bb-sky)" />
      {Array.from({ length: 10 }).map((_, i) => {
        const x = (rnd(i + 4) * 1300 + T * (0.6 + rnd(i))) % 1300 - 120;
        return <Cloud key={i} x={x} y={420 + rnd(i * 9) * 1300} s={0.5 + rnd(i * 2) * 0.6} c="#ffffff" />;
      })}
      <Stork x={sx} y={560} T={T} />
      {/* gráfica */}
      <g transform={`translate(575 665) scale(${0.9 * ch})`} opacity={ch}>
        <rect x={-20} y={-40} width={480} height={360} rx={26} fill="#ffffff" opacity={0.9} stroke={OUT} strokeWidth={6} />
        <text x={220} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={OUT}>NACIMIENTOS EN ESPAÑA</text>
        {bars.map((b, i) => (
          <g key={i}>
            <rect x={20 + i * 85} y={280 - b * 220} width={60} height={b * 220} rx={8} fill="url(#bb-bar)" stroke={OUT} strokeWidth={4} />
            <text x={50 + i * 85} y={305} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={20} fill={OUT}>{2021 + i}</text>
          </g>
        ))}
        <rect x={20 + 4 * 85} y={280 - (0.66 + 0.1 * grow) * 220} width={60} height={(0.66 + 0.1 * grow) * 220} rx={8} fill="url(#bb-up)" stroke={OUT} strokeWidth={5} />
        <text x={50 + 4 * 85} y={305} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={20} fill="#0ea85a">2025</text>
        <g transform={`translate(${390} ${100 - grow * 30}) scale(${grow})`}>
          <path d="M-30 30 L0 -20 L30 30 Z" fill="#0ea85a" stroke={OUT} strokeWidth={4} />
        </g>
      </g>
      <g transform={`translate(290 760) scale(${pop(f, chartT + 6, 7)}) rotate(-6)`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={140} fill="#0ea85a" stroke={OUT} strokeWidth={9} paintOrder="stroke">+1,2%</text>
      </g>
      <Pill x={540} y={530} text="PRIMERA SUBIDA EN 10 AÑOS" s={dec} bg="#0ea85a" size={40} />
      {/* chupetes y pañales */}
      <g opacity={pan}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${130 + i * 80} ${880 + Math.sin(T * 0.2 + i) * 14}) rotate(${Math.sin(T * 0.1 + i) * 20}) scale(${pan})`}>
            <path d="M-34 -16 L34 -16 L26 20 Q 0 32 -26 20 Z" fill="#ffffff" stroke={OUT} strokeWidth={4} />
            <rect x={-30} y={-22} width={60} height={10} rx={4} fill="#7fd6ff" stroke={OUT} strokeWidth={3} />
          </g>
        ))}
      </g>
      {/* confeti */}
      {f >= fiesta - 2 &&
        Array.from({ length: 70 }).map((_, i) => {
          const g = f - fiesta + 2;
          const x = 540 + (rnd(i) - 0.5) * 60 + (rnd(i + 1) - 0.5) * g * 26;
          const y = 900 - g * (18 * rnd(i + 2) + 6) + g * g * 0.45;
          const cols = ['#ff2d55', '#ffe14d', '#4dff9a', '#5ff0ff', '#7a5cff'];
          return <rect key={i} x={x} y={y} width={16} height={9} rx={2} fill={cols[i % 5]} transform={`rotate(${g * 14 + i * 30} ${x} ${y})`} />;
        })}
    </svg>
  );
};

/* ===================== IRÁN ===================== */
export const IranScene: React.FC<P> = ({ f, T, seg }) => {
  const map = pop(f, 2, 14);
  const kT = wordAt(seg, 'kuwait');
  const bT = wordAt(seg, 'barein');
  const rT = wordAt(seg, 'respuesta');
  const res = pop(f, rT - 2, 10);
  const launch = { x: 820, y: 640 };
  const kw = { x: 380, y: 560 };
  const bh = { x: 560, y: 790 };
  const arc = (a: { x: number; y: number }, b: { x: number; y: number }, p: number, k: string) => {
    const cx = (a.x + b.x) / 2;
    const cy = Math.min(a.y, b.y) - 170;
    const pt = (t: number) => ({
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y,
    });
    const n = 30;
    let d = '';
    for (let i = 0; i <= n * p; i++) {
      const q = pt(i / n);
      d += `${i === 0 ? 'M' : 'L'}${q.x} ${q.y} `;
    }
    const h = pt(p);
    return (
      <g key={k}>
        <path d={d} fill="none" stroke="#ff3b4e" strokeWidth={6} strokeDasharray="14 10" />
        {p < 1 && p > 0 && <circle cx={h.x} cy={h.y} r={12} fill="#ffe14d" />}
      </g>
    );
  };
  const boom = (pt: { x: number; y: number }, t0: number, k: string) => {
    const g = f - t0;
    if (g < 0) return null;
    return (
      <g key={k} transform={`translate(${pt.x} ${pt.y})`}>
        <circle r={20 + Math.min(g, 20) * 4} fill="#ff6a00" opacity={Math.max(0, 0.7 - g / 30)} />
        <circle r={14} fill="#ff3b4e" />
        <circle r={14 + (g % 20) * 3} fill="none" stroke="#ff3b4e" strokeWidth={4} opacity={1 - (g % 20) / 20} />
      </g>
    );
  };
  const pk = lerp(f, [kT - 10, kT + 8], [0, 1], null);
  const pb = lerp(f, [bT - 10, bT + 8], [0, 1], null);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="ir-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0" stopColor="#3a0d14" />
          <stop offset="0.6" stopColor="#150409" />
          <stop offset="1" stopColor="#050104" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ir-bg)" />
      {/* radar */}
      <g transform="translate(540 660)" opacity={0.35}>
        {[120, 240, 360, 480].map((r) => <circle key={r} r={r} fill="none" stroke="#ff3b4e" strokeWidth={2} />)}
        <path d="M-520 0 H520 M0 -520 V520" stroke="#ff3b4e" strokeWidth={1.5} />
        <g transform={`rotate(${T * 3})`}>
          <path d="M0 0 L480 0 A480 480 0 0 0 415 -240 Z" fill="#ff3b4e" opacity={0.35} />
        </g>
      </g>
      <g opacity={map} transform="translate(0 70)">
        {/* Irán */}
        <path d="M480 470 L620 440 L760 470 L920 450 L1100 470 L1100 860 L900 880 L800 820 L720 760 L640 700 L560 620 L470 560 Z" fill="#4a2a2a" stroke="#ff8a8a" strokeWidth={4} />
        {/* Golfo */}
        <path d="M400 560 L470 560 L560 620 L640 700 L720 760 L800 820 L900 880 L760 930 L640 900 L560 860 L500 800 L430 700 Z" fill="#0d2238" stroke="#3b6b9a" strokeWidth={3} />
        {/* Península arábiga */}
        <path d="M-20 520 L300 520 L400 560 L430 700 L500 800 L560 860 L640 900 L760 930 L800 1000 L-20 1000 Z" fill="#3a2a22" stroke="#ff8a8a" strokeWidth={4} />
        <ellipse cx={bh.x} cy={bh.y} rx={12} ry={18} fill="#3a2a22" stroke="#ff8a8a" strokeWidth={3} />
        <text x={900} y={560} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffb3b3" letterSpacing={4}>IRÁN</text>
        <text x={kw.x - 10} y={kw.y - 30} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff" opacity={f >= kT - 6 ? 1 : 0.4}>KUWAIT</text>
        <text x={bh.x - 110} y={bh.y + 14} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff" opacity={f >= bT - 6 ? 1 : 0.4}>BARÉIN</text>
        <circle cx={launch.x} cy={launch.y} r={10} fill="#ffe14d" />
        {pk > 0 && arc(launch, kw, pk, 'a1')}
        {pb > 0 && arc(launch, bh, pb, 'a2')}
        {boom(kw, kT + 8, 'b1')}
        {boom(bh, bT + 8, 'b2')}
        <g transform={`translate(${kw.x} ${kw.y + 50})`} opacity={f >= kT + 8 ? 1 : 0}>
          <rect x={-90} y={-18} width={180} height={36} rx={18} fill="#1a2440" stroke="#5ff0ff" strokeWidth={3} />
          <text x={0} y={9} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={20} fill="#5ff0ff">BASE DE EE. UU.</text>
        </g>
      </g>
      <Pill x={540} y={930} text="RESPUESTA A ATAQUES DE EE. UU." s={res} bg="#ffffff" color={OUT} size={36} />
      <rect width={1080} height={1920} fill="#ff0022" opacity={0.06 + 0.04 * Math.sin(T * 0.2)} />
    </svg>
  );
};

/* ===================== CHINA ===================== */
const Jet: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M-60 -6 L-160 -120 L-120 -120 L20 -10 Z" fill="#c9d2e0" stroke={OUT} strokeWidth={5} />
    <path d="M-250 -10 Q -250 -40 -200 -42 L 240 -42 Q 300 -40 320 -10 Q 300 20 240 22 L -200 22 Q -250 20 -250 -10 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
    <path d="M-250 -10 L -300 -100 L -250 -100 L -190 -40 Z" fill="#2f5bd8" stroke={OUT} strokeWidth={5} />
    <path d="M-200 0 L 240 0" stroke="#2f5bd8" strokeWidth={10} />
    {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-150 + i * 30} cy={-22} r={6} fill="#2a3a5a" />)}
    <path d="M270 -32 Q 296 -30 306 -14 L 276 -14 Z" fill="#2a3a5a" />
    <path d="M-60 10 L-170 120 L-130 120 L20 16 Z" fill="#dfe6f1" stroke={OUT} strokeWidth={5} />
    <ellipse cx={-70} cy={52} rx={40} ry={16} fill="#9aa6bd" stroke={OUT} strokeWidth={4} />
  </g>
);

export const ChinaScene: React.FC<P> = ({ f, T, seg }) => {
  const aT = wordAt(seg, 'avion');
  const px = lerp(f, [0, aT + 6], [1400, 560]);
  const py = lerp(f, [0, aT + 6], [480, 700]);
  const pr = lerp(f, [0, aT + 6], [-10, 0]);
  const hT = wordAt(seg, 'abrazo');
  const tres = pop(f, wordAt(seg, 'tres') - 3, 8);
  const put = pop(f, wordAt(seg, 'putin') - 2, 8);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ch-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a5a" />
          <stop offset="0.45" stopColor="#ffcf8a" />
          <stop offset="0.6" stopColor="#9fc4ff" />
          <stop offset="1" stopColor="#4a6aa8" />
        </linearGradient>
        <radialGradient id="ch-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3c0" />
          <stop offset="1" stopColor="#fff3c0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ch-sky)" />
      <circle cx={220} cy={520} r={260} fill="url(#ch-sun)" opacity={0.8} />
      {/* skyline */}
      <g fill="#6a5a8a" opacity={0.7}>
        {Array.from({ length: 16 }).map((_, i) => {
          const h = 120 + rnd(i) * 260;
          return <rect key={i} x={i * 70} y={860 - h} width={58} height={h} />;
        })}
      </g>
      {/* pista */}
      <rect x={0} y={860} width={1080} height={1100} fill="#3b4256" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={((i * 180 - T * 6) % 1440) - 180} y={940} width={100} height={14} rx={4} fill="#ffffff" opacity={0.8} />
      ))}
      <path d="M380 860 L700 860 L1000 1920 L80 1920 Z" fill="#c8102e" opacity={lerp(f, [aT, aT + 20], [0, 0.85])} />
      <Jet x={px} y={py + Math.sin(T * 0.2) * (f < aT ? 6 : 0)} r={pr} />
      <text x={540} y={540} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#3a1d5a" letterSpacing={6}>SHENZHEN · CUMBRE APEC</text>
      {/* corazones abrazo */}
      {f >= hT &&
        Array.from({ length: 10 }).map((_, i) => {
          const g = f - hT;
          const x = 540 + (rnd(i) - 0.5) * 500;
          const y = 900 - g * (6 + rnd(i + 3) * 6);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + rnd(i) * 0.8})`} opacity={Math.max(0, 1 - g / 60)}>
              <path d="M0 22 C -38 -4 -27 -36 -9 -29 C -3 -26 0 -19 0 -15 C 0 -19 3 -26 9 -29 C 27 -36 38 -4 0 22 Z" fill="#ff3b6e" stroke={OUT} strokeWidth={3} />
            </g>
          );
        })}
      <g opacity={tres}>
        <g transform={`translate(540 820) scale(${tres})`}>
          <rect x={-330} y={-90} width={660} height={180} rx={26} fill="#ffffff" stroke={OUT} strokeWidth={6} opacity={0.95} />
          <g transform={`translate(-300 -60)`}>
            <ChinaFlag x={0} y={0} w={150} h={100} />
          </g>
          <g transform={`translate(-75 -60)`}>
            <USFlag x={0} y={0} w={150} h={100} />
          </g>
          <g transform={`translate(150 -60) scale(${put})`}>
            <RussiaFlag x={0} y={0} w={150} h={100} />
          </g>
          <text x={-95} y={-6} fontFamily={HEAD} fontSize={60} fill={OUT}>+</text>
          <text x={130} y={-6} fontFamily={HEAD} fontSize={60} fill={OUT} opacity={put}>+</text>
          <text x={0} y={78} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={OUT}>REUNIÓN A TRES · JUEVES</text>
        </g>
      </g>
    </svg>
  );
};

/* ===================== VOYAGER ===================== */
const Probe: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M30 0 L190 60 M-20 20 L-170 80 M0 -20 L-40 -170" stroke="#c9d2e0" strokeWidth={6} />
    <rect x={180} y={50} width={40} height={40} rx={6} fill="#8a6a3a" stroke={OUT} strokeWidth={4} />
    <circle cx={-170} cy={80} r={10} fill="#c9d2e0" />
    <rect x={-40} y={-30} width={90} height={70} rx={8} fill="#c9a24a" stroke={OUT} strokeWidth={5} />
    <path d="M-40 -10 L50 -10 M-40 10 L50 10" stroke="#8a6a1a" strokeWidth={3} />
    <ellipse cx={5} cy={-70} rx={120} ry={36} fill="#f5f7fb" stroke={OUT} strokeWidth={6} />
    <ellipse cx={5} cy={-74} rx={90} ry={24} fill="#dfe6f1" />
    <path d="M5 -70 L5 -130" stroke={OUT} strokeWidth={5} />
    <circle cx={5} cy={-134} r={7} fill="#ffe14d" />
  </g>
);

export const VoyagerScene: React.FC<P> = ({ f, T, seg }) => {
  const luzT = wordAt(seg, 'luz');
  const lab = pop(f, luzT - 4, 10);
  const hT = wordAt(seg, 'veinticuatro');
  const hrs = pop(f, hT - 2, 8);
  const exT = wordAt(seg, 'ex');
  const chat = pop(f, exT - 4, 9);
  const sT = wordAt(seg, 'sigueme');
  const sig = pop(f, sT - 2, 7);
  const beam = ((f - luzT) % 50) / 50;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="vy-bg" cx="60%" cy="35%" r="90%">
          <stop offset="0" stopColor="#1a1450" />
          <stop offset="0.5" stopColor="#070624" />
          <stop offset="1" stopColor="#010108" />
        </radialGradient>
        <radialGradient id="vy-neb" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff4d9d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ff4d9d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vy-neb2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#5ff0ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5ff0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vy-earth" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#7fd6ff" />
          <stop offset="0.6" stopColor="#1f6fd8" />
          <stop offset="1" stopColor="#0a2a6a" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#vy-bg)" />
      <ellipse cx={800} cy={700} rx={500} ry={300} fill="url(#vy-neb)" />
      <ellipse cx={200} cy={1300} rx={500} ry={340} fill="url(#vy-neb2)" />
      {Array.from({ length: 160 }).map((_, i) => {
        const z = 0.2 + rnd(i + 2) * 1.2;
        const x = ((rnd(i) * 1080 - T * z * 0.8) % 1080 + 1080) % 1080;
        const y = rnd(i + 9) * 1920;
        return <circle key={i} cx={x} cy={y} r={z * 1.8} fill="#ffffff" opacity={0.3 + 0.7 * Math.abs(Math.sin(T * 0.06 + i))} />;
      })}
      {/* Tierra */}
      <g transform="translate(150 740)">
        <circle r={78} fill="url(#vy-earth)" stroke="#bfe8ff" strokeWidth={3} />
        <path d="M-40 -30 q20 -20 40 -6 q10 20 -14 30 q-30 4 -26 -24Z M10 20 q30 -10 40 10 q-10 24 -36 14Z" fill="#3fbf6a" opacity={0.9} />
        <path d="M-60 0 q40 -14 120 6" stroke="#ffffff" strokeWidth={6} opacity={0.6} fill="none" />
        <text x={0} y={120} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill="#bfe8ff">TIERRA</text>
      </g>
      {/* rayo de luz */}
      <path d="M240 740 L780 700" stroke="#5ff0ff" strokeWidth={3} strokeDasharray="8 14" opacity={0.6} />
      {f >= luzT - 10 && (
        <circle cx={240 + 540 * beam} cy={740 - 40 * beam} r={12} fill="#ffffff" stroke="#5ff0ff" strokeWidth={6} />
      )}
      <Probe x={850 + Math.sin(T * 0.03) * 10 + sig * 400} y={710 + Math.cos(T * 0.04) * 8} r={-14 + Math.sin(T * 0.02) * 4} />
      <g transform={`translate(540 580) scale(${lab})`} opacity={lab * (1 - sig)}>
        <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={86} fill="#ffe14d" stroke={OUT} strokeWidth={6} paintOrder="stroke">1 DÍA LUZ</text>
        <text x={0} y={52} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill="#ffffff">25.900 MILLONES DE KM</text>
      </g>
      <g transform={`translate(300 870) scale(${0.75 * hrs * (1 - sig)})`}>
        <circle r={70} fill="#ffffff" stroke={OUT} strokeWidth={6} />
        <path d={`M0 0 L0 -48 M0 0 L${Math.sin(T * 0.3) * 36} ${-Math.cos(T * 0.3) * 36}`} stroke={OUT} strokeWidth={8} strokeLinecap="round" />
        <text x={0} y={120} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill="#ffffff" stroke={OUT} strokeWidth={4} paintOrder="stroke">24 H</text>
      </g>
      {/* chat */}
      <g transform={`translate(760 880) scale(${0.9 * chat * (1 - sig)})`}>
        <path d="M-200 -60 Q -200 -90 -170 -90 L 170 -90 Q 200 -90 200 -60 L 200 40 Q 200 70 170 70 L -120 70 L -170 110 L -160 70 Q -200 70 -200 40 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
        <text x={0} y={-30} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill={OUT}>TU EX</text>
        <text x={0} y={22} textAnchor="middle" fontFamily={BODY} fontWeight={700} fontSize={26} fill="#5e6a82">escribiendo</text>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={110 + i * 20} cy={14} r={6} fill="#5e6a82" opacity={Math.floor(T / 6) % 3 === i ? 1 : 0.3} />
        ))}
      </g>
      {/* síguenos */}
      <g transform={`translate(540 720) scale(${sig}) rotate(${-4 + Math.sin(T * 0.3) * 2})`} opacity={sig}>
        <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={120} fill="#ffffff" stroke={OUT} strokeWidth={10} paintOrder="stroke">¡SÍGUEME!</text>
        <g transform={`translate(0 110) scale(${1 + 0.06 * Math.sin(T * 0.5)})`}>
          <rect x={-190} y={-52} width={380} height={104} rx={52} fill="#ff2d55" stroke={OUT} strokeWidth={7} />
          <text x={0} y={24} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffffff">+ SEGUIR</text>
        </g>
      </g>
      {f >= sT &&
        Array.from({ length: 16 }).map((_, i) => {
          const g = f - sT;
          const x = 100 + rnd(i) * 880;
          const y = 1100 - g * (5 + rnd(i + 3) * 8);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.7 + rnd(i) * 0.9}) rotate(${Math.sin(g * 0.1 + i) * 20})`} opacity={Math.max(0, 1 - g / 70)}>
              <path d="M0 22 C -38 -4 -27 -36 -9 -29 C -3 -26 0 -19 0 -15 C 0 -19 3 -26 9 -29 C 27 -36 38 -4 0 22 Z" fill="#ff3b6e" stroke={OUT} strokeWidth={3} />
            </g>
          );
        })}
    </svg>
  );
};

/* ======================================================================
   BIBLIOTECA 2026-11-19: Shenzhen (Xi-Putin), préstamo UE, decretos, huelga
   ====================================================================== */
export const UkraineFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h / 2} fill="#0057b7" />
    <rect x={x} y={y + h / 2} width={w} height={h / 2} fill="#ffd700" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);
export const EUFlag: React.FC<{ x: number; y: number; w: number; h: number; spin?: number }> = ({ x, y, w, h, spin = 0 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#003399" stroke={OUT} strokeWidth={5} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 + spin;
      const r = h * 0.33;
      return <polygon key={i} points={star(x + w / 2 + Math.cos(a) * r, y + h / 2 + Math.sin(a) * r, h * 0.065)} fill="#ffcc00" />;
    })}
  </g>
);
export const SpainFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#c60b1e" />
    <rect x={x} y={y + h / 4} width={w} height={h / 2} fill="#ffc400" />
    <rect x={x + w * 0.22} y={y + h * 0.36} width={w * 0.12} height={h * 0.28} rx={3} fill="#c60b1e" opacity={0.85} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);
function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
  }
  return pts.join(' ');
}

const Card: React.FC<{ x: number; y: number; w: number; h: number; s: number; children?: React.ReactNode; bg?: string; rot?: number }> = ({ x, y, w, h, s, children, bg = '#ffffff', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
    <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx={26} fill={OUT} opacity={0.45} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={bg} stroke={OUT} strokeWidth={6} />
    {children}
  </g>
);

const Stamp: React.FC<{ x: number; y: number; text: string; s: number; color: string; rot?: number; size?: number }> = ({ x, y, text, s, color, rot = -8, size = 64 }) => {
  const w = text.length * size * 0.55 + 60;
  const sc = s > 0 ? 1 + (1 - s) * 1.6 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={Math.min(1, s * 2)}>
      <rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.5} rx={14} fill="rgba(255,255,255,0.88)" stroke={color} strokeWidth={10} />
      <rect x={-w / 2 + 12} y={-size * 0.8 + 12} width={w - 24} height={size * 1.5 - 24} rx={8} fill="none" stroke={color} strokeWidth={3} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={HEAD} fontSize={size} fill={color} letterSpacing={3}>{text}</text>
    </g>
  );
};

const fmtCount = (v: number) => Math.round(v).toLocaleString('es-ES').replace(/,/g, '.');

/* ===================== SHENZHEN: XI Y PUTIN ===================== */
export const ShenzhenScene: React.FC<P> = ({ f, T, seg }) => {
  const xiT = wordAt(seg, 'shi');
  const puT = wordAt(seg, 'putin');
  const reT = wordAt(seg, 'reunen');
  const esT = wordAt(seg, 'estable');
  const juT = wordAt(seg, 'jueves');
  const kiT = wordAt(seg, 'kiev');
  const sXi = pop(f, xiT - 2, 9), sPu = pop(f, puT - 2, 9);
  const shake = pop(f, reT, 7);
  const est = pop(f, esT - 2, 9);
  const ju = pop(f, juT - 2, 9);
  const us = lerp(f, [juT + 4, juT + 22], [1300, 0]);
  const ki = pop(f, kiT - 3, 9);
  const phase2 = lerp(f, [juT - 4, juT + 6], [1, 0], null);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="sz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#08051f" />
          <stop offset="0.45" stopColor="#2a0f4f" />
          <stop offset="0.62" stopColor="#7a1e5a" />
          <stop offset="0.66" stopColor="#0a1030" />
          <stop offset="1" stopColor="#030512" />
        </linearGradient>
        <linearGradient id="sz-tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a2150" />
          <stop offset="0.5" stopColor="#2d3a80" />
          <stop offset="1" stopColor="#11163a" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sz-sky)" />
      <Particles T={T} n={40} color="#ffffff" seed={11} speed={0.05} size={2.5} op={0.7} />
      {/* rascacielos con neones */}
      {Array.from({ length: 14 }).map((_, i) => {
        const w = 60 + rnd(i + 2) * 50;
        const h = 300 + rnd(i) * 520;
        const x = i * 80 - 20;
        const neon = ['#ff2d95', '#2fd8ff', '#ffe14d', '#7a5cff'][i % 4];
        return (
          <g key={i}>
            <rect x={x} y={1270 - h} width={w} height={h} fill="url(#sz-tower)" stroke="#05080f" strokeWidth={3} />
            <rect x={x} y={1270 - h} width={w} height={8} fill={neon} opacity={0.6 + 0.4 * Math.sin(T * 0.1 + i)} />
            {Array.from({ length: Math.floor(h / 40) }).map((_, j) => (
              <rect key={j} x={x + 10} y={1290 - h + j * 40} width={w - 20} height={6} fill="#ffe9a8" opacity={rnd(i * 31 + j) > 0.55 ? 0.65 : 0.12} />
            ))}
          </g>
        );
      })}
      {/* Ping An tower */}
      <path d="M520 1270 L530 420 L540 330 L550 420 L560 1270 Z" fill="#3a4a9a" stroke={OUT} strokeWidth={4} />
      <circle cx={540} cy={330} r={8} fill="#ff3b4e" opacity={Math.floor(T / 15) % 2 ? 1 : 0.3} />
      {/* agua */}
      <rect x={0} y={1270} width={1080} height={650} fill="#050a22" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={((i * 130 + T * 2) % 1200) - 100} y={1290 + i * 14} width={80} height={4} fill="#ff2d95" opacity={0.25} />
      ))}
      <text x={540} y={500} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#ffd9f0" letterSpacing={6} opacity={0.9}>SHENZHEN · CUMBRE APEC</text>
      {/* fase 1: Xi y Putin */}
      <g opacity={phase2}>
        <g transform={`translate(250 700) scale(${sXi})`}>
          <Card x={0} y={0} w={330} h={260} s={1}>
            <ChinaFlag x={-115} y={-105} w={230} h={150} />
            <text x={0} y={100} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill={OUT}>XI JINPING</text>
          </Card>
        </g>
        <g transform={`translate(830 700) scale(${sPu})`}>
          <Card x={0} y={0} w={330} h={260} s={1}>
            <RussiaFlag x={-115} y={-105} w={230} h={150} />
            <text x={0} y={100} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill={OUT}>PUTIN</text>
          </Card>
        </g>
        {/* apretón de manos */}
        <g transform={`translate(540 ${700 + Math.sin(f * 0.6) * 6 * shake}) scale(${shake})`}>
          <circle r={82} fill="#ffe14d" stroke={OUT} strokeWidth={7} />
          <path d="M-58 8 L-20 -22 L10 -8 L48 -30 L62 0 L22 34 Q 6 44 -8 32 L-40 30 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-8 6 L12 26 M4 -2 L24 18 M16 -10 L34 8" stroke={OUT} strokeWidth={5} strokeLinecap="round" />
        </g>
        <Pill x={540} y={900} text="«ESTABLE Y FIABLE»" s={est} bg="#ff2d55" size={52} rot={-2} />
      </g>
      {/* fase 2: reunión a tres */}
      <Card x={540} y={700} w={900} h={360} s={ju} bg="#ffffff">
        <g transform="translate(-390 -140)"><ChinaFlag x={0} y={0} w={220} h={145} /></g>
        <g transform={`translate(${-110 + us} -140)`}><USFlag x={0} y={0} w={220} h={145} /></g>
        <g transform="translate(170 -140)"><RussiaFlag x={0} y={0} w={220} h={145} /></g>
        <text x={-140} y={-50} textAnchor="middle" fontFamily={HEAD} fontSize={60} fill={OUT}>+</text>
        <text x={140} y={-50} textAnchor="middle" fontFamily={HEAD} fontSize={60} fill={OUT}>+</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill={OUT}>JUEVES: REUNIÓN A TRES</text>
        <g opacity={ki}>
          <rect x={-420} y={110} width={840} height={60} rx={14} fill="#0057b7" />
          <text x={0} y={155} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffd700">PREOCUPACIÓN EN KIEV Y EN EUROPA</text>
        </g>
      </Card>
    </svg>
  );
};

/* ===================== PRÉSTAMO UE A UCRANIA ===================== */
export const PrestamoScene: React.FC<P> = ({ f, T, seg }) => {
  const cT = wordAt(seg, 'cuarenta');
  const vT = wordAt(seg, 'veinticinco');
  const v2T = wordAt(seg, 'veinte');
  const unT = wordAt(seg, 'unanimidad');
  const huT = wordAt(seg, 'hungria');
  const cnt = lerp(f, [cT - 2, cT + 30], [0, 45000]);
  const big = pop(f, cT - 4, 9);
  const bar1 = lerp(f, [vT, vT + 18], [0, 1]);
  const bar2 = lerp(f, [v2T, v2T + 18], [0, 1]);
  const un = pop(f, unT - 3, 9);
  const phase2 = lerp(f, [unT - 6, unT + 2], [1, 0], null);
  const countries = ['HUNGRÍA', 'ESLOVAQUIA', 'CHEQUIA', 'BULGARIA'];
  const keys = ['hungria', 'eslovaquia', 'chequia', 'bulgaria'];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="pr-bg" cx="50%" cy="35%" r="85%">
          <stop offset="0" stopColor="#1f4fc4" />
          <stop offset="0.55" stopColor="#0b1f63" />
          <stop offset="1" stopColor="#030716" />
        </radialGradient>
        <linearGradient id="pr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb4ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1b2f7a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#pr-bg)" />
      {/* círculo de estrellas gigante */}
      <g opacity={0.35}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + T * 0.004;
          return <polygon key={i} points={star(540 + Math.cos(a) * 470, 760 + Math.sin(a) * 470, 34)} fill="#ffcc00" />;
        })}
      </g>
      {/* edificio Berlaymont estilizado */}
      <g opacity={0.55}>
        <path d="M140 1300 L300 1120 L780 1120 L940 1300 Z" fill="url(#pr-glass)" stroke="#9fc0ff" strokeWidth={3} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${300 + i * 40} 1120 L${300 + i * 40 - (i - 6) * 10} 1300`} stroke="#9fc0ff" strokeWidth={2} opacity={0.6} />
        ))}
      </g>
      <Particles T={T} n={30} color="#ffcc00" seed={21} speed={0.25} size={3} op={0.5} />
      {/* banderas */}
      <g transform={`translate(0 ${lerp(f, [0, 14], [-300, 0])})`}>
        <EUFlag x={110} y={480} w={190} h={126} spin={T * 0.01} />
        <UkraineFlag x={780} y={480} w={190} h={126} />
        <path d="M310 543 L770 543" stroke="#ffcc00" strokeWidth={8} strokeDasharray="22 16" strokeDashoffset={-T * 3} />
        <polygon points="770,523 800,543 770,563" fill="#ffcc00" />
      </g>
      <g opacity={phase2}>
        <g transform={`translate(540 750) scale(${big})`} opacity={Math.min(1, big * 1.5)}>
          <text x={6} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill={OUT} opacity={0.5}>{fmtCount(cnt)} M€</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill="#ffe14d" stroke={OUT} strokeWidth={10} paintOrder="stroke">{fmtCount(cnt)} M€</text>
          <text x={0} y={52} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={36} fill="#ffffff">PRÉSTAMO PARA 2027</text>
        </g>
        {/* barra de reparto */}
        <g transform="translate(90 845)">
          <rect x={0} y={0} width={900} height={100} rx={22} fill="rgba(255,255,255,0.15)" stroke={OUT} strokeWidth={6} />
          <rect x={0} y={0} width={500 * bar1} height={100} rx={22} fill="#ff5a3c" stroke={OUT} strokeWidth={6} />
          <rect x={500} y={0} width={400 * bar2} height={100} rx={22} fill="#2fd8ff" stroke={OUT} strokeWidth={6} />
          <g opacity={bar1}>
            <text x={250} y={62} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#fff" stroke={OUT} strokeWidth={4} paintOrder="stroke">25.000 · ARMAS</text>
          </g>
          <g opacity={bar2}>
            <text x={700} y={62} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={OUT}>20.000 · PAÍS</text>
          </g>
        </g>
      </g>
      {/* fase 2: unanimidad y vetos */}
      <g opacity={1 - phase2}>
        <Pill x={540} y={680} text="HACE FALTA UNANIMIDAD: 27 DE 27" s={un} bg="#ffe14d" color={OUT} size={46} />
        {countries.map((c, i) => {
          const s = pop(f, wordAt(seg, keys[i]) - 2, 8);
          const x = 290 + (i % 2) * 500;
          const y = 800 + Math.floor(i / 2) * 110;
          return (
            <g key={c} transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
              <rect x={-220} y={-44} width={440} height={88} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
              <text x={-30} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill={OUT}>{c}</text>
              <circle cx={170} cy={0} r={32} fill="#e3122b" stroke={OUT} strokeWidth={5} />
              <path d="M155 -15 L185 15 M185 -15 L155 15" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ===================== DECRETOS EN EL CONGRESO ===================== */
export const DecretosScene: React.FC<P> = ({ f, T, seg }) => {
  const sT = wordAt(seg, 'siete');
  const cvT = wordAt(seg, 'convalida');
  const sev = pop(f, sT - 3, 9);
  const stamp = pop(f, cvT, 10);
  const items: [string, string, string][] = [
    ['ceuta', 'AYUDAS A CEUTA', '#2fd8ff'],
    ['dana', 'AFECTADOS DANA ADAM', '#7fb2ff'],
    ['urda', 'VÍCTIMAS DE URDA', '#ffb15a'],
    ['seguridad', 'SEGURIDAD FERROVIARIA', '#9cf08a'],
  ];
  const listOn = lerp(f, [wordAt(seg, 'ceuta') - 8, wordAt(seg, 'ceuta')], [0, 1], null);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="dc-bg" cx="50%" cy="40%" r="85%">
          <stop offset="0" stopColor="#5a1a22" />
          <stop offset="0.6" stopColor="#24090f" />
          <stop offset="1" stopColor="#070205" />
        </radialGradient>
        <linearGradient id="dc-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#4a2a10" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#dc-bg)" />
      {/* hemiciclo */}
      {Array.from({ length: 6 }).map((_, r) => {
        const R = 300 + r * 85;
        const n = 12 + r * 4;
        return (
          <g key={r}>
            <path d={`M${540 - R} 1260 A ${R} ${R * 0.62} 0 0 1 ${540 + R} 1260`} fill="none" stroke="url(#dc-wood)" strokeWidth={40} opacity={0.75} />
            {Array.from({ length: n }).map((_, i) => {
              const a = Math.PI + (i + 0.5) * (Math.PI / n);
              const x = 540 + Math.cos(a) * R;
              const y = 1260 + Math.sin(a) * R * 0.62;
              const lit = rnd(r * 50 + i) < Math.min(1, f / 40);
              return <rect key={i} x={x - 11} y={y - 30} width={22} height={24} rx={6} fill={lit ? '#c8233a' : '#5a3040'} opacity={0.9} />;
            })}
          </g>
        );
      })}
      {/* tribuna */}
      <rect x={400} y={1150} width={280} height={110} rx={10} fill="url(#dc-wood)" stroke={OUT} strokeWidth={5} />
      <g transform="translate(110 480)"><SpainFlag x={0} y={0} w={140} h={92} /></g>
      <path d="M110 480 L110 650" stroke="#c9cfdb" strokeWidth={6} />
      <text x={640} y={530} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffd9c8" letterSpacing={4}>DIPUTACIÓN PERMANENTE</text>
      {/* gran 7 */}
      <g transform={`translate(240 ${700 + (1 - listOn) * 60}) scale(${sev * (1 - 0.35 * listOn)})`} opacity={Math.min(1, sev * 1.5)}>
        <circle r={130} fill="#ffe14d" stroke={OUT} strokeWidth={8} />
        <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={200} fill={OUT}>7</text>
        <text x={0} y={175} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#fff" stroke={OUT} strokeWidth={5} paintOrder="stroke">DECRETOS</text>
      </g>
      <g opacity={1 - listOn}>
        <Stamp x={700} y={760} text="CONVALIDADOS" s={stamp} color="#1f9d55" size={62} />
      </g>
      {/* lista de medidas */}
      {items.map(([k, label, col], i) => {
        const s = pop(f, wordAt(seg, k) - 3, 10);
        return (
          <g key={k} transform={`translate(${650 + (1 - s) * 400} ${615 + i * 98})`} opacity={Math.min(1, s * 1.5)}>
            <rect x={-290} y={-38} width={580} height={78} rx={16} fill="rgba(5,8,15,0.85)" stroke={col} strokeWidth={5} />
            <circle cx={-246} cy={1} r={22} fill={col} stroke={OUT} strokeWidth={4} />
            <path d="M-257 1 L-248 11 L-233 -9" stroke={OUT} strokeWidth={6} fill="none" strokeLinecap="round" />
            <text x={-205} y={16} fontFamily={HEAD} fontSize={42} fill="#fff">{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* ===================== HUELGA DE TRENES ===================== */
export const HuelgaScene: React.FC<P> = ({ f, T, seg }) => {
  const dT = wordAt(seg, 'desconvocada');
  const mT = wordAt(seg, 'mes');
  const maT = wordAt(seg, 'maquinistas');
  const hT = wordAt(seg, 'horario');
  const sgT = wordAt(seg, 'sigueme');
  const stamp = pop(f, dT + 4, 10);
  const mes = pop(f, mT - 3, 9);
  const row2 = pop(f, maT - 2, 9);
  const blink = Math.floor(T / 8) % 2 ? 1 : 0.35;
  const clock = pop(f, hT - 3, 8);
  const trainX = lerp(f, [0, 40], [1300, -200]) + (f > sgT ? -lerp(f, [sgT, sgT + 30], [0, 1400]) : 0);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="hg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e2a5a" />
          <stop offset="0.6" stopColor="#123a72" />
          <stop offset="1" stopColor="#060d1f" />
        </linearGradient>
        <linearGradient id="hg-train" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6fb" />
          <stop offset="1" stopColor="#aab4c8" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#hg-bg)" />
      {/* marquesina de estación */}
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${i * 180 - 60} 440 Q ${i * 180 + 30} 380 ${i * 180 + 120} 440`} fill="none" stroke="#3d6bb8" strokeWidth={10} />
      ))}
      <rect x={0} y={436} width={1080} height={14} fill="#3d6bb8" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}><rect x={60 + i * 240} y={450} width={18} height={800} fill="#2a4f8f" /><circle cx={69 + i * 240} cy={470} r={14} fill="#ffe9a8" opacity={0.8} /></g>
      ))}
      {/* tren */}
      <g transform={`translate(${trainX} 1110)`}>
        <path d="M0 0 L1200 0 L1200 150 L0 150 Q -160 150 -200 90 Q -170 10 0 0 Z" fill="url(#hg-train)" stroke={OUT} strokeWidth={6} />
        <rect x={-150} y={20} width={130} height={50} rx={18} fill="#0b1630" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={40 + i * 125} y={25} width={90} height={55} rx={10} fill="#0b1630" />)}
        <rect x={-180} y={98} width={1380} height={18} fill="#7a2bd6" />
      </g>
      <rect x={0} y={1260} width={1080} height={20} fill="#c9cfdb" />
      <rect x={0} y={1262} width={1080} height={6} fill="#ffe14d" />
      {/* panel de salidas */}
      <g transform="translate(540 700)">
        <rect x={-460} y={-200} width={920} height={400} rx={24} fill="#05080f" stroke="#2a3350" strokeWidth={10} />
        <rect x={-440} y={-180} width={880} height={56} rx={8} fill="#11182c" />
        <text x={-420} y={-138} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={34} fill="#ffb000">DÍA</text>
        <text x={-160} y={-138} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={34} fill="#ffb000">ESTADO</text>
        {/* fila 1 */}
        <g transform="translate(0 -50)">
          <text x={-420} y={14} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={46} fill="#ffe14d">JUE 19</text>
          <text x={-160} y={14} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={46} fill={stamp > 0.5 ? '#4dff88' : '#ff4d4d'}>{stamp > 0.5 ? 'HAY SERVICIO' : 'HUELGA'}</text>
        </g>
        {/* fila 2 */}
        <g transform="translate(0 50)" opacity={row2}>
          <text x={-420} y={14} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={46} fill="#ffe14d">LUN 23</text>
          <text x={-160} y={14} fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={46} fill="#ff4d4d" opacity={blink}>HUELGA SEMAF</text>
        </g>
        <g transform="translate(0 140)" opacity={mes * (1 - row2)}>
          <text x={0} y={14} textAnchor="middle" fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={34} fill="#2fd8ff">ADIF REVISA PLANTILLAS EN 1 MES</text>
        </g>
        <g transform="translate(0 140)" opacity={row2}>
          <text x={0} y={14} textAnchor="middle" fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={34} fill="#ff9a9a">MAQUINISTAS MANTIENEN EL PARO</text>
        </g>
      </g>
      <Stamp x={560} y={770} text="DESCONVOCADA" s={stamp * (1 - row2)} color="#1f9d55" size={56} rot={-7} />
      {/* reloj del horario */}
      <g transform={`translate(905 ${560}) scale(${clock})`} opacity={Math.min(1, clock * 1.5)}>
        <circle r={78} fill="#ffffff" stroke={OUT} strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <path key={i} d={`M${Math.cos(a) * 60} ${Math.sin(a) * 60} L${Math.cos(a) * 70} ${Math.sin(a) * 70}`} stroke={OUT} strokeWidth={5} />;
        })}
        <path d={`M0 0 L${Math.sin((f - hT) * 0.4) * 52} ${-Math.cos((f - hT) * 0.4) * 52}`} stroke="#e3122b" strokeWidth={8} strokeLinecap="round" />
        <path d={`M0 0 L${Math.sin((f - hT) * 0.05) * 34} ${-Math.cos((f - hT) * 0.05) * 34}`} stroke={OUT} strokeWidth={10} strokeLinecap="round" />
        <circle r={9} fill={OUT} />
        <text x={0} y={120} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffe14d" stroke={OUT} strokeWidth={4} paintOrder="stroke">×2</text>
      </g>
    </svg>
  );
};

/* ======================================================================
   BIBLIOTECA 2026-11-20: cumbre a tres, cara a cara, CIJ-Myanmar, récord en bolsa
   ====================================================================== */
const Lantern: React.FC<{ x: number; y: number; T: number; i: number }> = ({ x, y, T, i }) => {
  const sw = Math.sin(T * 0.05 + i) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sw})`}>
      <path d="M0 -80 L0 -30" stroke="#d4a84a" strokeWidth={4} />
      <ellipse cx={0} cy={10} rx={46} ry={40} fill="#e0242f" stroke={OUT} strokeWidth={5} />
      <ellipse cx={0} cy={10} rx={20} ry={40} fill="none" stroke="#8a0f17" strokeWidth={3} />
      <rect x={-22} y={-34} width={44} height={10} fill="#ffcf4a" stroke={OUT} strokeWidth={3} />
      <rect x={-22} y={46} width={44} height={10} fill="#ffcf4a" stroke={OUT} strokeWidth={3} />
      <path d="M-8 56 L-8 86 M0 56 L0 92 M8 56 L8 86" stroke="#ffcf4a" strokeWidth={3} />
      <circle cx={0} cy={10} r={60} fill="#ff6a3c" opacity={0.18 + 0.08 * Math.sin(T * 0.2 + i)} />
    </g>
  );
};

/* ===================== CUMBRE TRUMP-XI-PUTIN ===================== */
export const CumbreScene: React.FC<P> = ({ f, T, seg }) => {
  const tT = wordAt(seg, 'trump'), xT = wordAt(seg, 'shi'), pT = wordAt(seg, 'putin');
  const prT = wordAt(seg, 'primera');
  const oT = wordAt(seg, 'ochenta'), ceT = wordAt(seg, 'cerrada');
  const fT = wordAt(seg, 'firman'), nT = wordAt(seg, 'nucleares'), peT = wordAt(seg, 'petroleo'), onT = wordAt(seg, 'onu');
  const uT = wordAt(seg, 'ucrania');
  const phA = lerp(f, [oT - 8, oT], [1, 0], null);
  const phB = lerp(f, [oT - 6, oT + 4], [0, 1], null) * lerp(f, [fT - 8, fT], [1, 0], null);
  const doc = pop(f, fT - 4, 10);
  const mins = lerp(f, [oT, oT + 24], [0, 80]);
  const door = lerp(f, [ceT - 2, ceT + 10], [0, 1]);
  const flags = [
    { k: tT, el: <USFlag x={-110} y={-120} w={220} h={145} />, n: 'TRUMP', x: 190 },
    { k: xT, el: <ChinaFlag x={-110} y={-120} w={220} h={145} />, n: 'XI JINPING', x: 540 },
    { k: pT, el: <RussiaFlag x={-110} y={-120} w={220} h={145} />, n: 'PUTIN', x: 890 },
  ];
  const items = [
    { k: nT, t: 'ARMAS NUCLEARES' },
    { k: peT, t: 'PETRÓLEO' },
    { k: onT, t: 'REFORMA DE LA ONU' },
  ];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="cu-bg" cx="50%" cy="40%" r="85%">
          <stop offset="0" stopColor="#8a1a22" />
          <stop offset="0.55" stopColor="#3a0a14" />
          <stop offset="1" stopColor="#0a0306" />
        </radialGradient>
        <linearGradient id="cu-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b07a1e" />
        </linearGradient>
        <linearGradient id="cu-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a2a14" />
          <stop offset="1" stopColor="#2a1208" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#cu-bg)" />
      {/* columnas doradas y celosía */}
      {[60, 1020].map((x, i) => (
        <g key={i}>
          <rect x={x - 34} y={380} width={68} height={1000} fill="url(#cu-gold)" stroke={OUT} strokeWidth={5} />
          {Array.from({ length: 8 }).map((_, j) => <rect key={j} x={x - 34} y={420 + j * 120} width={68} height={10} fill="#7a4a10" opacity={0.6} />)}
        </g>
      ))}
      <g opacity={0.18} stroke="#ffcf4a" strokeWidth={3} fill="none">
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={140 + i * 90} y={1040} width={70} height={70} transform={`rotate(45 ${175 + i * 90} 1075)`} />)}
      </g>
      {[180, 400, 680, 900].map((x, i) => <Lantern key={i} x={x} y={430 + (i % 2) * 30} T={T} i={i} />)}
      <Particles T={T} n={26} color="#ffcf4a" seed={41} speed={0.15} size={3} op={0.45} />
      {/* mesa redonda */}
      <ellipse cx={540} cy={1240} rx={520} ry={90} fill="url(#cu-table)" stroke={OUT} strokeWidth={6} />
      <ellipse cx={540} cy={1226} rx={480} ry={64} fill="#7a3a1a" opacity={0.5} />
      <text x={540} y={1300} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffd9a0" letterSpacing={6} opacity={0.6}>SHENZHEN · CUMBRE APEC</text>
      {/* fase A: los tres */}
      <g opacity={phA}>
        {flags.map((g, i) => {
          const s = pop(f, g.k - 2, 9);
          return (
            <g key={i} transform={`translate(${g.x} ${700 + Math.sin(T * 0.08 + i) * 6}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
              <rect x={-140} y={-150} width={280} height={250} rx={24} fill="#fff8ea" stroke={OUT} strokeWidth={6} />
              {g.el}
              <text x={0} y={72} textAnchor="middle" fontFamily={HEAD} fontSize={g.n.length > 6 ? 42 : 50} fill={OUT}>{g.n}</text>
            </g>
          );
        })}
        <Pill x={540} y={890} text="JUNTOS POR PRIMERA VEZ" s={pop(f, prT - 3, 9)} bg="#ffcf4a" color={OUT} size={50} rot={-2} />
      </g>
      {/* fase B: 80 minutos a puerta cerrada */}
      <g opacity={phB}>
        <g transform="translate(320 720)">
          <circle r={170} fill="#fff8ea" stroke={OUT} strokeWidth={8} />
          <path d={`M0 0 L0 -170 A170 170 0 ${mins > 60 ? 1 : 0} 1 ${170 * Math.sin((mins / 60) * Math.PI * 2 * 0.75)} ${-170 * Math.cos((mins / 60) * Math.PI * 2 * 0.75)} Z`} fill="#e0242f" opacity={0.85} />
          <circle r={120} fill="#fff8ea" />
          <text x={0} y={30} textAnchor="middle" fontFamily={HEAD} fontSize={110} fill={OUT}>{Math.round(mins)}</text>
          <text x={0} y={84} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill={OUT}>MINUTOS</text>
        </g>
        {/* puerta */}
        <g transform="translate(780 720)">
          <rect x={-140} y={-190} width={280} height={360} rx={12} fill="#2a1208" stroke={OUT} strokeWidth={7} />
          <g transform={`translate(-130 0) scale(${0.15 + 0.85 * door} 1) translate(130 0)`}>
            <rect x={-130} y={-180} width={130} height={340} fill="#a8551e" stroke={OUT} strokeWidth={5} />
          </g>
          <g transform={`translate(130 0) scale(${0.15 + 0.85 * door} 1) translate(-130 0)`}>
            <rect x={0} y={-180} width={130} height={340} fill="#a8551e" stroke={OUT} strokeWidth={5} />
          </g>
          <circle cx={-18} cy={0} r={10} fill="#ffcf4a" opacity={door} />
          <circle cx={18} cy={0} r={10} fill="#ffcf4a" opacity={door} />
          <g opacity={door}>
            <rect x={-120} y={-260} width={240} height={56} rx={12} fill="#e0242f" stroke={OUT} strokeWidth={5} />
            <text x={0} y={-218} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill="#fff">PUERTA CERRADA</text>
          </g>
        </g>
      </g>
      {/* fase C: la declaración */}
      <Card x={540} y={720} w={860} h={420} s={doc} bg="#fff8ea">
        <text x={0} y={-150} textAnchor="middle" fontFamily={HEAD} fontSize={56} fill={OUT}>DECLARACIÓN CONJUNTA</text>
        <path d="M-380 -122 H380" stroke="#e0242f" strokeWidth={5} />
        {items.map((it, i) => {
          const s = pop(f, it.k - 3, 10);
          return (
            <g key={i} transform={`translate(-330 ${-70 + i * 68})`} opacity={Math.min(1, s * 1.4)}>
              <rect x={-24} y={-26} width={48} height={48} rx={10} fill="#2fbf71" stroke={OUT} strokeWidth={5} transform={`scale(${s})`} />
              <path d="M-12 0 L-3 10 L14 -12" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${s})`} />
              <text x={50} y={14} fontFamily={HEAD} fontSize={46} fill={OUT}>{it.t}</text>
            </g>
          );
        })}
        <g opacity={Math.min(1, pop(f, uT - 3, 10) * 1.4)}>
          <path d="M-380 128 H380" stroke={OUT} strokeWidth={3} strokeDasharray="10 10" opacity={0.4} />
          <g transform="translate(-260 160)"><UkraineFlag x={-60} y={-24} w={92} h={60} /></g>
          <text x={-170} y={176} fontFamily={HEAD} fontSize={42} fill="#0057b7">UCRANIA</text>
        </g>
        <Stamp x={170} y={160} text="NI SE MENCIONA" s={pop(f, uT + 4, 8)} color="#e0242f" rot={-6} size={44} />
      </Card>
    </svg>
  );
};

/* ===================== CARA A CARA ===================== */
const TopicTile: React.FC<{ x: number; y: number; s: number; label: string; icon: string; col: string }> = ({ x, y, s, label, icon, col }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
    <rect x={-150} y={-46} width={300} height={92} rx={22} fill={OUT} opacity={0.4} transform="translate(6 8)" />
    <rect x={-150} y={-46} width={300} height={92} rx={22} fill={col} stroke={OUT} strokeWidth={6} />
    <g transform="translate(-102 0)">
      <circle r={32} fill="#fff" stroke={OUT} strokeWidth={4} />
      {icon === 'casa' && <path d="M-18 4 L0 -14 L18 4 L18 18 L-18 18 Z M-6 18 L-6 6 L6 6 L6 18" fill="#ff5a3c" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />}
      {icon === 'euro' && <text x={0} y={15} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#2a7a3a">€</text>}
      {icon === 'lupa' && <g><circle cx={-4} cy={-4} r={12} fill="none" stroke={OUT} strokeWidth={5} /><path d="M5 5 L16 16" stroke={OUT} strokeWidth={6} strokeLinecap="round" /></g>}
      {icon === 'barco' && <g><path d="M-20 4 L20 4 L12 16 L-12 16 Z" fill="#2f7bff" stroke={OUT} strokeWidth={3} /><path d="M0 4 L0 -18 L14 -2 Z" fill="#ffe14d" stroke={OUT} strokeWidth={3} /></g>}
    </g>
    <text x={30} y={16} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#fff" stroke={OUT} strokeWidth={4} paintOrder="stroke">{label}</text>
  </g>
);

const Bubble: React.FC<{ x: number; y: number; s: number; lines: string[]; col: string; tail: number }> = ({ x, y, s, lines, col, tail }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
    <rect x={-190} y={-70} width={380} height={140} rx={30} fill={col} stroke={OUT} strokeWidth={6} />
    <path d={`M${tail * 60} 66 L${tail * 120} 130 L${tail * 120 - tail * 70} 66 Z`} fill={col} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-184} y={60} width={368} height={10} fill={col} />
    {lines.map((l, i) => (
      <text key={i} x={0} y={-12 + i * 54 - (lines.length - 2) * 26} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#fff" stroke={OUT} strokeWidth={4} paintOrder="stroke">{l}</text>
    ))}
  </g>
);

export const CaraACaraScene: React.FC<P> = ({ f, T, seg }) => {
  const cT = wordAt(seg, 'cara');
  const sT = wordAt(seg, 'sanchez'), feT = wordAt(seg, 'feijoo');
  const viT = wordAt(seg, 'vivienda'), imT = wordAt(seg, 'impuestos'), coT = wordAt(seg, 'corrupcion'), miT = wordAt(seg, 'migracion');
  const s2T = wordAt(seg, 'sanchez', 1), f2T = wordAt(seg, 'feijoo', 1);
  const elT = wordAt(seg, 'elecciones');
  const vs = pop(f, cT, 7);
  const flash = lerp(f, [cT, cT + 8], [0.6, 0], null);
  const topics = lerp(f, [viT - 6, viT], [0, 1], null) * lerp(f, [s2T - 8, s2T], [1, 0], null);
  const vsOp = lerp(f, [viT - 6, viT], [1, 0], null);
  const elec = pop(f, elT - 3, 9);
  const bubOp = lerp(f, [elT - 6, elT + 2], [1, 0], null);
  const tiles = [
    { k: viT, l: 'VIVIENDA', i: 'casa', c: '#ff5a3c', x: 540, y: 520 },
    { k: imT, l: 'IMPUESTOS', i: 'euro', c: '#2fbf71', x: 540, y: 630 },
    { k: coT, l: 'CORRUPCIÓN', i: 'lupa', c: '#7a5cff', x: 540, y: 740 },
    { k: miT, l: 'MIGRACIÓN', i: 'barco', c: '#2f7bff', x: 540, y: 850 },
  ];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="cc-bg" cx="50%" cy="45%" r="80%">
          <stop offset="0" stopColor="#1a4a9a" />
          <stop offset="0.55" stopColor="#0b1d4a" />
          <stop offset="1" stopColor="#030716" />
        </radialGradient>
        <linearGradient id="cc-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a6aff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#030716" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#cc-bg)" />
      {/* pantallas del plató */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 178} y={420} width={160} height={400} rx={8} fill="#0e2a66" stroke="#4a8aff" strokeWidth={3} opacity={0.6} />
          {Array.from({ length: 6 }).map((_, j) => (
            <rect key={j} x={34 + i * 178} y={440 + j * 62} width={132} height={40} rx={4} fill="#4a8aff" opacity={0.12 + 0.12 * Math.abs(Math.sin(T * 0.06 + i + j))} />
          ))}
        </g>
      ))}
      {/* suelo brillante */}
      <rect x={0} y={900} width={1080} height={500} fill="url(#cc-floor)" />
      <ellipse cx={540} cy={1010} rx={460} ry={60} fill="none" stroke="#7fc0ff" strokeWidth={4} opacity={0.5} />
      <ellipse cx={540} cy={1010} rx={330} ry={40} fill="none" stroke="#7fc0ff" strokeWidth={3} opacity={0.35} />
      {/* focos */}
      {[0, 1, 2].map((i) => {
        const a = Math.sin(T * 0.04 + i * 2) * 14;
        return (
          <g key={i} transform={`rotate(${a} ${200 + i * 340} 380)`}>
            <path d={`M${200 + i * 340} 380 L${110 + i * 340} 1100 L${290 + i * 340} 1100 Z`} fill="#cfe4ff" opacity={0.1} />
          </g>
        );
      })}
      <Particles T={T} n={30} color="#9fd0ff" seed={51} speed={0.12} size={3} op={0.5} />
      <Podium x={170} name="SÁNCHEZ" s={pop(f, sT - 3, 10)} T={T} side={1} />
      <Podium x={910} name="FEIJÓO" s={pop(f, feT - 3, 10)} T={T + 5} side={-1} />
      {/* VS + único */}
      <g opacity={vsOp}>
        <g transform={`translate(540 700) scale(${0.85 * vs}) rotate(${-8 + (1 - vs) * 30})`}>
          <path d="M-120 -40 L40 -140 L10 -30 L130 -60 L-40 140 L-10 20 L-130 50 Z" fill="#ffe14d" stroke={OUT} strokeWidth={9} strokeLinejoin="round" />
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={150} fill="#ff2d55" stroke={OUT} strokeWidth={10} paintOrder="stroke">VS</text>
        </g>
        <Pill x={540} y={520} text="EL ÚNICO DE LA CAMPAÑA" s={pop(f, cT + 6, 10)} bg="#ffffff" color={OUT} size={40} />
      </g>
      {/* temas */}
      <g opacity={topics}>
        {tiles.map((t, i) => <TopicTile key={i} x={t.x} y={t.y} s={pop(f, t.k - 3, 10)} label={t.l} icon={t.i} col={t.c} />)}
      </g>
      {/* cada uno su mensaje */}
      <g opacity={bubOp}>
        <Bubble x={330} y={560} s={pop(f, s2T - 2, 10)} lines={['DEFIENDE', 'SU GESTIÓN']} col="#e0242f" tail={-1} />
        <Bubble x={750} y={760} s={pop(f, f2T - 2, 10)} lines={['1 MILLÓN', 'DE VIVIENDAS']} col="#1d6fd6" tail={1} />
      </g>
      {/* urna 29-N */}
      <Pill x={540} y={510} text="ELECCIONES GENERALES" s={elec} bg="#ffe14d" color={OUT} size={44} />
      <g transform={`translate(540 760) scale(${elec})`} opacity={Math.min(1, elec * 1.5)}>
        <g transform={`translate(0 ${-60 - lerp(f, [elT, elT + 20], [80, 0])})`}>
          <rect x={-60} y={-80} width={120} height={150} rx={6} fill="#fff" stroke={OUT} strokeWidth={6} transform="rotate(-6)" />
          <path d="M-36 -40 H30 M-36 -10 H30 M-36 20 H14" stroke="#9aa4b8" strokeWidth={6} transform="rotate(-6)" />
        </g>
        <rect x={-200} y={-40} width={400} height={260} rx={22} fill="rgba(220,240,255,0.85)" stroke={OUT} strokeWidth={8} />
        <rect x={-90} y={-52} width={180} height={24} rx={8} fill={OUT} />
        <text x={0} y={130} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill="#1d3a8a">29-N</text>
      </g>
      <rect width={1080} height={1920} fill="#ffffff" opacity={flash} />
    </svg>
  );
};

/* ===================== CIJ: MYANMAR ===================== */
const Scales: React.FC<{ x: number; y: number; s: number; tilt: number }> = ({ x, y, s, tilt }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-160} width={16} height={260} fill="#d9b25a" stroke={OUT} strokeWidth={4} />
    <path d="M-70 100 H70 L50 80 H-50 Z" fill="#d9b25a" stroke={OUT} strokeWidth={4} />
    <circle cx={0} cy={-168} r={16} fill="#d9b25a" stroke={OUT} strokeWidth={4} />
    <g transform={`rotate(${tilt} 0 -140)`}>
      <rect x={-170} y={-148} width={340} height={14} rx={6} fill="#d9b25a" stroke={OUT} strokeWidth={4} />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 160} -140) rotate(${-tilt})`}>
          <path d="M0 0 L-50 110 M0 0 L50 110" stroke="#d9b25a" strokeWidth={4} />
          <path d="M-62 110 H62 Q 0 160 -62 110 Z" fill="#d9b25a" stroke={OUT} strokeWidth={4} />
        </g>
      ))}
    </g>
  </g>
);

const Person: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-46} r={14} fill={c} />
    <path d="M-16 -28 Q 0 -34 16 -28 L20 10 L-20 10 Z" fill={c} />
    <rect x={-14} y={8} width={10} height={28} fill={c} /><rect x={4} y={8} width={10} height={28} fill={c} />
  </g>
);

export const MyanmarScene: React.FC<P> = ({ f, T, seg }) => {
  const hT = wordAt(seg, 'haya'), coT = wordAt(seg, 'corte'), gT = wordAt(seg, 'genocidio');
  const prT = wordAt(seg, 'primera'), seT = wordAt(seg, 'setecientos'), huT = wordAt(seg, 'huyeron');
  const orT = wordAt(seg, 'ordena'), juT = wordAt(seg, 'juzgar'), inT = wordAt(seg, 'indemnizar');
  const ph1 = lerp(f, [seT - 8, seT], [1, 0], null);
  const ph2 = lerp(f, [seT - 6, seT + 2], [0, 1], null) * lerp(f, [orT - 8, orT], [1, 0], null);
  const ph3 = lerp(f, [orT - 6, orT + 2], [0, 1], null);
  const cnt = lerp(f, [seT - 2, seT + 26], [0, 700000]);
  const walk = lerp(f, [seT, huT + 40], [0, 1], (t) => t);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="my-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a2e" />
          <stop offset="0.6" stopColor="#262c44" />
          <stop offset="1" stopColor="#07090f" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#my-bg)" />
      {/* Palacio de la Paz estilizado */}
      <g opacity={0.5} fill="#3a4262" stroke="#5a6488" strokeWidth={3}>
        <rect x={140} y={760} width={800} height={340} />
        <path d="M140 760 L200 700 L880 700 L940 760 Z" />
        <rect x={820} y={540} width={90} height={220} />
        <path d="M820 540 L865 470 L910 540 Z" />
        <rect x={170} y={610} width={70} height={150} />
        <path d="M170 610 L205 560 L240 610 Z" />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={180 + i * 76} y={800} width={40} height={90} rx={18} fill="#1a1f33" />)}
        {Array.from({ length: 10 }).map((_, i) => <rect key={`b${i}`} x={180 + i * 76} y={940} width={40} height={90} rx={18} fill="#1a1f33" />)}
      </g>
      <Particles T={T} n={22} color="#c8d0e8" seed={61} speed={0.08} size={2.5} op={0.4} />
      <text x={540} y={500} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#c8d0e8" letterSpacing={6} opacity={pop(f, hT - 3, 12)}>LA HAYA · TRIBUNAL DE LA ONU</text>
      {/* fase 1: balanza + sello */}
      <g opacity={ph1}>
        <Scales x={540} y={760} s={pop(f, coT - 4, 12)} tilt={lerp(f, [gT - 4, gT + 14], [0, -12])} />
        <Card x={540} y={590} w={560} h={96} s={pop(f, coT - 2, 12)} bg="#ffffff">
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill={OUT}>CORTE INTERNACIONAL</text>
        </Card>
        <Stamp x={540} y={830} text="GENOCIDIO" s={pop(f, gT, 8)} color="#c4001f" rot={-7} size={80} />
        <Pill x={540} y={930} text="1ª VEZ QUE SEÑALA A UN ESTADO" s={pop(f, prT - 3, 10)} bg="#ffffff" color={OUT} size={40} />
      </g>
      {/* fase 2: 700.000 huyen */}
      <g opacity={ph2}>
        <g transform="translate(540 640)">
          <text x={6} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill={OUT} opacity={0.5}>+{fmtCount(cnt)}</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill="#ffffff" stroke={OUT} strokeWidth={9} paintOrder="stroke">+{fmtCount(cnt)}</text>
          <text x={0} y={58} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={36} fill="#ffb26b">ROHINYÁS HUYERON</text>
        </g>
        <g transform="translate(0 870)">
          <rect x={60} y={-60} width={250} height={90} rx={16} fill="#3a4262" stroke={OUT} strokeWidth={5} />
          <text x={185} y={2} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#fff">MYANMAR</text>
          <rect x={770} y={-60} width={260} height={90} rx={16} fill="#006a4e" stroke={OUT} strokeWidth={5} />
          <text x={900} y={2} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#fff">BANGLADÉS</text>
          <path d="M320 -15 L750 -15" stroke="#ffb26b" strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={-T * 2} />
          <polygon points="750,-32 778,-15 750,2" fill="#ffb26b" />
          {Array.from({ length: 9 }).map((_, i) => {
            const p = (walk * 1.4 + i * 0.11) % 1;
            const x = 330 + p * 410;
            return <Person key={i} x={x} y={46 + (i % 2) * 6} s={0.8} c="#c8d0e8" />;
          })}
        </g>
      </g>
      {/* fase 3: lo que ordena */}
      <g opacity={ph3}>
        <Scales x={540} y={760} s={0.7} tilt={0} />
        <Card x={290} y={700} w={400} h={190} s={pop(f, juT - 3, 10)} bg="#ffffff">
          <text x={0} y={-24} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">ORDENA</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill={OUT}>JUZGAR</text>
        </Card>
        <Card x={790} y={700} w={400} h={190} s={pop(f, inT - 3, 10)} bg="#ffffff">
          <text x={0} y={-24} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">ORDENA</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill={OUT}>INDEMNIZAR</text>
        </Card>
      </g>
    </svg>
  );
};

/* ===================== RÉCORD EN BOLSA ===================== */
export const BolsaScene: React.FC<P> = ({ f, T, seg }) => {
  const maT = wordAt(seg, 'mayor'), hiT = wordAt(seg, 'historia');
  const anT = wordAt(seg, 'anthropic'), iaT = wordAt(seg, 'inteligencia');
  const ocT = wordAt(seg, 'ochenta'), saT = wordAt(seg, 'sale'), ciT = wordAt(seg, 'cierra'), diT = wordAt(seg, 'diecisiete');
  const ph1 = lerp(f, [saT - 8, saT], [1, 0], null);
  const ph2 = lerp(f, [saT - 6, saT + 2], [0, 1], null);
  const cnt = lerp(f, [ocT - 2, ocT + 30], [0, 81000]);
  const line = lerp(f, [saT + 6, ciT + 20], [0, 1]);
  const price = 83 + (97 - 83) * line;
  // gráfico de velas
  const pts = Array.from({ length: 11 }).map((_, i) => {
    const t = i / 10;
    const y = 83 + 14 * t + Math.sin(i * 2.3) * 3 * (1 - t) + (i === 3 ? 9 : i === 4 ? 6 : 0);
    return { x: 150 + i * 78, y: 900 - (y - 78) * 16 };
  });
  const tick = 'ANT  ▲17%   NASDAQ   SALIDA A BOLSA RÉCORD   ';
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="bo-bg" cx="50%" cy="40%" r="85%">
          <stop offset="0" stopColor="#0f5a3a" />
          <stop offset="0.55" stopColor="#06261c" />
          <stop offset="1" stopColor="#020a07" />
        </radialGradient>
        <linearGradient id="bo-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3dff9a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3dff9a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#bo-bg)" />
      {/* rejilla */}
      <g stroke="#3dff9a" strokeOpacity={0.1} strokeWidth={2}>
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${i * 80} 380 V1400`} />)}
        {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M0 ${380 + i * 80} H1080`} />)}
      </g>
      {/* velas de fondo */}
      <g opacity={0.3 * ph1}>
        {Array.from({ length: 13 }).map((_, i) => {
          const up = rnd(i + 3) > 0.35;
          const h = 60 + rnd(i) * 120;
          const y = 1250 - i * 22 - h;
          return (
            <g key={i}>
              <path d={`M${80 + i * 72} ${y - 20} V${y + h + 20}`} stroke={up ? '#3dff9a' : '#ff4d6a'} strokeWidth={4} />
              <rect x={62 + i * 72} y={y} width={36} height={h} fill={up ? '#3dff9a' : '#ff4d6a'} />
            </g>
          );
        })}
      </g>
      <Particles T={T} n={30} color="#7dffbf" seed={71} speed={0.4} size={3} op={0.45} />
      {/* cinta de cotizaciones */}
      <g>
        <rect x={0} y={1160} width={1080} height={64} fill="#02140d" stroke="#3dff9a" strokeWidth={3} />
        <text x={-((T * 4) % 900)} y={1205} fontFamily={HEAD} fontSize={42} fill="#3dff9a" letterSpacing={3}>{tick + tick + tick}</text>
      </g>
      {/* fase 1 */}
      <g opacity={ph1}>
        <g transform={`translate(540 600) scale(${pop(f, maT - 3, 9)})`}>
          <path d="M-80 -90 H80 V-20 Q80 60 0 70 Q-80 60 -80 -20 Z" fill="#ffcf4a" stroke={OUT} strokeWidth={7} />
          <path d="M-80 -70 Q-140 -70 -130 -20 Q-120 20 -70 20" fill="none" stroke={OUT} strokeWidth={14} />
          <path d="M-80 -70 Q-140 -70 -130 -20 Q-120 20 -70 20" fill="none" stroke="#ffcf4a" strokeWidth={8} />
          <path d="M80 -70 Q140 -70 130 -20 Q120 20 70 20" fill="none" stroke={OUT} strokeWidth={14} />
          <path d="M80 -70 Q140 -70 130 -20 Q120 20 70 20" fill="none" stroke="#ffcf4a" strokeWidth={8} />
          <rect x={-20} y={68} width={40} height={40} fill="#d4a020" stroke={OUT} strokeWidth={6} />
          <rect x={-70} y={104} width={140} height={34} rx={6} fill="#8a5a10" stroke={OUT} strokeWidth={6} />
          <text x={0} y={2} textAnchor="middle" fontFamily={HEAD} fontSize={54} fill={OUT}>Nº1</text>
        </g>
        <Pill x={540} y={480} text="LA MAYOR DE LA HISTORIA" s={pop(f, hiT - 2, 10)} bg="#ffcf4a" color={OUT} size={44} />
        <Card x={540} y={790} w={640} h={100} s={pop(f, anT - 2, 10) * lerp(f, [ocT - 6, ocT], [1, 0], null)} bg="#ffffff">
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill={OUT}>ANTHROPIC · EMPRESA DE IA</text>
        </Card>
        <g opacity={pop(f, iaT, 10) * lerp(f, [ocT - 6, ocT], [1, 0], null)}>
          <text x={540} y={900} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={38} fill="#7dffbf">DEBUTA EN EL NASDAQ</text>
        </g>
        <g transform={`translate(540 850) scale(${pop(f, ocT - 4, 9)})`} opacity={Math.min(1, pop(f, ocT - 4, 9) * 1.5)}>
          <text x={6} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={124} fill={OUT} opacity={0.5}>{fmtCount(cnt)} M$</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={124} fill="#3dff9a" stroke={OUT} strokeWidth={10} paintOrder="stroke">{fmtCount(cnt)} M$</text>
          <text x={0} y={52} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={34} fill="#ffffff">CAPTADOS EN SU SALIDA</text>
        </g>
      </g>
      {/* fase 2: gráfico 83 -> 97 */}
      <g opacity={ph2}>
        <rect x={110} y={470} width={860} height={480} rx={26} fill="rgba(2,20,13,0.75)" stroke="#3dff9a" strokeWidth={4} />
        <path d={`M150 ${900 - (83 - 78) * 16} H930`} stroke="#ffffff" strokeWidth={3} strokeDasharray="12 10" opacity={0.5} />
        <text x={160} y={900 - (83 - 78) * 16 + 40} fontFamily={HEAD} fontSize={36} fill="#ffffff" opacity={0.8}>SALIDA: 83 $</text>
        <g>
          <clipPath id="bo-clip"><rect x={140} y={460} width={800 * line + 10} height={500} /></clipPath>
          <g clipPath="url(#bo-clip)">
            <path d={`M${pts[0].x} 940 ${pts.map((p) => `L${p.x} ${p.y}`).join(' ')} L${pts[pts.length - 1].x} 940 Z`} fill="url(#bo-area)" />
            <path d={`M${pts.map((p) => `${p.x} ${p.y}`).join(' L')}`} fill="none" stroke="#3dff9a" strokeWidth={8} strokeLinejoin="round" />
          </g>
        </g>
        <g transform="translate(330 540)">
          <text x={0} y={20} textAnchor="middle" fontFamily={HEAD} fontSize={76} fill="#ffffff" stroke={OUT} strokeWidth={7} paintOrder="stroke">{price.toFixed(2).replace('.', ',')} $</text>
        </g>
        <Pill x={800} y={560} text="CIERRE: 97 $" s={pop(f, ciT + 4, 10)} bg="#ffffff" color={OUT} size={40} />
        <Pill x={740} y={870} text="▲ +17 %" s={pop(f, diT - 2, 8)} bg="#2fbf71" size={64} rot={-3} />
      </g>
    </svg>
  );
};

/* ======================================================================
   BIBLIOTECA 2026-11-21: ataque ruso, misiles en Polonia, viernes negro, voto ley de nietos
   ====================================================================== */
export const PolandFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h / 2} fill="#ffffff" />
    <rect x={x} y={y + h / 2} width={w} height={h / 2} fill="#dc143c" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);

const Missile: React.FC<{ x: number; y: number; r: number; s?: number }> = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-60 0 L-120 -6 L-120 6 Z" fill="#ffb347" opacity={0.85} />
    <path d="M-60 0 L-95 -3 L-95 3 Z" fill="#fff3b0" />
    <rect x={-60} y={-7} width={70} height={14} rx={4} fill="#c9ced8" stroke={OUT} strokeWidth={3} />
    <path d="M10 -7 L30 0 L10 7 Z" fill="#e3122b" stroke={OUT} strokeWidth={3} />
    <path d="M-60 -7 L-72 -18 L-48 -7 Z M-60 7 L-72 18 L-48 7 Z" fill="#8a93a8" stroke={OUT} strokeWidth={2} />
  </g>
);

const Drone: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#9aa3b5' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-26 0 L18 -16 L10 0 L18 16 Z" fill={c} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={-26} cy={0} r={4} fill="#ff6a00" />
  </g>
);

/* ===================== ATAQUE MASIVO SOBRE UCRANIA ===================== */
export const AtaqueScene: React.FC<P> = ({ f, T, seg }) => {
  const ciT = wordAt(seg, 'cien'), drT = wordAt(seg, 'cuatrocientos');
  const soT = wordAt(seg, 'solo'), trT = wordAt(seg, 'tres'), veT = wordAt(seg, 'veintisiete');
  const alT = wordAt(seg, 'al'), ocT = wordAt(seg, 'ocho'), seT = wordAt(seg, 'seis'), apT = wordAt(seg, 'apagones');
  const ph1 = lerp(f, [soT - 8, soT], [1, 0], null);
  const ph2 = lerp(f, [soT - 6, soT + 2], [0, 1], null) * lerp(f, [alT - 8, alT], [1, 0], null);
  const ph3 = lerp(f, [alT - 6, alT + 2], [0, 1], null);
  const dark = lerp(f, [apT, apT + 14], [0, 1], null);
  const mCnt = lerp(f, [ciT - 4, ciT + 22], [0, 100]);
  const dCnt = lerp(f, [drT - 2, drT + 26], [0, 400]);
  const dead = Math.round(lerp(f, [ocT - 2, ocT + 14], [0, 8]));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="at-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060914" />
          <stop offset="0.55" stopColor="#1a1430" />
          <stop offset="0.8" stopColor="#3a1a1a" />
          <stop offset="1" stopColor="#07050a" />
        </linearGradient>
        <radialGradient id="at-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8a2a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff3b1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#at-bg)" />
      <Particles T={T} n={40} color="#dfe6ff" seed={91} speed={0.02} size={2} op={0.5} />
      {/* haces de reflectores antiaéreos */}
      {[0, 1, 2].map((i) => {
        const a = -70 + Math.sin(T * 0.03 + i * 2) * 22 + i * 30;
        return <path key={i} d="M0 0 L-40 -900 L40 -900 Z" fill="#cfe3ff" opacity={0.07 * (1 - dark * 0.5)} transform={`translate(${200 + i * 340} 1160) rotate(${a + 70})`} />;
      })}
      {/* ciudad de Kiev: silueta con cúpulas y ventanas */}
      <g transform="translate(0 1000)">
        <path d="M0 160 L0 80 L60 80 L60 40 L120 40 L120 90 L170 90 L170 20 L230 20 L230 100 L300 100 L300 60 L340 60 L340 160 Z" fill="#0b0d18" />
        <g transform="translate(430 0)">
          <rect x={-60} y={40} width={120} height={120} fill="#0b0d18" />
          <path d="M-40 40 Q -40 -20 0 -30 Q 40 -20 40 40 Z" fill="#0b0d18" />
          <path d="M0 -30 V-70 M-12 -55 H12" stroke="#0b0d18" strokeWidth={6} />
          <path d="M-40 40 Q -40 -20 0 -30 Q 40 -20 40 40" fill="none" stroke="#d9b25a" strokeWidth={3} opacity={0.6 * (1 - dark)} />
        </g>
        <path d="M520 160 L520 70 L600 70 L600 10 L650 10 L650 70 L720 70 L720 30 L790 30 L790 110 L860 110 L860 50 L940 50 L940 90 L1080 90 L1080 160 Z" fill="#0b0d18" />
        {Array.from({ length: 46 }).map((_, i) => {
          const x = 14 + (i * 23.3) % 1050;
          const y = 60 + ((i * 37) % 80);
          const on = rnd(i + 5) > 0.35;
          const off = rnd(i + 11) < dark * 1.05;
          return on ? <rect key={i} x={x} y={y} width={10} height={14} fill="#ffd77a" opacity={off ? 0.05 : 0.85} /> : null;
        })}
      </g>
      {/* explosiones en el horizonte */}
      {[[260, 1080, 20], [700, 1060, 80], [900, 1090, 150], [480, 1070, 230]].map(([x, y, t0], i) => {
        const g = ((f - t0) % 90 + 90) % 90;
        if (f < t0) return null;
        return <circle key={i} cx={x} cy={y} r={30 + g * 2.2} fill="url(#at-glow)" opacity={Math.max(0, 1 - g / 50)} />;
      })}
      {/* misiles cayendo y drones */}
      <g opacity={0.9}>
        {Array.from({ length: 7 }).map((_, i) => {
          const p = ((f * 0.012 + rnd(i + 3)) % 1);
          const x = 1150 - p * 900 - i * 40;
          const y = 380 + p * 640 + rnd(i) * 60;
          return <Missile key={i} x={x} y={y} r={145} s={0.9} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const p = ((f * 0.008 + rnd(i + 17)) % 1);
          return <Drone key={i} x={1120 - p * 1200} y={420 + rnd(i * 4) * 200 + Math.sin(T * 0.2 + i) * 6} s={0.8} />;
        })}
      </g>
      {/* fase 1: cifras del ataque */}
      <g opacity={ph1}>
        <Card x={300} y={720} w={420} h={210} s={pop(f, ciT - 6, 11)} bg="#ffffff">
          <text x={0} y={-62} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">CERCA DE</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={96} fill="#c4001f">{Math.round(mCnt)}</text>
          <text x={0} y={88} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill={OUT}>MISILES</text>
        </Card>
        <Card x={780} y={720} w={420} h={210} s={pop(f, drT - 4, 11)} bg="#ffffff">
          <text x={0} y={-62} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">MÁS DE</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={96} fill="#c4001f">{Math.round(dCnt)}</text>
          <text x={0} y={88} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill={OUT}>DRONES</text>
        </Card>
        <g opacity={pop(f, 4, 12)}>
          <UkraineFlag x={455} y={500} w={170} h={110} />
        </g>
      </g>
      {/* fase 2: balísticos derribados 3 de 27 */}
      <g opacity={ph2}>
        <rect x={90} y={490} width={900} height={440} rx={30} fill="rgba(5,8,15,0.78)" stroke="#5a6488" strokeWidth={4} />
        <text x={540} y={560} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill="#ffffff" letterSpacing={2}>MISILES BALÍSTICOS</text>
        {Array.from({ length: 27 }).map((_, i) => {
          const col = i % 9, row = Math.floor(i / 9);
          const x = 160 + col * 95, y = 640 + row * 90;
          const shown = f >= veT - 6 + i * 0.6;
          const down = i < 3 && f >= trT;
          return (
            <g key={i} opacity={shown ? 1 : 0.15} transform={`translate(${x} ${y})`}>
              <g transform="rotate(-90)">
                <rect x={-30} y={-9} width={52} height={18} rx={5} fill={down ? '#2fbf71' : '#c9ced8'} stroke={OUT} strokeWidth={3} />
                <path d="M22 -9 L40 0 L22 9 Z" fill={down ? '#2fbf71' : '#e3122b'} stroke={OUT} strokeWidth={3} />
              </g>
              {down && <path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#2fbf71" strokeWidth={8} strokeLinecap="round" />}
            </g>
          );
        })}
        <Pill x={540} y={900} text="SOLO 3 DE 27 DERRIBADOS" s={pop(f, trT, 10)} bg="#ffffff" color={OUT} size={40} />
      </g>
      {/* fase 3: víctimas y apagones (sobrio) */}
      <g opacity={ph3}>
        <g transform="translate(540 680)">
          <text x={6} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={170} fill={OUT} opacity={0.5}>{dead}</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={170} fill="#ffffff" stroke={OUT} strokeWidth={10} paintOrder="stroke">{dead}</text>
          <text x={0} y={64} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={40} fill="#ffb3b3">MUERTOS, AL MENOS</text>
        </g>
        <Pill x={300} y={860} text="6 EN KIEV" s={pop(f, seT - 2, 10)} bg="#ffffff" color={OUT} size={44} />
        <Pill x={740} y={860} text="APAGONES" s={pop(f, apT, 10)} bg="#2a2f45" color="#ffd77a" size={44} />
      </g>
      <rect width={1080} height={1920} fill="#000000" opacity={dark * 0.25} />
    </svg>
  );
};

/* ===================== MISILES RUSOS EN POLONIA ===================== */
export const PoloniaScene: React.FC<P> = ({ f, T, seg }) => {
  const doT = wordAt(seg, 'dos'), drT = wordAt(seg, 'dron'), caT = wordAt(seg, 'caen');
  const poT = wordAt(seg, 'polonia'), otT = wordAt(seg, 'otan'), noT = wordAt(seg, 'no');
  const vaT = wordAt(seg, 'varsovia'), prT = wordAt(seg, 'provocacion');
  const map = pop(f, 0, 14);
  const ukr = { x: 860, y: 900 };
  const hits = [{ x: 520, y: 760, t: caT }, { x: 470, y: 860, t: caT + 8 }, { x: 560, y: 680, t: caT + 16 }];
  const fly = (i: number) => lerp(f, [doT + i * 6, caT + i * 8], [0, 1], (t) => t);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="po-bg" cx="50%" cy="38%" r="85%">
          <stop offset="0" stopColor="#14284a" />
          <stop offset="0.6" stopColor="#081428" />
          <stop offset="1" stopColor="#03060f" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#po-bg)" />
      {/* radar de fondo */}
      <g transform="translate(540 720)" opacity={0.3}>
        {[140, 280, 420].map((r) => <circle key={r} r={r} fill="none" stroke="#5ff0ff" strokeWidth={2} />)}
        <g transform={`rotate(${T * 2.5})`}><path d="M0 0 L430 0 A430 430 0 0 0 372 -215 Z" fill="#5ff0ff" opacity={0.25} /></g>
      </g>
      <g opacity={map}>
        {/* Polonia (izquierda) */}
        <path d="M40 520 L210 490 L380 470 L560 500 L600 560 L590 650 L620 760 L600 880 L520 930 L380 920 L230 940 L90 900 L50 800 L30 660 Z" fill="#2a3556" stroke="#ff8aa0" strokeWidth={5} />
        {/* Ucrania (derecha) */}
        <path d="M600 560 L760 540 L920 560 L1080 600 L1080 960 L900 980 L760 960 L640 930 L600 880 L620 760 L590 650 Z" fill="#2a3a2a" stroke="#ffd700" strokeWidth={4} opacity={0.9} />
        <path d="M600 560 L590 650 L620 760 L600 880" fill="none" stroke="#ffffff" strokeWidth={5} strokeDasharray="16 12" />
        <text x={250} y={600} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffd0d8" letterSpacing={3}>POLONIA</text>
        <text x={860} y={640} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#fff3b0" letterSpacing={3}>UCRANIA</text>
        <PolandFlag x={190} y={630} w={120} h={76} />
        <circle cx={140} cy={540} r={8} fill="#ffffff" /><text x={150} y={572} fontFamily={BODY} fontWeight={900} fontSize={22} fill="#ffffff" opacity={0.8}>VARSOVIA</text>
        {/* trayectorias desde el este */}
        {hits.map((h, i) => {
          const p = fly(i);
          if (p <= 0) return null;
          const sx = 1100, sy = 760 - i * 60;
          const cx = (sx + h.x) / 2, cy = Math.min(sy, h.y) - 150;
          const pt = (t: number) => ({ x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * h.x, y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * h.y });
          let d = '';
          for (let k = 0; k <= 30 * p; k++) { const q = pt(k / 30); d += `${k ? 'L' : 'M'}${q.x} ${q.y} `; }
          const a = pt(Math.min(p, 0.99)), b = pt(Math.min(p + 0.01, 1));
          const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="#ff3b4e" strokeWidth={5} strokeDasharray="14 10" />
              {p < 1 && (i < 2 ? <Missile x={a.x} y={a.y} r={ang} s={0.8} /> : <Drone x={a.x} y={a.y} s={1.4} c="#c9ced8" />)}
            </g>
          );
        })}
        {hits.map((h, i) => {
          const g = f - h.t;
          if (g < 0) return null;
          return (
            <g key={`h${i}`} transform={`translate(${h.x} ${h.y})`}>
              <circle r={14 + (g % 24) * 2.6} fill="none" stroke="#ff3b4e" strokeWidth={4} opacity={1 - (g % 24) / 24} />
              <circle r={14} fill="#ff3b4e" stroke={OUT} strokeWidth={3} />
            </g>
          );
        })}
        <Pill x={330} y={800} text="2 MISILES + 1 DRON" s={pop(f, drT, 10) * lerp(f, [noT - 6, noT], [1, 0], null)} bg="#ffffff" color={OUT} size={38} />
      </g>
      {/* insignia OTAN */}
      <g transform={`translate(860 800) scale(${pop(f, otT - 4, 10)})`}>
        <circle r={86} fill="#0b2a6b" stroke={OUT} strokeWidth={7} />
        <circle r={72} fill="none" stroke="#ffffff" strokeWidth={4} />
        <polygon points="0,-58 12,-12 58,0 12,12 0,58 -12,12 -58,0 -12,-12" fill="#ffffff" />
        <text x={0} y={128} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#ffffff" stroke={OUT} strokeWidth={4} paintOrder="stroke">OTAN</text>
      </g>
      <Pill x={330} y={800} text="SIN HERIDOS" s={pop(f, noT, 10)} bg="#2fbf71" size={44} />
      <g opacity={pop(f, vaT - 4, 12)}>
        <Stamp x={400} y={900} text="PROVOCACIÓN" s={pop(f, prT - 2, 8)} color="#c4001f" rot={-6} size={64} />
      </g>
      <rect width={1080} height={1920} fill="#ff0022" opacity={f >= caT ? 0.04 + 0.03 * Math.sin(T * 0.25) : 0} />
    </svg>
  );
};

/* ===================== VIERNES NEGRO EN LA BOLSA ===================== */
export const ViernesNegroScene: React.FC<P> = ({ f, T, seg }) => {
  const viT = wordAt(seg, 'viernes'), waT = wordAt(seg, 'wall'), inT = wordAt(seg, 'inteligencia');
  const naT = wordAt(seg, 'nasdaq'), nvT = wordAt(seg, 'nvidia'), coT = wordAt(seg, 'correccion');
  const ibT = wordAt(seg, 'ibex'), diT = wordAt(seg, 'diecinueve');
  const ph1 = lerp(f, [naT - 8, naT], [1, 0], null);
  const ph2 = lerp(f, [naT - 6, naT + 2], [0, 1], null) * lerp(f, [ibT - 8, ibT], [1, 0], null);
  const ph3 = lerp(f, [ibT - 6, ibT + 2], [0, 1], null);
  const drop = lerp(f, [naT, coT + 30], [0, 1]);
  const pts = Array.from({ length: 12 }).map((_, i) => {
    const t = i / 11;
    const y = 560 + t * t * 300 * drop + Math.sin(i * 1.9) * 18;
    return { x: 140 + i * 72, y };
  });
  const ib = lerp(f, [ibT, diT + 10], [19186, 18873]);
    return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <radialGradient id="vn-bg" cx="50%" cy="40%" r="85%">
          <stop offset="0" stopColor="#5a0d18" />
          <stop offset="0.55" stopColor="#220509" />
          <stop offset="1" stopColor="#080103" />
        </radialGradient>
        <linearGradient id="vn-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff4d6a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff4d6a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#vn-bg)" />
      <g stroke="#ff4d6a" strokeOpacity={0.1} strokeWidth={2}>
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${i * 80} 380 V1400`} />)}
        {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M0 ${380 + i * 80} H1080`} />)}
      </g>
      {/* velas rojas cayendo de fondo */}
      <g opacity={0.25}>
        {Array.from({ length: 13 }).map((_, i) => {
          const h = 60 + rnd(i + 40) * 120;
          const y = 820 + i * 26 - h + Math.sin(T * 0.05 + i) * 6;
          return (
            <g key={i}>
              <path d={`M${80 + i * 72} ${y - 20} V${y + h + 20}`} stroke="#ff4d6a" strokeWidth={4} />
              <rect x={62 + i * 72} y={y} width={36} height={h} fill={rnd(i + 2) > 0.8 ? '#3dff9a' : '#ff4d6a'} />
            </g>
          );
        })}
      </g>
      <Particles T={T} n={26} color="#ff9aa8" seed={77} speed={-0.5} size={3} op={0.4} />
      {/* fase 1: viernes negro */}
      <g opacity={ph1}>
        <g transform={`translate(540 660) scale(${pop(f, viT - 2, 9)}) rotate(${-4 + Math.sin(T * 0.1) * 1.5})`}>
          <rect x={-170} y={-150} width={340} height={300} rx={26} fill="#14151c" stroke={OUT} strokeWidth={7} />
          <rect x={-170} y={-150} width={340} height={80} rx={26} fill="#e3122b" stroke={OUT} strokeWidth={7} />
          <circle cx={-90} cy={-150} r={14} fill="#c9ced8" stroke={OUT} strokeWidth={4} />
          <circle cx={90} cy={-150} r={14} fill="#c9ced8" stroke={OUT} strokeWidth={4} />
          <text x={0} y={-94} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#ffffff" letterSpacing={3}>VIERNES</text>
          <text x={0} y={90} textAnchor="middle" fontFamily={HEAD} fontSize={170} fill="#ffffff">20</text>
        </g>
        <Pill x={540} y={480} text="WALL STREET" s={pop(f, waT - 2, 10)} bg="#ffffff" color={OUT} size={44} />
        <Pill x={540} y={900} text="DUDAS SOBRE LA IA" s={pop(f, inT - 2, 10)} bg="#ff2d55" size={44} rot={-2} />
      </g>
      {/* fase 2: desplome */}
      <g opacity={ph2}>
        <rect x={100} y={470} width={880} height={480} rx={26} fill="rgba(20,3,6,0.78)" stroke="#ff4d6a" strokeWidth={4} />
        <path d={`M${pts[0].x} 930 ${pts.map((p) => `L${p.x} ${p.y}`).join(' ')} L${pts[pts.length - 1].x} 930 Z`} fill="url(#vn-area)" />
        <path d={`M${pts.map((p) => `${p.x} ${p.y}`).join(' L')}`} fill="none" stroke="#ff4d6a" strokeWidth={9} strokeLinejoin="round" />
        <polygon points={`${pts[11].x - 18},${pts[11].y - 10} ${pts[11].x + 18},${pts[11].y - 10} ${pts[11].x},${pts[11].y + 22}`} fill="#ff4d6a" />
        <g transform={`translate(320 560) scale(${pop(f, naT - 2, 10)})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill="#ffb3bd">NASDAQ</text>
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={80} fill="#ffffff" stroke={OUT} strokeWidth={6} paintOrder="stroke" dy={16}>−5,3 %</text>
        </g>
        <g transform={`translate(760 560) scale(${pop(f, nvT - 2, 10)})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill="#ffb3bd">NVIDIA</text>
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={80} fill="#ffffff" stroke={OUT} strokeWidth={6} paintOrder="stroke" dy={16}>≈ −14 %</text>
        </g>
        <Stamp x={540} y={850} text="S&P 500: CORRECCIÓN" s={pop(f, coT - 2, 8)} color="#c4001f" rot={-5} size={54} />
      </g>
      {/* fase 3: Ibex */}
      <g opacity={ph3}>
        <g transform={`translate(540 545) scale(${pop(f, ibT - 4, 12)}) translate(-540 -545)`}>
          <SpainFlag x={440} y={480} w={200} h={130} />
        </g>
        <g transform="translate(540 760)">
          <text x={0} y={-60} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={36} fill="#ffb3bd">IBEX 35</text>
          <text x={6} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={124} fill={OUT} opacity={0.5}>{fmtCount(ib)}</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={HEAD} fontSize={124} fill="#ffffff" stroke={OUT} strokeWidth={9} paintOrder="stroke">{fmtCount(ib)}</text>
        </g>
        <Pill x={330} y={900} text="▼ −1,63 %" s={pop(f, wordAt(seg, 'uno') - 2, 9)} bg="#ff2d55" size={50} />
        <Pill x={760} y={900} text="ADIÓS 19.000" s={pop(f, diT, 9)} bg="#ffffff" color={OUT} size={44} rot={3} />
      </g>
    </svg>
  );
};

/* ===================== EL SUPREMO Y EL VOTO DE LA LEY DE NIETOS ===================== */
export const VotoNietosScene: React.FC<P> = ({ f, T, seg }) => {
  const nuT = wordAt(seg, 'nueve'), elT = wordAt(seg, 'elecciones'), suT = wordAt(seg, 'supremo');
  const siT = wordAt(seg, 'sin'), ciT = wordAt(seg, 'ciento'), leT = wordAt(seg, 'ley');
  const soT = wordAt(seg, 'solo'), acT = wordAt(seg, 'acrediten'), exT = wordAt(seg, 'exiliados'), sgT = wordAt(seg, 'sigueme');
  const ph1 = lerp(f, [suT - 8, suT], [1, 0], null);
  const ph2 = lerp(f, [suT - 6, suT + 2], [0, 1], null) * lerp(f, [soT - 8, soT], [1, 0], null);
  const ph3 = lerp(f, [soT - 6, soT + 2], [0, 1], null);
  const cnt = lerp(f, [ciT - 2, ciT + 34], [0, 163355]);
  const lock = pop(f, siT, 8);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="vo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1838" />
          <stop offset="0.6" stopColor="#3a2244" />
          <stop offset="1" stopColor="#0c0710" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#vo-bg)" />
      {/* fachada del Supremo estilizada */}
      <g opacity={0.35} fill="#5a4470" stroke="#8a74a0" strokeWidth={3}>
        <path d="M120 700 L540 520 L960 700 Z" />
        <rect x={140} y={700} width={800} height={40} />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={170 + i * 100} y={740} width={44} height={330} />)}
        <rect x={110} y={1070} width={860} height={40} />
      </g>
      <Particles T={T} n={24} color="#f0d8ff" seed={83} speed={0.15} size={2.5} op={0.4} />
      {/* fase 1: cuenta atrás */}
      <g opacity={ph1}>
        <g transform={`translate(540 700) scale(${pop(f, nuT - 4, 10)})`}>
          <rect x={-200} y={-170} width={400} height={340} rx={28} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-200} y={-170} width={400} height={90} rx={28} fill="#c60b1e" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-108} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill="#ffffff" letterSpacing={3}>FALTAN</text>
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={200} fill={OUT}>9</text>
          <text x={0} y={140} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={36} fill="#5a6488">DÍAS</text>
        </g>
        <Pill x={540} y={930} text="ELECCIONES 29-N" s={pop(f, elT - 2, 10)} bg="#ffc400" color={OUT} size={44} />
      </g>
      {/* fase 2: urna cerrada y contador */}
      <g opacity={ph2}>
        <Card x={540} y={500} w={560} h={90} s={pop(f, suT - 2, 10)} bg="#ffffff">
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill={OUT}>TRIBUNAL SUPREMO</text>
        </Card>
        <g transform="translate(270 760)">
          <path d="M-120 -40 L120 -40 L100 150 L-100 150 Z" fill="#dfe8f5" stroke={OUT} strokeWidth={6} opacity={0.9} />
          <rect x={-130} y={-60} width={260} height={30} rx={8} fill="#c9d6ea" stroke={OUT} strokeWidth={6} />
          <rect x={-60} y={-52} width={120} height={12} rx={6} fill={OUT} />
          <g transform={`translate(0 ${-110 + Math.sin(T * 0.15) * 6})`} opacity={1 - lock}>
            <rect x={-46} y={-60} width={92} height={110} rx={6} fill="#ffffff" stroke={OUT} strokeWidth={4} />
            <path d="M-26 -10 L-6 12 L28 -30" stroke="#2fbf71" strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
          <g transform={`translate(0 40) scale(${lock})`}>
            <path d="M-36 -20 V-46 Q -36 -80 0 -80 Q 36 -80 36 -46 V-20" fill="none" stroke={OUT} strokeWidth={14} />
            <path d="M-36 -20 V-46 Q -36 -80 0 -80 Q 36 -80 36 -46 V-20" fill="none" stroke="#c9ced8" strokeWidth={7} />
            <rect x={-56} y={-24} width={112} height={90} rx={14} fill="#ffcf4a" stroke={OUT} strokeWidth={6} />
            <circle cx={0} cy={14} r={10} fill={OUT} />
          </g>
          <text x={0} y={190} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ff8aa0" opacity={lock}>SIN VOTO</text>
        </g>
        <g transform="translate(720 740)">
          <text x={6} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={104} fill={OUT} opacity={0.5}>{fmtCount(cnt)}</text>
          <text x={0} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={104} fill="#ffffff" stroke={OUT} strokeWidth={8} paintOrder="stroke">{fmtCount(cnt)}</text>
          <text x={0} y={50} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#f0d8ff">NACIONALIZADOS</text>
          <g opacity={pop(f, leT - 2, 10)}>
            <rect x={-170} y={80} width={340} height={64} rx={32} fill="#ffc400" stroke={OUT} strokeWidth={5} />
            <text x={0} y={124} textAnchor="middle" fontFamily={HEAD} fontSize={38} fill={OUT}>LEY DE NIETOS</text>
          </g>
        </g>
      </g>
      {/* fase 3: excepción */}
      <g opacity={ph3}>
        <Card x={540} y={700} w={760} h={330} s={pop(f, soT - 2, 11)} bg="#ffffff">
          <text x={0} y={-100} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={34} fill="#5a6488">SOLO VOTAN SI ACREDITAN</text>
          <g transform="translate(-250 30)" opacity={pop(f, acT - 2, 10)}>
            <rect x={-70} y={-90} width={140} height={180} rx={8} fill="#f4f6fb" stroke={OUT} strokeWidth={5} />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M-46 ${-56 + i * 30} H46`} stroke="#9aa3b5" strokeWidth={6} strokeLinecap="round" />)}
            <circle cx={30} cy={56} r={24} fill="#c4001f" stroke={OUT} strokeWidth={4} />
          </g>
          <text x={90} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={62} fill={OUT}>DESCENDIENTES</text>
          <text x={90} y={86} textAnchor="middle" fontFamily={HEAD} fontSize={62} fill="#c4001f" opacity={pop(f, exT - 4, 10)}>DE EXILIADOS</text>
        </Card>
        <Pill x={540} y={930} text="SÍGUEME PARA MÁS" s={pop(f, sgT, 9)} bg="#ff2d55" size={44} />
      </g>
    </svg>
  );
};
