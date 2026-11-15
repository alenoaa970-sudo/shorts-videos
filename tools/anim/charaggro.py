"""Personajes estilo 'agresivo' (cómic de guerra): rasgos angulosos, mandíbula marcada, cejas en V,
contorno muy grueso, sombreado duro a tres tonos, luz de borde naranja, ropa sucia y posturas de combate.
Diseño original. Lienzo 600x1000, pies en y=975."""
import math, random, skia
from engine import C, P, poly, oval, rrect, clamp

INK = "#0E0B0C"; RIM = "#FF8A3D"

def tone(hexcol, f):
    h = hexcol.lstrip("#"); r, g, b = [int(h[i:i + 2], 16) for i in (0, 2, 4)]
    if f < 1: r, g, b = int(r * f), int(g * f), int(min(255, b * f * 1.08))
    else: r, g, b = [min(255, int(v + (255 - v) * (f - 1))) for v in (r, g, b)]
    return "#%02X%02X%02X" % (r, g, b)

def hard(c, path, col, w=11, rim=True):
    """Relleno con sombreado duro de 3 tonos + luz de borde + contorno grueso."""
    c.drawPath(path, P(col))
    b = path.getBounds()
    c.save(); c.clipPath(path, doAntiAlias=True)
    sh = skia.Path(); sh.moveTo(b.left() + b.width() * 0.42, b.top() - 10); sh.lineTo(b.right() + 10, b.top() - 10)
    sh.lineTo(b.right() + 10, b.bottom() + 10); sh.lineTo(b.left() + b.width() * 0.30, b.bottom() + 10); sh.close()
    c.drawPath(sh, P(tone(col, 0.62)))
    sh2 = skia.Path(); sh2.moveTo(b.left() + b.width() * 0.78, b.top() - 10); sh2.lineTo(b.right() + 10, b.top() - 10)
    sh2.lineTo(b.right() + 10, b.bottom() + 10); sh2.lineTo(b.left() + b.width() * 0.70, b.bottom() + 10); sh2.close()
    c.drawPath(sh2, P(tone(col, 0.42)))
    if rim:
        c.drawRect(skia.Rect.MakeLTRB(b.left() - 2, b.top(), b.left() + max(5, b.width() * 0.07), b.bottom()), P(RIM, a=170))
    c.restore()
    c.drawPath(path, P(INK, stroke=w))

def grime(c, path, seed):
    rnd = random.Random(seed); b = path.getBounds()
    c.save(); c.clipPath(path, doAntiAlias=True)
    for _ in range(26):
        x = rnd.uniform(b.left(), b.right()); y = rnd.uniform(b.top(), b.bottom())
        c.drawCircle(x, y, rnd.uniform(2, 7), P("#2A2016", a=rnd.randint(40, 110)))
    c.restore()

def seg_limb(c, x0, y0, a1, a2, col, skin, w=44, l1=125, l2=118, fist=True):
    x1, y1 = x0 + math.sin(a1) * l1, y0 + math.cos(a1) * l1
    x2, y2 = x1 + math.sin(a1 + a2) * l2, y1 + math.cos(a1 + a2) * l2
    for (ax, ay, bx, by, ww) in ((x0, y0, x1, y1, w), (x1, y1, x2, y2, w - 6)):
        c.drawLine(ax, ay, bx, by, P(INK, stroke=ww + 16))
    c.drawLine(x0, y0, x1, y1, P(col, stroke=w)); c.drawLine(x1, y1, x2, y2, P(skin, stroke=w - 6))  # manga remangada
    c.drawLine(x0 + 7, y0, x1 + 7, y1, P(tone(col, 0.55), stroke=w * 0.4))
    c.drawLine(x1 + 6, y1, x2 + 6, y2, P(tone(skin, 0.62), stroke=(w - 6) * 0.4))
    c.drawCircle(x1, y1, w / 2 + 2, P(tone(col, 0.8))); c.drawCircle(x1, y1, w / 2 + 2, P(INK, stroke=7))   # manga enrollada
    if fist:
        f = rrect(x2 - 25, y2 - 22, x2 + 25, y2 + 26, 12); hard(c, f, skin, 8, rim=False)
        for k in range(3): c.drawLine(x2 - 14 + k * 12, y2 - 10, x2 - 14 + k * 12, y2 + 4, P(INK, stroke=3))
    return x2, y2

def head(c, cx, cy, skin, mood, mouth, extras, seed):
    # mandíbula cuadrada
    hp = skia.Path(); hp.moveTo(cx - 72, cy - 40); hp.lineTo(cx - 70, cy + 30); hp.lineTo(cx - 52, cy + 78)
    hp.lineTo(cx - 20, cy + 100); hp.lineTo(cx + 20, cy + 100); hp.lineTo(cx + 54, cy + 76); hp.lineTo(cx + 72, cy + 28)
    hp.lineTo(cx + 74, cy - 40); hp.cubicTo(cx + 70, cy - 120, cx - 70, cy - 120, cx - 72, cy - 40); hp.close()
    for sx in (-1, 1):
        e = poly([(cx + sx * 70, cy - 12), (cx + sx * 92, cy - 4), (cx + sx * 88, cy + 30), (cx + sx * 70, cy + 34)])
        hard(c, e, skin, 8, rim=sx < 0)
    hard(c, hp, skin, 12)
    # barba de 3 días
    rnd = random.Random(seed)
    c.save(); c.clipPath(hp, doAntiAlias=True)
    for _ in range(140):
        x = rnd.uniform(cx - 64, cx + 64); y = rnd.uniform(cy + 40, cy + 100)
        c.drawCircle(x, y, 1.8, P("#2A1C14", a=150))
    c.restore()
    c.drawLine(cx - 8, cy + 92, cx + 8, cy + 92, P(INK, stroke=4))   # hoyuelo de la barbilla
    # ojos entrecerrados + cejas en V
    for sx in (-1, 1):
        ex, ey = cx + sx * 30, cy + 2
        if mood == "shout":
            eye = poly([(ex - 18, ey - 6), (ex + 18, ey - 10 * sx * 0 - 6), (ex + 14, ey + 8), (ex - 14, ey + 8)])
        else:
            eye = poly([(ex - 19, ey - 4 + (4 if sx > 0 else 0)), (ex + 19, ey - 4 + (4 if sx < 0 else 0)), (ex + 15, ey + 7), (ex - 15, ey + 7)])
        c.drawPath(eye, P("#F4EDE0")); c.drawPath(eye, P(INK, stroke=5))
        c.drawCircle(ex - sx * 2, ey + 1, 6, P("#1A120C")); c.drawCircle(ex - sx * 2 + 2, ey - 1, 1.8, P("#FFFFFF"))
        brow = poly([(ex - 26 * sx * -1 if False else ex - 24, ey - 22 + (14 if sx < 0 else 0) * 0 + (10 if sx * -1 > 0 else -2)),
                     (ex + 24, ey - 22 + (10 if sx > 0 else -2)), (ex + 24, ey - 12 + (10 if sx > 0 else -2)), (ex - 24, ey - 12 + (10 if sx < 0 else -2))])
        c.drawPath(brow, P("#1E140E")); c.drawPath(brow, P(INK, stroke=3))
    # arrugas de ceño
    c.drawLine(cx - 4, cy - 26, cx - 8, cy - 6, P(INK, stroke=4)); c.drawLine(cx + 6, cy - 26, cx + 9, cy - 8, P(INK, stroke=4))
    # nariz angulosa
    c.drawPath(poly([(cx - 2, cy + 4), (cx + 14, cy + 40), (cx - 8, cy + 44)], close=False), P(INK, stroke=6))
    c.drawPath(poly([(cx + 2, cy + 8), (cx + 14, cy + 40), (cx + 2, cy + 42)]), P(tone(skin, 0.6)))
    # cicatriz
    if "scar" in extras:
        c.drawLine(cx - 52, cy - 30, cx - 26, cy + 34, P("#B8574A", stroke=5))
        for k in range(4):
            t = k / 3; x = cx - 52 + 26 * t; y = cy - 30 + 64 * t
            c.drawLine(x - 8, y + 2, x + 8, y - 2, P("#B8574A", stroke=3))
    if "warpaint" in extras:
        for sx in (-1, 1): c.drawLine(cx + sx * 50, cy + 22, cx + sx * 20, cy + 30, P("#141414", stroke=10))
    # boca
    my = cy + 66
    if mood == "shout" or mouth > 0.3:
        mp = poly([(cx - 30, my - 8), (cx + 30, my - 8), (cx + 22, my + 28), (cx - 22, my + 28)])
        c.drawPath(mp, P("#3A0E10")); c.drawRect(skia.Rect.MakeLTRB(cx - 26, my - 8, cx + 26, my + 2), P("#F2EDE0"))
        for k in range(1, 5): c.drawLine(cx - 26 + k * 10.4, my - 8, cx - 26 + k * 10.4, my + 2, P(INK, stroke=2))
        c.drawPath(mp, P(INK, stroke=6))
    elif mood == "grin":
        mp = poly([(cx - 28, my - 4), (cx + 30, my - 10), (cx + 26, my + 6), (cx - 24, my + 6)])
        c.drawPath(mp, P("#F2EDE0"))
        for k in range(1, 5): c.drawLine(cx - 26 + k * 11, my - 6, cx - 26 + k * 11, my + 6, P(INK, stroke=2))
        c.drawPath(mp, P(INK, stroke=6))
    else:
        c.drawLine(cx - 26, my, cx + 26, my - 3, P(INK, stroke=7))
        c.drawLine(cx + 22, my - 3, cx + 30, my + 4, P(INK, stroke=5))

def helmet(c, cx, cy, col, seed, low=True):
    d = skia.Path(); d.moveTo(cx - 104, cy - 10); d.cubicTo(cx - 108, cy - 160, cx + 108, cy - 160, cx + 104, cy - 10); d.close()
    hard(c, d, col, 12); grime(c, d, seed)
    c.save(); c.clipPath(d)
    for k in range(-7, 8):
        c.drawLine(cx + k * 24 - 50, cy - 150, cx + k * 24 + 50, cy - 10, P(tone(col, 0.5), stroke=3, a=170))
        c.drawLine(cx + k * 24 + 50, cy - 150, cx + k * 24 - 50, cy - 10, P(tone(col, 0.5), stroke=3, a=170))
    c.restore()
    br = poly([(cx - 122, cy - 8), (cx + 122, cy - 8), (cx + 112, cy + 10), (cx - 112, cy + 10)]); hard(c, br, tone(col, 0.8), 10)
    if low:   # sombra del casco sobre los ojos
        c.drawRect(skia.Rect.MakeLTRB(cx - 72, cy + 10, cx + 74, cy + 26), P("#000000", a=110))
    c.drawLine(cx - 80, cy + 8, cx - 58, cy + 96, P("#4A3A22", stroke=7)); c.drawLine(cx + 80, cy + 8, cx + 58, cy + 96, P("#4A3A22", stroke=7))

def brute(c, x, y, s=1.0, role="soldier", skin="#D9A07A", mood="angry", mouth=0.0, arms=((0.35, 0.5), (0.35, 0.5)),
          stance=0.24, extras=(), seed=1, bulk=1.0, headk=1.0):
    pal = {"soldier": ("#59613D", "#3F4530", "#4C5534"), "painter": ("#7A6E5C", "#2E3036", "#7A1F22"),
           "sound": ("#3E4E60", "#262C36", "#2A2E36"), "actor": ("#7A2228", "#24262C", "#1E2430")}[role]
    jacket, trousers, hatcol = pal
    c.save(); c.translate(x, y); c.scale(s, s)
    c.drawOval(skia.Rect.MakeLTRB(-150, -16, 150, 16), P("#000000", a=90, blur=6))
    # piernas abiertas (postura de combate)
    for sx in (-1, 1):
        hx, hy = sx * 40, -380; fx, fy = sx * (40 + 340 * math.sin(stance)), -40
        leg = poly([(hx - 30, hy), (hx + 30, hy), (fx + 28, fy - 50), (fx - 28, fy - 50)])
        hard(c, leg, trousers, 12); grime(c, leg, seed + sx)
        kx, ky = (hx + fx) / 2, (hy + fy) / 2
        c.drawLine(kx - 20, ky - 10, kx + 22, ky + 6, P(INK, stroke=4))
        boot = poly([(fx - 34, fy - 70), (fx + 30, fy - 70), (fx + 34, fy - 26), (fx + 30 + sx * 34, fy - 14), (fx + 30 + sx * 34, fy + 6), (fx - 36, fy + 6)])
        hard(c, boot, "#2A1C12", 10, rim=False)
        for k in range(3): c.drawLine(fx - 26, fy - 62 + k * 14, fx + 22, fy - 62 + k * 14, P("#5A4A30", stroke=3))
    (al1, al2), (ar1, ar2) = arms
    seg_limb(c, -96 * bulk, -660, -al1, -al2, jacket, skin, w=int(44 * bulk ** 1.4))
    # torso en V (hombros anchos)
    t = poly([(-118 * bulk, -700), (118 * bulk, -700), (132 * bulk, -650), (96, -380), (-96, -380), (-132 * bulk, -650)])
    hard(c, t, jacket, 13); grime(c, t, seed)
    c.drawLine(0, -700, 0, -390, P(INK, stroke=5))
    for sx in (-1, 1):
        pk = poly([(sx * 70 - 34, -630), (sx * 70 + 34, -630), (sx * 70 + 30, -560), (sx * 70 - 30, -560)]); hard(c, pk, tone(jacket, 0.85), 6, rim=False)
        c.drawLine(sx * 70 - 34, -612, sx * 70 + 34, -612, P(INK, stroke=4))
    # correaje cruzado
    c.drawLine(-110, -690, 90, -400, P(INK, stroke=34)); c.drawLine(-110, -690, 90, -400, P("#7A6A42", stroke=22))
    belt = rrect(-104, -420, 104, -386, 4); hard(c, belt, "#6E5E3A", 8, rim=False)
    for k in range(5): hard(c, rrect(-90 + k * 38, -428, -66 + k * 38, -380, 4), "#5E5032", 5, rim=False)
    if role == "painter":
        for (px, py, col) in [(-60, -520, "#C8372D"), (40, -460, "#2F6FB0"), (70, -610, "#D9A21F")]:
            c.drawCircle(px, py, 14, P(col)); c.drawCircle(px + 10, py + 14, 6, P(col))
    # cuello grueso
    nk = rrect(-40, -740, 40, -690, 6); hard(c, nk, skin, 9)
    hx, hy = 0, -830
    c.save(); c.translate(0, -740); c.scale(headk, headk); c.translate(0, 740)
    head(c, hx, hy, skin, mood, mouth, extras, seed)
    if role == "soldier": helmet(c, hx, hy - 20, hatcol, seed)
    elif role == "painter":
        b = skia.Path(); b.moveTo(hx - 92, hy - 56); b.cubicTo(hx - 120, hy - 150, hx + 96, hy - 166, hx + 98, hy - 66); b.quadTo(hx, hy - 40, hx - 92, hy - 56); b.close()
        hard(c, b, hatcol, 11)
    elif role == "sound":
        hp = skia.Path(); hp.moveTo(hx - 92, hy); hp.cubicTo(hx - 100, hy - 170, hx + 100, hy - 170, hx + 92, hy)
        c.drawPath(hp, P(INK, stroke=26)); c.drawPath(hp, P("#3A3F4A", stroke=14))
        for sx in (-1, 1): hard(c, rrect(hx + sx * 92 - 24, hy - 34, hx + sx * 92 + 24, hy + 40, 10), "#2A2E36", 9)
        hair = poly([(hx - 74, hy - 40), (hx - 60, hy - 100), (hx + 60, hy - 104), (hx + 76, hy - 40), (hx + 40, hy - 70), (hx - 30, hy - 66)])
        c.drawPath(hair, P("#1A120C")); c.drawPath(hair, P(INK, stroke=6))
    else:
        cp = skia.Path(); cp.moveTo(hx - 84, hy - 50); cp.cubicTo(hx - 84, hy - 150, hx + 84, hy - 150, hx + 84, hy - 50); cp.close()
        hard(c, cp, hatcol, 11)
        hard(c, poly([(hx - 20, hy - 54), (hx + 150, hy - 46), (hx + 140, hy - 26), (hx - 20, hy - 38)]), tone(hatcol, 0.7), 8, rim=False)
    c.restore()
    seg_limb(c, 96 * bulk, -660, ar1, ar2, jacket, skin, w=int(44 * bulk ** 1.4))
    c.restore()

if __name__ == "__main__":
    import sys
    out = sys.argv[1]
    def spr(name, **kw):
        s = skia.Surface.MakeRaster(skia.ImageInfo.Make(600, 1000, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
        c = s.getCanvas(); c.clear(skia.ColorTRANSPARENT)
        brute(c, 300, 985, 0.92, **kw); s.makeImageSnapshot().save(f"{out}/{name}.png")
    UP = ((2.8, 0.15), (2.8, 0.15))
    spr("lift", mood="shout", arms=UP, extras=("scar",), seed=1)
    spr("lift2", mood="shout", arms=UP, skin="#8D5A3B", seed=2)
    spr("idle", mood="angry", arms=((0.3, 0.4), (0.3, 0.4)), skin="#E0B08A", seed=3)
    spr("point", mood="grin", arms=((0.3, -0.3), (1.7, 0.1)), skin="#B57A52", extras=("warpaint",), seed=4)
    spr("wow", mood="shout", arms=((0.9, 0.9), (0.9, 0.9)), seed=5)
    spr("worried", mood="angry", arms=((0.25, -1.6), (0.25, -1.6)), extras=("scar",), skin="#C98E62", seed=6)
    spr("painter", role="painter", mood="grin", arms=((0.3, -0.4), (1.1, 1.2)), seed=7)
    spr("actor", role="actor", mood="shout", arms=((2.5, 0.3), (2.6, 0.2)), skin="#8D5A3B", seed=8)
    spr("sound", role="sound", mood="angry", arms=((0.3, -0.4), (1.5, 1.5)), seed=9)
    spr("pumper", mood="grin", arms=((0.25, -1.5), (0.25, -1.5)), skin="#E0B08A", seed=10)
    print("ok")
