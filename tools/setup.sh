#!/bin/bash
# Prepara el entorno para generar vídeos (se ejecuta al empezar cada tarea programada)
pip install -q --break-system-packages skia-python edge-tts numpy 2>&1 | grep -v -i warning || true
python3 -c "import skia, edge_tts, numpy; print('entorno listo')"
