"""Genera solo el audio (voz + música + efectos) y la línea de tiempo de un guion JSON, para el motor 3D.
Uso: python3 make_audio.py guion.json carpeta_salida/"""
import sys, os, json, asyncio, random, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_episode import tts, decode, GAP
from sound import SR, whoosh, pop, shimmer, music_style, riser, impact, heartbeat

def main(path, outdir):
    ep = json.load(open(path)); os.makedirs(outdir, exist_ok=True)
    voice = ep.get("voice", "es-MX-JorgeNeural")
    parts, words, segs, t0 = [], [], [], 0.25
    for i, s in enumerate(ep["segments"]):
        mp3 = os.path.join(outdir, f"_s{i}.mp3")
        w = asyncio.run(tts(s["text"], voice, mp3))
        if w and w[-1][2][-1:] not in ".,:?!;": w[-1][2] += "."
        a = decode(mp3); dur = len(a) / SR; os.remove(mp3)
        parts.append((t0, a)); words += [[round(x[0] + t0, 3), round(x[1] + t0, 3), x[2]] for x in w]
        segs.append({"i": i, "start": round(t0 - (0.25 if i == 0 else GAP / 2), 3), "dur": round(dur + GAP, 3),
                     **{k: v for k, v in s.items() if k != "text"}})
        t0 += dur + GAP
    total = t0 + 0.8
    segs[-1]["dur"] = round(total - segs[-1]["start"], 3)
    n = int(total * SR); v = np.zeros(n)
    for st, a in parts: i = int(st * SR); v[i:i + len(a)] += a[: n - i]
    sfx = np.zeros(n)
    def add(sig, at, vol=1.0):
        i = int(max(0, at) * SR); j = min(n, i + len(sig)); sfx[i:j] += sig[: j - i] * vol
    for k, s in enumerate(segs):
        st, d = s["start"], s["dur"]
        if k: add(whoosh(), st - 0.12, 0.35)
        if s.get("riser"): r = riser(); add(r, st - len(r) / SR + 0.05, 0.8)
        if s.get("impact"): add(impact(), st + 0.02, 0.9)
        if s.get("heartbeat"):
            for q in range(int(d / 0.85)): add(heartbeat(), st + q * 0.85, 0.7)
        if s.get("pop"): add(pop(), st + s["pop"], 0.6)
        if s.get("shimmer"): add(shimmer(), st + s["shimmer"], 0.8)
    curve = np.clip(np.linspace(0.0, 1.0, n) ** 0.8, 0, 1)
    mus = music_style(total, ep.get("music", "spy"), curve)[:n]
    fr = SR // 30
    venv = np.array([np.sqrt(np.mean(v[i * fr:(i + 1) * fr] ** 2) + 1e-9) for i in range(int(total * 30))])
    duck = np.repeat(np.where(venv > 0.01, 0.55, 1.0), fr); duck = np.pad(duck, (0, max(0, n - len(duck))), constant_values=1.0)[:n]
    duck = np.convolve(duck, np.ones(4000) / 4000, mode="same")
    mix = v + mus * 0.32 * duck + sfx * 0.6
    mix = mix / max(1e-6, np.max(np.abs(mix))) * 0.93
    with wave.open(os.path.join(outdir, "mix.wav"), "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((mix * 32767).astype(np.int16).tobytes())
    vm = venv / (np.percentile(venv, 95) + 1e-9)
    mouth = np.convolve(np.clip((vm - 0.15) * 1.3, 0, 1), [0.25, 0.5, 0.25], mode="same")
    json.dump({"total": round(total, 3), "frames": int(total * 30), "segments": segs, "words": words,
               "mouth": [round(float(x), 2) for x in mouth]}, open(os.path.join(outdir, "timeline.json"), "w"), ensure_ascii=False)
    print("OK", round(total, 2), "s")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
