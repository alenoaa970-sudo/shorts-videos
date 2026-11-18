"""Episodio 014 (Wojtek, el oso soldado, 1942-1963): oso de dibujos original, fondos nuevos y objetos.
Fondos: hamadan (estación de tren en Irán al atardecer), troopship (puerto con barco de tropas),
cassino (monte con abadía en ruinas bajo bombardeo), camp (campamento militar en el desierto)
y zoo (recinto del zoo de Edimburgo con lluvia y castillo). Todo dibujado a mano, original."""
import math, random
import skia
from engine import *
from charaggro import hard, tone

INK = "#0E0B0C"

def _add(paint):
    paint.setBlendMode(skia.BlendMode.kPlus); return paint

# ------------------------------------------------------------------ el oso
FUR, FUR_D, BELLY, SNOUT = "#8A5A33", "#5E3B20", "#C8925E", "#E2B98A"

def _limb(x0, y0, x1, y1, w):
    dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1
    px, py = -dy / L * w, dx / L * w
    p = skia.Path(); p.moveTo(x0 + px, y0 + py); p.lineTo(x1 + px * 0.85, y1 + py * 0.85)
    p.arcTo(skia.Rect.MakeLTRB(x1 - w * 0.95, y1 - w * 0.95, x1 + w * 0.95, y1 + w * 0.95), math.degrees(math.atan2(py, px)), 180, False)
    p.lineTo(x0 - px, y0 - py); p.close()
    return p

def shell(c, x, y, s=1.0, rot=0.0):
    """Proyectil de artillería de latón."""
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    body = skia.Path(); body.moveTo(-34, 90); body.lineTo(-34, -40); body.cubicTo(-34, -95, -8, -130, 0, -140)
    body.cubicTo(8, -130, 34, -95, 34, -40); body.lineTo(34, 90); body.close()
    hard(c, body, "#D9A93C", w=8)
    c.drawRect(skia.Rect.MakeLTRB(-34, 50, 34, 64), P("#8C5A1C"))
    c.drawRect(skia.Rect.MakeLTRB(-38, 88, 38, 100), P("#B8862A")); c.drawRect(skia.Rect.MakeLTRB(-38, 88, 38, 100), P(INK, stroke=6))
    c.drawLine(-14, -100, -18, 40, P("#FFF1B8", stroke=7, a=170))
    c.restore()

def crate(c, x, y, s=1.0, rot=0.0, label="MUNICIÓN"):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    hard(c, rrect(-130, -80, 130, 80, 8), "#6F7A45", w=9)
    for xx in (-130, 118): c.drawRect(skia.Rect.MakeLTRB(xx, -80, xx + 12, 80), P("#4E5730"))
    c.drawLine(-120, -70, 120, 70, P("#4E5730", stroke=10));
    text_c(c, label, 0, 14, 34, fill="#F3E7B8", stroke=INK, sw=6)
    c.restore()

def bottle(c, x, y, s=1.0, rot=0.0, col="#4E8A4A"):
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s)
    b = skia.Path(); b.moveTo(-22, 70); b.lineTo(-22, -10); b.cubicTo(-22, -30, -9, -40, -9, -60); b.lineTo(-9, -88)
    b.lineTo(9, -88); b.lineTo(9, -60); b.cubicTo(9, -40, 22, -30, 22, -10); b.lineTo(22, 70); b.close()
    c.drawPath(b, P(col, a=230)); c.drawPath(b, P(INK, stroke=6))
    c.drawRect(skia.Rect.MakeLTRB(-22, 0, 22, 40), P("#F2E3B3")); c.drawRect(skia.Rect.MakeLTRB(-22, 0, 22, 40), P(INK, stroke=4))
    c.drawLine(-12, -20, -12, 60, P("#FFFFFF", stroke=5, a=120))
    c.restore()

def bear(c, x, y, s=1.0, t=0.0, pose="stand", mood="happy", mouth=0.0, blink=False, cub=False, walk=False, look=0.0):
    """Oso pardo de dibujos (diseño original). Origen = pies. Poses: stand, wave, carry, crate, drink, salute, sit."""
    c.save(); c.translate(x, y)
    step = math.sin(t * 7) if walk else 0.0
    c.translate(0, -abs(math.sin(t * (7 if walk else 2.6))) * (10 if walk else 5))
    sc = s * (0.62 if cub else 1.0)
    c.scale(sc, sc)
    c.drawOval(skia.Rect.MakeLTRB(-170, -22, 170, 22), P("#000000", a=70, blur=8))
    sit = pose == "sit"
    # patas traseras
    if sit:
        for sx in (-1, 1):
            hard(c, oval(sx * 95, -60, 85, 62), FUR, w=11)
            hard(c, oval(sx * 140, -40, 46, 34), FUR_D, w=9)
            for k in range(3): c.drawCircle(sx * 140 + (k - 1) * 18, -38, 8, P(SNOUT))
    else:
        for sx, ph in ((-1, step), (1, -step)):
            hard(c, _limb(sx * 62, -250, sx * 70 + ph * 22, -40, 50), FUR, w=11)
            hard(c, oval(sx * 76 + ph * 22, -26, 62, 28), FUR_D, w=9)
    by = -150 if sit else -330
    # cuerpo
    body = skia.Path(); body.addOval(skia.Rect.MakeLTRB(-150, by - 190, 150, by + 160))
    hard(c, body, FUR, w=12)
    belly = skia.Path(); belly.addOval(skia.Rect.MakeLTRB(-92, by - 110, 92, by + 140))
    c.drawPath(belly, P(BELLY)); c.drawPath(belly, P(tone(BELLY, 0.8), stroke=5))
    for k in range(7):   # mechones de pelo
        a = -2.6 + k * 0.85; r = 150
        c.drawLine(math.cos(a) * r * 0.92, by + math.sin(a) * r * 1.1, math.cos(a) * r * 1.02, by + math.sin(a) * r * 1.2, P(FUR_D, stroke=6))
    # brazos según pose
    sh_y = by - 120
    def arm(sx, ang, length=190, w=44):
        ex, ey = sx * 120 + math.sin(ang) * length, sh_y + math.cos(ang) * length
        hard(c, _limb(sx * 112, sh_y, ex, ey, w), FUR, w=11)
        hard(c, oval(ex, ey, w * 1.05, w * 0.95), FUR_D, w=9)
        for k in range(3): c.drawCircle(ex + (k - 1) * 16, ey + (w * 0.5 if abs(ang) < 1.6 else -w * 0.5), 7, P("#2A1B12"))
        return ex, ey
    held = None; front = []
    w8 = math.sin(t * 7) if walk else math.sin(t * 2.5) * 0.4
    if pose == "carry":
        bob = w8 * 6
        arm(-1, -2.86, 265); arm(1, 2.86, 265)
        held = lambda b=bob: shell(c, 0, sh_y - 300 + b, 1.45, rot=90 + 3 * w8)
    elif pose == "crate":
        bob = w8 * 6
        arm(-1, -2.8, 250); arm(1, 2.8, 250)
        held = lambda b=bob: crate(c, 0, sh_y - 330 + b, 1.15, rot=2 * w8)
    elif pose == "drink":
        arm(-1, 0.35)
        front.append(("drink", -2.42 - 0.08 * math.sin(t * 3)))
    elif pose == "salute":
        arm(-1, 0.3); front.append(("salute", -2.9))
    elif pose == "wave":
        arm(-1, 0.35); arm(1, 2.3 + 0.45 * (0.5 + 0.5 * math.sin(t * 8)))
    elif pose == "sit":
        arm(-1, 0.55, 150); arm(1, -0.55, 150)
    else:
        arm(-1, 0.32 + 0.05 * math.sin(t * 2)); arm(1, -0.32 - 0.05 * math.sin(t * 2))
    # cabeza
    hy = by - 250; hx = look * 20
    c.save(); c.translate(hx, hy); c.rotate(math.sin(t * 2.1) * 3)
    for sx in (-1, 1):
        hard(c, oval(sx * 105, -95, 46, 46), FUR, w=10)
        c.drawCircle(sx * 105, -93, 24, P("#C98A64"))
    head = skia.Path(); head.addOval(skia.Rect.MakeLTRB(-150, -140, 150, 125)); hard(c, head, FUR, w=12)
    if pose == "salute" or cub is False and mood != "worried":
        pass
    hard(c, oval(0, 42, 78, 58), SNOUT, w=9)
    fs(c, oval(0, 10, 32, 22), "#1E120C", ow=0); c.drawCircle(-9, 3, 7, P("#FFFFFF", a=180))
    c.drawLine(0, 30, 0, 48, P(INK, stroke=6))
    # boca
    if mouth > 0.08 or mood in ("surprised",):
        o = 14 + 30 * max(mouth, 0.5 if mood == "surprised" else 0)
        fs(c, oval(0, 64 + o * 0.3, 28, o * 0.55), "#7A1F22", ow=6, outline=INK)
        c.drawCircle(0, 72 + o * 0.4, 12, P("#E06A6A"))
    else:
        sm = skia.Path(); sm.moveTo(-32, 52); sm.quadTo(-16, 72, 0, 50); sm.quadTo(16, 72, 32, 52)
        c.drawPath(sm, P(INK, stroke=6))
    # ojos y cejas
    for sx in (-1, 1):
        ex, ey = sx * 58, -38
        if blink:
            c.drawLine(ex - 20, ey, ex + 20, ey, P(INK, stroke=7))
        else:
            fs(c, oval(ex, ey, 22, 26), "#FFFFFF", ow=6, outline=INK)
            fs(c, oval(ex + 4 + look * 6, ey + 3, 12, 15), "#1E120C", ow=0)
            c.drawCircle(ex + 8, ey - 4, 5, P("#FFFFFF"))
        if mood == "worried": c.drawLine(ex - sx * 26, ey - 52, ex + sx * 22, ey - 40, P(INK, stroke=9))
        elif mood == "angry": c.drawLine(ex - sx * 26, ey - 36, ex + sx * 22, ey - 54, P(INK, stroke=10))
        elif mood == "surprised": c.drawLine(ex - 22, ey - 58, ex + 22, ey - 58, P(INK, stroke=8))
        else: c.drawLine(ex - 20, ey - 46, ex + 20, ey - 50 + sx * 2, P(INK, stroke=8))
    # boina militar (gorra de campaña) para los "adultos"
    if not cub:
        cap = skia.Path(); cap.moveTo(-95, -118); cap.cubicTo(-70, -190, 70, -190, 95, -118); cap.close()
        c.save(); c.rotate(-8); hard(c, cap, "#5F6B3A", w=9)
        fs(c, oval(-30, -152, 16, 16), "#B3262A", ow=4, outline=INK); fs(c, oval(-30, -152, 7, 7), "#FFFFFF", ow=0)
        c.restore()
    c.restore()
    for kind, ang in front:
        if kind == "drink":
            ex, ey = arm(1, ang, 120)
            bottle(c, 66 + 4 * math.sin(t * 3), sh_y - 105, 1.2, rot=-116 + 6 * math.sin(t * 3), col="#C88A2A" if not cub else "#9FC6D8")
            fs(c, oval(ex, ey, 46, 42), FUR_D, ow=9, outline=INK)
        else:
            arm(1, ang, 200)
    if held: held()
    c.restore()

def soldier(c, x, y, s, t, mood="happy", arm_r=-0.3, arm_l=0.3, mouth=0.0, ph=0.0):
    """Soldado polaco (personaje del canal con uniforme caqui y gorra)."""
    character(c, x, y, s, t + ph, shirt="#7D7A52", pants="#4E4B30", hat="cap", hat_col="#4C5530", mood=mood,
              arm_r=arm_r, arm_l=arm_l, mouth=mouth, blink=((t + ph) % 3.0) < 0.12, mustache=ph % 2 < 1)

# ------------------------------------------------------------------ fondos
def _sun(c, x, y, r, col="#FFB347", glow="#FFD27A"):
    c.drawCircle(x, y, r * 3, rad_grad(x, y, r * 3, [C(glow, 170), C(glow, 0)]))
    fs(c, oval(x, y, r, r), col, ow=0)

def _dust(c, t, n=40, seed=3, col="#FFE2B0", y0=300, y1=1700, sp=40):
    rnd = random.Random(seed)
    for i in range(n):
        x = (rnd.uniform(0, W) + t * sp * rnd.uniform(0.5, 1.5)) % (W + 40) - 20
        y = rnd.uniform(y0, y1) + math.sin(t * 1.3 + i) * 14
        c.drawCircle(x, y, rnd.uniform(2, 5), P(col, a=int(70 + 60 * math.sin(t * 2 + i))))

def hamadan(c, t, sky="sunset"):
    """Estación de tren de Hamadán (Irán), 1942, al atardecer: montañas, andén, locomotora con vapor."""
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1350, ["#3B2A5C", "#C9566A", "#FF9E5E", "#FFD08A"], [0, 0.4, 0.75, 1]))
    _sun(c, 780, 980, 110)
    for (pts, col) in [([(0, 1050), (180, 820), (330, 960), (520, 760), (700, 930), (900, 780), (1080, 900), (1080, 1300), (0, 1300)], "#7A3E5A"),
                       ([(0, 1150), (240, 980), (430, 1100), (650, 960), (860, 1090), (1080, 1000), (1080, 1300), (0, 1300)], "#5A2E46")]:
        c.drawPath(poly(pts), P(col))
    c.drawPath(poly([(520, 760), (560, 800), (600, 790), (640, 840), (590, 830), (545, 820)]), P("#F6D7C8", a=200))
    # edificio de la estación (estilo persa, arcos)
    fs(c, rrect(40, 1060, 620, 1390, 6), "#C99566", ow=8)
    for k in range(5):
        ax = 90 + k * 108
        arch = skia.Path(); arch.moveTo(ax, 1380); arch.lineTo(ax, 1200); arch.quadTo(ax + 40, 1130, ax + 80, 1200); arch.lineTo(ax + 80, 1380); arch.close()
        fs(c, arch, "#4A2A22", ow=6)
        c.drawPath(arch, P("#FFC46A", a=int(60 + 40 * math.sin(t * 3 + k))))
    fs(c, rrect(20, 1030, 640, 1075, 6), "#A8734A", ow=7)
    fs(c, rrect(220, 960, 440, 1030, 10), "#E8D2A6", ow=6)
    text_c(c, "HAMADÁN", 330, 1010, 40, fill="#3A2416", path=FONT_SERIF)
    # andén
    c.drawRect(skia.Rect.MakeLTRB(0, 1390, W, 1460), P("#8E7A62")); c.drawLine(0, 1390, W, 1390, P(INK, stroke=7))
    c.drawRect(skia.Rect.MakeLTRB(0, 1460, W, H), lin_grad(0, 1460, 0, H, ["#6A5440", "#3A2C20"]))
    for k in range(14):
        xx = k * 82 - (t * 30) % 82
        c.drawRect(skia.Rect.MakeLTRB(xx, 1500, xx + 50, 1520), P("#4A3626"))
    c.drawLine(0, 1495, W, 1495, P("#B8B0A0", stroke=6)); c.drawLine(0, 1530, W, 1530, P("#B8B0A0", stroke=6))
    # locomotora
    lx = 660
    fs(c, rrect(lx, 1210, lx + 380, 1330, 30), "#2B2B30", ow=8)
    fs(c, rrect(lx + 250, 1120, lx + 400, 1330, 10), "#3A3A42", ow=8)
    fs(c, rrect(lx + 270, 1145, lx + 380, 1210, 8), "#FFC46A", ow=5)
    fs(c, rrect(lx + 60, 1120, lx + 110, 1215, 8), "#1E1E22", ow=7)
    fs(c, rrect(lx + 40, 1100, lx + 130, 1130, 8), "#1E1E22", ow=7)
    c.drawCircle(lx - 2, 1270, 26, P("#FFE9A0")); c.drawCircle(lx - 2, 1270, 120, rad_grad(lx - 2, 1270, 160, [C("#FFE9A0", 120), C("#FFE9A0", 0)]))
    for k, wx in enumerate((lx + 60, lx + 170, lx + 290)):
        c.save(); c.translate(wx, 1345); c.rotate(t * 90)
        fs(c, oval(0, 0, 48, 48), "#B3262A", ow=7)
        for q in range(4): c.save(); c.rotate(q * 45); c.drawLine(-40, 0, 40, 0, P(INK, stroke=6)); c.restore()
        c.restore()
    for k in range(9):   # vapor
        ph = (t * 0.5 + k / 9) % 1
        r = 30 + 110 * ph
        c.drawCircle(lx + 85 + ph * 140 + math.sin(k) * 30, 1090 - ph * 700, r, P("#F4EEF2", a=int(210 * (1 - ph) ** 1.2), blur=4))
    _dust(c, t, 30, col="#FFD9A0", y0=900, y1=1600)

def camp(c, t, sky="day"):
    """Campamento militar en el desierto (Oriente Medio): tiendas, camiones, bandera, calor."""
    night = sky == "night"
    if night:
        c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, ["#0B1030", "#2E2550", "#6A3E5E"]))
        rnd = random.Random(8)
        for i in range(80): c.drawCircle(rnd.uniform(0, W), rnd.uniform(0, 800), rnd.uniform(1.5, 3), P("#FFFFFF", a=int(120 + 100 * math.sin(t * 2 + i))))
    else:
        c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, ["#4FA3E0", "#BFE3F2", "#FFE7B5"], [0, 0.6, 1]))
        _sun(c, 880, 330, 90, "#FFF0A8", "#FFF6CF")
    for (pts, col) in [([(0, 1180), (300, 1080), (620, 1150), (900, 1060), (1080, 1120), (1080, 1400), (0, 1400)], "#D9A76A" if not night else "#4A3450"),
                       ([(0, 1260), (400, 1180), (800, 1260), (1080, 1200), (1080, 1400), (0, 1400)], "#E8BE84" if not night else "#3A2840")]:
        c.drawPath(poly(pts), P(col))
    c.drawRect(skia.Rect.MakeLTRB(0, 1380, W, H), lin_grad(0, 1380, 0, H, ["#E3B57A", "#B8864E"] if not night else ["#3A2A3A", "#1E1622"]))
    # tiendas
    for (tx, ty, s) in [(150, 1300, 1.0), (880, 1290, 0.9), (520, 1250, 0.7)]:
        c.save(); c.translate(tx, ty); c.scale(s, s)
        tent = poly([(-170, 90), (0, -110), (170, 90)])
        hard(c, tent, "#9A9460" if not night else "#4A4838", w=9)
        fs(c, poly([(-40, 90), (0, -10), (40, 90)]), "#3A3020", ow=5)
        if night: c.drawPath(poly([(-40, 90), (0, -10), (40, 90)]), P("#FFB347", a=int(140 + 60 * math.sin(t * 6))))
        c.restore()
    # mástil con bandera polaca ondeando
    c.drawLine(700, 1330, 700, 900, P(INK, stroke=10)); c.drawLine(700, 1330, 700, 900, P("#C8C8C8", stroke=5))
    for half, col in ((0, "#FFFFFF"), (1, "#D7263D")):
        f = skia.Path(); n = 12
        top = [(700 + i * 16, 910 + half * 50 + math.sin(t * 6 - i * 0.6) * 8 * i / n) for i in range(n + 1)]
        bot = [(700 + i * 16, 960 + half * 50 + math.sin(t * 6 - i * 0.6) * 8 * i / n) for i in range(n, -1, -1)]
        c.drawPath(poly(top + bot), P(col))
    flag = poly([(700 + i * 16, 910 + math.sin(t * 6 - i * 0.6) * 8 * i / 12) for i in range(13)] +
                [(700 + i * 16, 1010 + math.sin(t * 6 - i * 0.6) * 8 * i / 12) for i in range(12, -1, -1)])
    c.drawPath(flag, P(INK, stroke=5))
    # camión militar
    tx = 60
    hard(c, rrect(tx, 1440, tx + 330, 1560, 10), "#5F6B3A", w=9)
    hard(c, rrect(tx + 330, 1470, tx + 450, 1560, 14), "#6E7A45", w=9)
    fs(c, rrect(tx + 350, 1485, tx + 420, 1525, 6), "#A9D8F0", ow=5)
    text_c(c, "22", tx + 160, 1520, 54, fill="#F3E7B8", stroke=INK, sw=6)
    for wx in (tx + 80, tx + 370): fs(c, oval(wx, 1570, 40, 40), "#222222", ow=7); c.drawCircle(wx, 1570, 14, P("#888888"))
    if not night:   # calima
        for k in range(6):
            yy = 1150 + k * 30
            p = skia.Path(); p.moveTo(0, yy)
            for xx in range(0, W + 40, 40): p.lineTo(xx, yy + math.sin(xx * 0.02 + t * 4 + k) * 4)
            c.drawPath(p, P("#FFFFFF", stroke=3, a=40))
    _dust(c, t, 25, seed=11, col="#FFF0C8" if not night else "#FFD08A", y0=1000, y1=1800)

def troopship(c, t, sky="day"):
    """Puerto de Alejandría (Egipto), 1944: barco británico de tropas, pasarela y cartel de prohibido."""
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1200, ["#2F7FC4", "#9ED2EE", "#FFE9C2"], [0, 0.65, 1]))
    _sun(c, 200, 300, 80, "#FFF4C2", "#FFF8DA")
    for (cx, cy, sc, sp) in [(300, 220, 1.0, 12), (800, 400, 0.8, 8)]: cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc)
    for k in range(5):   # gaviotas
        gx = (k * 230 + t * 60) % (W + 100) - 50; gy = 520 + math.sin(t * 2 + k) * 40 + k * 30
        f = 18 * math.sin(t * 9 + k)
        g = skia.Path(); g.moveTo(gx - 26, gy - f); g.quadTo(gx - 12, gy - 14, gx, gy); g.quadTo(gx + 12, gy - 14, gx + 26, gy - f)
        c.drawPath(g, P(INK, stroke=5))
    c.drawRect(skia.Rect.MakeLTRB(0, 1150, W, 1500), lin_grad(0, 1150, 0, 1500, ["#2B6E9E", "#174A72"]))
    for k in range(10):
        yy = 1180 + k * 32
        p = skia.Path(); p.moveTo(0, yy)
        for xx in range(0, W + 30, 30): p.lineTo(xx, yy + math.sin(xx * 0.03 + t * 3 + k) * 5)
        c.drawPath(p, P("#FFFFFF", stroke=3, a=60))
    # barco gris de tropas
    sy = 1180 + math.sin(t * 1.2) * 6
    hull = poly([(220, sy - 40), (1080, sy - 70), (1080, sy + 150), (300, sy + 150)])
    hard(c, hull, "#6E7680", w=10)
    for k in range(9): fs(c, oval(360 + k * 75, sy + 30, 14, 14), "#2A2E36", ow=4)
    hard(c, rrect(480, sy - 230, 900, sy - 50, 8), "#8A929C", w=9)
    for k in range(5): fs(c, rrect(510 + k * 76, sy - 200, 560 + k * 76, sy - 160, 6), "#FFE7A0", ow=4)
    hard(c, rrect(640, sy - 380, 740, sy - 230, 8), "#3A3E46", w=9)
    c.drawRect(skia.Rect.MakeLTRB(640, sy - 350, 740, sy - 320), P("#B3262A"))
    for k in range(6):
        ph = (t * 0.45 + k / 6) % 1
        c.drawCircle(690 - ph * 260, sy - 400 - ph * 420, 35 + 90 * ph, P("#3B3B44", a=int(170 * (1 - ph)), blur=6))
    # muelle y pasarela
    c.drawRect(skia.Rect.MakeLTRB(0, 1480, W, H), lin_grad(0, 1480, 0, H, ["#A88B62", "#6E5638"]))
    for k in range(12): c.drawLine(k * 95, 1480, k * 95 - 40, H, P("#5E4A30", stroke=4))
    c.drawPath(poly([(330, 1480), (420, 1480), (560, sy - 40), (520, sy - 40)]), P("#7A5A3A"))
    c.drawPath(poly([(330, 1480), (420, 1480), (560, sy - 40), (520, sy - 40)]), P(INK, stroke=6))
    # cartel de prohibido
    c.save(); c.translate(900, 1560); c.rotate(math.sin(t * 2) * 2)
    c.drawLine(0, 0, 0, 260, P(INK, stroke=14))
    hard(c, rrect(-150, -150, 150, 30, 12), "#F6ECD2", w=9)
    text_c(c, "NO SE ADMITEN", 0, -100, 30, fill="#B3262A", stroke=None)
    text_c(c, "ANIMALES", 0, -55, 44, fill="#B3262A")
    c.drawCircle(0, -10, 0, P(INK))
    c.restore()

def cassino(c, t, sky="night"):
    """Montecassino (Italia), mayo de 1944: monte con la abadía en ruinas, explosiones, trazadoras y humo."""
    dusk = sky in ("sunset", "dawn")
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1400, ["#1A0F1E", "#5A2430", "#C2503A", "#F09A4A"] if dusk else ["#07060E", "#1E1530", "#4A2236"], [0, 0.4, 0.75, 1] if dusk else [0, 0.6, 1]))
    # resplandor de incendios
    c.drawCircle(540, 900, 700, rad_grad(540, 900, 700, [C("#FF6A2A", 90), C("#FF6A2A", 0)]))
    # el monte
    mt = poly([(0, 1300), (160, 1120), (300, 900), (430, 720), (650, 700), (780, 860), (930, 1000), (1080, 1100), (1080, 1500), (0, 1500)])
    hard(c, mt, "#3A2E36", w=10)
    c.drawPath(poly([(300, 900), (430, 720), (520, 760), (420, 920)]), P("#544250"))
    # abadía en ruinas en la cima
    ab = 460
    for (l, tp, r) in [(ab, 560, ab + 60), (ab + 70, 600, ab + 150), (ab + 160, 540, ab + 200), (ab + 210, 620, ab + 260)]:
        jag = poly([(l, 720), (l, tp + 20), (l + (r - l) * 0.3, tp), (l + (r - l) * 0.5, tp + 30), (l + (r - l) * 0.8, tp - 10), (r, tp + 25), (r, 720)])
        hard(c, jag, "#B8A48A", w=8)
        for k in range(2): fs(c, rrect(l + 12 + k * 22, tp + 60, l + 26 + k * 22, tp + 100, 6), "#1A1218", ow=0)
    for k in range(5):   # humo que sube de la abadía
        ph = (t * 0.35 + k / 5) % 1
        c.drawCircle(560 + math.sin(k * 2 + t) * 40 + ph * 120, 560 - ph * 520, 50 + 120 * ph, P("#2A2228", a=int(190 * (1 - ph)), blur=8))
    # explosiones en la ladera
    rnd = random.Random(19)
    for k in range(7):
        per = rnd.uniform(1.3, 2.2); off = rnd.uniform(0, per); ph = ((t + off) % per) / per
        ex, ey = rnd.uniform(80, 1000), rnd.uniform(800, 1250)
        if ph < 0.35:
            q = ph / 0.35
            c.drawCircle(ex, ey, 60 + 200 * q, _add(P("#FFB347", a=int(220 * (1 - q)))))
            c.drawCircle(ex, ey, 30 + 120 * q, _add(P("#FFF1B8", a=int(255 * (1 - q)))))
            for j in range(8):
                a = j * 0.785 + k; d = 80 + 260 * q
                c.drawLine(ex + math.cos(a) * d * 0.6, ey + math.sin(a) * d * 0.6, ex + math.cos(a) * d, ey + math.sin(a) * d, _add(P("#FFD27A", stroke=5, a=int(255 * (1 - q)))))
        else:
            q = (ph - 0.35) / 0.65
            c.drawCircle(ex + q * 30, ey - q * 160, 70 + 110 * q, P("#2A2026", a=int(150 * (1 - q)), blur=6))
    # trazadoras
    for k in range(6):
        ph = (t * 1.3 + k / 6) % 1
        x0, y0 = 100 + k * 160, 1500; x1, y1 = 400 + k * 60, 750
        xa, ya = x0 + (x1 - x0) * ph, y0 + (y1 - y0) * ph
        c.drawLine(xa, ya, xa - (x1 - x0) * 0.06, ya - (y1 - y0) * 0.06, _add(P("#FF7A3A", stroke=6, a=220)))
    # trincheras con sacos terreros y alambre
    c.drawRect(skia.Rect.MakeLTRB(0, 1480, W, H), lin_grad(0, 1480, 0, H, ["#2A2024", "#120C10"]))
    for row in range(2):
        for k in range(12):
            x = -20 + k * 98 + row * 49
            fs(c, rrect(x, 1500 - row * 42, x + 96, 1544 - row * 42, 20), "#6B5E43" if (k + row) % 2 else "#5C5038", ow=5, outline=INK)
    wire = skia.Path(); wire.moveTo(0, 1420)
    for xx in range(0, W + 40, 40): wire.lineTo(xx, 1420 + (12 if (xx // 40) % 2 else -12))
    c.drawPath(wire, P("#9A9AA2", stroke=3))
    # chispas y ceniza
    _dust(c, t, 40, seed=5, col="#FFB060", y0=200, y1=1800, sp=25)
    fl = 0.5 + 0.5 * math.sin(t * 9) * math.sin(t * 3.7)
    c.drawRect(skia.Rect.MakeWH(W, H), _add(P("#FF8A3D", a=int(30 * fl))))

def zoo(c, t, sky="day"):
    """Zoo de Edimburgo (Escocia): recinto con rocas y agua, castillo en la colina, lluvia fina y visitantes."""
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, ["#5E6E80", "#9AAAB8", "#D6DDE2"]))
    for (cx, cy, sc, sp) in [(200, 260, 1.4, 10), (700, 180, 1.2, 7), (980, 420, 1.0, 12)]:
        cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc, a=200)
    # colina con castillo
    c.drawPath(poly([(0, 1000), (200, 900), (420, 780), (640, 800), (850, 880), (1080, 940), (1080, 1300), (0, 1300)]), P("#4E5E52"))
    cx0 = 380
    for (l, tp, r) in [(cx0, 640, cx0 + 260), (cx0 + 40, 580, cx0 + 110), (cx0 + 170, 600, cx0 + 230)]:
        c.drawRect(skia.Rect.MakeLTRB(l, tp, r, 800), P("#5E6268"))
        for k in range(int((r - l) / 24)):
            if k % 2 == 0: c.drawRect(skia.Rect.MakeLTRB(l + k * 24, tp - 18, l + k * 24 + 16, tp), P("#5E6268"))
    c.drawLine(cx0 + 75, 580, cx0 + 75, 520, P("#3A3E44", stroke=4))
    c.drawPath(poly([(cx0 + 75, 520), (cx0 + 75 + 40 + 6 * math.sin(t * 5), 530), (cx0 + 75, 545)]), P("#1F4AA8"))
    # árboles
    for (px, ps) in [(80, 1.3), (1000, 1.2), (900, 0.9)]:
        from backgrounds import pine
        pine(c, px, 1200, ps, "#2F5A3E", "#24483A")
    # recinto: foso, rocas, piscina
    c.drawRect(skia.Rect.MakeLTRB(0, 1250, W, H), lin_grad(0, 1250, 0, H, ["#8A8A70", "#5E5E48"]))
    for (rx, ry, rw, rh) in [(120, 1330, 170, 90), (860, 1300, 200, 120), (980, 1420, 140, 80)]:
        hard(c, oval(rx, ry, rw, rh), "#8E8A84", w=9)
    pool = oval(560, 1700, 300, 80); hard(c, pool, "#4F8FB0", w=8)
    for k in range(3):
        ph = (t * 0.6 + k / 3) % 1
        c.drawOval(skia.Rect.MakeLTRB(560 - 280 * ph, 1700 - 70 * ph, 560 + 280 * ph, 1700 + 70 * ph), P("#FFFFFF", stroke=3, a=int(120 * (1 - ph))))
    # valla
    c.drawRect(skia.Rect.MakeLTRB(0, 1225, W, 1240), P("#3A3A3E"))
    for k in range(23): c.drawLine(k * 50, 1120, k * 50, 1240, P("#3A3A3E", stroke=6))
    c.drawRect(skia.Rect.MakeLTRB(0, 1120, W, 1132), P("#3A3A3E"))
    # cartel del zoo
    hard(c, rrect(60, 1020, 360, 1110, 10), "#2F5D50", w=8)
    text_c(c, "EDINBURGH ZOO", 210, 1078, 32, fill="#F3E7B8")
    # lluvia
    rnd = random.Random(9)
    for i in range(110):
        x = (rnd.uniform(0, W + 200) - t * 120) % (W + 200) - 100
        y = (rnd.uniform(0, H) + t * 1500 * rnd.uniform(0.8, 1.2)) % H
        c.drawLine(x, y, x - 6, y + 34, P("#E6EEF4", stroke=2.5, a=130))

WOJTEK = {"hamadan": hamadan, "camp": camp, "troopship": troopship, "cassino": cassino, "zoo": zoo}

def paybook(c, lines, T):
    """Cartilla militar del soldado Wojtek (objeto para reveal)."""
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-250, -330, 270, 350), 18, 18), P("#000000", a=110, blur=12))
    hard(c, rrect(-260, -340, 260, 340, 18), "#5F6B3A", w=10)
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-225, -305, 225, 305), 10, 10), P("#D8B04A", stroke=6))
    # águila estilizada (original, simple)
    fs(c, oval(0, -190, 60, 60), "#F6ECD2", ow=6, outline=INK)
    c.drawPath(poly([(-48, -195), (0, -230), (48, -195), (20, -170), (0, -150), (-20, -170)]), P("#B3262A"))
    text_c(c, "SOLDBUCH", 0, -90, 34, fill="#F6ECD2", path=FONT_SERIF) if False else text_c(c, "CARTILLA MILITAR", 0, -90, 34, fill="#F6ECD2", path=FONT_SERIF)
    y0 = -10
    for ln in (lines or [])[:4]:
        text_c(c, ln, 0, y0, 50 if y0 < 60 else 40, fill="#FFD23F", stroke=INK, sw=6); y0 += 72
    # sello
    c.save(); c.translate(150, 262); c.rotate(-18)
    a = int(220 * clamp(T % 100))
    c.drawCircle(0, 0, 80, P("#B3262A", stroke=8, a=230)); c.drawCircle(0, 0, 62, P("#B3262A", stroke=3, a=230))
    text_c(c, "ALISTADO", 0, 12, 26, fill="#B3262A")
    c.restore()

def emblem(c, lines, T):
    """Escudo de la 22.ª Compañía: un oso que lleva un proyectil (dibujo original)."""
    c.drawCircle(0, 0, 420, rad_grad(0, 0, 430, [C("#FFE27A", 140), C("#FFE27A", 0)]))
    badge = skia.Path(); badge.moveTo(-260, -300); badge.lineTo(260, -300); badge.lineTo(260, 60); badge.quadTo(260, 260, 0, 340); badge.quadTo(-260, 260, -260, 60); badge.close()
    c.drawPath(badge, P("#000000", a=110, blur=12))
    hard(c, badge, "#F6ECD2", w=12)
    inner = skia.Path(); inner.moveTo(-220, -260); inner.lineTo(220, -260); inner.lineTo(220, 50); inner.quadTo(220, 220, 0, 290); inner.quadTo(-220, 220, -220, 50); inner.close()
    c.drawPath(inner, P("#B3262A", stroke=8))
    c.save(); c.translate(-10, 250); c.scale(0.5, 0.5)
    bear(c, 0, 0, 1.0, T * 0.6, pose="carry", mood="happy", walk=True)
    c.restore()
    if lines:
        fs(c, rrect(-300, 330, 300, 420, 20), "#FFD23F", ow=7)
        text_c(c, lines[0], 0, 393, 46, fill="#2A1B12")
