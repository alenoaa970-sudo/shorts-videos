"""Short 002: El lector de las fábricas de puros (Cuba, 1865). Uso: python3 ep002_lector.py salida.mp4"""
import sys, os, math, asyncio, subprocess, tempfile, random
import numpy as np
import certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts, skia
sys.path.insert(0, os.path.dirname(__file__))
from engine import *

VOICE = "es-MX-JorgeNeural"
SR = 44100
SEGS = [
    ("ext", "En Cuba existió un trabajo increíble: te pagaban por leer en voz alta."),
    ("bored", "En el siglo diecinueve, cientos de trabajadores pasaban el día enrollando puros, uno tras otro, en silencio. Un trabajo larguísimo… y muy aburrido."),
    ("idea", "Hasta que, en 1865, en la fábrica El Fígaro de La Habana, tuvieron una idea: ¿y si alguien nos lee mientras trabajamos?"),
    ("read", "Así nació el lector de tabaquería. Se subía a una tarima y leía en voz alta para toda la sala."),
    ("coins", "Y lo más curioso: no lo pagaba el dueño. Lo pagaban los propios trabajadores, juntando un poco de su sueldo cada semana."),
    ("news", "Leía las noticias del periódico… y, sobre todo, novelas."),
    ("book", "Una de sus favoritas era El conde de Montecristo. Y hoy, uno de los puros cubanos más famosos del mundo se llama justo así: Montecristo."),
    ("today", "Y lo más sorprendente: en algunas fábricas de Cuba, todavía hoy hay lectores."),
    ("end", "Sígueme para más oficios olvidados de la historia."),
]
GAP = 0.28

async def tts(text, out):
    c = edge_tts.Communicate(text, VOICE, rate="+12%", boundary="WordBoundary")
    words = []
    with open(out, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7; words.append((s, s + ch["duration"] / 1e7, ch["text"]))
    return words

def decode(path):
    raw = subprocess.check_output(["ffmpeg", "-v", "quiet", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

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

# ------------------------------------------------------------- escenas
def sc_ext(c, tl, d, m, T):
    exterior(c, T)
    arm = -0.15 - 2.2 * (0.5 + 0.5 * math.sin(tl * 7))   # saludando
    character(c, 540, 1760, 1.25, T, mood="happy" if m < 0.1 else "open", mouth=m, blink=(T % 3.1) < 0.12,
              arm_r=arm, arm_l=0.25, prop=None)
    chip(c, "CUBA · SIGLO XIX", W / 2, 190, tl / 0.4)

def sc_bored(c, tl, d, m, T):
    interior(c, T)
    shirts = ["#F6F2E6", "#CFE3F2", "#F2D9C9"]
    hats = [("cap", "#6B5B4B"), ("panama", None), ("cap", "#3F5A6B")]
    for i, x in enumerate((210, 540, 870)):
        roll = math.sin(T * 5 + i) * 0.25
        character(c, x, 1500, 0.9, T + i, shirt=shirts[i], hat=hats[i][0], hat_col=hats[i][1], mood="bored",
                  blink=((T + i) % 2.7) < 0.3, arm_l=1.2 + roll, arm_r=-1.2 - roll, prop="cigar", seated=True,
                  mustache=i != 1)
    table(c, 1520)
    # Zzz
    for k in range(3):
        ph = (tl * 0.6 + k / 3) % 1
        text_c(c, "Z", 650 + ph * 90 + k * 10, 1000 - ph * 260, 50 + 30 * ph, fill="#FFFFFF", stroke="#2A1B12", sw=10, a=int(255 * (1 - ph)))
    chip(c, "LA HABANA", W / 2, 190, tl / 0.4)

def sc_idea(c, tl, d, m, T):
    interior(c, T, dim=0.35 * (1 - ease_out((tl - 1.2) / 0.6)))
    on = (tl - 1.2) / 0.45
    character(c, 540, 2010, 1.75, T, shirt="#CFE3F2", hat="cap", hat_col="#3F5A6B",
              mood="surprised" if on > 0 else "bored", mouth=m * 0.6, blink=False,
              arm_r=-2.6 if on > 0 else -0.2, arm_l=0.3, look=(0, -8 if on > 0 else 0))
    bulb(c, 540, 470, 0.95, T, on)
    if on > 0:
        for k in range(6):
            a = (tl * 1.5 + k / 6) % 1
            sparkle(c, 540 + math.cos(k) * 260 * (0.6 + a), 470 + math.sin(k * 2) * 200 * (0.6 + a), 0.6 + a * 0.4, int(255 * (1 - a)))
    chip(c, "1865 · FÁBRICA EL FÍGARO", W / 2, 190, tl / 0.4)

def floating_letters(c, x, y, tl):
    chars = "ABCDEÑ¿?!"
    for k in range(10):
        ph = (tl * 0.45 + k / 10) % 1
        xx = x + math.sin(k * 3.1 + tl * 2) * 160 * ph + (k - 5) * 18
        yy = y - ph * 520
        text_c(c, chars[k % len(chars)], xx, yy, 46 + 20 * ph, fill="#FFF6D6", stroke="#5A3420", sw=8, a=int(255 * (1 - ph) ** 0.7))

def sc_read(c, tl, d, m, T):
    interior(c, T)
    # tarima
    fs(c, rrect(330, 1130, 750, 1230, 10), "#7A4426")
    fs(c, poly([(310, 1130), (770, 1130), (750, 1100), (330, 1100)]), "#A9673A")
    rise = ease_out(tl / 0.6)
    character(c, 540, 1110 + (1 - rise) * 60, 0.8, T, mood="open", mouth=m, blink=(T % 2.9) < 0.12,
              prop="book", arm_l=0.9, arm_r=-0.9, hat="panama")
    floating_letters(c, 540, 820, tl)
    shirts = ["#F2D9C9", "#CFE3F2", "#E7F2CF", "#F6F2E6"]
    for i, x in enumerate((150, 400, 680, 930)):
        character(c, x, 1610, 0.82, T + i * 0.7, shirt=shirts[i], hat="cap" if i % 2 else "panama",
                  hat_col=["#6B5B4B", "#3F5A6B", None, "#5B3F6B"][i], mood="happy", seated=True,
                  arm_l=1.1, arm_r=-1.1, prop="cigar", look=(0, -10), mustache=i % 2 == 0, bob=False)
    table(c, 1640)

def sc_coins(c, tl, d, m, T):
    interior(c, T, beams=False)
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(540, 1200, 700, [C("#FFE9A0", 120), C("#FFE9A0", 0)]))
    fill = clamp(tl / d)
    jar(c, 540, 1380, 0.1 + fill * 0.85, T)
    for side, x in ((-1, 210), (1, 870)):
        character(c, x, 1780, 1.0, T + side, shirt="#CFE3F2" if side < 0 else "#F2D9C9",
                  hat="cap" if side < 0 else "panama", hat_col="#3F5A6B" if side < 0 else None,
                  mood="happy", arm_l=(2.1 if side > 0 else 0.3), arm_r=(-2.1 if side < 0 else -0.3), mustache=side > 0)
    rnd = random.Random(2)
    for k in range(14):
        st = k * 0.33 + rnd.uniform(0, 0.15)
        ph = (tl - st) / 0.75
        if 0 <= ph <= 1:
            side = -1 if k % 2 else 1
            sx = 540 + side * 290; sy = 1120
            x = sx + (540 + rnd.uniform(-60, 60) - sx) * ph
            y = sy - 260 * math.sin(math.pi * ph) + (1150 - sy) * ph
            coin(c, x, y, 34, tl * 12 + k)
    chip(c, "CADA SEMANA", W / 2, 190, tl / 0.4)
    fs(c, rrect(375, 1440, 705, 1500, 14), "#FFF6D6", ow=6)
    text_c(c, "SUELDO DEL LECTOR", 540, 1482, 32, fill="#2A1B12")

def sc_news(c, tl, d, m, T):
    interior(c, T)
    swap = d * 0.48
    prop = "newspaper" if tl < swap else "book"
    k = abs(tl - swap) / 0.18
    spin = 0.0 if k > 1 else (1 - k) * 25
    character(c, 540, 1880, 1.45, T, mood="open" if tl < swap else "happy", mouth=m, blink=(T % 3.3) < 0.12,
              prop=prop, arm_l=0.9, arm_r=-0.9, rot=spin * (1 if tl < swap else -1))
    chip(c, "MAÑANA: NOTICIAS" if tl < swap else "TARDE: NOVELAS", W / 2, 190,
         tl / 0.4 if tl < swap else (tl - swap) / 0.4, bg="#FFD23F" if tl < swap else "#7FD4C1")
    if tl >= swap: floating_letters(c, 540, 860, tl)

def sc_book(c, tl, d, m, T):
    interior(c, T, dim=0.55, beams=False)
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(540, 1050, 650, [C("#FFE9A0", 150), C("#FFE9A0", 0)]))
    swap = d * 0.47
    if tl < swap:
        a = back(tl / 0.5)
        c.save(); c.translate(540, 1150 + math.sin(T * 2) * 14); c.rotate(-5 + math.sin(T * 1.5) * 3); c.scale(a, a)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-230, -310, 250, 330), 18, 18), P("#000000", a=100, blur=10))
        fs(c, rrect(-240, -320, 240, 320, 18), lin_grad(0, -320, 0, 320, ["#A7322B", "#6E1B17"]), ow=8)
        c.drawRect(skia.Rect.MakeLTRB(-240, -320, -200, 320), P("#5A1410"))
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-165, -250, 205, 250), 10, 10), P("#E8C25A", stroke=6))
        text_c(c, "EL CONDE", 20, -120, 58, fill="#F5D774", path=FONT_SERIF)
        text_c(c, "DE", 20, -50, 46, fill="#F5D774", path=FONT_SERIF)
        text_c(c, "MONTECRISTO", 20, 20, 50, fill="#F5D774", path=FONT_SERIF)
        c.drawLine(-90, 70, 130, 70, P("#E8C25A", stroke=4))
        text_c(c, "A. DUMAS", 20, 150, 40, fill="#F5D774", path=FONT_SERIF)
        c.restore()
    else:
        ph = (tl - swap)
        a = back(ph / 0.55)
        c.save(); c.translate(540, 1180 + math.sin(T * 2) * 10); c.rotate(math.sin(T * 1.4) * 2); c.scale(a, a)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-300, -170, 320, 210), 16, 16), P("#000000", a=100, blur=10))
        fs(c, rrect(-310, -180, 310, 190, 14), lin_grad(0, -180, 0, 190, ["#9C6534", "#6A3E1C"]), ow=8)
        fs(c, rrect(-310, -180, 310, -110, 14), "#B07A44", ow=6)
        fs(c, rrect(-230, -80, 230, 110, 12), "#F3E3BC", ow=6)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-215, -66, 215, 96), 8, 8), P("#B3262A", stroke=6))
        text_c(c, "MONTECRISTO", 0, 30, 50, fill="#B3262A", path=FONT_SERIF)
        for k in range(4):
            fs(c, rrect(-250 + k * 130, -175, -150 + k * 130, -140, 14), "#7B4A26", ow=4)
        c.restore()
        for k in range(10):
            q = (ph * 0.9 + k / 10) % 1
            ang = k * 0.63
            sparkle(c, 540 + math.cos(ang) * (300 + 250 * q), 1180 + math.sin(ang) * (260 + 250 * q), 0.5 + 0.6 * (1 - q), int(255 * (1 - q)))
    character(c, 170, 1880, 0.75, T, mood="happy" if tl > swap else "open", mouth=m, arm_r=-2.4, arm_l=0.2, bob=True)
    chip(c, "SU NOVELA FAVORITA" if tl < swap else "¡EL PURO MÁS FAMOSO!", W / 2, 190,
         tl / 0.4 if tl < swap else (tl - swap) / 0.4, bg="#FFD23F" if tl < swap else "#FF8A65")

def sc_today(c, tl, d, m, T):
    interior(c, T)
    character(c, 540, 1440, 1.0, T, mood="open", mouth=m, blink=(T % 2.6) < 0.12, prop=None, arm_l=0.25, arm_r=-1.5,
              shirt="#FFFFFF", hat="panama", hat_col="#F1F1F1")
    c.save(); c.translate(540, 1460); c.scale(1.0, 1.0)
    prop_draw(c, "mic", T); c.restore()
    for i, x in enumerate((170, 910)):
        character(c, x, 1660, 0.85, T + i, shirt=["#F2D9C9", "#E7F2CF"][i], hat="cap", hat_col=["#6B5B4B", "#3F5A6B"][i],
                  mood="happy", seated=True, arm_l=1.1, arm_r=-1.1, prop="cigar", bob=False, mustache=i == 0)
    table(c, 1690)
    floating_letters(c, 540, 900, tl)
    chip(c, "HOY", W / 2, 190, tl / 0.4, bg="#7FD4C1")

def sc_end(c, tl, d, m, T):
    burst(c, T)
    arm = -0.2 - 2.2 * (0.5 + 0.5 * math.sin(tl * 8))
    character(c, 540, 1700, 1.3, T, mood="happy", mouth=m, arm_r=arm, arm_l=0.25)
    a = back(tl / 0.45)
    c.save(); c.translate(540, 470 + math.sin(T * 4) * 10); c.scale(a, a); c.rotate(-4)
    fs(c, rrect(-330, -110, 330, 110, 55), "#E53935", ow=10)
    text_c(c, "¡SÍGUEME!", 0, 42, 118, fill="#FFFFFF", stroke="#7A1010", sw=10)
    c.restore()
    chip(c, "+ OFICIOS OLVIDADOS", W / 2, 640, (tl - 0.3) / 0.4, bg="#FFFFFF")

SCENES = {"ext": sc_ext, "bored": sc_bored, "idea": sc_idea, "read": sc_read, "coins": sc_coins,
          "news": sc_news, "book": sc_book, "today": sc_today, "end": sc_end}
FOCUS = {"ext": (540, 1150), "bored": (540, 1150), "idea": (540, 900), "read": (540, 1000), "coins": (540, 1200),
         "news": (540, 1250), "book": (540, 1150), "today": (540, 1100), "end": (540, 1000)}

def main(out):
    tmp = tempfile.mkdtemp()
    voice_parts, words, scenes, t0 = [], [], [], 0.35
    for i, (key, text) in enumerate(SEGS):
        mp3 = os.path.join(tmp, f"s{i}.mp3")
        w = asyncio.run(tts(text, mp3))
        a = decode(mp3)
        dur = len(a) / SR
        voice_parts.append((t0, a))
        w = [list(q) for q in w]
        if w and w[-1][2][-1:] not in ".,:?!;": w[-1][2] += "."
        words += [(s + t0, e + t0, x) for (s, e, x) in w]
        scenes.append((key, t0 - (0.35 if i == 0 else GAP / 2), dur + GAP))
        t0 += dur + GAP
    total = t0 + 1.0
    scenes[-1] = (scenes[-1][0], scenes[-1][1], total - scenes[-1][1])
    n = int(total * SR)
    voice = np.zeros(n)
    for st, a in voice_parts:
        i = int(st * SR); voice[i:i + len(a)] += a
    sfx = np.zeros(n)
    def add(sig, at, vol=1.0):
        i = int(at * SR); j = min(n, i + len(sig)); sfx[i:j] += sig[: j - i] * vol
    for k, (key, st, d) in enumerate(scenes):
        if k: add(whoosh(), st - 0.12, 0.35)
        if key == "idea": add(pop(), st + 1.2, 0.7); add(shimmer(), st + 1.25, 0.8)
        if key == "coins":
            rnd = random.Random(2)
            for q in range(14):
                tt = q * 0.33 + rnd.uniform(0, 0.15) + 0.75
                if tt < d: add(clink(), st + tt, 0.6)
        if key == "book": add(shimmer(), st + d * 0.47, 1.0); add(pop(), st + d * 0.47, 0.5)
        if key == "end": add(pop(), st + 0.05, 0.6)
    mus = music(total)
    # bajar música cuando hay voz
    fr = int(SR / FPS)
    venv = np.array([np.sqrt(np.mean(voice[i * fr:(i + 1) * fr] ** 2) + 1e-9) for i in range(int(total * FPS))])
    duck = np.repeat(np.where(venv > 0.01, 0.55, 1.0), fr)[:n]
    duck = np.convolve(np.pad(duck, (0, max(0, n - len(duck))), constant_values=1.0), np.ones(4000) / 4000, mode="same")
    mix = voice * 1.0 + mus * 0.32 * duck + sfx * 0.6
    mix = mix / max(1e-6, np.max(np.abs(mix))) * 0.93
    wav = os.path.join(tmp, "mix.wav")
    import wave
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((mix * 32767).astype(np.int16).tobytes())
    # boca: envolvente de la voz suavizada
    vm = venv / (np.percentile(venv, 95) + 1e-9)
    mouth = np.clip((vm - 0.15) * 1.3, 0, 1)
    mouth = np.convolve(mouth, [0.25, 0.5, 0.25], mode="same")

    nf = int(total * FPS)
    info = skia.ImageInfo.Make(W, H, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType)
    surf = skia.Surface.MakeRaster(info)
    enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}",
                            "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out],
                           stdin=subprocess.PIPE)
    frames = range(nf)
    prev = os.environ.get("PREVIEW")
    if prev:
        frames = [int(float(x) * FPS) for x in prev.split(",")]
    for f in frames:
        T = f / FPS
        idx = max(i for i, s in enumerate(scenes) if s[1] <= T or i == 0)
        key, st, d = scenes[idx]
        tl = T - st
        c = surf.getCanvas(); c.clear(C("#000000"))
        # cámara: empuje lento + golpe de zoom al empezar la escena
        fx, fy = FOCUS[key]
        z = 1.0 + 0.05 * ease_io(tl / max(d, 0.1)) + 0.14 * (1 - ease_out(tl / 0.35))
        c.save(); c.translate(fx, fy); c.scale(z, z); c.translate(-fx, -fy)
        SCENES[key](c, tl, d, float(mouth[min(f, len(mouth) - 1)]), T)
        c.restore()
        vignette(c)
        if tl < 0.12:
            c.drawRect(skia.Rect.MakeWH(W, H), P("#FFFFFF", a=int(160 * (1 - tl / 0.12))))
        captions(c, words, T, y=760)
        if prev:
            surf.makeImageSnapshot().save(f"/tmp/prev_{T:05.1f}.png"); continue
        enc.stdin.write(surf.makeImageSnapshot().tobytes())
    enc.stdin.close(); enc.wait()
    print("scenes", [(k, round(s, 1), round(d, 1)) for k, s, d in scenes])
    print(f"OK {out} {total:.1f}s {nf} frames")

if __name__ == "__main__":
    main(sys.argv[1])
