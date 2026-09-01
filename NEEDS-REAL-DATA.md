# DATOS REALES PENDIENTES

No se inventaron datos de contacto ni redes.

Completar en `assets/js/config.js`:

```js
window.MUNDO_BIOHACK_CONFIG = Object.freeze({
  communityWhatsAppUrl: "https://wa.me/...",
  salesWhatsAppUrl: "https://wa.me/...",
  instagramUrl: "https://www.instagram.com/...",
  youtubeUrl: "https://www.youtube.com/@...",
  logoUrl: "",
  legalContact: "mailto:..."
});
```

### Qué habilita cada dato

- `communityWhatsAppUrl`: botón de comunidad y enlaces de WhatsApp.
- `salesWhatsAppUrl`: CTA contextual de los tres productos.
- `instagramUrl`: Instagram en footer.
- `youtubeUrl`: YouTube en footer.
- `legalContact`: contacto en páginas legales.
- `logoUrl`: reemplazo opcional del logo local.

Mientras estén vacíos, el frontend oculta esos elementos para evitar botones falsos.
