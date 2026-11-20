// UP SKY · estadísticas simples y privadas (se ven en el panel, sección "Estadísticas").
// Registra solo: visita a una página, clic en WhatsApp y "agregar al carrito".
// NO guarda nombres, IP, cookies ni datos personales: apenas la página, el tipo de
// dispositivo y un identificador aleatorio que vive en la pestaña (sessionStorage).
// Si falla o está bloqueado, el sitio funciona igual.
(() => {
  const CFG = {
    url: "https://stwyjbxmkwgwjwmctpki.supabase.co",
    key: "sb_publishable_CiDNlwCOX3-z2I59TQg8BA_zJTqZj8P", // pública: solo permite AGREGAR eventos
  };
  // No contamos pruebas locales ni a quien pidió no ser rastreado.
  if (location.protocol === "file:" || /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  const rand = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  let sid;
  try {
    sid = sessionStorage.getItem("upsky-sid");
    if (!sid) { sid = rand(); sessionStorage.setItem("upsky-sid", sid); }
  } catch { sid = rand(); }

  const device = matchMedia("(max-width: 820px)").matches ? "mobile" : "desktop";
  const file = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
  const page = file === "index" ? "inicio" : file;
  const clip = (s, n) => String(s || "").replace(/\s+/g, " ").trim().slice(0, n);

  function send(type, target) {
    try {
      fetch(`${CFG.url}/rest/v1/analytics_events`, {
        method: "POST",
        keepalive: true,
        headers: { apikey: CFG.key, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ type, page, target: target ? clip(target, 120) : null, session: sid, device }),
      }).catch(() => {});
    } catch { /* sin conexión: no pasa nada */ }
  }

  send("view");

  document.addEventListener("click", (e) => {
    const wa = e.target.closest('a[href*="wa.me"], #checkoutBtn');
    if (wa) return send("whatsapp", wa.id === "checkoutBtn" ? "pedido del carrito" : wa.textContent);
    const add = e.target.closest(".btn-add");
    if (add) {
      const card = add.closest("[data-name]");
      send("cart", card ? card.dataset.name : "producto");
    }
  }, { passive: true });
})();
