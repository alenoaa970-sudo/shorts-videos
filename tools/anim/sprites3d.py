import sys, skia
from engine import *
OUTD = sys.argv[1]
def sprite(name, **kw):
    s = skia.Surface.MakeRaster(skia.ImageInfo.Make(600, 1000, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
    c = s.getCanvas(); c.clear(skia.ColorTRANSPARENT)
    character(c, 300, 985, 1.38, 0.0, bob=False, **kw)
    s.makeImageSnapshot().save(f"{OUTD}/{name}.png")
OL = dict(shirt="#6E7B4B", pants="#4A5233", hat="cap", hat_col="#55603A")
sprite("lift", mood="happy", arm_l=3.0, arm_r=-3.0, **OL)
sprite("lift2", mood="surprised", arm_l=2.9, arm_r=-2.9, mustache=False, **OL)
sprite("idle", mood="open", arm_l=0.25, arm_r=-0.25, **OL)
sprite("point", mood="happy", arm_l=0.25, arm_r=-2.0, **OL)
sprite("wow", mood="surprised", arm_l=0.6, arm_r=-0.6, mustache=False, **OL)
sprite("painter", mood="happy", arm_l=0.2, arm_r=-1.4, prop="book", shirt="#E9E2D0", pants="#4A5233", hat="bowler", hat_col="#5B3F6B")
sprite("actor", mood="happy", arm_l=2.2, arm_r=-2.4, shirt="#C8372D", pants="#3B3B44", hat="panama", hat_col="#E9C77F")
sprite("sound", mood="open", arm_l=0.3, arm_r=-1.0, prop="mic", shirt="#CFE3F2", pants="#4A5233", hat="cap", hat_col="#3F5A6B")
print("ok")
