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
