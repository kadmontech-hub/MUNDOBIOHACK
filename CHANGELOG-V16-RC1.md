# Mundo Biohack V16 RC1 — Realism + Instagram

## Objetivo

Elevar la V15.4 a una release candidate más realista, editorial y publicable sin migrar el stack ni reconstruir la web.

## Cambios principales

- Instagram oficial de Mundo Biohack configurado en `assets/js/config.js`.
- Nueva sección `#instagram-mundo-biohack` con diseño editorial 9:16 y acceso directo a `@mundobiohack`.
- Modelo de contenido Instagram separado en `assets/js/instagram-content.js` para poder reemplazar gateways por Reels individuales sin rehacer la UI.
- Nueva capa visual `assets/css/v16-realism.css` para framing, crops, productos e Instagram.
- Nuevo `assets/js/v16.js` para render de Instagram, focales responsive y tracking de vistas de sección.
- Navegación principal prioriza Instagram sobre TV mientras la videoteca propia sigue en producción.
- Productos ganan contexto visual y comercial con referencia explícita a NipponFlex y disclosure visible.
- Productos protegidos contra crop mediante `object-fit: contain` y focales específicos por breakpoint.
- Hero, selección editorial y TV reciben `object-position` responsive.
- La sección Comunidad incorpora Instagram como siguiente paso real aun cuando WhatsApp todavía no esté configurado.
- URLs de OMS para Nutrición y Salud Mental actualizadas a sus versiones oficiales en español.
- Canonical, Open Graph URL y WebSite schema normalizados a `https://mundobiohack.com/`.
- Metadatos de versión unificados a `16.0.0-rc1`.
- Hero/TV usan imágenes decorativas con `alt=""` para no afirmar identidades visuales no verificadas.
- Matriz de QA geométrico documentada en `QA-VISUAL-V16.md`.

## No se modificó

- Stack HTML/CSS/JS vanilla.
- Sistema actual de búsqueda.
- Modales temáticos y de producto.
- Páginas legales existentes.
- Sistema de tracking base de `app.js`.
- Curaduría externa como parte central del producto.

## Limitaciones conscientes

- No se inventaron URLs individuales de Reels. Hasta contar con URLs verificadas, las tarjetas Instagram abren el perfil oficial.
- Los assets editoriales y de producto continúan dependiendo en parte de Imgur; su migración a assets locales queda como fase posterior de performance/ownership.
- WhatsApp, YouTube, logo externo y contacto legal siguen ocultos cuando no existen datos reales configurados.
- La aprobación final de crops requiere pixel-QA sobre el preview Vercel en los breakpoints documentados.
