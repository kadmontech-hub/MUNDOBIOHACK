(() => {
  "use strict";

  const instagram = window.MUNDO_BIOHACK_INSTAGRAM || {};
  const config = window.MUNDO_BIOHACK_CONFIG || {};
  const grid = document.querySelector("[data-instagram-grid]");
  const profileUrl = config.instagramUrl || instagram.profileUrl || "https://www.instagram.com/mundobiohack/";

  const instagramIcon = () => `
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="2"></rect>
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"></circle>
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor"></circle>
    </svg>`;

  const arrowIcon = () => `
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="2"></path>
    </svg>`;

  if (grid && Array.isArray(instagram.items)) {
    const fragment = document.createDocumentFragment();

    instagram.items.slice(0, 4).forEach((item, index) => {
      const link = document.createElement("a");
      const targetUrl = item.url || profileUrl;
      link.className = "instagram-card";
      link.href = targetUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.dataset.track = "instagram_content_click";
      link.dataset.instagramItem = item.id || `instagram-${index + 1}`;
      link.dataset.searchItem = "";
      link.dataset.searchTitle = item.title || "Instagram Mundo Biohack";
      link.dataset.searchDescription = item.description || "Contenido de Mundo Biohack en Instagram.";
      link.dataset.searchType = "Instagram";
      link.dataset.searchHref = targetUrl;
      link.setAttribute("aria-label", `${item.title || "Contenido de Mundo Biohack"}. Abrir Instagram en una pestaña nueva.`);

      const image = document.createElement("img");
      image.className = "instagram-card__image";
      image.src = item.thumbnail || "assets/images/image-fallback.svg";
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.width = 720;
      image.height = 1280;
      image.dataset.fallback = "assets/images/image-fallback.svg";
      image.style.objectPosition = item.focalDesktop || "50% 42%";
      if (item.focalMobile) image.dataset.focalMobile = item.focalMobile;

      const overlay = document.createElement("span");
      overlay.className = "instagram-card__overlay";
      overlay.setAttribute("aria-hidden", "true");

      const top = document.createElement("span");
      top.className = "instagram-card__top";
      top.innerHTML = `<span class="instagram-card__badge">${instagramIcon()} ${item.type || "Instagram"}</span>`;

      const content = document.createElement("span");
      content.className = "instagram-card__content";

      const title = document.createElement("h3");
      title.textContent = item.title || "Mundo Biohack en Instagram";

      const description = document.createElement("p");
      description.textContent = item.description || "Abrí el perfil oficial para ver las publicaciones más recientes.";

      const cta = document.createElement("span");
      cta.className = "instagram-card__cta";
      cta.innerHTML = `Ver en Instagram ${arrowIcon()}`;

      content.append(title, description, cta);
      link.append(image, overlay, top, content);
      fragment.append(link);
    });

    grid.replaceChildren(fragment);
  }

  document.querySelectorAll("[data-instagram-profile-link]").forEach((link) => {
    link.href = profileUrl;
    link.hidden = false;
  });

  const updateMobileFocals = () => {
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    document.querySelectorAll(".instagram-card__image[data-focal-mobile]").forEach((image) => {
      if (!image.dataset.focalDesktop) image.dataset.focalDesktop = image.style.objectPosition || "50% 42%";
      image.style.objectPosition = mobile ? image.dataset.focalMobile : image.dataset.focalDesktop;
    });
  };

  const sendViewEvent = (name) => {
    if (typeof window.gtag === "function") window.gtag("event", name);
  };

  if ("IntersectionObserver" in window) {
    const tracked = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35 || tracked.has(entry.target)) return;
        tracked.add(entry.target);
        const eventName = entry.target.dataset.sectionViewEvent;
        if (eventName) sendViewEvent(eventName);
        observer.unobserve(entry.target);
      });
    }, { threshold: [0.35, 0.6] });

    document.querySelectorAll("[data-section-view-event]").forEach((section) => observer.observe(section));
  }

  updateMobileFocals();
  window.addEventListener("resize", updateMobileFocals, { passive: true });
})();
