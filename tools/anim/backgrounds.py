"""Fondos nuevos: montañas, bosque, cámara acorazada, biblioteca, ciudad de noche, oficina moderna y mar en tormenta."""
import math, random
import skia
from engine import *

def _sky(c, top, bottom, h=1300):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, h, [top, bottom]))

def _stars(c, t, n=80, maxy=900, seed=4):
    rnd = random.Random(seed)
    for i in range(n):
        x, y = rnd.uniform(0, W), rnd.uniform(0, maxy)
        a = int(140 + 110 * math.sin(t * 2 + i))
        c.drawCircle(x, y, rnd.uniform(1.5, 3.2), P("#FFFFFF", a=max(0, a)))

def _moon(c, x, y, r=70):
    c.drawCircle(x, y, r * 3, rad_grad(x, y, r * 3, [C("#FFF6D0", 110), C("#FFF6D0", 0)]))
    fs(c, oval(x, y, r, r), "#FFF3C4", ow=0)
    c.drawCircle(x - r * 0.35, y - r * 0.2, r * 0.18, P("#E6D9A8")); c.drawCircle(x + r * 0.3, y + r * 0.3, r * 0.13, P("#E6D9A8"))

def pine(c, x, y, s, col="#2F6B45", dark="#24543A", ow=6):
    c.save(); c.translate(x, y); c.scale(s, s)
    c.drawRect(skia.Rect.MakeLTRB(-14, -40, 14, 0), P("#5A3A22"))
    for k, (w, yy) in enumerate([(130, -40), (105, -120), (80, -195), (52, -260)]):
        tri = poly([(-w, yy), (w, yy), (0, yy - 120)])
        fs(c, tri, col if k % 2 == 0 else dark, ow=ow)
    c.restore()

# ------------------------------------------------------------------ montañas
def mountains(c, t, sky="day"):
    if sky == "night":
        _sky(c, "#0E1638", "#3B2C5E"); _stars(c, t); _moon(c, 820, 300)
    elif sky == "sunset":
        _sky(c, "#F08A5D", "#FFD9A0")
        c.drawCircle(780, 760, 140, P("#FFB347", a=230))
    else:
        _sky(c, "#5DB6EE", "#DFF3FF")
        c.drawCircle(200, 280, 220, rad_grad(200, 280, 230, [C("#FFF4C2", 220), C("#FFF4C2", 0)]))
        fs(c, oval(200, 280, 70, 70), "#FFE27A", ow=0)
        for (cx, cy, sc, sp) in [(260, 420, 0.9, 12), (760, 250, 0.7, 8)]:
            cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc)
    layers = [("#8FA7C9", "#FFFFFF", 760, [(0, 1100), (180, 640), (380, 980), (600, 560), (860, 960), (1080, 700)]),
              ("#5F7FA8", "#EEF5FF", 900, [(0, 1150), (260, 780), (520, 1150), (760, 820), (1080, 1100)]),
              ("#3E5E86", None, 1050, [(0, 1250), (300, 1000), (620, 1250), (900, 1040), (1080, 1180)])]
    for col, snow, base, pts in layers:
        p = poly([(0, H)] + pts + [(W, H)])
        fs(c, p, col, ow=5)
        if snow:
            for (x, y) in pts[1:-1]:
                if y < base:
                    cap = poly([(x - 70, y + 90), (x, y), (x + 70, y + 90), (x + 30, y + 70), (x, y + 95), (x - 30, y + 70)])
                    c.drawPath(cap, P(snow))
    c.drawRect(skia.Rect.MakeLTRB(0, 1350, W, H), lin_grad(0, 1350, 0, H, ["#6FAE58", "#3F7A35"]))
    hill = skia.Path(); hill.moveTo(0, 1380); hill.quadTo(540, 1290, W, 1380); hill.lineTo(W, 1420); hill.lineTo(0, 1420); hill.close()
    c.drawPath(hill, P("#6FAE58"))
    for (x, y, s) in [(70, 1420, 1.0), (180, 1450, 0.8), (930, 1430, 1.1), (1030, 1460, 0.85), (830, 1470, 0.7)]:
        pine(c, x, y, s)

# ------------------------------------------------------------------ bosque con niebla
def forest(c, t, sky="night"):
    if sky == "night":
        _sky(c, "#0B1530", "#24345A"); _stars(c, t, 60, 600); _moon(c, 800, 280, 80)
        cols = [("#1C3A3A", "#163030"), ("#16302E", "#112625"), ("#0F2220", "#0B1A19")]
    else:
        _sky(c, "#9CCFE8", "#E6F4EC")
        cols = [("#5E9C6A", "#4E8A5C"), ("#3F7A50", "#356A45"), ("#2F6B45", "#24543A")]
    rnd = random.Random(12)
    for li, (yb, sc, n) in enumerate([(1000, 0.7, 12), (1200, 0.95, 9), (1450, 1.3, 7)]):
        col, dark = cols[li]
        for k in range(n):
            x = k * (W / (n - 1)) + rnd.uniform(-40, 40)
            pine(c, x, yb + rnd.uniform(-30, 30), sc * rnd.uniform(0.85, 1.15), col, dark, ow=5 if li else 0)
        # niebla entre capas
        for k in range(4):
            fx = ((k * 330 + t * (18 + li * 6)) % (W + 600)) - 300
            c.drawOval(skia.Rect.MakeLTRB(fx - 320, yb - 40, fx + 320, yb + 70), P("#DDE6F0", a=60 if sky == "night" else 80, blur=25))
    c.drawRect(skia.Rect.MakeLTRB(0, 1480, W, H), lin_grad(0, 1480, 0, H, [cols[2][0], "#08110F" if sky == "night" else "#2A4A2A"]))
    if sky == "night":   # luciérnagas
        for i in range(25):
            x = rnd.uniform(60, 1020) + math.sin(t * 0.8 + i) * 30
            y = rnd.uniform(900, 1700) + math.cos(t * 0.7 + i * 2) * 25
            a = int(120 + 120 * math.sin(t * 3 + i))
            if a > 0:
                c.drawCircle(x, y, 14, P("#FFF27A", a=a // 3, blur=6)); c.drawCircle(x, y, 4, P("#FFF9C0", a=a))

# ------------------------------------------------------------------ cámara acorazada
def vault(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#5C6B7A", "#2E3742"]))
    for y in range(0, 1300, 160):
        c.drawLine(0, y, W, y, P("#3A4552", stroke=4))
        for x in range(40, W, 120):
            c.drawCircle(x + (60 if (y // 160) % 2 else 0), y + 80, 6, P("#8896A4"))
    # puerta circular de la cámara
    cx, cy = 540, 640
    c.drawCircle(cx, cy, 360, rad_grad(cx, cy, 380, [C("#FFE9A0", 60), C("#FFE9A0", 0)]))
    fs(c, oval(cx, cy, 300, 300), lin_grad(cx - 300, cy - 300, cx + 300, cy + 300, ["#B8C2CC", "#6A7682"]), ow=10)
    fs(c, oval(cx, cy, 240, 240), lin_grad(cx - 240, cy - 240, cx + 240, cy + 240, ["#9AA6B2", "#5A6672"]), ow=8)
    for k in range(12):
        a = k * math.pi / 6
        fs(c, oval(cx + math.cos(a) * 270, cy + math.sin(a) * 270, 14, 14), "#C9D2DA", ow=4)
    c.save(); c.translate(cx, cy); c.rotate(math.degrees(t * 0.4))
    for k in range(3):
        c.save(); c.rotate(k * 120); c.drawLine(0, 0, 0, -150, P(OUT, stroke=30)); c.drawLine(0, 0, 0, -150, P("#D8C27A", stroke=18))
        fs(c, oval(0, -155, 26, 26), "#D8C27A", ow=6); c.restore()
    fs(c, oval(0, 0, 50, 50), "#D8C27A", ow=7)
    c.restore()
    # estanterías con lingotes
    def bar(x, y, s=1.0):
        p = poly([(x - 48 * s, y), (x + 48 * s, y), (x + 34 * s, y - 34 * s), (x - 34 * s, y - 34 * s)])
        fs(c, p, lin_grad(x, y - 34 * s, x, y, ["#FFE27A", "#E0A21F"]), ow=5)
        c.drawLine(x - 26 * s, y - 28 * s, x + 6 * s, y - 28 * s, P("#FFF6C8", stroke=4, a=200))
    for side in (-1, 1):
        sx = 540 + side * 420
        for k in range(3):
            y = 1000 + k * 170
            fs(c, rrect(sx - 120, y, sx + 120, y + 22, 4), "#4A5562", ow=5)
            for j in range(-1, 2):
                bar(sx + j * 70, y)
                if k < 2: bar(sx + j * 70 + 35, y - 34, 0.9)
    c.drawRect(skia.Rect.MakeLTRB(0, 1520, W, H), lin_grad(0, 1520, 0, H, ["#3A4450", "#1E242B"]))
    for x in range(-200, W + 200, 150):
        c.drawLine(540 + (x - 540) * 0.4, 1520, x, H, P("#2A323B", stroke=4))
    for k in range(6):
        ph = (t * 0.7 + k / 6) % 1
        sparkle(c, 140 + (k * 167) % 820, 1040 + (k * 97) % 340, 0.4 + 0.4 * math.sin(ph * math.pi), int(255 * math.sin(ph * math.pi)))

# ------------------------------------------------------------------ biblioteca antigua
def library(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#5A3420", "#2E1A0F"]))
    rnd = random.Random(21)
    spines = ["#8E2F2A", "#2F5D50", "#3B4A7A", "#B07A3A", "#5B3F6B", "#6E5A2A", "#A9673A", "#2E4A3A"]
    for col_x in (40, 560):
        fs(c, rrect(col_x, 120, col_x + 480, 1480, 6), "#6E3F22", ow=8)
        for row in range(6):
            y0 = 160 + row * 215
            c.drawRect(skia.Rect.MakeLTRB(col_x + 18, y0 + 190, col_x + 462, y0 + 210), P("#4A2812"))
            x = col_x + 24
            while x < col_x + 440:
                w = rnd.randint(18, 34); h = rnd.randint(130, 185)
                if x + w > col_x + 456: break
                fs(c, rrect(x, y0 + 190 - h, x + w, y0 + 190, 3), rnd.choice(spines), ow=3)
                c.drawLine(x + 4, y0 + 190 - h + 20, x + w - 4, y0 + 190 - h + 20, P("#E8C25A", stroke=3, a=180))
                x += w + rnd.randint(0, 4)
    # escalera
    c.drawLine(470, 300, 400, 1480, P("#8C5530", stroke=16)); c.drawLine(590, 300, 520, 1480, P("#8C5530", stroke=16))
    for k in range(9):
        y = 400 + k * 125; off = (y - 300) / 1180 * 70
        c.drawLine(470 - off, y, 590 - off, y, P("#8C5530", stroke=12))
    c.drawRect(skia.Rect.MakeLTRB(0, 1480, W, H), lin_grad(0, 1480, 0, H, ["#7A4A2A", "#3E2412"]))
    # alfombra
    fs(c, poly([(260, 1600), (820, 1600), (980, H), (100, H)]), "#7A1F2A", ow=6)
    c.drawPath(poly([(300, 1630), (780, 1630), (920, H - 30), (160, H - 30)]), P("#E8C25A", stroke=6, a=160))
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(540, 800, 900, [C("#FFD98A", 50), C("#FFD98A", 0)]))
    for i in range(30):
        px = rnd.uniform(80, 1000); py = (rnd.uniform(300, 1500) - t * rnd.uniform(6, 18)) % 1300 + 250
        c.drawCircle(px, py, rnd.uniform(2, 4), P("#FFF0C0", a=90))

# ------------------------------------------------------------------ ciudad moderna de noche
def city(c, t):
    _sky(c, "#1A1240", "#5B3A7A", 1200); _stars(c, t, 40, 500)
    _moon(c, 860, 250, 60)
    rnd = random.Random(31)
    for li, (base, col, wincol, n) in enumerate([(1250, "#2A2550", "#FFE08A", 8), (1400, "#1C1838", "#FFD25A", 6)]):
        x = -40
        while x < W:
            w = rnd.randint(110, 200); h = rnd.randint(380, 820) if li == 0 else rnd.randint(300, 650)
            fs(c, rrect(x, base - h, x + w, base + 600, 4), col, ow=5)
            for wy in range(int(base - h + 30), base, 52):
                for wx in range(int(x + 18), int(x + w - 20), 34):
                    on = math.sin(wx * 7.1 + wy * 3.3 + (t * 0.5 if (wx + wy) % 7 == 0 else 0)) > 0.1
                    if on: c.drawRect(skia.Rect.MakeLTRB(wx, wy, wx + 18, wy + 26), P(wincol, a=220))
            x += w + rnd.randint(4, 20)
    c.drawRect(skia.Rect.MakeLTRB(0, 1500, W, H), lin_grad(0, 1500, 0, H, ["#2B2B33", "#141418"]))
    for k in range(6):   # líneas de la carretera
        xx = (k * 220 - t * 300) % (W + 200) - 100
        c.drawRect(skia.Rect.MakeLTRB(xx, 1690, xx + 110, 1702), P("#FFD23F"))
    for k in range(3):   # coches con luces
        xx = (k * 420 + t * 260) % (W + 400) - 200
        fs(c, rrect(xx, 1560, xx + 190, 1630, 22), ["#E53935", "#3B82C4", "#F2C14E"][k], ow=5)
        fs(c, rrect(xx + 35, 1525, xx + 150, 1568, 16), "#BFE6F5", ow=4)
        for wx in (xx + 40, xx + 150): fs(c, oval(wx, 1632, 22, 22), "#222222", ow=4)
        c.drawOval(skia.Rect.MakeLTRB(xx + 180, 1580, xx + 330, 1612), P("#FFF6C0", a=120, blur=10))
    for lx in (120, 960):
        c.drawLine(lx, 1560, lx, 1150, P("#3A3A44", stroke=14))
        c.drawCircle(lx, 1140, 120, rad_grad(lx, 1140, 130, [C("#FFE7A6", 150), C("#FFE7A6", 0)]))
        fs(c, oval(lx, 1140, 22, 16), "#FFF2C0", ow=5)

# ------------------------------------------------------------------ oficina moderna
def office(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#E8EEF4", "#C9D6E2"]))
    # ventanal con ciudad de día
    fs(c, rrect(90, 200, 990, 950, 10), lin_grad(0, 200, 0, 950, ["#8FCBF0", "#DDF2FF"]), ow=10)
    rnd = random.Random(41)
    x = 100
    while x < 980:
        w = rnd.randint(70, 140); h = rnd.randint(200, 520)
        c.drawRect(skia.Rect.MakeLTRB(x, 950 - h, min(x + w, 980), 950), P(rnd.choice(["#A9BCD0", "#93A9C0", "#B8C9DA"])))
        x += w + 8
    for xx in (390, 690): c.drawLine(xx, 200, xx, 950, P("#5E6B78", stroke=10))
    c.drawLine(90, 575, 990, 575, P("#5E6B78", stroke=10))
    cloud(c, (300 + t * 15) % 1300 - 200, 330, 0.6)
    # pizarra con gráfica que sube
    fs(c, rrect(90, 1000, 470, 1290, 10), "#FFFFFF", ow=7)
    pts = [(120, 1250), (190, 1220), (260, 1235), (330, 1170), (400, 1100), (440, 1040)]
    prog = (t * 0.4) % 1.2
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    c.drawPath(p, P("#2EA043", stroke=8))
    # mesa con ordenador
    fs(c, rrect(520, 1240, 1060, 1290, 8), "#B07A44", ow=6)
    c.drawLine(560, 1290, 560, 1520, P("#5A3A22", stroke=14)); c.drawLine(1020, 1290, 1020, 1520, P("#5A3A22", stroke=14))
    fs(c, rrect(640, 960, 940, 1170, 12), "#2A2F36", ow=7)
    c.drawRect(skia.Rect.MakeLTRB(660, 980, 920, 1150), lin_grad(0, 980, 0, 1150, ["#3B82C4", "#1D4F80"]))
    for k in range(4):
        c.drawLine(680, 1010 + k * 32, 680 + 120 + (k * 37) % 100, 1010 + k * 32, P("#BFE6F5", stroke=6, a=200))
    c.drawRect(skia.Rect.MakeLTRB(770, 1170, 810, 1240), P("#2A2F36"))
    fs(c, rrect(720, 1228, 860, 1244, 6), "#2A2F36", ow=4)
    # planta
    fs(c, rrect(950, 1150, 1030, 1240, 10), "#E07A4F", ow=6)
    for k in range(5):
        a = -2.5 + k * 0.45 + math.sin(t + k) * 0.05
        leaf = oval(990 + math.cos(a) * 60, 1120 + math.sin(a) * 60, 40, 16)
        c.save(); c.translate(990 + math.cos(a) * 60, 1120 + math.sin(a) * 60); c.rotate(math.degrees(a)); c.translate(-(990 + math.cos(a) * 60), -(1120 + math.sin(a) * 60))
        fs(c, leaf, "#3F9A4A", ow=4); c.restore()
    c.drawRect(skia.Rect.MakeLTRB(0, 1520, W, H), lin_grad(0, 1520, 0, H, ["#9AA7B4", "#6C7884"]))

# ------------------------------------------------------------------ mar en tormenta
def storm(c, t, ship_name=""):
    _sky(c, "#1B2433", "#4A5566", 1100)
    flash = max(0.0, math.sin(t * 1.3) ** 40)
    for (cx, cy, sc) in [(150, 260, 1.4), (520, 180, 1.7), (900, 300, 1.5), (330, 420, 1.2), (760, 480, 1.3)]:
        cloud(c, cx + math.sin(t * 0.3 + cx) * 20, cy, sc, a=255)
        c.save(); c.translate(cx, cy); c.scale(sc, sc)
        p = skia.Path()
        for (x, y, r) in [(-70, 10, 50), (-20, -20, 65), (45, -5, 55), (90, 15, 40), (0, 20, 50)]: p.addCircle(x, y, r)
        c.drawPath(p, P("#4A5566", a=200)); c.restore()
    if flash > 0.05:
        bolt = poly([(620, 380), (580, 620), (630, 610), (560, 900), (680, 560), (625, 570), (670, 380)])
        c.drawPath(bolt, P("#FFF6B0", a=int(255 * flash)))
        c.drawRect(skia.Rect.MakeWH(W, H), P("#FFFFFF", a=int(70 * flash)))
    for i in range(140):   # lluvia
        rx = (i * 83 + t * 900) % (W + 200) - 100; ry = (i * 137 + t * 1400) % H
        c.drawLine(rx, ry, rx - 18, ry + 50, P("#C9D6E6", stroke=3, a=110))
    for k in range(6):
        yy = 1000 + k * 120
        p = skia.Path(); p.moveTo(0, H); p.lineTo(0, yy)
        for x in range(0, W + 120, 120):
            p.quadTo(x + 60, yy - 60 - 20 * math.sin(t * 2 + k + x * 0.01), x + 120, yy + 10 * math.sin(t * 1.5 + x))
        p.lineTo(W, H); p.close()
        fs(c, p, ["#2E5F7A", "#26546E", "#1F4A62", "#1A4057", "#15364B", "#102C3F"][k], ow=5)
        if k == 1:
            if SHIP: SHIP(c, 560, yy + 40, 0.75, t * 2.5, ship_name)

# ------------------------------------------------------------------ sala de operaciones (guerra)
def warroom(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#2A2F24", "#15180F"]))
    # gran mapa en la pared
    fs(c, rrect(70, 180, 1010, 900, 10), "#3A2A18", ow=10)
    c.drawRect(skia.Rect.MakeLTRB(95, 205, 985, 875), lin_grad(0, 205, 0, 875, ["#7FB6C9", "#5E97AC"]))
    land = [poly([(380, 260), (520, 240), (560, 380), (500, 520), (430, 560), (390, 460), (350, 380)]),     # Gran Bretaña
            poly([(560, 600), (985, 560), (985, 875), (520, 875), (470, 760)]),                                # continente
            poly([(95, 760), (300, 720), (340, 875), (95, 875)])]
    for p in land: fs(c, p, "#D9C48F", ow=5)
    for xx in range(95, 985, 90): c.drawLine(xx, 205, xx, 875, P("#FFFFFF", stroke=2, a=50))
    for yy in range(205, 875, 90): c.drawLine(95, yy, 985, yy, P("#FFFFFF", stroke=2, a=50))
    # flechas rojas parpadeantes
    a = int(150 + 100 * math.sin(t * 4))
    for (x0, y0, x1, y1) in [(480, 520, 600, 660), (520, 470, 700, 600)]:
        c.drawLine(x0, y0, x1, y1, P("#E53935", stroke=12, a=a))
        ang = math.atan2(y1 - y0, x1 - x0)
        c.drawPath(poly([(x1, y1), (x1 - 40 * math.cos(ang - 0.5), y1 - 40 * math.sin(ang - 0.5)), (x1 - 40 * math.cos(ang + 0.5), y1 - 40 * math.sin(ang + 0.5))]), P("#E53935", a=a))
    for (px, py) in [(470, 380), (720, 640), (850, 700), (610, 720)]: fs(c, oval(px, py, 12, 12), "#E53935", ow=4)
    # lámpara colgante con cono de luz
    sw = math.sin(t * 1.1) * 0.06
    c.save(); c.translate(540, 0); c.rotate(math.degrees(sw))
    c.drawLine(0, 0, 0, 980, P("#111111", stroke=5))
    c.drawPath(poly([(-60, 1000), (60, 1000), (380, 1700), (-380, 1700)]), P("#FFE9A0", a=40, blur=20))
    fs(c, poly([(-70, 1010), (-35, 960), (35, 960), (70, 1010)]), "#3E4A2E", ow=5)
    c.restore()
    # mesa con radio
    c.drawRect(skia.Rect.MakeLTRB(0, 1500, W, H), lin_grad(0, 1500, 0, H, ["#3A2A18", "#1E150B"]))
    fs(c, rrect(620, 1300, 1000, 1500, 10), "#4A4F3A", ow=7)
    for k in range(2): fs(c, oval(690 + k * 90, 1400, 32, 32), "#2A2A2A", ow=5)
    c.drawRect(skia.Rect.MakeLTRB(860, 1340, 970, 1460), P("#1F2A1A"))
    wave = skia.Path(); wave.moveTo(865, 1400)
    for k in range(22): wave.lineTo(865 + k * 5, 1400 + math.sin(t * 12 + k) * 25 * abs(math.sin(t * 3)))
    c.drawPath(wave, P("#7CFF7C", stroke=3))
    c.drawLine(960, 1300, 1000, 1180, P("#2A2A2A", stroke=6))

# ------------------------------------------------------------------ playa al amanecer (desembarco)
def beach(c, t):
    _sky(c, "#F2A65A", "#FFE3B5", 1050)
    c.drawCircle(540, 1000, 170, P("#FFD37A", a=230))
    for (cx, cy, sc, sp) in [(200, 420, 1.0, 6), (800, 330, 0.8, 4)]: cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc, a=170)
    c.drawRect(skia.Rect.MakeLTRB(0, 1040, W, 1450), lin_grad(0, 1040, 0, 1450, ["#5E8FB0", "#2F5F80"]))
    for k in range(8):
        yy = 1070 + k * 45
        c.drawLine((t * 30 + k * 130) % W, yy, (t * 30 + k * 130) % W + 120, yy, P("#FFFFFF", stroke=3, a=80))
    for k in range(7):   # siluetas de barcos en el horizonte
        x = 80 + k * 150 + math.sin(t + k) * 5; y = 1060 + (k % 3) * 25
        c.drawPath(poly([(x - 45, y), (x + 45, y), (x + 32, y + 18), (x - 32, y + 18)]), P("#2A3440"))
        c.drawRect(skia.Rect.MakeLTRB(x - 8, y - 28, x + 8, y), P("#2A3440"))
    sand = skia.Path(); sand.moveTo(0, 1450); sand.quadTo(540, 1390, W, 1450); sand.lineTo(W, H); sand.lineTo(0, H); sand.close()
    c.drawPath(sand, lin_grad(0, 1400, 0, H, ["#E8CF9A", "#C9A86A"]))
    for k in range(5):   # obstáculos de playa
        x = 120 + k * 210; y = 1560 + (k % 2) * 60
        c.drawLine(x - 30, y + 40, x + 30, y - 40, P("#4A4A4A", stroke=10)); c.drawLine(x + 30, y + 40, x - 30, y - 40, P("#4A4A4A", stroke=10))

# ------------------------------------------------------------------ calle de Lisboa (años 40)
def lisbon(c, t):
    _sky(c, "#7EC8F2", "#FFE6B8", 900)
    cols = ["#F2C14E", "#E07A4F", "#7FB6C9", "#F6ECD2", "#C98AB0"]
    x = -20; k = 0
    while x < W:
        w = 230; h = 700 + (k % 3) * 90
        fs(c, rrect(x, 1380 - h, x + w, 1400, 4), cols[k % 5], ow=6)
        for wy in range(1380 - h + 70, 1300, 150):     # ventanas con contraventanas
            for wx in (x + 40, x + 130):
                fs(c, rrect(wx, wy, wx + 60, wy + 90, 4), "#3B5A7A", ow=4)
                c.drawLine(wx + 30, wy, wx + 30, wy + 90, P("#FFFFFF", stroke=3, a=120))
        for ty in range(1380 - h + 20, 1380, 40):       # azulejos
            c.drawLine(x, ty, x + w, ty, P("#FFFFFF", stroke=1, a=40))
        fs(c, rrect(x - 10, 1380 - h - 30, x + w + 10, 1380 - h + 6, 4), "#C4573A", ow=5)
        x += w + 4; k += 1
    c.drawRect(skia.Rect.MakeLTRB(0, 1400, W, H), lin_grad(0, 1400, 0, H, ["#CFC2A8", "#9E8F72"]))
    for k in range(12):
        c.drawLine(0, 1430 + k * 45, W, 1430 + k * 45, P("#8A7C60", stroke=2, a=90))
    c.drawLine(0, 1560, W, 1560, P("#555555", stroke=6)); c.drawLine(0, 1610, W, 1610, P("#555555", stroke=6))
    c.drawLine(0, 980, W, 980, P("#222222", stroke=3))   # cable del tranvía
    tx = (W + 300) - ((t * 90) % (W + 900))
    fs(c, rrect(tx, 1250, tx + 520, 1560, 26), "#F2C230", ow=8)    # tranvía amarillo
    fs(c, rrect(tx, 1250, tx + 520, 1300, 26), "#FFFFFF", ow=6)
    for k in range(4): fs(c, rrect(tx + 30 + k * 120, 1320, tx + 120 + k * 120, 1420, 8), "#BFE6F5", ow=5)
    c.drawLine(tx + 260, 1250, tx + 300, 985, P("#222222", stroke=5))
    for wx in (tx + 110, tx + 410): fs(c, oval(wx, 1565, 32, 32), "#333333", ow=5)
    fs(c, rrect(tx + 190, 1450, tx + 330, 1490, 6), "#2F5D50", ow=4)

# ------------------------------------------------------------------ búnker con alarma
def bunker(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#1B2226", "#0B0F12"]))
    # pantalla gigante con mapa del mundo y trayectorias
    fs(c, rrect(60, 200, 1020, 860, 14), "#0D1A14", ow=10, outline="#3A4A44")
    for xx in range(80, 1000, 60): c.drawLine(xx, 220, xx, 840, P("#1E5A3A", stroke=2, a=120))
    for yy in range(220, 840, 60): c.drawLine(80, yy, 1000, yy, P("#1E5A3A", stroke=2, a=120))
    for p in [poly([(150, 330), (380, 300), (420, 420), (330, 560), (250, 520), (180, 430)]),
              poly([(560, 290), (900, 280), (960, 420), (820, 520), (640, 470), (580, 380)])]:
        c.drawPath(p, P("#2E8B57", a=170)); c.drawPath(p, P("#5CFF9C", stroke=3, a=200))
    prog = (t * 0.35) % 1
    for k in range(5):   # trayectorias de "misiles" en la pantalla
        sx, sy = 300 + k * 18, 430 + k * 10; ex, ey = 720 + k * 22, 360 - k * 6
        path = skia.Path(); path.moveTo(sx, sy); path.quadTo((sx + ex) / 2, 220 + k * 12, ex, ey)
        meas = skia.PathMeasure(path, False); L = meas.getLength()
        seg = skia.Path(); meas.getSegment(0, L * min(1, prog * 1.3 + k * 0.05), seg, True)
        c.drawPath(seg, P("#FF3B30", stroke=5))
    text_c(c, "ALERTA", 540, 815, 48, fill="#FF3B30")
    # luz giratoria roja
    a = 0.5 + 0.5 * math.sin(t * 9)
    c.drawRect(skia.Rect.MakeWH(W, H), P("#FF1A1A", a=int(55 * a)))
    fs(c, rrect(500, 90, 580, 150, 20), "#B3000A", ow=6)
    c.drawCircle(540, 120, 160, rad_grad(540, 120, 170, [C("#FF3B30", int(160 * a)), C("#FF3B30", 0)]))
    # consolas
    fs(c, poly([(0, 1350), (W, 1350), (W, 1520), (0, 1520)]), "#2C3439", ow=6)
    for k in range(12):
        x = 60 + k * 85; on = math.sin(t * 6 + k * 1.7) > 0
        fs(c, oval(x, 1400, 14, 14), "#FF3B30" if on else "#5A1010", ow=4)
        fs(c, rrect(x - 26, 1440, x + 26, 1490, 6), ["#3A6A8A", "#6A8A3A", "#8A6A3A"][k % 3], ow=4)
    c.drawRect(skia.Rect.MakeLTRB(0, 1520, W, H), lin_grad(0, 1520, 0, H, ["#22292D", "#0E1214"]))

# ------------------------------------------------------------------ espacio con satélite
def space(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#05060F", "#101433"]))
    _stars(c, t, 160, H, seed=9)
    c.drawCircle(540, 2650, 1400, rad_grad(540, 2650, 1480, [C("#3B82C4", 255), C("#3B82C4", 255), C("#7FD4F0", 120), C("#7FD4F0", 0)], [0, 0.93, 0.97, 1]))
    rnd = random.Random(5)
    for k in range(14):
        cx = rnd.uniform(-100, 1180); cy = rnd.uniform(1330, 1700)
        c.drawOval(skia.Rect.MakeLTRB(cx - 120, cy - 25, cx + 120, cy + 25), P("#FFFFFF", a=150, blur=6))
    c.save(); c.translate(560 + math.sin(t * 0.5) * 30, 620 + math.cos(t * 0.4) * 20); c.rotate(-15 + math.sin(t * 0.3) * 5)
    for side in (-1, 1):
        fs(c, rrect(side * 110 - (190 if side < 0 else 0), -45, side * 110 + (190 if side > 0 else 0), 45, 6), "#2A4A8A", ow=6)
        for k in range(1, 5):
            x = side * 110 + side * k * 38
            c.drawLine(x, -45, x, 45, P("#7FA8E0", stroke=3))
    fs(c, rrect(-110, -80, 110, 80, 12), "#C9D2DA", ow=7)
    fs(c, oval(0, 95, 40, 22), "#8A96A4", ow=5)
    c.drawLine(0, -80, 0, -150, P(OUT, stroke=6)); fs(c, oval(0, -160, 14, 14), "#FF3B30", ow=4)
    c.restore()

# ------------------------------------------------------------------ avión en la tormenta
def sky_storm(c, t):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#141B2A", "#3A4458"]))
    flash = max(0.0, math.sin(t * 1.6) ** 30)
    for i in range(160):
        rx = (i * 83 + t * 700) % (W + 200) - 100; ry = (i * 137 + t * 1300) % H
        c.drawLine(rx, ry, rx - 14, ry + 46, P("#C9D6E6", stroke=3, a=100))
    for (cx, cy, sc, sp) in [(100, 300, 2.0, 30), (700, 520, 2.4, 22), (300, 1250, 2.2, 26), (900, 1500, 2.0, 34), (520, 1750, 2.6, 20)]:
        x = (cx - t * sp) % (W + 600) - 300
        cloud(c, x, cy, sc, a=255)
        c.save(); c.translate(x, cy); c.scale(sc, sc)
        p = skia.Path()
        for (px, py, r) in [(-70, 10, 50), (-20, -20, 65), (45, -5, 55), (90, 15, 40), (0, 20, 50)]: p.addCircle(px, py, r)
        c.drawPath(p, P("#4A5568", a=215)); c.restore()
    if flash > 0.05:
        bolt = poly([(760, 0), (700, 330), (760, 320), (660, 700), (820, 280), (750, 290), (820, 0)])
        c.drawPath(bolt, P("#FFF6B0", a=int(255 * flash)))
        c.drawRect(skia.Rect.MakeWH(W, H), P("#FFFFFF", a=int(90 * flash)))
    c.save(); c.translate(500 + math.sin(t * 7) * 8, 900 + math.sin(t * 5) * 14); c.rotate(-8 + math.sin(t * 3) * 3)
    fs(c, rrect(-330, -50, 330, 50, 50), "#E8EEF4", ow=8)
    fs(c, poly([(-60, 0), (80, 0), (-60, 260), (-140, 260)]), "#C9D2DA", ow=7)
    fs(c, poly([(-60, 0), (80, 0), (-60, -260), (-140, -260)]), "#B8C2CC", ow=7)
    fs(c, poly([(-300, -30), (-250, -30), (-330, -170), (-370, -170)]), "#C9D2DA", ow=6)
    for k in range(9): fs(c, oval(-180 + k * 50, -12, 11, 13), "#3B5A7A", ow=3)
    fs(c, oval(300, -10, 30, 22), "#3B5A7A", ow=4)
    for (ex, ey) in [(-10, 140), (-10, -140)]:
        fs(c, rrect(ex - 30, ey - 22, ex + 50, ey + 22, 18), "#8A96A4", ow=5)
        c.save(); c.translate(ex + 56, ey); c.rotate(t * 2000 % 360)
        c.drawLine(0, -40, 0, 40, P("#555555", stroke=7)); c.restore()
    c.restore()

# ------------------------------------------------------------------ selva amazónica con río
def jungle(c, t, camp=False):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, H, ["#BFE3C8", "#7FBF8A"]))
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(700, 200, 700, [C("#FFF6C8", 140), C("#FFF6C8", 0)]))
    rnd = random.Random(15)
    def tree(x, y, s, col):
        c.save(); c.translate(x, y); c.scale(s, s)
        c.drawRect(skia.Rect.MakeLTRB(-18, -500, 18, 0), P("#5A3A22"))
        for k in range(6):
            a = rnd.uniform(0, 6.28); r = rnd.uniform(60, 140)
            fs(c, oval(math.cos(a) * r, -520 + math.sin(a) * r * 0.6, rnd.uniform(110, 160), rnd.uniform(80, 120)), col, ow=4)
        c.restore()
    for k in range(8): tree(k * 150 + rnd.uniform(-40, 40), 1050, rnd.uniform(0.9, 1.3), "#4E9A5C")
    for k in range(6): tree(k * 200 + rnd.uniform(-40, 40), 1250, rnd.uniform(1.1, 1.5), "#3A8048")
    # río que serpentea
    river = skia.Path(); river.moveTo(380, 1150); river.cubicTo(700, 1300, 200, 1500, 600, H); river.lineTo(1000, H)
    river.cubicTo(560, 1500, 1000, 1300, 560, 1150); river.close()
    c.drawRect(skia.Rect.MakeLTRB(0, 1150, W, H), lin_grad(0, 1150, 0, H, ["#6E8A3A", "#4E6A2A"]))
    fs(c, river, lin_grad(0, 1150, 0, H, ["#7FB6C9", "#4F8FAA"]), ow=6)
    for k in range(10):
        yy = 1200 + k * 75; xx = 520 + math.sin(yy * 0.01) * 120 + ((t * 40 + k * 30) % 80)
        c.drawLine(xx, yy, xx + 60, yy, P("#FFFFFF", stroke=3, a=110))
    # lianas y hojas grandes en primer plano
    for k in range(6):
        x = 40 + k * 200
        lv = skia.Path(); lv.moveTo(x, 0); lv.quadTo(x + 40 + math.sin(t + k) * 10, 300, x + 10, 520 + k * 40)
        c.drawPath(lv, P("#2F6B3A", stroke=8))
    for (x, y, ang) in [(60, 1700, -30), (1020, 1650, 210), (180, 1850, -10), (940, 1880, 190)]:
        c.save(); c.translate(x, y); c.rotate(ang + math.sin(t * 1.5 + x) * 3)
        fs(c, oval(120, 0, 160, 60), "#2E7A3A", ow=6); c.drawLine(-30, 0, 270, 0, P("#1E5A2A", stroke=5)); c.restore()
    if camp:
        fs(c, poly([(760, 1180), (980, 1180), (870, 1060)]), "#B07A44", ow=6)
        fs(c, rrect(780, 1180, 960, 1290, 4), "#9C6A3A", ow=6)
        c.drawRect(skia.Rect.MakeLTRB(850, 1220, 890, 1290), P("#3A2416"))
        c.drawCircle(700, 1270, 40, rad_grad(700, 1270, 60, [C("#FFB347", 200), C("#FFB347", 0)]))
        fs(c, poly([(640, 1420), (820, 1420), (790, 1460), (670, 1460)]), "#8A5A30", ow=5)
    for k in range(10):   # mariposas/insectos
        bx = (k * 113 + t * 40) % W; by = 500 + (k * 97) % 600 + math.sin(t * 3 + k) * 20
        c.drawCircle(bx, by, 5, P("#FFD23F", a=200))

# ------------------------------------------------------------------ transatlántico
def liner(c, t, night=False, name="", iceberg=False):
    if night:
        _sky(c, "#060B1E", "#1E2A4A", 1100); _stars(c, t, 120, 1000, seed=17)
    else:
        _sky(c, "#7EC8F2", "#E0F4FF", 1100)
        for (cx, cy, sc, sp) in [(200, 300, 1.0, 10), (800, 420, 0.8, 7)]: cloud(c, (cx + t * sp) % (W + 400) - 200, cy, sc)
    sea_top = 1180
    c.drawRect(skia.Rect.MakeLTRB(0, sea_top, W, H), lin_grad(0, sea_top, 0, H, ["#1E3A5A" if night else "#2F8FC2", "#0A1A2E" if night else "#1D5F8A"]))
    if iceberg:
        ib = poly([(40, sea_top + 20), (120, 860), (200, 920), (260, 780), (360, 960), (420, sea_top + 20)])
        fs(c, ib, lin_grad(0, 780, 0, sea_top, ["#F4FAFF", "#BFE0F0"]), ow=7)
        c.drawPath(poly([(260, 780), (300, 960), (360, 960)]), P("#A9D2E8", a=180))
    c.save(); c.translate(640, sea_top + 30 + math.sin(t * 1.2) * 6); c.rotate(math.sin(t) * 0.8)
    hull = skia.Path(); hull.moveTo(-430, -120); hull.lineTo(400, -120); hull.lineTo(360, 60); hull.lineTo(-400, 60); hull.close()
    fs(c, hull, "#1E1E24", ow=7)
    c.drawRect(skia.Rect.MakeLTRB(-430, 20, 395, 60), P("#8E2F2A"))
    fs(c, rrect(-380, -210, 340, -120, 6), "#F6F2E6", ow=6)
    for k in range(24):
        lit = night and math.sin(k * 3.7 + t) > -0.6
        c.drawCircle(-360 + k * 30, -60, 7, P("#FFE7A0" if lit else "#C9D6E6"))
        c.drawCircle(-360 + k * 30, -165, 6, P("#FFE7A0" if lit else "#7FA8C9"))
    for k in range(4):
        x = -290 + k * 170
        fs(c, poly([(x - 40, -210), (x + 40, -210), (x + 52, -400), (x - 28, -400)]), "#D98A2A", ow=6)
        c.drawRect(skia.Rect.MakeLTRB(x - 28, -400, x + 52, -360), P("#1E1E24"))
        for q in range(3):
            ph = (t * 0.6 + q / 3 + k * 0.2) % 1
            c.drawCircle(x + 12 - ph * 120, -420 - ph * 160, 30 + 40 * ph, P("#9AA6B2" if not night else "#4A5568", a=int(160 * (1 - ph))))
    if name: text_c(c, name, -20, 48, 30, fill="#F5D774", path=FONT_SERIF)
    c.restore()
    for k in range(7):
        yy = sea_top + 120 + k * 90
        c.drawLine((t * 50 + k * 170) % W, yy, (t * 50 + k * 170) % W + 160, yy, P("#FFFFFF", stroke=3, a=70))

def draw_bg(c, t, name, s):
    """Dibuja cualquier fondo por nombre. Devuelve False si no lo conoce."""
    sky = s.get("sky", "day")
    if name == "mountains": mountains(c, t, sky)
    elif name == "forest": forest(c, t, s.get("sky", "night"))
    elif name == "vault": vault(c, t)
    elif name == "library": library(c, t)
    elif name == "city": city(c, t)
    elif name == "office": office(c, t)
    elif name == "storm": storm(c, t, s.get("sign", ""))
    elif name == "warroom": warroom(c, t)
    elif name == "beach": beach(c, t)
    elif name == "lisbon": lisbon(c, t)
    elif name == "bunker": bunker(c, t)
    elif name == "space": space(c, t)
    elif name == "sky_storm": sky_storm(c, t)
    elif name == "jungle": jungle(c, t, s.get("camp", False))
    elif name == "liner": liner(c, t, s.get("sky", "day") == "night", s.get("sign", ""), s.get("iceberg", False))
    else:
        import bg_guerra
        if name not in bg_guerra.GUERRA: return False
        bg_guerra.GUERRA[name](c, t, s.get("sky", "night"))
    if s.get("dark"): c.drawRect(skia.Rect.MakeWH(W, H), P("#0A0612", a=120))
    return True

SHIP = None
NEW_BGS = ["mountains", "forest", "vault", "library", "city", "office", "storm", "warroom", "beach", "lisbon", "bunker", "space", "sky_storm", "jungle", "liner", "la_raid", "aa_battery", "submarine", "balloon"]
