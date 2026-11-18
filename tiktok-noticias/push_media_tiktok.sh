#!/bin/bash
# Sube un vídeo a la rama "media-tiktok" (se sobrescribe cada vez) y escribe su enlace público.
# Uso: bash push_media_tiktok.sh out/final.mp4 noticias-2026-11-19.mp4
set -e
V="$(realpath "$1")"; NAME="$2"
TMP="$(mktemp -d)"; cp "$V" "$TMP/$NAME"; cd "$TMP"
git init -q && git checkout -q -b media-tiktok && git add "$NAME"
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "media-tiktok: $NAME"
git remote add origin https://github.com/alenoaa970-sudo/shorts-videos
git push -q -f origin media-tiktok
echo "https://raw.githubusercontent.com/alenoaa970-sudo/shorts-videos/media-tiktok/$NAME"
