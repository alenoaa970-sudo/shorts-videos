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

/* ======================================================================
   BIBLIOTECA 2026-11-22: Irán ataca bases en Baréin, Rutte en Varsovia, campaña (banca y okupas), protestas en Francia
   ====================================================================== */
export const IranFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h / 3} fill="#239f40" />
    <rect x={x} y={y + h / 3} width={w} height={h / 3} fill="#ffffff" />
    <rect x={x} y={y + (2 * h) / 3} width={w} height={h / 3} fill="#da0000" />
    <circle cx={x + w / 2} cy={y + h / 2} r={h * 0.11} fill="none" stroke="#da0000" strokeWidth={h * 0.04} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);

export const FranceFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w / 3} height={h} fill="#0055a4" />
    <rect x={x + w / 3} y={y} width={w / 3} height={h} fill="#ffffff" />
    <rect x={x + (2 * w) / 3} y={y} width={w / 3} height={h} fill="#ef4135" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);

const NatoBadge: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 70 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={r} fill="#0b2a6b" stroke={OUT} strokeWidth={7} />
    <circle r={r * 0.83} fill="none" stroke="#ffffff" strokeWidth={4} />
    <polygon points={`0,${-r * 0.68} ${r * 0.14},${-r * 0.14} ${r * 0.68},0 ${r * 0.14},${r * 0.14} 0,${r * 0.68} ${-r * 0.14},${r * 0.14} ${-r * 0.68},0 ${-r * 0.14},${-r * 0.14}`} fill="#ffffff" />
  </g>
);

const Flame: React.FC<{ x: number; y: number; s: number; T: number }> = ({ x, y, s, T }) => {
  const w = Math.sin(T * 0.5) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q -46 -40 -20 -100 Q ${-6 + w} -60 6 -150 Q 40 -90 30 -60 Q 52 -70 46 -100 Q 76 -40 40 0 Z`} fill="#ff5a1f" stroke={OUT} strokeWidth={4} />
      <path d={`M4 -4 Q -20 -30 -6 -70 Q ${8 - w} -46 14 -90 Q 34 -50 24 -4 Z`} fill="#ffd23f" />
    </g>
  );
};

/* ===================== IRÁN ATACA BASES EN BARÉIN ===================== */
export const BareinScene: React.FC<P> = ({ f, T, seg }) => {
  const irT = wordAt(seg, 'iran'), miT = wordAt(seg, 'misiles'), drT = wordAt(seg, 'drones'), baT = wordAt(seg, 'bases');
  const inT = wordAt(seg, 'incendio'), siT = wordAt(seg, 'sin'), meT = wordAt(seg, 'mientras');
  const orT = wordAt(seg, 'ormuz'), dosT = wordAt(seg, 'dos', 1), coT = wordAt(seg, 'condiciones'), urT = wordAt(seg, 'uranio');
  const ph1 = lerp(f, [meT - 8, meT], [1, 0], null);
  const ph2 = lerp(f, [meT - 6, meT + 4], [0, 1], null);
  const map = pop(f, 0, 14);
  const bases = [{ x: 470, y: 820, n: 'AL RIFA' }, { x: 560, y: 870, n: 'AUALI' }];
  const src = { x: 900, y: 560 };
  const fly = (i: number) => lerp(f, [miT + i * 8, baT + 6 + i * 10], [0, 1], (t) => t);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="br-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1e3a" />
          <stop offset="0.5" stopColor="#0d2f52" />
          <stop offset="1" stopColor="#050b18" />
        </linearGradient>
        <radialGradient id="br-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff9a3a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ff3b1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#br-sea)" />
      {/* olas */}
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${-60 + ((i * 97 + T * 1.2) % 1200)} ${500 + (i * 53) % 480} q 20 -10 40 0 q 20 10 40 0`} fill="none" stroke="#5fb8ff" strokeWidth={3} opacity={0.25} />
      ))}
      <Particles T={T} n={30} color="#cfe3ff" seed={41} speed={0.03} size={2} op={0.4} />
      {/* fase 1: mapa del Golfo */}
      <g opacity={ph1 * map}>
        {/* Irán (arriba derecha) */}
        <path d="M300 470 L520 470 L700 490 L860 520 L1080 540 L1080 700 L960 690 L860 650 L760 610 L640 580 L520 560 L420 530 L330 520 Z" fill="#4a3a2a" stroke="#ffcf8a" strokeWidth={4} />
        {/* Península arábiga (abajo izquierda) */}
        <path d="M0 640 L120 660 L260 700 L360 760 L420 820 L440 900 L500 940 L640 930 L720 900 L780 940 L860 960 L0 960 Z" fill="#5a4a30" stroke="#ffcf8a" strokeWidth={4} />
        {/* Qatar */}
        <path d="M600 930 L620 860 L660 850 L670 920 Z" fill="#5a4a30" stroke="#ffcf8a" strokeWidth={3} />
        {/* Baréin: isla */}
        <path d="M500 800 Q 530 790 545 820 Q 560 870 540 900 Q 505 905 495 860 Z" fill="#7a6440" stroke="#ffffff" strokeWidth={5} />
        <text x={810} y={600} textAnchor="middle" fontFamily={HEAD} fontSize={58} fill="#ffe2b8" letterSpacing={3}>IRÁN</text>
        <IranFlag x={740} y={612} w={120} h={70} />
        <text x={230} y={790} textAnchor="middle" fontFamily={HEAD} fontSize={54} fill="#ffffff" letterSpacing={2} opacity={pop(f, baT + 10, 12)}>BARÉIN</text>
        <path d="M300 800 L480 840" stroke="#ffffff" strokeWidth={4} strokeDasharray="8 8" opacity={pop(f, baT + 10, 12)} />
        <circle cx={src.x} cy={src.y} r={14 + Math.sin(T * 0.3) * 4} fill="#ff3b4e" stroke={OUT} strokeWidth={3} opacity={pop(f, irT - 2, 10)} />
        {/* trayectorias de misiles y drones */}
        {[0, 1, 2, 3].map((i) => {
          const p = fly(i);
          if (p <= 0) return null;
          const b = bases[i % 2];
          const cx = (src.x + b.x) / 2, cy = Math.min(src.y, b.y) - 160 + i * 20;
          const pt = (t: number) => ({ x: (1 - t) * (1 - t) * src.x + 2 * (1 - t) * t * cx + t * t * b.x, y: (1 - t) * (1 - t) * src.y + 2 * (1 - t) * t * cy + t * t * b.y });
          let d = '';
          for (let k = 0; k <= 30 * p; k++) { const q = pt(k / 30); d += `${k ? 'L' : 'M'}${q.x} ${q.y} `; }
          const a = pt(Math.min(p, 0.99)), c2 = pt(Math.min(p + 0.01, 1));
          const ang = (Math.atan2(c2.y - a.y, c2.x - a.x) * 180) / Math.PI;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={i % 2 ? '#ffb347' : '#ff3b4e'} strokeWidth={5} strokeDasharray="14 10" />
              {p < 1 && (i < 2 ? <Missile x={a.x} y={a.y} r={ang} s={0.75} /> : <Drone x={a.x} y={a.y} s={1.3} c="#c9ced8" />)}
            </g>
          );
        })}
        {/* bases de EE. UU. */}
        {bases.map((b, i) => {
          const s = pop(f, baT - 4 + i * 4, 10);
          const hit = f - (baT + 6 + i * 10 + 20);
          return (
            <g key={b.n} transform={`translate(${b.x} ${b.y})`}>
              {hit > 0 && <circle r={30 + (hit % 30) * 3} fill="url(#br-glow)" opacity={1 - (hit % 30) / 30} />}
              <g transform={`scale(${s})`}>
                <circle r={20} fill="#1e5bd8" stroke={OUT} strokeWidth={4} />
                <polygon points={`0,-11 3,-3 11,-3 5,2 7,10 0,5 -7,10 -5,2 -11,-3 -3,-3`} fill="#ffffff" />
              </g>
            </g>
          );
        })}
        <g transform={`translate(250 520) scale(${pop(f, baT - 2, 10)})`}>
          <rect x={-150} y={-46} width={300} height={92} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <USFlag x={-130} y={-28} w={80} h={56} />
          <text x={40} y={-4} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>2 BASES</text>
          <text x={40} y={32} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">DE EE. UU.</text>
        </g>
        <Pill x={250} y={640} text="MISILES + DRONES" s={pop(f, drT, 10)} bg="#ff3b4e" size={36} />
        {/* fábrica en llamas */}
        <g transform={`translate(860 820) scale(${pop(f, inT - 4, 10)})`}>
          <rect x={-90} y={-40} width={180} height={90} fill="#3a3f52" stroke={OUT} strokeWidth={5} />
          <path d="M-90 -40 L-60 -70 L-30 -40 L0 -70 L30 -40 L60 -70 L90 -40" fill="#4a5068" stroke={OUT} strokeWidth={5} />
          <rect x={50} y={-120} width={26} height={80} fill="#4a5068" stroke={OUT} strokeWidth={4} />
          {[0, 1, 2].map((i) => <rect key={i} x={-70 + i * 50} y={-10} width={30} height={26} fill="#ffb347" opacity={0.8} />)}
          <Flame x={-30} y={-48} s={0.7} T={T} />
          <Flame x={30} y={-52} s={0.55} T={T + 7} />
          {[0, 1, 2].map((i) => {
            const g = (T * 0.8 + i * 30) % 90;
            return <circle key={i} cx={63 + Math.sin(g * 0.1) * 10} cy={-130 - g * 1.4} r={14 + g * 0.3} fill="#9aa3b5" opacity={0.5 * (1 - g / 90)} />;
          })}
          <text x={0} y={86} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#ffffff" stroke={OUT} strokeWidth={5} paintOrder="stroke">FÁBRICA</text>
        </g>
        <Pill x={860} y={940} text="SIN HERIDOS" s={pop(f, siT, 10)} bg="#2fbf71" size={36} />
      </g>
      {/* fase 2: estrecho de Ormuz */}
      <g opacity={ph2}>
        <path d="M0 470 L380 470 Q 520 520 600 600 Q 680 660 1080 640 L1080 470 Z" fill="#4a3a2a" stroke="#ffcf8a" strokeWidth={4} />
        <path d="M0 960 L0 780 Q 300 760 480 720 Q 560 700 620 760 Q 700 830 1080 860 L1080 960 Z" fill="#5a4a30" stroke="#ffcf8a" strokeWidth={4} />
        <text x={200} y={540} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill="#ffe2b8" letterSpacing={2}>IRÁN</text>
        <text x={880} y={920} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffe2b8" letterSpacing={2}>OMÁN</text>
        <text x={360} y={605} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#ffffff" stroke={OUT} strokeWidth={5} paintOrder="stroke" opacity={pop(f, orT - 6, 12)}>ESTRECHO DE ORMUZ</text>
        {/* barrera que se abre */}
        {(() => {
          const open = lerp(f, [dosT, dosT + 24], [0, 1]) * (f < coT ? 1 : 0.35 + 0.15 * Math.sin(T * 0.2));
          return (
            <g transform="translate(560 700)">
              <rect x={-12} y={-90 - open * 60} width={24} height={90} fill="#ff3b4e" stroke={OUT} strokeWidth={4} />
              <rect x={-12} y={10 + open * 60} width={24} height={90} fill="#ff3b4e" stroke={OUT} strokeWidth={4} />
              <path d={`M-12 ${-40 - open * 60} H12 M-12 ${50 + open * 60} H12`} stroke="#ffffff" strokeWidth={8} />
              {/* petrolero */}
              <g transform={`translate(${-260 + open * 220} 0)`}>
                <path d="M-90 -14 L90 -14 L72 18 L-80 18 Z" fill="#c4001f" stroke={OUT} strokeWidth={4} />
                <rect x={40} y={-40} width={36} height={26} fill="#f4f6fb" stroke={OUT} strokeWidth={3} />
                <rect x={-70} y={-24} width={100} height={10} fill="#3a3f52" />
              </g>
            </g>
          );
        })()}
        <Card x={830} y={560} w={300} h={130} s={pop(f, dosT - 2, 11)} bg="#ffffff">
          <text x={0} y={-14} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">REABRIR EN</text>
          <text x={0} y={44} textAnchor="middle" fontFamily={HEAD} fontSize={66} fill="#1e5bd8">2 DÍAS</text>
        </Card>
        <Pill x={300} y={860} text="SI EE. UU. CEDE" s={pop(f, coT - 4, 10)} bg="#ffc400" color={OUT} size={38} />
        {/* bidón de uranio con candado */}
        <g transform={`translate(830 770) scale(${pop(f, urT - 4, 10)})`}>
          <rect x={-56} y={-70} width={112} height={140} rx={14} fill="#ffd23f" stroke={OUT} strokeWidth={6} />
          <path d="M-56 -30 H56 M-56 30 H56" stroke={OUT} strokeWidth={5} />
          <circle r={22} fill={OUT} />
          {[0, 1, 2].map((i) => <path key={i} d="M0 0 L-12 -20 A24 24 0 0 1 12 -20 Z" fill="#ffd23f" transform={`rotate(${i * 120})`} />)}
          <g transform="translate(60 40)">
            <path d="M-18 -10 V-26 Q -18 -46 0 -46 Q 18 -46 18 -26 V-10" fill="none" stroke={OUT} strokeWidth={9} />
            <rect x={-28} y={-12} width={56} height={44} rx={8} fill="#c9ced8" stroke={OUT} strokeWidth={5} />
          </g>
        </g>
        <Pill x={830} y={890} text="URANIO: NO SALE" s={pop(f, urT + 6, 10)} bg="#ffffff" color={OUT} size={34} />
      </g>
    </svg>
  );
};

/* ===================== RUTTE EN VARSOVIA ===================== */
export const RutteScene: React.FC<P> = ({ f, T, seg }) => {
  const caT = wordAt(seg, 'caida'), otT = wordAt(seg, 'otan'), maT = wordAt(seg, 'mark'), vaT = wordAt(seg, 'varsovia');
  const deT = wordAt(seg, 'defendera'), paT = wordAt(seg, 'palmo'), peT = wordAt(seg, 'peligroso'), tuT = wordAt(seg, 'tusk'), prT = wordAt(seg, 'provocacion');
  const ph1 = lerp(f, [peT - 8, peT], [1, 0], null);
  const ph2 = lerp(f, [peT - 6, peT + 4], [0, 1], null);
  const shield = pop(f, deT - 2, 12);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ru-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1636" />
          <stop offset="0.6" stopColor="#1a2a5a" />
          <stop offset="1" stopColor="#04070f" />
        </linearGradient>
        <radialGradient id="ru-shield" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#6fb6ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1e5bd8" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ru-sky)" />
      <Particles T={T} n={40} color="#ffffff" seed={77} speed={0.01} size={2} op={0.5} />
      {/* skyline de Varsovia: Palacio de la Cultura */}
      <g transform="translate(0 820)" opacity={0.95}>
        <path d="M0 140 L0 70 L90 70 L90 30 L160 30 L160 90 L240 90 L240 50 L300 50 L300 140 Z" fill="#0b1124" />
        <g transform="translate(540 0)">
          <path d="M-110 140 L-110 40 L-70 40 L-70 -20 L-40 -20 L-40 -110 L-20 -110 L-20 -170 L0 -230 L20 -170 L20 -110 L40 -110 L40 -20 L70 -20 L70 40 L110 40 L110 140 Z" fill="#0b1124" />
          {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-30 + (i % 4) * 16} y={-90 + Math.floor(i / 4) * 24} width={8} height={12} fill="#ffd77a" opacity={rnd(i + 3) > 0.4 ? 0.8 : 0.15} />)}
        </g>
        <path d="M680 140 L680 60 L760 60 L760 20 L830 20 L830 80 L920 80 L920 40 L1080 40 L1080 140 Z" fill="#0b1124" />
      </g>
      {/* fase 1: mapa con escudo */}
      <g opacity={ph1}>
        <g opacity={pop(f, 0, 14)}>
          <path d="M150 520 L330 490 L520 480 L700 510 L760 580 L740 680 L770 780 L720 880 L560 910 L380 900 L230 920 L130 880 L110 760 L100 620 Z" fill="#2a3556" stroke="#ff8aa0" strokeWidth={5} />
          <text x={440} y={620} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill="#ffd0d8" letterSpacing={3}>POLONIA</text>
          <PolandFlag x={370} y={640} w={140} h={88} />
          {[{ x: 640, y: 820 }, { x: 590, y: 860 }, { x: 690, y: 760 }].map((h, i) => (
            <g key={i} transform={`translate(${h.x} ${h.y}) scale(${pop(f, caT + i * 5, 10)})`}>
              <circle r={14 + ((f + i * 8) % 24) * 1.6} fill="none" stroke="#ff3b4e" strokeWidth={4} opacity={1 - ((f + i * 8) % 24) / 24} />
              <circle r={12} fill="#ff3b4e" stroke={OUT} strokeWidth={3} />
            </g>
          ))}
          <Pill x={300} y={800} text="2 MISILES + 1 DRON" s={pop(f, caT + 6, 10) * lerp(f, [otT - 4, otT + 4], [1, 0], null)} bg="#ffffff" color={OUT} size={34} />
          <g transform="translate(190 555)" opacity={pop(f, vaT - 2, 10)}>
            <circle r={10} fill="#ffffff" stroke={OUT} strokeWidth={3} />
            <text x={18} y={-14} fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ffffff">VARSOVIA</text>
          </g>
        </g>
        {/* escudo OTAN que cubre Polonia */}
        <g opacity={shield}>
          <path d="M440 470 Q 640 500 800 560 Q 820 780 440 950 Q 60 780 80 560 Q 240 500 440 470 Z" fill="url(#ru-shield)" stroke="#9fd0ff" strokeWidth={8} transform={`translate(440 700) scale(${0.6 + 0.4 * shield}) translate(-440 -700)`} />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + T * 0.02;
            return <circle key={i} cx={440 + Math.cos(a) * 330} cy={700 + Math.sin(a) * 200} r={6} fill="#cfe7ff" opacity={0.8} />;
          })}
        </g>
        <NatoBadge x={880} y={590} s={pop(f, otT - 4, 10)} r={80} />
        <g transform={`translate(880 720) scale(${pop(f, maT - 2, 10)})`}>
          <rect x={-120} y={-34} width={240} height={68} rx={14} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={0} y={-4} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={20} fill="#5a6488">SECRETARIO GENERAL</text>
          <text x={0} y={26} textAnchor="middle" fontFamily={HEAD} fontSize={32} fill={OUT}>MARK RUTTE</text>
        </g>
        <BigText x={540} y={920} text="«CADA PALMO»" s={pop(f, paT - 2, 9)} size={84} fill="#9fd0ff" />
      </g>
      {/* fase 2: dos atriles con citas */}
      <g opacity={ph2}>
        {[{ x: 300, n: 'RUTTE', q: '«PELIGROSO»', t: peT, flag: 'nato' }, { x: 780, n: 'TUSK', q: '«PROVOCACIÓN»', t: prT, flag: 'pl' }].map((a, i) => {
          const s = pop(f, (i ? tuT : peT) - 6, 11);
          return (
            <g key={a.n} transform={`translate(${a.x} 760) scale(${s})`}>
              <path d="M-110 0 L110 0 L84 190 L-84 190 Z" fill="#1d2440" stroke={OUT} strokeWidth={6} />
              <rect x={-130} y={-30} width={260} height={40} rx={10} fill="#2b3560" stroke={OUT} strokeWidth={6} />
              <rect x={-90} y={40} width={180} height={56} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={4} />
              <text x={0} y={82} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>{a.n}</text>
              {a.flag === 'nato' ? <NatoBadge x={0} y={140} s={1} r={30} /> : <PolandFlag x={-36} y={118} w={72} h={44} />}
              <path d="M-10 -30 L-24 -110" stroke="#9aa3b5" strokeWidth={6} />
              <circle cx={-26} cy={-116} r={12} fill="#3a3f52" stroke={OUT} strokeWidth={3} />
            </g>
          );
        })}
        <Stamp x={300} y={560} text="«PELIGROSO»" s={pop(f, peT, 8)} color="#c4001f" rot={-6} size={44} />
        <Stamp x={780} y={560} text="«PROVOCACIÓN»" s={pop(f, prT, 8)} color="#c4001f" rot={5} size={44} />
      </g>
    </svg>
  );
};

/* ===================== CAMPAÑA: BANCA Y OKUPAS ===================== */
const fmtNum = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const CampanaScene: React.FC<P> = ({ f, T, seg }) => {
  const ocT = wordAt(seg, 'ocho'), elT = wordAt(seg, 'elecciones'), saT = wordAt(seg, 'sanchez'), imT = wordAt(seg, 'impuesto');
  const baT = wordAt(seg, 'banca'), veT = wordAt(seg, 'veintisiete'), cuT = wordAt(seg, 'cuatrocientos'), viT = wordAt(seg, 'vivienda');
  const feT = wordAt(seg, 'feijoo'), doT = wordAt(seg, 'doce'), vaT = wordAt(seg, 'valencia'), deT = wordAt(seg, 'desalojar'), okT = wordAt(seg, 'okupas'), cuaT = wordAt(seg, 'cuarenta');
  const ph0 = lerp(f, [saT - 6, saT + 2], [1, 0], null);
  const ph1 = lerp(f, [saT - 4, saT + 4], [0, 1], null) * lerp(f, [feT - 8, feT], [1, 0], null);
  const ph2 = lerp(f, [feT - 6, feT + 2], [0, 1], null);
  const money = lerp(f, [cuT - 6, cuT + 20], [0, 1400]);
  const crowd = lerp(f, [doT - 4, doT + 22], [0, 12000]);
  const Atril: React.FC<{ x: number; y: number; name: string; s: number; c: string }> = ({ x, y, name, s, c }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-100 0 L100 0 L80 170 L-80 170 Z" fill="#1d2440" stroke={OUT} strokeWidth={6} />
      <rect x={-120} y={-28} width={240} height={36} rx={10} fill={c} stroke={OUT} strokeWidth={6} />
      <rect x={-84} y={36} width={168} height={54} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={4} />
      <text x={0} y={76} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={OUT}>{name}</text>
      <path d="M-8 -28 L-20 -100" stroke="#9aa3b5" strokeWidth={6} />
      <circle cx={-22} cy={-106} r={12} fill="#3a3f52" stroke={OUT} strokeWidth={3} />
    </g>
  );
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ca-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0f3a" />
          <stop offset="0.55" stopColor="#1a1f4a" />
          <stop offset="1" stopColor="#060814" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ca-bg)" />
      {/* focos de mitin */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M0 0 L-70 900 L70 900 Z" fill="#ffffff" opacity={0.05 + 0.03 * Math.sin(T * 0.08 + i)} transform={`translate(${140 + i * 270} 380) rotate(${Math.sin(T * 0.04 + i * 1.7) * 16})`} />
      ))}
      {/* confeti suave */}
      <Particles T={T} n={50} color="#ffe14d" seed={13} speed={-0.8} size={3} op={0.35} />
      {/* fase 0: cuenta atrás */}
      <g opacity={ph0}>
        <g transform={`translate(540 700) scale(${pop(f, ocT - 4, 10)})`}>
          <rect x={-160} y={-150} width={320} height={300} rx={28} fill="#ffffff" stroke={OUT} strokeWidth={8} />
          <rect x={-160} y={-150} width={320} height={70} rx={28} fill="#ff2d55" stroke={OUT} strokeWidth={8} />
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={200} fill={OUT}>8</text>
          <text x={0} y={128} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={36} fill="#5a6488">DÍAS</text>
        </g>
        <Pill x={540} y={930} text="ELECCIONES 29-N" s={pop(f, elT - 2, 10)} bg="#ffc400" color={OUT} size={44} />
      </g>
      {/* fase 1: Sánchez y el impuesto a la banca */}
      <g opacity={ph1}>
        <Atril x={200} y={760} name="SÁNCHEZ" s={pop(f, saT - 2, 11)} c="#6a74a8" />
        {/* banco */}
        <g transform={`translate(560 640) scale(${pop(f, baT - 4, 11)})`}>
          <path d="M-130 -40 L0 -110 L130 -40 Z" fill="#dfe6f1" stroke={OUT} strokeWidth={6} />
          <rect x={-130} y={-40} width={260} height={22} fill="#c9d3e6" stroke={OUT} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-110 + i * 62} y={-14} width={34} height={110} fill="#f4f6fb" stroke={OUT} strokeWidth={4} />)}
          <rect x={-140} y={96} width={280} height={24} fill="#c9d3e6" stroke={OUT} strokeWidth={5} />
          <text x={0} y={-56} textAnchor="middle" fontFamily={HEAD} fontSize={28} fill={OUT}>BANCO</text>
        </g>
        <Pill x={560} y={520} text="IMPUESTO HASTA 2027" s={pop(f, veT - 4, 10)} bg="#ffc400" color={OUT} size={34} />
        {/* monedas viajando a las casas */}
        {f > cuT - 6 && Array.from({ length: 8 }).map((_, i) => {
          const p = ((f - cuT + i * 6) % 40) / 40;
          const x = 640 + p * 260, y = 700 + Math.sin(p * Math.PI) * -120 + p * 120;
          return <g key={i} transform={`translate(${x} ${y})`} opacity={Math.sin(p * Math.PI)}><circle r={16} fill="#ffd23f" stroke={OUT} strokeWidth={3} /><text y={7} textAnchor="middle" fontFamily={HEAD} fontSize={20} fill={OUT}>€</text></g>;
        })}
        <g transform={`translate(910 840) scale(${pop(f, viT - 4, 10)})`}>
          {[-50, 40].map((dx, i) => (
            <g key={i} transform={`translate(${dx} ${i * 10})`}>
              <path d="M-50 -10 L0 -60 L50 -10 Z" fill="#ff5a3c" stroke={OUT} strokeWidth={5} />
              <rect x={-40} y={-10} width={80} height={70} fill="#fff3d6" stroke={OUT} strokeWidth={5} />
              <rect x={-12} y={22} width={24} height={38} fill="#8a5a2b" stroke={OUT} strokeWidth={3} />
            </g>
          ))}
        </g>
        <g transform={`translate(560 870) scale(${pop(f, cuT - 4, 10)})`}>
          <rect x={-150} y={-50} width={300} height={100} rx={20} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={60} fill="#1a8a4a">{fmtNum(money)} M€</text>
        </g>
        <Pill x={910} y={950} text="VIVIENDA" s={pop(f, viT, 10)} bg="#2fbf71" size={34} />
      </g>
      {/* fase 2: Feijóo en Valencia */}
      <g opacity={ph2}>
        <Atril x={880} y={760} name="FEIJÓO" s={pop(f, feT - 2, 11)} c="#6a74a8" />
        {/* público */}
        <g opacity={pop(f, doT - 6, 14)}>
          {Array.from({ length: 60 }).map((_, i) => {
            const row = Math.floor(i / 15), col = i % 15;
            const x = 70 + col * 44 + (row % 2) * 20, y = 880 + row * 30;
            const jump = Math.max(0, Math.sin(T * 0.25 + i * 1.3)) * 8;
            return (
              <g key={i} transform={`translate(${x} ${y - jump})`}>
                <circle cy={-30} r={14} fill={['#ffb48a', '#d9926a', '#f2c6a0', '#a8714a'][i % 4]} stroke={OUT} strokeWidth={2} />
                <path d="M-18 0 Q -18 -18 0 -18 Q 18 -18 18 0 L18 20 L-18 20 Z" fill={['#2b3560', '#4a5568', '#3a6a8a', '#6a4a8a'][i % 4]} stroke={OUT} strokeWidth={2} />
              </g>
            );
          })}
        </g>
        <g transform={`translate(330 560) scale(${pop(f, doT - 4, 10)})`}>
          <rect x={-200} y={-60} width={400} height={120} rx={20} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={0} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill={OUT}>{fmtNum(crowd)}</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#5a6488">PERSONAS EN VALENCIA</text>
        </g>
        {/* llave / casa recuperada */}
        <g transform={`translate(330 740) scale(${pop(f, deT - 4, 10)})`}>
          <path d="M-70 -10 L0 -70 L70 -10 Z" fill="#ff5a3c" stroke={OUT} strokeWidth={5} />
          <rect x={-56} y={-10} width={112} height={90} fill="#fff3d6" stroke={OUT} strokeWidth={5} />
          <rect x={-16} y={30} width={32} height={50} fill="#8a5a2b" stroke={OUT} strokeWidth={3} />
          <g transform={`translate(110 10) rotate(${Math.sin(T * 0.2) * 10})`}>
            <circle r={20} fill="none" stroke="#ffd23f" strokeWidth={10} />
            <path d="M20 0 H70 M56 0 V16 M44 0 V12" stroke="#ffd23f" strokeWidth={10} strokeLinecap="round" />
          </g>
        </g>
        <Pill x={330} y={860} text={`OKUPAS: DESALOJO EN 48 H`} s={pop(f, cuaT - 2, 10)} bg="#ffc400" color={OUT} size={34} />
        <Pill x={330} y={860} text="OKUPAS" s={pop(f, okT - 2, 10) * lerp(f, [cuaT - 4, cuaT - 2], [1, 0], null)} bg="#ff2d55" size={34} />
      </g>
    </svg>
  );
};

/* ===================== FRANCIA: SEXTO SÁBADO DE PROTESTAS ===================== */
export const FranciaScene: React.FC<P> = ({ f, T, seg }) => {
  const frT = wordAt(seg, 'francia'), sxT = wordAt(seg, 'sexto'), prT = wordAt(seg, 'protestas'), coT = wordAt(seg, 'coste');
  const seT = wordAt(seg, 'setenta'), poT = wordAt(seg, 'policias'), meT = wordAt(seg, 'menos'), inT = wordAt(seg, 'incidentes'), siT = wordAt(seg, 'sigueme');
  const ph1 = lerp(f, [meT - 8, meT], [1, 0], null);
  const ph2 = lerp(f, [meT - 6, meT + 2], [0, 1], null);
  const cops = lerp(f, [seT - 4, seT + 20], [0, 70000]);
  const siren = Math.floor(T / 6) % 2;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="fr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3a" />
          <stop offset="0.5" stopColor="#3a2a4a" />
          <stop offset="0.75" stopColor="#5a3a3a" />
          <stop offset="1" stopColor="#0a0a14" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#fr-sky)" />
      {/* luces de sirena en el cielo */}
      <rect width={1080} height={1000} fill={siren ? '#1e5bd8' : '#ff2d55'} opacity={f > seT ? 0.07 : 0.02} />
      {/* torre Eiffel */}
      <g transform="translate(860 540)" opacity={0.9}>
        <path d="M0 -60 L-10 0 L-40 200 L-90 420 L-50 420 L-20 300 L20 300 L50 420 L90 420 L40 200 L10 0 Z" fill="#0b0d18" />
        <path d="M-44 190 H44 M-70 320 H70" stroke="#0b0d18" strokeWidth={14} />
        <circle cx={0} cy={-64} r={6} fill="#ffd77a" opacity={0.5 + 0.5 * Math.sin(T * 0.3)} />
      </g>
      {/* edificios haussmannianos */}
      <g transform="translate(0 760)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 190} 0)`}>
            <rect x={0} y={0} width={180} height={220} fill="#1a1c2e" stroke={OUT} strokeWidth={3} />
            <path d="M0 0 L20 -40 L160 -40 L180 0 Z" fill="#2a2e48" stroke={OUT} strokeWidth={3} />
            {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={20 + (k % 3) * 52} y={30 + Math.floor(k / 3) * 80} width={34} height={50} fill="#ffd77a" opacity={rnd(i * 7 + k) > 0.4 ? 0.7 : 0.1} />)}
          </g>
        ))}
      </g>
      {/* fase 1: manifestación y despliegue */}
      <g opacity={ph1}>
        <g opacity={pop(f, frT - 2, 12)}>
          <FranceFlag x={60} y={490} w={150} h={96} />
        </g>
        <g transform={`translate(560 560) scale(${pop(f, sxT - 2, 10)})`}>
          <rect x={-150} y={-70} width={300} height={140} rx={22} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={-60} y={40} textAnchor="middle" fontFamily={HEAD} fontSize={120} fill="#0055a4">6º</text>
          <text x={60} y={-4} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>SÁBADO</text>
          <text x={60} y={40} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ef4135">SEGUIDO</text>
        </g>
        {/* manifestantes con pancartas */}
        <g opacity={pop(f, prT - 4, 14)}>
          {Array.from({ length: 12 }).map((_, i) => {
            const x = 60 + i * 52 + Math.sin(T * 0.05) * 6;
            const y = 930 + (i % 2) * 14;
            const bob = Math.abs(Math.sin(T * 0.22 + i)) * 10;
            return (
              <g key={i} transform={`translate(${x} ${y - bob})`}>
                <circle cy={-34} r={14} fill={['#ffb48a', '#d9926a', '#f2c6a0', '#a8714a'][i % 4]} stroke={OUT} strokeWidth={2} />
                <path d="M-18 0 Q -18 -18 0 -18 Q 18 -18 18 0 L18 24 L-18 24 Z" fill={i % 3 === 0 ? '#ffe14d' : ['#2b3560', '#6a4a8a', '#3a6a8a'][i % 3]} stroke={OUT} strokeWidth={2} />
                {i % 3 === 1 && (
                  <g transform="translate(14 -70)">
                    <path d="M0 0 V50" stroke="#8a5a2b" strokeWidth={5} />
                    <rect x={-34} y={-36} width={68} height={40} fill="#ffffff" stroke={OUT} strokeWidth={3} />
                    <text x={0} y={-8} textAnchor="middle" fontFamily={HEAD} fontSize={20} fill="#ef4135">€€€</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        <Pill x={300} y={700} text="COSTE DE LA VIDA" s={pop(f, coT - 2, 10)} bg="#ef4135" size={38} />
        {/* muro de escudos policiales */}
        <g opacity={pop(f, seT - 4, 12)}>
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`translate(${720 + i * 66} 900)`}>
              <rect x={-28} y={-80} width={56} height={110} rx={8} fill="#bfe6ff" fillOpacity={0.35} stroke="#dff3ff" strokeWidth={4} />
              <text x={0} y={-20} textAnchor="middle" fontFamily={HEAD} fontSize={14} fill="#ffffff">POLICE</text>
              <circle cy={-100} r={20} fill="#1b2a4a" stroke={OUT} strokeWidth={3} />
            </g>
          ))}
        </g>
        <g transform={`translate(800 720) scale(${pop(f, seT - 2, 10)})`}>
          <rect x={-170} y={-60} width={340} height={120} rx={20} fill="#1b2a4a" stroke={OUT} strokeWidth={6} />
          <rect x={-150} y={-74} width={60} height={20} rx={6} fill={siren ? '#2fd8ff' : '#ff3b4e'} stroke={OUT} strokeWidth={3} />
          <rect x={90} y={-74} width={60} height={20} rx={6} fill={siren ? '#ff3b4e' : '#2fd8ff'} stroke={OUT} strokeWidth={3} />
          <text x={0} y={14} textAnchor="middle" fontFamily={HEAD} fontSize={66} fill="#ffffff">{fmtNum(cops)}</text>
          <text x={0} y={48} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#bfe6ff" opacity={pop(f, poT - 2, 10)}>POLICÍAS Y GENDARMES</text>
        </g>
      </g>
      {/* fase 2: menos gente pero incidentes */}
      <g opacity={ph2}>
        <Card x={300} y={680} w={420} h={300} s={pop(f, meT - 2, 11)} bg="#ffffff">
          <text x={0} y={-100} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={28} fill="#5a6488">MANIFESTANTES</text>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const h = [180, 150, 120, 95, 80, 64][i] * lerp(f, [meT + i * 2, meT + 10 + i * 2], [0, 1]);
            return <rect key={i} x={-170 + i * 58} y={110 - h} width={42} height={h} rx={6} fill={i === 5 ? '#ef4135' : '#9aa3b5'} stroke={OUT} strokeWidth={3} />;
          })}
          <path d="M-150 -50 L150 80" stroke="#ef4135" strokeWidth={8} strokeLinecap="round" opacity={pop(f, meT + 14, 10)} />
          <path d="M150 80 L122 52 M150 80 L112 86" stroke="#ef4135" strokeWidth={8} strokeLinecap="round" opacity={pop(f, meT + 14, 10)} />
        </Card>
        {/* contenedor ardiendo con humo y gas */}
        <g transform={`translate(790 820) scale(${pop(f, inT - 4, 10)})`}>
          {[0, 1, 2, 3].map((i) => {
            const g = (T * 0.9 + i * 22) % 88;
            return <circle key={i} cx={Math.sin(g * 0.08 + i) * 30} cy={-80 - g * 1.6} r={24 + g * 0.5} fill="#9aa3b5" opacity={0.5 * (1 - g / 88)} />;
          })}
          <rect x={-80} y={-40} width={160} height={90} rx={8} fill="#2e6b3a" stroke={OUT} strokeWidth={5} />
          <rect x={-86} y={-50} width={172} height={18} rx={6} fill="#24552e" stroke={OUT} strokeWidth={5} />
          <circle cx={-56} cy={58} r={12} fill={OUT} /><circle cx={56} cy={58} r={12} fill={OUT} />
          <Flame x={-30} y={-48} s={0.8} T={T} />
          <Flame x={30} y={-48} s={0.65} T={T + 9} />
        </g>
        <Pill x={790} y={560} text="INCIDENTES" s={pop(f, inT, 10)} bg="#ff8a00" color={OUT} size={44} />
        <Pill x={540} y={940} text="SÍGUEME PARA MÁS" s={pop(f, siT, 9)} bg="#ff2d55" size={44} />
      </g>
    </svg>
  );
};

/* =====================================================================
   RESUMEN SEMANAL 2026-11-22
   ===================================================================== */

/* ---------- 1. TRUMP, XI Y PUTIN, JUNTOS (Shenzhen) ---------- */
const Tower: React.FC<{ x: number; w: number; h: number; c: string; T: number; i: number }> = ({ x, w, h, c, T, i }) => (
  <g>
    <rect x={x} y={960 - h} width={w} height={h} fill="#0b1230" stroke={OUT} strokeWidth={3} />
    <rect x={x} y={960 - h} width={w} height={6} fill={c} opacity={0.9} />
    {Array.from({ length: Math.floor(h / 34) }).map((_, r) =>
      Array.from({ length: Math.max(1, Math.floor(w / 26)) }).map((__, k) => (
        <rect key={`${r}-${k}`} x={x + 6 + k * 26} y={960 - h + 18 + r * 34} width={12} height={16}
          fill={c} opacity={rnd(i * 31 + r * 7 + k) > 0.55 ? 0.25 + 0.5 * Math.abs(Math.sin(T * 0.03 + r + k + i)) : 0.06} />
      ))
    )}
  </g>
);
const Atom: React.FC<{ x: number; y: number; s: number; T: number }> = ({ x, y, s, T }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 60, 120].map((a) => (
      <ellipse key={a} rx={46} ry={16} fill="none" stroke="#2fd8ff" strokeWidth={5} transform={`rotate(${a + T * 0.8})`} />
    ))}
    <circle r={11} fill="#ffd23f" stroke={OUT} strokeWidth={3} />
  </g>
);
const Barrel: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-42} width={60} height={84} rx={10} fill="#1d1f2b" stroke={OUT} strokeWidth={4} />
    <path d="M-30 -16 H30 M-30 16 H30" stroke="#5a5f78" strokeWidth={5} />
    <path d="M0 -14 Q -12 2 0 12 Q 12 2 0 -14 Z" fill="#ffd23f" />
  </g>
);
export const TrioScene: React.FC<P> = ({ f, T, seg }) => {
  const cuT = wordAt(seg, 'cumbre'), shT = wordAt(seg, 'shenzhen'), trT = wordAt(seg, 'trump'), xiT = wordAt(seg, 'shi'), puT = wordAt(seg, 'putin');
  const prT = wordAt(seg, 'primera'), hoT = wordAt(seg, 'hora'), veT = wordAt(seg, 'veinte');
  const deT = wordAt(seg, 'declaracion'), nuT = wordAt(seg, 'nucleares'), peT = wordAt(seg, 'petroleo'), niT = wordAt(seg, 'ningun'), ucT = wordAt(seg, 'ucrania');
  const ph1 = lerp(f, [deT - 8, deT], [1, 0], null);
  const ph2 = lerp(f, [deT - 6, deT + 4], [0, 1], null);
  const seats = [
    { x: 540, y: 600, flag: 'cn', name: 'XI', t: xiT },
    { x: 330, y: 800, flag: 'us', name: 'TRUMP', t: trT },
    { x: 750, y: 800, flag: 'ru', name: 'PUTIN', t: puT },
  ];
  const clock = lerp(f, [hoT - 4, veT + 12], [0, 80]);
  const towers = [[0, 110, 300, '#ff4d9d'], [120, 80, 420, '#2fd8ff'], [210, 120, 260, '#ffd23f'], [345, 70, 470, '#7a6cff'],
    [425, 130, 340, '#ff4d9d'], [570, 90, 500, '#2fd8ff'], [670, 110, 310, '#ffd23f'], [790, 80, 440, '#7a6cff'], [880, 120, 360, '#ff4d9d'], [1010, 70, 280, '#2fd8ff']] as const;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120a2e" /><stop offset="0.5" stopColor="#2a1456" /><stop offset="1" stopColor="#060818" />
        </linearGradient>
        <radialGradient id="tr-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff2c4" stopOpacity="0.55" /><stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tr-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8e6" /><stop offset="1" stopColor="#f1e2bd" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#tr-sky)" />
      <Particles T={T} n={40} color="#ffffff" seed={77} speed={0.02} size={2} op={0.5} />
      {/* skyline de Shenzhen */}
      <g opacity={0.9}>
        {towers.map(([x, w, h, c], i) => <Tower key={i} x={x} w={w} h={h * lerp(f, [i * 2, i * 2 + 14], [0.2, 1])} c={c} T={T} i={i} />)}
        {/* torre Ping An con aguja */}
        <path d={`M560 ${960 - 500} L600 ${960 - 560} L640 ${960 - 500} Z`} fill="#0b1230" stroke="#2fd8ff" strokeWidth={3} />
        <rect x={597} y={960 - 640} width={6} height={80} fill="#2fd8ff" opacity={0.5 + 0.5 * Math.sin(T * 0.2)} />
      </g>
      <rect x={0} y={480} width={1080} height={480} fill="#060818" opacity={0.25 + 0.45 * ph1} />
      <Pill x={230} y={930} text="SHENZHEN · CHINA" s={pop(f, shT - 2, 11) * ph1} bg="#e3122b" size={34} />
      {/* fase 1: mesa a tres */}
      <g opacity={ph1}>
        <circle cx={540} cy={740} r={260} fill="url(#tr-spot)" opacity={pop(f, cuT, 14)} />
        <g transform={`translate(540 740) scale(${pop(f, cuT + 2, 12)})`}>
          <ellipse cx={0} cy={14} rx={170} ry={70} fill="#000" opacity={0.4} />
          <ellipse cx={0} cy={0} rx={170} ry={70} fill="#7a3b1f" stroke={OUT} strokeWidth={6} />
          <ellipse cx={0} cy={-6} rx={150} ry={56} fill="#9a522a" />
          <path d="M-60 -10 Q 0 -30 60 -10" stroke="#e3c08a" strokeWidth={4} fill="none" opacity={0.6} />
          {/* reloj sobre la mesa */}
          <g transform="translate(0 -6)" opacity={f > hoT - 6 ? 1 : 0}>
            <circle r={44} fill="#ffffff" stroke={OUT} strokeWidth={5} />
            <path d={`M0 0 L0 -36 A36 36 0 ${clock > 30 ? 1 : 0} 1 ${36 * Math.sin((clock / 60) * Math.PI * 2)} ${-36 * Math.cos((clock / 60) * Math.PI * 2)} Z`} fill="#ff4d9d" opacity={0.7} />
            <path d={`M0 0 L${30 * Math.sin((clock / 60) * Math.PI * 2)} ${-30 * Math.cos((clock / 60) * Math.PI * 2)}`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
            <circle r={5} fill={OUT} />
          </g>
        </g>
        {seats.map((st) => {
          const s = pop(f, st.t - 3, 10);
          return (
            <g key={st.name} transform={`translate(${st.x} ${st.y}) scale(${s})`}>
              <rect x={-80} y={-20} width={160} height={110} rx={16} fill="#1c1640" stroke={OUT} strokeWidth={6} />
              <rect x={-80} y={-20} width={160} height={14} rx={6} fill="#ffd23f" />
              {st.flag === 'us' && <USFlag x={-55} y={-110} w={110} h={72} />}
              {st.flag === 'cn' && <ChinaFlag x={-55} y={-110} w={110} h={72} />}
              {st.flag === 'ru' && <RussiaFlag x={-55} y={-110} w={110} h={72} />}
              <path d="M-55 -110 L-55 -20" stroke={OUT} strokeWidth={6} />
              <rect x={-70} y={20} width={140} height={50} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={4} />
              <text x={0} y={58} textAnchor="middle" fontFamily={HEAD} fontSize={38} fill={OUT}>{st.name}</text>
            </g>
          );
        })}
        <Stamp x={820} y={600} text="1ª VEZ" s={pop(f, prT, 9)} color="#e3122b" rot={10} size={56} />
        <Pill x={250} y={600} text="1 H 20 MIN" s={pop(f, veT, 10)} bg="#ffffff" color={OUT} size={40} />
      </g>
      {/* fase 2: declaración */}
      <g opacity={ph2}>
        <g transform={`translate(440 700) scale(${pop(f, deT, 12) * 0.92}) rotate(${-2 + Math.sin(T * 0.05)})`}>
          <rect x={-250} y={-200} width={500} height={420} rx={18} fill={OUT} opacity={0.4} transform="translate(10 12)" />
          <rect x={-250} y={-200} width={500} height={420} rx={18} fill="url(#tr-paper)" stroke={OUT} strokeWidth={6} />
          <rect x={-270} y={-215} width={540} height={34} rx={17} fill="#d9c08a" stroke={OUT} strokeWidth={5} />
          <rect x={-270} y={200} width={540} height={34} rx={17} fill="#d9c08a" stroke={OUT} strokeWidth={5} />
          <text x={0} y={-130} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill="#2a1456" letterSpacing={2}>DECLARACIÓN</text>
          <text x={0} y={-82} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill="#e3122b" letterSpacing={2}>DE PAZ</text>
          {/* palomas */}
          <path d="M-200 -110 q 20 -24 40 -6 q 16 -18 30 -2 q -20 10 -40 10 Z" fill="#ffffff" stroke={OUT} strokeWidth={3} />
          <path d="M200 -110 q -20 -24 -40 -6 q -16 -18 -30 -2 q 20 10 40 10 Z" fill="#ffffff" stroke={OUT} strokeWidth={3} />
          {/* puntos */}
          <g opacity={pop(f, nuT - 4, 10)}>
            <Atom x={-150} y={-10} s={0.9} T={T} />
            <text x={-90} y={2} fontFamily={BODY} fontWeight={900} fontSize={29} fill="#2a1456">ARMAS NUCLEARES</text>
          </g>
          <g opacity={pop(f, peT - 4, 10)}>
            <Barrel x={-150} y={80} s={0.9} />
            <text x={-90} y={92} fontFamily={BODY} fontWeight={900} fontSize={34} fill="#2a1456">PETRÓLEO</text>
          </g>
          {/* sellos de firma */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-80 + i * 80} cy={160} r={22} fill={['#1e5bd8', '#e3122b', '#ffffff'][i]} stroke={OUT} strokeWidth={4} opacity={pop(f, deT + 10 + i * 4, 10)} />
          ))}
        </g>
        <g transform={`translate(900 620) scale(${pop(f, ucT - 2, 10)})`}>
          <UkraineFlag x={-80} y={-50} w={160} h={100} />
          <path d="M-90 -60 L90 60 M90 -60 L-90 60" stroke="#e3122b" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
        </g>
        <Pill x={900} y={730} text="SIN PLAN" s={pop(f, niT, 10)} bg="#e3122b" size={38} />
      </g>
    </svg>
  );
};

/* ---------- 2. RUSIA ATACA Y TOCA POLONIA (serio) ---------- */
export const OleadaScene: React.FC<P> = ({ f, T, seg }) => {
  const ruT = wordAt(seg, 'rusia'), ucT = wordAt(seg, 'ucrania'), ciT = wordAt(seg, 'cien'), drT = wordAt(seg, 'drones');
  const ocT = wordAt(seg, 'ocho'), poT = wordAt(seg, 'polonia'), vaT = wordAt(seg, 'varsovia'), prT = wordAt(seg, 'provocacion');
  const mis = lerp(f, [ciT - 6, ciT + 24], [0, 100]);
  const drn = lerp(f, [drT - 20, drT + 14], [0, 400]);
  const zoom = lerp(f, [poT - 10, poT + 14], [0, 1]);
  // Ucrania (derecha) y Polonia (izquierda) muy simplificadas
  const UKR = 'M420 640 L520 600 L640 590 L760 560 L900 580 L1040 620 L1080 700 L1040 790 L940 820 L860 880 L760 900 L700 860 L600 880 L520 840 L440 800 L410 720 Z';
  const POL = 'M60 560 L200 520 L330 540 L420 600 L420 640 L410 720 L440 800 L380 850 L260 860 L150 830 L70 760 L40 660 Z';
  const cities = [{ x: 720, y: 680, n: 'KIEV' }, { x: 470, y: 760, n: 'LEÓPOLIS' }];
  const impacts = [{ x: 720, y: 680 }, { x: 470, y: 760 }, { x: 850, y: 760 }, { x: 600, y: 820 }, { x: 960, y: 680 }, { x: 650, y: 620 }];
  const falls = [{ x: 330, y: 740, k: 'm' }, { x: 360, y: 820, k: 'm' }, { x: 300, y: 660, k: 'd' }];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ol-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070f" /><stop offset="0.55" stopColor="#141a2b" /><stop offset="1" stopColor="#04060c" />
        </linearGradient>
        <radialGradient id="ol-hit" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.95" /><stop offset="1" stopColor="#ff3b1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ol-sky)" />
      <Particles T={T} n={24} color="#ffb38a" seed={9} speed={0.4} size={2.5} op={0.35} />
      <g transform={`translate(${zoom * 160} 0)`}>
        <path d={POL} fill={zoom > 0.1 ? '#4a1f2a' : '#2a2f40'} stroke={zoom > 0.1 ? '#ff6a7a' : '#6a7392'} strokeWidth={4} opacity={0.95} />
        <path d={UKR} fill="#22324f" stroke="#ffd700" strokeWidth={4} opacity={pop(f, ucT - 4, 14)} />
        <text x={820} y={640} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffd700" letterSpacing={3} opacity={pop(f, ucT, 12) * (1 - zoom)}>UCRANIA</text>
        <text x={210} y={630} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffffff" letterSpacing={3} opacity={0.5 + zoom * 0.5}>POLONIA</text>
        {cities.map((c) => (
          <g key={c.n} transform={`translate(${c.x} ${c.y})`}>
            <circle r={9} fill="#ffffff" stroke={OUT} strokeWidth={3} />
            <text y={-18} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={22} fill="#ffffff" stroke={OUT} strokeWidth={4} paintOrder="stroke">{c.n}</text>
          </g>
        ))}
        {/* oleadas desde el este */}
        {Array.from({ length: 10 }).map((_, i) => {
          const st = ruT + i * 9;
          const p = lerp(f, [st, st + 36], [0, 1], (t) => t);
          if (p <= 0 || p >= 1) return null;
          const tg = impacts[i % impacts.length];
          const x = 1120 + (tg.x - 1120) * p, y = 500 + i * 6 + (tg.y - 500 - i * 6) * p - Math.sin(p * Math.PI) * 60;
          const ang = (Math.atan2(tg.y - 500, tg.x - 1120) * 180) / Math.PI;
          return i % 3 === 2 ? <Drone key={i} x={x} y={y} s={1.2} c="#c9ced8" /> : <Missile key={i} x={x} y={y} r={ang} s={0.6} />;
        })}
        {impacts.map((im, i) => {
          const h = f - (ruT + i * 9 + 36);
          if (h < 0) return null;
          return (
            <g key={i} transform={`translate(${im.x} ${im.y})`}>
              <circle r={26 + (h % 40) * 1.5} fill="url(#ol-hit)" opacity={0.85 - (h % 40) / 60} />
              <circle r={6} fill="#ff3b1a" />
            </g>
          );
        })}
        {/* caídas en Polonia */}
        {falls.map((fl, i) => {
          const st = poT - 6 + i * 6;
          const p = lerp(f, [st, st + 18], [0, 1], (t) => t * t);
          if (p <= 0) return null;
          const x = fl.x + 300 * (1 - p), y = fl.y - 220 * (1 - p);
          return (
            <g key={i}>
              {p < 1 ? (fl.k === 'm' ? <Missile x={x} y={y} r={150} s={0.7} /> : <Drone x={x} y={y} s={1.5} c="#ffffff" />) : (
                <g transform={`translate(${fl.x} ${fl.y})`}>
                  <circle r={18 + Math.sin(T * 0.3 + i) * 5} fill="none" stroke="#ff3b4e" strokeWidth={5} />
                  <circle r={7} fill="#ff3b4e" />
                </g>
              )}
            </g>
          );
        })}
      </g>
      {/* contadores */}
      <g transform={`translate(230 520) scale(${pop(f, ciT - 6, 11) * (1 - zoom)})`}>
        <rect x={-180} y={-50} width={360} height={100} rx={20} fill="#0b0f1c" stroke="#ff3b4e" strokeWidth={5} />
        <text x={-20} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffffff">{fmtCount(mis)}</text>
        <text x={100} y={18} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ff9aa6">MISILES</text>
        <text x={-130} y={20} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#ff9aa6">≈</text>
      </g>
      <g transform={`translate(850 520) scale(${pop(f, drT - 18, 11) * (1 - zoom)})`}>
        <rect x={-180} y={-50} width={360} height={100} rx={20} fill="#0b0f1c" stroke="#ffb347" strokeWidth={5} />
        <text x={-30} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffffff">+{fmtCount(drn)}</text>
        <text x={100} y={18} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ffd2a0">DRONES</text>
      </g>
      <g transform={`translate(780 905) scale(${pop(f, ocT - 2, 12) * (1 - zoom)})`}>
        <rect x={-200} y={-42} width={400} height={84} rx={14} fill="#1a1d26" stroke="#c9ced8" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffffff" letterSpacing={2}>AL MENOS 8 MUERTOS</text>
      </g>
      {/* fase Polonia */}
      <g opacity={zoom}>
        <g transform={`translate(860 560) scale(${pop(f, poT, 11)})`}>
          <rect x={-160} y={-60} width={320} height={120} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <PolandFlag x={-140} y={-38} w={100} h={64} />
          <text x={50} y={-6} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill={OUT}>2 MISILES</text>
          <text x={50} y={38} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#dc143c">+ 1 DRON</text>
        </g>
        <Pill x={780} y={900} text="«PROVOCACIÓN»" s={pop(f, prT - 2, 10)} bg="#dc143c" size={44} />
        <text x={780} y={800} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#ffffff" opacity={pop(f, vaT, 12)}>VARSOVIA:</text>
      </g>
    </svg>
  );
};

/* ---------- 3. VIERNES NEGRO EN WALL STREET ---------- */
export const DesplomeScene: React.FC<P> = ({ f, T, seg }) => {
  const viT = wordAt(seg, 'viernes'), inT = wordAt(seg, 'inteligencia'), naT = wordAt(seg, 'nasdaq'), nvT = wordAt(seg, 'nvidia');
  const caT = wordAt(seg, 'catorce'), spT = wordAt(seg, 'and') - 4, coT = wordAt(seg, 'correccion'), baT = wordAt(seg, 'bateria');
  const fall = lerp(f, [viT, coT + 10], [0, 1], (t) => t);
  const candles = Array.from({ length: 16 }).map((_, i) => {
    const base = 560 + i * 22 + Math.sin(i * 1.7) * 18;
    return { x: 90 + i * 56, o: base - 10, c: base + 26 + rnd(i) * 20 };
  });
  const shown = Math.floor(fall * 16);
  const batt = lerp(f, [baT - 2, baT + 26], [1, 0.12]);
  const shake = f > viT && f < viT + 10 ? Math.sin(f * 3) * 6 : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ds-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0508" /><stop offset="0.5" stopColor="#2a0a10" /><stop offset="1" stopColor="#080204" />
        </linearGradient>
        <linearGradient id="ds-scr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0f1c" /><stop offset="1" stopColor="#140a12" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ds-bg)" />
      {/* columnas de Wall Street al fondo */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} opacity={0.18}>
          <rect x={60 + i * 175} y={470} width={70} height={500} fill="#ffffff" />
          <rect x={45 + i * 175} y={460} width={100} height={20} fill="#ffffff" />
        </g>
      ))}
      <Particles T={T} n={20} color="#ff3b4e" seed={5} speed={-0.6} size={3} op={0.4} />
      {/* pantalla con velas */}
      <g transform={`translate(${shake} 0)`}>
        <rect x={50} y={480} width={980} height={360} rx={22} fill="url(#ds-scr)" stroke={OUT} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M70 ${540 + i * 80} H1010`} stroke="#2a3150" strokeWidth={2} />)}
        {candles.slice(0, shown).map((c, i) => (
          <g key={i}>
            <path d={`M${c.x} ${c.o - 18} V${c.c + 16}`} stroke="#ff6a7a" strokeWidth={3} />
            <rect x={c.x - 16} y={c.o} width={32} height={c.c - c.o} fill="#ff2d55" stroke={OUT} strokeWidth={2} />
          </g>
        ))}
        {shown > 1 && (
          <path d={`M${candles[0].x} ${candles[0].o} ${candles.slice(1, shown).map((c) => `L${c.x} ${c.c}`).join(' ')}`} fill="none" stroke="#ffd23f" strokeWidth={4} strokeDasharray="10 6" />
        )}
        <text x={80} y={525} fontFamily={BODY} fontWeight={900} fontSize={24} fill="#8a93b8">20 NOV · CIERRE</text>
        <g transform={`translate(860 525) scale(${pop(f, inT - 2, 10)})`}>
          <rect x={-120} y={-24} width={240} height={44} rx={22} fill="#7a6cff" stroke={OUT} strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ffffff">DUDAS SOBRE LA IA</text>
        </g>
      </g>
      {/* tickers */}
      {[
        { n: 'NASDAQ', v: '-5,3 %', t: naT, x: 200 },
        { n: 'NVIDIA', v: '-14 %', t: caT - 4, x: 540 },
        { n: 'S&P 500', v: '-3,7 %', t: spT, x: 880 },
      ].map((k) => {
        const s = pop(f, k.t - 2, 10);
        return (
          <g key={k.n} transform={`translate(${k.x} ${905}) scale(${s})`}>
            <rect x={-150} y={-52} width={300} height={104} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
            <text x={0} y={-14} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#5a6488">{k.n}</text>
            <text x={-10} y={38} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#e3122b">{k.v}</text>
            <path d="M100 14 L126 14 L113 36 Z" fill="#e3122b" />
          </g>
        );
      })}
      <Stamp x={540} y={680} text="CORRECCIÓN" s={pop(f, coT, 9)} color="#e3122b" rot={-7} size={70} />
      {/* batería del robot */}
      <g transform={`translate(900 620) scale(${pop(f, baT - 2, 10)})`} opacity={f > baT - 2 ? 1 : 0}>
        <rect x={-70} y={-36} width={140} height={72} rx={12} fill="#0b0f1c" stroke="#ffffff" strokeWidth={6} />
        <rect x={70} y={-14} width={14} height={28} rx={4} fill="#ffffff" />
        <rect x={-60} y={-26} width={120 * batt} height={52} rx={6} fill={batt > 0.4 ? '#2fbf71' : '#ff3b4e'} />
        <text x={0} y={70} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ffffff">{Math.round(batt * 100)} %</text>
      </g>
    </svg>
  );
};

/* ---------- 4. ELECCIONES EL 29 DE NOVIEMBRE ---------- */
export const UrnasScene: React.FC<P> = ({ f, T, seg }) => {
  const ulT = wordAt(seg, 'ultima'), doT = wordAt(seg, 'domingo'), veT = wordAt(seg, 'veintinueve'), elT = wordAt(seg, 'elecciones');
  const caT = wordAt(seg, 'cara'), saT = wordAt(seg, 'sanchez'), feT = wordAt(seg, 'feijoo'), soT = wordAt(seg, 'sondeos'), ppT = wordAt(seg, 'pp');
  const ph1 = lerp(f, [caT - 8, caT], [1, 0], null);
  const ph2 = lerp(f, [caT - 6, caT + 4], [0, 1], null);
  const ph3 = lerp(f, [soT - 6, soT + 4], [0, 1], null);
  // cuenta atrás de días en el calendario
  const day = Math.round(lerp(f, [ulT, veT], [22, 29]));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ur-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1b4a" /><stop offset="0.6" stopColor="#1c2f78" /><stop offset="1" stopColor="#070d26" />
        </linearGradient>
        <linearGradient id="ur-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dff3ff" stopOpacity="0.55" /><stop offset="1" stopColor="#9fd4ff" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ur-bg)" />
      {/* rayos de foco */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M540 440 L${120 + i * 210 + Math.sin(T * 0.03 + i) * 30} 980 L${200 + i * 210 + Math.sin(T * 0.03 + i) * 30} 980 Z`} fill="#ffffff" opacity={0.04} />
      ))}
      <Particles T={T} n={30} color="#ffd23f" seed={123} speed={0.15} size={2.5} op={0.45} />
      {/* fase 1: urna + calendario */}
      <g opacity={ph1}>
        {/* calendario */}
        <g transform={`translate(290 720) scale(${pop(f, ulT, 12)}) rotate(-5)`}>
          <rect x={-150} y={-170} width={300} height={330} rx={22} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-150} y={-170} width={300} height={86} rx={22} fill="#e3122b" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-112} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#ffffff" letterSpacing={4}>NOVIEMBRE</text>
          {[-80, 80].map((x) => <rect key={x} x={x - 10} y={-196} width={20} height={50} rx={8} fill="#c9ced8" stroke={OUT} strokeWidth={4} />)}
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={180} fill={day === 29 ? '#e3122b' : OUT}>{day}</text>
          <text x={0} y={128} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">{day === 29 ? 'DOMINGO' : ''}</text>
          {day === 29 && <circle cx={0} cy={10} r={120} fill="none" stroke="#e3122b" strokeWidth={8} strokeDasharray="20 10" transform={`rotate(${T})`} />}
        </g>
        {/* urna transparente */}
        <g transform={`translate(780 760) scale(${pop(f, doT - 4, 12)})`}>
          <ellipse cx={0} cy={180} rx={190} ry={26} fill="#000" opacity={0.35} />
          <rect x={-170} y={-120} width={340} height={300} rx={20} fill="url(#ur-glass)" stroke="#ffffff" strokeWidth={7} />
          <rect x={-180} y={-150} width={360} height={46} rx={14} fill="#1e5bd8" stroke={OUT} strokeWidth={6} />
          <rect x={-70} y={-136} width={140} height={14} rx={7} fill={OUT} />
          {/* sobres dentro */}
          {Array.from({ length: Math.floor(lerp(f, [doT, elT + 20], [0, 9])) }).map((_, i) => (
            <rect key={i} x={-140 + (i % 3) * 95 + rnd(i) * 10} y={130 - Math.floor(i / 3) * 52} width={90} height={56} rx={6} fill={['#ffffff', '#f4e2b0', '#d9e6ff'][i % 3]} stroke={OUT} strokeWidth={3} transform={`rotate(${(rnd(i + 4) - 0.5) * 20} 0 0)`} />
          ))}
          {/* sobre cayendo */}
          {(() => {
            const k = (f - doT) % 22;
            if (f < doT || f > elT + 30) return null;
            return (
              <g transform={`translate(0 ${-260 + k * 8})`} opacity={k < 16 ? 1 : 0}>
                <rect x={-50} y={-32} width={100} height={64} rx={6} fill="#ffffff" stroke={OUT} strokeWidth={4} />
                <path d="M-50 -32 L0 6 L50 -32" fill="none" stroke={OUT} strokeWidth={4} />
              </g>
            );
          })()}
          <SpainFlag x={-60} y={10} w={120} h={76} />
        </g>
        <Pill x={780} y={530} text="GENERALES" s={pop(f, elT, 10)} bg="#ffd23f" color={OUT} size={44} />
      </g>
      {/* fase 2: cara a cara */}
      <g opacity={ph2 * (1 - ph3)}>
        <Podium x={300} name="SÁNCHEZ" s={pop(f, saT - 3, 10)} T={T} side={1} />
        <Podium x={780} name="FEIJÓO" s={pop(f, feT - 3, 10)} T={T} side={-1} />
        <g transform={`translate(540 660) scale(${pop(f, caT, 8)}) rotate(${Math.sin(T * 0.2) * 4})`}>
          <circle r={70} fill="#ffd23f" stroke={OUT} strokeWidth={7} />
          <text y={24} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill={OUT}>VS</text>
        </g>
        <Pill x={540} y={530} text="ÚNICO CARA A CARA" s={pop(f, caT + 4, 10)} bg="#ff2d55" size={40} />
      </g>
      {/* fase 3: sondeos */}
      <g opacity={ph3}>
        {/* hemiciclo de 350 escaños, neutral */}
        <g transform="translate(540 945) scale(0.85)">
          {Array.from({ length: 350 }).map((_, i) => {
            const row = i % 7, k = Math.floor(i / 7);
            const a = Math.PI - (k / 49) * Math.PI;
            const r = 190 + row * 34;
            const on = f - (soT + k * 0.5) > 0;
            return <circle key={i} cx={Math.cos(a) * r} cy={-Math.sin(a) * r} r={on ? 11 : 0} fill="#c9d3ef" stroke={OUT} strokeWidth={2} />;
          })}
          <text y={-40} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#ffffff">350</text>
          <text y={6} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#c9d3ef">ESCAÑOS</text>
        </g>
        <g transform={`translate(540 560) scale(${pop(f, Math.min(ppT - 6, soT + 4), 10)})`}>
          <rect x={-300} y={-54} width={600} height={108} rx={20} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={-60} y={-8} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#5a6488">CASI TODOS LOS SONDEOS</text>
          <text x={-60} y={38} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#1e5bd8">DAN GANADOR AL PP</text>
          <g transform="translate(230 0)">
            <rect x={-46} y={-40} width={92} height={80} rx={10} fill="#f4f6fb" stroke={OUT} strokeWidth={4} />
            {[0, 1, 2].map((i) => <rect key={i} x={-34 + i * 26} y={30 - (20 + i * 14)} width={18} height={20 + i * 14} fill="#7a86a8" />)}
          </g>
        </g>
      </g>
    </svg>
  );
};

/* ---------- 5. IRÁN ATACA BASES EN BARÉIN (serio, radar) ---------- */
export const GolfoScene: React.FC<P> = ({ f, T, seg }) => {
  const goT = wordAt(seg, 'golfo'), irT = wordAt(seg, 'iran'), miT = wordAt(seg, 'misiles'), drT = wordAt(seg, 'drones');
  const baT = wordAt(seg, 'bases'), esT = wordAt(seg, 'estados'), inT = wordAt(seg, 'incendio'), zoT = wordAt(seg, 'zona');
  const cx = 540, cy = 745, R = 205;
  const sweep = (T * 4) % 360;
  const radar = pop(f, 0, 14);
  const bases = [{ x: cx - 40, y: cy + 50, n: 'BASE 1' }, { x: cx + 50, y: cy + 90, n: 'BASE 2' }];
  const tracks = [0, 1, 2, 3, 4];
  const ph2 = lerp(f, [inT - 8, inT + 2], [0, 1], null);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="gf-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#02100c" /><stop offset="0.55" stopColor="#062019" /><stop offset="1" stopColor="#010604" />
        </linearGradient>
        <radialGradient id="gf-scope" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0c3a2a" /><stop offset="1" stopColor="#03140e" />
        </radialGradient>
        <linearGradient id="gf-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3dffa0" stopOpacity="0" /><stop offset="1" stopColor="#3dffa0" stopOpacity="0.45" />
        </linearGradient>
        <clipPath id="gf-clip"><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>
      <rect width={1080} height={1920} fill="url(#gf-bg)" />
      {/* rejilla de fondo */}
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 100} 460 V980`} stroke="#0f3a2b" strokeWidth={2} />)}
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M0 ${480 + i * 100} H1080`} stroke="#0f3a2b" strokeWidth={2} />)}
      <g opacity={1 - ph2 * 0.75} transform={`translate(${cx} ${cy}) scale(${radar * (1 - ph2 * 0.25)}) translate(${-cx} ${-cy})`}>
        <circle cx={cx} cy={cy} r={R + 16} fill="#0a1a14" stroke="#1d5c44" strokeWidth={8} />
        <circle cx={cx} cy={cy} r={R} fill="url(#gf-scope)" stroke="#3dffa0" strokeWidth={4} />
        <g clipPath="url(#gf-clip)">
          {/* costa: Irán arriba, península abajo, Baréin al centro */}
          <path d={`M${cx - R} ${cy - 150} Q ${cx - 60} ${cy - 120} ${cx + 40} ${cy - 160} T ${cx + R} ${cy - 110} L${cx + R} ${cy - R} L${cx - R} ${cy - R} Z`} fill="#1b5a40" opacity={0.7} />
          <path d={`M${cx - R} ${cy + 60} Q ${cx - 120} ${cy + 70} ${cx - 100} ${cy + 150} Q ${cx} ${cy + 200} ${cx + R} ${cy + 170} L${cx + R} ${cy + R} L${cx - R} ${cy + R} Z`} fill="#1b5a40" opacity={0.7} />
          <path d={`M${cx - 30} ${cy + 20} Q ${cx + 20} ${cy + 10} ${cx + 40} ${cy + 60} Q ${cx + 60} ${cy + 120} ${cx + 30} ${cy + 130} Q ${cx - 50} ${cy + 120} ${cx - 50} ${cy + 60} Z`} fill="#2f8a62" stroke="#3dffa0" strokeWidth={3} />
          {[60, 120, 180].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#3dffa0" strokeOpacity={0.25} strokeWidth={2} />)}
          <path d={`M${cx - R} ${cy} H${cx + R} M${cx} ${cy - R} V${cy + R}`} stroke="#3dffa0" strokeOpacity={0.25} strokeWidth={2} />
          {/* barrido */}
          <g transform={`rotate(${sweep} ${cx} ${cy})`}>
            <path d={`M${cx} ${cy} L${cx + R} ${cy} A${R} ${R} 0 0 0 ${cx + R * Math.cos(-0.6)} ${cy + R * Math.sin(-0.6)} Z`} fill="url(#gf-beam)" />
            <path d={`M${cx} ${cy} L${cx + R} ${cy}`} stroke="#3dffa0" strokeWidth={3} />
          </g>
          {/* trazas entrantes desde el norte (Irán) */}
          {tracks.map((i) => {
            const st = miT - 6 + i * 7;
            const p = lerp(f, [st, baT + 14 + i * 4], [0, 1], (t) => t);
            if (p <= 0) return null;
            const b = bases[i % 2];
            const sx = cx - 160 + i * 80, sy = cy - R + 10;
            const x = sx + (b.x - sx) * p, y = sy + (b.y - sy) * p;
            return (
              <g key={i}>
                <path d={`M${sx} ${sy} L${x} ${y}`} stroke={i % 2 ? '#ffb347' : '#ff3b4e'} strokeWidth={3} strokeDasharray="8 6" />
                {p < 1 && (i % 2 ? <path d={`M${x} ${y - 9} L${x + 9} ${y + 7} L${x - 9} ${y + 7} Z`} fill="#ffb347" /> : <circle cx={x} cy={y} r={8} fill="#ff3b4e" />)}
              </g>
            );
          })}
          {bases.map((b, i) => {
            const s = pop(f, baT - 2 + i * 5, 10);
            const h = f - (baT + 14 + i * 4);
            return (
              <g key={b.n} transform={`translate(${b.x} ${b.y})`}>
                {h > 0 && <circle r={10 + (h % 30) * 1.4} fill="none" stroke="#ff3b4e" strokeWidth={4} opacity={1 - (h % 30) / 30} />}
                <rect x={-12} y={-12} width={24} height={24} fill="#1e5bd8" stroke="#ffffff" strokeWidth={3} transform={`scale(${s}) rotate(45)`} />
              </g>
            );
          })}
        </g>
        <text x={cx} y={cy - R - 30} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#3dffa0" letterSpacing={6} opacity={pop(f, irT - 2, 12)}>▲ IRÁN</text>
        <text x={cx + R + 10} y={cy + 200} fontFamily={BODY} fontWeight={900} fontSize={24} fill="#3dffa0" opacity={pop(f, goT, 12)}>GOLFO PÉRSICO</text>
      </g>
      {/* etiquetas */}
      <g opacity={1 - ph2}>
        <Pill x={200} y={540} text="MISILES" s={pop(f, miT, 10)} bg="#ff3b4e" size={36} />
        <Pill x={880} y={540} text="DRONES" s={pop(f, drT, 10)} bg="#ffb347" color={OUT} size={36} />
        <g transform={`translate(860 900) scale(${pop(f, esT - 2, 10)})`}>
          <rect x={-170} y={-50} width={340} height={100} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <USFlag x={-152} y={-30} w={86} h={60} />
          <text x={40} y={-4} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>2 BASES</text>
          <text x={40} y={30} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={22} fill="#5a6488">DE EE. UU.</text>
        </g>
        <text x={200} y={900} textAnchor="middle" fontFamily={HEAD} fontSize={56} fill="#ffffff" stroke={OUT} strokeWidth={6} paintOrder="stroke" opacity={pop(f, baT + 6, 12)}>BARÉIN</text>
      </g>
      {/* incendio en zona industrial */}
      <g opacity={ph2}>
        <g transform={`translate(540 790) scale(${pop(f, inT - 6, 11)})`}>
          <rect x={-260} y={100} width={520} height={20} fill="#0b1a14" />
          {/* depósitos y chimeneas */}
          {[-180, -60].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={20} rx={52} ry={14} fill="#5a6478" stroke={OUT} strokeWidth={4} />
              <rect x={x - 52} y={20} width={104} height={80} fill="#4a5266" stroke={OUT} strokeWidth={4} />
              <ellipse cx={x} cy={100} rx={52} ry={14} fill="#4a5266" stroke={OUT} strokeWidth={4} />
            </g>
          ))}
          <rect x={40} y={-20} width={200} height={120} fill="#3a4152" stroke={OUT} strokeWidth={5} />
          <path d="M40 -20 L80 -60 L120 -20 L160 -60 L200 -20 L240 -60 L240 -20" fill="#4a5266" stroke={OUT} strokeWidth={5} />
          <rect x={200} y={-150} width={26} height={90} fill="#4a5266" stroke={OUT} strokeWidth={4} />
          <Flame x={100} y={-26} s={0.9} T={T} />
          <Flame x={160} y={-30} s={0.7} T={T + 9} />
          <Flame x={-60} y={10} s={0.6} T={T + 4} />
          {[0, 1, 2, 3].map((i) => {
            const g = (T * 0.8 + i * 24) % 96;
            return <circle key={i} cx={120 + Math.sin(g * 0.08 + i) * 30} cy={-80 - g * 2} r={20 + g * 0.5} fill="#5a6070" opacity={0.55 * (1 - g / 96)} />;
          })}
        </g>
        <Pill x={540} y={540} text="INCENDIO" s={pop(f, inT, 10)} bg="#ff5a1f" size={44} />
        <Pill x={540} y={940} text="ZONA INDUSTRIAL · BARÉIN" s={pop(f, zoT - 2, 10)} bg="#ffffff" color={OUT} size={34} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: RUSIA GOLPEA DÍMER Y VISHNEVE ===================== */
export const DymerScene: React.FC<P> = ({ f, T, seg }) => {
  const kiT = wordAt(seg, 'kiev'), drT = wordAt(seg, 'dron'), deT = wordAt(seg, 'destroza'), ciT = wordAt(seg, 'cinco');
  const dmT = wordAt(seg, 'dimer'), otT = wordAt(seg, 'otro'), suT = wordAt(seg, 'supermercado'), viT = wordAt(seg, 'vishneve');
  const alT = wordAt(seg, 'menos') - 6, seT = wordAt(seg, 'seis'), dsT = wordAt(seg, 'desaparecidos'), reT = wordAt(seg, 'rescatistas'), niT = wordAt(seg, 'nino');
  const ph1 = lerp(f, [otT - 8, otT], [1, 0], null);
  const ph2 = lerp(f, [otT - 6, otT + 4], [0, 1], null) * lerp(f, [alT - 8, alT], [1, 0], null);
  const ph3 = lerp(f, [alT - 6, alT + 4], [0, 1], null);
  const hit = f >= deT;
  const dronP = lerp(f, [drT - 6, deT], [0, 1], (t) => t * t);
  const flash = hit ? Math.max(0, 1 - (f - deT) / 14) : 0;
  const shake = hit && f < deT + 12 ? Math.sin(f * 4) * 7 : 0;
  const win = (r: number, c: number) => rnd(r * 13 + c * 7 + 5) > 0.45;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="dy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060a1c" />
          <stop offset="0.45" stopColor="#1a1430" />
          <stop offset="0.62" stopColor="#4a1e1a" />
          <stop offset="1" stopColor="#05070f" />
        </linearGradient>
        <radialGradient id="dy-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff9a3a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff3b1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dy-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7c2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff7c2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#dy-sky)" />
      <Particles T={T} n={40} color="#ffffff" seed={77} speed={0.02} size={2} op={0.5} />
      {/* ceniza que sube */}
      <Particles T={T} n={26} color="#ffb070" seed={91} speed={0.9} size={3} op={0.35} />
      {/* fase 1: el bloque de cinco plantas */}
      <g opacity={ph1} transform={`translate(${shake} 0)`}>
        {/* silueta de ciudad */}
        <path d="M0 960 L0 820 L70 820 L70 780 L150 780 L150 840 L220 840 L220 800 L860 800 L860 760 L940 760 L940 830 L1080 830 L1080 960 Z" fill="#0b0f20" />
        <circle cx={540} cy={760} r={260} fill="url(#dy-glow)" opacity={hit ? 0.55 + 0.15 * Math.sin(T * 0.4) : 0} />
        {/* edificio */}
        <g transform="translate(0 0)">
          <rect x={290} y={570} width={500} height={390} fill="#5a5f74" stroke={OUT} strokeWidth={7} />
          <rect x={280} y={556} width={520} height={20} fill="#3e4256" stroke={OUT} strokeWidth={5} />
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 7 }).map((__, c) => {
            const x = 312 + c * 68, y = 592 + r * 74;
            const broken = hit && c >= 3 && c <= 4;
            if (broken) return null;
            return <rect key={`${r}-${c}`} x={x} y={y} width={44} height={46} rx={4} fill={win(r, c) ? '#ffcf6a' : '#1d2236'} stroke={OUT} strokeWidth={3} opacity={win(r, c) ? 0.9 : 1} />;
          }))}
          {/* entrada destruida */}
          {hit && (
            <g>
              <path d="M500 560 L520 600 L505 640 L530 700 L510 760 L528 830 L512 960 L650 960 L640 860 L660 780 L640 700 L662 640 L645 590 L660 560 Z" fill="#120d14" stroke={OUT} strokeWidth={6} />
              {/* forjados colgando */}
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M505 ${640 + i * 74} L${560 + i * 6} ${660 + i * 74} L${548 + i * 6} ${668 + i * 74} L500 ${652 + i * 74}`} fill="#7a7f94" stroke={OUT} strokeWidth={3} />
              ))}
              {/* escombros */}
              <path d="M440 960 L470 920 L520 930 L560 890 L610 910 L650 880 L700 925 L740 960 Z" fill="#6a6f84" stroke={OUT} strokeWidth={5} />
              {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={460 + i * 45} y={925 + (i % 2) * 10} width={28} height={16} fill="#8a8fa4" stroke={OUT} strokeWidth={2} transform={`rotate(${i * 23 - 40} ${474 + i * 45} 933)`} />)}
              <Flame x={575} y={800} s={0.8} T={T} />
              <Flame x={540} y={700} s={0.55} T={T + 9} />
              {[0, 1, 2, 3].map((i) => {
                const g = (T * 0.7 + i * 25) % 100;
                return <circle key={i} cx={580 + Math.sin(g * 0.08 + i) * 30} cy={640 - g * 1.6} r={22 + g * 0.5} fill="#3a3a48" opacity={0.55 * (1 - g / 100)} />;
              })}
            </g>
          )}
        </g>
        {/* dron entrando */}
        {!hit && dronP > 0 && (
          <g>
            <path d={`M1100 480 L${1100 - dronP * 520} ${480 + dronP * 220}`} stroke="#ff9a3a" strokeWidth={4} strokeDasharray="12 10" opacity={0.7} />
            <Drone x={1100 - dronP * 520} y={480 + dronP * 220} s={1.8} c="#c9ced8" />
          </g>
        )}
        <rect width={1080} height={1920} fill="#fff2d0" opacity={flash * 0.6} />
        <g transform={`translate(190 520) scale(${pop(f, kiT - 4, 10)})`}>
          <rect x={-130} y={-40} width={260} height={80} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <UkraineFlag x={-114} y={-24} w={64} h={48} />
          <text x={36} y={16} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill={OUT}>KIEV</text>
        </g>
        <Pill x={860} y={520} text="DRON" s={pop(f, drT, 10)} bg="#ff3b4e" size={40} />
        <Pill x={200} y={880} text="5 PLANTAS" s={pop(f, ciT - 2, 10)} bg="#ffffff" color={OUT} size={38} />
        <Pill x={880} y={890} text="DÍMER" s={pop(f, dmT - 2, 10)} bg="#ffc400" color={OUT} size={42} />
      </g>
      {/* fase 2: mapa de la región */}
      <g opacity={ph2}>
        <g transform={`translate(540 715) scale(${0.9 + 0.1 * pop(f, otT - 4, 14)})`}>
          <path d="M-380 -200 Q -200 -250 0 -230 Q 220 -250 380 -190 Q 420 0 370 200 Q 160 250 -40 230 Q -260 250 -390 190 Q -430 0 -380 -200 Z" fill="#1e2a44" stroke="#7fa2d8" strokeWidth={5} />
          {/* río Dniéper */}
          <path d="M60 -240 Q 30 -120 70 -40 Q 110 40 60 120 Q 20 190 60 240" fill="none" stroke="#3b8cff" strokeWidth={18} opacity={0.8} />
          <text x={-300} y={-160} fontFamily={BODY} fontWeight={900} fontSize={24} fill="#7fa2d8">REGIÓN DE KIEV</text>
          {/* Kiev */}
          <circle cx={20} cy={20} r={34} fill="#ffd23f" stroke={OUT} strokeWidth={5} />
          <text x={20} y={86} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff">KIEV</text>
          {/* Dímer al norte */}
          {[{ x: -10, y: -150, n: 'DÍMER', t: otT - 4 }, { x: -170, y: 60, n: 'VISHNEVE', t: viT - 6 }].map((m) => {
            const s = pop(f, m.t, 10);
            const pulse = (T % 30) / 30;
            return (
              <g key={m.n} transform={`translate(${m.x} ${m.y})`}>
                <circle r={20 + pulse * 46} fill="none" stroke="#ff3b4e" strokeWidth={5} opacity={(1 - pulse) * s} />
                <g transform={`scale(${s})`}>
                  <circle r={20} fill="#ff3b4e" stroke={OUT} strokeWidth={5} />
                  <text x={0} y={-34} textAnchor="middle" fontFamily={HEAD} fontSize={38} fill="#ffffff" stroke={OUT} strokeWidth={5} paintOrder="stroke">{m.n}</text>
                </g>
              </g>
            );
          })}
        </g>
        {/* supermercado */}
        <g transform={`translate(240 900) scale(${pop(f, suT - 4, 10)})`}>
          <rect x={-120} y={-50} width={240} height={100} rx={10} fill="#f4f6fb" stroke={OUT} strokeWidth={6} />
          <path d="M-130 -50 L130 -50 L115 -80 L-115 -80 Z" fill="#ff3b4e" stroke={OUT} strokeWidth={5} />
          <g transform="translate(-60 10)" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round">
            <path d="M-26 -22 L-16 -22 L-6 14 L26 14 L32 -12 L-10 -12" />
            <circle cx={-2} cy={26} r={5} fill={OUT} /><circle cx={22} cy={26} r={5} fill={OUT} />
          </g>
          <text x={40} y={16} textAnchor="middle" fontFamily={HEAD} fontSize={38} fill={OUT}>SÚPER</text>
          <Flame x={90} y={-80} s={0.45} T={T} />
        </g>
      </g>
      {/* fase 3: balance y rescate */}
      <g opacity={ph3}>
        {/* montaña de escombros con linternas */}
        <path d="M120 960 L230 860 L330 880 L420 800 L520 830 L620 780 L720 840 L820 820 L960 960 Z" fill="#4a4e60" stroke={OUT} strokeWidth={6} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={200 + i * 58} y={870 + (i % 3) * 18} width={40} height={18} fill="#6a6f84" stroke={OUT} strokeWidth={2} transform={`rotate(${i * 31 - 50} ${220 + i * 58} ${880 + (i % 3) * 18})`} />
        ))}
        {[0, 1, 2].map((i) => {
          const s = pop(f, reT - 4 + i * 4, 10);
          const a = Math.sin(T * 0.06 + i * 2) * 14;
          const x = 300 + i * 240, y = 810 - (i === 1 ? 30 : 0);
          return (
            <g key={i} opacity={s}>
              <path d={`M${x} ${y} L${x - 70} ${y + 160} L${x + 70} ${y + 160} Z`} fill="url(#dy-beam)" transform={`rotate(${a + 180} ${x} ${y})`} />
              <g transform={`translate(${x} ${y})`}>
                <path d="M-18 -6 Q -18 -26 0 -26 Q 18 -26 18 -6 Z" fill="#ffffff" stroke={OUT} strokeWidth={3} />
                <rect x={-16} y={-6} width={32} height={34} rx={6} fill="#ff8a1f" stroke={OUT} strokeWidth={3} />
                <rect x={-16} y={8} width={32} height={6} fill="#f4f6fb" />
              </g>
            </g>
          );
        })}
        <Card x={300} y={600} w={380} h={190} s={pop(f, seT - 4, 11)} bg="#ffffff">
          <text x={0} y={-46} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={28} fill="#5a6488">AL MENOS</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={110} fill="#c4001f">6</text>
          <text x={0} y={80} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill={OUT}>MUERTOS</text>
        </Card>
        <Pill x={780} y={560} text="DESAPARECIDOS" s={pop(f, dsT - 2, 10)} bg="#3a3f52" size={36} />
        <Pill x={780} y={660} text="BAJO LOS ESCOMBROS" s={pop(f, dsT + 10, 10)} bg="#ffffff" color={OUT} size={28} />
        <g transform={`translate(540 790) scale(${pop(f, niT - 4, 10)})`}>
          <rect x={-250} y={-44} width={500} height={88} rx={44} fill="#2fbf71" stroke={OUT} strokeWidth={6} />
          <path d="M-205 0 L-190 16 L-160 -18" fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          <text x={20} y={14} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff">NIÑO RESCATADO CON VIDA</text>
        </g>
      </g>
    </svg>
  );
};

/* ===================== 23-11: TRUMP AMENAZA A IRÁN PARA 2027 ===================== */
export const UltimatumScene: React.FC<P> = ({ f, T, seg }) => {
  const trT = wordAt(seg, 'trump'), irT = wordAt(seg, 'iran'), acT = wordAt(seg, 'acuerdo'), orT = wordAt(seg, 'ormuz');
  const atT = wordAt(seg, 'atacar'), coT = wordAt(seg, 'comienzos'), veT = wordAt(seg, 'veintisiete'), inT = wordAt(seg, 'inutiles');
  const neT = wordAt(seg, 'negociaciones'), toT = wordAt(seg, 'todo'), miT = wordAt(seg, 'misiles'), baT = wordAt(seg, 'bases'), bhT = wordAt(seg, 'barein');
  const ph1 = lerp(f, [toT - 8, toT], [1, 0], null);
  const ph2 = lerp(f, [toT - 6, toT + 4], [0, 1], null);
  const flip = lerp(f, [coT, veT + 4], [0, 1]);
  const year = flip < 0.5 ? '2026' : '2027';
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ul-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1430" />
          <stop offset="0.5" stopColor="#1a1f3e" />
          <stop offset="1" stopColor="#05070f" />
        </linearGradient>
        <radialGradient id="ul-spot" cx="50%" cy="0%" r="90%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ul-bg)" />
      <Particles T={T} n={30} color="#9fc0ff" seed={57} speed={0.05} size={2} op={0.4} />
      {/* fase 1: el aviso */}
      <g opacity={ph1}>
        {/* rejilla de sala de situación */}
        <g stroke="#2fd8ff" strokeOpacity={0.08} strokeWidth={2}>
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 100} 470 V960`} />)}
          {Array.from({ length: 6 }).map((_, i) => <path key={`h${i}`} d={`M0 ${480 + i * 96} H1080`} />)}
        </g>
        <path d="M60 470 L240 470 L300 960 L0 960 Z" fill="url(#ul-spot)" />
        {/* atril de Trump */}
        <g transform={`translate(190 760) scale(${pop(f, trT - 2, 11)})`}>
          <rect x={-150} y={-230} width={300} height={170} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={5} opacity={0.0} />
          <USFlag x={-110} y={-250} w={150} h={100} />
          <path d="M40 -250 L40 -100" stroke="#c9a74a" strokeWidth={6} />
          <path d="M-100 0 L100 0 L80 190 L-80 190 Z" fill="#6b4a2b" stroke={OUT} strokeWidth={6} />
          <rect x={-120} y={-28} width={240} height={36} rx={10} fill="#8a6038" stroke={OUT} strokeWidth={6} />
          <circle cx={0} cy={90} r={46} fill="#1e3a8a" stroke="#e9c249" strokeWidth={6} />
          <polygon points={`0,62 8,82 30,82 12,96 18,118 0,104 -18,118 -12,96 -30,82 -8,82`} fill="#e9c249" />
          <path d="M-8 -28 L-20 -100" stroke="#9aa3b5" strokeWidth={6} />
          <circle cx={-22} cy={-106} r={12} fill="#3a3f52" stroke={OUT} strokeWidth={3} />
          <rect x={-90} y={150} width={180} height={50} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={4} />
          <text x={0} y={188} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={OUT}>TRUMP</text>
        </g>
        {/* bocadillo */}
        <g transform={`translate(640 560) scale(${pop(f, acT - 4, 10)})`}>
          <path d="M-280 -70 Q -280 -100 -250 -100 L250 -100 Q 280 -100 280 -70 L280 50 Q 280 80 250 80 L-150 80 L-220 130 L-200 80 L-250 80 Q -280 80 -280 50 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={0} y={-20} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={34} fill="#5a6488">¿ACUERDO SOBRE</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={HEAD} fontSize={66} fill="#1e5bd8" opacity={pop(f, orT - 4, 8)}>ORMUZ?</text>
        </g>
        {/* calendario que pasa a 2027 */}
        <g transform={`translate(560 830) scale(${pop(f, coT - 6, 10)})`}>
          <rect x={-120} y={-110} width={240} height={220} rx={20} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-120} y={-110} width={240} height={64} rx={20} fill="#c4001f" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-62} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff">{flip < 0.5 ? 'DICIEMBRE' : 'ENERO'}</text>
          <g transform={`scale(1 ${Math.abs(Math.cos(flip * Math.PI))})`}>
            <text x={0} y={60} textAnchor="middle" fontFamily={HEAD} fontSize={96} fill={flip < 0.5 ? '#5a6488' : '#c4001f'}>{year}</text>
          </g>
          {[-70, 0, 70].map((x) => <rect key={x} x={x - 8} y={-128} width={16} height={34} rx={6} fill="#9aa3b5" stroke={OUT} strokeWidth={3} />)}
        </g>
        {/* diana sobre Irán */}
        <g transform={`translate(880 790) scale(${pop(f, irT - 4, 10)})`}>
          {[90, 64, 38].map((r, i) => <circle key={r} r={r} fill="none" stroke="#ff3b4e" strokeWidth={8} opacity={(0.6 + i * 0.15) * (f >= atT ? 1 : 0.35)} />)}
          <path d="M-110 0 H-40 M40 0 H110 M0 -110 V-40 M0 40 V110" stroke="#ff3b4e" strokeWidth={6} />
          <g transform={`rotate(${Math.sin(T * 0.1) * 3})`}><IranFlag x={-36} y={-24} w={72} h={48} /></g>
        </g>
        <Pill x={880} y={915} text="IRÁN" s={pop(f, irT - 2, 10)} bg="#ffffff" color={OUT} size={34} />
        <Stamp x={640} y={560} text="INÚTILES" s={pop(f, inT - 2, 8)} color="#c4001f" size={70} rot={-10} />
        <Pill x={640} y={680} text="DICE DE LAS NEGOCIACIONES" s={pop(f, neT, 10)} bg="#ffc400" color={OUT} size={28} />
      </g>
      {/* fase 2: el contexto del Golfo */}
      <g opacity={ph2}>
        <path d="M300 470 L520 470 L700 490 L860 520 L1080 540 L1080 700 L960 690 L860 650 L760 610 L640 580 L520 560 L420 530 L330 520 Z" fill="#4a3a2a" stroke="#ffcf8a" strokeWidth={4} />
        <path d="M0 640 L120 660 L260 700 L360 760 L420 820 L440 900 L500 940 L640 930 L720 900 L780 940 L860 960 L0 960 Z" fill="#5a4a30" stroke="#ffcf8a" strokeWidth={4} />
        <path d="M500 800 Q 530 790 545 820 Q 560 870 540 900 Q 505 905 495 860 Z" fill="#7a6440" stroke="#ffffff" strokeWidth={5} />
        <text x={820} y={610} textAnchor="middle" fontFamily={HEAD} fontSize={56} fill="#ffe2b8" letterSpacing={3}>IRÁN</text>
        <text x={330} y={840} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill="#ffffff" opacity={pop(f, bhT - 6, 10)}>BARÉIN</text>
        {[0, 1, 2, 3].map((i) => {
          const p = lerp(f, [miT + i * 6, miT + 30 + i * 6], [0, 1]);
          if (p <= 0) return null;
          const sx = 900, sy = 580, ex = 515 + (i % 2) * 20, ey = 840 + (i % 2) * 20;
          const cx = (sx + ex) / 2, cy = 470 + i * 10;
          const pt = (t: number) => ({ x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex, y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey });
          let d = '';
          for (let k = 0; k <= 24 * p; k++) { const q = pt(k / 24); d += `${k ? 'L' : 'M'}${q.x} ${q.y} `; }
          const a = pt(Math.min(p, 0.99)), b = pt(Math.min(p + 0.01, 1));
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={i % 2 ? '#ffb347' : '#ff3b4e'} strokeWidth={5} strokeDasharray="14 10" />
              {p < 1 ? (i < 2 ? <Missile x={a.x} y={a.y} r={(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI} s={0.7} /> : <Drone x={a.x} y={a.y} s={1.2} />) :
                <circle cx={ex} cy={ey} r={20 + ((T + i * 7) % 20) * 2} fill="#ff9a3a" opacity={0.5 - ((T + i * 7) % 20) / 40} />}
            </g>
          );
        })}
        <g transform={`translate(760 860) scale(${pop(f, baT - 4, 10)})`}>
          <rect x={-170} y={-50} width={340} height={100} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <USFlag x={-150} y={-30} w={86} h={60} />
          <text x={50} y={-4} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>BASES</text>
          <text x={50} y={32} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">DE EE. UU.</text>
        </g>
        <Pill x={250} y={560} text="MISILES + DRONES" s={pop(f, miT, 10)} bg="#ff3b4e" size={36} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: ÚLTIMO DOMINGO DE CAMPAÑA ===================== */
export const DomingoScene: React.FC<P> = ({ f, T, seg }) => {
  const doT = wordAt(seg, 'domingo'), caT = wordAt(seg, 'campana'), veT = wordAt(seg, 'veintinueve'), saT = wordAt(seg, 'sanchez');
  const feT = wordAt(seg, 'feijoo'), muT = wordAt(seg, 'murcia'), kmT = wordAt(seg, 'kilometros'), vcT = wordAt(seg, 'vecinos');
  const reT = wordAt(seg, 'remontada'), voT = wordAt(seg, 'voto'), esT = wordAt(seg, 'este'), luT = wordAt(seg, 'lunes'), ocT = wordAt(seg, 'ocho'), rtT = wordAt(seg, 'radiotelevision');
  const ph0 = lerp(f, [saT - 6, saT + 2], [1, 0], null);
  const ph1 = lerp(f, [saT - 4, saT + 4], [0, 1], null) * lerp(f, [esT - 8, esT], [1, 0], null);
  const ph2 = lerp(f, [esT - 6, esT + 4], [0, 1], null);
  const Atril: React.FC<{ x: number; y: number; name: string; s: number }> = ({ x, y, name, s }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-90 0 L90 0 L72 150 L-72 150 Z" fill="#1d2440" stroke={OUT} strokeWidth={6} />
      <rect x={-108} y={-26} width={216} height={34} rx={10} fill="#6a74a8" stroke={OUT} strokeWidth={6} />
      <rect x={-80} y={34} width={160} height={50} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={4} />
      <text x={0} y={72} textAnchor="middle" fontFamily={HEAD} fontSize={32} fill={OUT}>{name}</text>
      <path d="M-8 -26 L-20 -90" stroke="#9aa3b5" strokeWidth={6} />
      <circle cx={-22} cy={-96} r={12} fill="#3a3f52" stroke={OUT} strokeWidth={3} />
    </g>
  );
  const dash = lerp(f, [muT + 6, kmT + 4], [0, 1]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="do-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d0f3a" />
          <stop offset="0.55" stopColor="#142050" />
          <stop offset="1" stopColor="#050816" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#do-bg)" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d="M0 0 L-70 900 L70 900 Z" fill="#ffffff" opacity={0.05 + 0.03 * Math.sin(T * 0.08 + i)} transform={`translate(${140 + i * 270} 380) rotate(${Math.sin(T * 0.04 + i * 1.7) * 16})`} />
      ))}
      <Particles T={T} n={44} color="#ffe14d" seed={23} speed={-0.7} size={3} op={0.35} />
      {/* fase 0: calendario */}
      <g opacity={ph0}>
        <g transform={`translate(540 690) scale(${pop(f, doT - 4, 10)})`}>
          <rect x={-200} y={-170} width={400} height={330} rx={30} fill="#ffffff" stroke={OUT} strokeWidth={8} />
          <rect x={-200} y={-170} width={400} height={80} rx={30} fill="#ff2d55" stroke={OUT} strokeWidth={8} />
          <text x={0} y={-112} textAnchor="middle" fontFamily={HEAD} fontSize={48} fill="#ffffff">NOVIEMBRE</text>
          <text x={0} y={70} textAnchor="middle" fontFamily={HEAD} fontSize={190} fill={OUT}>{f < veT ? '22' : '29'}</text>
          <text x={0} y={130} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill="#5a6488">{f < veT ? 'ÚLTIMO DOMINGO' : 'ELECCIONES'}</text>
          {f >= veT && (
            <g transform={`translate(0 0) scale(${pop(f, veT, 8)})`}>
              <rect x={60} y={-80} width={110} height={90} rx={10} fill="#f4f6fb" stroke={OUT} strokeWidth={5} transform="rotate(10 115 -35)" />
              <path d="M80 -40 L105 -15 L150 -70" fill="none" stroke="#2fbf71" strokeWidth={10} strokeLinecap="round" transform="rotate(10 115 -35)" />
            </g>
          )}
        </g>
        <Pill x={540} y={930} text="DE CAMPAÑA" s={pop(f, caT - 2, 10)} bg="#ffc400" color={OUT} size={42} />
        <SpainFlag x={110} y={500} w={130} h={86} />
      </g>
      {/* fase 1: Murcia, dos mítines a dos kilómetros */}
      <g opacity={ph1}>
        {/* plano de calles */}
        <g opacity={pop(f, muT - 6, 14)}>
          <rect x={40} y={480} width={1000} height={480} rx={30} fill="#1a2a4a" stroke="#5a7ab8" strokeWidth={4} />
          <g stroke="#2d4470" strokeWidth={14}>
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${120 + i * 200} 490 L${90 + i * 210} 950`} />)}
            {[0, 1, 2].map((i) => <path key={`h${i}`} d={`M50 ${580 + i * 130} L1030 ${560 + i * 140}`} />)}
          </g>
          {/* río Segura */}
          <path d="M40 900 Q 300 820 540 880 Q 780 940 1040 860" fill="none" stroke="#3b8cff" strokeWidth={22} opacity={0.6} />
          <text x={540} y={540} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#ffffff" letterSpacing={4}>MURCIA</text>
        </g>
        <Atril x={230} y={700} name="SÁNCHEZ" s={pop(f, saT - 2, 11)} />
        <Atril x={850} y={700} name="FEIJÓO" s={pop(f, feT - 2, 11)} />
        {/* línea de distancia */}
        <path d={`M340 640 L${340 + dash * 400} 640`} stroke="#ffe14d" strokeWidth={7} strokeDasharray="18 12" />
        <path d="M340 620 V660 M740 620 V660" stroke="#ffe14d" strokeWidth={7} opacity={dash > 0.98 ? 1 : 0} />
        <g transform={`translate(540 600) scale(${pop(f, kmT - 4, 10)})`}>
          <rect x={-90} y={-40} width={180} height={80} rx={40} fill="#ffe14d" stroke={OUT} strokeWidth={6} />
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill={OUT}>2 KM</text>
        </g>
        {/* casitas de vecinos con felpudo */}
        <g transform={`translate(540 760) scale(${pop(f, vcT - 2, 10)}) rotate(${Math.sin(T * 0.2) * 3})`}>
          {[-60, 60].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`}>
              <path d="M-50 -10 L0 -56 L50 -10 Z" fill="#ff5a3c" stroke={OUT} strokeWidth={5} />
              <rect x={-40} y={-10} width={80} height={64} fill="#fff3d6" stroke={OUT} strokeWidth={5} />
              <rect x={-12} y={18} width={24} height={36} fill="#8a5a2b" stroke={OUT} strokeWidth={3} />
            </g>
          ))}
          <text x={0} y={92} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill="#ffffff" stroke={OUT} strokeWidth={5} paintOrder="stroke">¿VECINOS?</text>
        </g>
        {/* remontada: flecha que sube */}
        <g transform={`translate(230 900) scale(${pop(f, reT - 4, 10)})`}>
          <path d="M-110 30 L-40 -10 L10 10 L90 -50" fill="none" stroke="#2fbf71" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M70 -62 L104 -60 L96 -28" fill="none" stroke="#2fbf71" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={-120} y={36} width={240} height={50} rx={25} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={0} y={72} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={OUT}>REMONTADA</text>
        </g>
        {/* voto a voto: papeletas */}
        <g transform={`translate(850 900) scale(${pop(f, voT - 4, 10)})`}>
          {[0, 1, 2].map((i) => {
            const k = Math.max(0, f - voT - i * 5);
            return <rect key={i} x={-90 + i * 60} y={-60 + (k < 10 ? 0 : 0)} width={50} height={64} rx={6} fill="#f4f6fb" stroke={OUT} strokeWidth={4} opacity={k > 0 ? 1 : 0.3} transform={`rotate(${-10 + i * 10} ${-65 + i * 60} -28)`} />;
          })}
          <rect x={-120} y={36} width={240} height={50} rx={25} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={0} y={72} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={OUT}>VOTO A VOTO</text>
        </g>
      </g>
      {/* fase 2: debate a ocho */}
      <g opacity={ph2}>
        <g transform={`translate(540 745) scale(${0.9 * pop(f, luT - 4, 12)})`}>
          <rect x={-440} y={-230} width={880} height={440} rx={30} fill="#0a0f22" stroke={OUT} strokeWidth={10} />
          <rect x={-420} y={-210} width={840} height={400} rx={20} fill="#1b2f6e" />
          <path d="M-420 120 L420 120 L420 190 L-420 190 Z" fill="#0d1a44" />
          {Array.from({ length: 8 }).map((_, i) => {
            const s = pop(f, ocT - 6 + i * 2, 8);
            const x = -360 + i * 103;
            return (
              <g key={i} transform={`translate(${x} 40) scale(${s})`}>
                <rect x={-34} y={-10} width={68} height={90} rx={6} fill="#26305a" stroke={OUT} strokeWidth={4} />
                <rect x={-40} y={-24} width={80} height={18} rx={6} fill={['#e3122b', '#1e5bd8', '#2fbf71', '#7a3ab8', '#ffb000', '#00a8a8', '#ff6a00', '#8a93b8'][i]} stroke={OUT} strokeWidth={3} />
                <circle cx={0} cy={-50} r={9} fill="#3a3f52" />
              </g>
            );
          })}
          <text x={0} y={-120} textAnchor="middle" fontFamily={HEAD} fontSize={88} fill="#ffffff">DEBATE A 8</text>
          <g opacity={pop(f, rtT - 4, 10)}>
            <rect x={-130} y={140} width={260} height={56} rx={12} fill="#ffffff" />
            <text x={0} y={182} textAnchor="middle" fontFamily={HEAD} fontSize={42} fill="#1b2f6e">RTVE</text>
          </g>
          <circle cx={380} cy={-170} r={12} fill="#ff2d55" opacity={0.5 + 0.5 * Math.sin(T * 0.3)} />
        </g>
        <Pill x={540} y={492} text="ESTE LUNES" s={pop(f, luT - 2, 10)} bg="#ffc400" color={OUT} size={34} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: FRACASA LA COP31 ===================== */
export const TurkeyFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#e30a17" stroke={OUT} strokeWidth={5} />
    <circle cx={x + w * 0.38} cy={y + h / 2} r={h * 0.25} fill="#ffffff" />
    <circle cx={x + w * 0.43} cy={y + h / 2} r={h * 0.2} fill="#e30a17" />
    <polygon points={star(x + w * 0.6, y + h / 2, h * 0.12)} fill="#ffffff" />
  </g>
);

export const Cop31Scene: React.FC<P> = ({ f, T, seg }) => {
  const frT = wordAt(seg, 'fracasa'), cuT = wordAt(seg, 'cumbre'), onT = wordAt(seg, 'onu'), tuT = wordAt(seg, 'turquia');
  const coT = wordAt(seg, 'conferencia'), laT = wordAt(seg, 'larga'), hiT = wordAt(seg, 'historia'), ciT = wordAt(seg, 'cierra'), siT = wordAt(seg, 'sin');
  const unT = wordAt(seg, 'union'), reT = wordAt(seg, 'rechaza'), teT = wordAt(seg, 'texto'), peT = wordAt(seg, 'petroleo'), gaT = wordAt(seg, 'gas'), caT = wordAt(seg, 'carbon'), sgT = wordAt(seg, 'sigueme');
  const ph1 = lerp(f, [unT - 8, unT], [1, 0], null);
  const ph2 = lerp(f, [unT - 6, unT + 4], [0, 1], null);
  const hours = lerp(f, [laT - 4, hiT + 10], [0, 1]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06233a" />
          <stop offset="0.55" stopColor="#0b3a4a" />
          <stop offset="1" stopColor="#04101a" />
        </linearGradient>
        <radialGradient id="cp-earth" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#5fc8ff" />
          <stop offset="0.7" stopColor="#1e6bd8" />
          <stop offset="1" stopColor="#0b2a6a" />
        </radialGradient>
        <radialGradient id="cp-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0.6" stopColor="#ff6a3a" stopOpacity="0" />
          <stop offset="1" stopColor="#ff6a3a" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#cp-bg)" />
      <Particles T={T} n={36} color="#9ff0d0" seed={31} speed={0.25} size={3} op={0.35} />
      {/* fase 1: la cumbre de Antalya */}
      <g opacity={ph1}>
        {/* Tierra con calor */}
        <g transform={`translate(260 640) scale(${pop(f, cuT - 6, 12)})`}>
          <circle r={150} fill="url(#cp-earth)" stroke={OUT} strokeWidth={7} />
          <g fill="#3fbf6a" stroke={OUT} strokeWidth={4} transform={`translate(${((T * 0.8) % 80) - 40} 0)`}>
            <path d="M-90 -60 Q -40 -100 10 -70 Q 30 -30 -20 -10 Q -60 10 -90 -20 Z" />
            <path d="M30 20 Q 80 0 110 40 Q 90 90 40 80 Q 10 60 30 20 Z" />
          </g>
          <circle r={150} fill="url(#cp-heat)" opacity={0.6 + 0.3 * Math.sin(T * 0.15)} />
          {/* termómetro */}
          <g transform="translate(170 -20)">
            <rect x={-16} y={-110} width={32} height={180} rx={16} fill="#ffffff" stroke={OUT} strokeWidth={5} />
            <rect x={-8} y={-90 + 20 * Math.sin(T * 0.1)} width={16} height={160 - 20 * Math.sin(T * 0.1)} rx={8} fill="#ff3b4e" />
            <circle cx={0} cy={86} r={28} fill="#ff3b4e" stroke={OUT} strokeWidth={5} />
          </g>
        </g>
        <g transform={`translate(760 560) scale(${pop(f, onT - 4, 10)})`}>
          <rect x={-200} y={-70} width={400} height={140} rx={22} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={40} y={-6} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill="#1e6bd8">COP31</text>
          <text x={40} y={44} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#5a6488">ANTALYA · ONU</text>
          <g transform="translate(-130 0)">
            <TurkeyFlag x={-50} y={-34} w={100} h={68} />
          </g>
        </g>
        <Pill x={760} y={680} text="TURQUÍA" s={pop(f, tuT - 2, 10)} bg="#e30a17" size={32} />
        {/* reloj de horas extra */}
        <g transform={`translate(760 840) scale(${pop(f, coT - 4, 10)})`}>
          <circle r={90} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M0 -78 V-66" stroke={OUT} strokeWidth={5} transform={`rotate(${i * 30})`} />)}
          <path d={`M0 0 L0 -60`} stroke={OUT} strokeWidth={8} strokeLinecap="round" transform={`rotate(${hours * 360 * 6})`} />
          <path d={`M0 0 L0 -40`} stroke="#ff3b4e" strokeWidth={10} strokeLinecap="round" transform={`rotate(${hours * 360})`} />
          <circle r={8} fill={OUT} />
          <g transform={`translate(150 -10) scale(${pop(f, laT, 10)})`}>
            <rect x={-60} y={-34} width={120} height={68} rx={16} fill="#ffc400" stroke={OUT} strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>+40 H</text>
          </g>
        </g>
        <Pill x={300} y={880} text="LA MÁS LARGA DE LA HISTORIA" s={pop(f, hiT - 4, 10)} bg="#ffffff" color={OUT} size={28} />
        <Stamp x={300} y={640} text="SIN ACUERDO" s={pop(f, siT - 2, 8)} color="#c4001f" size={60} rot={-12} />
      </g>
      {/* fase 2: la UE rechaza el texto */}
      <g opacity={ph2}>
        <g transform={`translate(230 620) scale(${pop(f, unT - 2, 11)})`}>
          <EUFlag x={-120} y={-80} w={240} h={160} spin={T * 0.5} />
        </g>
        <Pill x={230} y={760} text="LA UE RECHAZA" s={pop(f, reT - 2, 10)} bg="#1e5bd8" size={36} />
        {/* documento */}
        <g transform={`translate(720 700) rotate(4) scale(${pop(f, teT - 4, 10)})`}>
          <rect x={-200} y={-220} width={400} height={440} rx={16} fill="#fbfbf5" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-160} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill={OUT}>TEXTO FINAL</text>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M-150 ${-110 + i * 30} H${150 - (i % 2) * 60}`} stroke="#c9ced8" strokeWidth={10} strokeLinecap="round" />)}
          {[
            { y: 40, t: peT, n: 'PETRÓLEO', icon: 'barrel' },
            { y: 110, t: gaT, n: 'GAS', icon: 'flame' },
            { y: 180, t: caT, n: 'CARBÓN', icon: 'coal' },
          ].map((it) => {
            const s = pop(f, it.t - 4, 9);
            return (
              <g key={it.n} transform={`translate(0 ${it.y})`} opacity={s}>
                <g transform="translate(-130 -10)">
                  {it.icon === 'barrel' && <g><rect x={-22} y={-28} width={44} height={56} rx={8} fill="#2a2f40" stroke={OUT} strokeWidth={4} /><path d="M-22 -8 H22 M-22 10 H22" stroke="#ffc400" strokeWidth={4} /></g>}
                  {it.icon === 'flame' && <g transform="translate(-14 26) scale(0.4)"><path d="M0 0 Q -46 -40 -20 -100 Q -6 -60 6 -150 Q 40 -90 30 -60 Q 52 -70 46 -100 Q 76 -40 40 0 Z" fill="#3b8cff" stroke={OUT} strokeWidth={8} /></g>}
                  {it.icon === 'coal' && <g fill="#1a1a1a" stroke={OUT} strokeWidth={3}><path d="M-26 20 L-14 -8 L6 -14 L24 4 L18 22 Z" /><path d="M-6 -14 L8 -28 L22 -16 L12 -4 Z" fill="#3a3a3a" /></g>}
                </g>
                <text x={-80} y={6} fontFamily={HEAD} fontSize={44} fill="#5a6488">{it.n}</text>
                <path d="M-90 -6 L170 -6" stroke="#c4001f" strokeWidth={8} opacity={s} />
                <text x={150} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#c4001f">?</text>
              </g>
            );
          })}
        </g>
        <Pill x={230} y={870} text="NI LOS MENCIONA" s={pop(f, caT + 8, 10)} bg="#ffc400" color={OUT} size={34} />
        {f >= sgT && <Pill x={300} y={900} text="SÍGUEME" s={pop(f, sgT, 8)} bg="#ff2d55" size={40} />}
      </g>
    </svg>
  );
};

/* ======================================================================
   BIBLIOTECA 2026-11-24 (noticias del 23-11): amnistía a Puigdemont, debate a ocho y encuestas,
   vuelta de Huang a Nvidia y rebote en bolsa, 815 migrantes en Canarias
   ====================================================================== */
const Column: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => (
  <g>
    <rect x={x - 30} y={y} width={60} height={h} fill="#d8cfb8" stroke={OUT} strokeWidth={4} />
    {[-14, 0, 14].map((d) => <path key={d} d={`M${x + d} ${y + 10} V${y + h - 10}`} stroke="#b3a88c" strokeWidth={4} />)}
    <rect x={x - 40} y={y - 16} width={80} height={18} fill="#e8e0c8" stroke={OUT} strokeWidth={4} />
    <rect x={x - 40} y={y + h} width={80} height={16} fill="#e8e0c8" stroke={OUT} strokeWidth={4} />
  </g>
);

/* ===================== 23-11: AMNISTÍA A PUIGDEMONT ===================== */
export const AmnistiaScene: React.FC<P> = ({ f, T, seg }) => {
  const trT = wordAt(seg, 'tribunal'), amT = wordAt(seg, 'amnistia'), puT = wordAt(seg, 'puigdemont'), arT = wordAt(seg, 'archiva');
  const prT = wordAt(seg, 'proces'), maT = wordAt(seg, 'malversacion'), nuT = wordAt(seg, 'nueve'), voT = wordAt(seg, 'volver');
  const caT = wordAt(seg, 'campana'), diT = wordAt(seg, 'diciembre');
  const ph1 = lerp(f, [nuT - 8, nuT], [1, 0], null);
  const ph2 = lerp(f, [nuT - 6, nuT + 2], [0, 1], null);
  // la carpeta vuela al archivador
  const fly = lerp(f, [arT + 4, arT + 26], [0, 1]);
  const drawer = lerp(f, [arT - 4, arT + 6], [0, 1]) * (1 - lerp(f, [arT + 26, arT + 36], [0, 1]));
  const years = Math.round(lerp(f, [nuT, nuT + 30], [2017, 2026]));
  const trip = lerp(f, [voT - 4, voT + 26], [0, 1]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="am-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1a12" />
          <stop offset="0.55" stopColor="#4a2a1a" />
          <stop offset="1" stopColor="#0d0806" />
        </linearGradient>
        <radialGradient id="am-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#am-bg)" />
      <rect width={1080} height={1200} fill="url(#am-glow)" />
      {/* fachada del Supremo */}
      <g opacity={0.5}>
        <path d="M90 560 L540 420 L990 560 Z" fill="#cfc4a8" stroke={OUT} strokeWidth={5} />
        <circle cx={540} cy={510} r={30} fill="#b89b5a" stroke={OUT} strokeWidth={4} />
        <rect x={110} y={560} width={860} height={34} fill="#e8e0c8" stroke={OUT} strokeWidth={4} />
        {Array.from({ length: 7 }).map((_, i) => <Column key={i} x={170 + i * 123} y={610} h={380} />)}
      </g>
      <Particles T={T} n={30} color="#ffe2a8" seed={41} speed={0.12} size={2.5} op={0.45} />
      {/* fase 1: Supremo, ley y carpeta archivada */}
      <g opacity={ph1}>
        <Card x={540} y={505} w={600} h={90} s={pop(f, trT - 2, 10)} bg="#ffffff">
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill={OUT}>TRIBUNAL SUPREMO</text>
        </Card>
        {/* ley de amnistía */}
        <g transform={`translate(260 740) rotate(-6) scale(${pop(f, amT - 2, 10)})`}>
          <rect x={-130} y={-160} width={260} height={320} rx={10} fill="#fbf7ec" stroke={OUT} strokeWidth={6} />
          <rect x={-130} y={-160} width={260} height={70} rx={10} fill="#c60b1e" stroke={OUT} strokeWidth={6} />
          <text x={0} y={-112} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#ffffff">LEY DE</text>
          <text x={0} y={-30} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill={OUT}>AMNISTÍA</text>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M-96 ${10 + i * 30} H96`} stroke="#b8ae96" strokeWidth={7} strokeLinecap="round" />)}
          <circle cx={70} cy={120} r={26} fill="#c9a227" stroke={OUT} strokeWidth={4} />
        </g>
        {/* archivador */}
        <g transform="translate(790 790)">
          <rect x={-150} y={-180} width={300} height={360} rx={14} fill="#5a6276" stroke={OUT} strokeWidth={6} />
          {[0, 1].map((i) => (
            <g key={i}>
              <rect x={-130} y={-160 + i * 175} width={260} height={150} rx={10} fill="#7a8398" stroke={OUT} strokeWidth={5}
                transform={i === 0 ? `translate(0 ${-drawer * 0}) translate(${drawer * 0} 0)` : ''} />
              <rect x={-40} y={-100 + i * 175} width={80} height={20} rx={10} fill="#c9ced8" stroke={OUT} strokeWidth={4} />
            </g>
          ))}
          {/* cajón abierto */}
          <g transform={`translate(0 ${-drawer * 40}) scale(${1 + drawer * 0.06})`} opacity={drawer}>
            <path d="M-140 -170 L140 -170 L130 -110 L-130 -110 Z" fill="#9aa3b8" stroke={OUT} strokeWidth={5} />
          </g>
        </g>
        {/* carpeta de la causa */}
        {f < arT + 28 && (
          <g transform={`translate(${lerp(fly, [0, 1], [540, 790], null)} ${lerp(fly, [0, 0.5, 1], [760, 560, 640], null)}) rotate(${fly * 20}) scale(${pop(f, puT - 4, 10) * (1 - fly * 0.5)})`}>
            <path d="M-120 -80 L-40 -80 L-20 -100 L120 -100 L120 90 L-120 90 Z" fill="#f2c14e" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-96} y={-56} width={192} height={60} rx={8} fill="#ffffff" stroke={OUT} strokeWidth={4} />
            <text x={0} y={-14} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill={OUT}>PUIGDEMONT</text>
            <text x={0} y={50} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#7a4a00" opacity={f >= prT - 4 ? 1 : 0}>CAUSA DEL PROCÉS</text>
          </g>
        )}
        <Stamp x={790} y={600} text="ARCHIVADA" s={pop(f, arT + 30, 10)} color="#c4001f" size={52} />
        <g transform={`translate(540 925) scale(${pop(f, maT - 2, 10)})`} opacity={pop(f, maT - 2, 10)}>
          <rect x={-250} y={-40} width={500} height={80} rx={40} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill={OUT}>+ MALVERSACIÓN</text>
          <path d={`M-200 0 L${-200 + lerp(f, [maT + 10, maT + 22], [0, 400])} 0`} stroke="#c4001f" strokeWidth={10} strokeLinecap="round" />
        </g>
      </g>
      {/* fase 2: nueve años y vuelta */}
      <g opacity={ph2}>
        <g transform={`translate(270 640) scale(${pop(f, nuT - 2, 10)})`}>
          <rect x={-190} y={-140} width={380} height={280} rx={28} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-190} y={-140} width={380} height={76} rx={28} fill="#c60b1e" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-86} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffffff">{years}</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={HEAD} fontSize={140} fill={OUT}>9</text>
          <text x={0} y={116} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={32} fill="#5a6488">AÑOS</text>
        </g>
        {/* mapa: de Bélgica a España */}
        <g transform="translate(760 650)" opacity={pop(f, voT - 8, 12)}>
          <rect x={-250} y={-170} width={500} height={340} rx={24} fill="#16324f" stroke="#7fb4e8" strokeWidth={4} />
          <g transform="translate(-150 40) scale(0.62)">
            <path d={SPAIN} fill="#e9dcb8" stroke={OUT} strokeWidth={6} transform="translate(-190 -150)" />
          </g>
          <path d="M150 -110 Q 190 -120 205 -90 Q 200 -60 160 -60 Q 135 -80 150 -110 Z" fill="#e9dcb8" stroke={OUT} strokeWidth={5} />
          <text x={175} y={-28} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={22} fill="#cfe6ff">BÉLGICA</text>
          <path d={`M170 -85 Q 40 -150 ${lerp(trip, [0, 1], [170, -60])} ${lerp(trip, [0, 1], [-85, -10])}`} fill="none" stroke="#ffd23f" strokeWidth={7} strokeDasharray="16 10" />
          <circle cx={170} cy={-85} r={10} fill="#ffd23f" stroke={OUT} strokeWidth={3} />
          <g transform={`translate(${-60} ${-10})`} opacity={trip > 0.95 ? 1 : 0}>
            <circle r={12 + ((f % 30) / 30) * 26} fill="none" stroke="#ffd23f" strokeWidth={5} opacity={1 - (f % 30) / 30} />
            <circle r={12} fill="#ffd23f" stroke={OUT} strokeWidth={3} />
          </g>
          {/* maleta */}
          <g transform={`translate(${lerp(trip, [0, 1], [150, -40])} ${lerp(trip, [0, 0.5, 1], [60, 20, 90])}) scale(0.9)`}>
            <rect x={-46} y={-34} width={92} height={70} rx={10} fill="#8a4b2a" stroke={OUT} strokeWidth={5} />
            <path d="M-18 -34 V-50 H18 V-34" fill="none" stroke={OUT} strokeWidth={6} />
            <path d="M-46 -6 H46" stroke="#c9a227" strokeWidth={5} />
          </g>
        </g>
        <Pill x={540} y={860} text={f < diT - 2 ? 'NO EN CAMPAÑA' : '¿EN DICIEMBRE?'} s={pop(f, caT - 4, 10)} bg={f < diT - 2 ? '#ffffff' : '#ffc400'} color={OUT} size={44} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: DEBATE A OCHO Y ENCUESTAS ===================== */
const PARTIES: { n: string; c: string }[] = [
  { n: 'PP', c: '#1e5bd8' }, { n: 'PSOE', c: '#e3122b' }, { n: 'VOX', c: '#5fbf3a' }, { n: 'F. AMPLIO', c: '#8a3ab8' },
  { n: 'ERC', c: '#ffb000' }, { n: 'JUNTS', c: '#00b3a4' }, { n: 'BILDU', c: '#2f9a5a' }, { n: 'PNV', c: '#2a8a3a' },
];
export const DebateOchoScene: React.FC<P> = ({ f, T, seg }) => {
  const deT = wordAt(seg, 'debate'), ocT = wordAt(seg, 'ocho'), rtT = wordAt(seg, 'radiotelevision'), brT = wordAt(seg, 'bronco');
  const viT = wordAt(seg, 'vivienda'), paT = wordAt(seg, 'pactos'), etT = wordAt(seg, 'eta'), enT = wordAt(seg, 'encuestas');
  const caT = wordAt(seg, 'casi'), maT = wordAt(seg, 'mayoria'), ciT = wordAt(seg, 'cis'), gaT = wordAt(seg, 'ganador');
  const voT = wordAt(seg, 'votamos'), doT = wordAt(seg, 'domingo');
  const ph1 = lerp(f, [enT - 8, enT], [1, 0], null);
  const ph2 = lerp(f, [enT - 6, enT + 2], [0, 1], null) * lerp(f, [voT - 8, voT], [1, 0], null);
  const ph3 = lerp(f, [voT - 6, voT + 2], [0, 1], null);
  const shake = f >= brT && f < etT + 30 ? Math.sin(f * 1.7) * 3 : 0;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="d8-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1440" />
          <stop offset="0.6" stopColor="#1a2a78" />
          <stop offset="1" stopColor="#05081a" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#d8-bg)" />
      {/* pantalla de plató */}
      <g opacity={0.25}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={(i % 6) * 180} y={420 + Math.floor(i / 6) * 260} width={170} height={250} fill="#3a6bff" opacity={0.3 + 0.3 * Math.sin(T * 0.07 + i)} />
        ))}
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d="M0 0 L-80 900 L80 900 Z" fill="#9fc0ff" opacity={0.06} transform={`translate(${200 + i * 340} 380) rotate(${Math.sin(T * 0.05 + i * 2) * 14})`} />
      ))}
      <Particles T={T} n={30} color="#9fc0ff" seed={57} speed={0.2} size={2.5} op={0.4} />
      {/* fase 1: plató con ocho atriles */}
      <g opacity={ph1} transform={`translate(${shake} 0)`}>
        <g transform={`translate(540 520) scale(${pop(f, deT - 2, 10)})`}>
          <rect x={-250} y={-50} width={500} height={100} rx={20} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={0} y={24} textAnchor="middle" fontFamily={HEAD} fontSize={66} fill="#1b2f6e">DEBATE A 8</text>
          <g opacity={pop(f, rtT - 2, 10)}>
            <rect x={150} y={-74} width={130} height={46} rx={10} fill="#e3122b" stroke={OUT} strokeWidth={4} />
            <text x={215} y={-40} textAnchor="middle" fontFamily={HEAD} fontSize={32} fill="#ffffff">RTVE</text>
          </g>
        </g>
        {PARTIES.map((p, i) => {
          const row = Math.floor(i / 4), col = i % 4;
          const x = 150 + col * 260, y = 650 + row * 140;
          const s = pop(f, ocT - 4 + i * 2, 9);
          return (
            <g key={p.n} transform={`translate(${x} ${y}) scale(${0.85 * s})`}>
              <path d="M-80 0 L80 0 L66 110 L-66 110 Z" fill="#1d2440" stroke={OUT} strokeWidth={5} />
              <rect x={-92} y={-20} width={184} height={28} rx={8} fill={p.c} stroke={OUT} strokeWidth={5} />
              <rect x={-70} y={30} width={140} height={46} rx={8} fill="#ffffff" stroke={OUT} strokeWidth={4} />
              <text x={0} y={64} textAnchor="middle" fontFamily={HEAD} fontSize={p.n.length > 6 ? 26 : 34} fill={OUT}>{p.n}</text>
              <path d="M-6 -20 L-16 -70" stroke="#9aa3b5" strokeWidth={5} />
              <circle cx={-18} cy={-76} r={10} fill="#3a3f52" stroke={OUT} strokeWidth={3} />
            </g>
          );
        })}
        {/* rayos de choque */}
        {f >= brT && [0, 1, 2].map((i) => {
          const k = ((f - brT + i * 9) % 26) / 26;
          return (
            <path key={i} d="M0 -40 L-14 0 L8 0 L-8 44 L22 -8 L0 -8 L12 -40 Z" fill="#ffe14d" stroke={OUT} strokeWidth={4}
              transform={`translate(${280 + i * 260} ${720}) scale(${1.2 * Math.sin(k * Math.PI)})`} opacity={Math.sin(k * Math.PI)} />
          );
        })}
        <Pill x={540} y={600} text="BRONCO" s={pop(f, brT - 2, 8) * (1 - lerp(f, [viT - 4, viT], [0, 1]))} bg="#ff2d55" size={44} rot={-4} />
        {[['VIVIENDA', viT, '#ffc400'], ['PACTOS', paT, '#2fd8ff'], ['ETA', etT, '#ffffff']].map(([t, w, c], i) => (
          <Pill key={t as string} x={200 + i * 340} y={940} text={t as string} s={pop(f, (w as number) - 2, 9)} bg={c as string} color={OUT} size={40} />
        ))}
      </g>
      {/* fase 2: encuestas */}
      <g opacity={ph2}>
        <Pill x={540} y={500} text="ÚLTIMO DÍA DE ENCUESTAS" s={pop(f, enT - 2, 10)} bg="#ffc400" color={OUT} size={40} />
        <Card x={300} y={740} w={440} h={340} s={pop(f, caT - 2, 10)} bg="#ffffff">
          <text x={0} y={-110} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={28} fill="#5a6488">CASI TODAS</text>
          {['40dB', 'SIGMA DOS', 'NC REPORT', 'SOCIOMÉTRICA'].map((n, i) => (
            <text key={n} x={0} y={-62 + i * 34} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={24} fill="#8a93b8">{n}</text>
          ))}
          <g opacity={pop(f, maT - 2, 10)}>
            <rect x={-180} y={86} width={360} height={60} rx={14} fill="#1e5bd8" />
            <rect x={-180 + 360 * 0.62} y={86} width={360 * 0.38} height={60} fill="#5fbf3a" />
            <rect x={-180} y={86} width={360} height={60} rx={14} fill="none" stroke={OUT} strokeWidth={4} />
            <text x={0} y={128} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill="#ffffff" stroke={OUT} strokeWidth={5} paintOrder="stroke">PP + VOX: MAYORÍA</text>
          </g>
        </Card>
        <Card x={790} y={740} w={420} h={340} s={pop(f, ciT - 2, 10)} bg="#ffffff">
          <text x={0} y={-90} textAnchor="middle" fontFamily={HEAD} fontSize={86} fill={OUT}>CIS</text>
          <text x={0} y={-40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#5a6488">EN CAMBIO</text>
          <g opacity={pop(f, gaT - 2, 10)}>
            <rect x={-170} y={20} width={340} height={60} rx={14} fill="#e3122b" stroke={OUT} strokeWidth={4} />
            <text x={0} y={63} textAnchor="middle" fontFamily={HEAD} fontSize={38} fill="#ffffff">GANA EL PSOE</text>
            <text x={0} y={130} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={24} fill="#8a93b8">MAYORÍA ABSOLUTA: 176</text>
          </g>
        </Card>
        <text x={540} y={752} textAnchor="middle" fontFamily={HEAD} fontSize={60} fill="#ffe14d" stroke={OUT} strokeWidth={6} paintOrder="stroke" opacity={pop(f, ciT - 2, 10)}>VS</text>
      </g>
      {/* fase 3: urna del domingo */}
      <g opacity={ph3}>
        <g transform={`translate(540 760) scale(${pop(f, voT - 2, 10)})`}>
          <path d="M-170 -60 L170 -60 L150 170 L-150 170 Z" fill="#dfe8f5" fillOpacity={0.85} stroke={OUT} strokeWidth={7} />
          <rect x={-185} y={-90} width={370} height={40} rx={10} fill="#c9d6ea" stroke={OUT} strokeWidth={6} />
          <rect x={-80} y={-80} width={160} height={14} rx={7} fill={OUT} />
          {[0, 1, 2].map((i) => {
            const k = lerp(f, [voT + i * 8, voT + i * 8 + 16], [0, 1]);
            return (
              <g key={i} transform={`translate(${-40 + i * 40} ${-200 + k * 120})`} opacity={1 - lerp(k, [0.85, 1], [0, 1], null)}>
                <rect x={-34} y={-44} width={68} height={88} rx={5} fill="#ffffff" stroke={OUT} strokeWidth={4} />
                <path d="M-18 -10 L-4 6 L20 -22" stroke="#2fbf71" strokeWidth={7} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
          <text x={0} y={90} textAnchor="middle" fontFamily={HEAD} fontSize={80} fill="#1b2f6e">29-N</text>
        </g>
        <Pill x={540} y={520} text="VOTAMOS EL DOMINGO" s={pop(f, doT - 4, 10)} bg="#ffc400" color={OUT} size={44} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: HUANG VUELVE A NVIDIA Y REBOTE ===================== */
export const HuangScene: React.FC<P> = ({ f, T, seg }) => {
  const nvT = wordAt(seg, 'nvidia'), reT = wordAt(seg, 'readmite'), jeT = wordAt(seg, 'jefe'), seT = wordAt(seg, 'semanas');
  const diT = wordAt(seg, 'dimision'), acT = wordAt(seg, 'acciones'), dsT = wordAt(seg, 'disparan'), trT = wordAt(seg, 'treinta');
  const maT = wordAt(seg, 'mayor'), veT = wordAt(seg, 'veintitres'), naT = wordAt(seg, 'nasdaq'), ibT = wordAt(seg, 'ibex');
  const ph1 = lerp(f, [acT - 8, acT], [1, 0], null);
  const ph2 = lerp(f, [acT - 6, acT + 2], [0, 1], null) * lerp(f, [naT - 8, naT], [1, 0], null);
  const ph3 = lerp(f, [naT - 6, naT + 2], [0, 1], null);
  const chair = lerp(f, [reT, reT + 18], [0, 1]);
  const pct = lerp(f, [trT - 4, trT + 26], [0, 31.5]);
  const grow = lerp(f, [dsT - 4, dsT + 30], [0, 1]);
  const pts = Array.from({ length: 24 }).map((_, i) => {
    const x = -380 + i * 33;
    const base = 120 - Math.sin(i * 0.9) * 18 + (i < 16 ? i * 2 : 0);
    const y = i < 16 ? base : base - (i - 15) * 30 * grow;
    return `${x},${y}`;
  });
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="hu-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#061a10" />
          <stop offset="0.55" stopColor="#0d3a22" />
          <stop offset="1" stopColor="#030a06" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#hu-bg)" />
      {/* rejilla tipo chip */}
      <g stroke="#2fdc7a" strokeOpacity={0.12} strokeWidth={3}>
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M0 ${420 + i * 60} H1080`} />)}
        {Array.from({ length: 12 }).map((_, i) => <path key={`v${i}`} d={`M${i * 100} 400 V1000`} />)}
      </g>
      <Particles T={T} n={40} color="#7dffb0" seed={71} speed={-0.6} size={3} op={0.35} />
      {/* fase 1: el sillón del jefe */}
      <g opacity={ph1}>
        <Card x={540} y={505} w={420} h={90} s={pop(f, nvT - 2, 10)} bg="#0b0f0c">
          <text x={0} y={20} textAnchor="middle" fontFamily={HEAD} fontSize={60} fill="#76d43a" letterSpacing={6}>NVIDIA</text>
        </Card>
        {/* despacho */}
        <g transform="translate(330 770)">
          <rect x={-220} y={60} width={440} height={30} rx={8} fill="#5a3a22" stroke={OUT} strokeWidth={5} />
          <rect x={-200} y={90} width={24} height={90} fill="#3d2616" stroke={OUT} strokeWidth={4} />
          <rect x={176} y={90} width={24} height={90} fill="#3d2616" stroke={OUT} strokeWidth={4} />
          {/* silla que vuelve */}
          <g transform={`translate(${lerp(chair, [0, 1], [-260, 0], null)} 0) rotate(${(1 - chair) * -12})`} opacity={0.3 + chair * 0.7}>
            <rect x={-80} y={-170} width={160} height={190} rx={30} fill="#1a1d22" stroke={OUT} strokeWidth={6} />
            <rect x={-64} y={-156} width={128} height={30} rx={10} fill="#76d43a" opacity={0.8} />
            <rect x={-90} y={10} width={180} height={34} rx={12} fill="#262a31" stroke={OUT} strokeWidth={5} />
            <path d="M0 44 V60" stroke={OUT} strokeWidth={10} />
          </g>
          <g transform={`translate(0 76) scale(${pop(f, jeT - 2, 10)})`}>
            <rect x={-110} y={-24} width={220} height={48} rx={8} fill="#c9a227" stroke={OUT} strokeWidth={4} />
            <text x={0} y={12} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={OUT}>JENSEN HUANG</text>
          </g>
        </g>
        {/* calendario */}
        <g transform={`translate(800 720) scale(${pop(f, seT - 4, 10)})`}>
          <rect x={-170} y={-150} width={340} height={300} rx={24} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <rect x={-170} y={-150} width={340} height={64} rx={24} fill="#76d43a" stroke={OUT} strokeWidth={6} />
          <text x={0} y={-106} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={OUT}>NOVIEMBRE</text>
          <text x={-70} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={78} fill="#9aa3b5">12</text>
          <text x={-70} y={40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={20} fill="#c4001f" opacity={pop(f, diT - 4, 10)}>SE VA</text>
          <path d="M-20 -20 L40 -20" stroke={OUT} strokeWidth={6} markerEnd="" />
          <path d="M30 -32 L44 -20 L30 -8" fill="none" stroke={OUT} strokeWidth={6} />
          <text x={90} y={0} textAnchor="middle" fontFamily={HEAD} fontSize={78} fill={OUT}>23</text>
          <text x={90} y={40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={20} fill="#1d8a3a">VUELVE</text>
          <text x={0} y={110} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>2 SEMANAS</text>
        </g>
      </g>
      {/* fase 2: cohete en bolsa */}
      <g opacity={ph2}>
        <g transform="translate(540 760)">
          <rect x={-420} y={-230} width={840} height={420} rx={26} fill="#04130b" stroke="#2fdc7a" strokeWidth={4} opacity={0.92} />
          <polyline points={pts.join(' ')} fill="none" stroke="#2fdc7a" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
          {grow > 0.9 && (
            <g transform={`translate(${-380 + 23 * 33} ${120 - Math.sin(23 * 0.9) * 18 - 8 * 30}) rotate(-35)`}>
              <path d="M0 -36 Q 22 -10 18 26 L-18 26 Q -22 -10 0 -36 Z" fill="#ffffff" stroke={OUT} strokeWidth={4} />
              <circle cx={0} cy={-4} r={8} fill="#2fd8ff" stroke={OUT} strokeWidth={3} />
              <path d={`M-12 26 L0 ${46 + Math.sin(T) * 8} L12 26 Z`} fill="#ff8a1f" />
            </g>
          )}
          <text x={-150} y={-120} textAnchor="middle" fontFamily={HEAD} fontSize={130} fill="#ffffff" stroke={OUT} strokeWidth={8} paintOrder="stroke" opacity={f >= trT - 4 ? 1 : 0}>
            +{pct.toFixed(1).replace('.', ',')}%
          </text>
        </g>
        <Pill x={540} y={940} text="MAYOR SUBIDA EN 23 AÑOS" s={pop(f, maT - 2, 10)} bg="#ffc400" color={OUT} size={40} />
        <Stamp x={820} y={560} text="RÉCORD" s={pop(f, veT, 10)} color="#1d8a3a" size={46} rot={8} />
      </g>
      {/* fase 3: marcadores */}
      <g opacity={ph3}>
        {[
          ['NASDAQ', '+6,5%', naT], ['S&P 500', '+4,7%', naT + 8], ['IBEX 35', '+1,6%', ibT],
        ].map(([n, v, w], i) => (
          <g key={n as string} transform={`translate(540 ${560 + i * 140}) scale(${pop(f, (w as number) - 2, 10)})`}>
            <rect x={-360} y={-56} width={720} height={112} rx={22} fill="#0b0f0c" stroke="#2fdc7a" strokeWidth={5} />
            <text x={-320} y={20} fontFamily={HEAD} fontSize={60} fill="#ffffff">{n}</text>
            <path d="M150 20 L180 -20 L210 20 Z" fill="#2fdc7a" />
            <text x={330} y={22} textAnchor="end" fontFamily={HEAD} fontSize={64} fill="#2fdc7a">{v}</text>
          </g>
        ))}
        <Pill x={540} y={950} text="LUNES 23 DE NOVIEMBRE" s={pop(f, naT + 4, 10)} bg="#ffffff" color={OUT} size={34} />
      </g>
    </svg>
  );
};

/* ===================== 23-11: 815 MIGRANTES EN CANARIAS ===================== */
const Cayuco: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-50 -6 Q 0 4 50 -6 L40 14 Q 0 22 -40 14 Z" fill="#e9a23b" stroke={OUT} strokeWidth={4} />
    <path d="M-44 0 L44 0" stroke="#2a6bd8" strokeWidth={4} />
    {[-30, -15, 0, 15, 30].map((d) => <circle key={d} cx={d} cy={-12} r={6} fill="#2a2f40" />)}
  </g>
);
export const CayucosScene: React.FC<P> = ({ f, T, seg }) => {
  const caT = wordAt(seg, 'canarias'), ocT = wordAt(seg, 'ochocientos'), cyT = wordAt(seg, 'cayucos'), soT = wordAt(seg, 'solo');
  const seT = wordAt(seg, 'seis'), hiT = wordAt(seg, 'hierro'), teT = wordAt(seg, 'tenerife'), enT = wordAt(seg, 'entre');
  const meT = wordAt(seg, 'menores'), sgT = wordAt(seg, 'sigueme');
  const map = pop(f, caT - 6, 14);
  const cnt = lerp(f, [ocT - 2, ocT + 40], [0, 815]);
  const sail = (i: number) => lerp(f, [cyT + i * 4, cyT + 60 + i * 4], [0, 1]);
  const hl = (name: string) => (name === 'El Hierro' && f >= hiT) || (name === 'Tenerife' && f >= teT);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="cy-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050b1c" />
          <stop offset="0.5" stopColor="#0d2a4a" />
          <stop offset="1" stopColor="#020610" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#cy-bg)" />
      {Array.from({ length: 9 }).map((_, i) => {
        const y = 470 + i * 60;
        const ph = T * 0.05 * (1 + i * 0.1) + i;
        let d = `M-20 ${y}`;
        for (let x = -20; x <= 1100; x += 40) d += ` L${x} ${y + Math.sin(x * 0.012 + ph) * (6 + i)}`;
        return <path key={i} d={d} fill="none" stroke="#7fd6ff" strokeOpacity={0.08 + i * 0.015} strokeWidth={3} />;
      })}
      <Particles T={T} n={24} color="#ffffff" seed={93} speed={0.04} size={2} op={0.4} />
      <text x={540} y={545} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#9fd8ff" letterSpacing={6} opacity={pop(f, caT - 6, 14) * (1 - lerp(f, [enT - 6, enT + 4], [0, 1], null))}>ISLAS CANARIAS</text>
      {/* mapa de las islas */}
      <g opacity={map * (1 - lerp(f, [enT - 6, enT + 4], [0, 0.55], null))} transform={`translate(0 ${50 + (1 - map) * 40})`}>
        {ISLANDS.map((is) => (
          <g key={is.name} transform={`translate(${is.x} ${is.y})`}>
            <path d={is.d} fill={hl(is.name) ? '#ffb020' : '#e9dcb8'} stroke={OUT} strokeWidth={5} />
            {(is.name === 'El Hierro' || is.name === 'Tenerife') && (
              <text x={0} y={is.name === 'Tenerife' ? -70 : -40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill={hl(is.name) ? '#ffb020' : '#cfe6ff'}>{is.name.toUpperCase()}</text>
            )}
          </g>
        ))}
        {/* ocho cayucos: seis a El Hierro, dos a Tenerife */}
        {Array.from({ length: 8 }).map((_, i) => {
          const toH = i < 6;
          const k = sail(i);
          const sx = toH ? 30 + (i % 3) * 40 : 330 + (i - 6) * 60, sy = toH ? 880 + Math.floor(i / 3) * 20 : 880;
          const tx = toH ? 90 + (i % 3) * 44 : 470 + (i - 6) * 56, ty = toH ? 770 + Math.floor(i / 3) * 32 : 690 - (i - 6) * 8;
          return <Cayuco key={i} x={lerp(k, [0, 1], [sx, tx], null)} y={lerp(k, [0, 1], [sy, ty], null) + Math.sin(T * 0.15 + i) * 4} s={0.6 * pop(f, cyT - 4 + i * 2, 12)} r={toH ? -20 : -8} />;
        })}
        <Pill x={150} y={850} text="6 CAYUCOS" s={pop(f, seT - 2, 10)} bg="#ffb020" color={OUT} size={32} />
        <Pill x={460} y={770} text="2 CAYUCOS" s={pop(f, teT - 6, 10)} bg="#ffb020" color={OUT} size={32} />
      </g>
      {/* contador */}
      <g transform={`translate(800 885) scale(${0.75 * pop(f, ocT - 4, 10)})`} opacity={1 - lerp(f, [enT - 6, enT + 2], [0, 1], null)}>
        <rect x={-250} y={-90} width={500} height={190} rx={26} fill="#0a1830" stroke="#ffb020" strokeWidth={6} opacity={0.94} />
        <text x={0} y={24} textAnchor="middle" fontFamily={HEAD} fontSize={116} fill="#ffffff">{Math.round(cnt)}</text>
        <text x={0} y={76} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={23} fill="#ffb020" letterSpacing={1}>PERSONAS · 8 CAYUCOS · 1 DÍA</text>
      </g>
      {/* menores */}
      <Card x={540} y={700} w={560} h={170} s={pop(f, meT - 6, 11)} bg="#ffffff">
        <text x={0} y={10} textAnchor="middle" fontFamily={HEAD} fontSize={78} fill={OUT}>48 MENORES</text>
        <text x={0} y={52} textAnchor="middle" fontFamily={BODY} fontWeight={800} fontSize={24} fill="#5a6488">Y AL MENOS 73 MUJERES</text>
      </Card>
      <Pill x={540} y={890} text="SÍGUEME PARA MÁS" s={pop(f, sgT, 9)} bg="#ff2d55" size={40} />
    </svg>
  );
};

/* ===================== 24-11: PETROLEROS Y MINAS EN ORMUZ ===================== */
const QatarFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const n = 9, bw = w * 0.32;
  let d = `M${x} ${y} L${x + bw} ${y}`;
  for (let i = 0; i < n; i++) {
    const y0 = y + (h / n) * i;
    d += ` L${x + bw + w * 0.09} ${y0 + h / n / 2} L${x + bw} ${y0 + h / n}`;
  }
  d += ` L${x} ${y + h} Z`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#8a1538" />
      <path d={d} fill="#ffffff" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
    </g>
  );
};
const Tanker: React.FC<{ x: number; y: number; s: number; burn: number; T: number; flip?: boolean }> = ({ x, y, s, burn, T, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-150 0 L150 0 L128 40 L-136 40 Z" fill="#a8332a" stroke={OUT} strokeWidth={5} />
    <path d="M-150 0 L150 0 L146 12 L-148 12 Z" fill="#20242e" />
    <rect x={-120} y={-20} width={190} height={20} fill="#2c3242" stroke={OUT} strokeWidth={4} />
    {[-100, -60, -20, 20].map((cx) => <ellipse key={cx} cx={cx} cy={-22} rx={16} ry={7} fill="#5a6478" stroke={OUT} strokeWidth={3} />)}
    <rect x={88} y={-62} width={50} height={62} fill="#e8ecf4" stroke={OUT} strokeWidth={4} />
    <rect x={94} y={-54} width={38} height={10} fill="#7fd6ff" />
    <rect x={112} y={-88} width={14} height={26} fill="#2c3242" stroke={OUT} strokeWidth={3} />
    {burn > 0 && (
      <g opacity={burn}>
        <Flame x={-60} y={-24} s={0.7 * burn} T={T} />
        <Flame x={10} y={-22} s={0.55 * burn} T={T + 7} />
        {[0, 1, 2, 3].map((i) => {
          const g = (T * 0.9 + i * 22) % 88;
          return <circle key={i} cx={-30 + Math.sin(g * 0.07 + i) * 26} cy={-90 - g * 1.8} r={18 + g * 0.45} fill="#3a3f4c" opacity={0.6 * (1 - g / 88)} />;
        })}
      </g>
    )}
  </g>
);
const Mine: React.FC<{ x: number; y: number; s: number; T: number }> = ({ x, y, s, T }) => (
  <g transform={`translate(${x} ${y + Math.sin(T * 0.1 + x) * 5}) scale(${s})`}>
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <path key={i} d={`M${Math.cos(a) * 18} ${Math.sin(a) * 18} L${Math.cos(a) * 32} ${Math.sin(a) * 32}`} stroke={OUT} strokeWidth={7} strokeLinecap="round" />;
    })}
    <circle r={22} fill="#3b404c" stroke={OUT} strokeWidth={4} />
    <circle cx={-7} cy={-7} r={6} fill="#8892a6" />
    <circle cx={0} cy={0} r={4} fill="#ff3b4e" opacity={0.5 + 0.5 * Math.sin(T * 0.4 + x)} />
  </g>
);
export const MinasScene: React.FC<P> = ({ f, T, seg }) => {
  const orT = wordAt(seg, 'ormuz'), doT = wordAt(seg, 'dos'), peT = wordAt(seg, 'petroleros'), miT = wordAt(seg, 'minas');
  const inT = wordAt(seg, 'incendiado'), jeT = wordAt(seg, 'jefe'), blT = wordAt(seg, 'bloqueo'), diT = wordAt(seg, 'dia');
  const amT = wordAt(seg, 'amenaza'), esT = wordAt(seg, 'estados'), apT = wordAt(seg, 'aplastante'), caT = wordAt(seg, 'catar');
  const reT = wordAt(seg, 'reabrir');
  const ph1 = lerp(f, [jeT - 8, jeT], [1, 0], null);
  const ph2 = lerp(f, [jeT - 6, jeT + 2], [0, 1], null) * lerp(f, [caT - 8, caT], [1, 0], null);
  const ph3 = lerp(f, [caT - 6, caT + 2], [0, 1], null);
  const glide = lerp(f, [peT - 10, miT + 6], [0, 1]);
  const hit = lerp(f, [miT + 2, miT + 8], [0, 1]);
  const burn = lerp(f, [miT + 4, inT + 6], [0, 1]);
  const boom = (s: number) => (f > s && f < s + 22 ? (f - s) / 22 : 0);
  const tighten = lerp(f, [blT, blT + 70], [0, 1]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="mn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040812" /><stop offset="0.5" stopColor="#0b2038" /><stop offset="1" stopColor="#020509" />
        </linearGradient>
        <radialGradient id="mn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8a1f" stopOpacity="0.55" /><stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#mn-bg)" />
      {Array.from({ length: 10 }).map((_, i) => {
        const y = 560 + i * 44;
        const ph = T * 0.05 * (1 + i * 0.1) + i;
        let d = `M-20 ${y}`;
        for (let x = -20; x <= 1100; x += 40) d += ` L${x} ${y + Math.sin(x * 0.013 + ph) * (4 + i * 0.6)}`;
        return <path key={i} d={d} fill="none" stroke="#7fd6ff" strokeOpacity={0.07 + i * 0.012} strokeWidth={3} />;
      })}
      <Particles T={T} n={26} color="#ffffff" seed={131} speed={0.03} size={2} op={0.35} />
      {/* fase 1: estrecho con minas y petroleros */}
      <g opacity={ph1}>
        <path d="M0 470 L1080 470 L1080 540 Q 820 600 640 560 Q 470 520 300 580 Q 150 620 0 590 Z" fill="#1d3a2c" stroke="#3dffa0" strokeOpacity={0.4} strokeWidth={3} opacity={pop(f, 0, 14)} />
        <path d="M0 960 L1080 960 L1080 900 Q 880 850 720 900 Q 560 940 420 880 Q 240 830 0 880 Z" fill="#2a2a1c" stroke="#ffd27a" strokeOpacity={0.35} strokeWidth={3} opacity={pop(f, 0, 14)} />
        <text x={860} y={530} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill="#3dffa0" letterSpacing={6} opacity={pop(f, orT - 6, 12)}>IRÁN</text>
        <text x={540} y={745} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#9fd8ff" letterSpacing={14} opacity={0.35 * pop(f, orT - 4, 14)}>ESTRECHO DE ORMUZ</text>
        {[[250, 700], [480, 650], [700, 780], [880, 690], [380, 820], [600, 860]].map(([x, y], i) => (
          <Mine key={i} x={x} y={y} s={0.9 * pop(f, miT - 10 + i * 2, 10)} T={T} />
        ))}
        {[0, 1].map((i) => {
          const tx = i === 0 ? lerp(glide, [0, 1], [-200, 360], null) : lerp(glide, [0, 1], [1280, 720], null);
          const ty = i === 0 ? 690 : 820;
          const shake = hit > 0 && hit < 1 ? Math.sin(f * 4) * 6 : 0;
          const b = boom(miT + 2 + i * 4);
          return (
            <g key={i}>
              {burn > 0 && <circle cx={tx} cy={ty - 30} r={160} fill="url(#mn-glow)" opacity={burn} />}
              <Tanker x={tx + shake} y={ty} s={0.8 * pop(f, peT - 6 + i * 4, 12)} burn={burn} T={T + i * 11} flip={i === 1} />
              {b > 0 && <circle cx={tx} cy={ty} r={40 + b * 200} fill="none" stroke="#ffd23f" strokeWidth={14 * (1 - b)} opacity={1 - b} />}
            </g>
          );
        })}
        <Pill x={540} y={560} text="AL MENOS 2 PETROLEROS" s={pop(f, doT - 2, 10)} bg="#ffffff" color={OUT} size={38} />
        <Pill x={300} y={930} text="MINAS" s={pop(f, miT, 10)} bg="#ff3b4e" size={38} />
        <Pill x={760} y={930} text="INCENDIADOS" s={pop(f, inT, 10)} bg="#ff8a1f" color={OUT} size={38} />
      </g>
      {/* fase 2: bloqueo que se estrecha y amenaza */}
      <g opacity={ph2}>
        <g transform={`translate(540 600) scale(${pop(f, jeT - 4, 10)})`}>
          <rect x={-400} y={-80} width={800} height={160} rx={26} fill="#0b1220" stroke="#3dffa0" strokeWidth={5} opacity={0.95} />
          <IranFlag x={-370} y={-46} w={130} h={92} />
          <text x={-210} y={-12} fontFamily={HEAD} fontSize={42} fill="#ffffff">JEFE DEL EJÉRCITO IRANÍ</text>
          <text x={-210} y={40} fontFamily={BODY} fontWeight={900} fontSize={30} fill="#3dffa0">«ENDURECER EL BLOQUEO»</text>
        </g>
        {/* barra de bloqueo que crece día a día */}
        <g transform="translate(540 760)" opacity={pop(f, blT - 4, 10)}>
          <rect x={-400} y={-36} width={800} height={72} rx={36} fill="#14202e" stroke={OUT} strokeWidth={5} />
          <rect x={-394} y={-30} width={788 * (0.25 + 0.75 * tighten)} height={60} rx={30} fill="#ff3b4e" />
          {Array.from({ length: 7 }).map((_, i) => (
            <text key={i} x={-350 + i * 116} y={12} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#ffffff" opacity={f >= diT + i * 6 ? 1 : 0.25}>DÍA {i + 1}</text>
          ))}
        </g>
        <g transform={`translate(270 900) scale(${pop(f, esT - 2, 10)})`}>
          <rect x={-170} y={-50} width={340} height={100} rx={18} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <USFlag x={-150} y={-30} w={90} h={60} />
          <text x={50} y={14} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>EE. UU.</text>
        </g>
        <Stamp x={760} y={900} text="APLASTANTE" s={pop(f, apT, 9)} color="#c4001f" size={44} rot={-6} />
        <Pill x={540} y={530} text="AMENAZA" s={pop(f, amT - 2, 10) * 0} bg="#ff3b4e" size={30} />
      </g>
      {/* fase 3: Catar media */}
      <g opacity={ph3}>
        <Card x={540} y={650} w={760} h={250} s={pop(f, caT - 4, 11)} bg="#ffffff">
          <QatarFlag x={-340} y={-70} w={200} h={140} />
          <text x={90} y={-20} textAnchor="middle" fontFamily={HEAD} fontSize={78} fill="#8a1538">CATAR</text>
          <text x={90} y={40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={30} fill="#5a6488">MEDIA EN WASHINGTON</text>
        </Card>
        {[0, 1].map((i) => {
          const s = pop(f, reT - 2 + i * 8, 10);
          const x = i ? 740 : 340;
          return (
            <g key={i} transform={`translate(${x} ${870 + Math.sin(T * 0.12 + i) * 6}) scale(${s})`}>
              <path d="M-110 -50 H110 Q 130 -50 130 -30 V20 Q 130 40 110 40 H-20 L-50 70 L-46 40 H-110 Q -130 40 -130 20 V-30 Q -130 -50 -110 -50 Z" fill={i ? '#1e5bd8' : '#239f40'} stroke={OUT} strokeWidth={6} transform={i ? 'scale(-1 1)' : ''} />
              <text x={0} y={8} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill="#ffffff">{i ? 'EE. UU.' : 'IRÁN'}</text>
            </g>
          );
        })}
        <Pill x={540} y={950} text="REABRIR EL DIÁLOGO" s={pop(f, reT + 10, 10)} bg="#ffc400" color={OUT} size={34} />
      </g>
    </svg>
  );
};

/* ===================== 24-11: PERMISO POR NACIMIENTO DE 20 SEMANAS ===================== */
export const PermisosScene: React.FC<P> = ({ f, T, seg }) => {
  const ulT = wordAt(seg, 'ultimo'), coT = wordAt(seg, 'consejo'), naT = wordAt(seg, 'nacimiento'), veT = wordAt(seg, 'veinte');
  const prT = wordAt(seg, 'progenitor'), duT = wordAt(seg, 'duelo'), diT = wordAt(seg, 'diez'), trT = wordAt(seg, 'transporte');
  const mdT = wordAt(seg, 'dos'), opT = wordAt(seg, 'oposicion'), ofT = wordAt(seg, 'ofensiva');
  const ph1 = lerp(f, [duT - 8, duT], [1, 0], null);
  const ph2 = lerp(f, [duT - 6, duT + 2], [0, 1], null);
  const weeks = Math.floor(lerp(f, [naT, veT + 10], [0, 20]));
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="pm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1040" /><stop offset="0.55" stopColor="#3a2a7a" /><stop offset="1" stopColor="#0a0620" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#pm-bg)" />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = rnd(i + 401) * 1080, y = 480 + rnd(i + 77) * 480;
        return <circle key={i} cx={x} cy={y + Math.sin(T * 0.05 + i) * 10} r={6 + rnd(i) * 10} fill={i % 2 ? '#ffd0e0' : '#bfe4ff'} opacity={0.18} />;
      })}
      <Pill x={540} y={510} text="ÚLTIMO CONSEJO DE MINISTROS ANTES DEL 29N" s={pop(f, ulT, 10) * ph1} bg="#ffffff" color={OUT} size={30} />
      {/* fase 1: calendario de 20 semanas */}
      <g opacity={ph1}>
        <g transform={`translate(540 740) scale(${pop(f, coT, 12)})`}>
          <rect x={-420} y={-170} width={840} height={340} rx={30} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-420} y={-170} width={840} height={70} rx={30} fill="#ff7a59" stroke={OUT} strokeWidth={7} />
          <text x={-390} y={-120} fontFamily={HEAD} fontSize={40} fill="#ffffff">PERMISO POR NACIMIENTO</text>
          {Array.from({ length: 20 }).map((_, i) => {
            const on = i < weeks;
            const x = -380 + (i % 10) * 76, y = -80 + Math.floor(i / 10) * 86;
            return (
              <g key={i} transform={`translate(${x + 32} ${y + 34}) scale(${on ? 1 : 0.85})`}>
                <rect x={-32} y={-34} width={64} height={68} rx={12} fill={on ? '#4f7fc9' : '#e4e8f2'} stroke={OUT} strokeWidth={4} />
                <text x={0} y={12} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={on ? '#ffffff' : '#9aa3b5'}>{i + 1}</text>
              </g>
            );
          })}
          <text x={0} y={150} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill={OUT} opacity={pop(f, prT - 2, 10)}>POR CADA PROGENITOR</text>
        </g>
        <Stamp x={800} y={610} text={`${weeks} SEMANAS`} s={pop(f, veT, 9)} color="#c4001f" size={40} rot={6} />
      </g>
      {/* fase 2: duelo, transporte y crítica */}
      <g opacity={ph2}>
        <Card x={300} y={600} w={440} h={200} s={pop(f, duT - 4, 10)} bg="#ffffff">
          <text x={0} y={-40} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={28} fill="#5a6488">PERMISO POR DUELO</text>
          <text x={0} y={50} textAnchor="middle" fontFamily={HEAD} fontSize={92} fill={OUT}>{Math.round(lerp(f, [diT - 2, diT + 14], [0, 10]))} DÍAS</text>
        </Card>
        <Card x={780} y={600} w={440} h={200} s={pop(f, trT - 4, 10)} bg="#ffffff">
          {/* tren */}
          <g transform={`translate(${-110 + ((T * 2) % 40) - 20} -10)`}>
            <rect x={-80} y={-46} width={160} height={84} rx={20} fill="#e3122b" stroke={OUT} strokeWidth={5} />
            <rect x={-62} y={-32} width={50} height={30} rx={6} fill="#7fd6ff" stroke={OUT} strokeWidth={3} />
            <rect x={6} y={-32} width={50} height={30} rx={6} fill="#7fd6ff" stroke={OUT} strokeWidth={3} />
            <circle cx={-44} cy={44} r={12} fill={OUT} /><circle cx={44} cy={44} r={12} fill={OUT} />
          </g>
          <text x={90} y={-10} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={OUT}>AYUDAS</text>
          <text x={90} y={30} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">TRANSPORTE</text>
          <text x={0} y={84} textAnchor="middle" fontFamily={HEAD} fontSize={34} fill="#1d8a3a" opacity={pop(f, mdT - 6, 10)}>PRORROGADAS EN 2027</text>
        </Card>
        <g transform={`translate(540 830) scale(${pop(f, opT - 2, 10)})`}>
          <rect x={-380} y={-60} width={760} height={120} rx={24} fill="#0b0f1c" stroke="#ffc400" strokeWidth={5} />
          <text x={0} y={-10} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={26} fill="#ffc400">LA OPOSICIÓN:</text>
          <text x={0} y={36} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#ffffff" opacity={pop(f, ofT - 2, 10)}>«OFENSIVA DE ÚLTIMA HORA»</text>
        </g>
      </g>
    </svg>
  );
};

/* ===================== 24-11: BRUSELAS AVISA DE DÉFICIT EXCESIVO ===================== */
export const DeficitScene: React.FC<P> = ({ f, T, seg }) => {
  const brT = wordAt(seg, 'bruselas'), esT = wordAt(seg, 'espana'), exT = wordAt(seg, 'expediente'), deT = wordAt(seg, 'deficit');
  const coT = wordAt(seg, 'comisario'), gaT = wordAt(seg, 'gasto'), ceT = wordAt(seg, 'cero'), piT = wordAt(seg, 'pib');
  const ciT = wordAt(seg, 'cinco'), mlT = wordAt(seg, 'millones'), pmT = wordAt(seg, 'primavera');
  const ph1 = lerp(f, [coT - 8, coT], [1, 0], null);
  const ph2 = lerp(f, [coT - 6, coT + 2], [0, 1], null) * lerp(f, [pmT - 8, pmT], [1, 0], null);
  const ph3 = lerp(f, [pmT - 6, pmT + 2], [0, 1], null);
  const bar = lerp(f, [ceT - 4, ceT + 26], [0, 0.9]);
  const money = lerp(f, [ciT - 2, ciT + 30], [0, 5100]);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="df-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#020a2a" /><stop offset="0.55" stopColor="#0a2a7a" /><stop offset="1" stopColor="#010418" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#df-bg)" />
      <g opacity={0.12}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + T * 0.004;
          return <text key={i} x={540 + Math.cos(a) * 430} y={720 + Math.sin(a) * 330} textAnchor="middle" fontSize={60} fill="#ffcc00">★</text>;
        })}
      </g>
      {/* fase 1: Bruselas, España y el expediente */}
      <g opacity={ph1}>
        <g transform={`translate(270 650) scale(${pop(f, brT - 2, 11)})`}>
          <EUFlag x={-150} y={-100} w={300} h={200} spin={T * 0.01} />
          <text x={0} y={150} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#ffffff">BRUSELAS</text>
        </g>
        <g transform={`translate(810 650) scale(${pop(f, esT - 2, 11)})`}>
          <SpainFlag x={-150} y={-100} w={300} h={200} />
          <text x={0} y={150} textAnchor="middle" fontFamily={HEAD} fontSize={46} fill="#ffffff">ESPAÑA</text>
        </g>
        {/* flecha de aviso */}
        <g opacity={pop(f, esT + 4, 10)}>
          <path d={`M440 650 L${440 + 180 * lerp(f, [esT + 4, esT + 16], [0, 1])} 650`} stroke="#ffcc00" strokeWidth={14} strokeLinecap="round" />
          <g transform={`translate(540 560) scale(${pop(f, esT + 8, 9)})`}>
            <path d="M0 -50 L56 46 L-56 46 Z" fill="#ffcc00" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
            <text x={0} y={36} textAnchor="middle" fontFamily={HEAD} fontSize={62} fill={OUT}>!</text>
          </g>
        </g>
        {/* carpeta de expediente */}
        <g transform={`translate(470 880) scale(${pop(f, exT - 2, 10)}) rotate(-3)`}>
          <path d="M-260 -60 L-100 -60 L-80 -80 L60 -80 L80 -60 L260 -60 L260 60 L-260 60 Z" fill="#e9c46a" stroke={OUT} strokeWidth={6} />
          <text x={0} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill={OUT}>EXPEDIENTE</text>
        </g>
        <Stamp x={700} y={820} text="DÉFICIT EXCESIVO" s={pop(f, deT, 9)} color="#c4001f" size={40} rot={8} />
      </g>
      {/* fase 2: el desvío del gasto */}
      <g opacity={ph2}>
        <Card x={540} y={540} w={800} h={110} s={pop(f, coT - 4, 10)} bg="#ffffff">
          <EUFlag x={-380} y={-36} w={100} h={72} />
          <text x={50} y={-6} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill={OUT}>VALDIS DOMBROVSKIS</text>
          <text x={50} y={34} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={22} fill="#5a6488">COMISARIO EUROPEO DE ECONOMÍA</text>
        </Card>
        <g transform="translate(540 735)" opacity={pop(f, gaT - 4, 10)}>
          <text x={-400} y={-70} fontFamily={BODY} fontWeight={900} fontSize={26} fill="#cfe0ff">DESVÍO DEL GASTO (% DEL PIB)</text>
          <rect x={-400} y={-40} width={800} height={80} rx={20} fill="#0b1640" stroke={OUT} strokeWidth={5} />
          <rect x={-394} y={-34} width={788 * (bar / 1.2)} height={68} rx={16} fill={bar > 0.6 ? '#ff3b4e' : '#ffcc00'} />
          {/* umbral 0,6 */}
          <path d={`M${-400 + 800 * (0.6 / 1.2)} -56 V56`} stroke="#ffffff" strokeWidth={6} strokeDasharray="10 8" />
          <text x={-400 + 800 * (0.6 / 1.2)} y={86} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={22} fill="#ffffff">LÍMITE 0,6</text>
          <text x={-394 + 788 * (bar / 1.2) - 14} y={18} textAnchor="end" fontFamily={HEAD} fontSize={48} fill="#ffffff" opacity={f >= ceT - 2 ? 1 : 0}>{bar.toFixed(1).replace('.', ',')}%</text>
        </g>
        <g transform={`translate(540 905) scale(${pop(f, ciT - 4, 10)})`}>
          <rect x={-330} y={-56} width={660} height={112} rx={24} fill="#0b0f1c" stroke="#ffcc00" strokeWidth={5} />
          <text x={0} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={66} fill="#ffcc00">≈ {fmtCount(money)} M€</text>
        </g>
        <Pill x={880} y={640} text="PIB" s={pop(f, piT - 2, 10) * 0} bg="#ffffff" color={OUT} size={30} />
        <text x={0} y={0} opacity={0}>{mlT}</text>
      </g>
      {/* fase 3: decisión en primavera */}
      <g opacity={ph3}>
        <g transform={`translate(540 700) scale(${pop(f, pmT - 4, 11)})`}>
          <rect x={-300} y={-200} width={600} height={400} rx={30} fill="#ffffff" stroke={OUT} strokeWidth={7} />
          <rect x={-300} y={-200} width={600} height={90} rx={30} fill="#3fbf6a" stroke={OUT} strokeWidth={7} />
          <text x={0} y={-138} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill="#ffffff">SE DECIDE EN</text>
          <text x={0} y={30} textAnchor="middle" fontFamily={HEAD} fontSize={110} fill={OUT}>PRIMAVERA</text>
          <text x={0} y={110} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill="#3fbf6a">2027</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${-240 + i * 120} 170) rotate(${Math.sin(T * 0.1 + i) * 8})`}>
              <circle r={22} fill={i % 2 ? '#ff7ab0' : '#ffd23f'} stroke={OUT} strokeWidth={4} />
              <circle r={8} fill="#ffffff" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

/* ===================== 24-11: BOMBARDEO RUSO EN ZAPORIYIA ===================== */
export const ZaporiyiaScene: React.FC<P> = ({ f, T, seg }) => {
  const ucT = wordAt(seg, 'ucrania'), boT = wordAt(seg, 'bombardeo'), zaT = wordAt(seg, 'zaporiyia'), maT = wordAt(seg, 'mata');
  const trT = wordAt(seg, 'treinta'), beT = wordAt(seg, 'bebe'), edT = wordAt(seg, 'edificio'), nuT = wordAt(seg, 'nueve');
  const paT = wordAt(seg, 'parcialmente'), sgT = wordAt(seg, 'sigueme');
  const flash = f > boT && f < boT + 14 ? 1 - (f - boT) / 14 : 0;
  const zoom = lerp(f, [edT - 6, edT + 16], [0, 1]);
  const bx = 540, by = 790;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="zp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05060c" /><stop offset="0.55" stopColor="#1a1626" /><stop offset="1" stopColor="#040408" />
        </linearGradient>
        <radialGradient id="zp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff7a1f" stopOpacity="0.5" /><stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#zp-bg)" />
      <Particles T={T} n={30} color="#ffb27a" seed={211} speed={-0.5} size={3} op={0.35} />
      {/* skyline */}
      <g transform={`translate(${bx} ${by}) scale(${1 + zoom * 0.25}) translate(${-bx} ${-by})`}>
        {[[60, 120, 260], [190, 90, 200], [300, 110, 300], [780, 120, 280], [910, 100, 220], [1010, 90, 260]].map(([x, w, h], i) => (
          <g key={i} opacity={0.75}>
            <rect x={x - w / 2} y={960 - h} width={w} height={h} fill="#232838" stroke={OUT} strokeWidth={4} />
            {Array.from({ length: Math.floor(h / 40) }).map((_, r) => (
              <g key={r}>{[0, 1].map((c) => <rect key={c} x={x - w / 2 + 16 + c * (w / 2)} y={960 - h + 16 + r * 40} width={w / 2 - 30} height={18} fill={rnd(i * 31 + r * 7 + c) > 0.6 ? '#ffd27a' : '#141822'} opacity={0.7} />)}</g>
            ))}
          </g>
        ))}
        {/* edificio de nueve plantas */}
        <g opacity={pop(f, 0, 12)}>
          <circle cx={bx} cy={by + 130} r={230} fill="url(#zp-glow)" opacity={0.6 + 0.2 * Math.sin(T * 0.3)} />
          <rect x={bx - 130} y={960 - 9 * 40} width={260} height={9 * 40} fill="#3a3f52" stroke={OUT} strokeWidth={6} />
          {Array.from({ length: 9 }).map((_, r) => {
            const lit = f >= nuT + (8 - r) * 2;
            return (
              <g key={r}>
                <path d={`M${bx - 130} ${960 - r * 40} H${bx + 130}`} stroke={lit ? '#ffcc00' : '#2a2f40'} strokeWidth={lit ? 4 : 3} />
                {[0, 1, 2, 3].map((c) => {
                  const broken = r === 0 && c < 3;
                  return <rect key={c} x={bx - 112 + c * 60} y={960 - r * 40 - 32} width={44} height={22} fill={broken ? '#0a0a0e' : rnd(r * 9 + c + 5) > 0.5 ? '#ffd27a' : '#1a1e2a'} stroke={OUT} strokeWidth={3} opacity={broken ? 1 : 0.8} />;
                })}
              </g>
            );
          })}
          {/* primera planta destruida */}
          <path d={`M${bx - 130} 960 L${bx - 130} 912 L${bx - 80} 924 L${bx - 40} 906 L${bx + 10} 928 L${bx + 50} 910 L${bx + 50} 960 Z`} fill="#0a0a0e" stroke="#ff7a1f" strokeWidth={4} opacity={pop(f, paT - 4, 10) > 0 ? 1 : 0.9} />
          <Flame x={bx - 80} y={958} s={0.6} T={T} />
          <Flame x={bx + 10} y={958} s={0.45} T={T + 5} />
          {[0, 1, 2, 3, 4].map((i) => {
            const g = (T * 0.7 + i * 20) % 100;
            return <circle key={i} cx={bx - 40 + Math.sin(g * 0.06 + i) * 50} cy={900 - g * 3.4} r={24 + g * 0.6} fill="#4a4e5c" opacity={0.5 * (1 - g / 100)} />;
          })}
        </g>
        <rect x={0} y={958} width={1080} height={10} fill="#0b0c12" />
      </g>
      {flash > 0 && <rect width={1080} height={1920} fill="#ffb27a" opacity={flash * 0.45} />}
      {/* rótulos */}
      <g transform={`translate(170 500) scale(${pop(f, ucT - 2, 10)})`}>
        <UkraineFlag x={-80} y={-36} w={110} h={72} />
        <text x={46} y={12} fontFamily={HEAD} fontSize={36} fill="#ffffff">UCRANIA</text>
      </g>
      <Pill x={790} y={500} text="ZAPORIYIA" s={pop(f, zaT, 10)} bg="#ffffff" color={OUT} size={40} />
      <g opacity={1 - lerp(f, [edT - 4, edT + 4], [0, 1], null)}>
        <Card x={210} y={700} w={300} h={160} s={pop(f, maT, 10)} bg="#ffffff">
          <text x={0} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={80} fill="#c4001f">2</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">MUERTOS</text>
        </Card>
        <Card x={870} y={700} w={300} h={160} s={pop(f, trT - 2, 10)} bg="#ffffff">
          <text x={0} y={22} textAnchor="middle" fontFamily={HEAD} fontSize={80} fill={OUT}>+30</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={BODY} fontWeight={900} fontSize={24} fill="#5a6488">HERIDOS</text>
        </Card>
        <Pill x={540} y={592} text="ENTRE ELLOS UN BEBÉ" s={pop(f, beT - 4, 10)} bg="#ff8a1f" color={OUT} size={34} />
      </g>
      <Pill x={540} y={592} text="EDIFICIO DE 9 PLANTAS" s={pop(f, nuT - 2, 10) * (1 - pop(f, sgT, 9))} bg="#ffcc00" color={OUT} size={36} />
      <Pill x={540} y={592} text="SÍGUEME PARA MÁS" s={pop(f, sgT, 9)} bg="#ff2d55" size={40} />
    </svg>
  );
};
