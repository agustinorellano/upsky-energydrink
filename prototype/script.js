// Interacciones mínimas del prototipo — nada de lógica de negocio real.

document.addEventListener("DOMContentLoaded", () => {
  // Menú mobile
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle?.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
  });

  // Cierra el menú mobile al tocar un link
  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("is-open"));
  });

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
  const WHATSAPP_NUMBER = "5493456255854";
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

    document.querySelectorAll(".btn-add").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        if (!cart[id]) cart[id] = { name, price, qty: 0 };
        cart[id].qty += 1;
        persistAndRender();
      });
    });

    checkoutBtn.addEventListener("click", () => {
      const ids = Object.keys(cart);
      if (ids.length === 0) return;

      const lines = ids.map((id) => `- ${cart[id].name} x${cart[id].qty}`);
      const total = ids.reduce((sum, id) => sum + cart[id].qty * cart[id].price, 0);
      const message =
        "Hola! Quiero hacer este pedido:\n" +
        lines.join("\n") +
        `\nTotal: ${formatPrice(total)}`;

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    });

    renderCart();
  }
});
