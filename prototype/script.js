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
});
