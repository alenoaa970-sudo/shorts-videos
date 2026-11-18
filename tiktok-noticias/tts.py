import asyncio, json, sys, os, ssl, edge_tts, edge_tts.communicate as ec
ec._SSL_CTX = ssl.create_default_context(cafile=os.path.expanduser("~/.ccr/ca-bundle.crt"))
PROXY = os.environ.get("HTTPS_PROXY")

VOICE = "es-ES-AlvaroNeural"
RATE = "+20%"
PITCH = "+0Hz"

G = json.load(open(sys.argv[2] if len(sys.argv) > 2 else "guion.json"))
SEGMENTS = [(x["key"], x["text"]) for x in G["segments"]]

async def one(key, text, outdir):
    com = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary", proxy=PROXY)
    words = []
    with open(f"{outdir}/{key}.mp3", "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "w": chunk["text"]})
    return {"key": key, "text": text, "words": words}

async def main(outdir):
    res = []
    for k, t in SEGMENTS:
        res.append(await one(k, t, outdir))
    json.dump(res, open(f"{outdir}/words.json", "w"), ensure_ascii=False, indent=1)

asyncio.run(main(sys.argv[1]))
