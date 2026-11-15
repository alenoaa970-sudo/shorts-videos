#!/bin/bash
# Sube un vídeo a la rama "media" (se sobrescribe cada vez, para que el repositorio no crezca)
# y escribe su enlace público. Uso: tools/push_media.sh videos/003-xxx.mp4
set -e
V="$(realpath "$1")"; NAME="$(basename "$V")"
TMP="$(mktemp -d)"; cp "$V" "$TMP/$NAME"; cd "$TMP"
git init -q && git checkout -q -b media && git add "$NAME"
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "media: $NAME"
git remote add origin https://github.com/alenoaa970-sudo/shorts-videos
git push -q -f origin media
echo "https://raw.githubusercontent.com/alenoaa970-sudo/shorts-videos/media/$NAME"
