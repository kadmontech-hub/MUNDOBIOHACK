(() => {
  "use strict";

  const config = window.MUNDO_BIOHACK_CONFIG || {};
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const searchDialog = document.querySelector("[data-search-dialog]");
  const searchInput = document.querySelector("#site-search");
  const searchForm = document.querySelector("[data-search-form]");
  const searchResults = document.querySelector("[data-search-results]");
  const searchItems = [...document.querySelectorAll("[data-search-item]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a[href^='#']")];
  let lastFocusedElement = null;

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

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
    if (element.dataset.configLink === "legalContact" && !element.textContent.trim()) {
      element.textContent = url.replace(/^mailto:/i, "");
    }
    element.hidden = false;
  });

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
    }, { once: false });
  });

  const setMenu = (open) => {
    if (!menuButton || !mobileNav) return;
    mobileNav.dataset.open = String(open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", open);
  };

  const menuIsOpen = () => mobileNav?.dataset.open === "true";

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(!menuIsOpen());
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!menuIsOpen()) return;
    if (mobileNav?.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menuIsOpen()) {
      setMenu(false);
      menuButton?.focus();
    }
    if (searchDialog?.open) {
      searchDialog.close();
      lastFocusedElement?.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenu(false);
  });

  const closeSearch = () => {
    if (!searchDialog?.open) return;
    searchDialog.close();
    lastFocusedElement?.focus();
  };

  document.querySelectorAll("[data-open-search]").forEach((button) => {
    button.addEventListener("click", () => {
      setMenu(false);
      lastFocusedElement = button;
      searchDialog?.showModal();
      requestAnimationFrame(() => searchInput?.focus());
    });
  });

  document.querySelector("[data-close-search]")?.addEventListener("click", closeSearch);

  searchDialog?.addEventListener("click", (event) => {
    const rect = searchDialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) closeSearch();
  });

  const createResult = (item) => {
    const button = document.createElement("button");
    const type = document.createElement("small");
    const title = document.createElement("strong");
    const description = document.createElement("span");

    button.type = "button";
    button.className = "search-result";
    type.textContent = item.dataset.searchType || "Contenido";
    title.textContent = item.dataset.searchTitle || "Contenido";
    description.textContent = item.dataset.searchDescription || "";
    button.append(type, title, description);

    button.addEventListener("click", () => {
      const href = item.dataset.searchHref;
      const target = item.dataset.searchTarget;
      closeSearch();

      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      if (target) {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return button;
  };

  const renderSearch = (query) => {
    if (!searchResults) return;
    searchResults.replaceChildren();

    const term = normalize(query);
    if (!term) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "Escribí una palabra para buscar contenidos.";
      searchResults.append(empty);
      return;
    }

    const matches = searchItems.filter((item) => {
      const searchable = normalize(
        `${item.dataset.searchType || ""} ${item.dataset.searchTitle || ""} ${item.dataset.searchDescription || ""}`
      );
      return searchable.includes(term);
    });

    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "No encontramos coincidencias en esta página.";
      searchResults.append(empty);
      return;
    }

    matches.slice(0, 14).forEach((item) => searchResults.append(createResult(item)));
  };

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearch(searchInput?.value);
  });

  searchInput?.addEventListener("input", () => {
    if ((searchInput.value || "").trim().length >= 2) renderSearch(searchInput.value);
  });

  const clipsTrack = document.querySelector("[data-clips-track]");
  const clipsPrev = document.querySelector("[data-clips-prev]");
  const clipsNext = document.querySelector("[data-clips-next]");

  const clipStep = () => {
    if (!clipsTrack) return 260;
    const card = clipsTrack.querySelector(".clip-card");
    if (!card) return 260;
    const styles = getComputedStyle(clipsTrack);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return card.getBoundingClientRect().width + gap;
  };

  const updateClipControls = () => {
    if (!clipsTrack || !clipsPrev || !clipsNext) return;
    const maxScroll = Math.max(0, clipsTrack.scrollWidth - clipsTrack.clientWidth);
    const hasOverflow = maxScroll > 2;
    clipsPrev.hidden = !hasOverflow;
    clipsNext.hidden = !hasOverflow;
    clipsPrev.disabled = clipsTrack.scrollLeft <= 2;
    clipsNext.disabled = clipsTrack.scrollLeft >= maxScroll - 2;
  };

  clipsPrev?.addEventListener("click", () => {
    clipsTrack?.scrollBy({ left: -clipStep() * 2, behavior: "smooth" });
  });

  clipsNext?.addEventListener("click", () => {
    clipsTrack?.scrollBy({ left: clipStep() * 2, behavior: "smooth" });
  });

  clipsTrack?.addEventListener("scroll", () => {
    requestAnimationFrame(updateClipControls);
  }, { passive: true });

  if ("IntersectionObserver" in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const visibility = new Map();

    const updateCurrent = () => {
      const visible = [...visibility.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0];
      if (!visible) return;
      const activeHref = `#${visible[0].id}`;
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === activeHref) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibility.set(entry.target, entry.intersectionRatio));
      updateCurrent();
    }, {
      rootMargin: "-24% 0px -58% 0px",
      threshold: [0, .12, .25, .5, .75]
    });

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener("load", updateClipControls);
  window.addEventListener("resize", updateClipControls);
  updateClipControls();


  // V15.4 — rutas temáticas funcionales
  const themeDialog = document.querySelector("[data-theme-dialog]");
  const themeRoutes = {
    sueno: {
      title: "Sueño",
      description: "Para empezar por sueño, priorizamos una explicación extensa sobre ritmos, hábitos y arquitectura del descanso.",
      source: "Andrew Huberman · video externo",
      url: "https://www.youtube.com/watch?v=JaRGJVrJBQ8"
    },
    energia: {
      title: "Energía",
      description: "Una puerta de entrada general para pensar movimiento, hábitos cotidianos y energía sin buscar una solución mágica.",
      source: "Harvard Health · artículo externo",
      url: "https://www.health.harvard.edu/healthy-aging-and-longevity/ways-to-maximize-your-energy"
    },
    rendimiento: {
      title: "Rendimiento",
      description: "Un marco amplio para pensar ejercicio, capacidad física, salud a largo plazo y consistencia.",
      source: "Peter Attia MD · video externo",
      url: "https://www.youtube.com/watch?v=B94rbrZkXPI"
    },
    longevidad: {
      title: "Longevidad",
      description: "Antes de protocolos extremos, conviene entender el marco general de lifespan, healthspan y decisiones sostenibles.",
      source: "Peter Attia MD · video externo",
      url: "https://www.youtube.com/watch?v=B94rbrZkXPI"
    },
    nutricion: {
      title: "Nutrición",
      description: "Una referencia institucional para separar principios generales de alimentación saludable de modas y claims aislados.",
      source: "OMS · fuente institucional",
      url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"
    },
    mente: {
      title: "Mente",
      description: "Un punto de partida institucional para entender bienestar mental, factores que influyen y enfoques de respuesta.",
      source: "OMS · fuente institucional",
      url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response"
    }
  };

  document.querySelectorAll("[data-theme-open]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const route = themeRoutes[button.dataset.themeOpen];
      if (!route || !themeDialog) return;
      themeDialog.querySelector("[data-theme-title]").textContent = route.title;
      themeDialog.querySelector("[data-theme-description]").textContent = route.description;
      themeDialog.querySelector("[data-theme-source]").textContent = route.source;
      const link = themeDialog.querySelector("[data-theme-link]");
      link.href = route.url;
      themeDialog.showModal();
    });
  });
  document.querySelector("[data-theme-close]")?.addEventListener("click", () => themeDialog?.close());

  // V15.4 — información de producto siempre funcional, venta opcional con canal real
  const productDialog = document.querySelector("[data-product-dialog]");
  const productDetails = {
    "plantillas-fir": {
      title: "Plantillas FIR",
      summary: "Una herramienta para calzado vinculada a tecnología FIR, presentada desde materiales, formato y experiencia de uso.",
      points: [
        "Qué es: una plantilla/accesorio que se integra al calzado.",
        "Cómo se incorpora: como parte de una rutina cotidiana de movimiento.",
        "Criterio Mundo Biohack: conocer materiales y uso antes de atribuir beneficios específicos."
      ],
      message: "Hola, llegué desde Mundo Biohack y quiero conocer más sobre las Plantillas FIR."
    },
    "squeeze-alcaline": {
      title: "Squeeze Alcaline",
      summary: "Una botella reutilizable del ecosistema Mundo Biohack, pensada para acompañar la hidratación cotidiana.",
      points: [
        "Qué es: una squeeze/botella reutilizable.",
        "Cómo se incorpora: como herramienta de hidratación diaria.",
        "Criterio Mundo Biohack: revisar materiales y especificaciones antes de decidir."
      ],
      message: "Hola, llegué desde Mundo Biohack y quiero conocer más sobre la Squeeze Alcaline."
    },
    "brazalete-fir": {
      title: "Brazalete FIR",
      summary: "Un accesorio wearable vinculado a tecnología FIR, presentado desde materiales, formato y experiencia de uso.",
      points: [
        "Qué es: un brazalete de uso cotidiano.",
        "Cómo se incorpora: como accesorio wearable.",
        "Criterio Mundo Biohack: no atribuimos beneficios terapéuticos no verificados."
      ],
      message: "Hola, llegué desde Mundo Biohack y quiero conocer más sobre el Brazalete FIR."
    }
  };

  const configureProductDialogLink = (detail) => {
    const link = productDialog?.querySelector("[data-product-dialog-whatsapp]");
    if (!link) return;
    const base = config.salesWhatsAppUrl || config.communityWhatsAppUrl || "";
    if (!base) {
      link.hidden = true;
      link.removeAttribute("href");
      return;
    }
    const separator = base.includes("?") ? "&" : "?";
    link.href = `${base}${separator}text=${encodeURIComponent(detail.message)}`;
    link.hidden = false;
  };

  document.querySelectorAll("[data-product-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const detail = productDetails[button.dataset.productOpen];
      if (!detail || !productDialog) return;
      productDialog.querySelector("[data-product-title]").textContent = detail.title;
      productDialog.querySelector("[data-product-summary]").textContent = detail.summary;
      const list = productDialog.querySelector("[data-product-points]");
      list.replaceChildren(...detail.points.map((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        return li;
      }));
      configureProductDialogLink(detail);
      productDialog.showModal();
    });
  });
  document.querySelector("[data-product-close]")?.addEventListener("click", () => productDialog?.close());

  [themeDialog, productDialog].forEach((dialog) => {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      const eventName = element.dataset.track;
      if (typeof window.gtag === "function" && eventName) {
        window.gtag("event", eventName);
      }
    });
  });
})();
