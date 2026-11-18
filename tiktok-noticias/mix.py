import json, subprocess, unicodedata, re
import numpy as np

SR = 48000
FPS = 30
tl = json.load(open("app/src/timeline.json"))
G = json.load(open("guion.json"))
TOTAL = tl["total"] / FPS
N = int(TOTAL * SR) + SR

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)

def word_t(key, text, nth=0):
    seg = next(s for s in tl["segments"] if s["key"] == key)
    k = 0
    for w in seg["words"]:
        if norm(w["w"]).startswith(norm(text)):
            if k == nth:
                return w["s"] / FPS
            k += 1
    raise KeyError(text)

def seg_t(key):
    s = next(s for s in tl["segments"] if s["key"] == key)
    return s["from"] / FPS, (s["from"] + s["dur"]) / FPS

def place(buf, x, t, gain=1.0):
    i = int(max(0, t) * SR)
    n = min(len(x), len(buf) - i)
    if n > 0:
        buf[i:i + n] += x[:n] * gain

# ---------------- voz ----------------
voice = np.zeros(N, np.float32)
for s in tl["segments"]:
    v = load(f"audio/{s['key']}.mp3")
    place(voice, v, s["from"] / FPS, 1.0)

# ---------------- música (sintetizada) ----------------
BPM = 118
beat = 60 / BPM
t_all = np.arange(N) / SR

def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 28)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)).astype(np.float32)

rng = np.random.default_rng(1)
def hat():
    n = int(0.06 * SR)
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # paso alto simple
    return (x * env(n, 0.001, 0.018) * 0.35).astype(np.float32)

def snare():
    n = int(0.22 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t * 18) * 0.5 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * 0.5
    return x.astype(np.float32)

def saw(freq, dur, vol=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = 2 * ((t * freq) % 1) - 1
    x = np.convolve(x, np.ones(12) / 12, mode="same")  # suaviza
    return (x * env(n, 0.01, dur * 0.6) * vol).astype(np.float32)

def pad(freqs, dur, vol=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) for f in freqs)
    a = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4)
    return (x * a * vol / len(freqs)).astype(np.float32)

# progresión: Am - F - C - G
CH = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]
BASS = [55.0, 43.65, 65.41, 49.0]

serious = [seg_t(x["key"]) for x in G["segments"] if x.get("serious")]
def is_serious(t):
    return any(a - 0.2 <= t < b - 0.1 for a, b in serious)

drums = np.zeros(N, np.float32)
harm = np.zeros(N, np.float32)
softpad = np.zeros(N, np.float32)
K, H, S = kick(), hat(), snare()
nbeats = int(TOTAL / beat) + 2
for b in range(nbeats):
    t = b * beat
    bar = (b // 4) % 4
    if t < 0.55:  # deja respirar el arranque
        continue
    if is_serious(t):
        if b % 4 == 0:
            place(softpad, pad([f / 2 for f in CH[bar]], beat * 4, 0.9), t)
            place(softpad, saw(BASS[bar], beat * 4, 0.25), t)
        continue
    place(drums, K, t, 0.9)
    if b % 2 == 1:
        place(drums, S, t, 0.35)
    place(drums, H, t + beat / 2, 0.8)
    place(drums, H, t, 0.4)
    if b % 4 == 0:
        place(harm, pad(CH[bar], beat * 4, 0.55), t)
    place(harm, saw(BASS[bar], beat * 0.45, 0.45), t)
    place(harm, saw(BASS[bar] * 2, beat * 0.25, 0.18), t + beat / 2)

music = drums * 0.55 + harm * 0.5 + softpad * 0.6
music /= np.max(np.abs(music)) + 1e-9

# ducking bajo la voz
venv = np.abs(voice)
win = int(0.08 * SR)
venv = np.convolve(venv, np.ones(win) / win, mode="same")
duck = 1 - 0.55 * np.clip(venv / 0.05, 0, 1)
music *= 0.22 * duck

# ---------------- efectos ----------------
sfx = np.zeros(N, np.float32)
W = lambda n: load(f"app/public/{n}.wav")
whoosh, whip, boom, wow, ding, sw, click = W("whoosh"), W("whip"), W("vine-boom"), W("anime-wow"), W("ding"), W("switch"), W("mouse-click")

def thunder():
    n = int(2.0 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    for _ in range(3):
        x = np.convolve(x, np.ones(40) / 40, mode="same")
    x = x / (np.max(np.abs(x)) + 1e-9)
    return (x * np.minimum(1, t / 0.02) * np.exp(-t * 1.8)).astype(np.float32)

def impact():
    n = int(0.9 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    for _ in range(4):
        x = np.convolve(x, np.ones(30) / 30, mode="same")
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.7 + np.sin(2 * np.pi * (45 + 40 * np.exp(-t * 10)) * t) * 0.6
    return (x * np.exp(-t * 4.5)).astype(np.float32)

for s in tl["segments"][1:]:
    place(sfx, whoosh, s["from"] / FPS - 0.25, 0.55)
    place(sfx, sw, s["from"] / FPS + 0.05, 0.25)

place(sfx, whoosh, 0.0, 0.5)
place(sfx, boom, 16 / FPS, 0.55)  # aterrizaje del robot
SOUNDS = {"whoosh": whoosh, "whip": whip, "vine-boom": boom, "anime-wow": wow, "ding": ding, "switch": sw, "mouse-click": click}
for x in G["segments"]:
    for e in x.get("sfx", []):
        word, name, gain = e[0], e[1], e[2]
        off = e[3] if len(e) > 3 else -0.05
        snd = thunder() if name == "thunder" else impact() if name == "impact" else SOUNDS[name]
        try:
            place(sfx, snd, word_t(x["key"], word) + off, gain)
        except KeyError:
            print("aviso: palabra no encontrada para efecto:", x["key"], word)

mix = voice * 1.0 + music + sfx * 0.9
# limitador suave
peak = np.max(np.abs(mix))
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
mix = mix[: int(TOTAL * SR)]
st = np.stack([mix, mix], axis=1).astype(np.float32)
open("out/mezcla.f32", "wb").write(st.tobytes())
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "out/mezcla.f32",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", "out/mezcla.wav"], check=True)
print("mezcla ok, dur", round(len(mix) / SR, 2), "pico previo", round(float(peak), 2))
