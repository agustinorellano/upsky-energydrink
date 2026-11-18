(() => {
  const form = document.getElementById("arrForm"), err = document.getElementById("arrErr");
  let via = "wa";
  form.querySelectorAll("button[type=submit]").forEach((b) => b.addEventListener("click", () => { via = b.dataset.via; }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form), g = (k) => (f.get(k) || "").toString().trim();
    if (!g("nombre") || !g("email") || !g("pedido")) { err.hidden = false; return; }
    err.hidden = true;
    const lines = ["Hola! Quiero ejercer mi derecho de arrepentimiento (Botón de arrepentimiento del sitio de UP SKY).",
      "Nombre: " + g("nombre"), "Email: " + g("email"), g("tel") && "Teléfono: " + g("tel"),
      "Pedido / producto: " + g("pedido"), g("compra") && "Fecha de compra: " + g("compra"),
      g("recepcion") && "Fecha de recepción: " + g("recepcion"), g("motivo") && "Motivo: " + g("motivo")].filter(Boolean).join("\n");
    if (via === "mail") location.href = "mailto:upskyenergydrink@gmail.com?subject=" + encodeURIComponent("Botón de arrepentimiento - " + g("nombre")) + "&body=" + encodeURIComponent(lines);
    else window.open("https://wa.me/5491160579579?text=" + encodeURIComponent(lines), "_blank", "noopener");
  });
})();
