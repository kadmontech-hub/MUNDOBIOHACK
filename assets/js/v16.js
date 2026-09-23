(() => {
  "use strict";

  const instagram = window.MUNDO_BIOHACK_INSTAGRAM || {};
  const config = window.MUNDO_BIOHACK_CONFIG || {};
  const grid = document.querySelector("[data-instagram-grid]");
  const profileUrl = config.instagramUrl || instagram.profileUrl || "https://www.instagram.com/mundobiohack/";

  if (!document.querySelector('link[data-v16-density]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/v16-density.css";
    stylesheet.dataset.v16Density = "";
    document.head.append(stylesheet);
  }

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

  const captionTitle = (caption = "", fallback = "Mundo Biohack en Instagram") => {
    const clean = String(caption || "").replace(/\s+/g, " ").trim();
    if (!clean) return fallback;
    const sentence = clean.split(/(?<=[.!?])\s/)[0] || clean;
    return sentence.length > 72 ? `${sentence.slice(0, 69).trim()}…` : sentence;
  };

  const captionDescription = (caption = "", fallback = "Abrí la publicación original para verla completa en Instagram.") => {
    const clean = String(caption || "").replace(/\s+/g, " ").trim();
    if (!clean) return fallback;
    return clean.length > 150 ? `${clean.slice(0, 147).trim()}…` : clean;
  };

  const normalizeLiveItem = (item, index) => ({
    id: item.id || `instagram-live-${index + 1}`,
    type: item.type || "Instagram",
    title: captionTitle(item.caption),
    description: captionDescription(item.caption),
    thumbnail: item.thumbnail || "assets/images/image-fallback.svg",
    url: item.url || profileUrl,
    focalDesktop: "50% 50%",
    focalMobile: "50% 50%",
    isLive: true
  });

  const renderItems = (items) => {
    if (!grid || !Array.isArray(items) || !items.length) return;
    const fragment = document.createDocumentFragment();

    items.slice(0, 6).forEach((item, index) => {
      const link = document.createElement("a");
      const targetUrl = item.url || profileUrl;
      link.className = "instagram-card";
      link.href = targetUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.dataset.track = item.isLive ? "instagram_reel_click" : "instagram_content_click";
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
      image.dataset.focalDesktop = item.focalDesktop || "50% 50%";
      image.dataset.focalMobile = item.focalMobile || "50% 50%";
      image.style.objectPosition = image.dataset.focalDesktop;

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
      description.textContent = item.description || "Abrí el perfil oficial para ver la publicación completa.";

      const cta = document.createElement("span");
      cta.className = "instagram-card__cta";
      cta.innerHTML = `${item.isLive ? "Ver publicación" : "Ver en Instagram"} ${arrowIcon()}`;

      content.append(title, description, cta);
      link.append(image, overlay, top, content);
      fragment.append(link);
    });

    grid.replaceChildren(fragment);
  };

  const fallbackItems = Array.isArray(instagram.items) ? instagram.items : [];
  renderItems(fallbackItems);

  const loadLiveInstagram = async () => {
    try {
      const response = await fetch("/api/instagram-feed?limit=6", {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload?.ok || !Array.isArray(payload.items) || !payload.items.length) return;
      renderItems(payload.items.map(normalizeLiveItem));
      document.documentElement.dataset.instagramFeed = "live";
    } catch (_) {
      document.documentElement.dataset.instagramFeed = "fallback";
    }
  };

  loadLiveInstagram();

  document.querySelectorAll("[data-instagram-profile-link]").forEach((link) => {
    link.href = profileUrl;
    link.hidden = false;
  });

  const updateMobileFocals = () => {
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    document.querySelectorAll(".instagram-card__image[data-focal-mobile]").forEach((image) => {
      image.style.objectPosition = mobile
        ? image.dataset.focalMobile || "50% 50%"
        : image.dataset.focalDesktop || "50% 50%";
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
