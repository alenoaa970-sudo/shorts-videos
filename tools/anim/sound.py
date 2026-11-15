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



# ------------------------------------------------------------------ música por estilo
def _saw(freq, dur, vol=1.0, decay=None, harmonics=6):
    t = np.arange(int(dur * SR)) / SR
    w = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, harmonics + 1)) * 0.6
    if decay: w *= np.exp(-t / decay)
    return w * vol

def _noise(dur, vol=1.0, decay=0.05, smooth=1, seed=0):
    n = int(dur * SR); x = np.random.default_rng(seed).standard_normal(n)
    if smooth > 1: x = np.convolve(x, np.ones(smooth) / smooth, mode="same")
    return x * np.exp(-np.arange(n) / SR / decay) * vol

def _kick(vol=0.9):
    t = np.arange(int(0.35 * SR)) / SR
    f = 120 * np.exp(-t * 18) + 42
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18) * vol

NOTE = lambda n: 440.0 * 2 ** ((n - 69) / 12)

def music_style(total, style="cuba", intensity=None):
    """Música generada según el tono del vídeo: cuba | spy | mystery | epic | upbeat."""
    if style == "cuba":
        return music(total)
    out = np.zeros(int((total + 3) * SR))
    def add(sig, at, vol=1.0):
        i = int(at * SR); j = min(len(out), i + len(sig))
        if 0 <= i < len(out): out[i:j] += sig[: j - i] * vol
    if style == "spy":
        bpm = 116; e = 60 / bpm / 2
        riff = [50, 50, 53, 55, 57, 53, 55, 52]          # re menor, ostinato de tensión
        for i in range(int(total / e) + 1):
            t0 = i * e; bar = i // 16
            n = riff[i % 8] - (5 if (bar % 4) == 2 else 0)
            add(_saw(NOTE(n - 12), e * 0.9, 0.22, decay=0.12, harmonics=5), t0)
            if i % 2 == 0: add(_noise(0.05, 0.10, 0.012, seed=i), t0)                  # charles
            if i % 8 == 4: add(_noise(0.18, 0.28, 0.05, smooth=3, seed=i), t0)         # caja
            if i % 8 == 0: add(_kick(0.55), t0)
            if i % 16 == 14: add(tone(NOTE(n + 12), 0.4, "tri", 0.06, decay=0.2), t0)  # destello agudo
        for k in range(int(total / (e * 32)) + 1):    # cuerda grave de fondo
            add(_saw(NOTE(38), e * 32, 0.05, harmonics=3) * np.sin(np.linspace(0, np.pi, int(e * 32 * SR))), k * e * 32)
    elif style == "mystery":
        bpm = 70; b = 60 / bpm
        for k in range(int(total / (b * 8)) + 1):
            seg = int(b * 8 * SR)
            pad = (np.sin(2 * np.pi * NOTE(45) * np.arange(seg) / SR) + 0.6 * np.sin(2 * np.pi * NOTE(52) * np.arange(seg) / SR)
                   + 0.4 * np.sin(2 * np.pi * NOTE(48) * np.arange(seg) / SR)) * np.sin(np.linspace(0, np.pi, seg)) * 0.12
            add(pad, k * b * 8)
        box = [69, 72, 76, 75, 72, 69, 68, 71]
        for i in range(int(total / b) + 1):
            add(tone(800 if i % 2 else 1100, 0.04, vol=0.07, decay=0.01), i * b)           # tic-tac
            if i % 2 == 0: add(tone(NOTE(box[(i // 2) % 8] + 12), 0.9, "sine", 0.07, decay=0.35), i * b)
    elif style == "epic":
        bpm = 100; b = 60 / bpm
        prog = [45, 41, 48, 43]
        for i in range(int(total / b) + 1):
            add(_kick(0.7), i * b)
            if i % 2 == 1: add(_noise(0.25, 0.25, 0.08, smooth=6, seed=i), i * b)
            root = prog[(i // 4) % 4]
            for k in range(4): add(_saw(NOTE(root - 12), b / 4 * 0.9, 0.16, decay=0.08), i * b + k * b / 4)
            if i % 4 == 0:
                for n in (root, root + 3 + (1 if root in (41, 48) else 0), root + 7):
                    add(_saw(NOTE(n + 12), b * 4, 0.045, harmonics=4) * np.sin(np.linspace(0, np.pi, int(b * 4 * SR))) , i * b)
    elif style == "upbeat":
        bpm = 118; b = 60 / bpm
        prog = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [59, 62, 67])]
        for i in range(int(total / b) + 1):
            root, ch = prog[(i // 4) % 4]
            if i % 2 == 0: add(_kick(0.5), i * b)
            else: add(_noise(0.12, 0.25, 0.03, smooth=2, seed=i), i * b)     # palmada
            add(_saw(NOTE(root - 12), b * 0.45, 0.2, decay=0.15), i * b); add(_saw(NOTE(root), b * 0.3, 0.12, decay=0.1), i * b + b / 2)
            if i % 2 == 1:
                for n in ch: add(tone(NOTE(n), b * 0.4, "tri", 0.05, decay=0.12), i * b + b / 2)
    out = out[: int(total * SR)]
    if intensity is not None:      # curva de intensidad (0..1 por muestra)
        out = out * (0.55 + 0.45 * intensity[: len(out)])
    return out

def riser(dur=1.4):
    t = np.arange(int(dur * SR)) / SR
    f = 200 + 1400 * (t / dur) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 + _noise(dur, 0.5, decay=100, smooth=8, seed=7) * 0.35
    return s * (t / dur) ** 2

def impact():
    b = _kick(1.0); b = np.pad(b, (0, int(1.2 * SR) - len(b)))
    t = np.arange(len(b)) / SR
    tail = np.sin(2 * np.pi * 38 * t) * np.exp(-t / 0.7) * 0.6 + _noise(1.2, 0.35, 0.25, smooth=30, seed=3)
    return b + tail

def heartbeat():
    s = np.zeros(int(0.9 * SR)); k = _kick(0.6)[: int(0.2 * SR)]
    s[: len(k)] += k; s[int(0.22 * SR): int(0.22 * SR) + len(k)] += k * 0.7
    return s
