import json, math
FPS = 30
PAD = 0.25
END_PAD = 0.7
G = json.load(open("guion.json"))
META = {x["key"]: {"title": x.get("title", ""), "costume": x.get("costume", "anchor"), "serious": x.get("serious", False), "tag": ""} for x in G["segments"]}
data = json.load(open("audio/words.json"))
t = 0.0
segs = []
for i, s in enumerate(data):
    w = s["words"]
    end = w[-1]["t"] + w[-1]["d"]
    dur = end + (END_PAD if i == len(data) - 1 else PAD)
    start_f = round(t * FPS)
    end_f = round((t + dur) * FPS)
    words = [{"w": x["w"], "s": round((t + x["t"]) * FPS), "e": round((t + x["t"] + x["d"]) * FPS)} for x in w]
    segs.append({"key": s["key"], "from": start_f, "dur": end_f - start_f, "audioStart": t, "words": words, **META[s["key"]]})
    t += dur
total = round(t * FPS)
json.dump({"fps": FPS, "total": total, "tipo": G.get("tipo", "diario"), "segments": segs}, open("app/src/timeline.json", "w"), ensure_ascii=False, indent=1)
print("total s", round(t, 2), "frames", total)
for s in segs:
    print(s["key"], s["from"], s["dur"])
