# Mundo Biohack — proyecto estático para GitHub y Vercel

## Despliegue

1. Subir el contenido completo de esta carpeta a un repositorio de GitHub.
2. Importar el repositorio desde Vercel.
3. Framework preset: **Other**.
4. Build command: `npm run build`.
5. Output directory: `.`.
6. Publicar.

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
- `assets/js/config.js`
- `assets/js/app.js`
- `scripts/preflight.mjs`
- páginas legales
- `robots.txt`
- `sitemap.xml`
- `vercel.json`

## Assets externos

Las imágenes editoriales y de productos continúan cargándose desde Imgur.
Las miniaturas audiovisuales cargan desde YouTube.
Cada imagen externa tiene un fallback local.


## V15 — sistema simétrico

Esta versión normaliza alturas, proporciones y grillas. La selección editorial utiliza una pieza principal y cuatro piezas secundarias en una matriz 2x2. Los productos usan una composición 2–1–1 de igual altura en desktop.
