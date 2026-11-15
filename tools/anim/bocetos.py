import skia, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import charaggro as CA
F = ImageFont.truetype("/usr/share/fonts/opentype/inter/InterDisplay-Black.otf", 44)
F2 = ImageFont.truetype("/usr/share/fonts/opentype/inter/InterDisplay-Black.otf", 24)
def render(**kw):
    s = skia.Surface.MakeRaster(skia.ImageInfo.Make(600, 1000, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
    c = s.getCanvas(); c.clear(skia.ColorTRANSPARENT); CA.brute(c, 300, 985, 0.8 if kw.get("bulk", 1) > 1 else 0.92, **kw)
    return Image.fromarray(s.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType))
CAST = [dict(mood="shout", arms=((2.8, 0.15), (2.8, 0.15)), extras=("scar",), seed=1),
        dict(role="painter", mood="grin", arms=((0.3, -0.4), (1.1, 1.2)), seed=7),
        dict(mood="angry", arms=((0.25, -1.6), (0.25, -1.6)), skin="#8D5A3B", extras=("warpaint",), seed=6),
        dict(role="sound", mood="angry", arms=((0.3, -0.4), (1.5, 1.5)), seed=9)]
def style_a(): return [render(**k) for k in CAST]
def style_noir():
    CA.RIM = "#E0302A"; out = []
    for k in CAST:
        im = render(**k).convert("RGBA"); a = im.split()[3]
        g = ImageOps.grayscale(im.convert("RGB")); g = ImageOps.autocontrast(g, cutoff=2)
        g = g.point(lambda v: 8 if v < 95 else (60 if v < 150 else (140 if v < 205 else 225)))
        rgb = Image.merge("RGB", (g, g, g)); arr = np.array(rgb); src = np.array(im.convert("RGB"))
        red = (src[:, :, 0] > 180) & (src[:, :, 1] < 120)
        arr[red] = [220, 40, 36]
        o = Image.fromarray(arr); o.putalpha(a); out.append(o)
    CA.RIM = "#FF8A3D"; return out
def style_brute():
    out = []
    for k in CAST:
        kk = dict(k); kk["bulk"] = 1.55; kk["headk"] = 0.8; kk["stance"] = 0.3
        out.append(render(**kk))
    return out
def style_poster():
    out = []
    pal = [(24, 20, 22), (178, 34, 34), (232, 214, 170), (246, 236, 210)]
    for k in CAST:
        im = render(**k); a = im.split()[3]
        g = np.array(ImageOps.grayscale(im.convert("RGB")))
        lut = np.zeros((256, 3), np.uint8)
        for v in range(256): lut[v] = pal[0] if v < 55 else (pal[1] if v < 115 else (pal[2] if v < 185 else pal[3]))
        o = Image.fromarray(lut[g]); o.putalpha(a); out.append(o)
    return out
rows = [("A · CÓMIC DE GUERRA", "#3A3530", style_a()), ("B · NOIR (negro + rojo)", "#1A1A1C", style_noir()),
        ("C · MUSCULOSOS EXAGERADOS", "#2E3A2E", style_brute()), ("D · CARTEL DE PROPAGANDA", "#E8D9B0", style_poster())]
for lab, bg, ims in rows:
    sheet = Image.new("RGB", (1400, 560), bg); d = ImageDraw.Draw(sheet)
    d.text((30, 18), lab, font=F, fill="#FFD23F" if bg != "#E8D9B0" else "#B22222")
    for i, im in enumerate(ims):
        t = im.resize((270, 450)); sheet.paste(t, (40 + i * 340, 95), t)
    sheet.save(f"/mnt/user-data/outputs/boceto-{lab[0]}.png")
print("ok")
