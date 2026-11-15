"""Genera un Short animado a partir de un guion en JSON.

Uso:  python3 make_episode.py episodios/003-xxx.json salida.mp4 [--preview 2,10,20]

Formato del JSON (ver episodios/EJEMPLO.json):
{
  "slug": "003-hielo-india",
  "voice": "es-MX-JorgeNeural",
  "main": {"shirt": "#F6F2E6", "hat": "panama", "hat_col": null},   # protagonista (opcional)
  "segments": [
     {"scene": "<tipo>", "text": "frase narrada", "chip": "ETIQUETA ARRIBA", ...parámetros de la escena}
  ]
}
Tipos de escena y parámetros:
  town      calle colonial. sign="TEXTO DEL CARTEL", sky=day|sunset|night, action=wave|talk
  port      puerto con barco. sky=day|sunset|night, sign="NOMBRE DEL BARCO", crates=["HIELO",...]
  interior  sala/taller con trabajadores en una mesa. workers=1-4, mood=bored|happy|surprised, prop=cigar|book|newspaper|none, zzz=true
  idea      primer plano + bombilla que se enciende.
  speaker   personaje en una tarima hablando a un público. prop=book|newspaper|none|mic, crowd=2-4
  coins     bote que se llena de monedas. label="TEXTO DEBAJO"
  reveal    objeto grande que aparece. obj=book|box|sign|poster, lines=["LÍNEA 1","LÍNEA 2"], color="#A7322B", obj2 + lines2 (opcional, cambia a mitad)
  closeup   protagonista grande. prop=book|newspaper|cigar|none, mood=open|happy|surprised|worried|bored, symbols=letters|question|exclaim|hearts|notes|clock|none
  end       cierre "¡SÍGUEME!". chip="+ OFICIOS OLVIDADOS"
"""
import sys, os, math, asyncio, subprocess, tempfile, random, json, wave
import numpy as np
import certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts, skia
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import *
from sound import music, whoosh, pop, clink, shimmer, SR

GAP = 0.28
SHIRTS = ["#F2D9C9", "#CFE3F2", "#E7F2CF", "#F6F2E6", "#EFD9F2"]
HATS = [("cap", "#6B5B4B"), ("panama", None), ("cap", "#3F5A6B"), ("bowler", None), ("cap", "#5B3F6B")]

async def tts(text, voice, out):
    c = edge_tts.Communicate(text, voice, rate="+12%", boundary="WordBoundary")
    words = []
    with open(out, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7; words.append([s, s + ch["duration"] / 1e7, ch["text"]])
    return words

def decode(path):
    raw = subprocess.check_output(["ffmpeg", "-v", "quiet", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

# ------------------------------------------------------------------ fondos extra
def night_sky(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, ["#0E1638", "#3B2C5E"]))
    rnd = random.Random(4)
    for i in range(90):
        x, y = rnd.uniform(0, W), rnd.uniform(0, 900)
        a = int(140 + 110 * math.sin(t * 2 + i))
        c.drawCircle(x, y, rnd.uniform(1.5, 3.5), P("#FFFFFF", a=max(0, a)))
    c.drawCircle(830, 300, 200, rad_grad(830, 300, 220, [C("#FFF6D0", 120), C("#FFF6D0", 0)]))
    fs(c, oval(830, 300, 75, 75), "#FFF3C4", ow=0)
    c.drawCircle(800, 285, 14, P("#E6D9A8")); c.drawCircle(855, 325, 10, P("#E6D9A8"))

def sky_by(c, t, sky):
    if sky == "night": night_sky(c, t)
    elif sky == "sunset": sky_c(c, "#F08A5D", "#FFD9A0")
    else: sky_c(c, "#6EC1F0", "#FFE6B8")
    if sky != "night":
        c.drawCircle(860, 330, 110, rad_grad(860, 330, 260, [C("#FFF4C2", 255), C("#FFF4C2", 0)]))
        fs(c, oval(860, 330, 70, 70), "#FFE27A" if sky == "day" else "#FFB347", ow=0)
        for (cx, cy, sc, sp) in [(200, 260, 1.0, 14), (620, 180, 0.8, 9), (980, 470, 0.7, 11)]:
            cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc, a=235 if sky == "day" else 170)

def sky_c(c, top, bottom):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, [top, bottom]))

def town(c, t, sign, sky):
    exterior(c, t, sign=sign)
    if sky != "day":
        c.save(); c.clipRect(skia.Rect.MakeLTRB(0, 0, W, 690)); sky_by(c, t, sky); c.restore()
    if sky == "night":
        c.drawRect(skia.Rect.MakeWH(W, H), P("#0B0F2A", a=110))
        for lx in (150, 930):   # farolas
            c.drawLine(lx, 1700, lx, 1150, P("#1E1E1E", stroke=16))
            c.drawCircle(lx, 1130, 160, rad_grad(lx, 1130, 170, [C("#FFD98A", 170), C("#FFD98A", 0)]))
            fs(c, poly([(lx - 40, 1150), (lx - 28, 1090), (lx + 28, 1090), (lx + 40, 1150)]), "#FFE7A6", ow=6)

def ship(c, x, y, s, t, name):
    c.save(); c.translate(x, y + math.sin(t * 1.6) * 8); c.rotate(math.sin(t * 1.3) * 1.5); c.scale(s, s)
    for mx, mh in ((-120, 520), (60, 600), (220, 430)):
        c.drawLine(mx, 0, mx, -mh, P("#4A2E1A", stroke=14))
        for k, (w, hh) in enumerate([(150, 120), (120, 110), (90, 90)]):
            top = -mh + 40 + k * 135
            sail = skia.Path(); sail.moveTo(mx - w / 2, top); sail.quadTo(mx, top - 18, mx + w / 2, top)
            sail.quadTo(mx + w / 2 + 14, top + hh / 2, mx + w / 2, top + hh); sail.lineTo(mx - w / 2, top + hh)
            sail.quadTo(mx - w / 2 + 14, top + hh / 2, mx - w / 2, top); sail.close()
            fs(c, sail, "#FBF4E2", ow=5)
    c.drawPath(poly([(-120, -520), (-120, -620), (-60, -600), (-120, -580)]), P("#C8372D"))
    hull = skia.Path(); hull.moveTo(-330, -40); hull.lineTo(360, -40); hull.lineTo(300, 90); hull.quadTo(0, 120, -280, 90); hull.close()
    fs(c, hull, lin_grad(0, -40, 0, 110, ["#7A4426", "#4E2812"]), ow=7)
    c.drawLine(-320, -10, 345, -10, P("#E3B04B", stroke=8))
    for k in range(6): fs(c, oval(-220 + k * 90, 30, 13, 13), "#2A1B12", ow=0)
    if name: text_c(c, name, 0, 75, 34, fill="#F5D774", path=FONT_SERIF)
    c.restore()

def port(c, t, sky, name, crates):
    sky_by(c, t, sky)
    c.drawRect(skia.Rect.MakeLTRB(0, 1020, W, 1500), lin_grad(0, 1020, 0, 1500, ["#2F8FC2", "#1D5F8A"]))
    for k in range(9):
        yy = 1060 + k * 45
        p = skia.Path(); p.moveTo(0, yy)
        for x in range(0, W + 60, 60):
            p.quadTo(x + 30, yy - 10 + 6 * math.sin(t * 2 + k + x * 0.02), x + 60, yy)
        c.drawPath(p, P("#FFFFFF", stroke=3, a=70))
    ship(c, 600, 1180, 0.95, t, name)
    c.drawRect(skia.Rect.MakeLTRB(0, 1400, W, H), lin_grad(0, 1400, 0, H, ["#A9763F", "#6E4520"]))
    for k in range(10):
        c.drawLine(0, 1430 + k * 52, W, 1430 + k * 52, P("#4A2C12", stroke=4, a=120))
    for k, lab in enumerate((crates or [])[:3]):
        cx = 80 + k * 150; cy = 1560 - (k % 2) * 120
        fs(c, rrect(cx, cy - 120, cx + 140, cy, 6), "#C9935A", ow=6)
        c.drawLine(cx, cy - 120, cx + 140, cy, P(OUT, stroke=4, a=110)); c.drawLine(cx + 140, cy - 120, cx, cy, P(OUT, stroke=4, a=110))
        fs(c, rrect(cx + 10, cy - 78, cx + 130, cy - 42, 6), "#FFF6D6", ow=4)
        text_c(c, lab[:8], cx + 70, cy - 49, 26, fill="#2A1B12")

def floaters(c, kind, x, y, tl):
    if kind in (None, "none"): return
    sets = {"letters": "ABCDEÑ¿?!", "question": "???¿?", "exclaim": "!!!¡!", "hearts": "♥♥♥♥", "notes": "♪♫♪♫", "clock": "⏰"}
    chars = sets.get(kind, "ABC")
    for k in range(10):
        ph = (tl * 0.45 + k / 10) % 1
        xx = x + math.sin(k * 3.1 + tl * 2) * 160 * ph + (k - 5) * 18
        yy = y - ph * 520
        col = {"hearts": "#FF5A6E", "exclaim": "#FFD23F", "question": "#FFFFFF"}.get(kind, "#FFF6D6")
        fnt = FONT_BLACK if kind not in ("hearts", "notes") else "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        text_c(c, chars[k % len(chars)], xx, yy, 50 + 22 * ph, fill=col, stroke="#3A2416", sw=8, a=int(255 * (1 - ph) ** 0.7), path=fnt)

def big_object(c, obj, lines, color, T, a):
    c.save(); c.translate(540, 1150 + math.sin(T * 2) * 12); c.rotate(-4 + math.sin(T * 1.5) * 3); c.scale(a, a)
    lines = lines or []
    if obj == "book":
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-230, -310, 250, 330), 18, 18), P("#000000", a=100, blur=10))
        fs(c, rrect(-240, -320, 240, 320, 18), color or "#A7322B", ow=8)
        c.drawRect(skia.Rect.MakeLTRB(-240, -320, -200, 320), P("#000000", a=60))
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-165, -250, 205, 250), 10, 10), P("#E8C25A", stroke=6))
        y0 = -120
        for ln in lines[:5]:
            size = 58 if len(ln) <= 9 else (48 if len(ln) <= 12 else 38)
            text_c(c, ln, 20, y0, size, fill="#F5D774", path=FONT_SERIF); y0 += 75
    elif obj == "box":
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-300, -170, 320, 210), 16, 16), P("#000000", a=100, blur=10))
        fs(c, rrect(-310, -180, 310, 190, 14), lin_grad(0, -180, 0, 190, ["#9C6534", "#6A3E1C"]), ow=8)
        fs(c, rrect(-310, -180, 310, -110, 14), "#B07A44", ow=6)
        fs(c, rrect(-230, -80, 230, 110, 12), "#F3E3BC", ow=6)
        y0 = 20 if len(lines) <= 1 else -5
        for ln in lines[:2]:
            text_c(c, ln, 0, y0, 50 if len(ln) <= 12 else 38, fill=color or "#B3262A", path=FONT_SERIF); y0 += 62
    else:   # sign / poster
        tall = obj == "poster"
        hw, hh = (230, 320) if tall else (340, 200)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-hw + 12, -hh + 14, hw + 12, hh + 14), 14, 14), P("#000000", a=100, blur=10))
        fs(c, rrect(-hw, -hh, hw, hh, 14), "#F6ECD2", ow=8)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-hw + 22, -hh + 22, hw - 22, hh - 22), 8, 8), P(color or "#2F5D50", stroke=6))
        n = len(lines[:5]); y0 = -((n - 1) * 80) / 2 + 22
        for ln in lines[:5]:
            size = 70 if len(ln) <= 10 else (54 if len(ln) <= 14 else 42)
            text_c(c, ln, 0, y0, size, fill=color or "#2F5D50", path=FONT_SERIF); y0 += 80
    c.restore()

# ------------------------------------------------------------------ escenas
def M(ep):
    m = ep.get("main", {})
    return dict(shirt=m.get("shirt", "#F6F2E6"), hat=m.get("hat", "panama"), hat_col=m.get("hat_col"))

def sc_town(c, s, tl, d, m, T, ep):
    town(c, T, s.get("sign", ""), s.get("sky", "day"))
    act = s.get("action", "wave")
    arm = -0.15 - 2.2 * (0.5 + 0.5 * math.sin(tl * 7)) if act == "wave" else -0.4
    character(c, 540, 1760, 1.25, T, mood="happy" if m < 0.1 else "open", mouth=m, blink=(T % 3.1) < 0.12,
              arm_r=arm, arm_l=0.25, **M(ep))

def sc_port(c, s, tl, d, m, T, ep):
    port(c, T, s.get("sky", "day"), s.get("sign", ""), s.get("crates", []))
    character(c, 760, 1800, 1.1, T, mood="open", mouth=m, blink=(T % 3.1) < 0.12, arm_r=-2.0, arm_l=0.2, **M(ep))

def sc_interior(c, s, tl, d, m, T, ep):
    interior(c, T)
    n = int(s.get("workers", 3)); mood = s.get("mood", "bored"); prop = s.get("prop", "cigar")
    prop = None if prop == "none" else prop
    xs = {1: [540], 2: [300, 780], 3: [210, 540, 870], 4: [150, 400, 680, 930]}[max(1, min(4, n))]
    for i, x in enumerate(xs):
        roll = math.sin(T * 5 + i) * 0.25
        h = HATS[i % len(HATS)]
        character(c, x, 1500, 0.9 if n < 4 else 0.82, T + i, shirt=SHIRTS[i % 5], hat=h[0], hat_col=h[1], mood=mood,
                  blink=((T + i) % 2.7) < 0.3, arm_l=1.2 + roll, arm_r=-1.2 - roll, prop=prop, seated=True, mustache=i % 2 == 0)
    table(c, 1520, leaves=prop == "cigar")
    if s.get("zzz", mood == "bored"):
        for k in range(3):
            ph = (tl * 0.6 + k / 3) % 1
            text_c(c, "Z", 650 + ph * 90 + k * 10, 1000 - ph * 260, 50 + 30 * ph, fill="#FFFFFF", stroke="#2A1B12", sw=10, a=int(255 * (1 - ph)))

def sc_idea(c, s, tl, d, m, T, ep):
    interior(c, T, dim=0.35 * (1 - ease_out((tl - 1.0) / 0.6)))
    on = (tl - 1.0) / 0.45
    mm = M(ep)
    character(c, 540, 2010, 1.75, T, mood="surprised" if on > 0 else "worried", mouth=m * 0.6,
              arm_r=-2.6 if on > 0 else -0.2, arm_l=0.3, look=(0, -8 if on > 0 else 0), **mm)
    bulb(c, 540, 470, 0.95, T, on)
    if on > 0:
        for k in range(6):
            a = (tl * 1.5 + k / 6) % 1
            sparkle(c, 540 + math.cos(k) * 260 * (0.6 + a), 470 + math.sin(k * 2) * 200 * (0.6 + a), 0.6 + a * 0.4, int(255 * (1 - a)))

def sc_speaker(c, s, tl, d, m, T, ep):
    interior(c, T)
    fs(c, rrect(330, 1130, 750, 1230, 10), "#7A4426")
    fs(c, poly([(310, 1130), (770, 1130), (750, 1100), (330, 1100)]), "#A9673A")
    rise = ease_out(tl / 0.6)
    prop = s.get("prop", "book")
    character(c, 540, 1110 + (1 - rise) * 60, 0.8, T, mood="open", mouth=m, blink=(T % 2.9) < 0.12,
              prop=None if prop in ("none", "mic") else prop, arm_l=0.9 if prop not in ("none", "mic") else 0.2,
              arm_r=-0.9 if prop not in ("none", "mic") else -1.8, **M(ep))
    if prop == "mic":
        c.save(); c.translate(540, 1110); c.scale(0.8, 0.8); prop_draw(c, "mic", T); c.restore()
    floaters(c, s.get("symbols", "letters"), 540, 820, tl)
    n = int(s.get("crowd", 4))
    xs = {2: [200, 880], 3: [170, 540, 910], 4: [150, 400, 680, 930]}[max(2, min(4, n))]
    for i, x in enumerate(xs):
        h = HATS[(i + 1) % len(HATS)]
        character(c, x, 1610, 0.82, T + i * 0.7, shirt=SHIRTS[i % 5], hat=h[0], hat_col=h[1], mood="happy", seated=True,
                  arm_l=1.1, arm_r=-1.1, look=(0, -10), mustache=i % 2 == 0, bob=False)
    table(c, 1640, leaves=False)

def sc_coins(c, s, tl, d, m, T, ep):
    interior(c, T, beams=False)
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(540, 1200, 700, [C("#FFE9A0", 120), C("#FFE9A0", 0)]))
    jar(c, 540, 1380, 0.1 + clamp(tl / d) * 0.85, T)
    for side, x in ((-1, 210), (1, 870)):
        h = HATS[0 if side < 0 else 1]
        character(c, x, 1780, 1.0, T + side, shirt=SHIRTS[1 if side < 0 else 0], hat=h[0], hat_col=h[1], mood="happy",
                  arm_l=(2.1 if side > 0 else 0.3), arm_r=(-2.1 if side < 0 else -0.3), mustache=side > 0)
    rnd = random.Random(2)
    for k in range(int(d / 0.33) + 1):
        st = k * 0.33 + rnd.uniform(0, 0.15); ph = (tl - st) / 0.75
        if 0 <= ph <= 1:
            side = -1 if k % 2 else 1
            sx, sy = 540 + side * 290, 1120
            coin(c, sx + (540 + rnd.uniform(-60, 60) - sx) * ph, sy - 260 * math.sin(math.pi * ph) + (1150 - sy) * ph, 34, tl * 12 + k)
    if s.get("label"):
        f = font(32); w = f.measureText(s["label"]) / 2 + 30
        fs(c, rrect(540 - w, 1440, 540 + w, 1500, 14), "#FFF6D6", ow=6)
        text_c(c, s["label"], 540, 1482, 32, fill="#2A1B12")

def sc_reveal(c, s, tl, d, m, T, ep):
    interior(c, T, dim=0.55, beams=False)
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(540, 1050, 650, [C("#FFE9A0", 150), C("#FFE9A0", 0)]))
    two = "obj2" in s
    swap = d * 0.47 if two else d + 1
    if tl < swap:
        big_object(c, s.get("obj", "sign"), s.get("lines", []), s.get("color"), T, back(tl / 0.5))
    else:
        ph = tl - swap
        big_object(c, s["obj2"], s.get("lines2", []), s.get("color2"), T, back(ph / 0.55))
    ph = tl if not two else max(0, tl - swap)
    for k in range(10):
        q = (ph * 0.9 + k / 10) % 1; ang = k * 0.63
        sparkle(c, 540 + math.cos(ang) * (300 + 250 * q), 1180 + math.sin(ang) * (260 + 250 * q), 0.5 + 0.6 * (1 - q), int(255 * (1 - q)))
    character(c, 170, 1880, 0.75, T, mood="happy" if tl > swap else "open", mouth=m, arm_r=-2.4, arm_l=0.2, **M(ep))

def sc_closeup(c, s, tl, d, m, T, ep):
    bg = s.get("bg", "interior")
    if bg == "town": town(c, T, s.get("sign", ""), s.get("sky", "day"))
    elif bg == "port": port(c, T, s.get("sky", "day"), s.get("sign", ""), [])
    else: interior(c, T)
    prop = s.get("prop", "none"); prop = None if prop == "none" else prop
    held = prop in ("book", "newspaper")
    character(c, 540, 1880, 1.45, T, mood=s.get("mood", "open"), mouth=m, blink=(T % 3.3) < 0.12, prop=prop,
              arm_l=0.9 if held else 0.25, arm_r=-0.9 if held else -0.4, **M(ep))
    floaters(c, s.get("symbols", "none"), 540, 860, tl)

def sc_end(c, s, tl, d, m, T, ep):
    burst(c, T)
    arm = -0.2 - 2.2 * (0.5 + 0.5 * math.sin(tl * 8))
    character(c, 540, 1700, 1.3, T, mood="happy", mouth=m, arm_r=arm, arm_l=0.25, **M(ep))
    a = back(tl / 0.45)
    c.save(); c.translate(540, 470 + math.sin(T * 4) * 10); c.scale(a, a); c.rotate(-4)
    fs(c, rrect(-330, -110, 330, 110, 55), "#E53935", ow=10)
    text_c(c, "¡SÍGUEME!", 0, 42, 118, fill="#FFFFFF", stroke="#7A1010", sw=10)
    c.restore()

SCENES = {"town": sc_town, "port": sc_port, "interior": sc_interior, "idea": sc_idea, "speaker": sc_speaker,
          "coins": sc_coins, "reveal": sc_reveal, "closeup": sc_closeup, "end": sc_end}
FOCUS = {"town": (540, 1150), "port": (540, 1150), "interior": (540, 1150), "idea": (540, 900), "speaker": (540, 1000),
         "coins": (540, 1200), "reveal": (540, 1150), "closeup": (540, 1250), "end": (540, 1000)}
CHIP_Y = {"end": 235}

def main(ep_path, out, preview=None):
    ep = json.load(open(ep_path))
    voice = ep.get("voice", "es-MX-JorgeNeural")
    segs = ep["segments"]
    for s in segs:
        if s["scene"] not in SCENES: raise SystemExit(f"Escena desconocida: {s['scene']}")
    tmp = tempfile.mkdtemp()
    parts, words, scenes, t0 = [], [], [], 0.35
    for i, s in enumerate(segs):
        mp3 = os.path.join(tmp, f"s{i}.mp3")
        w = asyncio.run(tts(s["text"], voice, mp3))
        if w and w[-1][2][-1:] not in ".,:?!;": w[-1][2] += "."
        a = decode(mp3); dur = len(a) / SR
        parts.append((t0, a)); words += [(x[0] + t0, x[1] + t0, x[2]) for x in w]
        scenes.append([s, t0 - (0.35 if i == 0 else GAP / 2), dur + GAP])
        t0 += dur + GAP
    total = t0 + 1.0
    scenes[-1][2] = total - scenes[-1][1]
    n = int(total * SR)
    voice_a = np.zeros(n)
    for st, a in parts:
        i = int(st * SR); voice_a[i:i + len(a)] += a[: n - i]
    sfx = np.zeros(n)
    def add(sig, at, vol=1.0):
        i = int(max(0, at) * SR); j = min(n, i + len(sig)); sfx[i:j] += sig[: j - i] * vol
    for k, (s, st, d) in enumerate(scenes):
        if k: add(whoosh(), st - 0.12, 0.35)
        if s["scene"] == "idea": add(pop(), st + 1.0, 0.7); add(shimmer(), st + 1.05, 0.8)
        if s["scene"] == "coins":
            rnd = random.Random(2)
            for q in range(int(d / 0.33) + 1):
                tt = q * 0.33 + rnd.uniform(0, 0.15) + 0.75
                if tt < d: add(clink(), st + tt, 0.6)
        if s["scene"] == "reveal":
            add(shimmer(), st + 0.1, 0.8)
            if "obj2" in s: add(shimmer(), st + d * 0.47, 1.0); add(pop(), st + d * 0.47, 0.5)
        if s["scene"] == "end": add(pop(), st + 0.05, 0.6)
    mus = music(total)
    fr = int(SR / FPS)
    venv = np.array([np.sqrt(np.mean(voice_a[i * fr:(i + 1) * fr] ** 2) + 1e-9) for i in range(int(total * FPS))])
    duck = np.repeat(np.where(venv > 0.01, 0.55, 1.0), fr)
    duck = np.pad(duck, (0, max(0, n - len(duck))), constant_values=1.0)[:n]
    duck = np.convolve(duck, np.ones(4000) / 4000, mode="same")
    mix = voice_a + mus[:n] * 0.32 * duck + sfx * 0.6
    mix = mix / max(1e-6, np.max(np.abs(mix))) * 0.93
    wav = os.path.join(tmp, "mix.wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((mix * 32767).astype(np.int16).tobytes())
    vm = venv / (np.percentile(venv, 95) + 1e-9)
    mouth = np.convolve(np.clip((vm - 0.15) * 1.3, 0, 1), [0.25, 0.5, 0.25], mode="same")

    nf = int(total * FPS)
    surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(W, H, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
    enc = None
    if not preview:
        enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}",
                                "-r", str(FPS), "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
                                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out],
                               stdin=subprocess.PIPE)
    frames = [int(x * FPS) for x in preview] if preview else range(nf)
    for f in frames:
        T = f / FPS
        idx = max([i for i, sc in enumerate(scenes) if sc[1] <= T] or [0])
        s, st, d = scenes[idx]; tl = T - st
        c = surf.getCanvas(); c.clear(C("#000000"))
        fx, fy = FOCUS[s["scene"]]
        z = 1.0 + 0.05 * ease_io(tl / max(d, 0.1)) + 0.14 * (1 - ease_out(tl / 0.35))
        c.save(); c.translate(fx, fy); c.scale(z, z); c.translate(-fx, -fy)
        SCENES[s["scene"]](c, s, tl, d, float(mouth[min(f, len(mouth) - 1)]), T, ep)
        c.restore()
        vignette(c)
        if s.get("chip"):
            chip(c, s["chip"], W / 2, CHIP_Y.get(s["scene"], 190), (tl - (0.3 if s["scene"] == "end" else 0)) / 0.4,
                 bg="#FFFFFF" if s["scene"] == "end" else ("#7FD4C1" if idx % 2 else "#FFD23F"))
        if tl < 0.12:
            c.drawRect(skia.Rect.MakeWH(W, H), P("#FFFFFF", a=int(160 * (1 - tl / 0.12))))
        captions(c, words, T, y=760)
        if preview:
            surf.makeImageSnapshot().save(f"/tmp/prev_{T:05.1f}.png"); continue
        enc.stdin.write(surf.makeImageSnapshot().tobytes())
    if enc:
        enc.stdin.close(); enc.wait()
    print("escenas:", [(s["scene"], round(st, 1), round(d, 1)) for s, st, d in scenes])
    print(f"OK {out} {total:.1f}s")
    return total

if __name__ == "__main__":
    args = sys.argv[1:]
    prev = None
    if "--preview" in args:
        i = args.index("--preview"); prev = [float(x) for x in args[i + 1].split(",")]; args = args[:i] + args[i + 2:]
    main(args[0], args[1] if len(args) > 1 else "/tmp/out.mp4", prev)
