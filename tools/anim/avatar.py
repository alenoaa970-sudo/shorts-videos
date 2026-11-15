import math, skia, sys
from engine import *
S = 800
def make(path, bg1, bg2, rays, shirt="#F6F2E6", hat_col=None, mood="happy"):
    surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(S, S, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
    c = surf.getCanvas(); c.clear(C(bg2))
    c.save(); c.translate(S/2, S*0.5)
    for k in range(14):
        c.save(); c.rotate(k * 360/14)
        c.drawPath(poly([(0, 0), (-90, -700), (90, -700)]), P(rays)); c.restore()
    c.restore()
    c.drawRect(skia.Rect.MakeWH(S, S), rad_grad(S/2, S*0.45, 420, [C(bg1, 255), C(bg1, 0)]))
    character(c, S/2, 1240, 1.85, 0.0, shirt=shirt, mood=mood, mouth=0.35, hat_col=hat_col, bob=False)
    surf.makeImageSnapshot().save(path)
out = "/home/claude/shorts-videos/branding/"
make(out + "perfil-A-amarillo.png", "#FFE680", "#FFB703", "#FFD23F")
make(out + "perfil-B-turquesa.png", "#9FF0DF", "#1FA58F", "#4CC9B0")
make(out + "perfil-C-rojo.png", "#FF9A8A", "#C8372D", "#E85A4F", hat_col="#E9C77F")
