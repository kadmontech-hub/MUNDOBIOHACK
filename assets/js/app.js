(() => {
  "use strict";

  const config = window.MUNDO_BIOHACK_CONFIG || {};
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  const configuredUrl = (key, element) => {
    if (key === "communityWhatsApp") return config.communityWhatsAppUrl || "";
    if (key === "instagram") return config.instagramUrl || "";
    if (key === "youtube") return config.youtubeUrl || "";
    if (key === "legalContact") return config.legalContact || "";
    if (key === "product") {
      const base = config.salesWhatsAppUrl || config.communityWhatsAppUrl || "";
      if (!base) return "";
      const message = element.dataset.productMessage || "";
      const separator = base.includes("?") ? "&" : "?";
      return `${base}${separator}text=${encodeURIComponent(message)}`;
    }
    return "";
  };

  document.querySelectorAll("[data-config-link]").forEach((element) => {
    const url = configuredUrl(element.dataset.configLink, element);
    if (!url) {
      element.hidden = true;
      element.removeAttribute("href");
      return;
    }
    element.href = url;
    element.hidden = false;
  });

  const communitySection = document.querySelector("[data-community-section]");
  if (communitySection && config.communityWhatsAppUrl) communitySection.hidden = false;

  const socialSection = document.querySelector("[data-social-section]");
  if (socialSection && (config.instagramUrl || config.youtubeUrl || config.communityWhatsAppUrl)) socialSection.hidden = false;

  document.querySelectorAll("[data-legal-contact-wrap]").forEach((wrapper) => {
    wrapper.hidden = !config.legalContact;
  });

  if (config.logoUrl) {
    document.querySelectorAll("[data-logo-image]").forEach((image) => {
      image.src = config.logoUrl;
    });
  }

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      const alternate = image.dataset.fallbackSrc;
      if (alternate && image.src !== alternate) {
        image.src = alternate;
        image.dataset.fallbackSrc = "";
        return;
      }
      image.src = image.dataset.fallback;
    });
  });

  const setMenu = (open) => {
    if (!menuButton || !mobileNav) return;
    mobileNav.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", open);
  };

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(mobileNav?.dataset.open !== "true");
  });

  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("pointerdown", (event) => {
    if (mobileNav?.dataset.open !== "true") return;
    if (mobileNav.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) setMenu(false);
  });
})();
