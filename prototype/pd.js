// Página de producto: cambia la foto grande al tocar una miniatura.
document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("pdMain");
  const thumbs = document.querySelectorAll(".pd-thumb");
  if (!main || !thumbs.length) return;
  thumbs.forEach((t) => t.addEventListener("click", () => {
    main.src = t.dataset.src;
    thumbs.forEach((x) => x.classList.toggle("is-on", x === t));
  }));
});
