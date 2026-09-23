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

Instagram oficial configurado en V16:

- `https://www.instagram.com/mundobiohack/`

## V16 RC1

La release candidate V16 suma una capa de realismo visual, jerarquía y publicación:

- nueva sección editorial **Desde Instagram**;
- modelo separado `assets/js/instagram-content.js`;
- capa de estilos `assets/css/v16-realism.css`;
- lógica complementaria `assets/js/v16.js`;
- focales responsive para hero, editoriales, TV y productos;
- productos protegidos contra crop mediante `object-fit: contain`;
- relación comercial con NipponFlex comunicada con mayor claridad;
- fuentes OMS de Nutrición y Salud Mental enlazadas en español;
- canonical/OG/schema unificados a `https://mundobiohack.com/`;
- versión técnica unificada `16.0.0-rc1`;
- jerarquía visual optimizada para lectura rápida y menor fatiga.

## Scanability

La capa V16 está pensada para que cada tramo pueda entenderse antes de leerlo en profundidad:

- títulos de sección con medida controlada y wrapping balanceado;
- bajadas con ancho de lectura limitado;
- descripciones secundarias visualmente acotadas;
- estructura repetible `metadata → título → descripción → CTA`;
- Temas en 3 columnas desktop, 2 tablet y rail horizontal mobile;
- Instagram en rail horizontal 9:16 mobile;
- divisores de sección sutiles para evitar efecto de “pared de tarjetas”;
- modales y buscador limitados al viewport;
- estados de foco reforzados;
- productos con CTA y jerarquía consistente.

## Instagram

La web no carga múltiples embeds pesados de Meta. V16 usa una presentación editorial liviana con thumbnails y enlaces al perfil oficial. Los contenidos se administran en:

`assets/js/instagram-content.js`

Cuando existan URLs verificadas de Reels individuales, reemplazar el `url` de cada item sin modificar la UI.

Las tarjetas actuales representan formatos editoriales de `@mundobiohack`; no deben presentarse como Reels individuales hasta tener URLs reales verificadas.

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
- `assets/js/config.js`
- `assets/js/instagram-content.js`
- `assets/js/v16.js`
- `assets/js/app.js`
- `scripts/preflight.mjs`
- `QA-VISUAL-V16.md`
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

No considerar la release final hasta completar pixel-QA en el preview de Vercel.
