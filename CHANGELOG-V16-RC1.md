# Mundo Biohack V16 RC1 — Realism + Instagram + Scanability

## Objetivo

Elevar la V15.4 a una release candidate más realista, editorial, intuitiva y publicable sin migrar el stack ni reconstruir la web.

## Cambios principales

- Instagram oficial de Mundo Biohack configurado en `assets/js/config.js`.
- Nueva sección `#instagram-mundo-biohack` con diseño editorial 9:16 y acceso directo a `@mundobiohack`.
- Modelo de contenido Instagram separado en `assets/js/instagram-content.js` para poder reemplazar gateways por Reels individuales sin rehacer la UI.
- Nueva capa visual `assets/css/v16-realism.css` para framing, crops, productos, Instagram y jerarquía de lectura.
- Nuevo `assets/js/v16.js` para render de Instagram, focales responsive y tracking de vistas de sección.
- Navegación principal prioriza Instagram sobre TV mientras la videoteca propia sigue en producción.
- Productos ganan contexto visual y comercial con referencia explícita a NipponFlex y disclosure visible.
- Productos protegidos contra crop mediante `object-fit: contain` y focales específicos por breakpoint.
- Hero, selección editorial y TV reciben `object-position` responsive.
- La sección Comunidad incorpora Instagram como siguiente paso real aun cuando WhatsApp todavía no esté configurado.
- URLs de OMS para Nutrición y Salud Mental actualizadas a sus versiones oficiales en español tanto en HTML como en las rutas temáticas del JS.
- Canonical, Open Graph URL y WebSite schema normalizados a `https://mundobiohack.com/`.
- Metadatos de versión unificados a `16.0.0-rc1`.
- Hero/TV usan imágenes decorativas con `alt=""` para no afirmar identidades visuales no verificadas.
- Matriz de QA geométrico documentada en `QA-VISUAL-V16.md`.

## Mejora de scanability

- Títulos y bajadas usan medidas de lectura controladas y wrapping balanceado.
- Hero y encabezados priorizan reconocimiento rápido antes que densidad de texto.
- Descripciones secundarias se limitan visualmente para evitar paredes de texto.
- Temas pasan a 3 columnas desktop, 2 tablet y rail horizontal mobile.
- Instagram usa rail horizontal 9:16 con scroll snap en mobile.
- Se agregaron divisores de sección sutiles para mejorar orientación sin sumar ruido.
- Cards mantienen jerarquía constante: metadata → título → descripción → CTA.
- Productos sostienen jerarquía protagonista + secundarios y botones táctiles previsibles.
- Modales y búsqueda quedan limitados al viewport con scroll interno.
- Estados de foco se reforzaron para teclado.
- Se agregó `content-visibility:auto` a tramos inferiores cuando el navegador lo soporta para mejorar render inicial sin cambiar el contenido.

## No se modificó

- Stack HTML/CSS/JS vanilla.
- Sistema actual de búsqueda.
- Modales temáticos y de producto.
- Páginas legales existentes.
- Curaduría externa como parte central del producto.
- Regla de no precios / no carrito / no checkout.

## Limitaciones conscientes

- No se inventaron URLs individuales de Reels. Hasta contar con URLs verificadas, las tarjetas Instagram abren el perfil oficial.
- Los assets editoriales y de producto continúan dependiendo en parte de Imgur; su migración a assets locales queda como fase posterior de performance/ownership.
- WhatsApp, YouTube, logo externo y contacto legal siguen ocultos cuando no existen datos reales configurados.
- La aprobación final de crops requiere pixel-QA sobre el preview Vercel en los breakpoints documentados.
