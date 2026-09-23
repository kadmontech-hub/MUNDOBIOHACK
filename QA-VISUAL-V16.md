# QA VISUAL V16 — Realism + Instagram + Scanability

## Alcance

Auditoría de encuadre, jerarquía visual y comportamiento responsive aplicada a la homepage V16 RC1.

> Nota: este documento registra la estrategia geométrica y de lectura aplicada en código. La aprobación final requiere inspección pixel a pixel del preview de Vercel en dispositivos reales o navegador con viewport controlado.

## Matriz de encuadre

| Asset / familia | Sección | Ratio / contenedor | Fit | Foco desktop | Foco mobile | Estado de código |
| --- | --- | --- | --- | --- | --- | --- |
| Hero principal | Hero | contenedor hero | cover | 72% 48% | 60% 42% | Ajustado |
| Destacado TV | Hero lateral | card horizontal | cover | 50% 42% | 50% 38% | Ajustado |
| Guía editorial | Hero lateral | card horizontal | cover | 50% 42% | 50% 38% | Ajustado |
| Plantillas FIR | Hero lateral | card horizontal | contain | 82% 50% | 72% 50% | Protegido contra crop |
| Cards En portada | Ruta rápida | 16:9 | cover | 50% 44% | 50% 44% | Normalizado |
| Temas | Explorar | 16:9 / 16:10 mobile | cover | 50% 44% | 50% 44% | Normalizado |
| Plantillas FIR | Productos | layout protagonista | contain | 76% 50% | 50% 50% | Protegido contra crop |
| Squeeze Alcaline | Productos | secundaria | contain | 76% 50% | 50% 50% | Protegido contra crop |
| Brazalete FIR | Productos | secundaria | contain | 76% 50% | 50% 50% | Protegido contra crop |
| Bryan Johnson | Selección | lead editorial | cover | 50% 38% | 50% 42% | Ajustado |
| Selección secundaria | Selección | cards editoriales | cover | 50% 44% | 50% 42% | Ajustado |
| Instagram Reels/formato | Instagram | 9:16 / 4:5 tablet | cover | focal por item | focal por item | Nuevo sistema |
| Mundo Biohack TV | TV | feature | cover | 70% 44% | 62% 42% | Ajustado |
| Formatos TV | TV | cards | cover | 50% 40% | 50% 40% | Ajustado |

## Reglas de encuadre aplicadas

- Productos usan `object-fit: contain` para evitar amputaciones visuales.
- Hero y fotografía editorial usan `cover` con `object-position` específico por breakpoint.
- Instagram usa tarjetas verticales 9:16 en mobile y focales configurables por item.
- Se mantiene `width` y `height` en imágenes para reducir CLS.
- Imágenes inferiores mantienen lazy loading y decoding async.
- El hero conserva prioridad alta de carga.
- El contenido informativo mantiene `alt`; las imágenes puramente decorativas del hero/TV usan `alt=""`.

## Sistema de escaneo visual

La V16 RC1 incorpora reglas para que el ojo pueda identificar rápidamente qué mirar, leer y accionar:

- Títulos de sección limitados a una medida visual controlada y `text-wrap: balance`.
- Bajadas limitadas a aproximadamente 66 caracteres tipográficos por línea para mejorar lectura.
- Hero limitado a una medida corta para que el H1 sea reconocible en un solo golpe de vista.
- Descripciones de cards secundarias limitadas a tres líneas; Instagram baja a dos líneas en pantallas muy pequeñas.
- Metadatos, badges y estados se mantienen visualmente separados del título y la descripción.
- Secciones reciben divisores extremadamente sutiles para evitar el efecto de “pared de tarjetas”.
- Temas se organizan en 3 columnas desktop, 2 tablet y rail horizontal mobile para reducir longitud vertical.
- Instagram utiliza rail horizontal 9:16 en mobile con `scroll-snap`.
- Productos mantienen jerarquía protagonista + secundarios, con CTAs de altura táctil mínima.
- Modales y buscador tienen altura máxima y scroll interno para nunca salir del viewport.
- Estados de foco son visibles y no dependen de hover.

## Breakpoints obligatorios para aprobación final

- 360 px
- 390 px
- 430 px
- 768 px
- 1024 px
- 1366 px
- 1440 px
- 1920 px

## Criterios de aceptación pixel-QA

- 0 overflow horizontal involuntario.
- 0 rostros o sujetos principales cortados de forma problemática.
- 0 productos amputados.
- 0 imágenes estiradas.
- 0 thumbnails con texto esencial fuera de cuadro.
- 0 modales fuera del viewport.
- 0 botones fuera de pantalla.
- 0 saltos de layout notorios por imágenes.
- Se puede identificar el propósito de cada sección antes de leer todos sus párrafos.
- No existen bloques consecutivos con idéntica densidad visual que produzcan fatiga.
- En mobile no se obliga al usuario a atravesar seis tarjetas temáticas apiladas verticalmente.
- Los CTAs principales tienen contraste y orden visual inequívocos.

## Instagram

La integración V16 no incrusta cuatro reproductores de Meta. Usa una capa editorial liviana que enlaza al perfil oficial `@mundobiohack`. La estructura queda preparada para reemplazar cada gateway por URLs de Reels individuales cuando esas URLs se incorporen al archivo `assets/js/instagram-content.js`.

Las tarjetas actuales representan formatos editoriales de la cuenta, no Reels individuales inventados. Esa distinción debe mantenerse hasta tener URLs verificadas.

## Performance visual

- Las secciones por debajo del primer tramo usan `content-visibility:auto` cuando el navegador lo soporta.
- Los assets debajo del hero continúan con lazy loading.
- No se agregaron embeds pesados de Meta.
- Los rails mobile usan CSS nativo y no agregan dependencias JavaScript.

## Estado

- Geometría y focales: implementados.
- Jerarquía y scanability: implementadas en código.
- Integración Instagram: implementada y funcional a nivel de perfil oficial.
- Productos: protegidos contra crop y con mayor jerarquía.
- Pixel-QA renderizado final: pendiente de inspección visual controlada antes de promover a producción.
