#!/bin/bash
# Saca fotogramas sueltos para revisar antes del render completo. Uso: bash still.sh 120 400 900 ...
set -e
cd "$(dirname "$0")/app"
CHROME=$(command -v google-chrome || command -v chromium || true)
BX=""; [ -n "$CHROME" ] && BX="--browser-executable=$CHROME"
mkdir -p ../stills
for fr in "$@"; do npx remotion still src/index.ts Noticias ../stills/f$fr.png --frame=$fr $BX --log=error >/dev/null && echo "stills/f$fr.png"; done
