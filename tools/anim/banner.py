import math, skia
from engine import *
BW, BH = 2048, 1152
surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(BW, BH, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
c = surf.getCanvas()
c.drawRect(skia.Rect.MakeWH(BW, BH), lin_grad(0, 0, BW, BH, ["#1B1F3B", "#2E1F47"]))
# rayos suaves desde Don Tito
c.save(); c.translate(560, 560)
for k in range(18):
    c.save(); c.rotate(k * 20); c.drawPath(poly([(0, 0), (-70, -1500), (70, -1500)]), P("#FFD23F", a=18)); c.restore()
c.restore()
c.drawRect(skia.Rect.MakeWH(BW, BH), rad_grad(560, 560, 600, [C("#FFD23F", 70), C("#FFD23F", 0)]))
# iconos flotando: moneda, interrogación, pergamino
def icon_coin(x, y, s):
    coin(c, x, y, 46 * s, 0)
def icon_q(x, y, s):
    text_c(c, "?", x, y + 40 * s, 130 * s, fill="#7FD4C1", stroke="#140C08", sw=10)
def icon_scroll(x, y, s):
    c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-8)
    fs(c, rrect(-60, -45, 60, 45, 8), "#F6ECD2", ow=6)
    for i in range(3): c.drawLine(-40, -18 + i * 18, 40, -18 + i * 18, P(OUT, stroke=4, a=120))
    fs(c, oval(-62, 0, 14, 48), "#E3CFA0", ow=5); fs(c, oval(62, 0, 14, 48), "#E3CFA0", ow=5)
    c.restore()
for (fn, x, y, s) in [(icon_coin, 1700, 330, 1.1), (icon_q, 1840, 560, 1.0), (icon_scroll, 1720, 790, 1.2),
                      (icon_coin, 240, 330, 0.8), (icon_q, 130, 820, 0.8), (icon_coin, 1950, 870, 0.7), (icon_scroll, 300, 950, 0.8)]:
    fn(x, y, s)
# Don Tito (dentro de la zona segura: x 406-1641, y 407-745)
character(c, 560, 966, 0.85, 0.0, mood="happy", mouth=0.45, arm_r=-2.3, arm_l=0.2, bob=False)
# textos
text_c(c, "HISTORIAS REALES", 1190, 530, 92, fill="#FFD23F", stroke="#140C08", sw=16)
text_c(c, "QUE NO TE CONTARON", 1185, 610, 56, fill="#FFFFFF", stroke="#140C08", sw=12)
# tres temas
for i, (lab, col) in enumerate([("DINERO", "#FFD23F"), ("MISTERIOS", "#7FD4C1"), ("HISTORIA", "#FF8A65")]):
    x = 935 + i * 250
    f = font(38); w = f.measureText(lab) + 50
    fs(c, rrect(x - w / 2, 645, x + w / 2, 707, 31), col, ow=6)
    text_c(c, lab, x, 690, 38, fill="#1A120C")
text_c(c, "Nuevo vídeo: lunes · miércoles · viernes · sábado", 1185, 830, 40, fill="#E8E2F5")
surf.makeImageSnapshot().save("/home/claude/shorts-videos/branding/banner-informativo.png")
print("ok")
