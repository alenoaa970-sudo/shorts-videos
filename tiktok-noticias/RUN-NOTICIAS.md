# Vídeo de noticias para TikTok con el robot Noti (instrucciones para cada tarea programada)

Todo se hace sin pedir el visto bueno de Alejandro. Responde siempre en español. No uses su ordenador.

Hay dos tipos de vídeo:
- **Diario** (cada día a la 1:00, hora de Madrid): las noticias más importantes del **día anterior** (de 00:00 a 23:59, hora de Madrid).
- **Semanal** (domingos ~22:00): el resumen de lo más importante de la **semana** (de lunes a domingo).

## Reglas de Alejandro (obligatorias)
1. **Solo noticias importantes de verdad**: política, economía y dinero (mercados, empleo, precios, impuestos, empresas grandes), accidentes y catástrofes, guerras y conflictos, sucesos graves, grandes acontecimientos y decisiones de gobiernos o tribunales.
2. **NO** meter: el tiempo (salvo un temporal grave con muertos o alerta roja), curiosidades, ciencia ligera, famosos, cotilleos, estadísticas blandas tipo "suben los nacimientos" ni deportes (salvo algo histórico).
3. **No separar España y el mundo.** Nada de etiquetas "España"/"Mundo" ni frases como "en el mundo...". Es un bloque único, ordenado por importancia, pensado para público de España.
4. **Más información en cada noticia**: qué pasó, quién, dónde, cifras concretas y por qué importa. Mejor **4 o 5 noticias bien contadas** que 7 con una frase.
5. **Duración máxima: 1 minuto** (el habla total debe quedar en ≤ 57 s; `timeline.py` imprime el total y tiene que ser ≤ 59,8 s).
6. Humor solo como toque ligero (1 o 2 bromas cortas como mucho) y **nunca** en noticias de muertes, víctimas, guerras o tragedias (en esas: `"serious": true`, robot serio, sin chistes). Neutralidad política total: no reírse de un partido o político más que de otro.
7. Máxima calidad visual desde el primer intento: escenas con mucho detalle y animación (ver apartado 3).

## 0. Preparar
```bash
git clone --depth 1 https://github.com/alenoaa970-sudo/shorts-videos /home/claude/shorts-videos   # si no existe ya
cd /home/claude/shorts-videos/tiktok-noticias
(cd app && npm ci --silent)
pip install -q --break-system-packages edge-tts numpy
```
Lee `HISTORIAL-NOTICIAS.md` y, para el semanal, los guiones de la semana en `guiones/`.

## 1. Investigar
- Usa WebSearch (varias búsquedas distintas: portadas de EFE, Europa Press, RTVE, El País, El Mundo, BBC, Reuters...). Fecha de hoy con la herramienta de hora.
- Elige las 4-5 noticias más importantes según las reglas. **Comprueba cada dato en al menos 2 fuentes.** Si algo no se puede confirmar, no lo digas.
- Semanal: las 5 más importantes de lunes a domingo (puedes apoyarte en `guiones/` de esos días, pero comprueba si hubo novedades).

## 2. Guion (`guion.json`)
Copia `EJEMPLO-guion.json` a `guion.json` y rellénalo. Campos de cada segmento:
- `key`: identificador corto (sin espacios). El primero siempre `"intro"`.
- `text`: lo que dice el robot. Números en letra ("mil quinientas"), siglas como se pronuncian, "Xi Jinping" → "Shi Jinping". Frases cortas y claras.
- `title`: titular en MAYÚSCULAS, ≤ 32 caracteres.
- `costume`: disfraz del robot (ver apartado 3).
- `serious`: `true` en tragedias, guerras, víctimas.
- `sfx`: efectos `[palabra, sonido, volumen]` (sonidos: whoosh, whip, vine-boom, anime-wow, ding, switch, mouse-click, thunder, impact). Nada cómico en noticias serias (allí solo `impact` suave).
- Raíz: `"fecha": "AAAA-MM-DD"`, `"tipo": "diario"` o `"semanal"` (el semanal cambia los textos de la intro solo).

Intro diaria: "¡Las noticias más importantes de las últimas veinticuatro horas, en un minuto! ¡Vamos!". Intro semanal: "¡Lo más importante de la semana, en un minuto! ¡Vamos!" (la intro debe contener la palabra "minuto" y "vamos").
Cierre: la última noticia termina con "¡Sígueme para más!".

Después: `python3 -I tts.py audio guion.json && python3 -I timeline.py`. Si el total pasa de 59,8 s, acorta el texto y repite.

## 3. Escenas (código en `app/src/`)
- `Scenes.tsx`: una escena por noticia (fondo + elementos animados). **Escribe una escena NUEVA para cada noticia** usando las existentes como ejemplo (DebateScene, CanariasScene, IranScene, ChinaScene...). Cosas que funcionan bien: mapas sencillos con marcadores que laten, contadores que suben hasta la cifra, tarjetas con datos (`Pill`), banderas (`USFlag`, `ChinaFlag`, `RussiaFlag`; crea otras si hace falta), iconos, rayos, focos, partículas.
- Sincroniza cada elemento con lo que dice el robot con `wordAt(seg, 'palabra')` + `pop()`.
- **Zonas de pantalla**: titular arriba (hasta y≈450). Contenido de la escena entre y≈470 y y≈960. Subtítulos en y≈975–1100. Robot debajo. Nada importante debajo de y≈1440 ni a la derecha del todo.
- **Nada de caras ni caricaturas de personas reales**: usa atriles con nombre, banderas, mapas, iconos.
- Registra cada escena en `SCENES` de `Main.tsx` con la misma `key` del guion. Si quieres un comportamiento especial del robot (objeto, expresión en una palabra concreta), añade un `case` en `robotFor`; si no, se usa el de por defecto según `costume` y `serious`.
- **Disfraces del robot** (`Robot.tsx`, lámina de prueba: composición `Disfraces`): anchor (presentador), boxing (debate o enfrentamiento político), vest (rescate o crisis humanitaria), raincoat (temporal), helmet (guerra o militar), diplomat (cumbres y diplomacia, con banderas), astronaut (espacio), business (economía y dinero, con maletín), firefighter (accidentes, incendios, catástrofes), judge (tribunales y justicia, con mazo), baby. Si una noticia pide otro (policía, médico, obrero...), **dibújalo nuevo** en Robot.tsx con el mismo nivel de detalle.
- Borra de `SCENES` las escenas que ya no se usen solo si molestan; puedes dejarlas como biblioteca.

## 4. Revisar y renderizar
- `npx tsc -p app` sin errores.
- `bash still.sh <frames>`: saca 1 o 2 fotogramas por noticia (mira `app/src/timeline.json` para los `from`) y **míralos con Read**: nada solapado, texto legible, nada tapado por los subtítulos. Corrige y repite.
- `bash render.sh` → `out/final.mp4` (tarda unos 5 minutos; ejecútalo en primer plano con un timeout largo).
- Comprueba: duración ≤ 60 s, audio presente (`ffmpeg -i out/final.mp4 -af volumedetect -f null -`), y mira 6 fotogramas repartidos.

## 5. Publicar en TikTok (Metricool)
1. `bash push_media_tiktok.sh out/final.mp4 noticias-AAAA-MM-DD.mp4` (semanal: `resumen-semana-AAAA-MM-DD.mp4`) → da la URL pública. Comprueba con `curl -sI URL` que responde 200.
2. Carga las herramientas de Metricool con ToolSearch (`getBrandSettings`, `createScheduledPost`, `getScheduledPosts`). Marca: `blogId` 8130759, zona Europe/Madrid, red `tiktok`.
3. `createScheduledPost` con fecha = ahora + 10 minutos, `providers: [{"network":"tiktok"}]`, `media: [URL]`, `autoPublish: true`, `draft: false`, `tiktokData`: `privacyOption "PUBLIC_TO_EVERYONE"`, `isAigc: true`, `title` corto con gancho, y `text`: resumen de las noticias en una frase + hashtags (#noticias #noticiasdehoy #actualidad #ultimahora #fyp + 2 o 3 del tema). Semanal: #resumensemanal.
4. Confirma con `getScheduledPosts` que está programado.
5. Si Metricool da error (por ejemplo, límite del plan gratuito), no insistas en bucle: deja el vídeo en la rama media-tiktok y avisa en el resumen final.

## 6. Guardar
```bash
cp guion.json guiones/AAAA-MM-DD.json      # semanal: guiones/semana-AAAA-MM-DD.json
# añade una fila a HISTORIAL-NOTICIAS.md
cd /home/claude/shorts-videos && git add tiktok-noticias && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -m "noticias AAAA-MM-DD"
git pull --rebase -q origin main && git -c push.negotiate=true push origin HEAD:main
```
Guarda también las escenas y disfraces nuevos (quedan como biblioteca para los siguientes días).

## 7. Resumen final
Responde con: las noticias elegidas (una línea cada una), la duración, la hora de publicación y el enlace del planificador de Metricool.
