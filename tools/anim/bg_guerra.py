"""Fondos de guerra (episodio 013, Batalla de Los Ángeles 1942):
la_raid (ciudad a oscuras con reflectores y antiaéreos), aa_battery (cañón antiaéreo disparando),
submarine (submarino en la costa al atardecer) y balloon (globo meteorológico con bengala).
Todo dibujado a mano, original."""
import math, random
import skia
from engine import *

def _add(paint):
    paint.setBlendMode(skia.BlendMode.kPlus); return paint

def _grad_beam(c, x0, y0, ang, length, w0, w1, col="#FFF4C8", a=110):
    """Haz de reflector: trapecio con degradado que se apaga a lo lejos + núcleo brillante."""
    dx, dy = math.sin(ang), -math.cos(ang)
    px, py = -dy, dx
    x1, y1 = x0 + dx * length, y0 + dy * length
    p = poly([(x0 + px * w0, y0 + py * w0), (x1 + px * w1, y1 + py * w1), (x1 - px * w1, y1 - py * w1), (x0 - px * w0, y0 - py * w0)])
    paint = skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeLinear(
        [skia.Point(x0, y0), skia.Point(x1, y1)], [C(col, a), C(col, int(a * 0.35)), C(col, 0)], [0, 0.6, 1]))
    c.drawPath(p, _add(paint))
    core = poly([(x0 + px * w0 * 0.3, y0 + py * w0 * 0.3), (x1 + px * w1 * 0.25, y1 + py * w1 * 0.25),
                 (x1 - px * w1 * 0.25, y1 - py * w1 * 0.25), (x0 - px * w0 * 0.3, y0 - py * w0 * 0.3)])
    paint2 = skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeLinear(
        [skia.Point(x0, y0), skia.Point(x1, y1)], [C("#FFFFFF", int(a * 0.9)), C("#FFFFFF", 0)]))
    c.drawPath(core, _add(paint2))
    c.drawCircle(x0, y0, w0 * 2.2, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
        skia.Point(x0, y0), w0 * 2.2, [C("#FFFFFF", 200), C(col, 0)]))))
    return x1, y1

def flak(c, t, n=12, seed=7, x0=60, x1=1020, y0=120, y1=760, period=1.7, size=1.0):
    """Explosiones antiaéreas: destello naranja, chispas y bola de humo que se expande y se va."""
    total_flash = 0.0
    for i in range(n):
        ph = t / period + i * 0.6180339 * 3.7
        cyc = int(math.floor(ph)); p = ph - cyc
        rnd = random.Random(seed * 1000 + i * 97 + cyc * 13)
        x = rnd.uniform(x0, x1); y = rnd.uniform(y0, y1); s = rnd.uniform(0.7, 1.25) * size
        x += p * 40 * (rnd.random() - 0.5)
        # humo (tras el destello)
        if p > 0.08:
            q = (p - 0.08) / 0.92
            for k in range(6):
                a = k * 1.047 + rnd.random()
                r = (30 + 55 * q) * s
                sx, sy = x + math.cos(a) * r * 0.55, y + math.sin(a) * r * 0.45 + q * 30
                c.drawCircle(sx, sy, r * 0.75, P("#2B2730", a=int(170 * (1 - q) ** 1.3)))
            c.drawCircle(x, y + q * 25, (40 + 60 * q) * s, P("#3A3440", a=int(120 * (1 - q) ** 1.5), blur=6))
        # destello
        if p < 0.22:
            f = 1 - p / 0.22
            total_flash = max(total_flash, f * s)
            r = (40 + 130 * (1 - f)) * s
            c.drawCircle(x, y, r * 2.6, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
                skia.Point(x, y), r * 2.6, [C("#FFB347", int(190 * f)), C("#FF5A1F", int(80 * f)), C("#FF5A1F", 0)], [0, 0.4, 1]))))
            c.drawCircle(x, y, r * 0.55, _add(P("#FFF6D0", a=int(255 * f))))
            for k in range(10):   # chispas de metralla
                a = k * 0.628 + cyc
                L = (60 + 150 * (1 - f)) * s
                c.drawLine(x + math.cos(a) * L * 0.4, y + math.sin(a) * L * 0.4, x + math.cos(a) * L, y + math.sin(a) * L,
                           _add(P("#FFD27A", stroke=4 * s, a=int(230 * f))))
    return total_flash

def tracers(c, t, origins, seed=3, n=5):
    for (ox, oy, ang) in origins:
        for k in range(n):
            ph = (t * 1.8 + k / n + ox * 0.001) % 1
            d = 200 + ph * 1300
            a = ang + math.sin(t * 0.9 + ox) * 0.12
            x, y = ox + math.sin(a) * d, oy - math.cos(a) * d
            x2, y2 = ox + math.sin(a) * (d - 90), oy - math.cos(a) * (d - 90)
            c.drawLine(x2, y2, x, y, _add(P("#FFC86B", stroke=6, a=int(220 * (1 - ph)))))
            c.drawCircle(x, y, 7, _add(P("#FFF2C0", a=int(255 * (1 - ph)))))

def _palm_sil(c, x, y, s, t, col="#07060C"):
    c.save(); c.translate(x, y); c.scale(s, s)
    sway = math.sin(t * 1.3 + x) * 4
    p = skia.Path(); p.moveTo(-10, 0); p.cubicTo(-6, -200, 10 + sway, -380, 18 + sway, -560); p.lineTo(30 + sway, -560)
    p.cubicTo(22 + sway, -380, 8, -200, 12, 0); p.close(); c.drawPath(p, P(col))
    hx, hy = 24 + sway, -560
    for k in range(8):
        a = -3.0 + k * 0.78 + math.sin(t * 1.7 + k) * 0.06
        L = 170 + (k % 3) * 30
        f = skia.Path(); f.moveTo(hx, hy)
        mx, my = hx + math.cos(a) * L * 0.5, hy + math.sin(a) * L * 0.5 - 40
        ex, ey = hx + math.cos(a) * L, hy + math.sin(a) * L + 50
        f.quadTo(mx, my - 18, ex, ey); f.quadTo(mx, my + 18, hx, hy + 6); c.drawPath(f, P(col))
    c.restore()

def _skyline(c, t, base=1480, lit=0.0, col="#0B0A14", seed=12):
    """Siluetas de Los Ángeles a oscuras (con la torre del Ayuntamiento en el centro)."""
    rnd = random.Random(seed)
    x = -30
    while x < W + 40:
        w = rnd.randint(90, 170); h = rnd.randint(160, 420)
        if 430 < x < 650: x = 650; continue
        c.drawRect(skia.Rect.MakeLTRB(x, base - h, x + w, base + 10), P(col))
        if rnd.random() < 0.5:   # depósito de agua en la azotea
            c.drawRect(skia.Rect.MakeLTRB(x + w * 0.3, base - h - 50, x + w * 0.3 + 40, base - h - 10), P(col))
            c.drawLine(x + w * 0.3 + 6, base - h - 10, x + w * 0.3 + 2, base - h, P(col, stroke=4))
        for wy in range(int(base - h + 26), base - 20, 46):   # ventanas apagadas (reflejos de los fogonazos)
            for wx in range(int(x + 14), int(x + w - 18), 30):
                if (wx * 3 + wy) % 5 == 0: continue
                c.drawRect(skia.Rect.MakeLTRB(wx, wy, wx + 14, wy + 22), P("#2A2446", a=int(90 + 140 * lit)))
        x += w + rnd.randint(0, 12)
    # Ayuntamiento de Los Ángeles (1928): torre escalonada con pirámide
    cx = 540; o = base - 1480
    if o > 200: return
    for (hw, top) in [(105, 1090), (80, 1090), (62, 900), (48, 780), (36, 700)]:
        c.drawRect(skia.Rect.MakeLTRB(cx - hw, top + o, cx + hw, base + 10), P(col))
    c.drawPath(poly([(cx - 36, 700 + o), (cx + 36, 700 + o), (cx, 560 + o)]), P(col))
    c.drawLine(cx, 560 + o, cx, 500 + o, P(col, stroke=6))
    c.drawCircle(cx, 498 + o, 7, P("#FF3B30", a=int(140 + 115 * math.sin(t * 5))))
    for wy in range(1110 + o, 1460 + o, 40):
        for wx in (cx - 60, cx - 25, cx + 10, cx + 45):
            c.drawRect(skia.Rect.MakeLTRB(wx, wy, wx + 14, wy + 22), P("#2A2446", a=int(90 + 140 * lit)))

def la_raid(c, t, sky="night"):
    dawn = sky in ("dawn", "sunset", "day")
    if dawn:
        c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1500, ["#2B2F5C", "#C9637A", "#FFB27A"], [0, 0.6, 1]))
        c.drawCircle(820, 1420, 300, rad_grad(820, 1420, 420, [C("#FFE3A0", 200), C("#FFE3A0", 0)]))
        for i in range(9):   # restos de humo flotando al amanecer
            rnd = random.Random(i * 7)
            x = (rnd.uniform(0, W) + t * 12) % (W + 300) - 150; y = rnd.uniform(200, 900)
            c.drawCircle(x, y, rnd.uniform(60, 120), P("#5A4A5E", a=70, blur=12))
        _skyline(c, t, lit=0.2, col="#1E1830")
        for (px, ps) in [(70, 1.0), (980, 1.1), (300, 0.8), (800, 0.75)]: _palm_sil(c, px, 1500, ps, t, "#1A1428")
    else:
        c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1500, ["#05060F", "#121233", "#2A1E3E"], [0, 0.55, 1]))
        rnd = random.Random(5)
        for i in range(70):
            x, y = rnd.uniform(0, W), rnd.uniform(0, 700)
            c.drawCircle(x, y, rnd.uniform(1.2, 2.8), P("#FFFFFF", a=int(90 + 80 * math.sin(t * 2 + i))))
        # nubes bajas iluminadas desde abajo
        for (cx, cy, sc, sp) in [(150, 560, 1.6, 10), (760, 430, 1.9, 7), (420, 900, 1.4, 13)]:
            x = (cx + t * sp) % (W + 500) - 250
            c.save(); c.translate(x, cy); c.scale(sc, sc)
            pth = skia.Path()
            for (px, py, r) in [(-80, 10, 50), (-25, -20, 66), (45, -5, 56), (100, 15, 42), (10, 22, 52)]: pth.addCircle(px, py, r)
            c.drawPath(pth, P("#1D1836", a=230)); c.restore()
        # reflectores que barren el cielo y se cruzan
        bases = [(60, 1470), (250, 1490), (430, 1470), (690, 1480), (880, 1495), (1040, 1470)]
        for k, (bx, by) in enumerate(bases):
            ang = math.sin(t * (0.45 + 0.13 * k) + k * 1.9) * 0.55 + (0.25 if bx < 540 else -0.25)
            _grad_beam(c, bx, by, ang, 1700, 14, 120, a=95)
        fl = flak(c, t, n=14, seed=7, y0=140, y1=900)
        tracers(c, t, [(150, 1490, 0.35), (960, 1490, -0.3), (600, 1495, 0.05)])
        _skyline(c, t, lit=min(1, fl))
        for (px, ps) in [(70, 1.0), (980, 1.1), (300, 0.8), (800, 0.75)]: _palm_sil(c, px, 1500, ps, t)
        if fl > 0: c.drawRect(skia.Rect.MakeWH(W, H), _add(P("#FF9A3D", a=int(38 * min(1, fl)))))
        # metralla que cae
        for i in range(26):
            rnd2 = random.Random(i * 31)
            x = rnd2.uniform(0, W) + math.sin(t + i) * 20; y = (rnd2.uniform(0, 1500) + t * (260 + i * 9)) % 1500
            c.drawLine(x, y, x - 3, y + 18, _add(P("#FFB45A", stroke=3, a=150)))
    # calle con sacos terreros y farolas apagadas
    c.drawRect(skia.Rect.MakeLTRB(0, 1480, W, H), lin_grad(0, 1480, 0, H, ["#17151F", "#08070C"]))
    for k in range(7):
        xx = (k * 200 - t * 40) % (W + 200) - 100
        c.drawRect(skia.Rect.MakeLTRB(xx, 1700, xx + 100, 1710), P("#4A4630", a=160))
    for row in range(2):
        for k in range(12):
            x = -20 + k * 98 + (row * 49)
            fs(c, rrect(x, 1560 - row * 42, x + 96, 1604 - row * 42, 20), "#6B5E43" if (k + row) % 2 else "#5C5038", ow=5, outline="#0E0B0C")
            c.drawLine(x + 30, 1566 - row * 42, x + 30, 1598 - row * 42, P("#3E3526", stroke=3))

def aa_battery(c, t, sky="night"):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#06070F", "#1A1636", "#2C1F33"], [0, 0.5, 1]))
    fl = flak(c, t, n=9, seed=21, y0=120, y1=620, size=1.15)
    _grad_beam(c, 140, 1350, 0.42 + math.sin(t * 0.7) * 0.2, 1700, 26, 170, a=120)
    _grad_beam(c, 980, 1420, -0.5 + math.sin(t * 0.55 + 1) * 0.18, 1700, 18, 130, a=90)
    # reflector (tambor) a la izquierda
    c.save(); c.translate(140, 1350); c.rotate(math.degrees(0.42 + math.sin(t * 0.7) * 0.2))
    fs(c, rrect(-70, -60, 70, 80, 18), "#3C4636", ow=8, outline="#0E0B0C")
    fs(c, oval(0, -60, 70, 22), "#FFF6D6", ow=6, outline="#0E0B0C")
    c.restore()
    fs(c, poly([(90, 1480), (190, 1480), (170, 1400), (110, 1400)]), "#2E3628", ow=7, outline="#0E0B0C")
    # cañón antiaéreo de 3 pulgadas (derecha), retroceso periódico
    per = 0.85; ph = (t % per) / per
    recoil = (1 - ph / 0.15) * 70 if ph < 0.15 else max(0, (1 - (ph - 0.15) / 0.5)) * 20
    ang = -62 + math.sin(t * 0.6) * 4
    gx, gy = 600, 1400
    c.save(); c.translate(gx, gy); c.rotate(ang)
    fs(c, rrect(-150 + recoil, -34, 150 + recoil, 34, 12), "#4D5A3E", ow=9, outline="#0E0B0C")   # recuperador
    fs(c, rrect(100 + recoil * 0.0 - recoil, -20, 760 - recoil, 20, 8), "#5E6B4A", ow=9, outline="#0E0B0C")   # tubo
    for k in range(5): c.drawLine(180 + k * 110 - recoil, -20, 180 + k * 110 - recoil, 20, P("#3A4430", stroke=4))
    fs(c, rrect(740 - recoil, -27, 790 - recoil, 27, 6), "#3C4632", ow=7, outline="#0E0B0C")   # freno de boca
    c.drawRect(skia.Rect.MakeLTRB(-150 + recoil, -34, 150 + recoil, -18), P("#8A9A6A", a=120))
    if ph < 0.14:   # fogonazo
        f = 1 - ph / 0.14; mx = 800 - recoil
        c.drawCircle(mx + 110, 0, 260 * f + 60, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
            skia.Point(mx + 110, 0), 260 * f + 60, [C("#FFF6D0", int(255 * f)), C("#FF8A1F", int(170 * f)), C("#FF5A1F", 0)], [0, 0.35, 1]))))
        star = []
        for k in range(16):
            r = (330 if k % 2 == 0 else 90) * (0.6 + 0.4 * f)
            a = k * math.pi / 8
            star.append((mx + 60 + math.cos(a) * r * (1.4 if abs(math.cos(a)) > 0.7 else 0.7), math.sin(a) * r * 0.6))
        c.drawPath(poly(star), _add(P("#FFE08A", a=int(230 * f))))
    for k in range(4):   # humo del disparo que sube
        q = ((t / per) - k * 0.25) % 1
        c.drawCircle(1000 + q * 120, -60 - q * 160, 60 + q * 110, P("#4A4450", a=int(130 * (1 - q)), blur=8))
    c.restore()
    # montaje y ruedas
    fs(c, poly([(470, 1400), (730, 1400), (790, 1600), (410, 1600)]), "#3E4A32", ow=9, outline="#0E0B0C")
    fs(c, oval(600, 1400, 70, 70), "#4D5A3E", ow=9, outline="#0E0B0C")
    fs(c, oval(600, 1400, 26, 26), "#2A3222", ow=6, outline="#0E0B0C")
    c.drawRect(skia.Rect.MakeLTRB(420, 1420, 780, 1440), P("#8A9A6A", a=80))
    # casquillos de latón saltando
    for k in range(3):
        q = ((t / per) - k * 0.33) % 1
        x = 460 - q * 260; y = 1360 - math.sin(q * math.pi) * 260 + q * 200
        c.save(); c.translate(x, y); c.rotate(q * 900 + k * 40)
        fs(c, rrect(-12, -34, 12, 34, 5), "#E2B54A", ow=4, outline="#0E0B0C"); c.restore()
    # cajas de munición y sacos terreros en primer plano
    for (bx, by) in [(40, 1600), (150, 1630)]:
        fs(c, rrect(bx, by, bx + 120, by + 80, 6), "#4F5A36", ow=6, outline="#0E0B0C")
        text_c(c, "AA", bx + 60, by + 54, 34, fill="#E8D9A0")
    for row in range(3):
        for k in range(12):
            x = -30 + k * 100 + (row % 2) * 50
            y = 1700 - row * 46
            fs(c, rrect(x, y, x + 98, y + 48, 22), "#7A6A48" if (k + row) % 2 else "#695B3D", ow=6, outline="#0E0B0C")
    c.drawRect(skia.Rect.MakeLTRB(0, 1790, W, H), P("#0E0B0C"))
    if fl > 0 or ph < 0.1:
        c.drawRect(skia.Rect.MakeWH(W, H), _add(P("#FF9A3D", a=int(40 * max(min(1, fl), 1 - ph / 0.1 if ph < 0.1 else 0)))))

def submarine(c, t, sky="sunset"):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1150, ["#2A2050", "#B4506A", "#FF9A55"], [0, 0.55, 1]))
    c.drawCircle(760, 1100, 150, rad_grad(760, 1100, 360, [C("#FFD98A", 230), C("#FFD98A", 0)]))
    fs(c, oval(760, 1110, 110, 110), "#FFC66B", ow=0)
    for (cx, cy, sc, sp) in [(200, 380, 1.5, 9), (850, 260, 1.2, 6), (520, 640, 1.0, 12)]:
        x = (cx + t * sp) % (W + 500) - 250
        c.save(); c.translate(x, cy); c.scale(sc, sc)
        pth = skia.Path()
        for (px, py, r) in [(-80, 10, 50), (-25, -20, 66), (45, -5, 56), (100, 15, 42)]: pth.addCircle(px, py, r)
        c.drawPath(pth, P("#7A3E62", a=200)); c.restore()
    # costa con depósitos de petróleo (izquierda)
    fs(c, poly([(0, 1050), (120, 1000), (300, 1030), (420, 1100), (420, 1150), (0, 1150)]), "#3A2A3A", ow=0)
    for (tx, tw) in [(40, 110), (180, 130)]:
        fs(c, rrect(tx, 960, tx + tw, 1060, 8), "#C9C2B8", ow=6, outline="#1A1218")
        c.drawLine(tx, 990, tx + tw, 990, P("#8A8278", stroke=4))
    for k in range(3):
        fs(c, rrect(320 + k * 26, 900 - k * 30, 334 + k * 26, 1060, 3), "#2A2030", ow=0)   # torres de la refinería
    # impacto en la costa
    per = 2.2; q = (t % per) / per
    if q < 0.3:
        f = 1 - q / 0.3
        c.drawCircle(260, 1000, 190 * (1 - f) + 60, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
            skia.Point(260, 1000), 190 * (1 - f) + 60, [C("#FFF2C0", int(255 * f)), C("#FF6A1F", int(170 * f)), C("#FF6A1F", 0)]))))
    for k in range(5):
        qq = (q + k * 0.2) % 1
        c.drawCircle(250 + qq * 60, 960 - qq * 380, 40 + qq * 90, P("#2A2028", a=int(150 * (1 - qq)), blur=6))
    # mar
    c.drawRect(skia.Rect.MakeLTRB(0, 1150, W, H), lin_grad(0, 1150, 0, H, ["#E07A55", "#5A2E5A", "#1A1236"], [0, 0.25, 1]))
    for k in range(40):
        y = 1170 + (k % 10) * 70 + (k // 10) * 18
        x = (k * 173 + t * (40 + (k % 5) * 15)) % (W + 200) - 100
        c.drawLine(x, y, x + 70 + (k % 4) * 30, y, P("#FFC38A", stroke=3, a=int(130 - (y - 1170) / 8)))
    # submarino I-17 emergido, cabeceando
    bob = math.sin(t * 1.4) * 10; tilt = math.sin(t * 1.1) * 1.5
    c.save(); c.translate(600, 1270 + bob); c.rotate(tilt)
    hull = skia.Path(); hull.moveTo(-430, 0); hull.cubicTo(-300, -60, 300, -70, 470, -10); hull.lineTo(430, 40); hull.lineTo(-400, 40); hull.close()
    fs(c, hull, lin_grad(0, -60, 0, 40, ["#4A4A58", "#24242E"]), ow=9, outline="#0E0B0C")
    fs(c, poly([(-120, -48), (-90, -170), (60, -170), (110, -55)]), "#3C3C4A", ow=8, outline="#0E0B0C")   # torreta
    c.drawLine(-40, -170, -50, -260, P("#0E0B0C", stroke=7)); c.drawLine(20, -170, 30, -235, P("#0E0B0C", stroke=6))
    text_c(c, "I-17", -15, -110, 40, fill="#E8E2D8")
    for k in range(10): c.drawCircle(-330 + k * 70, -20, 5, P("#15151C"))
    # cañón de cubierta que dispara hacia la costa (izquierda)
    gq = (t % per) / per
    rec = (1 - gq / 0.12) * 18 if gq < 0.12 else 0
    c.save(); c.translate(-260, -55); c.rotate(-168)
    fs(c, rrect(-10 + rec, -12, 170 + rec, 12, 5), "#2E2E38", ow=6, outline="#0E0B0C"); c.restore()
    fs(c, rrect(-300, -80, -220, -40, 8), "#3C3C4A", ow=6, outline="#0E0B0C")
    if gq < 0.1:
        f = 1 - gq / 0.1
        c.drawCircle(-450, -90, 120 * f + 30, _add(P("#FFD27A", a=int(230 * f), blur=10)))
    c.restore()
    # estela y espuma
    for k in range(8):
        x = 160 + k * 120 + math.sin(t * 3 + k) * 10
        c.drawOval(skia.Rect.MakeLTRB(x - 70, 1300 + bob, x + 70, 1325 + bob), P("#FFE6D0", a=110))

def balloon(c, t, sky="night"):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#04050C", "#141434", "#24183A"], [0, 0.6, 1]))
    rnd = random.Random(9)
    for i in range(110):
        x, y = rnd.uniform(0, W), rnd.uniform(0, 1400)
        c.drawCircle(x, y, rnd.uniform(1, 3), P("#FFFFFF", a=int(100 + 90 * math.sin(t * 2.3 + i))))
    bx = 560 + math.sin(t * 0.5) * 60; by = 520 + math.sin(t * 0.8) * 30
    # reflectores que convergen en el globo
    for k, (sx, sy) in enumerate([(80, 1900), (330, 1920), (760, 1920), (1010, 1900)]):
        ang = math.atan2(bx - sx, -(by - sy)) + math.sin(t * 1.3 + k) * 0.05
        _grad_beam(c, sx, sy, ang, 1700, 18, 140, a=85)
    flak(c, t, n=6, seed=33, x0=bx - 380, x1=bx + 380, y0=by - 300, y1=by + 300, size=0.8, period=2.1)
    # globo meteorológico
    c.drawCircle(bx, by, 260, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
        skia.Point(bx, by), 260, [C("#FFF6D8", 120), C("#FFF6D8", 0)]))))
    fs(c, oval(bx, by, 120, 132), rad_grad(bx - 40, by - 50, 200, [C("#FFFFFF"), C("#D8D4E6"), C("#8A86A0")], [0, 0.55, 1]), ow=7, outline="#0E0B0C")
    fs(c, poly([(bx - 16, by + 128), (bx + 16, by + 128), (bx + 8, by + 150), (bx - 8, by + 150)]), "#C9C5DA", ow=5, outline="#0E0B0C")
    sway = math.sin(t * 1.6) * 18
    st = skia.Path(); st.moveTo(bx, by + 150); st.quadTo(bx + sway, by + 260, bx - sway * 0.5, by + 360)
    c.drawPath(st, P("#E8E4F0", stroke=3))
    fx, fy = bx - sway * 0.5, by + 372
    fs(c, rrect(fx - 22, fy - 14, fx + 22, fy + 26, 6), "#8A7A5A", ow=4, outline="#0E0B0C")   # cajita de instrumentos
    fl = 0.7 + 0.3 * math.sin(t * 23) * math.sin(t * 7)   # bengala roja que parpadea
    c.drawCircle(fx, fy + 44, 150 * fl, _add(skia.Paint(AntiAlias=True, Shader=skia.GradientShader.MakeRadial(
        skia.Point(fx, fy + 44), 150 * fl + 1, [C("#FF4A3A", int(230 * fl)), C("#FF4A3A", 0)]))))
    c.drawCircle(fx, fy + 44, 14, _add(P("#FFE0D0")))
    for k in range(8):   # chispas de la bengala
        q = (t * 1.5 + k / 8) % 1
        c.drawCircle(fx + math.sin(k * 2.1) * 40 * q, fy + 50 + q * 160, 5 * (1 - q), _add(P("#FF7A4A", a=int(255 * (1 - q)))))
    # tejados y palmeras a contraluz abajo
    _skyline(c, t, base=1930, lit=0.1, col="#06050A", seed=40)
    for (px, ps) in [(90, 0.9), (1000, 1.0)]: _palm_sil(c, px, 1930, ps, t, "#06050A")

GUERRA = {"la_raid": la_raid, "aa_battery": aa_battery, "submarine": submarine, "balloon": balloon}
