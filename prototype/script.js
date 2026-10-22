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
      const navRect = mainNav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const x = elRect.left - navRect.left - padX;
      navBlob.style.width = `${elRect.width + padX * 2}px`;
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
    const currentPath = normalizePath(window.location.pathname);
    const pageLink = navLinkEls.find((a) => {
      const href = a.getAttribute("href") || "";
      return !href.startsWith("#") && normalizePath(href) === currentPath;
    });
    if (pageLink) setActiveNavLink(pageLink);

    // Home: scroll-spy para Producto / Contacto
    const scrollTargets = [
      { id: "producto", selector: 'a[href="#producto"]' },
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
  }

  // Producto: secuencia de 3 tomas (crossfade + Ken Burns + rasgos progresivos)
  const qsSeq = document.getElementById("qsSeq");
  if (qsSeq) {
    const photos = Array.from(qsSeq.querySelectorAll(".qs-seq-photo"));
    const panels = Array.from(qsSeq.querySelectorAll(".qs-seq-panel"));
    const steps = Array.from(qsSeq.querySelectorAll(".qs-seq-step"));
    const prevBtn = qsSeq.querySelector(".qs-seq-arrow--prev");
    const nextBtn = qsSeq.querySelector(".qs-seq-arrow--next");
    const pauseBtn = qsSeq.querySelector(".qs-seq-pause");
    const liveEl = qsSeq.querySelector(".qs-seq-live");
    const ctaBtns = Array.from(qsSeq.querySelectorAll("[data-qs-seq-next]"));
    const DURATION = 7000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tomaNames = ["Presentación", "Fórmula", "Perspectiva"];
    let index = 0;
    let paused = false;
    let hoverPaused = false;
    let startTime = performance.now();
    let elapsed = 0;

    function setActive(i) {
      index = (i + photos.length) % photos.length;
      qsSeq.setAttribute("data-active", String(index));
      photos.forEach((p, idx) => p.classList.toggle("is-active", idx === index));
      panels.forEach((p, idx) => p.classList.toggle("is-active", idx === index));
      steps.forEach((s, idx) => {
        s.classList.toggle("is-active", idx === index);
        s.classList.toggle("is-done", idx < index);
        s.setAttribute("aria-selected", idx === index ? "true" : "false");
        const fill = s.querySelector(".qs-seq-step-fill");
        if (fill && idx === index) fill.style.transform = "scaleX(0)";
      });
      elapsed = 0;
      startTime = performance.now();
      if (liveEl) liveEl.textContent = `Toma ${String(index + 1).padStart(2, "0")}, ${tomaNames[index]}`;
    }

    function next() { setActive(index + 1); }
    function prev() { setActive(index - 1); }

    function tick(now) {
      if (!paused && !hoverPaused && !reduceMotion) {
        elapsed = now - startTime;
        const pct = Math.min(100, (elapsed / DURATION) * 100);
        const activeFill = steps[index] && steps[index].querySelector(".qs-seq-step-fill");
        if (activeFill) activeFill.style.transform = `scaleX(${pct / 100})`;
        if (elapsed >= DURATION) next();
      } else {
        startTime = now - elapsed;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    nextBtn && nextBtn.addEventListener("click", next);
    prevBtn && prevBtn.addEventListener("click", prev);
    steps.forEach((s, idx) => s.addEventListener("click", () => setActive(idx)));
    ctaBtns.forEach((btn) => btn.addEventListener("click", next));

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        paused = !paused;
        pauseBtn.classList.toggle("is-paused", paused);
        pauseBtn.setAttribute("aria-label", paused ? "Reanudar secuencia" : "Pausar secuencia");
      });
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      qsSeq.addEventListener("mouseenter", () => { hoverPaused = true; });
      qsSeq.addEventListener("mouseleave", () => { hoverPaused = false; });
    }

    qsSeq.setAttribute("tabindex", "-1");
    qsSeq.addEventListener("keydown", (event) => {
      if (event.target.matches("input, textarea")) return;
      if (event.key === "ArrowRight") next();
      else if (event.key === "ArrowLeft") prev();
    });

    let touchStartX = null;
    qsSeq.addEventListener("touchstart", (event) => {
      touchStartX = event.target.closest("button, a") ? null : event.touches[0].clientX;
    }, { passive: true });
    qsSeq.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const dx = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 48) (dx < 0 ? next() : prev());
      touchStartX = null;
    }, { passive: true });

    setActive(0);
  }

  // Lifestyle: interacciones simuladas en las cards UGC (like + compartir)
  document.querySelectorAll(".ugc-like, .ugc-save").forEach((btn) => {
    const countEl = btn.querySelector(".ugc-action-count");
    const base = parseInt(btn.dataset.base || "0", 10);
    const activeClass = btn.classList.contains("ugc-like") ? "is-liked" : "is-saved";
    btn.addEventListener("click", () => {
      const active = btn.classList.toggle(activeClass);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      if (countEl) countEl.textContent = String(base + (active ? 1 : 0));
    });
  });

  document.querySelectorAll(".ugc-comment").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.remove("is-tapped");
      void btn.offsetWidth;
      btn.classList.add("is-tapped");
    });
  });

  // Lifestyle: carrusel curvo de videos UGC (arco tipo cilindro, drag + momentum + auto-scroll)
  const ugcCarousel = document.getElementById("ugcCarousel");
  const ugcTrack = document.getElementById("ugcTrack");
  if (ugcCarousel && ugcTrack) {
    const cards = Array.from(ugcTrack.children);
    const N = cards.length;
    const reduceMotionUgc = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO_SPEED = 26; // px/s, auto-scroll hacia la izquierda
    const CARD_W = 150;
    const CARD_H = 267;
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

    function measure() {
      containerW = ugcCarousel.clientWidth;
      pitch = Math.max(132, Math.min(190, containerW / 6.2));
    }
    measure();
    window.addEventListener("resize", measure);

    function layout() {
      const total = N * pitch;
      const half = total / 2;
      const maxD = Math.max(1, containerW / 2);
      cards.forEach((card, i) => {
        const raw = i * pitch - scrollX;
        // envuelve dentro de (-half, half] para loop infinito sin duplicar nodos
        let wrapped = ((raw % total) + total) % total;
        if (wrapped > half) wrapped -= total;
        const d = Math.min(1, Math.abs(wrapped) / maxD);
        const scale = 1 + 0.46 * d * d; // crece hacia los bordes, como el interior de un cilindro
        const x = wrapped;
        const opacity = 1 - 0.55 * Math.pow(d, 3); // se desvanece apenas cerca del borde del marco
        card.style.transform = `translate(${x}px, 0) scale(${scale})`;
        card.style.zIndex = String(1000 - Math.round(d * 100));
        card.style.opacity = String(Math.max(0.35, opacity));
      });
    }

    function tick(now) {
      if (lastFrameT === null) lastFrameT = now;
      const dt = (now - lastFrameT) / 1000;
      lastFrameT = now;
      if (!reduceMotionUgc && !dragging) {
        scrollX += AUTO_SPEED * dt;
        if (Math.abs(velocity) > 2) {
          scrollX += velocity * dt;
          velocity *= Math.pow(0.05, dt); // decae ~95%/s tras soltar
        } else {
          velocity = 0;
        }
      }
      layout();
      requestAnimationFrame(tick);
    }

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

  // Header: se oculta al bajar y reaparece al subir
  const siteHeader = document.getElementById("header");
  if (siteHeader) {
    let lastScrollY = window.scrollY;
    let headerTicking = false;

    function updateHeaderVisibility() {
      headerTicking = false;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (currentY < 80) {
        siteHeader.classList.remove("is-hidden");
      } else if (delta > 4) {
        siteHeader.classList.add("is-hidden");
      } else if (delta < -4) {
        siteHeader.classList.remove("is-hidden");
      }
      lastScrollY = currentY;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!headerTicking) {
          headerTicking = true;
          requestAnimationFrame(updateHeaderVisibility);
        }
      },
      { passive: true }
    );
  }

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

  // Formulario de contacto: en este prototipo no envía datos, solo muestra un aviso.
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.hidden = false;
  });

  // Select custom del selector "¿Qué estás buscando?"
  const customSelect = document.getElementById("intentSelect");
  if (customSelect) {
    const trigger = customSelect.querySelector(".custom-select-trigger");
    const valueLabel = customSelect.querySelector(".custom-select-value");
    const optionsList = customSelect.querySelector(".custom-select-options");
    const hiddenInput = customSelect.querySelector("input[type=hidden]");
    const options = customSelect.querySelectorAll("li[role=option]");

    const closeSelect = () => {
      customSelect.classList.remove("is-open");
      optionsList.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", () => {
      const isOpen = customSelect.classList.toggle("is-open");
      optionsList.hidden = !isOpen;
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((o) => o.setAttribute("aria-selected", "false"));
        option.setAttribute("aria-selected", "true");
        valueLabel.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        closeSelect();
      });
    });

    document.addEventListener("click", (event) => {
      if (!customSelect.contains(event.target)) closeSelect();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSelect();
    });
  }

  // ---------- Carrito ----------
  // Prototipo: sin backend ni pasarela de pago. El "checkout" arma un
  // mensaje de WhatsApp con el pedido, que es como ya opera la marca.
  const WHATSAPP_NUMBER = "5491160579579";
  const CART_STORAGE_KEY = "upsky-cart";

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
      const totalPrice = ids.reduce((sum, id) => sum + cart[id].qty * cart[id].price, 0);

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
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${formatPrice(item.price)} c/u</p>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" type="button" data-action="decrease" aria-label="Restar">−</button>
              <span>${item.qty}</span>
              <button class="cart-qty-btn" type="button" data-action="increase" aria-label="Sumar">+</button>
            </div>
          </div>
          <button class="cart-item-remove" type="button" data-action="remove">Quitar</button>
        `;
        row.querySelector('[data-action="increase"]').addEventListener("click", () => {
          cart[id].qty += 1;
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

    // Steppers de cantidad en las cards del catálogo
    document.querySelectorAll(".qty-stepper").forEach((stepper) => {
      const valueEl = stepper.querySelector(".qty-value");
      stepper.querySelectorAll(".qty-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          let qty = Number(valueEl.textContent) || 1;
          qty = btn.dataset.action === "increase" ? qty + 1 : Math.max(1, qty - 1);
          valueEl.textContent = qty;
        });
      });
    });

    document.querySelectorAll(".btn-add").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-id]");
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const qtyEl = card.querySelector(".qty-value");
        const addQty = qtyEl ? Number(qtyEl.textContent) || 1 : 1;

        if (!cart[id]) cart[id] = { name, price, qty: 0 };
        cart[id].qty += addQty;
        if (qtyEl) qtyEl.textContent = "1";
        persistAndRender();
      });
    });

    // Datos de envío: se piden siempre antes de mandar el pedido,
    // sea un pedido chico o una compra por mayor.
    const shippingForm = document.getElementById("shippingForm");

    checkoutBtn.addEventListener("click", () => {
      const ids = Object.keys(cart);
      if (ids.length === 0) return;

      if (shippingForm && !shippingForm.reportValidity()) return;

      const lines = ids.map((id) => `- ${cart[id].name} x${cart[id].qty}`);
      const total = ids.reduce((sum, id) => sum + cart[id].qty * cart[id].price, 0);

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
