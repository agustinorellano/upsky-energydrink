// Página de producto: miniaturas de fotos y selector de color (el color elegido es el que se compra).
document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("pdMain");
  const buy = document.querySelector(".pd-buy");
  const thumbs = document.querySelectorAll(".pd-thumb");
  thumbs.forEach((t) => t.addEventListener("click", () => {
    if (main) main.src = t.dataset.src;
    thumbs.forEach((x) => x.classList.toggle("is-on", x === t));
  }));
  const opts = Array.from(document.querySelectorAll(".pd-colors .color-opt"));
  if (!opts.length || !buy) return;
  const baseName = (buy.dataset.name || "").replace(/\s*\([^)]*\)\s*$/, "");
  const select = (opt) => {
    opts.forEach((o) => { const on = o === opt; o.classList.toggle("is-selected", on); o.setAttribute("aria-checked", String(on)); });
    buy.dataset.id = "vaso-" + opt.dataset.color;
    buy.dataset.name = baseName + " (" + opt.dataset.label + ")";
    if (main && opt.dataset.img) main.src = opt.dataset.img;
  };
  opts.forEach((o) => o.addEventListener("click", () => select(o)));
});
