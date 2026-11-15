"""Motor de animación para Shorts estilo dibujos animados (1080x1920, 30 fps).
Dibuja todo con vectores (skia): personajes, fondos, props, subtítulos y cámara.
"""
import math, random
import skia

W, H, FPS = 1080, 1920, 30
FONT_BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
_tf = {}

def font(size, path=FONT_BLACK):
    if path not in _tf:
        _tf[path] = skia.Typeface.MakeFromFile(path)
    return skia.Font(_tf[path], size)

OUT = "#2A1B12"   # color del contorno
OW = 7            # grosor del contorno

def C(h, a=255):
    h = h.lstrip("#")
    return skia.ColorSetARGB(a, int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def P(color, stroke=None, a=255, blur=None):
    p = skia.Paint(AntiAlias=True, Color=C(color, a) if isinstance(color, str) else color)
    if stroke:
        p.setStyle(skia.Paint.kStroke_Style)
        p.setStrokeWidth(stroke)
        p.setStrokeCap(skia.Paint.kRound_Cap)
        p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur:
        p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    return p

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease_out(x):
    x = clamp(x); return 1 - (1 - x) ** 3

def ease_io(x):
    x = clamp(x); return 3 * x * x - 2 * x * x * x

def back(x):
    x = clamp(x); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2

def fs(c, shape, fill, ow=OW, outline=OUT):
    """Dibuja una forma (Path) con relleno y contorno."""
    c.drawPath(shape, P(fill) if isinstance(fill, str) else fill)
    if ow:
        c.drawPath(shape, P(outline, stroke=ow))

def oval(cx, cy, rx, ry):
    p = skia.Path(); p.addOval(skia.Rect.MakeLTRB(cx - rx, cy - ry, cx + rx, cy + ry)); return p

def rrect(l, t, r, b, rad):
    p = skia.Path(); p.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(l, t, r, b), rad, rad)); return p

def poly(pts, close=True):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    if close: p.close()
    return p

def lin_grad(x0, y0, x1, y1, cols, pos=None):
    p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeLinear([skia.Point(x0, y0), skia.Point(x1, y1)],
                                               [C(c) if isinstance(c, str) else c for c in cols], pos))
    return p

def rad_grad(cx, cy, r, cols, pos=None):
    p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeRadial(skia.Point(cx, cy), r,
                                               [C(c) if isinstance(c, str) else c for c in cols], pos))
    return p

def text_c(c, s, x, y, size, fill="#FFFFFF", stroke=None, sw=0, path=FONT_BLACK, a=255):
    f = font(size, path)
    w = f.measureText(s)
    if stroke:
        c.drawString(s, x - w / 2, y, f, P(stroke, stroke=sw, a=a))
    c.drawString(s, x - w / 2, y, f, P(fill, a=a))
    return w

# ---------------------------------------------------------------- personaje
def character(c, x, y, s=1.0, t=0.0, shirt="#F6F2E6", pants="#34425E", hat="panama",
              mood="open", mouth=0.0, blink=False, mustache=True, arm_l=0.15, arm_r=-0.15,
              prop=None, look=(0, 0), skin="#FFF4E4", hat_col=None, seated=False, bob=True, rot=0.0):
    """Personaje original: cabeza grande redonda, sombrero, guayabera. Origen = pies."""
    c.save(); c.translate(x, y)
    if bob:
        c.translate(0, -abs(math.sin(t * 3.2)) * 6)
    c.rotate(rot)
    c.scale(s, s)
    # sombra
    c.drawOval(skia.Rect.MakeLTRB(-110, -18, 110, 18), P("#000000", a=55, blur=6))
    if not seated:
        for lx in (-34, 34):
            fs(c, rrect(lx - 22, -130, lx + 22, -10, 14), pants)
            fs(c, oval(lx + (8 if lx > 0 else -8), -8, 34, 16), "#2B211B")
    # brazos (detrás del cuerpo para que se vean "pegados")
    def arm(side, ang):
        sx, sy = side * 72, -270
        L = 120
        ex, ey = sx + math.sin(ang) * L * side, sy + math.cos(ang) * L
        c.drawLine(sx, sy, ex, ey, P(OUT, stroke=44))
        c.drawLine(sx, sy, ex, ey, P(shirt, stroke=30))
        fs(c, oval(ex, ey, 22, 22), skin)
        return ex, ey
    hl = arm(-1, arm_l); hr = arm(1, arm_r)
    # torso
    torso = skia.Path()
    torso.moveTo(-78, -305); torso.lineTo(78, -305); torso.quadTo(100, -305, 102, -280)
    torso.lineTo(108, -130); torso.quadTo(108, -110, 88, -110); torso.lineTo(-88, -110)
    torso.quadTo(-108, -110, -108, -130); torso.lineTo(-102, -280); torso.quadTo(-100, -305, -78, -305); torso.close()
    fs(c, torso, shirt)
    # detalles de guayabera: botones y bolsillos
    for by in (-270, -230, -190, -150):
        c.drawCircle(0, by, 5, P(OUT, a=160))
    c.drawLine(-60, -300, -60, -120, P(OUT, stroke=3, a=60)); c.drawLine(60, -300, 60, -120, P(OUT, stroke=3, a=60))
    fs(c, rrect(-90, -215, -30, -170, 8), shirt, ow=4); fs(c, rrect(30, -215, 90, -170, 8), shirt, ow=4)
    # cuello
    fs(c, poly([(-40, -306), (0, -270), (40, -306)]), shirt, ow=5)
    # prop delante del cuerpo
    if prop:
        prop_draw(c, prop, t)
    # cabeza
    hx, hy = 0, -430
    fs(c, oval(hx, hy, 132, 128), skin, ow=OW + 1)
    # mejillas
    for sx in (-1, 1):
        c.drawCircle(hx + sx * 82, hy + 40, 20, P("#FF8A80", a=90))
    lx, ly = look
    # ojos
    for sx in (-1, 1):
        ex, ey = hx + sx * 46 + lx, hy - 6 + ly
        if blink or mood == "happy":
            p = skia.Path(); p.moveTo(ex - 16, ey + (4 if mood == "happy" else 0))
            if mood == "happy":
                p.quadTo(ex, ey - 16, ex + 16, ey + 4)
            else:
                p.lineTo(ex + 16, ey)
            c.drawPath(p, P(OUT, stroke=7))
        else:
            ry = 24 if mood == "surprised" else 20
            c.drawOval(skia.Rect.MakeLTRB(ex - 14, ey - ry, ex + 14, ey + ry), P("#1B1410"))
            c.drawCircle(ex + 5, ey - ry * 0.4, 5.5, P("#FFFFFF"))
            if mood == "bored":   # párpado caído
                c.save(); c.clipRect(skia.Rect.MakeLTRB(ex - 20, ey - 30, ex + 20, ey + 2))
                c.drawOval(skia.Rect.MakeLTRB(ex - 18, ey - 26, ex + 18, ey + 26), P(skin))
                c.restore()
                c.drawLine(ex - 17, ey + 1, ex + 17, ey + 1, P(OUT, stroke=6))
        # cejas
        by = ey - (44 if mood == "surprised" else 34)
        tilt = {"bored": 0, "surprised": -6, "happy": -3, "open": -2, "worried": 8}.get(mood, 0)
        c.drawLine(ex - 15, by + (tilt if sx < 0 else 0), ex + 15, by + (0 if sx < 0 else tilt), P(OUT, stroke=7))
    # bigote
    my = hy + 40
    if mustache:
        m = skia.Path()
        m.moveTo(0, my - 4)
        m.cubicTo(-18, my - 18, -50, my - 14, -58, my + 6)
        m.cubicTo(-40, my + 2, -20, my + 10, 0, my + 4)
        m.cubicTo(20, my + 10, 40, my + 2, 58, my + 6)
        m.cubicTo(50, my - 14, 18, my - 18, 0, my - 4); m.close()
        c.drawPath(m, P("#3A2416"))
    # boca
    mo = clamp(mouth)
    myy = my + 30
    if mo > 0.08:
        hgt = 8 + 34 * mo
        mp = oval(0, myy + hgt / 2 - 4, 22 + 6 * mo, hgt / 2 + 2)
        fs(c, mp, "#7A1F1F", ow=5)
        c.save(); c.clipPath(mp)
        c.drawOval(skia.Rect.MakeLTRB(-16, myy + hgt * 0.55, 16, myy + hgt + 10), P("#E05A5A"))
        c.restore()
    else:
        p = skia.Path()
        if mood == "bored":
            p.moveTo(-16, myy + 2); p.lineTo(16, myy + 2)
        elif mood == "surprised":
            p.addOval(skia.Rect.MakeLTRB(-10, myy - 6, 10, myy + 12))
        else:
            p.moveTo(-22, myy - 2); p.quadTo(0, myy + 18, 22, myy - 2)
        c.drawPath(p, P(OUT, stroke=6))
    # sombrero
    if hat == "panama":
        hc = hat_col or "#E9C77F"
        fs(c, oval(0, hy - 98, 178, 30), hc)
        crown = skia.Path(); crown.moveTo(-96, -528); crown.quadTo(-100, -616, -60, -628)
        crown.quadTo(0, -606, 60, -628); crown.quadTo(100, -616, 96, -528); crown.close()
        fs(c, crown, hc)
        c.drawRect(skia.Rect.MakeLTRB(-97, -560, 97, -534), P(hat_col and "#2E2E2E" or "#5A321C"))
        c.drawLine(-97, -560, 97, -560, P(OUT, stroke=4)); c.drawLine(-97, -534, 97, -534, P(OUT, stroke=4))
    elif hat == "cap":
        hc = hat_col or "#6B5B4B"
        cap = skia.Path(); cap.moveTo(-120, -505); cap.quadTo(-110, -600, 10, -604)
        cap.quadTo(120, -598, 128, -520); cap.quadTo(150, -505, 168, -500); cap.lineTo(130, -488)
        cap.quadTo(0, -470, -120, -505); cap.close()
        fs(c, cap, hc)
        c.drawLine(-60, -585, 90, -520, P(OUT, stroke=3, a=80))
    elif hat == "bowler":
        hc = hat_col or "#2D2D33"
        fs(c, oval(0, -526, 150, 24), hc)
        fs(c, oval(0, -560, 100, 70), hc)
        fs(c, oval(0, -526, 150, 24), hc)
    c.restore()

def prop_draw(c, prop, t):
    kind = prop if isinstance(prop, str) else prop[0]
    if kind == "book":
        # libro abierto en las manos
        c.save(); c.translate(0, -215); c.rotate(-4 + math.sin(t * 2) * 2)
        fs(c, rrect(-118, -66, 118, 66, 10), "#8E2F2A")
        left = poly([(-108, -58), (-4, -50), (-4, 58), (-108, 52)]); fs(c, left, "#FFF9EC", ow=4)
        right = poly([(108, -58), (4, -50), (4, 58), (108, 52)]); fs(c, right, "#FFF9EC", ow=4)
        for i in range(5):
            yy = -32 + i * 18
            c.drawLine(-92, yy, -20, yy + 3, P(OUT, stroke=3, a=90)); c.drawLine(20, yy + 3, 92, yy, P(OUT, stroke=3, a=90))
        c.restore()
        for sx in (-1, 1): fs(c, oval(sx * 120, -205, 22, 22), "#FFF4E4")
    elif kind == "newspaper":
        c.save(); c.translate(0, -225); c.rotate(3 + math.sin(t * 2) * 2)
        fs(c, rrect(-140, -95, 140, 95, 6), "#F1EBDD")
        text_c(c, "EL DIARIO", 0, -48, 34, fill="#2A1B12", path=FONT_SERIF)
        c.drawLine(-120, -36, 120, -36, P(OUT, stroke=4))
        for i in range(6):
            yy = -12 + i * 16
            c.drawLine(-120, yy, -10, yy, P(OUT, stroke=4, a=110)); c.drawLine(10, yy, 120, yy, P(OUT, stroke=4, a=110))
        c.restore()
        for sx in (-1, 1): fs(c, oval(sx * 142, -215, 22, 22), "#FFF4E4")
    elif kind == "cigar":
        c.save(); c.translate(0, -175); c.rotate(math.sin(t * 6) * 6)
        fs(c, rrect(-70, -12, 70, 12, 12), "#7B4A26", ow=5)
        c.drawRect(skia.Rect.MakeLTRB(30, -12, 48, 12), P("#C9A227"))
        c.restore()
    elif kind == "mic":
        c.drawLine(0, -10, 0, -250, P("#3A3A3A", stroke=12))
        fs(c, oval(0, -275, 26, 34), "#4A4A4A", ow=5)
        for i in range(-2, 3): c.drawLine(-20, -275 + i * 9, 20, -275 + i * 9, P("#999999", stroke=2))

# ---------------------------------------------------------------- fondos
def sky(c, top="#7EC8F2", bottom="#FFE3B0"):
    c.drawRect(skia.Rect.MakeWH(W, H), lin_grad(0, 0, 0, 1300, [top, bottom]))

def cloud(c, x, y, s=1.0, a=235):
    c.save(); c.translate(x, y); c.scale(s, s)
    p = skia.Path()
    for (cx, cy, r) in [(-70, 10, 50), (-20, -20, 65), (45, -5, 55), (90, 15, 40), (0, 20, 50)]:
        p.addCircle(cx, cy, r)
    c.drawPath(p, P("#FFFFFF", a=a))
    c.restore()

def palm(c, x, y, s, t, ph=0):
    c.save(); c.translate(x, y); c.scale(s, s)
    sway = math.sin(t * 1.3 + ph) * 0.06
    trunk = skia.Path(); trunk.moveTo(-18, 0); trunk.quadTo(-30 + 0, -260, 30 + sway * 300, -520)
    trunk.lineTo(54 + sway * 300, -515); trunk.quadTo(0, -250, 18, 0); trunk.close()
    fs(c, trunk, "#8A5A32", ow=6)
    for i in range(9):
        yy = -50 - i * 52
        c.drawLine(-14 + i * 4.5, yy, 16 + i * 4.5, yy - 6, P(OUT, stroke=3, a=110))
    tx, ty = 42 + sway * 300, -520
    for k in range(7):
        ang = -2.9 + k * 0.48 + sway * 2 + math.sin(t * 2 + k + ph) * 0.04
        L = 220
        ex, ey = tx + math.cos(ang) * L, ty + math.sin(ang) * L * 0.75 + 60
        mx, my = tx + math.cos(ang) * L * 0.5, ty + math.sin(ang) * L * 0.5 - 50
        leaf = skia.Path(); leaf.moveTo(tx, ty)
        leaf.quadTo(mx - 20, my - 20, ex, ey); leaf.quadTo(mx + 20, my + 30, tx, ty); leaf.close()
        fs(c, leaf, "#3F9A4A" if k % 2 else "#2F8240", ow=5)
    fs(c, oval(tx, ty + 8, 20, 18), "#6B4A2A", ow=5)
    c.restore()

def exterior(c, t, sign="FÁBRICA DE TABACOS", warm=0.0):
    sky(c, "#6EC1F0" if warm < 0.5 else "#F3A86B", "#FFE6B8")
    c.drawCircle(860, 330, 110, rad_grad(860, 330, 260, [C("#FFF4C2", 255), C("#FFF4C2", 0)]))
    fs(c, oval(860, 330, 70, 70), "#FFE27A", ow=0)
    for i, (cx, cy, sc, sp) in enumerate([(200, 260, 1.0, 14), (620, 180, 0.8, 9), (980, 470, 0.7, 11)]):
        xx = (cx + t * sp) % (W + 400) - 200
        cloud(c, xx, cy, sc)
    # colinas
    hill = skia.Path(); hill.moveTo(0, 900); hill.quadTo(300, 760, 620, 880); hill.quadTo(860, 790, W, 860)
    hill.lineTo(W, 1100); hill.lineTo(0, 1100); hill.close(); c.drawPath(hill, P("#9CCB7A"))
    # edificio colonial
    bx0, bx1, by0, by1 = 90, 990, 700, 1380
    fs(c, rrect(bx0, by0, bx1, by1, 8), lin_grad(0, by0, 0, by1, ["#F4C86A", "#E3A94E"]))
    fs(c, rrect(bx0 - 25, by0 - 40, bx1 + 25, by0 + 10, 10), "#C4573A")
    for i in range(16):
        xx = bx0 - 20 + i * 61
        c.drawLine(xx, by0 - 36, xx, by0 + 6, P(OUT, stroke=3, a=90))
    for i in range(4):  # arcos
        ax = bx0 + 110 + i * 230
        arch = skia.Path(); arch.moveTo(ax - 75, by1); arch.lineTo(ax - 75, by0 + 330)
        arch.quadTo(ax - 75, by0 + 240, ax, by0 + 240); arch.quadTo(ax + 75, by0 + 240, ax + 75, by0 + 330)
        arch.lineTo(ax + 75, by1); arch.close()
        fs(c, arch, "#6A3B22")
        for k in range(1, 4):
            c.drawLine(ax - 75 + k * 37, by0 + 270, ax - 75 + k * 37, by1, P(OUT, stroke=3, a=120))
        fs(c, rrect(ax - 55, by0 + 70, ax + 55, by0 + 180, 6), "#7FC2D9")
        c.drawLine(ax, by0 + 70, ax, by0 + 180, P(OUT, stroke=4)); c.drawLine(ax - 55, by0 + 125, ax + 55, by0 + 125, P(OUT, stroke=4))
        fs(c, rrect(ax - 65, by0 + 176, ax + 65, by0 + 196, 4), "#C4573A", ow=4)
    # cartel
    fs(c, rrect(220, by0 + 10, 860, by0 + 62, 10), "#2F5D50")
    text_c(c, sign, 540, by0 + 50, 38, fill="#FCE7A8", path=FONT_SERIF)
    # suelo adoquinado
    c.drawRect(skia.Rect.MakeLTRB(0, by1, W, H), lin_grad(0, by1, 0, H, ["#CFB08A", "#A9865F"]))
    rnd = random.Random(3)
    for row in range(12):
        yy = by1 + 20 + row * 46
        off = (row % 2) * 40
        for col in range(-1, 15):
            xx = col * 80 + off
            c.drawRoundRect(skia.Rect.MakeLTRB(xx + 4, yy, xx + 74, yy + 38), 12, 12, P("#B89870", a=150 + rnd.randint(0, 80)))
    palm(c, 70, 1450, 1.15, t, 0)
    palm(c, 1010, 1470, 1.0, t, 1.7)

def interior(c, t, dim=0.0, beams=True):
    c.drawRect(skia.Rect.MakeWH(W, 1300), lin_grad(0, 0, 0, 1300, ["#C98A52", "#9C5E35"]))
    # ventanas en arco
    for wx in (250, 830):
        fr = skia.Path(); fr.moveTo(wx - 130, 900); fr.lineTo(wx - 130, 420); fr.quadTo(wx - 130, 290, wx, 290)
        fr.quadTo(wx + 130, 290, wx + 130, 420); fr.lineTo(wx + 130, 900); fr.close()
        fs(c, fr, "#5A3420")
        gl = skia.Path(); gl.moveTo(wx - 105, 880); gl.lineTo(wx - 105, 425); gl.quadTo(wx - 105, 315, wx, 315)
        gl.quadTo(wx + 105, 315, wx + 105, 425); gl.lineTo(wx + 105, 880); gl.close()
        c.drawPath(gl, lin_grad(0, 315, 0, 880, ["#BFE6F5", "#FFF1C9"]))
        c.save(); c.clipPath(gl)
        palm(c, wx - 40, 1000, 0.55, t, wx)
        c.restore()
        c.drawLine(wx, 315, wx, 880, P("#5A3420", stroke=12)); c.drawLine(wx - 105, 600, wx + 105, 600, P("#5A3420", stroke=12))
        fs(c, rrect(wx - 150, 890, wx + 150, 920, 6), "#7A4A2A", ow=5)
    # zócalo
    c.drawRect(skia.Rect.MakeLTRB(0, 1040, W, 1300), P("#6E3F22"))
    c.drawRect(skia.Rect.MakeLTRB(0, 1030, W, 1050), P("#8C5530"))
    c.drawLine(0, 1030, W, 1030, P(OUT, stroke=5))
    # suelo de madera con perspectiva
    c.drawRect(skia.Rect.MakeLTRB(0, 1300, W, H), lin_grad(0, 1300, 0, H, ["#8A5530", "#5E3519"]))
    for i in range(-6, 16):
        x0 = 540 + (i * 90 - 540) * 0.35
        c.drawLine(x0, 1300, i * 90, H, P("#4A2812", stroke=4, a=140))
    for k, yy in enumerate([1360, 1450, 1580, 1760]):
        c.drawLine(0, yy, W, yy, P("#4A2812", stroke=3, a=90))
    # haces de luz
    if beams:
        for wx in (250, 830):
            fl = 0.85 + 0.15 * math.sin(t * 1.7 + wx)
            beam = poly([(wx - 100, 420), (wx + 100, 420), (wx + 330, 1650), (wx - 60, 1650)])
            c.drawPath(beam, P("#FFF1B8", a=int(38 * fl), blur=18))
        rnd = random.Random(7)
        for i in range(40):
            px = rnd.uniform(100, 1000); py0 = rnd.uniform(400, 1600); sp = rnd.uniform(8, 25)
            py = py0 - (t * sp) % 1200
            if py < 380: py += 1200
            c.drawCircle(px + math.sin(t + i) * 10, py, rnd.uniform(2, 4.5), P("#FFF6D0", a=110))
    # lámparas colgantes
    for lx in (300, 780):
        ang = math.sin(t * 1.2 + lx) * 0.05
        c.save(); c.translate(lx, 0); c.rotate(math.degrees(ang))
        c.drawLine(0, 0, 0, 170, P(OUT, stroke=5))
        c.drawCircle(0, 220, 120, rad_grad(0, 220, 150, [C("#FFE7A0", 150), C("#FFE7A0", 0)]))
        fs(c, poly([(-60, 220), (-30, 170), (30, 170), (60, 220)]), "#2E5A47", ow=5)
        fs(c, oval(0, 226, 16, 14), "#FFF6C8", ow=4)
        c.restore()
    if dim > 0:
        c.drawRect(skia.Rect.MakeWH(W, H), P("#140A05", a=int(dim * 255)))

def table(c, y=1480, leaves=True, t=0):
    top = poly([(-20, y - 40), (W + 20, y - 40), (W + 20, y + 10), (-20, y + 10)])
    fs(c, top, "#C27B42")
    fs(c, rrect(-20, y + 10, W + 20, y + 170, 0), lin_grad(0, y, 0, y + 170, ["#9A5A2C", "#6E3C1B"]))
    for xx in range(60, W, 160):
        c.drawLine(xx, y + 25, xx + 40, y + 160, P("#5A2E12", stroke=3, a=80))
    if leaves:
        rnd = random.Random(11)
        for i in range(9):
            lx = 60 + i * 120 + rnd.uniform(-20, 20)
            c.save(); c.translate(lx, y - 25); c.rotate(rnd.uniform(-20, 20))
            fs(c, oval(0, 0, 42, 13), "#6E5A2A" if i % 2 else "#7D6630", ow=4)
            c.restore()
        for i in range(6):
            cx = 120 + i * 170
            fs(c, rrect(cx, y - 52, cx + 80, y - 38, 7), "#7B4A26", ow=4)

def vignette(c):
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(W / 2, H / 2, 1250, [C("#000000", 0), C("#000000", 0), C("#000000", 150)], [0, 0.55, 1]))

def chip(c, s, x, y, appear=1.0, bg="#FFD23F", fg="#1A120C"):
    a = clamp(appear)
    if a <= 0: return
    f = font(46)
    w = f.measureText(s) + 70
    c.save(); c.translate(x, y); sc = back(a); c.scale(sc, sc)
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(-w / 2 + 6, -38 + 8, w / 2 + 6, 38 + 8), 38, 38), P("#000000", a=90))
    fs(c, rrect(-w / 2, -38, w / 2, 38, 38), bg, ow=6)
    text_c(c, s, 0, 17, 46, fill=fg)
    c.restore()

def bulb(c, x, y, s, t, appear):
    a = clamp(appear)
    if a <= 0: return
    c.save(); c.translate(x, y); sc = back(a) * s; c.scale(sc, sc)
    c.drawCircle(0, 0, 220, rad_grad(0, 0, 230, [C("#FFF3A0", 200), C("#FFF3A0", 0)]))
    for k in range(10):
        ang = k * 36 + t * 40
        c.save(); c.rotate(ang)
        c.drawLine(0, -140, 0, -185, P("#FFD23F", stroke=12)); c.restore()
    glass = skia.Path(); glass.addCircle(0, -10, 95)
    fs(c, glass, "#FFE768", ow=8)
    fs(c, rrect(-42, 70, 42, 130, 10), "#9AA3AD", ow=7)
    for k in range(3): c.drawLine(-42, 85 + k * 16, 42, 85 + k * 16, P(OUT, stroke=4))
    p = skia.Path(); p.moveTo(-25, 60); p.lineTo(-20, 0); p.quadTo(0, -30, 20, 0); p.lineTo(25, 60)
    c.drawPath(p, P("#C98A00", stroke=6))
    c.drawOval(skia.Rect.MakeLTRB(-60, -80, -25, -30), P("#FFFFFF", a=170))
    c.restore()

def coin(c, x, y, r=34, spin=0.0):
    sx = abs(math.cos(spin)) * 0.85 + 0.15
    c.save(); c.translate(x, y); c.scale(sx, 1)
    fs(c, oval(0, 0, r, r), "#F4C430", ow=6)
    c.drawCircle(0, 0, r * 0.62, P("#C99A12", stroke=5))
    c.restore()

def jar(c, x, y, fill_level, t):
    c.save(); c.translate(x, y)
    body = skia.Path(); body.moveTo(-130, -260); body.quadTo(-170, -200, -160, -40)
    body.quadTo(-155, 20, -100, 20); body.lineTo(100, 20); body.quadTo(155, 20, 160, -40)
    body.quadTo(170, -200, 130, -260); body.close()
    c.save(); c.clipPath(body)
    lvl = -20 - 210 * clamp(fill_level)
    rnd = random.Random(5)
    for i in range(int(60 * clamp(fill_level)) + 1):
        cx = rnd.uniform(-140, 140); cy = rnd.uniform(lvl, 10)
        coin(c, cx, cy, 26, rnd.uniform(0, 3))
    c.restore()
    c.drawPath(body, P("#CFEFFF", a=70))
    c.drawPath(body, P(OUT, stroke=OW))
    c.drawLine(-110, -200, -120, -60, P("#FFFFFF", stroke=10, a=140))
    fs(c, rrect(-140, -290, 140, -255, 10), "#B07A3A", ow=6)
    c.restore()

def sparkle(c, x, y, s, a=255):
    c.save(); c.translate(x, y); c.scale(s, s)
    p = skia.Path(); p.moveTo(0, -40); p.quadTo(6, -6, 40, 0); p.quadTo(6, 6, 0, 40)
    p.quadTo(-6, 6, -40, 0); p.quadTo(-6, -6, 0, -40); p.close()
    c.drawPath(p, P("#FFF6B0", a=a)); c.restore()

def burst(c, t, c1="#FFC93C", c2="#FF9F1C"):
    c.drawRect(skia.Rect.MakeWH(W, H), P(c2))
    c.save(); c.translate(W / 2, H * 0.45); c.rotate(t * 12)
    for k in range(16):
        c.save(); c.rotate(k * 22.5)
        c.drawPath(poly([(0, 0), (-160, -1800), (160, -1800)]), P(c1)); c.restore()
    c.restore()
    c.drawRect(skia.Rect.MakeWH(W, H), rad_grad(W / 2, H * 0.45, 900, [C("#FFFFFF", 90), C("#FFFFFF", 0)]))

# ---------------------------------------------------------------- subtítulos
def captions(c, words, t, y=800):
    """words: lista (inicio, fin, texto). Muestra grupos de 1-3 palabras; resalta la actual."""
    groups, cur = [], []
    for w in words:
        cur.append(w)
        n = sum(len(x[2]) for x in cur)
        if len(cur) >= 3 or n > 13 or w[2][-1:] in ".,:?!;":
            groups.append(cur); cur = []
    if cur: groups.append(cur)
    g = None
    for i, gr in enumerate(groups):
        end = groups[i + 1][0][0] if i + 1 < len(groups) else gr[-1][1] + 0.4
        if gr[0][0] - 0.03 <= t < min(end, gr[-1][1] + 0.5):
            g = gr
    if not g: return
    size = 112
    f = font(size)
    toks = [w[2].upper() for w in g]
    widths = [f.measureText(s) for s in toks]
    space = f.measureText(" ")
    lines, line, lw = [], [], 0
    for i, wd in enumerate(widths):
        if line and lw + space + wd > W - 120:
            lines.append((line, lw)); line, lw = [], 0
        lw = lw + (space if line else 0) + wd; line.append(i)
    if line: lines.append((line, lw))
    age = t - g[0][0]
    sc = 0.85 + 0.15 * back(age / 0.18)
    c.save(); c.translate(W / 2, y); c.scale(sc, sc)
    for li, (idxs, lwid) in enumerate(lines):
        x = -lwid / 2
        yy = (li - (len(lines) - 1) / 2) * 128 + 40
        for i in idxs:
            active = g[i][0] - 0.02 <= t
            c.drawString(toks[i], x + 5, yy + 8, f, P("#000000", stroke=26, a=120))
            c.drawString(toks[i], x, yy, f, P("#140C08", stroke=22))
            c.drawString(toks[i], x, yy, f, P("#FFD23F" if (active and g[i] is current_word(g, t)) else "#FFFFFF"))
            x += widths[i] + space
    c.restore()

def current_word(g, t):
    cur = g[0]
    for w in g:
        if w[0] - 0.02 <= t: cur = w
    return cur
