// Interacciones mínimas del prototipo — nada de lógica de negocio real.

document.addEventListener("DOMContentLoaded", () => {
  // Menú mobile (bottom sheet)
  const navToggle = document.getElementById("navToggle");
  const mobileNavSheet = document.getElementById("mobileNavSheet");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");

  const openMobileNav = () => {
    mobileNavSheet?.classList.add("is-open");
    mobileNavSheet?.setAttribute("aria-hidden", "false");
    if (mobileNavOverlay) mobileNavOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const closeMobileNav = () => {
    mobileNavSheet?.classList.remove("is-open");
    mobileNavSheet?.setAttribute("aria-hidden", "true");
    if (mobileNavOverlay) mobileNavOverlay.hidden = true;
    document.body.style.overflow = "";
  };

  navToggle?.addEventListener("click", () => {
    if (mobileNavSheet?.classList.contains("is-open")) closeMobileNav();
    else openMobileNav();
  });
  mobileNavOverlay?.addEventListener("click", closeMobileNav);
  mobileNavSheet?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  // Modal "ver evento completo" (eventos.html)
  const eventCards = document.querySelectorAll(".event-card");
  const eventModal = document.getElementById("eventModal");
  const eventModalOverlay = document.getElementById("eventModalOverlay");
  const eventModalClose = document.getElementById("eventModalClose");
  const eventModalMedia = document.getElementById("eventModalMedia");
  const eventModalDate = document.getElementById("eventModalDate");
  const eventModalTitle = document.getElementById("eventModalTitle");
  const eventModalDesc = document.getElementById("eventModalDesc");

  if (eventCards.length && eventModal && eventModalOverlay) {
    const openEventModal = (card) => {
      const media = card.querySelector(".placeholder-event, img");
      eventModalMedia.innerHTML = media ? media.outerHTML : "";
      eventModalDate.textContent = card.querySelector(".event-date")?.textContent || "";
      eventModalTitle.textContent = card.querySelector("h3")?.textContent || "";
      eventModalDesc.textContent = card.querySelector(".event-card-body p:last-child")?.textContent || "";
      eventModalOverlay.hidden = false;
      eventModal.classList.add("is-open");
      eventModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeEventModal = () => {
      eventModal.classList.remove("is-open");
      eventModalOverlay.hidden = true;
      eventModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    eventCards.forEach((card) => {
      card.addEventListener("click", () => openEventModal(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openEventModal(card);
        }
      });
    });

    eventModalClose.addEventListener("click", closeEventModal);
    eventModalOverlay.addEventListener("click", closeEventModal);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeEventModal();
    });
  }

  // Aparición sutil al hacer scroll (ficha de producto, etc.)
  const revealEls = document.querySelectorAll(".qs-reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Zoom lento ("Ken Burns") en las imágenes/video principales al entrar en pantalla
  const kbEls = document.querySelectorAll(".kb-zoom");
  if (kbEls.length && "IntersectionObserver" in window) {
    const kbObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-zoomed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    kbEls.forEach((el) => kbObserver.observe(el));
  }

  // Reproducir/pausar los videos autoplay según si están a la vista:
  // en mobile, varios <video autoplay> compitiendo apenas carga la
  // página suelen hacer que el navegador se niegue a reproducir
  // alguno; forzamos el play() recién cuando cada uno entra en pantalla.
  const autoplayVideos = document.querySelectorAll("video[autoplay]:not(.ugc-card-media), video[data-autoplay]:not(.ugc-card-media)");
  if (autoplayVideos.length && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    autoplayVideos.forEach((video) => videoObserver.observe(video));
  }

  // Badges de confianza: animan unas vueltas al entrar en pantalla, no para siempre
  const shopBadges = document.querySelector(".shop-badges");
  if (shopBadges && "IntersectionObserver" in window) {
    const badgeObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    badgeObserver.observe(shopBadges);
  }

  // Nav: blob flotante que marca la sección/página activa
  const mainNav = document.getElementById("mainNav");
  const navBlob = document.getElementById("navBlob");
  if (mainNav && navBlob) {
    const navLinkEls = Array.from(mainNav.querySelectorAll(":scope > a, .nav-item-link"));

    function moveBlobTo(el) {
      if (!el) {
        navBlob.style.opacity = "0";
        return;
      }
      const padX = 16;
      // `html { zoom: 0.9 }` ya escala lo que devuelve getBoundingClientRect;
      // si seteamos esa distancia tal cual en un transform, el motor la vuelve
      // a escalar por el zoom al renderizarla y la burbuja queda corta (más
      // corta cuanto más lejos del borde izquierdo esté el ítem activo).
      // Dividimos por el zoom para que, al re-escalarse, caiga en el lugar justo.
      const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const navRect = mainNav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const x = (elRect.left - navRect.left - padX) / zoom;
      navBlob.style.width = `${(elRect.width + padX * 2) / zoom}px`;
      navBlob.style.transform = `translate(${x}px, -50%)`;
      navBlob.style.opacity = "1";
    }

    function setActiveNavLink(el) {
      navLinkEls.forEach((a) => a.classList.remove("is-active"));
      if (el) el.classList.add("is-active");
      moveBlobTo(el);
    }

    // Catálogo / Eventos / Para negocios: activo si es la página actual
    // (normaliza la extensión .html por si el hosting sirve URLs "limpias")
    const normalizePath = (p) => {
      const clean = p.split("#")[0].replace(/\.html$/, "").replace(/\/$/, "");
      return clean === "" ? "index" : clean.replace(/^\//, "");
    };
    let currentPath = normalizePath(window.location.pathname);
    if (currentPath.startsWith("evento-")) currentPath = "eventos"; // páginas de cada evento
    const pageLink = navLinkEls.find((a) => {
      const href = a.getAttribute("href") || "";
      return !href.startsWith("#") && normalizePath(href) === currentPath;
    });
    if (pageLink) setActiveNavLink(pageLink);

    // Home: scroll-spy para Inicio / Contacto
    const scrollTargets = [
      { id: "inicio", selector: 'a[href="#inicio"]' },
      { id: "contacto", selector: 'a[href="#contacto"]' },
    ]
      .map(({ id, selector }) => {
        const sectionEl = document.getElementById(id);
        const linkEl = mainNav.querySelector(selector);
        return sectionEl && linkEl ? { sectionEl, linkEl } : null;
      })
      .filter(Boolean);

    if (scrollTargets.length && "IntersectionObserver" in window) {
      const intersecting = new Set();
      const navScrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intersecting.add(entry.target);
            } else {
              intersecting.delete(entry.target);
            }
          });
          const activeTarget = scrollTargets.find((t) => intersecting.has(t.sectionEl));
          setActiveNavLink(activeTarget ? activeTarget.linkEl : null);
        },
        { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
      );
      scrollTargets.forEach(({ sectionEl }) => navScrollObserver.observe(sectionEl));
    }

    window.addEventListener("resize", () => {
      const active = mainNav.querySelector(".is-active");
      if (active) moveBlobTo(active);
    });

    // Reubica la burbuja cuando terminan de cargar las tipografías web: hasta
    // ese momento el nav se mide con la fuente de reserva, que tiene un ancho
    // distinto y deja la burbuja desplazada respecto al texto real.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const active = mainNav.querySelector(".is-active");
        if (active) moveBlobTo(active);
      });
    }
  }

  // Producto (producto.html): tarjetas de ingredientes expandibles
  document.querySelectorAll(".ing-card").forEach((card) => {
    const toggle = card.querySelector(".ing-card-toggle");
    const label = toggle && toggle.querySelector("span");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (label) label.textContent = isOpen ? "Ver menos" : "Ver más";
    });
  });

  // Producto (producto.html): "La fórmula" — selector a la izquierda, panel
  // animado a la derecha. Cambia con click/teclado en cualquier dispositivo
  // y al pasar el mouse en desktop; el visual reacciona levemente al cursor.
  const fxList = document.querySelector(".fx-list");
  if (fxList) {
    const fxItems = Array.from(fxList.querySelectorAll(".fx-item"));
    const fxSlides = document.querySelectorAll(".fx-slide");
    const fxPanel = document.querySelector(".fx-panel");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activateFx = (item, { focus = false } = {}) => {
      fxItems.forEach((it) => {
        const on = it === item;
        it.classList.toggle("is-active", on);
        it.setAttribute("aria-selected", on ? "true" : "false");
        it.tabIndex = on ? 0 : -1;
      });
      fxSlides.forEach((s) => s.classList.toggle("is-active", s.id === item.dataset.target));
      if (focus) item.focus();
      if (fxList.scrollWidth > fxList.clientWidth) {
        item.scrollIntoView({ inline: "center", block: "nearest", behavior: calm ? "auto" : "smooth" });
      }
    };
    fxItems.forEach((item, i) => {
      item.addEventListener("click", () => activateFx(item));
      if (finePointer) item.addEventListener("mouseenter", () => activateFx(item));
      item.addEventListener("keydown", (e) => {
        const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: fxItems.length - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        activateFx(fxItems[(next + fxItems.length) % fxItems.length], { focus: true });
      });
    });
    if (finePointer && !calm && fxPanel) {
      let raf = 0;
      fxPanel.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = fxPanel.getBoundingClientRect();
          fxPanel.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
          fxPanel.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        });
      });
      fxPanel.addEventListener("pointerleave", () => {
        fxPanel.style.setProperty("--px", 0);
        fxPanel.style.setProperty("--py", 0);
      });
    }
  }

  // Lifestyle: interacciones simuladas en las cards UGC (like + compartir)
  // (delegado: las cards también pueden venir del CMS después de cargar la página)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".ugc-like, .ugc-save, .ugc-comment");
    if (!btn) return;
    if (btn.classList.contains("ugc-comment")) {
      btn.classList.remove("is-tapped");
      void btn.offsetWidth;
      btn.classList.add("is-tapped");
      return;
    }
    const countEl = btn.querySelector(".ugc-action-count");
    const base = parseInt(btn.dataset.base || "0", 10);
    const active = btn.classList.toggle(btn.classList.contains("ugc-like") ? "is-liked" : "is-saved");
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    if (countEl) countEl.textContent = String(base + (active ? 1 : 0));
  });

  // Lifestyle: carrusel curvo de videos UGC (arco tipo cilindro, drag + momentum + auto-scroll)
  const ugcCarousel = document.getElementById("ugcCarousel");
  const ugcTrack = document.getElementById("ugcTrack");
  if (ugcCarousel && ugcTrack) {
    let cards = Array.from(ugcTrack.children);
    let N = cards.length;
    const reduceMotionUgc = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO_SPEED = 26; // px/s, auto-scroll hacia la izquierda
    let cardW = 150; // ancho real de la card, medido en measure() (responsive vía CSS clamp)
    let pitch = 190; // separación base entre centros, recalculada en resize
    let containerW = 0;
    let scrollX = 0; // avanza con el tiempo y con el drag
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let lastDragX = 0;
    let lastDragT = 0;
    let velocity = 0; // px/s, decae tras soltar
    let lastFrameT = null;
    let carouselVisible = false;
    new IntersectionObserver((en) => { carouselVisible = en[0].isIntersecting; }, { rootMargin: "80px" }).observe(ugcCarousel);

    function measure() {
      containerW = ugcCarousel.clientWidth;
      cardW = cards[0].getBoundingClientRect().width || cardW;
      // mismo rango relativo al ancho de card que en desktop (0.88x a 1.27x),
      // así en mobile no se superponen ni pierden la curvatura del cilindro
      pitch = cardW * 1.22;
    }
    measure();
    window.addEventListener("resize", measure);

    function layout() {
      const total = N * pitch;
      const half = total / 2;
      const maxD = Math.max(1, containerW / 2);
      cards.forEach((card, i) => {
        const raw = i * pitch - scrollX;
        // envuelve dentro de (-half, half] para loop infinito sin saltos visibles
        let wrapped = ((raw % total) + total) % total;
        if (wrapped > half) wrapped -= total;
        const d = Math.min(1, Math.abs(wrapped) / maxD);
        const scale = 1.16 - 0.4 * d; // la del medio es la más grande; las de los costados se achican
        const opacity = 1 - 0.65 * d * d;
        card.style.transform = `translate(-50%, -50%) translate(${wrapped}px, 0) scale(${scale})`;
        card.style.zIndex = String(1000 - Math.round(d * 100));
        card.style.opacity = String(Math.max(0.3, opacity));
        // Rendimiento: solo se reproducen las tarjetas cercanas al centro; el resto queda pausado en su póster.
        const v = card._v || (card._v = card.querySelector("video"));
        if (v) {
          const want = carouselVisible && d < 0.5;
          if (want !== card._play) {
            card._play = want;
            if (want) v.play().catch(() => {}); else v.pause();
          }
        }
      });
    }

    // Flechas: desplazan una tarjeta con una animación corta
    let nudge = null;
    const goBy = (dir) => { nudge = { from: scrollX, to: scrollX + dir * pitch, t0: performance.now() }; velocity = 0; };
    document.getElementById("commPrev")?.addEventListener("click", () => goBy(-1));
    document.getElementById("commNext")?.addEventListener("click", () => goBy(1));

    function tick(now) {
      if (lastFrameT === null) lastFrameT = now;
      const dt = (now - lastFrameT) / 1000;
      lastFrameT = now;
      if (nudge) {
        const k = Math.min(1, (performance.now() - nudge.t0) / 550), e = 1 - Math.pow(1 - k, 3);
        scrollX = nudge.from + (nudge.to - nudge.from) * e;
        if (k >= 1) nudge = null;
      } else if (!reduceMotionUgc && !dragging) {
        scrollX += AUTO_SPEED * dt;
        if (Math.abs(velocity) > 2) {
          scrollX += velocity * dt;
          velocity *= Math.pow(0.05, dt); // decae ~95%/s tras soltar
        } else {
          velocity = 0;
        }
      }
      if (carouselVisible || nudge) layout(); else if (cards.some((c) => c._play)) layout();
      requestAnimationFrame(tick);
    }

    // El CMS puede reemplazar las tarjetas: se vuelven a leer y se recoloca todo
    ugcTrack.addEventListener("ugc:refresh", () => {
      cards = Array.from(ugcTrack.children);
      N = cards.length;
      if (!N) return;
      measure();
      layout();
    });

    // Posición inicial antes del primer frame animado (evita el flash en -9999px)
    layout();
    requestAnimationFrame(tick);

    function pointerX(evt) {
      return evt.touches ? evt.touches[0].clientX : evt.clientX;
    }

    function onDragStart(evt) {
      if (reduceMotionUgc) return;
      dragging = true;
      velocity = 0;
      ugcCarousel.classList.add("is-dragging");
      const x = pointerX(evt);
      dragStartX = x;
      dragStartScroll = scrollX;
      lastDragX = x;
      lastDragT = performance.now();
    }
    function onDragMove(evt) {
      if (!dragging) return;
      const x = pointerX(evt);
      scrollX = dragStartScroll - (x - dragStartX);
      const now = performance.now();
      const dt = (now - lastDragT) / 1000;
      if (dt > 0) velocity = -(x - lastDragX) / dt;
      lastDragX = x;
      lastDragT = now;
    }
    function onDragEnd() {
      if (!dragging) return;
      dragging = false;
      ugcCarousel.classList.remove("is-dragging");
    }

    if (!reduceMotionUgc) {
      ugcCarousel.addEventListener("pointerdown", onDragStart);
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd);
      ugcCarousel.addEventListener("touchstart", onDragStart, { passive: true });
      window.addEventListener("touchmove", onDragMove, { passive: true });
      window.addEventListener("touchend", onDragEnd);
    }

    // Comentarios y likes flotantes: posición aleatoria en cada aparición, siempre por encima del carrusel
    const ugcComments = document.querySelector(".ugc-comments");
    if (ugcComments && !reduceMotionUgc) {
      const floaters = Array.from(ugcComments.querySelectorAll(".ugc-comment-bubble, .ugc-like-badge"));
      let lastIndex = -1;
      function popFloater() {
        let i = Math.floor(Math.random() * floaters.length);
        if (floaters.length > 1 && i === lastIndex) i = (i + 1) % floaters.length;
        lastIndex = i;
        const el = floaters[i];
        const left = 6 + Math.random() * 76; // %
        const top = 6 + Math.random() * 82; // %
        el.classList.remove("is-popping");
        el.style.left = `${left}%`;
        el.style.top = `${top}%`;
        void el.offsetWidth; // fuerza reflow para reiniciar la animación
        el.classList.add("is-popping");
      }
      popFloater();
      setInterval(popFloater, 1100);
    }
  }

  document.querySelectorAll(".ugc-share").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const shareUrl = window.location.href.split("#")[0] + "#lifestyle";
      const shareData = {
        title: "UP SKY Energy Drink",
        text: "Mirá este video de la comunidad UP SKY",
        url: shareUrl,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return; // el usuario cerró el panel de compartir
        }
      }

      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (err) {
        /* portapapeles no disponible: igual mostramos la confirmación visual */
      }
      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", "Enlace copiado");
      window.clearTimeout(btn._ugcShareTimeout);
      btn._ugcShareTimeout = window.setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.setAttribute("aria-label", "Compartir");
      }, 1600);
    });
  });

  // Hero: carrusel deslizable (swipe) con dots y flechas, solo si hay más de una foto
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const heroSlides = Array.from(heroSlider.querySelectorAll(".hero-slide"));
    const heroDotsWrap = document.getElementById("heroDots");
    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");

    if (heroSlides.length > 1) {
      heroSlides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
        dot.type = "button";
        dot.setAttribute("aria-label", "Ir a la foto " + (i + 1));
        dot.addEventListener("click", () => goToHeroSlide(i));
        heroDotsWrap.appendChild(dot);
      });
      heroDotsWrap.hidden = false;
      heroPrev.hidden = false;
      heroNext.hidden = false;

      const heroDots = Array.from(heroDotsWrap.querySelectorAll(".hero-dot"));

      function goToHeroSlide(i) {
        const target = heroSlides[Math.max(0, Math.min(heroSlides.length - 1, i))];
        target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }

      function currentHeroIndex() {
        const sliderLeft = heroSlider.getBoundingClientRect().left;
        let closest = 0;
        let closestDist = Infinity;
        heroSlides.forEach((slide, i) => {
          const dist = Math.abs(slide.getBoundingClientRect().left - sliderLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        return closest;
      }

      heroPrev.addEventListener("click", () => goToHeroSlide(currentHeroIndex() - 1));
      heroNext.addEventListener("click", () => goToHeroSlide(currentHeroIndex() + 1));

      if ("IntersectionObserver" in window) {
        const heroDotObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                const idx = heroSlides.indexOf(entry.target);
                heroDots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
              }
            });
          },
          { root: heroSlider, threshold: [0.6] }
        );
        heroSlides.forEach((s) => heroDotObserver.observe(s));
      }
    }
  }

  // ---------- Carrito ----------
  // Prototipo: sin backend ni pasarela de pago. El "checkout" arma un
  // mensaje de WhatsApp con el pedido, que es como ya opera la marca.
  const WHATSAPP_NUMBER = "5493454143901";
  const CART_STORAGE_KEY = "upsky-cart-v2";

  const cartButton = document.getElementById("cartButton");
  const cartCount = document.getElementById("cartCount");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartClose = document.getElementById("cartClose");
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartClearBtn = document.getElementById("cartClear");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cartButton && cartDrawer) {
    const formatPrice = (value) =>
      "$" + value.toLocaleString("es-AR", { maximumFractionDigits: 0 });

    // Descuentos por cantidad: item.tiers = [[cantidadMinima, porcentaje], ...]
    const parseTiers = (str) =>
      (str || "")
        .split(",")
        .map((t) => t.split(":").map(Number))
        .filter((t) => t.length === 2 && t.every((n) => !Number.isNaN(n)))
        .sort((a, b) => a[0] - b[0]);
    const discountFor = (item) => {
      // Los productos de un mismo grupo (ej. vaso negro + vaso rosa) suman cantidad para la escala.
      const qty = item.group
        ? Object.values(cart).filter((x) => x.group === item.group).reduce((n, x) => n + x.qty, 0)
        : item.qty;
      let pct = 0;
      (item.tiers || []).forEach(([min, p]) => {
        if (qty >= min) pct = p;
      });
      return pct;
    };
    const unitPrice = (item) => Math.round(item.price * (1 - discountFor(item) / 100));
    const lineTotal = (item) => unitPrice(item) * item.qty;

    const loadCart = () => {
      try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    };
    const saveCart = (cart) => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch {
        /* localStorage no disponible: el carrito sigue funcionando en memoria */
      }
    };

    let cart = loadCart(); // { [id]: { name, price, qty } }

    function renderCart() {
      const ids = Object.keys(cart);
      const totalQty = ids.reduce((sum, id) => sum + cart[id].qty, 0);
      const totalPrice = ids.reduce((sum, id) => sum + lineTotal(cart[id]), 0);

      cartDrawer.classList.toggle("is-empty", ids.length === 0);
      cartCount.textContent = String(totalQty);
      cartCount.hidden = totalQty === 0;
      cartTotalEl.textContent = formatPrice(totalPrice);

      cartItemsEl.innerHTML = "";
      if (ids.length === 0) {
        cartItemsEl.appendChild(cartEmpty);
        cartEmpty.hidden = false;
        return;
      }

      ids.forEach((id) => {
        const item = cart[id];
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div>
            <p class="cart-item-name">${String(item.name).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))}</p>
            <p class="cart-item-price">${formatPrice(unitPrice(item))} c/u${discountFor(item) ? ` · <strong>${discountFor(item)}% OFF</strong>` : ""}</p>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" type="button" data-action="decrease" aria-label="Restar">−</button>
              <span>${item.qty}</span>
              <button class="cart-qty-btn" type="button" data-action="increase" aria-label="Sumar">+</button>
            </div>
          </div>
          <div class="cart-item-side">
            <span class="cart-item-total">${formatPrice(lineTotal(item))}</span>
            <button class="cart-item-remove" type="button" data-action="remove">Quitar</button>
          </div>
        `;
        row.querySelector('[data-action="increase"]').addEventListener("click", () => {
          if (!cart[id].max || cart[id].qty < cart[id].max) cart[id].qty += 1;
          persistAndRender();
        });
        row.querySelector('[data-action="decrease"]').addEventListener("click", () => {
          cart[id].qty -= 1;
          if (cart[id].qty <= 0) delete cart[id];
          persistAndRender();
        });
        row.querySelector('[data-action="remove"]').addEventListener("click", () => {
          delete cart[id];
          persistAndRender();
        });
        cartItemsEl.appendChild(row);
      });
    }

    function persistAndRender() {
      saveCart(cart);
      renderCart();
    }

    function openCart() {
      cartDrawer.classList.add("is-open");
      cartDrawer.setAttribute("aria-hidden", "false");
      cartOverlay.hidden = false;
    }
    function closeCart() {
      cartDrawer.classList.remove("is-open");
      cartDrawer.setAttribute("aria-hidden", "true");
      cartOverlay.hidden = true;
    }

    cartDrawer.querySelectorAll("[data-cart-link]").forEach((a) =>
      a.addEventListener("click", (e) => {
        const onCatalog = /catalogo(\.html)?$/.test(location.pathname);
        closeCart();
        if (onCatalog) {
          e.preventDefault();
          document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
        }
      })
    );
    cartButton.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeCart();
    });

    cartClearBtn.addEventListener("click", () => {
      cart = {};
      persistAndRender();
    });

    // Steppers de cantidad y "Agregar al carrito" (delegado: también funciona en cards creadas por el CMS)
    document.addEventListener("click", (e) => {
      const qb = e.target.closest(".qty-btn");
      if (qb) {
        const stepper = qb.closest(".qty-stepper");
        const valueEl = stepper && stepper.querySelector(".qty-value");
        if (!valueEl) return;
        const max = Number(stepper.closest("[data-max]")?.dataset.max) || Infinity;
        let qty = Number(valueEl.textContent) || 1;
        qty = qb.dataset.action === "increase" ? Math.min(max, qty + 1) : Math.max(1, qty - 1);
        valueEl.textContent = qty;
        return;
      }
      const button = e.target.closest(".btn-add");
      if (!button) return;
      const card = button.closest("[data-id]");
      if (!card) return;
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const qtyEl = card.querySelector(".qty-value");
      const addQty = qtyEl ? Number(qtyEl.textContent) || 1 : 1;

      const max = Number(card.dataset.max) || 0;
      if (!cart[id]) cart[id] = { name, price, qty: 0, tiers: parseTiers(card.dataset.tiers), max, group: card.dataset.group || "" };
      cart[id].qty += addQty;
      if (max) cart[id].qty = Math.min(max, cart[id].qty);
      if (qtyEl) qtyEl.textContent = "1";
      persistAndRender();
    });

    // Datos de envío: se piden siempre antes de mandar el pedido,
    // sea un pedido chico o una compra por mayor.
    const shippingForm = document.getElementById("shippingForm");

    checkoutBtn.addEventListener("click", () => {
      const ids = Object.keys(cart);
      if (ids.length === 0) return;

      if (shippingForm && !shippingForm.reportValidity()) return;

      const lines = ids.map((id) => {
        const d = discountFor(cart[id]);
        return `- ${cart[id].name} x${cart[id].qty}${d ? ` (${d}% OFF)` : ""}`;
      });
      const total = ids.reduce((sum, id) => sum + lineTotal(cart[id]), 0);

      let message =
        "Hola! Quiero hacer este pedido:\n" +
        lines.join("\n") +
        `\nTotal: ${formatPrice(total)}`;

      if (shippingForm) {
        const name = document.getElementById("shipName").value.trim();
        const address = document.getElementById("shipAddress").value.trim();
        const city = document.getElementById("shipCity").value.trim();
        const cp = document.getElementById("shipCP").value.trim();

        message +=
          "\n\nDatos de envío:\n" +
          `Nombre: ${name}\n` +
          `Dirección: ${address}\n` +
          `Localidad: ${city}\n` +
          `Código postal: ${cp}`;
      }

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    });

    // API para el Asistente UP SKY: sumar al carrito y abrir el panel desde el chat.
    window.upskyCart = {
      add({ id, name, price, qty = 1, tiers = [], max = 0, group = "" }) {
        if (!cart[id]) cart[id] = { name, price, qty: 0, tiers, max, group };
        cart[id].qty += qty;
        if (max) cart[id].qty = Math.min(max, cart[id].qty);
        persistAndRender();
        const ids = Object.keys(cart);
        return {
          qty: cart[id].qty,
          unit: unitPrice(cart[id]),
          discount: discountFor(cart[id]),
          count: ids.reduce((n, k) => n + cart[k].qty, 0),
          total: ids.reduce((n, k) => n + lineTotal(cart[k]), 0),
          totalText: formatPrice(ids.reduce((n, k) => n + lineTotal(cart[k]), 0)),
        };
      },
      summary() {
        const ids = Object.keys(cart);
        return {
          lines: ids.map((k) => ({ name: cart[k].name, qty: cart[k].qty })),
          count: ids.reduce((n, k) => n + cart[k].qty, 0),
          totalText: formatPrice(ids.reduce((n, k) => n + lineTotal(cart[k]), 0)),
        };
      },
      open: openCart,
    };

    renderCart();
  }

  // Prueba: carrusel de escenas de producto (experimental)
  const ttStage = document.getElementById("ttStage");
  if (ttStage) {
    const ttItems = Array.from(ttStage.querySelectorAll(".tt-item"));
    const ttHeadline = document.getElementById("ttHeadline");
    const ttSub = document.getElementById("ttSub");
    const ttSteps = Array.from(document.querySelectorAll("#ttSteps .tt-step"));
    const ttPrev = document.getElementById("ttPrev");
    const ttNext = document.getElementById("ttNext");
    const ttReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ttSlides = [
      { headline: "Energía que<br>te acompaña", sub: "Frutilla · 355 cc · Bien fría, mejor" },
      { headline: "Taurina y<br>cafeína", sub: "Vitaminas B y C · Fórmula para tu ritmo" },
      { headline: "Sabor a<br>frutilla", sub: "Vidrio reciclable · Fácil de tomar" },
    ];

    let ttActive = 0;
    let ttAnimating = false;

    function ttAssignRole(el, i, n) {
      el.classList.remove("is-center", "is-left", "is-right");
      if (i === ttActive) el.classList.add("is-center");
      else if (i === (ttActive + n - 1) % n) el.classList.add("is-left");
      else if (i === (ttActive + 1) % n) el.classList.add("is-right");
    }

    function ttRender() {
      const n = ttItems.length;
      ttItems.forEach((item, i) => ttAssignRole(item, i, n));
      ttSteps.forEach((step, i) => step.classList.toggle("is-active", i === ttActive));
      if (ttHeadline) ttHeadline.innerHTML = ttSlides[ttActive].headline;
      if (ttSub) ttSub.textContent = ttSlides[ttActive].sub;
    }

    function ttNavigate(dir) {
      if (ttAnimating) return;
      ttAnimating = true;
      const n = ttItems.length;
      ttActive = dir === "next" ? (ttActive + 1) % n : (ttActive + n - 1) % n;
      ttRender();
      window.setTimeout(() => { ttAnimating = false; }, ttReduceMotion ? 0 : 650);
    }

    ttPrev && ttPrev.addEventListener("click", () => ttNavigate("prev"));
    ttNext && ttNext.addEventListener("click", () => ttNavigate("next"));
    ttRender();

    // Características flotando esporádicamente del lado derecho
    const ttAttrsWrap = document.getElementById("ttAttrs");
    if (ttAttrsWrap && !ttReduceMotion) {
      const ttAttrTexts = ["Taurina + Cafeína", "Vitaminas B y C", "Sabor a frutilla", "Botella de vidrio 355cc"];
      let ttAttrLast = -1;
      function ttPopAttr() {
        let i = Math.floor(Math.random() * ttAttrTexts.length);
        if (ttAttrTexts.length > 1 && i === ttAttrLast) i = (i + 1) % ttAttrTexts.length;
        ttAttrLast = i;
        const badge = document.createElement("span");
        badge.className = "tt-attr-badge";
        badge.textContent = ttAttrTexts[i];
        badge.style.top = `${10 + Math.random() * 72}%`;
        ttAttrsWrap.appendChild(badge);
        requestAnimationFrame(() => badge.classList.add("is-popping"));
        badge.addEventListener("animationend", () => badge.remove());
      }
      ttPopAttr();
      window.setInterval(ttPopAttr, 2600);
    }
  }
});

// Efecto "liquid glass" en las cards de productos destacados: el brillo
// especular sigue al cursor (solo con mouse; sin movimiento reducido).
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".home-widgets .product-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });
});

// Slider de fotos en cards (scroll-snap): sincroniza los puntos y permite flechas de teclado.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slider]").forEach((s) => {
    const track = s.querySelector(".media-slider-track");
    const dots = Array.from(s.querySelectorAll(".media-slider-dots span"));
        const prev = s.querySelector(".media-slider-arrow--prev");
    const next = s.querySelector(".media-slider-arrow--next");
    const go = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
    const touched = () => { s.dataset.userTouched = "1"; };
    prev && prev.addEventListener("click", (e) => { e.stopPropagation(); touched(); go(-1); });
    next && next.addEventListener("click", (e) => { e.stopPropagation(); touched(); go(1); });
    track.addEventListener("touchstart", touched, { passive: true });
    track.addEventListener("pointerdown", touched, { passive: true });
    let lastIdx = 0;
    const sync = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (prev) prev.hidden = i <= 0;
      if (next) next.hidden = i >= dots.length - 1;
    };
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    track.addEventListener("scroll", () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
      if (i !== lastIdx) {
        lastIdx = i;
        s.dispatchEvent(new CustomEvent("slidechange", { detail: { index: i } }));
      }
    }, { passive: true });
    // Avance automático (data-autoplay = ms). Se pausa con mouse/foco/touch y fuera de pantalla.
    const delay = Number(s.dataset.autoplay) || 0;
    if (delay && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let paused = false, visible = false, timer;
      const tick = () => {
        if (paused || !visible || document.hidden || s.dataset.userTouched) return;
        const i = Math.round(track.scrollLeft / track.clientWidth);
        track.scrollTo({ left: (i + 1) % dots.length * track.clientWidth, behavior: "smooth" });
      };
      const start = () => { clearInterval(timer); timer = setInterval(tick, delay); };
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.5 }).observe(s);
      ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach((ev) => s.addEventListener(ev, () => { paused = true; }, { passive: true }));
      ["mouseleave", "focusout"].forEach((ev) => s.addEventListener(ev, () => { paused = false; start(); }));
      s.addEventListener("touchend", () => { setTimeout(() => { paused = false; start(); }, 4000); }, { passive: true });
      start();
    }
    track.addEventListener("keydown", (e) => {
      touched();
      if (e.key === "ArrowRight") track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
      if (e.key === "ArrowLeft") track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
    });
  });
});

// Botón "Compartir" sobre la imagen de cada card (catálogo y mayorista).
// Móvil: hoja nativa de compartir. Escritorio: copia el enlace directo a la card.
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-grid [data-id], .price-grid [data-id]");
  if (!cards.length) return;

  let toast;
  const showToast = (msg) => {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "share-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { /* sin portapapeles */ }
      ta.remove();
      return ok;
    }
  };

  cards.forEach((card) => {
    const media = card.querySelector(".product-card-media");
    if (!media) return;
    if (!card.id) card.id = card.dataset.baseId || card.dataset.id;
    const name = card.dataset.name || "UP SKY";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "share-btn";
    btn.setAttribute("aria-label", `Compartir ${name}`);
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="19" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    media.appendChild(btn);
  });

  // Delegado: también funciona en cards creadas por el CMS. Si la card tiene enlace propio
  // (data-share-url, /p/...), se comparte ese; si no, el enlace a la card dentro de la página.
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".product-grid .share-btn, .price-grid .share-btn");
    if (!btn) return;
    const card = btn.closest("[data-id]");
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    const name = card.dataset.baseName || card.dataset.shareTitle || card.dataset.name || "UP SKY";
    const url = card.dataset.shareUrl
      ? new URL(card.dataset.shareUrl, location.origin).href
      : `${location.origin}${location.pathname}#${card.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "UP SKY Energy Drink", text: name, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    showToast((await copy(url)) ? "Enlace copiado" : "No se pudo copiar el enlace");
  });

  // Si llegan desde un enlace compartido, llevar a la card y resaltarla un momento.
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && target.matches("[data-id]")) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("is-shared-target");
      setTimeout(() => target.classList.remove("is-shared-target"), 2400);
    }, 400);
  }
});

// Selector de color del vaso: la foto que se ve es el color que se compra.
// Mientras la persona no elige, la galería avanza sola y la selección acompaña a la foto.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card[data-base-id]").forEach((card) => {
    const picker = card.querySelector(".color-picker");
    const slider = card.querySelector("[data-slider]");
    if (!picker) return;
    const opts = Array.from(picker.querySelectorAll(".color-opt"));
    const select = (i) => {
      const opt = opts[i];
      if (!opt) return;
      opts.forEach((o) => {
        const on = o === opt;
        o.classList.toggle("is-selected", on);
        o.setAttribute("aria-checked", String(on));
      });
      card.dataset.id = `${card.dataset.baseId}-${opt.dataset.color}`;
      card.dataset.name = `${card.dataset.baseName} (${opt.dataset.color})`;
    };
    opts.forEach((opt, i) => {
      opt.addEventListener("click", () => {
        select(i);
        if (slider) {
          slider.dataset.userTouched = "1";
          const track = slider.querySelector(".media-slider-track");
          track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
        }
      });
    });
    if (slider) slider.addEventListener("slidechange", (e) => select(e.detail.index));
    select(0);
  });
});

// Hero: efecto 3D al mover el mouse. La foto se inclina y se desplaza levemente
// siguiendo el cursor (con suavizado). Solo con mouse y sin "reducir movimiento".
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const photos = hero ? Array.from(hero.querySelectorAll(".hero-photo")) : [];
  if (!photos.length) return;
  const setT = (v) => photos.forEach((p) => { p.style.transform = v; });
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Sin mouse (celular/tablet): la foto se mueve sola, con un vaivén suave en 3D.
  if (!hasMouse) {
    let on = true, t0 = performance.now();
    let fx = 0, fy = 0, finger = false, fingerT = 0, fcx = 0, fcy = 0; // el dedo también inclina la foto
    new IntersectionObserver((en) => { on = en[0].isIntersecting; }, { threshold: 0.05 }).observe(hero);
    const setFinger = (e) => {
      const r = hero.getBoundingClientRect(), t = e.touches[0];
      fx = ((t.clientX - r.left) / r.width - 0.5) * 2;
      fy = ((t.clientY - r.top) / r.height - 0.5) * 2;
      finger = true; fingerT = performance.now();
    };
    hero.addEventListener("touchstart", setFinger, { passive: true });
    hero.addEventListener("touchmove", setFinger, { passive: true });
    const idle = (now) => {
      if (on && !document.hidden) {
        const t = (now - t0) / 1000;
        if (finger && now - fingerT > 1800) finger = false;
        const ax = Math.sin(t * 0.8) * 0.95, ay = Math.cos(t * 0.55) * 0.7;
        const tx = finger ? fx : ax, ty = finger ? fy : ay;
        fcx += (tx - fcx) * (finger ? 0.14 : 0.06);
        fcy += (ty - fcy) * (finger ? 0.14 : 0.06);
        const x = fcx, y = fcy;
        setT(
          `perspective(900px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) ` +
          `translate3d(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px, 0) scale(1.05)`);
      }
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(idle);
    return;
  }

  const MAX_ROT = 7;   // grados
  const MAX_SHIFT = 18; // px
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, inside = false;

  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    setT(
      `perspective(1100px) rotateY(${(cx * MAX_ROT).toFixed(2)}deg) rotateX(${(-cy * MAX_ROT).toFixed(2)}deg) ` +
      `translate3d(${(cx * MAX_SHIFT).toFixed(1)}px, ${(cy * MAX_SHIFT * 0.7).toFixed(1)}px, 0) scale(1.03)`);
    if (inside || Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = 0;
    }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 .. 1
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    inside = true;
    kick();
  });
  hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; inside = false; kick(); });
});

// Eventos: carrusel del hero (la tarjeta activa se expande, las vecinas se achican).
// Avanza solo con una barra de progreso; se pausa con el mouse. Click/swipe/teclas para moverlo.
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".ev-hero");
  const track = document.getElementById("evTrack");
  if (!hero || !track) return;
  const slides = Array.from(track.querySelectorAll(".ev-slide"));
  const pills = Array.from(document.querySelectorAll("#evPills .ev-pill"));
  const N = slides.length;
  const DUR = 6000;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = 0, timer = 0, userStopped = false;
  hero.style.setProperty("--ev-dur", `${DUR}ms`);

  const render = () => {
    slides.forEach((s, i) => {
      // Posición circular respecto de la activa: vecinas a ambos lados, así la activa queda centrada.
      const rel = (i - cur + N) % N;
      const d = Math.min(rel, N - rel);
      const opposite = N % 2 === 0 && rel === N / 2; // con cantidad par, la "opuesta" se oculta
      s.style.order = String(rel <= N / 2 ? rel : rel - N);
      s.dataset.d = d === 0 ? "0" : opposite || d >= 3 ? "far" : String(d);
      s.setAttribute("aria-hidden", d === 0 ? "false" : "true");
    });
    pills.forEach((p, i) => {
      p.classList.toggle("is-active", i === cur);
      p.setAttribute("aria-selected", String(i === cur));
    });
    // Los lugares vacíos a los lados no se achican solos: se compensa con el desplazamiento del track.
  };
  const schedule = () => {
    clearTimeout(timer);
    if (reduce || userStopped) return;
    timer = setTimeout(() => { if (!hero.classList.contains("is-paused") && !document.hidden) go(cur + 1, false); else schedule(); }, DUR);
  };
  const go = (i, byUser) => {
    cur = (i + N) % N;
    if (byUser) userStopped = true;
    // reinicia la animación de la barra
    pills.forEach((p) => { const sp = p.firstElementChild; sp.style.animation = "none"; void sp.offsetWidth; sp.style.animation = ""; });
    render();
    schedule();
  };

  slides.forEach((s, i) => s.addEventListener("click", (e) => { if (i !== cur) { e.preventDefault(); go(i, true); } }));
  pills.forEach((p, i) => p.addEventListener("click", () => go(i, true)));
  document.getElementById("evPrev")?.addEventListener("click", () => go(cur - 1, true));
  document.getElementById("evNext")?.addEventListener("click", () => go(cur + 1, true));
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(cur + 1, true);
    if (e.key === "ArrowLeft") go(cur - 1, true);
  });
  track.addEventListener("mouseenter", () => hero.classList.add("is-paused"));
  track.addEventListener("mouseleave", () => { hero.classList.remove("is-paused"); });
  // swipe
  let x0 = null;
  track.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  track.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 48) go(cur + (dx < 0 ? 1 : -1), true);
  });
  // brillo especular "liquid" que sigue al cursor sobre la tarjeta activa
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    slides.forEach((sl) => sl.addEventListener("pointermove", (e) => {
      const r = sl.getBoundingClientRect();
      sl.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      sl.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    }));
  }
  render(); schedule();
});

// Compartir evento (cada evento es una página propia). [data-share] funciona en el carrusel,
// la agenda y la página del evento. Móvil: hoja nativa. Escritorio: copia el enlace.
document.addEventListener("DOMContentLoaded", () => {
  const btns = document.querySelectorAll("[data-share]");
  if (!btns.length) return;
  let toast;
  const say = (msg) => {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "share-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(say.t);
    say.t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch { /* sin portapapeles */ }
      ta.remove(); return ok;
    }
  };
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-share]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const url = new URL(b.dataset.url, location.href).href;
    const title = b.dataset.title || "Evento UP SKY";
    if (navigator.share) {
      try { await navigator.share({ title: `${title} — UP SKY`, text: title, url }); return; }
      catch (err) { if (err && err.name === "AbortError") return; }
    }
    say((await copy(url)) ? "Enlace copiado" : "No se pudo copiar el enlace");
  });
});

// Agenda: brillo que sigue al cursor sobre cada card (solo con mouse).
document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".ag-card").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    c.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }));
});

// Productos destacados (mobile): flechas del carrusel horizontal.
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".hw-wrap");
  const track = wrap && wrap.querySelector(".home-widgets");
  if (!track) return;
  const prev = wrap.querySelector(".hw-arrow--prev");
  const next = wrap.querySelector(".hw-arrow--next");
  const step = () => {
    const c = track.querySelector(".product-card");
    return c ? (c.getBoundingClientRect().width + 10) * 1.6 : track.clientWidth * 0.7;
  };
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.hidden = track.scrollLeft <= 4;
    next.hidden = track.scrollLeft >= max;
  };
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
});

// Producto · "Lo que hay detrás de UP SKY": entrada, selector, conteo y parallax suave de la foto.
document.addEventListener("DOMContentLoaded", () => {
  const sec = document.getElementById("formula");
  if (!sec || !sec.classList.contains("fm")) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = Array.from(sec.querySelectorAll(".fm-row"));
  const slides = Array.from(sec.querySelectorAll(".fm-slide"));

  const count = (slide) => {
    slide.querySelectorAll(".fm-num").forEach((el) => {
      const to = parseFloat(el.dataset.to), dec = Number(el.dataset.dec || 0);
      const fmt = (v) => v.toFixed(dec).replace(".", ",");
      if (reduce) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), D = 900;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(to * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const select = (i, focus) => {
    rows.forEach((r, k) => {
      const on = k === i;
      r.classList.toggle("is-active", on);
      r.setAttribute("aria-selected", String(on));
      r.tabIndex = on ? 0 : -1;
    });
    slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
    count(slides[i]);
    if (focus) rows[i].focus();
  };
  rows.forEach((r, i) => {
    r.addEventListener("click", () => select(i));
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) r.addEventListener("mouseenter", () => select(i));
    r.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % rows.length, true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); select((i - 1 + rows.length) % rows.length, true); }
    });
  });

  // entrada al aparecer en pantalla
  let first = true;
  new IntersectionObserver((en, obs) => {
    if (!en[0].isIntersecting) return;
    sec.classList.add("is-in");
    if (first) { first = false; setTimeout(() => count(slides[0]), 500); }
    obs.disconnect();
  }, { threshold: 0.25 }).observe(sec);
  if (reduce) slides.forEach(count);

  // parallax leve de la foto (solo escritorio, sin "reducir movimiento")
  const photo = sec.querySelector(".fm-photo");
  if (photo && !reduce && window.matchMedia("(min-width: 901px) and (hover: hover)").matches) {
    let ticking = false;
    const upd = () => {
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      photo.style.transform = `translate3d(0, ${(p * -34).toFixed(1)}px, 0)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
});

// Aviso discreto sobre el botón flotante de WhatsApp (solo escritorio): aparece de vez en cuando,
// unos segundos, para recordar que se puede escribir. Se puede cerrar y no vuelve en esa sesión.
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.querySelector(".whatsapp-float");
  if (!fab) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches) return;
  try { if (sessionStorage.getItem("upsky-wa-nudge") === "off") return; } catch { /* sin storage */ }

  const msgs = [
    ["Hola, soy el Asistente UP SKY", "¿Te ayudo con tu pedido?"],
    ["¿Dudas sobre UP SKY?", "Preguntame lo que quieras"],
    ["¿Sos comercio?", "Te cuento los precios por mayor"],
  ];
  const bubble = document.createElement("div");
  bubble.className = "wa-nudge";
  bubble.setAttribute("role", "status");
  bubble.innerHTML =
    '<a class="wa-nudge-link" target="_blank" rel="noopener"><strong></strong><span></span></a>' +
    '<button type="button" class="wa-nudge-close" aria-label="Cerrar aviso">✕</button>';
  document.body.appendChild(bubble);
  const link = bubble.querySelector(".wa-nudge-link");
  link.href = fab.href;

  let i = 0, hideT, showT;
  const hide = () => bubble.classList.remove("is-on");
  const show = () => {
    if (document.hidden || document.getElementById("cartDrawer")?.classList.contains("is-open")) { schedule(20000); return; }
    const m = msgs[i++ % msgs.length];
    link.querySelector("strong").textContent = m[0];
    link.querySelector("span").textContent = m[1];
    bubble.classList.add("is-on");
    clearTimeout(hideT);
    hideT = setTimeout(() => { hide(); schedule(50000); }, 7000);
  };
  const schedule = (ms) => { clearTimeout(showT); showT = setTimeout(show, ms); };
  bubble.querySelector(".wa-nudge-close").addEventListener("click", () => {
    hide(); clearTimeout(hideT); clearTimeout(showT);
    try { sessionStorage.setItem("upsky-wa-nudge", "off"); } catch { /* sin storage */ }
  });
  link.addEventListener("click", (e) => {
    if (window.upskyAssistant) { e.preventDefault(); window.upskyAssistant.open(); }
    hide(); clearTimeout(hideT); clearTimeout(showT);
    try { sessionStorage.setItem("upsky-wa-nudge", "off"); } catch { /* sin storage */ }
  });
  bubble.addEventListener("mouseenter", () => clearTimeout(hideT));
  bubble.addEventListener("mouseleave", () => { hideT = setTimeout(() => { hide(); schedule(50000); }, 2500); });
  schedule(14000);
});

// Comunidad: copiar el hashtag.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("commTagCopy"), tag = document.getElementById("commTag");
  if (!btn || !tag) return;
  btn.addEventListener("click", async () => {
    const label = btn.querySelector("span");
    try { await navigator.clipboard.writeText(tag.textContent.trim()); label.textContent = "¡Copiado!"; }
    catch { label.textContent = "Seleccioná y copiá"; }
    btn.classList.add("is-done");
    setTimeout(() => { label.textContent = "Copiar"; btn.classList.remove("is-done"); }, 1800);
  });
});

// Producto · "Información del producto": pestañas (Nutrición / Ingredientes / Envase / Consumo) y acceso al asistente.
document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".pi-tab"));
  if (tabs.length) {
    const select = (k, focus) => {
      tabs.forEach((t) => {
        const on = t.dataset.k === k;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      document.querySelectorAll(".pi-panel").forEach((p) => {
        const on = p.id === `pi-${k}`;
        p.hidden = !on;
        p.classList.toggle("is-active", on);
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t.dataset.k));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); select(tabs[(i + 1) % tabs.length].dataset.k, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length].dataset.k, true); }
      });
    });
  }
  document.querySelectorAll("[data-open-assistant]").forEach((b) => b.addEventListener("click", () => window.upskyAssistant && window.upskyAssistant.open()));
});

// Eventos: banner del próximo evento (con cuenta regresiva) y agenda "Próximas fechas" en cards, con "Agendar"
(() => {
  let tickTimer, tab = "next";
  const CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 10h16M9 3v4M15 3v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const when = (e) => new Date(e.date + "T" + e.time + ":00");
  const stamp = (e, mins) => { const [h, m] = e.time.split(":").map(Number); const t = h * 60 + m + mins; return e.date.replace(/-/g, "") + "T" + pad(Math.floor(t / 60) % 24) + pad(t % 60) + "00"; };
  const gcal = (e) => "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(e.title + " · UP SKY") + "&dates=" + stamp(e, 0) + "/" + stamp(e, 120) + "&location=" + encodeURIComponent(e.place) + "&details=" + encodeURIComponent("Evento de UP SKY Energy Drink. Más info: " + new URL(e.url, location.href).href);
  const ics = (e) => "data:text/calendar;charset=utf-8," + encodeURIComponent(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UP SKY//Eventos//ES", "BEGIN:VEVENT", "UID:" + e.url + "@upsky", "DTSTAMP:" + stamp(e, 0), "DTSTART:" + stamp(e, 0), "DTEND:" + stamp(e, 120), "SUMMARY:" + e.title + " · UP SKY", "LOCATION:" + e.place, "END:VEVENT", "END:VCALENDAR"].join("\r\n"));
  const fname = (e) => e.url.replace(/[#?].*$/, "").replace(".html", "") + ".ics";
  const longDate = (e) => when(e).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const shortDate = (e) => { const [y, m, d] = e.date.split("-").map(Number); return `${d} ${MESES[m - 1]} ${y} · ${e.time} h`; };

  const read = () => Array.from(document.querySelectorAll(".evc[data-date]")).map((a) => ({
    date: a.dataset.date, time: a.dataset.time || "10:00",
    title: a.querySelector("h3").textContent.trim(),
    place: (a.querySelector(".evc-place")?.textContent || "").trim(),
    cat: (a.querySelector(".evc-tag")?.textContent || "").trim(),
    img: a.querySelector(".evc-media img")?.getAttribute("src") || "assets/logo.png",
    url: a.querySelector("h3 a").getAttribute("href"),
  })).sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));

  const splitGrid = () => {
    const grid = document.getElementById("evGrid");
    if (!grid) return;
    const now = new Date();
    const cards = Array.from(grid.querySelectorAll(".evc"));
    const key = (c) => (c.dataset.date ? c.dataset.date + (c.dataset.time || "") : "9999");
    const upcoming = cards.filter((c) => !c.dataset.date || when({ date: c.dataset.date, time: c.dataset.time || "10:00" }) >= now);
    upcoming.sort((a, b) => key(a).localeCompare(key(b)));
    upcoming.forEach((c) => grid.appendChild(c));
    cards.forEach((c) => { c.hidden = !upcoming.slice(0, 3).includes(c); });
    const empty = document.getElementById("evEmpty");
    if (empty) { empty.hidden = upcoming.length > 0; empty.textContent = "No hay eventos próximos por ahora."; }
  };

  const renderList = () => {
    const list = document.getElementById("aglList"), empty = document.getElementById("aglEmpty");
    if (!list) return;
    const now = new Date();
    const shown = read().filter((e) => when(e) >= now).slice(3); // los 3 primeros van arriba; el resto, acá
    list.innerHTML = shown.map((e, i) => {
      const state = "Próximamente";
      const add = `<details class="agm"><summary class="btn btn-outline">Agendar</summary><div class="agm-pop"><a href="${gcal(e)}" target="_blank" rel="noopener">Google Calendar</a><a href="${ics(e)}" download="${fname(e)}">Apple / Outlook (.ics)</a></div></details>`;
      const noImg = e.img.endsWith("logo.png");
      return `<article class="agc"><a href="${esc(e.url)}" class="agc-media" aria-label="Ver ${esc(e.title)}"><img src="${esc(e.img)}" alt="" loading="lazy" decoding="async"${noImg ? ' style="object-fit:contain;padding:22%"' : ""}></a>
        <div class="agc-body"><h3><a href="${esc(e.url)}">${esc(e.title)}</a></h3><p class="agc-when">${CAL}<span>${esc(shortDate(e))}</span></p><p class="agc-cat"><b>${esc(e.cat || "Evento")}</b>${e.place ? `<span> · ${esc(e.place)}</span>` : ""}</p></div>
        <div class="agc-foot">${CLOCK}<span>${state}</span>${add}</div></article>`;
    }).join("");
    if (empty) { empty.hidden = shown.length > 0; empty.textContent = "No hay más fechas por ahora."; }
  };

  const run = () => {
    const nxt = document.getElementById("nxt");
    if (!document.getElementById("aglList") || !nxt) return;
    clearInterval(tickTimer);
    splitGrid();
    renderList();
    // Banner del próximo evento
    const upcoming = read().filter((e) => when(e) >= new Date());
    if (!upcoming.length) { nxt.hidden = true; return; }
    const n = upcoming[0];
    nxt.hidden = false;
    nxt.innerHTML = `<div class="nxt-main"><p class="cal-k">Próximo evento</p><h2>${esc(n.title)}</h2><p class="nxt-meta">${esc(longDate(n))} · ${n.time} h · ${esc(n.place)}</p><div class="nxt-acts"><a class="btn btn-primary" href="${gcal(n)}" target="_blank" rel="noopener">Agendar en Google Calendar</a><a class="btn btn-outline" href="${ics(n)}" download="${fname(n)}">Descargar .ics</a><a class="btn btn-outline" href="${esc(n.url)}">Ver evento</a></div></div><div class="nxt-count" id="nxtCount" aria-label="Cuenta regresiva"></div>`;
    const count = document.getElementById("nxtCount");
    const tick = () => {
      const s = Math.max(0, Math.floor((when(n) - new Date()) / 60000));
      const d = Math.floor(s / 1440), h = Math.floor((s % 1440) / 60), m = s % 60;
      count.innerHTML = [[d, "días"], [h, "horas"], [m, "min"]].map(([v, l]) => `<div><b>${pad(v)}</b><span>${l}</span></div>`).join("");
    };
    tick(); tickTimer = setInterval(tick, 30000);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.querySelector(".agl-head .evl-tabs");
    if (bar) bar.addEventListener("click", (ev) => {
      const t = ev.target.closest(".evt");
      if (!t) return;
      tab = t.dataset.t;
      bar.querySelectorAll(".evt").forEach((x) => { const on = x === t; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      renderList();
    });
    run();
  });
  document.addEventListener("upsky:events-updated", run);
  document.addEventListener("click", (ev) => document.querySelectorAll(".agm[open]").forEach((d) => { if (!d.contains(ev.target)) d.open = false; }));
})();
