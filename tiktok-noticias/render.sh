#!/bin/bash
# Genera el vídeo completo a partir de guion.json: voz -> línea de tiempo -> render -> sonido -> out/final.mp4
# Uso: bash render.sh            (lee guion.json de esta carpeta)
set -e
cd "$(dirname "$0")"
pip install -q --break-system-packages edge-tts numpy 2>&1 | grep -v -i warning || true
[ -d app/node_modules ] || (cd app && npm ci --silent)
mkdir -p audio out
python3 -I tts.py audio guion.json
python3 -I timeline.py
python3 -I mix.py
CHROME=$(command -v google-chrome || command -v chromium || true)
BX=""; [ -n "$CHROME" ] && BX="--browser-executable=$CHROME"
(cd app && npx remotion render src/index.ts Noticias ../out/video_mudo.tmp.mp4 --muted --codec=h264 --crf=18 --x264-preset=veryfast --concurrency=2 $BX --log=error)
mv out/video_mudo.tmp.mp4 out/video_mudo.mp4
ffmpeg -y -v error -i out/video_mudo.mp4 -i out/mezcla.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/final.tmp.mp4
mv out/final.tmp.mp4 out/final.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/final.mp4
