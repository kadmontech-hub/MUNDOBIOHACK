# Mundo Biohack — proyecto estático para GitHub y Vercel

## Despliegue

1. El repositorio se despliega desde GitHub hacia Vercel.
2. Framework preset: **Other**.
3. Build command: `npm run build`.
4. Output directory: `.`.
5. Cada branch puede generar un preview antes de mergear a `main`.

## Configuración real

Editar solamente:

`assets/js/config.js`

Campos disponibles:

- `communityWhatsAppUrl`
- `salesWhatsAppUrl`
- `instagramUrl`
- `youtubeUrl`
- `logoUrl`
- `legalContact`

Cuando una URL está vacía, su enlace no aparece en la interfaz ni queda en el orden de tabulación.

Instagram oficial configurado:

- `https://www.instagram.com/mundobiohack/`

## V16 RC1

La release candidate V16 suma una capa de realismo visual, jerarquía y publicación:

- nueva sección editorial **Desde Instagram**;
- fallback editorial en `assets/js/instagram-content.js`;
- endpoint `api/instagram-feed.js` preparado para traer publicaciones reales desde la API oficial de Instagram;
- capa de estilos `assets/css/v16-realism.css`;
- capa de densidad `assets/css/v16-density.css` para reducir sobredimensionamiento y aumentar módulos visibles;
- lógica `assets/js/v16.js` para feed real/fallback, render de Instagram, focales responsive y tracking;
- focales responsive para hero, editoriales, TV y productos;
- productos protegidos contra crop mediante `object-fit: contain`;
- relación comercial con NipponFlex comunicada con mayor claridad;
- fuentes OMS de Nutrición y Salud Mental enlazadas en español;
- canonical/OG/schema unificados a `https://mundobiohack.com/`;
- versión técnica unificada `16.0.0-rc1`;
- jerarquía visual optimizada para lectura rápida y menor fatiga.

## Scanability y densidad

La capa V16 está pensada para que cada tramo pueda entenderse antes de leerlo en profundidad:

- hero más contenido;
- títulos de sección con medida controlada y wrapping balanceado;
- bajadas con ancho de lectura limitado;
- descripciones secundarias visualmente acotadas;
- estructura repetible `metadata → título → descripción → CTA`;
- Temas en 4 columnas wide desktop, 3 en desktop/tablet y rail horizontal mobile;
- Selección editorial compactada en una pieza principal + tres módulos;
- Productos reducidos en altura sin perder protagonismo;
- Instagram preparado para hasta seis piezas reales;
- Instagram en rail horizontal 9:16 mobile;
- TV y comunidad más compactos;
- divisores de sección sutiles para evitar efecto de “pared de tarjetas”;
- modales y buscador limitados al viewport;
- estados de foco reforzados.

## Instagram real y autoactualizable

La web mantiene un fallback editorial y después intenta obtener los últimos contenidos desde:

`/api/instagram-feed?limit=6`

El access token nunca se expone al navegador. Para activar el feed real, configurar en Vercel:

- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_ACCOUNT_ID`
- `INSTAGRAM_API_VERSION`
- `INSTAGRAM_GRAPH_BASE_URL`

Existe `.env.example` sin secretos reales.

Cuando el endpoint está configurado, la web reemplaza automáticamente el fallback por hasta seis publicaciones reales con su thumbnail, caption y permalink. Si la API no está disponible, la sección continúa funcionando con el fallback actual.

## Curaduría externa

El siguiente sprint de investigación está definido en:

`RESEARCH-BRIEF-EXTERNAL-CURATION-V16.md`

La consigna pide 40+ candidatos verificados, mínimo 15 videos o entrevistas y una selección final alineada con las categorías de la web.

## Metadatos

La imagen principal actual se utiliza como Open Graph y Twitter Card.
Cuando exista un asset definitivo, reemplazar las dos URLs dentro de `index.html`.

## Verificación

Ejecutar:

```bash
npm run preflight
```

El despliegue se bloquea si detecta variables sin resolver, enlaces rotos, IDs duplicados,
imágenes sin `alt`, botones sin nombre accesible, URLs inseguras o textos internos.

## Archivos principales

- `index.html`
- `assets/css/styles.css`
- `assets/css/v16-realism.css`
- `assets/css/v16-density.css`
- `assets/js/config.js`
- `assets/js/instagram-content.js`
- `assets/js/v16.js`
- `assets/js/app.js`
- `api/instagram-feed.js`
- `.env.example`
- `scripts/preflight.mjs`
- `QA-VISUAL-V16.md`
- `RESEARCH-BRIEF-EXTERNAL-CURATION-V16.md`
- páginas legales
- `robots.txt`
- `sitemap.xml`
- `vercel.json`

## Assets externos

Las imágenes editoriales y de productos continúan cargándose parcialmente desde Imgur.
Las miniaturas audiovisuales cargan desde YouTube.
Cada imagen externa tiene un fallback local.

La migración de assets propios a almacenamiento controlado por Mundo Biohack queda como siguiente fase de performance y ownership.

## QA visual

La matriz de encuadre, reglas de scanability y breakpoints obligatorios de revisión están documentados en:

`QA-VISUAL-V16.md`

No considerar la release final hasta completar pixel-QA en el preview de Vercel y después revisar los assets uno por uno.
