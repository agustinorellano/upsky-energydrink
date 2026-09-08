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
});
