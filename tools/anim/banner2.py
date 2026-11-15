import math, random, skia
from engine import *
BW, BH = 2048, 1152
surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(BW, BH, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
c = surf.getCanvas()
# pared oscura + tablero de corcho de investigación
c.drawRect(skia.Rect.MakeWH(BW, BH), lin_grad(0, 0, 0, BH, ["#1A1410", "#0E0A08"]))
fs(c, rrect(60, 120, BW - 60, BH - 120, 20), lin_grad(0, 120, 0, BH, ["#B07A44", "#8A5A30"]), ow=14, outline="#3A2416")
rnd = random.Random(9)
for i in range(900):
    c.drawCircle(rnd.uniform(80, BW - 80), rnd.uniform(140, BH - 140), rnd.uniform(1, 3), P("#5A3A1E", a=90))
pins = []
def note(x, y, w, h, ang, kind, label=None):
    c.save(); c.translate(x, y); c.rotate(ang)
    c.drawRect(skia.Rect.MakeLTRB(-w / 2 + 8, -h / 2 + 10, w / 2 + 8, h / 2 + 10), P("#000000", a=90, blur=6))
    fs(c, rrect(-w / 2, -h / 2, w / 2, h / 2, 4), "#F6ECD2" if kind != "photo" else "#FFFFFF", ow=5)
    if kind == "photo":
        c.drawRect(skia.Rect.MakeLTRB(-w / 2 + 14, -h / 2 + 14, w / 2 - 14, h / 2 - 40), P("#3B3F55"))
    if label:
        text_c(c, label, 0, h / 2 - 14 if kind == "photo" else 12, 26, fill="#2A1B12", path=FONT_SERIF)
    c.restore()
    pins.append((x, y - h / 2 + 18))
    return c
def draw_in(x, y, ang, fn):
    c.save(); c.translate(x, y); c.rotate(ang); fn(); c.restore()
# notas y "fotos" con dibujos sencillos
note(300, 330, 220, 240, -6, "photo", "1865")
draw_in(300, 315, -6, lambda: (text_c(c, "?", 0, 40, 120, fill="#FFD23F")))
note(1760, 320, 240, 250, 5, "photo", "2010")
draw_in(1760, 305, 5, lambda: [fs(c, oval(0, 0, 70, 70), "#F2C14E", ow=5), [fs(c, oval(math.cos(k)*40, math.sin(k)*40, 10, 10), "#B3262A", ow=3) for k in range(6)]])
note(270, 820, 260, 170, 4, "paper", "¿CASUALIDAD?")
note(1790, 830, 280, 170, -5, "paper", "41 $  →  ???")
note(1530, 560, 200, 220, 8, "photo", "1896")
draw_in(1530, 545, 8, lambda: [coin(c, 0, 0, 50, 0)])
note(520, 560, 190, 200, -9, "photo", "")
draw_in(520, 545, -9, lambda: text_c(c, "!", 0, 45, 120, fill="#FF8A65"))
# hilos rojos
hub = (1180, 760)
for (px, py) in pins:
    p = skia.Path(); p.moveTo(px, py); p.quadTo((px + hub[0]) / 2, max(py, hub[1]) + 40, hub[0], hub[1])
    c.drawPath(p, P("#C8372D", stroke=5))
for (px, py) in pins + [hub]:
    c.drawCircle(px + 3, py + 4, 13, P("#000000", a=90)); fs(c, oval(px, py, 13, 13), "#E53935", ow=4)
# foco de linterna
c.drawRect(skia.Rect.MakeWH(BW, BH), rad_grad(1020, 590, 900, [C("#000000", 0), C("#000000", 0), C("#000000", 190)], [0, 0.45, 1]))
c.drawRect(skia.Rect.MakeWH(BW, BH), rad_grad(1060, 570, 520, [C("#FFE9A0", 70), C("#FFE9A0", 0)]))
# personaje con lupa (dentro de la zona segura)
character(c, 640, 966, 0.85, 0.0, mood="surprised", mouth=0.0, arm_r=-2.0, arm_l=0.2, bob=False, look=(10, -4),
          shirt="#E9E2D0", hat="bowler")
c.save(); c.translate(800, 520); c.rotate(-25)
c.drawLine(0, 60, 0, 150, P("#5A321C", stroke=18))
c.drawCircle(0, 0, 62, P("#BFE6F5", a=110)); c.drawCircle(0, 0, 62, P(OUT, stroke=12)); c.drawCircle(0, 0, 62, P("#C9A227", stroke=7))
c.restore()
# texto
c.save(); c.translate(1230, 560); c.rotate(-3)
fs(c, rrect(-360, -95, 360, 25, 14), "#F6ECD2", ow=7)
text_c(c, "ESTO PASÓ", 0, 0, 92, fill="#1A120C", path=FONT_SERIF)
c.restore()
c.save(); c.translate(1250, 680); c.rotate(2)
fs(c, rrect(-330, -70, 330, 30, 12), "#E53935", ow=7)
text_c(c, "DE VERDAD.", 0, 2, 80, fill="#FFFFFF", path=FONT_SERIF)
c.restore()
surf.makeImageSnapshot().save("/home/claude/shorts-videos/branding/banner-investigacion.png")
print("ok")
