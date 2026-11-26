import React from 'react';

export type Expression = 'happy' | 'wink' | 'serious' | 'shock' | 'dizzy' | 'hearts' | 'stars';
export type Costume = 'anchor' | 'boxing' | 'vest' | 'raincoat' | 'baby' | 'helmet' | 'diplomat' | 'astronaut' | 'business' | 'firefighter' | 'judge' | 'deputy' | 'conductor' | 'officer' | 'riot' | 'navy' | 'rescuer' | 'eco' | 'maritime' | 'parent' | 'pilot';
export type ArmPose = 'thumb' | 'down' | 'hold' | 'punch';

export type RobotProps = {
  t: number; // global frame (for idle loops)
  expression: Expression;
  talk: number; // 0..1 mouth opening
  costume: Costume;
  arm: ArmPose;
  armLift?: number; // 0..1 extra lift for punch/thumb
  timer: string;
  blink: number; // 0..1 (1 = closed)
  item?: 'none' | 'umbrella' | 'bottle' | 'flags' | 'glove' | 'briefcase' | 'gavel';
  umbrellaFly?: number; // 0..1
  umbrellaFlip?: number; // 0..1
  partyHat?: number; // 0..1
  eyeColor?: string;
  coffee?: number; // 0..1
};

const OUT = '#05080f';
const CY = '#5ff0ff';

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="rb-chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.35" stopColor="#dfe6f1" />
      <stop offset="0.7" stopColor="#a9b5ca" />
      <stop offset="1" stopColor="#6c7891" />
    </linearGradient>
    <linearGradient id="rb-chromeSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#7d89a2" />
      <stop offset="0.25" stopColor="#eef2f8" />
      <stop offset="0.6" stopColor="#c3ccdb" />
      <stop offset="1" stopColor="#5e6a82" />
    </linearGradient>
    <linearGradient id="rb-graphite" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4a5470" />
      <stop offset="0.5" stopColor="#262d45" />
      <stop offset="1" stopColor="#0f1324" />
    </linearGradient>
    <linearGradient id="rb-graphiteSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#1a2034" />
      <stop offset="0.3" stopColor="#4b5674" />
      <stop offset="0.7" stopColor="#2a3150" />
      <stop offset="1" stopColor="#121729" />
    </linearGradient>
    <linearGradient id="rb-red" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ff5a6a" />
      <stop offset="1" stopColor="#b3001e" />
    </linearGradient>
    <linearGradient id="rb-visor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1c2a52" />
      <stop offset="0.5" stopColor="#070c1c" />
      <stop offset="1" stopColor="#0d1630" />
    </linearGradient>
    <radialGradient id="rb-ballRed" cx="35%" cy="30%" r="70%">
      <stop offset="0" stopColor="#ffd0d5" />
      <stop offset="0.35" stopColor="#ff3b4e" />
      <stop offset="1" stopColor="#8a0014" />
    </radialGradient>
    <radialGradient id="rb-joint" cx="35%" cy="30%" r="75%">
      <stop offset="0" stopColor="#6d7a9a" />
      <stop offset="1" stopColor="#121729" />
    </radialGradient>
    <linearGradient id="rb-orange" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffa040" />
      <stop offset="1" stopColor="#e2560a" />
    </linearGradient>
    <linearGradient id="rb-yellow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffe45c" />
      <stop offset="1" stopColor="#e9a800" />
    </linearGradient>
    <linearGradient id="rb-camo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#6f7d3c" />
      <stop offset="1" stopColor="#38421c" />
    </linearGradient>
    <linearGradient id="rb-suit" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#c9d2e0" />
      <stop offset="0.35" stopColor="#ffffff" />
      <stop offset="1" stopColor="#a4afc2" />
    </linearGradient>
    <radialGradient id="rb-glass" cx="35%" cy="25%" r="80%">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
      <stop offset="0.5" stopColor="#9fe8ff" stopOpacity="0.08" />
      <stop offset="1" stopColor="#9fe8ff" stopOpacity="0.25" />
    </radialGradient>
    <radialGradient id="rb-glove" cx="35%" cy="30%" r="75%">
      <stop offset="0" stopColor="#ff8a8a" />
      <stop offset="0.5" stopColor="#e3122b" />
      <stop offset="1" stopColor="#7a0010" />
    </radialGradient>
    <filter id="rb-neon" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="rb-soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <clipPath id="rb-visorClip">
      <rect x="345" y="315" width="390" height="250" rx="95" />
    </clipPath>
    <clipPath id="rb-headClip">
      <rect x="288" y="232" width="504" height="398" rx="150" />
    </clipPath>
    <clipPath id="rb-torsoClip">
      <path d="M220 1200 L238 820 Q 250 708 360 688 L720 688 Q 830 708 842 820 L860 1200 Z" />
    </clipPath>
  </defs>
);

/* ---------- Ojos ---------- */
const Eyes: React.FC<{ e: Expression; blink: number; t: number; color: string }> = ({ e, blink, t, color }) => {
  const sy = 1 - 0.9 * blink;
  const eye = (cx: number, cy: number, key: string) => {
    if (e === 'dizzy') {
      const r = t * 0.35;
      return (
        <g key={key} transform={`rotate(${(r * 180) / Math.PI} ${cx} ${cy})`}>
          <path
            d={`M${cx} ${cy} m0 -6 a6 6 0 1 1 -6 6 a14 14 0 1 1 14 -14 a24 24 0 1 1 -24 24 a34 34 0 1 1 34 -34`}
            fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
        </g>
      );
    }
    if (e === 'hearts') {
      const s = 1 + 0.12 * Math.sin(t * 0.5);
      return (
        <g key={key} transform={`translate(${cx} ${cy}) scale(${s})`}>
          <path d="M0 34 C -60 -6 -42 -56 -14 -44 C -5 -40 0 -30 0 -24 C 0 -30 5 -40 14 -44 C 42 -56 60 -6 0 34 Z" fill="#ff4d7d" />
        </g>
      );
    }
    if (e === 'stars') {
      const s = 1 + 0.15 * Math.sin(t * 0.6);
      return (
        <g key={key} transform={`translate(${cx} ${cy}) scale(${s}) rotate(${t * 2})`}>
          <path d="M0 -46 L12 -14 L46 -14 L18 6 L28 40 L0 20 L-28 40 L-18 6 L-46 -14 L-12 -14 Z" fill="#ffe14d" />
        </g>
      );
    }
    if (e === 'shock') {
      return (
        <g key={key} transform={`translate(${cx} ${cy}) scale(1 ${sy})`}>
          <circle r={46} fill="none" stroke={color} strokeWidth={14} />
          <circle r={14} fill={color} />
        </g>
      );
    }
    if (e === 'serious') {
      return (
        <g key={key} transform={`translate(${cx} ${cy}) scale(1 ${sy})`}>
          <rect x={-40} y={-16} width={80} height={36} rx={16} fill={color} />
        </g>
      );
    }
    return (
      <g key={key} transform={`translate(${cx} ${cy}) scale(1 ${sy})`}>
        <rect x={-32} y={-44} width={64} height={88} rx={32} fill={color} />
      </g>
    );
  };
  const right =
    e === 'wink' ? (
      <path key="w" d="M598 452 Q 638 394 678 452" fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" />
    ) : (
      eye(640, 425, 'r')
    );
  return (
    <g filter="url(#rb-neon)">
      {eye(446, 425, 'l')}
      {right}
      {e === 'serious' && (
        <>
          <path d="M398 396 L 492 374" stroke={color} strokeWidth={10} strokeLinecap="round" />
          <path d="M688 396 L 594 374" stroke={color} strokeWidth={10} strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

const Mouth: React.FC<{ e: Expression; talk: number; color: string }> = ({ e, talk, color }) => {
  const a = Math.max(0, Math.min(1, talk));
  if (e === 'serious' && a < 0.08) {
    return <path d="M490 520 L590 520" stroke={color} strokeWidth={12} strokeLinecap="round" filter="url(#rb-neon)" />;
  }
  if (e === 'shock' && a < 0.08) {
    return <ellipse cx={540} cy={522} rx={26} ry={30} fill="none" stroke={color} strokeWidth={11} filter="url(#rb-neon)" />;
  }
  if (a < 0.08) {
    return <path d="M478 506 Q 540 542 602 506" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" filter="url(#rb-neon)" />;
  }
  const w = e === 'serious' ? 46 : 62;
  const top = e === 'serious' ? 506 : 500;
  const bottom = top + 18 + 52 * a;
  return (
    <g filter="url(#rb-neon)">
      <path
        d={`M${540 - w} ${top} Q 540 ${top + 10} ${540 + w} ${top} Q 540 ${bottom + 18} ${540 - w} ${top} Z`}
        fill={color} fillOpacity={0.9} stroke={color} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M${540 - w * 0.55} ${top + 10 + 30 * a} Q 540 ${top + 22 + 30 * a} ${540 + w * 0.55} ${top + 10 + 30 * a}`}
        fill="none" stroke="#0a1a3a" strokeOpacity={0.45} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/* ---------- Brazo derecho ---------- */
const Arm: React.FC<{ pose: ArmPose; lift: number; t: number; item: RobotProps['item']; umbrellaFly: number; umbrellaFlip: number }> = ({
  pose, lift, t, item, umbrellaFly, umbrellaFlip,
}) => {
  if (pose === 'down') {
    return (
      <g>
        <circle cx={805} cy={745} r={56} fill="url(#rb-joint)" stroke={OUT} strokeWidth={7} />
        <circle cx={805} cy={745} r={22} fill="none" stroke="#ff3b4e" strokeWidth={6} />
        <path d="M825 770 L870 1000" stroke={OUT} strokeWidth={96} strokeLinecap="round" />
        <path d="M825 770 L870 1000" stroke="url(#rb-graphiteSide)" strokeWidth={80} strokeLinecap="round" />
        <path d="M845 790 L880 960" stroke="#7a86a3" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      </g>
    );
  }
  // pose thumb / hold / punch: antebrazo levantado
  const wave = Math.sin(t * 0.18) * 4;
  const rot = -lift * 14 + wave;
  return (
    <g>
      <circle cx={805} cy={745} r={56} fill="url(#rb-joint)" stroke={OUT} strokeWidth={7} />
      <circle cx={805} cy={745} r={22} fill="none" stroke="#ff3b4e" strokeWidth={6} />
      <path d="M820 760 L935 860" stroke={OUT} strokeWidth={96} strokeLinecap="round" />
      <path d="M820 760 L935 860" stroke="url(#rb-graphiteSide)" strokeWidth={80} strokeLinecap="round" />
      <path d="M840 755 L925 830" stroke="#7a86a3" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      <g transform={`rotate(${rot} 940 862)`}>
        <circle cx={940} cy={862} r={46} fill="url(#rb-joint)" stroke={OUT} strokeWidth={7} />
        <circle cx={940} cy={862} r={16} fill="#2fd8ff" filter="url(#rb-neon)" />
        <path d="M940 860 L922 690" stroke={OUT} strokeWidth={90} strokeLinecap="round" />
        <path d="M940 860 L922 690" stroke="url(#rb-chromeSide)" strokeWidth={74} strokeLinecap="round" />
        <path d="M905 840 L892 720" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
        <rect x={858} y={640} width={128} height={34} rx={14} fill="url(#rb-red)" stroke={OUT} strokeWidth={6} />
        {/* objeto detrás del puño */}
        {item === 'umbrella' && <Umbrella fly={umbrellaFly} flip={umbrellaFlip} t={t} />}
        {item === 'flags' && <Flags t={t} />}
        {item === 'bottle' && <Bottle />}
        {item === 'briefcase' && <Briefcase />}
        {item === 'gavel' && <Gavel t={t} />}
        {item === 'glove' || pose === 'punch' ? (
          <BoxGlove cx={922} cy={585} s={1.15} />
        ) : (
          <>
            <rect x={852} y={530} width={142} height={120} rx={34} fill="url(#rb-chromeSide)" stroke={OUT} strokeWidth={7} />
            <path d="M940 560 L990 560 M940 592 L992 592 M940 622 L986 622" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
            <g fill="#5e6a82" stroke={OUT} strokeWidth={3}>
              <circle cx={966} cy={545} r={5} />
              <circle cx={968} cy={576} r={5} />
              <circle cx={966} cy={607} r={5} />
            </g>
            {pose === 'thumb' && (
              <>
                <path d="M868 545 L870 455 Q 872 415 905 415 Q 936 417 934 455 L928 545 Z" fill="url(#rb-chromeSide)" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
                <path d="M871 488 L932 488" stroke={OUT} strokeWidth={6} />
                <path d="M884 470 Q 888 440 905 432" fill="none" stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
                <rect x={886} y={420} width={38} height={14} rx={7} fill="#2fd8ff" opacity={0.9} filter="url(#rb-neon)" />
              </>
            )}
            {pose === 'hold' && (
              <path d="M862 548 Q 860 520 900 518 Q 935 520 932 548" fill="url(#rb-chromeSide)" stroke={OUT} strokeWidth={6} />
            )}
          </>
        )}
      </g>
    </g>
  );
};

export const BoxGlove: React.FC<{ cx: number; cy: number; s?: number; flip?: boolean }> = ({ cx, cy, s = 1, flip }) => (
  <g transform={`translate(${cx} ${cy}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-58} y={52} width={116} height={46} rx={14} fill="#ffffff" stroke={OUT} strokeWidth={7} />
    <path d="M-70 10 C -78 -60 -30 -88 14 -84 C 70 -80 84 -30 78 18 C 74 58 40 66 0 64 C -46 62 -66 50 -70 10 Z" fill="url(#rb-glove)" stroke={OUT} strokeWidth={8} />
    <path d="M-62 4 C -40 24 -6 22 6 -6 C 12 -22 -6 -40 -30 -34" fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
    <path d="M-40 -60 Q -10 -76 26 -70" fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" opacity={0.75} />
    <path d="M-52 74 L52 74" stroke={OUT} strokeWidth={4} />
  </g>
);

const Umbrella: React.FC<{ fly: number; flip: number; t: number }> = ({ fly, flip }) => {
  const dx = fly * 700;
  const dy = -fly * 900;
  const r = fly * 260;
  const cy = 1 - 2 * flip; // 1 normal, -1 invertido
  return (
    <g transform={`translate(${dx} ${dy}) rotate(${r} 905 300)`}>
      <path d="M905 560 L905 250" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
      <path d="M905 560 L905 250" stroke="#d9dfe9" strokeWidth={8} strokeLinecap="round" />
      <g transform={`translate(905 250) scale(1 ${cy}) translate(-905 -250)`}>
        <path d="M705 250 Q 715 80 905 60 Q 1095 80 1105 250 Q 1072 225 1038 250 Q 1004 225 972 250 Q 938 225 905 250 Q 872 225 838 250 Q 806 225 772 250 Q 738 225 705 250 Z"
          fill="#ff2d55" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
        <path d="M905 60 Q 860 150 838 250 M905 60 Q 950 150 972 250 M905 60 L905 250" fill="none" stroke={OUT} strokeWidth={5} opacity={0.5} />
        <path d="M760 160 Q 800 100 870 86" fill="none" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
        <circle cx={905} cy={52} r={10} fill={OUT} />
      </g>
    </g>
  );
};

const Briefcase: React.FC = () => (
  <g transform="translate(0 -40)">
    <path d="M880 470 Q 880 430 920 430 Q 960 430 960 470" fill="none" stroke={OUT} strokeWidth={14} />
    <rect x={810} y={460} width={220} height={150} rx={18} fill="#6b3f1e" stroke={OUT} strokeWidth={8} />
    <rect x={810} y={520} width={220} height={18} fill="#4a2a12" />
    <rect x={905} y={512} width={30} height={34} rx={5} fill="#ffd23f" stroke={OUT} strokeWidth={5} />
    <path d="M830 480 L1000 480" stroke="#a0683a" strokeWidth={6} opacity={0.7} />
  </g>
);

const Gavel: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(${-20 + Math.max(0, Math.sin(t * 0.25)) * 25} 920 560)`}>
    <rect x={910} y={330} width={22} height={240} rx={8} fill="#8a5a2b" stroke={OUT} strokeWidth={6} />
    <rect x={850} y={290} width={140} height={60} rx={14} fill="#a8703a" stroke={OUT} strokeWidth={7} />
    <rect x={850} y={308} width={140} height={10} fill="#ffd23f" />
    <rect x={850} y={324} width={140} height={10} fill="#ffd23f" />
  </g>
);

const Bottle: React.FC = () => (
  <g transform="rotate(-20 920 480)">
    <rect x={880} y={380} width={80} height={170} rx={26} fill="#eaf6ff" stroke={OUT} strokeWidth={7} />
    <rect x={886} y={430} width={68} height={112} rx={20} fill="#fff3d6" />
    <path d="M890 460 L912 460 M890 490 L912 490 M890 520 L912 520" stroke="#7aa6d6" strokeWidth={5} />
    <rect x={874} y={360} width={92} height={30} rx={10} fill="#5fb0ff" stroke={OUT} strokeWidth={6} />
    <path d="M900 360 Q 920 300 940 360 Z" fill="#ffd2a8" stroke={OUT} strokeWidth={6} />
  </g>
);

const Flags: React.FC<{ t: number }> = ({ t }) => {
  const w = Math.sin(t * 0.3) * 6;
  return (
    <g>
      <path d="M890 560 L860 300" stroke={OUT} strokeWidth={10} strokeLinecap="round" />
      <path d="M935 560 L975 300" stroke={OUT} strokeWidth={10} strokeLinecap="round" />
      <g transform={`rotate(${-8 + w} 860 300)`}>
        <ChinaFlag x={700} y={300} w={160} h={106} />
      </g>
      <g transform={`rotate(${8 - w} 975 300)`}>
        <USFlag x={975} y={300} w={160} h={106} />
      </g>
    </g>
  );
};

export const USFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const sh = h / 13;
  const stars = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) stars.push(<circle key={`${r}-${c}`} cx={x + 8 + c * (w * 0.4 - 12) / 4} cy={y + 8 + r * (h * 0.54 - 14) / 3} r={2.6} fill="#fff" />);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={OUT} strokeWidth={5} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={x} y={y + i * 2 * sh} width={w} height={sh} fill="#d61f3a" />
      ))}
      <rect x={x} y={y} width={w * 0.42} height={h * 0.54} fill="#22357a" />
      {stars}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
    </g>
  );
};

const star = (cx: number, cy: number, r: number, rot = 0) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2 + rot;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`);
  }
  return pts.join(' ');
};

export const ChinaFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#de2910" stroke={OUT} strokeWidth={5} />
    <polygon points={star(x + w * 0.17, y + h * 0.27, h * 0.16)} fill="#ffde00" />
    <polygon points={star(x + w * 0.34, y + h * 0.1, h * 0.05, 0.6)} fill="#ffde00" />
    <polygon points={star(x + w * 0.4, y + h * 0.2, h * 0.05, 0.3)} fill="#ffde00" />
    <polygon points={star(x + w * 0.4, y + h * 0.35, h * 0.05)} fill="#ffde00" />
    <polygon points={star(x + w * 0.34, y + h * 0.45, h * 0.05, 0.6)} fill="#ffde00" />
  </g>
);

export const RussiaFlag: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h / 3} fill="#ffffff" />
    <rect x={x} y={y + h / 3} width={w} height={h / 3} fill="#0039a6" />
    <rect x={x} y={y + (2 * h) / 3} width={w} height={h / 3} fill="#d52b1e" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={5} />
  </g>
);

/* ---------- Robot ---------- */
export const Robot: React.FC<RobotProps> = (p) => {
  const { t, costume } = p;
  const eyeColor = p.eyeColor ?? CY;
  const antennaOn = Math.floor(t / 12) % 2 === 0;
  const astronaut = costume === 'astronaut';
  return (
    <g>
      <Defs />
      {/* Torso */}
      <path d="M220 1200 L238 820 Q 250 708 360 688 L720 688 Q 830 708 842 820 L860 1200 Z"
        fill={astronaut ? 'url(#rb-suit)' : 'url(#rb-graphiteSide)'} stroke={OUT} strokeWidth={8} />
      {!astronaut && (
        <>
          <path d="M360 688 L478 688 L520 900 L430 1200 L300 1200 Z" fill="url(#rb-graphite)" stroke={OUT} strokeWidth={6} opacity={0.95} />
          <path d="M720 688 L602 688 L560 900 L650 1200 L780 1200 Z" fill="url(#rb-graphite)" stroke={OUT} strokeWidth={6} opacity={0.95} />
          <path d="M370 700 L470 700" stroke="#7fe9ff" strokeOpacity={0.5} strokeWidth={3} />
          <path d="M610 700 L710 700" stroke="#7fe9ff" strokeOpacity={0.5} strokeWidth={3} />
          <path d="M488 690 L592 690 L572 760 L582 1200 L498 1200 L508 760 Z" fill="url(#rb-red)" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M500 698 L580 698" stroke="#ffb3bb" strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {astronaut && (
        <g>
          <rect x={430} y={760} width={220} height={150} rx={20} fill="#dfe6f1" stroke={OUT} strokeWidth={6} />
          <circle cx={470} cy={800} r={14} fill="#ff3b4e" />
          <circle cx={510} cy={800} r={14} fill="#2fd8ff" />
          <circle cx={550} cy={800} r={14} fill="#ffe14d" />
          <path d="M300 760 Q 300 1000 330 1200 M780 760 Q 780 1000 750 1200" fill="none" stroke="#9aa6bd" strokeWidth={6} />
          <path d="M250 950 L830 950" stroke="#9aa6bd" strokeWidth={14} />
          <path d="M250 950 L830 950" stroke="#ff3b4e" strokeWidth={5} />
        </g>
      )}
      {/* Disfraces del torso */}
      {costume === 'vest' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M230 720 L470 690 L520 1200 L220 1200 Z" fill="url(#rb-orange)" stroke={OUT} strokeWidth={7} />
          <path d="M850 720 L610 690 L560 1200 L860 1200 Z" fill="url(#rb-orange)" stroke={OUT} strokeWidth={7} />
          <path d="M235 930 L512 930 M235 990 L518 990 M845 930 L568 930 M845 990 L562 990" stroke="#e8eef6" strokeWidth={22} />
          <path d="M235 930 L512 930 M235 990 L518 990 M845 930 L568 930 M845 990 L562 990" stroke="#ffffff" strokeWidth={8} opacity={0.8} />
          <rect x={300} y={760} width={110} height={70} rx={10} fill="url(#rb-orange)" stroke={OUT} strokeWidth={5} />
          <path d="M500 1050 L580 1050" stroke={OUT} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
      {costume === 'raincoat' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L540 690 L860 700 L860 1200 L220 1200 Z" fill="url(#rb-yellow)" stroke={OUT} strokeWidth={7} />
          <path d="M540 700 L540 1200" stroke={OUT} strokeWidth={6} />
          <g fill="#3b2a00">
            <circle cx={570} cy={800} r={11} /><circle cx={570} cy={900} r={11} /><circle cx={570} cy={1000} r={11} />
          </g>
          <path d="M440 696 L540 760 L640 696" fill="#f2c200" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M300 760 Q 320 900 300 1100" stroke="#fff6b0" strokeWidth={10} opacity={0.6} fill="none" />
        </g>
      )}
      {costume === 'diplomat' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M330 690 L420 690 L760 1200 L650 1200 Z" fill="#1e5bd8" stroke={OUT} strokeWidth={6} />
          <path d="M360 690 L390 690 L720 1200 L690 1200 Z" fill="#ffd23f" opacity={0.85} />
          <circle cx={600} cy={960} r={34} fill="#ffd23f" stroke={OUT} strokeWidth={6} />
          <polygon points={star(600, 960, 22)} fill="#e9a800" />
        </g>
      )}
      {costume === 'helmet' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="url(#rb-camo)" opacity={0.92} />
          <g fill="#2a3012" opacity={0.75}>
            <path d="M260 780 q40 -30 90 0 q-20 40 -90 0Z" /><path d="M640 860 q60 -40 120 0 q-40 50 -120 0Z" />
            <path d="M420 1000 q40 -30 90 0 q-30 40 -90 0Z" /><path d="M700 1080 q40 -30 90 0 q-30 40 -90 0Z" />
          </g>
          <path d="M440 700 L540 780 L640 700" fill="#4f5a26" stroke={OUT} strokeWidth={6} />
          <rect x={290} y={830} width={120} height={70} rx={8} fill="#4f5a26" stroke={OUT} strokeWidth={5} />
          <rect x={670} y={830} width={120} height={70} rx={8} fill="#4f5a26" stroke={OUT} strokeWidth={5} />
        </g>
      )}
      {costume === 'firefighter' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#c9a86a" stroke={OUT} strokeWidth={7} />
          <path d="M235 930 L845 930 M235 990 L845 990" stroke="#ffe14d" strokeWidth={24} />
          <path d="M235 930 L845 930 M235 990 L845 990" stroke="#e8eef6" strokeWidth={8} />
          <path d="M540 700 L540 1200" stroke={OUT} strokeWidth={6} />
          <path d="M440 696 L540 770 L640 696" fill="#a8884a" stroke={OUT} strokeWidth={6} />
        </g>
      )}
      {costume === 'judge' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#14151c" stroke={OUT} strokeWidth={7} />
          <path d="M330 720 Q 300 950 320 1200 M750 720 Q 780 950 760 1200" stroke="#2c2e3a" strokeWidth={10} fill="none" />
          <path d="M450 696 L540 790 L630 696 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <path d="M520 760 L500 830 L540 810 L580 830 L560 760" fill="#ffffff" stroke={OUT} strokeWidth={5} />
        </g>
      )}
      {costume === 'business' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M488 690 L592 690 L572 760 L582 1200 L498 1200 L508 760 Z" fill="#ffd23f" stroke={OUT} strokeWidth={6} />
          <path d="M650 760 L720 760 L715 800 L655 800 Z" fill="#ffffff" stroke={OUT} strokeWidth={4} />
          <path d="M660 760 L670 740 L680 760 M690 760 L700 742 L710 760" fill="#ff2d55" stroke={OUT} strokeWidth={3} />
        </g>
      )}
      {costume === 'deputy' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#1b2340" stroke={OUT} strokeWidth={7} />
          <path d="M300 760 Q 290 950 310 1200 M780 760 Q 790 950 770 1200" stroke="#2b365e" strokeWidth={8} fill="none" />
          <path d="M440 694 L540 1010 L640 694 Z" fill="#f4f6fb" stroke={OUT} strokeWidth={6} />
          <path d="M488 694 L592 694 L572 760 L560 980 L540 1010 L520 980 L508 760 Z" fill="url(#rb-red)" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
          <path d="M360 694 L440 694 L540 1010 L470 880 L400 900 L430 800 Z" fill="#26305a" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M720 694 L640 694 L540 1010 L610 880 L680 900 L650 800 Z" fill="#26305a" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <g transform="translate(690 840)">
            <rect x={-26} y={-18} width={52} height={36} rx={4} fill="#c60b1e" stroke={OUT} strokeWidth={4} />
            <rect x={-26} y={-9} width={52} height={18} fill="#ffc400" />
          </g>
          <rect x={330} y={1010} width={110} height={16} rx={6} fill="#26305a" stroke={OUT} strokeWidth={4} />
          <circle cx={540} cy={1080} r={12} fill="#0d1226" stroke="#8a93b8" strokeWidth={3} />
          <circle cx={540} cy={1150} r={12} fill="#0d1226" stroke="#8a93b8" strokeWidth={3} />
        </g>
      )}
      {costume === 'conductor' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#1d3f8f" stroke={OUT} strokeWidth={7} />
          <path d="M540 700 L540 1200" stroke={OUT} strokeWidth={6} />
          <path d="M235 700 L235 1200 M845 700 L845 1200" stroke="#e3122b" strokeWidth={14} />
          <path d="M440 696 L540 770 L640 696" fill="#16316f" stroke={OUT} strokeWidth={6} />
          <path d="M470 696 L540 748 L610 696 Z" fill="#ffffff" stroke={OUT} strokeWidth={4} />
          <g fill="#ffd23f" stroke={OUT} strokeWidth={4}>
            <circle cx={575} cy={960} r={13} /><circle cx={575} cy={1040} r={13} /><circle cx={575} cy={1120} r={13} />
          </g>
          <path d="M260 740 L380 740 M260 760 L380 760" stroke="#ffd23f" strokeWidth={8} />
          <rect x={640} y={920} width={150} height={70} rx={12} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={715} y={968} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={40} fill="#1d3f8f">TREN</text>
          <path d="M600 760 Q 640 860 610 900" fill="none" stroke="#ffd23f" strokeWidth={6} />
          <g transform="translate(610 910) rotate(20)">
            <rect x={-30} y={-14} width={60} height={28} rx={14} fill="url(#rb-chrome)" stroke={OUT} strokeWidth={5} />
            <circle cx={-8} cy={0} r={6} fill={OUT} />
          </g>
        </g>
      )}
      {costume === 'officer' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#4a5530" stroke={OUT} strokeWidth={7} />
          <path d="M300 760 Q 290 950 310 1200 M780 760 Q 790 950 770 1200" stroke="#5d6a3c" strokeWidth={8} fill="none" />
          <path d="M450 694 L540 860 L630 694 Z" fill="#d9d2b8" stroke={OUT} strokeWidth={6} />
          <path d="M515 700 L565 700 L556 760 L548 850 L540 862 L532 850 L524 760 Z" fill="#2e3520" stroke={OUT} strokeWidth={4} />
          <path d="M360 694 L450 694 L540 860 L470 820 L410 860 L430 780 Z" fill="#3c4626" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M720 694 L630 694 L540 860 L610 820 L670 860 L650 780 Z" fill="#3c4626" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M540 860 L540 1200" stroke={OUT} strokeWidth={5} />
          <g fill="#e9c249" stroke={OUT} strokeWidth={4}>
            <circle cx={570} cy={930} r={13} /><circle cx={570} cy={1010} r={13} /><circle cx={570} cy={1090} r={13} />
          </g>
          <g transform="translate(330 900)">
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={-60 + i * 42} y={-16} width={38} height={18} fill={['#c4001f', '#1e5bd8', '#2fbf71'][i]} stroke={OUT} strokeWidth={3} />
                <rect x={-50 + i * 42} y={-16} width={6} height={18} fill="#ffffff" opacity={0.8} />
              </g>
            ))}
            {[0, 1].map((i) => (
              <g key={`m${i}`} transform={`translate(${-30 + i * 56} 40)`}>
                <path d="M-10 -22 L10 -22 L6 0 L-6 0 Z" fill={i ? '#1e5bd8' : '#c4001f'} stroke={OUT} strokeWidth={3} />
                <circle cx={0} cy={14} r={16} fill="#e9c249" stroke={OUT} strokeWidth={4} />
                <polygon points={star(0, 14, 9)} fill="#b8901e" />
              </g>
            ))}
          </g>
          <rect x={250} y={705} width={120} height={36} rx={8} fill="#2e3520" stroke={OUT} strokeWidth={5} />
          <path d="M270 723 L350 723" stroke="#e9c249" strokeWidth={6} strokeDasharray="10 8" />
          <rect x={660} y={1040} width={120} height={16} rx={6} fill="#3c4626" stroke={OUT} strokeWidth={4} />
        </g>
      )}
      {costume === 'riot' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#1b2a4a" stroke={OUT} strokeWidth={7} />
          {/* chaleco antidisturbios con placas */}
          <path d="M300 720 L780 720 L800 1200 L280 1200 Z" fill="#0f1a30" stroke={OUT} strokeWidth={7} />
          {[0, 1, 2].map((r) => [0, 1].map((c) => (
            <rect key={`${r}${c}`} x={330 + c * 220} y={770 + r * 130} width={200} height={110} rx={18} fill="#22355c" stroke={OUT} strokeWidth={5} />
          )))}
          {/* hombreras */}
          <path d="M228 760 Q 250 700 340 694 L360 790 Q 290 800 236 840 Z" fill="#2c3f66" stroke={OUT} strokeWidth={6} />
          <path d="M852 760 Q 830 700 740 694 L720 790 Q 790 800 844 840 Z" fill="#2c3f66" stroke={OUT} strokeWidth={6} />
          {/* banda POLICÍA */}
          <rect x={300} y={905} width={480} height={74} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <text x={540} y={962} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={58} fill="#1b2a4a" letterSpacing={6}>POLICÍA</text>
          {/* placa dorada */}
          <g transform="translate(650 800)">
            <path d="M0 -38 L32 -22 L28 18 L0 40 L-28 18 L-32 -22 Z" fill="#e9c249" stroke={OUT} strokeWidth={5} />
            <polygon points={star(0, 0, 16)} fill="#b8901e" />
          </g>
          {/* radio */}
          <rect x={360} y={780} width={54} height={86} rx={10} fill="#0a0f1c" stroke={OUT} strokeWidth={5} />
          <path d="M374 780 L374 742" stroke={OUT} strokeWidth={8} strokeLinecap="round" />
          <circle cx={387} cy={800} r={6} fill={Math.floor(t / 10) % 2 ? '#2fd8ff' : '#ff3b4e'} />
          {/* cinturón */}
          <rect x={230} y={1110} width={620} height={40} fill="#0a0f1c" stroke={OUT} strokeWidth={5} />
          <rect x={510} y={1104} width={60} height={52} rx={8} fill="#c9ced8" stroke={OUT} strokeWidth={5} />
        </g>
      )}
      {costume === 'navy' && (
        <g clipPath="url(#rb-torsoClip)">
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#14234a" stroke={OUT} strokeWidth={7} />
          <path d="M300 760 Q 290 950 310 1200 M780 760 Q 790 950 770 1200" stroke="#22356b" strokeWidth={8} fill="none" />
          {/* camisa y corbata */}
          <path d="M455 694 L540 850 L625 694 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} />
          <path d="M518 700 L562 700 L555 760 L547 840 L540 852 L533 840 L525 760 Z" fill="#0a1022" stroke={OUT} strokeWidth={4} />
          {/* solapas */}
          <path d="M350 694 L455 694 L540 850 L470 815 L405 860 L425 775 Z" fill="#1c2f60" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M730 694 L625 694 L540 850 L610 815 L675 860 L655 775 Z" fill="#1c2f60" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          {/* doble fila de botones dorados */}
          <g fill="#f0c94a" stroke={OUT} strokeWidth={4}>
            {[0, 1, 2].map((i) => (<g key={i}><circle cx={490} cy={930 + i * 85} r={14} /><circle cx={590} cy={930 + i * 85} r={14} /></g>))}
          </g>
          {/* galones en la manga y charreteras */}
          <path d="M230 1080 L360 1080 M230 1110 L360 1110" stroke="#f0c94a" strokeWidth={10} />
          <rect x={240} y={700} width={130} height={40} rx={10} fill="#0a1022" stroke={OUT} strokeWidth={5} />
          <path d="M255 712 L355 712 M255 728 L355 728" stroke="#f0c94a" strokeWidth={5} />
          <rect x={710} y={700} width={130} height={40} rx={10} fill="#0a1022" stroke={OUT} strokeWidth={5} />
          <path d="M725 712 L825 712 M725 728 L825 728" stroke="#f0c94a" strokeWidth={5} />
          {/* ancla bordada */}
          <g transform="translate(690 880)" stroke="#f0c94a" strokeWidth={7} fill="none" strokeLinecap="round">
            <circle cx={0} cy={-34} r={10} />
            <path d="M0 -24 L0 34 M-22 -10 L22 -10 M-30 14 Q -26 40 0 40 Q 26 40 30 14" />
          </g>
          {/* pasadores */}
          <g transform="translate(350 900)">
            {[0, 1, 2].map((i) => (
              <rect key={i} x={-55 + i * 38} y={-14} width={34} height={18} fill={['#1e5bd8', '#ffd23f', '#c4001f'][i]} stroke={OUT} strokeWidth={3} />
            ))}
          </g>
        </g>
      )}
      {costume === 'pilot' && (
        <g clipPath="url(#rb-torsoClip)">
          {/* camisa blanca de piloto */}
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#f4f6fb" stroke={OUT} strokeWidth={7} />
          <path d="M300 760 Q 290 950 310 1200 M780 760 Q 790 950 770 1200" stroke="#d5dbe8" strokeWidth={8} fill="none" />
          <path d="M540 700 L540 1200" stroke="#d5dbe8" strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={540} cy={900 + i * 80} r={8} fill="#ffffff" stroke={OUT} strokeWidth={3} />)}
          {/* cuello y corbata */}
          <path d="M455 694 L540 760 L625 694 L600 740 L540 790 L480 740 Z" fill="#ffffff" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M520 770 L560 770 L556 800 L572 990 L540 1030 L508 990 L524 800 Z" fill="#14234a" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
          <path d="M524 800 L556 800" stroke="#f0c94a" strokeWidth={4} />
          {/* hombreras con 4 galones */}
          {[240, 710].map((x) => (
            <g key={x}>
              <rect x={x} y={700} width={130} height={46} rx={10} fill="#0a1022" stroke={OUT} strokeWidth={5} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M${x + 14} ${709 + i * 9} L${x + 116} ${709 + i * 9}`} stroke="#f0c94a" strokeWidth={5} />)}
            </g>
          ))}
          {/* alas doradas en el pecho */}
          <g transform="translate(690 860)">
            <path d="M-80 0 Q -50 -26 -12 -6 L-12 6 Q -50 18 -80 0 Z M80 0 Q 50 -26 12 -6 L12 6 Q 50 18 80 0 Z" fill="#f0c94a" stroke={OUT} strokeWidth={4} />
            <path d="M-70 -2 L-24 -4 M-66 6 L-24 4 M70 -2 L24 -4 M66 6 L24 4" stroke="#b8902a" strokeWidth={3} />
            <circle r={14} fill="#f0c94a" stroke={OUT} strokeWidth={4} />
          </g>
          {/* bolsillo con bolígrafo y placa */}
          <rect x={300} y={830} width={130} height={110} rx={10} fill="#e9edf5" stroke={OUT} strokeWidth={5} />
          <rect x={340} y={800} width={12} height={60} rx={5} fill="#1e5bd8" stroke={OUT} strokeWidth={3} />
          <rect x={300} y={960} width={150} height={40} rx={8} fill="#14234a" stroke={OUT} strokeWidth={4} />
          <text x={375} y={988} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={26} fill="#f0c94a">NOTI</text>
        </g>
      )}
      {costume === 'rescuer' && (
        <g clipPath="url(#rb-torsoClip)">
          {/* mono de rescatista con chaleco reflectante */}
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#26304a" stroke={OUT} strokeWidth={7} />
          <path d="M230 720 L470 690 L515 1200 L220 1200 Z" fill="#c8f031" stroke={OUT} strokeWidth={7} />
          <path d="M850 720 L610 690 L565 1200 L860 1200 Z" fill="#c8f031" stroke={OUT} strokeWidth={7} />
          <path d="M235 960 L512 960 M235 1030 L518 1030 M845 960 L568 960 M845 1030 L562 1030" stroke="#e8eef6" strokeWidth={22} />
          <path d="M235 960 L512 960 M235 1030 L518 1030 M845 960 L568 960 M845 1030 L562 1030" stroke="#9aa6bd" strokeWidth={4} opacity={0.7} />
          <rect x={290} y={780} width={170} height={56} rx={10} fill="#e3122b" stroke={OUT} strokeWidth={5} />
          <text x={375} y={820} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={34} fill="#ffffff">RESCATE</text>
          <g transform="translate(700 810)">
            <rect x={-34} y={-34} width={68} height={68} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={5} />
            <path d="M-10 -24 H10 V-10 H24 V10 H10 V24 H-10 V10 H-24 V-10 H-10 Z" fill="#e3122b" />
          </g>
          {/* radio */}
          <rect x={640} y={880} width={44} height={70} rx={8} fill="#14151c" stroke={OUT} strokeWidth={4} />
          <path d="M650 880 L650 846" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
          <circle cx={662} cy={900} r={6} fill="#2fbf71" />
          <path d="M540 700 L540 1200" stroke={OUT} strokeWidth={5} opacity={0.6} />
        </g>
      )}
      {costume === 'eco' && (
        <g clipPath="url(#rb-torsoClip)">
          {/* chaleco de expedición verde con planeta y hojas */}
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#e9e2c8" stroke={OUT} strokeWidth={7} />
          <path d="M230 720 L462 690 L505 1200 L220 1200 Z" fill="#2f8a4a" stroke={OUT} strokeWidth={7} />
          <path d="M850 720 L618 690 L575 1200 L860 1200 Z" fill="#2f8a4a" stroke={OUT} strokeWidth={7} />
          <rect x={280} y={950} width={150} height={110} rx={12} fill="#277a40" stroke={OUT} strokeWidth={5} />
          <path d="M280 985 H430" stroke={OUT} strokeWidth={4} />
          <rect x={650} y={950} width={150} height={110} rx={12} fill="#277a40" stroke={OUT} strokeWidth={5} />
          <path d="M650 985 H800" stroke={OUT} strokeWidth={4} />
          <g transform="translate(360 820)">
            <circle r={44} fill="#3b8cff" stroke={OUT} strokeWidth={5} />
            <path d="M-30 -18 Q -10 -38 12 -24 Q 18 -6 -4 2 Q -22 8 -30 -8 Z M8 14 Q 30 6 38 22 Q 26 40 6 34 Z" fill="#3fbf6a" stroke={OUT} strokeWidth={3} />
          </g>
          <g transform="translate(720 820) rotate(-20)">
            <path d="M0 40 Q -46 0 0 -46 Q 46 0 0 40 Z" fill="#7be07b" stroke={OUT} strokeWidth={5} />
            <path d="M0 40 V-40" stroke={OUT} strokeWidth={4} />
          </g>
        </g>
      )}
      {costume === 'maritime' && (
        <g clipPath="url(#rb-torsoClip)">
          {/* traje de Salvamento Marítimo: mono rojo-naranja con chaleco salvavidas inflable */}
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#d9381e" stroke={OUT} strokeWidth={7} />
          <path d="M300 760 Q 290 950 310 1200 M780 760 Q 790 950 770 1200" stroke="#b02a14" strokeWidth={8} fill="none" />
          {/* collarín y tubos del chaleco salvavidas */}
          <path d="M330 700 Q 540 790 750 700 L760 760 Q 540 860 320 760 Z" fill="#ffb21f" stroke={OUT} strokeWidth={7} />
          <path d="M360 760 Q 330 900 350 1080 L470 1080 Q 470 900 490 800 Z" fill="#ffb21f" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
          <path d="M720 760 Q 750 900 730 1080 L610 1080 Q 610 900 590 800 Z" fill="#ffb21f" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
          <path d="M380 820 Q 370 940 380 1050 M700 820 Q 710 940 700 1050" stroke="#ffe08a" strokeWidth={9} fill="none" strokeLinecap="round" />
          {/* bandas reflectantes */}
          <path d="M352 1000 L470 1000 M610 1000 L728 1000" stroke="#e8eef6" strokeWidth={22} />
          <path d="M352 1000 L470 1000 M610 1000 L728 1000" stroke="#9aa6bd" strokeWidth={4} opacity={0.7} />
          {/* hebillas y correa */}
          <path d="M470 1110 L610 1110" stroke="#14151c" strokeWidth={18} />
          <rect x={518} y={1092} width={44} height={36} rx={6} fill="#c9ced8" stroke={OUT} strokeWidth={4} />
          {/* silbato y luz de posición */}
          <path d="M470 870 Q 500 900 520 880" stroke="#14151c" strokeWidth={4} fill="none" />
          <rect x={510} y={866} width={34} height={20} rx={6} fill="#ffd23f" stroke={OUT} strokeWidth={4} />
          <g transform="translate(410 900)">
            <rect x={-16} y={-24} width={32} height={48} rx={8} fill="#2a2f40" stroke={OUT} strokeWidth={4} />
            <circle r={10} fill="#ffffff" opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 0.25))} />
          </g>
          {/* parche SALVAMENTO */}
          <rect x={268} y={1130} width={250} height={56} rx={10} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={393} y={1170} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={32} fill="#d9381e">SALVAMENTO</text>
          <path d="M540 780 L540 1200" stroke={OUT} strokeWidth={5} opacity={0.5} />
        </g>
      )}
      {costume === 'parent' && (
        <g clipPath="url(#rb-torsoClip)">
          {/* jersey de punto con portabebés y bebé dormido */}
          <path d="M220 700 L860 700 L860 1200 L220 1200 Z" fill="#4f7fc9" stroke={OUT} strokeWidth={7} />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${250 + i * 70} 720 Q ${270 + i * 70} 960 ${250 + i * 70} 1200`} stroke="#3f69ad" strokeWidth={6} fill="none" />
          ))}
          <path d="M220 1140 L860 1140" stroke="#3a5f9e" strokeWidth={26} />
          {/* correas del portabebés */}
          <path d="M330 700 L410 900 M750 700 L670 900" stroke="#e7894a" strokeWidth={46} strokeLinecap="round" />
          <path d="M330 700 L410 900 M750 700 L670 900" stroke="#f6b07c" strokeWidth={8} strokeDasharray="14 12" />
          {/* bolsa del portabebés */}
          <path d="M370 880 Q 540 850 710 880 L690 1110 Q 540 1160 390 1110 Z" fill="#e7894a" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
          <path d="M392 900 Q 540 874 688 900" fill="none" stroke="#f6b07c" strokeWidth={6} strokeDasharray="14 12" />
          <path d="M300 1080 L780 1080" stroke="#2a2f40" strokeWidth={30} />
          <rect x={512} y={1062} width={56} height={36} rx={8} fill="#c9ced8" stroke={OUT} strokeWidth={4} />
          {/* bebé */}
          <g transform={`translate(540 ${872 + Math.sin(t * 0.12) * 3})`}>
            <circle r={66} fill="#ffd7b5" stroke={OUT} strokeWidth={6} />
            <path d="M-66 -10 Q -60 -78 0 -80 Q 60 -78 66 -10 Q 30 -40 0 -36 Q -30 -40 -66 -10 Z" fill="#ffe14d" stroke={OUT} strokeWidth={5} />
            <circle cx={0} cy={-84} r={12} fill="#ffe14d" stroke={OUT} strokeWidth={4} />
            <path d="M-30 6 Q -20 14 -10 6 M10 6 Q 20 14 30 6" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
            <circle cx={-38} cy={24} r={10} fill="#ff9fb0" opacity={0.7} />
            <circle cx={38} cy={24} r={10} fill="#ff9fb0" opacity={0.7} />
            <circle cx={0} cy={34} r={11} fill="#7fd6ff" stroke={OUT} strokeWidth={4} />
            <text x={70} y={-60} fontFamily="'Anton', Impact, sans-serif" fontSize={30} fill="#ffffff" stroke={OUT} strokeWidth={4} paintOrder="stroke" opacity={0.5 + 0.5 * Math.sin(t * 0.1)}>z</text>
          </g>
        </g>
      )}
      {/* pantalla del pecho */}
      {!astronaut && costume !== 'vest' && costume !== 'firefighter' && costume !== 'conductor' && costume !== 'officer' && costume !== 'riot' && costume !== 'navy' && costume !== 'rescuer' && costume !== 'maritime' && costume !== 'parent' && (
        <g>
          <rect x={462} y={800} width={156} height={92} rx={22} fill="#060a18" stroke={OUT} strokeWidth={6} />
          <rect x={470} y={808} width={140} height={76} rx={16} fill="none" stroke="#2fd8ff" strokeOpacity={0.5} strokeWidth={2} />
          <text x={540} y={865} textAnchor="middle" fontFamily="DejaVu Sans Mono, monospace" fontWeight="bold" fontSize={46} fill="#5ff0ff" filter="url(#rb-neon)">
            {p.timer}
          </text>
        </g>
      )}
      {/* hombrera */}
      <path d="M232 800 Q 230 700 340 690 Q 400 700 400 740 Q 330 760 300 830 Z" fill={costume === 'raincoat' ? 'url(#rb-yellow)' : 'url(#rb-chrome)'} stroke={OUT} strokeWidth={7} />
      <path d="M250 760 Q 280 715 340 706" fill="none" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />

      {/* Cuello */}
      <rect x={482} y={596} width={116} height={100} rx={16} fill="url(#rb-graphiteSide)" stroke={OUT} strokeWidth={7} />
      <rect x={474} y={622} width={132} height={16} rx={8} fill="url(#rb-chromeSide)" stroke={OUT} strokeWidth={5} />
      <rect x={474} y={656} width={132} height={16} rx={8} fill="url(#rb-chromeSide)" stroke={OUT} strokeWidth={5} />

      {/* Brazo */}
      <Arm pose={p.arm} lift={p.armLift ?? 0} t={t} item={p.item} umbrellaFly={p.umbrellaFly ?? 0} umbrellaFlip={p.umbrellaFlip ?? 0} />

      {costume === 'boxing' && (
        <g transform={`translate(${-(p.armLift ?? 0) * 30} ${-(p.armLift ?? 0) * 60})`}>
          <path d="M300 800 Q 300 860 330 880" stroke={OUT} strokeWidth={70} strokeLinecap="round" fill="none" />
          <path d="M300 800 Q 300 860 330 880" stroke="url(#rb-graphiteSide)" strokeWidth={56} strokeLinecap="round" fill="none" />
          <BoxGlove cx={340} cy={860} s={1.1} flip />
        </g>
      )}
      {/* Antena */}
      {costume !== 'helmet' && costume !== 'firefighter' && costume !== 'judge' && costume !== 'conductor' && costume !== 'officer' && costume !== 'navy' && costume !== 'rescuer' && costume !== 'eco' && (
        <g>
          <path d="M690 262 L752 150" stroke={OUT} strokeWidth={18} strokeLinecap="round" />
          <path d="M690 262 L752 150" stroke="url(#rb-chromeSide)" strokeWidth={10} strokeLinecap="round" />
          {antennaOn && <circle cx={756} cy={142} r={46} fill="#ff3b4e" opacity={0.45} filter="url(#rb-soft)" />}
          <circle cx={756} cy={142} r={22} fill="url(#rb-ballRed)" stroke={OUT} strokeWidth={6} />
          {antennaOn && <circle cx={750} cy={136} r={7} fill="#ffffff" opacity={0.9} />}
        </g>
      )}

      {/* Cabeza */}
      <rect x={288} y={232} width={504} height={398} rx={150} fill="url(#rb-chrome)" stroke={OUT} strokeWidth={9} />
      <path d="M330 300 Q 420 240 560 246" fill="none" stroke="#ffffff" strokeWidth={12} strokeLinecap="round" opacity={0.9} />
      <path d="M340 600 Q 540 640 740 600" fill="none" stroke="#5e6a82" strokeWidth={5} opacity={0.6} />
      <path d="M540 236 L540 300" stroke="#8592ab" strokeWidth={4} />
      {costume === 'boxing' && (
        <g clipPath="url(#rb-headClip)">
          <rect x={280} y={262} width={520} height={44} fill="#e3122b" stroke={OUT} strokeWidth={6} />
          <path d="M290 270 L790 270" stroke="#ff8a8a" strokeWidth={6} opacity={0.7} />
        </g>
      )}
      {/* visor */}
      <rect x={333} y={303} width={414} height={274} rx={106} fill="#0a0f1f" stroke={OUT} strokeWidth={6} />
      <rect x={345} y={315} width={390} height={250} rx={95} fill="url(#rb-visor)" />
      <g clipPath="url(#rb-visorClip)">
        <g stroke="#2fd8ff" strokeOpacity={0.07} strokeWidth={2}>
          {Array.from({ length: 17 }).map((_, i) => (
            <path key={i} d={`M345 ${330 + i * 15 + ((t * 0.6) % 15)} H735`} />
          ))}
        </g>
        <Eyes e={p.expression} blink={p.blink} t={t} color={eyeColor} />
        <Mouth e={p.expression} talk={p.talk} color={eyeColor} />
        <path d="M345 315 L470 315 L360 565 L345 565 Z" fill="#ffffff" opacity={0.07} />
        <path d="M500 315 L540 315 L430 565 L400 565 Z" fill="#ffffff" opacity={0.05} />
      </g>
      <rect x={345} y={315} width={390} height={250} rx={95} fill="none" stroke="#2fd8ff" strokeOpacity={0.35} strokeWidth={3} />

      {/* orejas */}
      <rect x={248} y={372} width={70} height={140} rx={30} fill="url(#rb-graphiteSide)" stroke={OUT} strokeWidth={7} />
      <circle cx={283} cy={442} r={22} fill={OUT} />
      <circle cx={283} cy={442} r={14} fill="#ff3b4e" filter="url(#rb-neon)" />
      <rect x={762} y={372} width={70} height={140} rx={30} fill="url(#rb-graphiteSide)" stroke={OUT} strokeWidth={7} />
      <circle cx={797} cy={442} r={22} fill={OUT} />
      <circle cx={797} cy={442} r={14} fill="#ff3b4e" filter="url(#rb-neon)" />
      {/* micro */}
      {!astronaut && (
        <g>
          <path d="M785 490 Q 760 600 640 588" fill="none" stroke={OUT} strokeWidth={14} strokeLinecap="round" />
          <path d="M785 490 Q 760 600 640 588" fill="none" stroke="#3a4462" strokeWidth={7} strokeLinecap="round" />
          <rect x={606} y={574} width={44} height={28} rx={14} fill="#1a2034" stroke={OUT} strokeWidth={5} />
          <circle cx={612} cy={588} r={6} fill="#ff3b4e" />
        </g>
      )}

      {/* Sombreros */}
      {costume === 'raincoat' && (
        <g>
          <path d="M250 300 Q 540 140 830 300 Q 860 330 820 336 Q 540 250 260 336 Q 220 330 250 300 Z" fill="url(#rb-yellow)" stroke={OUT} strokeWidth={8} />
          <path d="M340 290 Q 360 170 540 160 Q 720 170 740 290 Q 540 230 340 290 Z" fill="url(#rb-yellow)" stroke={OUT} strokeWidth={8} />
          <path d="M380 240 Q 450 190 540 186" fill="none" stroke="#fff6b0" strokeWidth={10} strokeLinecap="round" />
        </g>
      )}
      {costume === 'helmet' && (
        <g>
          <path d="M262 330 Q 270 120 540 110 Q 810 120 818 330 Q 540 290 262 330 Z" fill="url(#rb-camo)" stroke={OUT} strokeWidth={9} />
          <path d="M230 330 Q 540 280 850 330 L850 350 Q 540 305 230 350 Z" fill="#4f5a26" stroke={OUT} strokeWidth={7} />
          <g fill="#2a3012" opacity={0.8}>
            <path d="M350 230 q40 -40 100 -10 q-30 40 -100 10Z" /><path d="M560 170 q50 -20 90 10 q-40 30 -90 -10Z" /><path d="M640 260 q50 -30 100 0 q-40 40 -100 0Z" />
          </g>
          <path d="M330 200 Q 420 140 540 136" fill="none" stroke="#a9b56a" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
          <path d="M300 350 Q 300 560 380 600" fill="none" stroke="#2b2b18" strokeWidth={10} />
          <path d="M780 350 Q 780 560 700 600" fill="none" stroke="#2b2b18" strokeWidth={10} />
        </g>
      )}
      {costume === 'firefighter' && (
        <g>
          <path d="M262 330 Q 270 110 540 100 Q 810 110 818 330 Q 540 290 262 330 Z" fill="#d81f2c" stroke={OUT} strokeWidth={9} />
          <path d="M200 340 Q 540 270 880 340 L870 370 Q 540 310 210 370 Z" fill="#b3121f" stroke={OUT} strokeWidth={7} />
          <path d="M540 100 L540 300" stroke="#8a0014" strokeWidth={14} />
          <path d="M480 150 L600 150 L590 250 L540 280 L490 250 Z" fill="#ffd23f" stroke={OUT} strokeWidth={6} />
          <path d="M330 200 Q 420 140 520 132" fill="none" stroke="#ff8a8a" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        </g>
      )}
      {costume === 'conductor' && (
        <g>
          <path d="M300 300 Q 290 150 540 140 Q 790 150 780 300 Z" fill="#1d3f8f" stroke={OUT} strokeWidth={9} />
          <path d="M280 300 Q 540 250 800 300 L800 345 Q 540 295 280 345 Z" fill="#ffd23f" stroke={OUT} strokeWidth={7} />
          <path d="M300 340 Q 540 300 780 340 Q 760 400 540 385 Q 320 400 300 340 Z" fill="#0b1a3d" stroke={OUT} strokeWidth={7} />
          <path d="M340 220 Q 420 168 520 162" fill="none" stroke="#6f93e8" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
          <g transform="translate(540 215)">
            <circle r={44} fill="#ffd23f" stroke={OUT} strokeWidth={6} />
            <rect x={-26} y={-22} width={52} height={34} rx={8} fill="#e3122b" stroke={OUT} strokeWidth={4} />
            <rect x={-18} y={-16} width={14} height={12} rx={2} fill="#ffffff" /><rect x={4} y={-16} width={14} height={12} rx={2} fill="#ffffff" />
            <circle cx={-14} cy={18} r={7} fill={OUT} /><circle cx={14} cy={18} r={7} fill={OUT} />
          </g>
        </g>
      )}
      {costume === 'officer' && (
        <g>
          <path d="M290 300 Q 270 140 540 130 Q 810 140 790 300 Z" fill="#4a5530" stroke={OUT} strokeWidth={9} />
          <path d="M300 300 Q 540 250 780 300 L780 335 Q 540 290 300 335 Z" fill="#2e3520" stroke={OUT} strokeWidth={7} />
          <path d="M310 332 Q 540 296 770 332 Q 750 400 540 386 Q 330 400 310 332 Z" fill="#14170e" stroke={OUT} strokeWidth={7} />
          <path d="M360 318 Q 540 290 720 318" fill="none" stroke="#e9c249" strokeWidth={8} />
          <path d="M340 210 Q 420 160 520 154" fill="none" stroke="#8a9a5a" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
          <g transform="translate(540 220)">
            <path d="M-70 10 Q -40 -20 0 -8 Q 40 -20 70 10 Q 40 0 0 14 Q -40 0 -70 10 Z" fill="#e9c249" stroke={OUT} strokeWidth={4} />
            <circle r={36} fill="#e9c249" stroke={OUT} strokeWidth={6} />
            <polygon points={star(0, 0, 24)} fill="#b8901e" stroke={OUT} strokeWidth={2} />
          </g>
        </g>
      )}
      {costume === 'riot' && (
        <g>
          {/* casco antidisturbios */}
          <path d="M250 360 Q 250 110 540 100 Q 830 110 830 360 L800 372 Q 540 300 280 372 Z" fill="#1b2a4a" stroke={OUT} strokeWidth={9} />
          <path d="M320 210 Q 420 140 540 132" fill="none" stroke="#5d7bb8" strokeWidth={12} strokeLinecap="round" opacity={0.7} />
          <rect x={470} y={150} width={140} height={50} rx={12} fill="#ffffff" stroke={OUT} strokeWidth={5} />
          <text x={540} y={188} textAnchor="middle" fontFamily="'Anton', Impact, sans-serif" fontSize={36} fill="#1b2a4a">POLICÍA</text>
          {/* bisagras */}
          <circle cx={268} cy={350} r={22} fill="#0a0f1c" stroke={OUT} strokeWidth={5} />
          <circle cx={812} cy={350} r={22} fill="#0a0f1c" stroke={OUT} strokeWidth={5} />
          {/* visera transparente levantada a medias */}
          <path d="M268 340 Q 540 270 812 340 L800 470 Q 540 420 280 470 Z" fill="#bfe6ff" fillOpacity={0.22} stroke="#dff3ff" strokeWidth={6} strokeOpacity={0.9} />
          <path d="M320 350 Q 420 320 520 312" fill="none" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" opacity={0.55} />
        </g>
      )}
      {costume === 'navy' && (
        <g>
          {/* gorra de plato blanca de oficial de marina */}
          <path d="M250 250 Q 260 120 540 112 Q 820 120 830 250 Q 540 210 250 250 Z" fill="#ffffff" stroke={OUT} strokeWidth={9} />
          <path d="M300 200 Q 420 150 540 146" fill="none" stroke="#dfe6f2" strokeWidth={12} strokeLinecap="round" />
          <path d="M282 250 Q 540 214 798 250 L792 312 Q 540 274 288 312 Z" fill="#0a1022" stroke={OUT} strokeWidth={7} />
          <path d="M300 300 Q 540 265 780 300" fill="none" stroke="#f0c94a" strokeWidth={7} />
          <path d="M300 310 Q 540 276 780 310 Q 760 380 540 366 Q 320 380 300 310 Z" fill="#0a1022" stroke={OUT} strokeWidth={7} />
          <path d="M360 340 Q 450 322 520 320" fill="none" stroke="#3a4a74" strokeWidth={8} strokeLinecap="round" />
          {/* escudo con ancla y laureles */}
          <g transform="translate(540 262)">
            <path d="M-80 8 Q -50 -26 -10 -8 M80 8 Q 50 -26 10 -8" fill="none" stroke="#f0c94a" strokeWidth={10} strokeLinecap="round" />
            <circle r={32} fill="#f0c94a" stroke={OUT} strokeWidth={5} />
            <g stroke="#14234a" strokeWidth={5} fill="none" strokeLinecap="round">
              <circle cx={0} cy={-17} r={5} />
              <path d="M0 -12 L0 18 M-11 -4 L11 -4 M-16 8 Q -14 22 0 22 Q 14 22 16 8" />
            </g>
          </g>
        </g>
      )}
      {costume === 'pilot' && (
        <g>
          {/* gorra de piloto negra con banda dorada y alas */}
          <path d="M250 250 Q 260 120 540 112 Q 820 120 830 250 Q 540 210 250 250 Z" fill="#14182a" stroke={OUT} strokeWidth={9} />
          <path d="M300 200 Q 420 150 540 146" fill="none" stroke="#2c3350" strokeWidth={12} strokeLinecap="round" />
          <path d="M282 250 Q 540 214 798 250 L792 312 Q 540 274 288 312 Z" fill="#0a0d18" stroke={OUT} strokeWidth={7} />
          <path d="M296 284 Q 540 248 784 284" fill="none" stroke="#f0c94a" strokeWidth={10} />
          <path d="M300 310 Q 540 276 780 310 Q 760 380 540 366 Q 320 380 300 310 Z" fill="#0a0d18" stroke={OUT} strokeWidth={7} />
          <path d="M360 340 Q 450 322 520 320" fill="none" stroke="#3a4060" strokeWidth={8} strokeLinecap="round" />
          <g transform="translate(540 246)">
            <path d="M-110 4 Q -60 -34 -16 -8 L-16 8 Q -60 22 -110 4 Z M110 4 Q 60 -34 16 -8 L16 8 Q 60 22 110 4 Z" fill="#f0c94a" stroke={OUT} strokeWidth={5} />
            <circle r={26} fill="#f0c94a" stroke={OUT} strokeWidth={5} />
            <path d="M-12 4 L0 -14 L12 4 L0 0 Z" fill="#14182a" />
          </g>
        </g>
      )}
      {costume === 'rescuer' && (
        <g>
          {/* casco blanco de rescate con linterna */}
          <path d="M262 330 Q 270 110 540 100 Q 810 110 818 330 Q 540 290 262 330 Z" fill="#f4f6fb" stroke={OUT} strokeWidth={9} />
          <path d="M230 335 Q 540 285 850 335 L846 360 Q 540 312 234 360 Z" fill="#d7dde8" stroke={OUT} strokeWidth={7} />
          <path d="M540 104 L540 300" stroke="#c9d0dc" strokeWidth={22} />
          <path d="M300 250 Q 540 210 780 250" fill="none" stroke="#ff8a1f" strokeWidth={16} />
          <path d="M300 250 Q 540 210 780 250" fill="none" stroke="#e8eef6" strokeWidth={5} />
          <path d="M340 200 Q 420 145 520 136" fill="none" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
          <g transform="translate(540 205)">
            <rect x={-46} y={-30} width={92} height={56} rx={14} fill="#2a2f40" stroke={OUT} strokeWidth={6} />
            <circle r={20} fill="#fff7c2" stroke={OUT} strokeWidth={4} />
            <circle r={36} fill="#fff7c2" opacity={0.35 + 0.2 * Math.sin(t * 0.3)} />
          </g>
        </g>
      )}
      {costume === 'eco' && (
        <g>
          {/* sombrero de explorador con hojas */}
          <path d="M190 330 Q 540 250 890 330 Q 900 360 860 362 Q 540 300 220 362 Q 180 360 190 330 Z" fill="#b89a5a" stroke={OUT} strokeWidth={8} />
          <path d="M320 320 Q 320 160 540 150 Q 760 160 760 320 Q 540 280 320 320 Z" fill="#c9ab6a" stroke={OUT} strokeWidth={8} />
          <path d="M322 300 Q 540 262 758 300 L758 322 Q 540 282 322 322 Z" fill="#2f8a4a" stroke={OUT} strokeWidth={5} />
          <path d="M370 230 Q 440 180 530 176" fill="none" stroke="#e6d29a" strokeWidth={10} strokeLinecap="round" />
          <g transform="translate(700 292) rotate(-35)">
            <path d="M0 0 Q -24 -36 0 -76 Q 24 -36 0 0 Z" fill="#7be07b" stroke={OUT} strokeWidth={4} />
            <path d="M0 0 V-70" stroke={OUT} strokeWidth={3} />
          </g>
          <g transform="translate(730 300) rotate(10)">
            <path d="M0 0 Q -18 -28 0 -58 Q 18 -28 0 0 Z" fill="#3fbf6a" stroke={OUT} strokeWidth={4} />
          </g>
        </g>
      )}
      {costume === 'maritime' && (
        <g>
          {/* casco blanco de Salvamento Marítimo con franja roja y gafas de agua */}
          <path d="M262 330 Q 270 110 540 100 Q 810 110 818 330 Q 540 290 262 330 Z" fill="#f4f6fb" stroke={OUT} strokeWidth={9} />
          <path d="M276 270 Q 540 220 804 270 L812 312 Q 540 262 268 312 Z" fill="#d9381e" stroke={OUT} strokeWidth={6} />
          <path d="M340 200 Q 420 145 520 136" fill="none" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
          <path d="M230 335 Q 540 285 850 335 L846 360 Q 540 312 234 360 Z" fill="#d7dde8" stroke={OUT} strokeWidth={7} />
          {/* gafas subidas sobre el casco */}
          <path d="M330 232 Q 540 190 750 232" fill="none" stroke="#14151c" strokeWidth={14} />
          <g>
            <rect x={420} y={170} width={100} height={64} rx={26} fill="#7fd6ff" fillOpacity={0.7} stroke={OUT} strokeWidth={6} />
            <rect x={560} y={170} width={100} height={64} rx={26} fill="#7fd6ff" fillOpacity={0.7} stroke={OUT} strokeWidth={6} />
            <path d="M520 202 L560 202" stroke={OUT} strokeWidth={8} />
            <path d="M440 186 Q 460 178 480 180 M580 186 Q 600 178 620 180" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
      )}
      {costume === 'parent' && (
        <g>
          {/* gorro de lana con pompón */}
          <path d="M272 330 Q 280 120 540 110 Q 800 120 808 330 Q 540 296 272 330 Z" fill="#ff7a59" stroke={OUT} strokeWidth={9} />
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M${340 + i * 67} 300 Q ${350 + i * 60} 200 ${420 + i * 34} 130`} stroke="#e9603f" strokeWidth={8} fill="none" />
          ))}
          <path d="M250 340 Q 540 284 830 340 L834 384 Q 540 326 246 384 Z" fill="#ffe8d6" stroke={OUT} strokeWidth={7} />
          <path d="M260 362 Q 540 306 820 362" stroke="#e9c8ae" strokeWidth={6} strokeDasharray="10 10" fill="none" />
          <circle cx={540} cy={100} r={44} fill="#ffe8d6" stroke={OUT} strokeWidth={7} />
          <path d="M520 80 Q 540 70 556 84" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" fill="none" />
        </g>
      )}
      {costume === 'judge' && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={290 + i * 125} cy={250 - Math.sin((i / 4) * Math.PI) * 60} r={58} fill="#f2f2f2" stroke={OUT} strokeWidth={6} />
          ))}
          <circle cx={262} cy={360} r={46} fill="#f2f2f2" stroke={OUT} strokeWidth={6} />
          <circle cx={818} cy={360} r={46} fill="#f2f2f2" stroke={OUT} strokeWidth={6} />
        </g>
      )}
      {(p.partyHat ?? 0) > 0 && (
        <g transform={`translate(0 ${-(1 - (p.partyHat ?? 0)) * 400}) rotate(-12 600 230)`}>
          <path d="M520 250 L600 40 L680 250 Z" fill="#ff4d9d" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
          <path d="M540 200 L660 200 M560 145 L640 145 M580 92 L620 92" stroke="#ffe14d" strokeWidth={12} />
          <circle cx={600} cy={36} r={20} fill="#ffe14d" stroke={OUT} strokeWidth={6} />
        </g>
      )}
      {astronaut && (
        <g>
          <circle cx={540} cy={430} r={330} fill="url(#rb-glass)" stroke="#dff6ff" strokeWidth={10} strokeOpacity={0.85} />
          <circle cx={540} cy={430} r={330} fill="none" stroke={OUT} strokeWidth={4} strokeOpacity={0.6} />
          <path d="M330 280 Q 380 180 500 140" fill="none" stroke="#ffffff" strokeWidth={22} strokeLinecap="round" opacity={0.55} />
          <path d="M760 560 Q 800 500 812 430" fill="none" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
          <path d="M250 680 Q 540 800 830 680 L830 740 Q 540 850 250 740 Z" fill="url(#rb-suit)" stroke={OUT} strokeWidth={8} />
        </g>
      )}
      {/* café */}
      {(p.coffee ?? 0) > 0 && (
        <g transform={`translate(210 ${560 + (1 - (p.coffee ?? 0)) * 300}) scale(${p.coffee})`} opacity={p.coffee}>
          <g transform="rotate(-10)">
            <path d="M-70 -40 L70 -40 L58 90 Q 0 110 -58 90 Z" fill="#ffffff" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
            <path d="M68 -10 Q 120 -6 112 40 Q 104 76 62 66" fill="none" stroke={OUT} strokeWidth={12} />
            <path d="M68 -10 Q 120 -6 112 40 Q 104 76 62 66" fill="none" stroke="#ffffff" strokeWidth={5} />
            <ellipse cx={0} cy={-40} rx={70} ry={14} fill="#5a3010" stroke={OUT} strokeWidth={6} />
            <path d="M-46 20 L46 20" stroke="#ff3b4e" strokeWidth={14} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${-30 + i * 30} ${-60} q -16 -30 0 -60 q 16 -30 0 -60`} fill="none" stroke="#ffffff" strokeWidth={8} strokeLinecap="round"
                opacity={0.6} transform={`translate(0 ${-((t * 2 + i * 20) % 40)})`} />
            ))}
          </g>
        </g>
      )}
    </g>
  );
};
