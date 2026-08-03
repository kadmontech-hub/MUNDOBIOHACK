# QA REPORT — Mundo Biohack V14

## Preflight

```text
PREFLIGHT OK: 15 archivos verificados.
```

## Verificaciones realizadas

- Sintaxis de `config.js`: correcta.
- Sintaxis de `app.js`: correcta.
- Sintaxis de `preflight.mjs`: correcta.
- Enlaces internos: verificados.
- IDs duplicados: no detectados.
- Variables con doble llave: no publicadas.
- `href="#"`: no detectado.
- `alert()`: no detectado.
- Páginas legales: conectadas.
- Favicon, apple-touch-icon, robots y sitemap: incluidos.
- Configuración Vercel: incluida.
- Enlaces configurables vacíos: ocultos por JavaScript.
- Productos: imágenes con `object-fit: contain`.
- Hero: imagen prioritaria sin lazy loading.
- Imágenes fuera del primer pantallazo: lazy loading y `decoding="async"`.
- Reduced motion, skip link y focus visible: preservados.

## Viewports objetivo incorporados en CSS

- 360 px
- 390 px
- 768 px
- 1024 px
- 1366 px
- 1440 px
- 1920 px

## Limitación de la revisión automatizada

El runtime permitió ejecutar preflight y validación de sintaxis, pero Chromium
headless no finalizó de forma confiable en este entorno. No se declara una
puntuación Lighthouse ni una medición real de Core Web Vitals.

## Archivos externos

Las imágenes de Imgur y las miniaturas de YouTube permanecen como recursos
externos aprobados. Cada imagen cuenta con un fallback local.
