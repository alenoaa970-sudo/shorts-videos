// "El ejército que era de goma" — short 3D (three.js + Remotion). Mundo y personajes originales.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, delayRender, continueRender, getInputProps } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, RenderPass, EffectPass, BloomEffect, VignetteEffect, DepthOfFieldEffect, HueSaturationEffect, BrightnessContrastEffect } from "postprocessing";
import TL from "./timeline.json";

export const FPS = 30;
export const TOTAL = (TL as any).frames as number;
const SEGS = (TL as any).segments as any[];
const WORDS = (TL as any).words as [number, number, string][];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: number[], b: number[], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as [number, number, number];
const back = (x: number) => { const u = clamp01(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2; };

// ------------------------------------------------------------------ materiales toon + contorno
let GRAD: THREE.DataTexture | null = null;
const gradMap = () => {
  if (GRAD) return GRAD;
  const d = new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]);
  GRAD = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); GRAD.magFilter = THREE.NearestFilter; GRAD.minFilter = THREE.NearestFilter; GRAD.needsUpdate = true;
  return GRAD;
};
const matCache: Record<string, THREE.Material> = {};
const toon = (c: string) => matCache["t" + c] || (matCache["t" + c] = new THREE.MeshToonMaterial({ color: c, gradientMap: gradMap() }));
const INKM = new THREE.MeshBasicMaterial({ color: "#0E0B0C", side: THREE.BackSide });

const Part: React.FC<{ geo: THREE.BufferGeometry; color: string; pos?: number[]; rot?: number[]; scale?: number[]; ink?: number }> = ({ geo, color, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1], ink = 0.05 }) => (
  <group position={pos as any} rotation={rot as any} scale={scale as any}>
    <mesh geometry={geo} material={toon(color)} />
    {ink > 0 && <mesh geometry={geo} material={INKM} scale={[1 + ink, 1 + ink, 1 + ink]} />}
  </group>
);

// geometrías compartidas
const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 24),
  cap: new THREE.CapsuleGeometry(0.5, 1, 6, 16),
  cone: new THREE.ConeGeometry(1, 1, 4),
  cone24: new THREE.ConeGeometry(1, 1, 24, 1, true),
  sph: new THREE.SphereGeometry(1, 24, 16),
  tor: new THREE.TorusGeometry(1, 0.06, 8, 48),
  disc: new THREE.CylinderGeometry(1, 1, 0.12, 40),
};

// ------------------------------------------------------------------ texturas pintadas (Canvas2D)
const paintTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep = 1) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const g = cv.getContext("2d")!; draw(g);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 8; return t;
};
let GRASS: THREE.Texture | null = null, STAR: THREE.Texture | null = null;
const grassTex = () => GRASS || (GRASS = paintTex(512, 512, (g) => {
  g.fillStyle = "#6E8A3E"; g.fillRect(0, 0, 512, 512);
  let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 900; i++) { g.fillStyle = ["#5E7A34", "#7E9A4A", "#58702E", "#8AA456"][i % 4]; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(r() * 512, r() * 512, 6 + r() * 26, 3 + r() * 10, r() * 3, 0, 6.3); g.fill(); }
  g.globalAlpha = 1; g.strokeStyle = "#3E5222"; g.lineWidth = 2;
  for (let i = 0; i < 300; i++) { const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - 8); g.stroke(); }
}, 40));
const starTex = () => STAR || (STAR = paintTex(256, 256, (g) => {
  g.clearRect(0, 0, 256, 256); g.fillStyle = "#F4EFE4"; g.beginPath(); g.arc(128, 128, 110, 0, 6.3); g.fill();
  g.fillStyle = "#4A5534"; g.beginPath(); g.arc(128, 128, 92, 0, 6.3); g.fill(); g.fillStyle = "#F4EFE4"; g.beginPath();
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 34 : 86; g.lineTo(128 + Math.cos(a) * rr, 128 + Math.sin(a) * rr); } g.fill();
}));

// ------------------------------------------------------------------ objetos
const OLIVE = "#5E6B3E", OLIVE_D = "#434C2C";
const Tank: React.FC<{ pos?: number[]; rotY?: number; sq?: number[]; puff?: number }> = ({ pos = [0, 0, 0], rotY = 0, sq = [1, 1, 1], puff = 0 }) => {
  const star = useMemo(() => new THREE.MeshBasicMaterial({ map: starTex(), transparent: true }), []);
  return (
    <group position={pos as any} rotation={[0, rotY, 0]} scale={sq as any}>
      <Part geo={G.cap} color={OLIVE_D} pos={[0, 0.42, 0.95]} rot={[0, 0, Math.PI / 2]} scale={[0.85, 1.75, 0.75]} />
      <Part geo={G.cap} color={OLIVE_D} pos={[0, 0.42, -0.95]} rot={[0, 0, Math.PI / 2]} scale={[0.85, 1.75, 0.75]} />
      <Part geo={G.box} color={OLIVE} pos={[0, 0.95, 0]} scale={[3.4, 0.75 + puff * 0.1, 1.9]} />
      <Part geo={G.box} color={OLIVE} pos={[0.85, 1.25, 0]} rot={[0, 0, -0.35]} scale={[1.4, 0.3, 1.8]} />
      <Part geo={G.cyl} color={OLIVE} pos={[-0.2, 1.6, 0]} scale={[0.85, 0.6, 0.85]} />
      <Part geo={G.sph} color={OLIVE} pos={[-0.2, 1.85, 0]} scale={[0.75, 0.32, 0.75]} />
      <Part geo={G.cyl} color={OLIVE_D} pos={[1.15, 1.65, 0]} rot={[0, 0, Math.PI / 2]} scale={[0.11, 2.1, 0.11]} />
      <mesh position={[-0.2, 1.62, 0.87]} material={star}><planeGeometry args={[0.7, 0.7]} /></mesh>
      <mesh position={[0.6, 0.95, 0.96]} material={star}><planeGeometry args={[0.6, 0.6]} /></mesh>
      {[...Array(5)].map((_, i) => (
        <group key={i}>
          <Part geo={G.cyl} color="#2E3420" pos={[-1.2 + i * 0.6, 0.4, 1.32]} rot={[Math.PI / 2, 0, 0]} scale={[0.26, 0.12, 0.26]} ink={0.08} />
          <Part geo={G.cyl} color="#2E3420" pos={[-1.2 + i * 0.6, 0.4, -1.32]} rot={[Math.PI / 2, 0, 0]} scale={[0.26, 0.12, 0.26]} ink={0.08} />
        </group>))}
    </group>);
};

// ejército instanciado (cientos de tanques baratos)
const Army: React.FC<{ rows: number; cols: number; gap: number; z0: number; color?: string; seed?: number }> = ({ rows, cols, gap, z0, color = OLIVE, seed = 3 }) => {
  const parts = useMemo(() => {
    let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const pos: [number, number, number, number][] = [];
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) pos.push([(j - cols / 2) * gap + r() * 1.5, 0, z0 - i * gap + r() * 1.5, (r() - 0.5) * 0.4]);
    const mk = (geo: THREE.BufferGeometry, col: string, local: THREE.Matrix4, ink: boolean) => {
      const m = new THREE.InstancedMesh(geo, ink ? INKM : toon(col), pos.length); const M = new THREE.Matrix4(), R = new THREE.Matrix4();
      pos.forEach((p, k) => { R.makeRotationY(p[3]); M.makeTranslation(p[0], p[1], p[2]).multiply(R).multiply(local); m.setMatrixAt(k, M); });
      m.instanceMatrix.needsUpdate = true; m.frustumCulled = false; return m;
    };
    const L = (t: number[], sc: number[], rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(...t), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, rz)), new THREE.Vector3(...sc));
    const out: THREE.InstancedMesh[] = [];
    const defs: [THREE.BufferGeometry, string, THREE.Matrix4][] = [
      [G.box, color, L([0, 0.95, 0], [3.4, 0.75, 1.9])], [G.cyl, color, L([-0.2, 1.6, 0], [0.85, 0.6, 0.85])],
      [G.cyl, OLIVE_D, L([1.15, 1.65, 0], [0.11, 2.1, 0.11], Math.PI / 2)], [G.box, OLIVE_D, L([0, 0.42, 0.95], [3.6, 0.8, 0.6])], [G.box, OLIVE_D, L([0, 0.42, -0.95], [3.6, 0.8, 0.6])]];
    defs.forEach(([g, c, l]) => { out.push(mk(g, c, l, false)); const li = l.clone().multiply(new THREE.Matrix4().makeScale(1.06, 1.06, 1.06)); out.push(mk(g, c, li, true)); });
    return out;
  }, [rows, cols, gap, z0, color, seed]);
  return <>{parts.map((m, i) => <primitive key={i} object={m} />)}</>;
};

const Trees: React.FC<{ n: number; r0: number; r1: number; seed?: number; color?: string }> = ({ n, r0, r1, seed = 5, color = "#3E6A34" }) => {
  const items = useMemo(() => { let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return [...Array(n)].map(() => { const a = r() * 6.28, d = r0 + r() * (r1 - r0); return [Math.cos(a) * d, Math.sin(a) * d - 20, 0.7 + r() * 0.8]; }); }, [n, r0, r1, seed]);
  return <>{items.map((p, i) => (
    <group key={i} position={[p[0], 0, p[1]]} scale={[p[2], p[2], p[2]]}>
      <Part geo={G.cyl} color="#5A3A22" pos={[0, 1, 0]} scale={[0.25, 2, 0.25]} />
      <Part geo={G.sph} color={color} pos={[0, 3.2, 0]} scale={[1.6, 1.9, 1.6]} />
      <Part geo={G.sph} color={color} pos={[0.6, 2.6, 0.3]} scale={[1.1, 1.2, 1.1]} />
    </group>))}</>;
};

const Ground: React.FC<{ color?: string }> = ({ color }) => {
  const m = useMemo(() => new THREE.MeshToonMaterial({ map: grassTex(), color: color || "#FFFFFF", gradientMap: gradMap() }), [color]);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} material={m}><planeGeometry args={[600, 600]} /></mesh>;
};

const Tent: React.FC<{ pos: number[]; s?: number }> = ({ pos, s = 1 }) => (
  <group position={pos as any} scale={[s, s, s]}>
    <Part geo={G.cone} color="#7A7448" pos={[0, 1.2, 0]} rot={[0, Math.PI / 4, 0]} scale={[2.2, 2.4, 2.2]} />
  </group>);

const Easel: React.FC<{ pos: number[]; color: string }> = ({ pos, color }) => (
  <group position={pos as any}>
    <Part geo={G.box} color="#8A5A30" pos={[-0.35, 0.9, 0]} rot={[0, 0, 0.12]} scale={[0.07, 1.9, 0.07]} />
    <Part geo={G.box} color="#8A5A30" pos={[0.35, 0.9, 0]} rot={[0, 0, -0.12]} scale={[0.07, 1.9, 0.07]} />
    <Part geo={G.box} color="#F4EFE4" pos={[0, 1.35, 0.05]} scale={[0.95, 0.75, 0.04]} />
    <Part geo={G.box} color={color} pos={[0, 1.35, 0.08]} scale={[0.6, 0.35, 0.02]} ink={0} />
  </group>);

// personaje 2D dentro del mundo 3D (recibe la luz de la escena)
const Sprite: React.FC<{ tex: THREE.Texture; pos: number[]; h?: number; flip?: boolean; bob?: number }> = ({ tex, pos, h = 2.1, flip, bob = 0 }) => {
  const m = useMemo(() => new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide }), [tex]);
  const w = h * 0.6;
  return (
    <group position={[pos[0], pos[1] + bob, pos[2]]}>
      <mesh position={[0, h / 2 - h * 0.012, 0]} scale={[flip ? -1 : 1, 1, 1]} material={m}><planeGeometry args={[w, h]} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.05]}><circleGeometry args={[0.45, 24]} /><meshBasicMaterial color="#000" transparent opacity={0.35} /></mesh>
    </group>);
};

const Cam: React.FC<{ p: number[]; l: number[]; fov: number }> = ({ p, l, fov }) => {
  const { camera } = useThree() as any;
  camera.position.set(p[0], p[1], p[2]); camera.fov = fov; camera.near = 0.1; camera.far = 800; camera.updateProjectionMatrix(); camera.lookAt(l[0], l[1], l[2]);
  return null;
};

const Sky: React.FC<{ kind: "day" | "dusk" | "night" | "dawn" }> = ({ kind }) => {
  const C = { day: ["#5FA8E0", "#A9D2EE"], dusk: ["#E07A45", "#F2B27A"], night: ["#0A1230", "#1A2650"], dawn: ["#EE9A4E", "#FFCF8E"] }[kind];
  const sky = useMemo(() => new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(C[0]) }, bot: { value: new THREE.Color(C[1]) } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float h = clamp(vP.y*1.8, 0.0, 1.0); gl_FragColor = vec4(mix(bot, top, h), 1.0); }" }), [kind]);
  return (<>
    <color attach="background" args={[C[1]]} />
    <mesh material={sky} scale={[500, 500, 500]}><sphereGeometry args={[1, 32, 16]} /></mesh>
    <fog attach="fog" args={[C[1], 40, kind === "night" ? 140 : 260]} />
    <hemisphereLight args={[kind === "night" ? "#5A70B0" : "#FFF2D8", kind === "night" ? "#10142A" : "#4A5A3A", kind === "night" ? 0.7 : 1.2]} />
    <directionalLight position={kind === "dawn" || kind === "dusk" ? [-30, 12, -40] : [20, 35, 15]} intensity={kind === "night" ? 0.9 : 2.2} color={kind === "night" ? "#9FB4FF" : kind === "day" ? "#FFF4E0" : "#FFB36B"} />
  </>);
};

// ------------------------------------------------------------------ tomas
type ShotProps = { t: number; d: number; tex: Record<string, THREE.Texture>; mouth: number };

const ShotLift: React.FC<ShotProps> = ({ t, tex }) => {
  const lift = 2.22 + Math.sin(t * 2.4) * 0.06;
  const k = smooth(t / 4.4);
  return (<>
    <Sky kind="day" /><Ground /><Trees n={60} r0={40} r1={110} />
    <Tent pos={[-9, 0, -14]} /><Tent pos={[8, 0, -18]} s={1.2} />
    <Tank pos={[-10, 0, -8]} rotY={0.6} /><Tank pos={[11, 0, -10]} rotY={-0.5} />
    <Tank pos={[0, lift, 0]} rotY={0.08} sq={[0.85, 0.85, 0.85]} />
    <Sprite tex={tex.lift} pos={[-1.05, 0, 0.9]} h={2.3} />
    <Sprite tex={tex.lift2} pos={[1.05, 0, 0.9]} h={2.3} flip />
    <Cam p={lerp3([0.8, 0.7, 11.5], [0.2, 1.0, 9.0], k)} l={[0, 2.3, 0]} fov={46} />
  </>);
};

const ShotRubber: React.FC<ShotProps> = ({ t, tex }) => {
  const inflate = clamp01(t / 1.25); const pop = back((t - 1.15) / 0.35);
  const sy = t < 1.2 ? 0.25 + inflate * 0.7 : 0.95 + (pop - 1) * 0.25 + 0.05;
  const sx = t < 1.2 ? 1.12 - inflate * 0.12 : 1.0 + Math.sin(t * 9) * 0.02 * Math.exp(-(t - 1.2) * 2);
  const k = smooth(t / 5.6);
  return (<>
    <Sky kind="day" /><Ground /><Trees n={50} r0={35} r1={100} seed={9} />
    <Tank pos={[0, 0, 0]} rotY={-0.5} sq={[sx * 0.9, sy * 0.9, sx * 0.9]} puff={1} />
    <Part geo={G.cyl} color="#9AA6B2" pos={[-1.7, 0.6, 1.2]} scale={[0.06, 0.6, 0.06]} />
    <Sprite tex={tex.pumper} pos={[-2.4, 0, 2.0]} h={2.2} bob={Math.abs(Math.sin(t * 7)) * -0.08} />
    <Sprite tex={tex.point} pos={[2.6, 0, 2.2]} h={2.2} flip />
    <Cam p={lerp3([6.5, 2.2, 10.5], [4.6, 1.8, 8.5], k)} l={[0, 1.2, 0.5]} fov={44} />
  </>);
};

const ShotArtists: React.FC<ShotProps> = ({ t, tex }) => {
  const k = smooth(t / 5.9);
  return (<>
    <Sky kind="day" /><Ground /><Trees n={60} r0={30} r1={100} seed={13} />
    <Tent pos={[-6, 0, -6]} /><Tent pos={[5, 0, -7]} s={1.1} /><Tent pos={[0, 0, -12]} s={1.3} />
    <Easel pos={[-3.2, 0, 0.6]} color="#C8372D" /><Easel pos={[3.6, 0, -1.2]} color="#2F6FB0" />
    <Sprite tex={tex.painter} pos={[-2.1, 0, 1.1]} h={2.2} />
    <Sprite tex={tex.actor} pos={[0.4, 0, 0.2]} h={2.2} />
    <Sprite tex={tex.sound} pos={[2.6, 0, 1.0]} h={2.2} flip />
    <Part geo={G.box} color="#4A4F3A" pos={[3.6, 0.45, 2.1]} scale={[0.9, 0.9, 0.7]} />
    <Part geo={G.cyl} color="#2A2A2A" pos={[3.45, 0.6, 2.47]} rot={[Math.PI / 2, 0, 0]} scale={[0.18, 0.05, 0.18]} />
    <Tank pos={[-8, 0, -3]} rotY={0.9} />
    <Cam p={lerp3([-4.5, 1.8, 9.5], [4.0, 1.7, 9.0], k)} l={lerp3([-1.2, 1.3, 0], [1.2, 1.3, 0], k)} fov={44} />
  </>);
};

const ShotArmy: React.FC<ShotProps> = ({ t }) => {
  const k = smooth(t / 4.4);
  return (<>
    <Sky kind="day" /><Ground /><Trees n={90} r0={80} r1={180} seed={21} />
    <Army rows={14} cols={18} gap={7} z0={0} />
    <Cam p={lerp3([0, 2.0, 9], [0, 34, 42], k)} l={lerp3([0, 1.5, 0], [0, 0, -45], k)} fov={lerp(46, 52, k)} />
  </>);
};

const Rings: React.FC<{ t: number; pos: number[] }> = ({ t, pos }) => (<>
  {[0, 1, 2, 3].map((i) => { const ph = ((t * 0.9 + i / 4) % 1); return (
    <mesh key={i} position={pos as any} rotation={[0, Math.PI / 2, 0]} scale={[0.6 + ph * 4.5, 0.6 + ph * 4.5, 1]}>
      <torusGeometry args={[1, 0.05, 8, 64]} /><meshBasicMaterial color="#FFE7A0" transparent opacity={(1 - ph) * 0.55} />
    </mesh>); })}
</>);

const ShotNight: React.FC<ShotProps> = ({ t, tex }) => {
  const k = smooth(t / 5.0); const a = lerp(-0.5, 0.35, k);
  return (<>
    <Sky kind="night" /><Ground color="#46507A" /><Trees n={60} r0={35} r1={100} seed={17} color="#24304A" />
    <mesh position={[30, 40, -90]}><sphereGeometry args={[6, 32, 16]} /><meshBasicMaterial color="#FFF3C4" /></mesh>
    <Army rows={6} cols={10} gap={7} z0={-12} color="#3E4A3A" seed={8} />
    <group position={[0, 0, 0]}>
      <Part geo={G.box} color="#4A5232" pos={[0, 1.2, 0]} scale={[3.4, 1.6, 2]} />
      <Part geo={G.box} color="#4A5232" pos={[2.3, 0.9, 0]} scale={[1.3, 1.2, 1.9]} />
      <Part geo={G.box} color="#9FC3D8" pos={[2.95, 1.2, 0]} scale={[0.05, 0.5, 1.4]} ink={0} />
      <Part geo={G.cyl} color="#222222" pos={[-1, 0.4, 1.05]} rot={[Math.PI / 2, 0, 0]} scale={[0.45, 0.25, 0.45]} />
      <Part geo={G.cyl} color="#222222" pos={[2, 0.4, 1.05]} rot={[Math.PI / 2, 0, 0]} scale={[0.45, 0.25, 0.45]} />
      <Part geo={G.cone24} color="#8A8F98" pos={[-0.6, 3.0, 0]} rot={[0, 0, Math.PI / 2]} scale={[1.0, 1.4, 1.0]} />
      <pointLight position={[-2.4, 3, 0]} color="#FFD98A" intensity={25} distance={14} />
    </group>
    <Rings t={t} pos={[-1.6, 3.0, 0]} />
    <Sprite tex={tex.sound} pos={[2.2, 0, 2.2]} h={2.2} flip />
    <Cam p={[Math.sin(a) * 14, 3.0, Math.cos(a) * 14]} l={[0, 2.2, 0]} fov={46} />
  </>);
};

const ShotBinoculars: React.FC<ShotProps> = ({ t }) => (<>
  <Sky kind="dusk" /><Ground color="#C9A27A" /><Trees n={70} r0={90} r1={200} seed={31} color="#3E5A34" />
  <Army rows={10} cols={22} gap={6} z0={0} />
  <Cam p={[Math.sin(t * 0.8) * 0.6, 3.2 + Math.sin(t * 1.3) * 0.15, 85]} l={[Math.sin(t * 0.5) * 6, 1, 0]} fov={lerp(22, 15, smooth(t / 4.8))} />
</>);

const ShotRiver: React.FC<ShotProps> = ({ t, tex }) => {
  const k = smooth(t / 5.1);
  const water = useMemo(() => new THREE.MeshToonMaterial({ color: "#4F86A8", gradientMap: gradMap() }), []);
  return (<>
    <Sky kind="dawn" />
    <mesh position={[-10, 9, -120]}><sphereGeometry args={[14, 32, 16]} /><meshBasicMaterial color="#FFC266" toneMapped={false} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -40]} material={water}><planeGeometry args={[600, 70]} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]}><planeGeometry args={[600, 30]} /><meshToonMaterial color="#8A7A4E" gradientMap={gradMap()} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -90]}><planeGeometry args={[600, 30]} /><meshToonMaterial color="#6E7A44" gradientMap={gradMap()} /></mesh>
    <Trees n={60} r0={70} r1={120} seed={41} color="#4A6A3A" />
    {[...Array(9)].map((_, i) => { const x = -60 + i * 14 + t * 2.2; const z = -30 - (i % 3) * 12; return (
      <group key={i} position={[x, 0.1 + Math.sin(t * 2 + i) * 0.08, z]}>
        <Part geo={G.box} color="#5A4A30" pos={[0, 0.35, 0]} scale={[3.2, 0.7, 1.4]} />
        <Part geo={G.box} color="#3E4A2E" pos={[0, 0.95, 0]} scale={[2, 0.5, 1.1]} />
      </group>); })}
    {[...Array(8)].map((_, i) => { const ph = (t * 0.15 + i / 8) % 1; return (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-40 + i * 11 + ph * 6, 0.02, -20 - (i % 4) * 9]}><planeGeometry args={[5, 0.25]} /><meshBasicMaterial color="#FFE7B0" transparent opacity={0.7} /></mesh>); })}
    <Sprite tex={tex.point} pos={[-2.6, 0, 3.5]} h={2.3} />
    <Sprite tex={tex.wow} pos={[2.2, 0, 3.0]} h={2.3} flip />
    <Cam p={lerp3([0, 2.2, 13], [0, 1.6, 10.5], k)} l={[0, 1.2, -30]} fov={48} />
  </>);
};

const ShotMedal: React.FC<ShotProps> = ({ t }) => {
  const def = clamp01((t - 0.3) / 3.2); const sy = 1 - def * 0.82 + Math.sin(t * 10) * 0.03 * def;
  const mdY = lerp(9, 3.6, smooth(t / 2.2));
  return (<>
    <Sky kind="night" /><Ground color="#3A4466" /><Trees n={40} r0={30} r1={90} seed={51} color="#1E2A40" />
    <spotLight position={[0, 14, 6]} angle={0.45} penumbra={0.6} intensity={180} color="#FFE9B0" />
    <Tank pos={[0, 0, 0]} rotY={-0.4} sq={[1 + def * 0.15, sy, 1 + def * 0.15]} />
    <group position={[0, mdY, 1.5]} rotation={[0.1, t * 1.6, 0]}>
      <Part geo={G.disc} color="#E3B341" rot={[Math.PI / 2, 0, 0]} scale={[0.9, 1, 0.9]} />
      <mesh position={[0, 0, 0.07]}><torusGeometry args={[0.7, 0.06, 8, 48]} /><meshToonMaterial color="#FFE08A" gradientMap={gradMap()} /></mesh>
      <Part geo={G.box} color="#2F5FA0" pos={[0, 1.25, 0]} scale={[0.7, 1.5, 0.06]} />
      <Part geo={G.box} color="#F4EFE4" pos={[0, 1.25, 0.04]} scale={[0.22, 1.5, 0.02]} ink={0} />
    </group>
    <pointLight position={[0, mdY, 3]} intensity={20} color="#FFD36B" distance={8} />
    <Cam p={lerp3([3.5, 2.6, 8], [2.2, 3.0, 6.2], smooth(t / 4))} l={[0, 2.4, 0]} fov={46} />
  </>);
};

const ShotEnd: React.FC<ShotProps> = ({ t }) => (<>
  <Sky kind="day" /><Ground /><Trees n={60} r0={60} r1={150} seed={61} />
  <Army rows={8} cols={12} gap={7} z0={-8} />
  <Cam p={[Math.sin(t * 0.3) * 8, 12, 30]} l={[0, 0, -20]} fov={50} />
</>);

const SHOTS: Record<string, React.FC<ShotProps>> = { lift: ShotLift, rubber: ShotRubber, artists: ShotArtists, army: ShotArmy, night: ShotNight, binoculars: ShotBinoculars, river: ShotRiver, medal: ShotMedal, end: ShotEnd };
const DOF: Record<string, [number, number, number]> = { lift: [6.5, 4, 3], rubber: [5.6, 3, 3], artists: [6, 4, 3], army: [20, 40, 1.5], night: [9, 5, 3], binoculars: [85, 30, 2], river: [11, 6, 2.5], medal: [6, 4, 3], end: [10, 2, 6] };

// post-proceso manejado a mano (el <EffectComposer> de R3F sale en negro bajo Remotion)
const Post: React.FC<{ dof: [number, number, number] }> = ({ dof }) => {
  const { gl, scene, camera, size } = useThree() as any;
  const fx = useMemo(() => ({
    dof: new DepthOfFieldEffect(camera, { worldFocusDistance: dof[0], worldFocusRange: dof[1], bokehScale: dof[2] }),
    bloom: new BloomEffect({ luminanceThreshold: 0.82, intensity: 0.55, mipmapBlur: true }),
    vig: new VignetteEffect({ darkness: 0.55, offset: 0.3 }),
    tone: new HueSaturationEffect({ saturation: 0.28 }),
    bc: new BrightnessContrastEffect({ contrast: 0.12 }),
  }), [camera]);
  const composer = useMemo(() => {
    const c = new EffectComposer(gl, { multisampling: 4, frameBufferType: THREE.HalfFloatType });
    c.addPass(new RenderPass(scene, camera)); c.addPass(new EffectPass(camera, fx.dof)); c.addPass(new EffectPass(camera, fx.bloom, fx.tone, fx.bc, fx.vig));
    return c;
  }, [gl, scene, camera, fx]);
  useEffect(() => { composer.setSize(size.width, size.height); }, [composer, size.width, size.height]);
  (fx.dof.cocMaterial as any).worldFocusDistance = dof[0]; (fx.dof.cocMaterial as any).worldFocusRange = dof[1]; fx.dof.bokehScale = dof[2];
  useFrame(() => { composer.render(); }, 1);
  return null;
};

// ------------------------------------------------------------------ capa 2D: subtítulos, etiquetas, final
const Captions: React.FC<{ T: number }> = ({ T }) => {
  const groups: [number, number, string][][] = []; let cur: [number, number, string][] = [];
  WORDS.forEach((w) => { cur.push(w); const n = cur.reduce((a, x) => a + x[2].length, 0); if (cur.length >= 3 || n > 13 || /[.,:?!;…]$/.test(w[2])) { groups.push(cur); cur = []; } });
  if (cur.length) groups.push(cur);
  let g: [number, number, string][] | null = null;
  groups.forEach((gr, i) => { const end = i + 1 < groups.length ? groups[i + 1][0][0] : gr[gr.length - 1][1] + 0.4; if (T >= gr[0][0] - 0.03 && T < Math.min(end, gr[gr.length - 1][1] + 0.5)) g = gr; });
  if (!g) return null;
  const age = T - g[0][0]; const sc = 0.85 + 0.15 * back(age / 0.18);
  let curW = g[0]; g.forEach((w) => { if (w[0] - 0.02 <= T) curW = w; });
  return (
    <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", transform: `scale(${sc})`, padding: "0 60px", boxSizing: "border-box" }}>
      {g.map((w, i) => (
        <span key={i} style={{ fontFamily: "InterBlack", fontSize: 112, lineHeight: "128px", color: w === curW ? "#FFD23F" : "#FFFFFF", WebkitTextStroke: "22px #140C08", paintOrder: "stroke fill", textShadow: "6px 8px 0 rgba(0,0,0,.45)", marginRight: 26, display: "inline-block" }}>{w[2].toUpperCase()}</span>))}
    </div>);
};

const Chip: React.FC<{ text: string; tl: number; y?: number; bg?: string }> = ({ text, tl, y = 150, bg = "#FFD23F" }) => {
  if (!text) return null; const a = back(tl / 0.4);
  return (<div style={{ position: "absolute", top: y, width: "100%", display: "flex", justifyContent: "center" }}>
    <div style={{ transform: `scale(${a})`, background: bg, border: "6px solid #140C08", borderRadius: 40, padding: "10px 36px", fontFamily: "InterBlack", fontSize: 46, color: "#1A120C", boxShadow: "6px 8px 0 rgba(0,0,0,.45)" }}>{text}</div></div>);
};

const Binocular: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs><mask id="bm"><rect width="1080" height="1920" fill="white" /><circle cx="360" cy="960" r="430" fill="black" /><circle cx="720" cy="960" r="430" fill="black" /></mask></defs>
    <rect width="1080" height="1920" fill="#050505" mask="url(#bm)" />
    <line x1="540" y1="780" x2="540" y2="1140" stroke="rgba(255,255,255,.35)" strokeWidth="3" /><line x1="430" y1="960" x2="650" y2="960" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
  </svg>);

const EndCard: React.FC<{ tl: number }> = ({ tl }) => {
  const a = back(tl / 0.45);
  return (<AbsoluteFill style={{ background: "rgba(20,12,8,.35)" }}>
    <div style={{ position: "absolute", top: 380, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${a}) rotate(-4deg)`, background: "#E53935", border: "10px solid #140C08", borderRadius: 60, padding: "20px 70px", fontFamily: "InterBlack", fontSize: 120, color: "#FFF", WebkitTextStroke: "8px #7A1010", paintOrder: "stroke fill", boxShadow: "10px 12px 0 rgba(0,0,0,.5)" }}>¡SÍGUEME!</div></div>
    <img src={staticFile("ghost/actor.png")} style={{ position: "absolute", left: 270, top: 980, width: 540 }} />
  </AbsoluteFill>);
};

// ------------------------------------------------------------------ composición
const TEXNAMES = ["lift", "lift2", "idle", "point", "wow", "worried", "painter", "actor", "sound", "pumper"];

export const GhostShort: React.FC = () => {
  const frame = useCurrentFrame(); const T = frame / FPS;
  const [handle] = useState(() => delayRender("texturas y fuente"));
  const [tex, setTex] = useState<Record<string, THREE.Texture> | null>(null);
  useEffect(() => {
    const L = new THREE.TextureLoader();
    const font = new FontFace("InterBlack", `url(${staticFile("ghost/InterDisplay-Black.otf")})`);
    Promise.all([font.load().then((f) => (document as any).fonts.add(f)), ...TEXNAMES.map((n) => L.loadAsync(staticFile(`ghost/${n}.png`)))]).then((res) => {
      const ts = res.slice(1) as THREE.Texture[]; ts.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; });
      setTex(Object.fromEntries(TEXNAMES.map((n, i) => [n, ts[i]]))); continueRender(handle);
    });
  }, [handle]);
  let idx = 0; SEGS.forEach((s, i) => { if (s.start <= T) idx = i; });
  const seg = SEGS[idx]; const tl = T - seg.start; const Shot = SHOTS[seg.shot] || ShotEnd;
  // temblor en impactos: cambia de signo cada cuadro y se apaga en 7 cuadros
  const fi = Math.floor(tl * FPS); const shake = seg.impact && fi < 7 ? (fi % 2 ? 1 : -1) * (7 - fi) * 4 : 0;
  const dof = DOF[seg.shot] || [8, 4, 2];
  const mouth = ((TL as any).mouth as number[])[Math.min(frame, (TL as any).mouth.length - 1)] || 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px) scale(${1 + (seg.impact && fi < 7 ? 0.03 : 0)})` }}>
        {tex && (
          <ThreeCanvas width={1080} height={1920} gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}>
            <Shot t={tl} d={seg.dur} tex={tex} mouth={mouth} />
            {!(getInputProps() as any).nopost && <Post dof={dof} />}
          </ThreeCanvas>)}
      </AbsoluteFill>
      {seg.shot === "binoculars" && <Binocular />}
      {seg.shot === "end" && <EndCard tl={tl} />}
      {tl < 0.13 && <AbsoluteFill style={{ background: `rgba(255,255,255,${0.65 * (1 - tl / 0.13)})` }} />}
      {seg.heartbeat && <AbsoluteFill style={{ boxShadow: `inset 0 0 260px rgba(179,0,10,${0.5 * Math.max(0, Math.sin(((tl % 0.85) / 0.85) * Math.PI * 2)) ** 6})` }} />}
      <Chip text={seg.chip} tl={seg.shot === "end" ? tl - 0.3 : tl} y={seg.shot === "end" ? 230 : 150} bg={seg.shot === "end" ? "#FFFFFF" : idx % 2 ? "#7FD4C1" : "#FFD23F"} />
      <Captions T={T} />
      {!(getInputProps() as any).mute && <Audio src={staticFile("ghost/mix.wav")} />}
    </AbsoluteFill>);
};
