# Fundamento estándar del canal de Shorts

> Leer este archivo ANTES de crear cualquier vídeo nuevo. Todas las ideas deben seguir estas reglas.
> Análisis hecho el 15/11/2026.

## 1. Cómo se gana dinero con Shorts (la realidad)

- Para cobrar anuncios hacen falta **1.000 suscriptores + 10 millones de visitas de Shorts en 90 días**.
- **Desde el 1 de febrero de 2027**, los canales nuevos necesitarán **20 millones** de visitas en 90 días. Somos un canal nuevo, así que este es nuestro objetivo real.
- Un Short paga muy poco: normalmente entre **0,03 y 0,10 $ por cada 1.000 visitas**. 1 millón de visitas ≈ 30–100 $.
- El público hispanohablante paga menos que el de EE. UU. Usar **español neutro**, sin expresiones solo de España, para llegar también a Latinoamérica y EE. UU.
- YouTube **no paga** por vídeos genéricos de plantilla, contenido que molesta o engaña, ni "expertos" de IA que dan consejos. Cada vídeo tiene que aportar algo real y verificado.

**Conclusión:** en Shorts lo que importa es el **volumen de visitas**, no el tema que más paga por visita.

## 2. Nichos analizados

| Nicho | Visitas | Paga por 1.000 visitas | Competencia | Encaja con nosotros |
|---|---|---|---|---|
| Historia y "¿Sabías que?" | Altas | 0,06–0,12 $ | Baja-media | ✅ Muy bien, contenido que no caduca |
| Misterios y terror real | Muy altas | 0,08–0,14 $ | Media | ✅ Bien, mucha retención |
| Crímenes reales (casos famosos) | Altas | 0,07–0,13 $ | Media | ⚠️ Con cuidado, sin detalles violentos |
| Dinero y finanzas | Medias | 0,10–0,45 $ | Media-alta | ⚠️ Solo curiosidades, nunca consejos |
| Tecnología e IA | Medias | 0,08–0,35 $ | Media | ✅ Bien como curiosidades |
| Animales | Altas | 0,04–0,09 $ | Baja | ✅ Fácil, pero paga poco |
| Gaming | Muy altas | 0,01–0,08 $ | Muy alta | ❌ No: necesita clips con derechos |
| Motivación | Altas | 0,06–0,12 $ | Muy alta | ❌ Saturado |

## 3. Nicho elegido (decidido por los datos, 15/11/2026)

Alejandro pidió elegir "lo que digan los números". Datos usados:
- Probabilidad de que un vídeo se haga viral (10 veces más visitas de lo normal), según OutlierKit (agosto de 2026): **finanzas personales 16,7 %**, **crímenes reales y misterios sin resolver 12,5 %**, cocina 11,7 %, herramientas de IA 10 %, canales faceless genéricos 3,1 %.
- Lo que más se ve en Shorts es entretenimiento (32 %), gaming (21 %) y tutoriales (18 %). Todo eso necesita grabar o tener derechos, así que no se puede automatizar.
- La animación 2D tiende a hacerse más viral.

**Mezcla de temas, que se va rotando:**
1. **Historias de dinero (40 %)**: fortunas que se perdieron, estafas famosas, errores millonarios, inventos que hicieron rico a alguien, precios de antes. SOLO historias reales, NUNCA consejos de inversión. Es el nicho con más probabilidad de hacerse viral y el que más paga por visita.
2. **Misterios sin resolver y casos reales (40 %)**: desapariciones famosas, enigmas históricos, casos curiosos. Sin detalles violentos ni sangre (YouTube no pone anuncios en eso) y con respeto a las víctimas reales.
3. **Oficios e historias olvidadas (20 %)**: el formato con el que empezamos.

Orden de la semana: lunes dinero, miércoles misterio, viernes dinero, sábado misterio. La primera semana de cada mes, el sábado toca historia olvidada.

**Duración: 35 a 45 segundos** (unas 100–120 palabras). Los vídeos cortos se ven hasta el final más a menudo.

## 3b. Estilo visual estándar (referencia elegida por Alejandro)

- **Dibujos animados 2D** con un personaje propio: cabeza grande y redonda, bigote, sombrero y guayabera. Es un diseño original: no copiar personajes de otros canales.
- **Fondos ilustrados** de la época y el lugar (calle, fábrica, puerto…) con detalles que se mueven: nubes, palmeras, luces y polvo.
- **Movimiento constante**: cámara que se acerca poco a poco, un golpe de zoom con flash en cada cambio de escena, personajes que se mueven, parpadean y hablan, y objetos que aparecen con rebote.
- **Una escena nueva cada 5–10 segundos.**
- **Subtítulos grandes palabra a palabra** en el centro: blancos con borde negro y la palabra que se dice en amarillo.
- **Etiqueta arriba** con el lugar y el año (por ejemplo, "1865 · FÁBRICA EL FÍGARO").
- **Sonido**: voz automática con música de fondo suave que baja cuando hay voz, y efectos (whoosh, pop, monedas, brillos).
- **Duración de 35 a 45 segundos.** Cierre con "¡SÍGUEME!".
- Motor: `tools/anim/engine.py`. Ejemplo completo: `tools/anim/ep002_lector.py`.

## 4. Formato estándar de cada Short

1. **Gancho en los 2 primeros segundos**: una pregunta o un dato increíble.
2. **Duración de 35 a 45 segundos.**
3. **Subtítulos grandes**, porque mucha gente ve sin sonido.
4. **Un solo dato o una sola historia por vídeo**, contada con tensión hasta el final.
5. **Final que invite a ver de nuevo o a seguir el canal.**
6. **Datos siempre comprobados** con fuentes fiables. Nada inventado.
7. **Publicar 4 por semana (lunes, miércoles, viernes y sábado) a las 19:00, hora de Madrid.** Así no se pasa del límite de 20 publicaciones al mes del plan gratis de Metricool.
8. Títulos cortos con el dato más llamativo y el hashtag #shorts.

## Fuentes
- ghostshorts.com: nichos de Shorts 2026 (RPM y visitas, estimaciones del propio medio)
- fluxnote.io: RPM de Shorts por nicho 2026
- timetopost.co: RPM típico de Shorts
- air.io, YouTube Official Blog (vía subsub.io y tella.com): requisitos del YPP y cambios de febrero de 2027
- outlierkit.com, tubefilter.com: política de "contenido no auténtico" (julio de 2026)
- fluxnote.io: audiencia hispanohablante y español neutro

## 5. Proceso automático
Lo describe paso a paso `RUN.md`. Cada vídeo se crea y se publica sin esperar el visto bueno.
