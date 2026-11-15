# Cómo crear y publicar un Short (instrucciones para cada tarea programada)

Todo se hace sin pedir el visto bueno de Alejandro. Responde siempre en español.

## 0. Preparar
```bash
git clone --depth 1 https://github.com/alenoaa970-sudo/shorts-videos /home/claude/shorts-videos   # si no existe ya
cd /home/claude/shorts-videos && bash tools/setup.sh
```
Lee `FUNDAMENTO.md` (reglas, nicho y estilo) y `HISTORIAL.md` (historias ya hechas).

## 1. Elegir la historia
- Tema según el día (FUNDAMENTO, apartado 3): **lunes y viernes, historia de dinero; miércoles y sábado, misterio o caso real** (el primer sábado del mes, oficio o historia olvidada). Que no esté en HISTORIAL.md ni sea casi igual a una ya hecha.
- Busca historias con un **dato que deje con la boca abierta** (cifras enormes, giros inesperados). Prioriza temas con muchas búsquedas y muy comentados.
- No copies los temas de otros canales que ya se conocen ("el despertador humano", "los colocadores de bolos", "el hombre de la bandera roja", "la piña de alquiler", "el hielo que viajó a la India").
- **Comprueba cada dato con WebSearch** en al menos 2 fuentes fiables (fechas, lugares, cifras). Si algo no se puede confirmar, no lo digas. Nada inventado.
- Nada violento, sexual ni que dé consejos (de dinero, salud, etc.).

## 2. Escribir el guion
Crea `episodios/NNN-slug.json` (NNN = siguiente número del historial) siguiendo `episodios/EJEMPLO.json` y la ayuda al principio de `tools/anim/make_episode.py`.
- De 6 a 8 segmentos. En total, unas 100–120 palabras (unos 35–45 segundos).
- **Segmento 1 = gancho**: el dato más sorprendente en menos de 3 segundos.
- Último segmento: `"scene": "end"`, con el texto "Sígueme para más historias reales." y `"chip": "+ HISTORIAS REALES"`.
- **Misterios**: usa `"sky": "night"` y `"dark": true`, símbolos `question`, y el ánimo `worried` o `surprised`. **Dinero**: usa `coins` y `reveal` con la cifra en grande (por ejemplo, `"lines": ["10.000", "BITCOINS"]`).
- Español neutro (que se entienda en España y Latinoamérica). Los años con cifras (1865), y el resto de números en letra si es posible.
- **NADA DE RECICLAR (orden de Alejandro):** cada vídeo usa **al menos 4 fondos (`bg`) distintos**, elegidos según la historia: mountains, forest, vault, library, city, office, storm, town, port, interior. La sala con ventanas (`interior`) se usa como mucho UNA vez por vídeo, y solo si encaja con la historia.
- Usa sobre todo `place` (personaje en cualquier fondo), `closeup` y `reveal` con `bg`. Objetos disponibles para `reveal`: book, box, sign, poster, pizza, chest, map. Si la historia necesita un fondo u objeto que no existe, **dibújalo nuevo** en tools/anim/backgrounds.py o en big_object(), en vez de forzar uno que no encaje.
- Pon un `chip` con el lugar o el año en casi todas las escenas.
- Escoge el vestuario del protagonista (`main`) según la época y el lugar.

## 3. Renderizar y revisar
```bash
cd tools/anim
python3 make_episode.py ../../episodios/NNN-slug.json /tmp/check.mp4 --preview 2,8,15,22,30,38
```
Mira 2 o 3 de los `/tmp/prev_*.png` con Read. Corrige los textos que se salgan o se tapen. Después:
```bash
python3 make_episode.py ../../episodios/NNN-slug.json ../../videos/NNN-slug.mp4
```

## 4. Subir y programar
```bash
cd /home/claude/shorts-videos && URL=$(tools/push_media.sh videos/NNN-slug.mp4 | tail -1); echo $URL
```
Después, con la herramienta de Metricool `createScheduledPost`:
- blogId `8130759`, red `youtube`, `autoPublish: true`
- Fecha: **hoy a las 19:00, hora de Madrid** (Europe/Madrid). Si ya pasó, mañana a las 19:00.
- `youtubeData`: `type "short"`, `privacy "public"`, `category "EDUCATION"`, `madeForKids false`, `isAiGeneratedContent false`, título de menos de 70 caracteres con gancho y `#shorts`, y entre 5 y 8 etiquetas.
- `text` (descripción): 2 frases con el resumen y una pregunta para el público, más los hashtags que encajen: #historia #curiosidades #shorts y además #dinero o #misterio.
- `media`: [URL]
- **Plan gratis: máximo 20 publicaciones al mes.** Antes de programar, usa `getScheduledPosts` para contar las de este mes. Si ya hay 19 o más, NO programes nada: guarda el vídeo en el historial como "pendiente por límite".

## 5. Guardar
Añade la fila a `HISTORIAL.md` y haz commit y push a `main` del JSON y del historial (los .mp4 no se suben a main). Termina con un resumen corto: título, hora y enlace del planner de Metricool.
