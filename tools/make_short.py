"""Genera un YouTube Short vertical (1080x1920) a partir de un JSON:
{"slug": "...", "title": "TEXTO CABECERA", "script": "texto narrado", "voice": "es-ES-AlvaroNeural"}
Uso: python3 make_short.py historia.json salida.mp4
"""
import sys, json, asyncio, math, os, subprocess, tempfile, random
import certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

async def tts(text, voice, out):
    c = edge_tts.Communicate(text, voice, rate="+6%", boundary="WordBoundary")
    words = []
    with open(out, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7; d = ch["duration"] / 1e7
                words.append((s, s + d, ch["text"]))
    return words

def chunks(words, n=3):
    out, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= n or w[2].endswith((".", ",", "?", "!", ":")):
            out.append(cur); cur = []
    if cur: out.append(cur)
    return out

def wrap(draw, text, font, maxw):
    lines, line = [], ""
    for w in text.split():
        t = (line + " " + w).strip()
        if draw.textlength(t, font=font) <= maxw: line = t
        else: lines.append(line); line = w
    if line: lines.append(line)
    return lines

def main(cfg_path, out_path):
    cfg = json.load(open(cfg_path))
    tmp = tempfile.mkdtemp()
    audio = os.path.join(tmp, "voz.mp3")
    words = asyncio.run(tts(cfg["script"], cfg.get("voice", "es-ES-AlvaroNeural"), audio))
    dur = float(subprocess.check_output(["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", audio]).strip()) + 0.6
    groups = chunks(words)
    random.seed(cfg.get("slug", "x"))
    hue = cfg.get("colors", [(18, 24, 58), (90, 20, 70)])
    c1, c2 = hue
    stars = [(random.randint(0, W), random.randint(0, H), random.randint(2, 5), random.random() * 6.28) for _ in range(70)]
    ft = ImageFont.truetype(FB, 64); fc = ImageFont.truetype(FB, 96); fs = ImageFont.truetype(FB, 40)
    # fondo base (gradiente)
    base = Image.new("RGB", (W, H))
    bd = ImageDraw.Draw(base)
    for y in range(H):
        t = y / H
        bd.line([(0, y), (W, y)], fill=tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3)))
    title_lines = wrap(bd, cfg["title"], ft, W - 160)
    frames_dir = os.path.join(tmp, "f"); os.makedirs(frames_dir)
    n = int(dur * FPS)
    for i in range(n):
        t = i / FPS
        im = base.copy(); d = ImageDraw.Draw(im)
        for (x, y, r, ph) in stars:
            a = int(120 + 100 * math.sin(t * 2 + ph))
            yy = (y - t * 25 * r) % H
            d.ellipse([x - r, yy - r, x + r, yy + r], fill=(a, a, min(255, a + 40)))
        # cabecera
        y0 = 190
        box_h = len(title_lines) * 80 + 50
        d.rounded_rectangle([60, y0 - 25, W - 60, y0 - 25 + box_h], 30, fill=(255, 196, 0))
        for k, ln in enumerate(title_lines):
            d.text((W / 2, y0 + 15 + k * 80), ln, font=ft, fill=(20, 20, 20), anchor="mt")
        # subtítulo actual
        cur = None
        for g in groups:
            if g[0][0] - 0.05 <= t <= g[-1][1] + 0.35: cur = g
        if cur:
            txt = " ".join(w[2] for w in cur).upper()
            lines = wrap(d, txt, fc, W - 140)
            pop = min(1.0, (t - cur[0][0] + 0.05) / 0.12)
            yc = H / 2 - len(lines) * 60 + (1 - pop) * 30
            for k, ln in enumerate(lines):
                d.text((W / 2, yc + k * 120), ln, font=fc, fill=(255, 255, 255), anchor="mt",
                       stroke_width=8, stroke_fill=(0, 0, 0))
        # barra de progreso
        d.rounded_rectangle([80, H - 260, W - 80, H - 240], 10, fill=(255, 255, 255, 60))
        d.rounded_rectangle([80, H - 260, 80 + (W - 160) * (t / dur), H - 240], 10, fill=(255, 196, 0))
        d.text((W / 2, H - 200), cfg.get("footer", "Historias curiosas"), font=fs, fill=(230, 230, 230), anchor="mt")
        im.save(os.path.join(frames_dir, f"{i:05d}.jpg"), quality=88)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(frames_dir, "%05d.jpg"),
                    "-i", audio, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out_path], check=True)
    print(f"OK {out_path} {dur:.1f}s")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
