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

  // Aparición sutil al hacer scroll (sección "¿Qué es UP SKY?")
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
});
