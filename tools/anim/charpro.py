"""Personajes 'pro': diseño original más trabajado (proporción ~4 cabezas, sombreado a dos tonos,
contorno de grosor variable, ojos con pupila y brillo, nariz, orejas, codos, manos con pulgar, ropa con pliegues).
Lienzo 600x1000, pies en y=975."""
import math, skia
from engine import C, P, poly, oval, rrect, clamp

INK = "#1E1620"

def shade(hexcol, f):
    h = hexcol.lstrip("#"); r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    if f < 1: r, g, b = int(r * f), int(g * f * 0.97), int(b * f * 1.03 if b * f * 1.03 < 255 else 255)
    else: r, g, b = min(255, int(r + (255 - r) * (f - 1))), min(255, int(g + (255 - g) * (f - 1))), min(255, int(b + (255 - b) * (f - 1)))
    return "#%02X%02X%02X" % (r, g, b)

def ink_fill(c, path, col, w=6, lit=True, light_dir=-1):
    """Relleno + sombra a dos tonos (lado contrario a la luz) + contorno."""
    c.drawPath(path, P(col))
    if lit:
        b = path.getBounds(); cx = b.centerX()
        c.save(); c.clipPath(path, doAntiAlias=True)
        if light_dir < 0:
            c.drawRect(skia.Rect.MakeLTRB(cx + b.width() * 0.12, b.top() - 5, b.right() + 5, b.bottom() + 5), P(shade(col, 0.78)))
        else:
            c.drawRect(skia.Rect.MakeLTRB(b.left() - 5, b.top() - 5, cx - b.width() * 0.12, b.bottom() + 5), P(shade(col, 0.78)))
        c.drawRect(skia.Rect.MakeLTRB(b.left(), b.top(), b.right(), b.top() + b.height() * 0.12), P(shade(col, 1.12), a=120))
        c.restore()
    c.drawPath(path, P(INK, stroke=w))

def limb(c, x0, y0, a1, l1, a2, l2, w, col, hand=None, boot=None, skin="#F2C9A0"):
    """Extremidad de dos segmentos (hombro->codo->mano). Ángulos en radianes desde 'abajo'."""
    x1, y1 = x0 + math.sin(a1) * l1, y0 + math.cos(a1) * l1
    x2, y2 = x1 + math.sin(a1 + a2) * l2, y1 + math.cos(a1 + a2) * l2
    for (ax, ay, bx, by) in ((x0, y0, x1, y1), (x1, y1, x2, y2)):
        c.drawLine(ax, ay, bx, by, P(INK, stroke=w + 10))
    for (ax, ay, bx, by) in ((x0, y0, x1, y1), (x1, y1, x2, y2)):
        c.drawLine(ax, ay, bx, by, P(col, stroke=w))
    c.drawLine(x0 + 4, y0, x1 + 4, y1, P(shade(col, 0.8), stroke=w * 0.35))
    if hand:
        ang = a1 + a2
        c.save(); c.translate(x2, y2); c.rotate(-math.degrees(ang))
        mit = skia.Path(); mit.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-17, -4, 17, 34), 15, 15))
        ink_fill(c, mit, skin, 5, lit=False)
        th = skia.Path(); th.addOval(skia.Rect.MakeLTRB(10, 0, 26, 20)); ink_fill(c, th, skin, 4, lit=False)
        c.restore()
    return x2, y2

def face(c, cx, cy, mood="open", mouth=0.0, skin="#F2C9A0", hair="#3A2618", look=(0, 0), extras=(), blink=False):
    # orejas
    for sx in (-1, 1):
        e = oval(cx + sx * 74, cy + 8, 15, 22); ink_fill(c, e, skin, 5, lit=False)
        c.drawArc(skia.Rect.MakeLTRB(cx + sx * 74 - 8, cy - 4, cx + sx * 74 + 8, cy + 20), 90 if sx > 0 else -90, 180, False, P(shade(skin, 0.75), stroke=3))
    # cabeza (forma de huevo con mandíbula)
    head = skia.Path(); head.moveTo(cx - 70, cy - 20)
    head.cubicTo(cx - 72, cy - 110, cx + 72, cy - 110, cx + 70, cy - 20)
    head.cubicTo(cx + 68, cy + 50, cx + 40, cy + 92, cx, cy + 96)
    head.cubicTo(cx - 40, cy + 92, cx - 68, cy + 50, cx - 70, cy - 20); head.close()
    ink_fill(c, head, skin, 7)
    # mejillas
    for sx in (-1, 1): c.drawCircle(cx + sx * 42, cy + 34, 14, P("#E8806E", a=70))
    lx, ly = look
    # ojos
    for sx in (-1, 1):
        ex, ey = cx + sx * 28 + lx, cy + 2 + ly
        if blink or mood == "happy":
            p = skia.Path(); p.moveTo(ex - 13, ey + 3); p.quadTo(ex, ey - 11 if mood == "happy" else ey + 2, ex + 13, ey + 3)
            c.drawPath(p, P(INK, stroke=6))
        else:
            big = 1.25 if mood == "surprised" else 1.0
            c.drawOval(skia.Rect.MakeLTRB(ex - 12 * big, ey - 15 * big, ex + 12 * big, ey + 15 * big), P("#FFFFFF"))
            c.drawOval(skia.Rect.MakeLTRB(ex - 12 * big, ey - 15 * big, ex + 12 * big, ey + 15 * big), P(INK, stroke=4))
            c.drawCircle(ex + 1 + lx * 0.3, ey + 2, 7.5 * big, P("#2B1C14"))
            c.drawCircle(ex + 3.5, ey - 2.5, 2.8, P("#FFFFFF"))
            if mood in ("worried", "determined"):
                c.save(); c.clipRect(skia.Rect.MakeLTRB(ex - 16, ey - 20, ex + 16, ey - 4))
                c.drawOval(skia.Rect.MakeLTRB(ex - 13, ey - 16, ex + 13, ey + 16), P(skin)); c.restore()
                c.drawLine(ex - 13, ey - 4, ex + 13, ey - 4, P(INK, stroke=4))
        # cejas
        by = ey - 28 - (6 if mood == "surprised" else 0)
        t = {"worried": 7 * sx, "determined": -7 * sx, "surprised": -2, "happy": -2}.get(mood, 0)
        c.drawLine(ex - 14, by - t * (1 if sx < 0 else 0) + (t if sx > 0 else 0) * 0, ex + 14, by + t * (0.5), P(hair, stroke=8))
    # nariz
    nose = skia.Path(); nose.moveTo(cx - 3, cy + 6); nose.quadTo(cx + 14, cy + 28, cx - 6, cy + 34)
    c.drawPath(nose, P(INK, stroke=4)); c.drawCircle(cx + 2, cy + 30, 9, P(shade(skin, 0.86), a=160))
    # bigote / gafas / pecas
    if "mustache" in extras:
        m = skia.Path(); my = cy + 46
        m.moveTo(cx, my - 4); m.cubicTo(cx - 14, my - 14, cx - 40, my - 10, cx - 44, my + 6); m.cubicTo(cx - 30, my, cx - 14, my + 6, cx, my + 2)
        m.cubicTo(cx + 14, my + 6, cx + 30, my, cx + 44, my + 6); m.cubicTo(cx + 40, my - 10, cx + 14, my - 14, cx, my - 4); m.close()
        c.drawPath(m, P(hair))
    if "freckles" in extras:
        for (dx, dy) in [(-40, 22), (-30, 30), (-46, 34), (40, 22), (30, 30), (46, 34)]: c.drawCircle(cx + dx, cy + dy, 2.6, P("#B8714E"))
    if "glasses" in extras:
        for sx in (-1, 1): c.drawCircle(cx + sx * 28, cy + 2, 21, P(INK, stroke=5))
        c.drawLine(cx - 7, cy, cx + 7, cy, P(INK, stroke=5))
    # boca
    my = cy + 62; mo = clamp(mouth)
    if mo > 0.08 or mood == "surprised":
        h = 8 + 26 * max(mo, 0.5 if mood == "surprised" else 0)
        mp = oval(cx, my + h / 2 - 4, 16 + 5 * mo, h / 2 + 2); ink_fill(c, mp, "#6E1E24", 4, lit=False)
        c.save(); c.clipPath(mp); c.drawOval(skia.Rect.MakeLTRB(cx - 12, my + h * 0.5, cx + 12, my + h + 8), P("#D9535F")); c.restore()
    else:
        p = skia.Path()
        if mood == "worried": p.moveTo(cx - 16, my + 6); p.quadTo(cx, my - 4, cx + 16, my + 6)
        elif mood == "determined": p.moveTo(cx - 14, my + 2); p.lineTo(cx + 14, my + 1)
        else: p.moveTo(cx - 20, my - 2); p.quadTo(cx, my + 16, cx + 20, my - 2)
        c.drawPath(p, P(INK, stroke=5))

def hat_draw(c, kind, cx, cy, col, hair):
    if kind == "helmet":      # casco redondo con red y barboquejo
        dome = skia.Path(); dome.moveTo(cx - 92, cy - 34); dome.cubicTo(cx - 96, cy - 150, cx + 96, cy - 150, cx + 92, cy - 34); dome.close()
        ink_fill(c, dome, col, 7)
        c.save(); c.clipPath(dome)
        for k in range(-6, 7): c.drawLine(cx + k * 22 - 40, cy - 140, cx + k * 22 + 40, cy - 30, P(shade(col, 0.7), stroke=2, a=150))
        for k in range(-6, 7): c.drawLine(cx + k * 22 + 40, cy - 140, cx + k * 22 - 40, cy - 30, P(shade(col, 0.7), stroke=2, a=150))
        c.restore()
        brim = oval(cx, cy - 34, 104, 16); ink_fill(c, brim, shade(col, 0.85), 6, lit=False)
        c.drawLine(cx - 74, cy - 30, cx - 60, cy + 60, P("#5A4A2A", stroke=5)); c.drawLine(cx + 74, cy - 30, cx + 60, cy + 60, P("#5A4A2A", stroke=5))
    elif kind == "beret":
        b = skia.Path(); b.moveTo(cx - 86, cy - 50); b.cubicTo(cx - 110, cy - 130, cx + 90, cy - 150, cx + 92, cy - 60); b.quadTo(cx, cy - 36, cx - 86, cy - 50); b.close()
        ink_fill(c, b, col, 7); c.drawCircle(cx + 6, cy - 128, 9, P(INK))
    elif kind == "headphones":
        hp = skia.Path(); hp.moveTo(cx - 80, cy); hp.cubicTo(cx - 90, cy - 150, cx + 90, cy - 150, cx + 80, cy)
        c.drawPath(hp, P(INK, stroke=18)); c.drawPath(hp, P("#4A4F5A", stroke=10))
        for sx in (-1, 1): ink_fill(c, rrect(cx + sx * 80 - 18, cy - 24, cx + sx * 80 + 18, cy + 30, 10), "#3A3F4A", 5)
        hairp = skia.Path(); hairp.moveTo(cx - 70, cy - 30); hairp.cubicTo(cx - 60, cy - 110, cx + 60, cy - 110, cx + 70, cy - 30); hairp.quadTo(cx + 20, cy - 60, cx - 70, cy - 30); hairp.close()
        ink_fill(c, hairp, hair, 6, lit=False)
    elif kind == "cap":
        hairp = skia.Path(); hairp.moveTo(cx - 72, cy - 10); hairp.quadTo(cx - 76, cy - 60, cx - 40, cy - 70); hairp.lineTo(cx - 60, cy - 10); hairp.close()
        ink_fill(c, hairp, hair, 5, lit=False)
        cp = skia.Path(); cp.moveTo(cx - 80, cy - 46); cp.cubicTo(cx - 80, cy - 130, cx + 80, cy - 130, cx + 80, cy - 46); cp.close()
        ink_fill(c, cp, col, 7)
        vis = skia.Path(); vis.moveTo(cx - 30, cy - 50); vis.quadTo(cx + 60, cy - 70, cx + 130, cy - 40); vis.quadTo(cx + 60, cy - 30, cx - 30, cy - 50); vis.close()
        ink_fill(c, vis, shade(col, 0.8), 6, lit=False)
    else:                       # pelo
        hp = skia.Path(); hp.moveTo(cx - 72, cy - 10); hp.cubicTo(cx - 90, cy - 130, cx + 90, cy - 130, cx + 72, cy - 10)
        hp.quadTo(cx + 40, cy - 70, cx, cy - 64); hp.quadTo(cx - 40, cy - 70, cx - 72, cy - 10); hp.close()
        ink_fill(c, hp, hair, 6)

def person(c, x, y, s=1.0, role="soldier", skin="#F2C9A0", hair="#3A2618", mood="open", mouth=0.0,
           arms=((0.15, 0.25), (-0.15, -0.25)), legs=(0.0, 0.0), extras=(), look=(0, 0), prop=None, blink=False):
    """Personaje de cuerpo entero. arms = ((hombro_izq, codo_izq), (hombro_der, codo_der)) en radianes."""
    pal = {"soldier": ("#6B7646", "#58613A", "helmet", "#5E6A3C"),
           "painter": ("#EDE6D6", "#4A4F5A", "beret", "#8E2F2A"),
           "sound": ("#5E7A96", "#3E4A5A", "headphones", "#4A4F5A"),
           "actor": ("#B3363A", "#3B3B44", "cap", "#2E3A5A")}[role]
    jacket, trousers, hat, hatcol = pal
    c.save(); c.translate(x, y); c.scale(s, s)
    c.drawOval(skia.Rect.MakeLTRB(-120, -14, 120, 14), P("#000000", a=60, blur=6))
    # piernas + botas
    for i, sx in enumerate((-1, 1)):
        a = legs[i] if isinstance(legs, (tuple, list)) else 0
        hx, hy = sx * 34, -370
        kx, ky = hx + math.sin(a) * 175, hy + math.cos(a) * 175
        fx, fy = kx, ky + 170
        c.drawLine(hx, hy, kx, ky, P(INK, stroke=62)); c.drawLine(kx, ky, fx, fy - 30, P(INK, stroke=58))
        c.drawLine(hx, hy, kx, ky, P(trousers, stroke=50)); c.drawLine(kx, ky, fx, fy - 30, P(trousers, stroke=46))
        c.drawLine(hx + 10, hy, kx + 10, ky, P(shade(trousers, 0.78), stroke=16))
        gait = rrect(fx - 26, fy - 90, fx + 26, fy - 20, 8); ink_fill(c, gait, "#C9B88A" if role == "soldier" else trousers, 5)
        boot = skia.Path(); boot.moveTo(fx - 28, fy - 32); boot.lineTo(fx + 26, fy - 32); boot.quadTo(fx + 62, fy - 20, fx + 60, fy); boot.lineTo(fx - 30, fy); boot.close()
        ink_fill(c, boot, "#3A2818", 6)
    # brazo trasero
    (al1, al2), (ar1, ar2) = arms
    limb(c, -78, -640, -al1, 120, -al2, 115, 38, jacket, hand=True, skin=skin)
    # torso con chaqueta
    t = skia.Path(); t.moveTo(-82, -690); t.quadTo(0, -712, 82, -690); t.quadTo(104, -684, 104, -650)
    t.lineTo(96, -380); t.quadTo(94, -350, 64, -350); t.lineTo(-64, -350); t.quadTo(-94, -350, -96, -380); t.lineTo(-104, -650); t.quadTo(-104, -684, -82, -690); t.close()
    ink_fill(c, t, jacket, 8)
    c.drawLine(0, -690, 0, -360, P(INK, stroke=4, a=200))
    for by in (-640, -580, -520, -460): c.drawCircle(-12, by, 6, P(shade(jacket, 0.6)))
    for sx in (-1, 1):
        pk = rrect(sx * 58 - 30, -620, sx * 58 + 30, -560, 6); ink_fill(c, pk, shade(jacket, 0.92), 4, lit=False)
        c.drawLine(sx * 58 - 30, -604, sx * 58 + 30, -604, P(INK, stroke=3))
    c.drawPath(poly([(-50, -470), (-20, -455), (-48, -440)], close=False), P(shade(jacket, 0.7), stroke=4))
    c.drawPath(poly([(60, -500), (30, -485), (58, -470)], close=False), P(shade(jacket, 0.7), stroke=4))
    if role == "soldier":
        belt = rrect(-100, -410, 100, -382, 4); ink_fill(c, belt, "#9C8A5A", 5, lit=False)
        ink_fill(c, rrect(-14, -414, 14, -378, 3), "#C9B060", 4, lit=False)
        for sx in (-1, 1): ink_fill(c, rrect(sx * 62 - 18, -416, sx * 62 + 18, -376, 4), "#8A7A4E", 4, lit=False)
    elif role == "painter":
        for (px, py, col) in [(-50, -520, "#E53935"), (30, -450, "#3B82C4"), (60, -600, "#F2C14E"), (-20, -420, "#3F9A4A")]:
            c.drawCircle(px, py, 10, P(col))
    # cuello con solapas
    ink_fill(c, poly([(-44, -694), (0, -640), (44, -694), (24, -700), (0, -672), (-24, -700)]), shade(jacket, 0.88), 5, lit=False)
    c.drawRect(skia.Rect.MakeLTRB(-22, -720, 22, -690), P(skin)); c.drawRect(skia.Rect.MakeLTRB(-22, -720, 22, -690), P(INK, stroke=5))
    # cabeza
    hcx, hcy = 0, -800
    if hat in ("cap", "beret"): hat_draw(c, "hair", hcx, hcy, hatcol, hair)
    face(c, hcx, hcy, mood, mouth, skin, hair, look, extras, blink)
    hat_draw(c, hat, hcx, hcy, hatcol, hair)
    # brazo delantero
    hx, hy = limb(c, 78, -640, ar1, 120, ar2, 115, 38, jacket, hand=True, skin=skin)
    if prop == "brush":
        c.drawLine(hx, hy, hx + 60, hy - 70, P(INK, stroke=14)); c.drawLine(hx, hy, hx + 60, hy - 70, P("#B07A44", stroke=8))
        c.drawCircle(hx + 64, hy - 75, 10, P("#E53935")); c.drawCircle(hx + 64, hy - 75, 10, P(INK, stroke=3))
    if prop == "pump":
        ink_fill(c, rrect(hx - 14, hy - 10, hx + 14, hy + 120, 6), "#9AA6B2", 5)
    c.restore()

if __name__ == "__main__":
    import sys
    W0, H0 = 600, 1000
    out = sys.argv[1]
    def spr(name, **kw):
        s = skia.Surface.MakeRaster(skia.ImageInfo.Make(W0, H0, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
        c = s.getCanvas(); c.clear(skia.ColorTRANSPARENT)
        person(c, 300, 985, 1.0, **kw); s.makeImageSnapshot().save(f"{out}/{name}.png")
    UP = ((2.7, 0.2), (2.7, 0.2))
    spr("lift", role="soldier", mood="happy", arms=UP, extras=("mustache",))
    spr("lift2", role="soldier", mood="determined", arms=UP, skin="#C98E62", hair="#1A1410")
    spr("idle", role="soldier", mood="open", extras=("freckles",), hair="#A0522D")
    spr("point", role="soldier", mood="happy", arms=((0.15, -0.2), (1.9, 0.2)), skin="#8D5A3B", hair="#1A1410")
    spr("wow", role="soldier", mood="surprised", arms=((0.7, 0.9), (0.7, 0.9)), extras=("glasses",))
    spr("worried", role="soldier", mood="worried", arms=((0.3, -1.5), (0.3, -1.5)), extras=("mustache",))
    spr("painter", role="painter", mood="happy", arms=((0.15, -0.2), (1.0, 1.0)), prop="brush", extras=("mustache",), hair="#6B4A2A")
    spr("actor", role="actor", mood="happy", arms=((2.4, 0.3), (2.6, 0.2)), skin="#C98E62", hair="#1A1410")
    spr("sound", role="sound", mood="determined", arms=((0.2, -0.3), (1.6, 1.4)), extras=("glasses",), hair="#3A2618")
    spr("pumper", role="soldier", mood="happy", arms=((0.3, -1.3), (0.3, -1.3)), prop="pump", skin="#F2C9A0", hair="#C9A060")
    print("ok")
