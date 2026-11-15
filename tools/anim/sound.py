import numpy as np
SR = 44100
# ------------------------------------------------------------- sonido
def env(n, a, d):
    e = np.ones(n); ai = int(a * SR); di = int(d * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if di: e[-di:] = np.linspace(1, 0, di)
    return e

def tone(freq, dur, kind="sine", vol=1.0, decay=None):
    t = np.arange(int(dur * SR)) / SR
    if kind == "sine": w = np.sin(2 * np.pi * freq * t)
    elif kind == "tri": w = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * t))
    if decay: w *= np.exp(-t / decay)
    return w * vol

def music(total):
    """Bucle suave estilo son cubano: clave 3-2, bajo y acordes de guitarra punteada."""
    bpm = 104; beat = 60 / bpm; bar = 4 * beat
    out = np.zeros(int((total + 2) * SR))
    chords = [(220.0, [220, 261.6, 329.6]), (146.8, [293.7, 349.2, 440]), (164.8, [329.6, 415.3, 493.9]), (220.0, [261.6, 329.6, 440])]
    nbars = int(total / bar) + 2
    def add(sig, at):
        i = int(at * SR); j = min(len(out), i + len(sig))
        if i < len(out): out[i:j] += sig[: j - i]
    clave = [0, 3, 6, 10, 12]   # posiciones en corcheas de 2 compases (3-2)
    for b in range(nbars):
        root, ch = chords[b % 4]
        t0 = b * bar
        # clave
        if b % 2 == 0:
            for pos in clave:
                add(tone(2600, 0.06, decay=0.012, vol=0.22) + tone(1800, 0.06, decay=0.01, vol=0.1), t0 + pos * beat / 2)
        # bajo (tumbao)
        add(tone(root / 2, 0.5, "tri", 0.33, decay=0.25), t0 + 1.5 * beat)
        add(tone(root / 2 * 1.5, 0.5, "tri", 0.25, decay=0.25), t0 + 3 * beat)
        # guitarra punteada
        for k, pos in enumerate([0, 1, 1.5, 2.5, 3, 3.5]):
            f = ch[k % 3] * (2 if k % 2 else 1)
            add(tone(f, 0.35, "tri", 0.09, decay=0.09) + tone(f * 2, 0.35, "sine", 0.03, decay=0.06), t0 + pos * beat)
        # bongó suave
        for pos in (3, 3.5):
            add(tone(380 if pos == 3 else 300, 0.12, vol=0.12, decay=0.03), t0 + pos * beat)
    return out[: int(total * SR)]

def whoosh(dur=0.4):
    n = int(dur * SR); rng = np.random.default_rng(1)
    x = rng.standard_normal(n)
    k = 40; x = np.convolve(x, np.ones(k) / k, mode="same")
    return x * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.9

def pop():
    t = np.arange(int(0.14 * SR)) / SR
    f = 380 + 900 * t / 0.14
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05) * 0.5

def clink():
    return tone(2350, 0.25, vol=0.25, decay=0.05) + tone(3520, 0.25, vol=0.15, decay=0.04)

def shimmer():
    s = np.zeros(int(0.7 * SR))
    for i, f in enumerate([1568, 1976, 2349, 3136]):
        tt = tone(f, 0.4, vol=0.12, decay=0.12); st = int(i * 0.08 * SR); s[st:st + len(tt)] += tt
    return s

