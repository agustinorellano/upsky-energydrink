// UP SKY · contenido desde el CMS (Supabase).
// Mejora progresiva: el HTML ya trae los datos actuales; si el CMS responde, se actualizan.
// Si falla la conexión, la página queda tal cual está (nunca queda vacía por un error).
// La clave "publishable" es pública por diseño: solo permite LEER lo marcado como visible.
(() => {
  const CFG = {
    url: "https://stwyjbxmkwgwjwmctpki.supabase.co",
    key: "sb_publishable_CiDNlwCOX3-z2I59TQg8BA_zJTqZj8P",
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + Number(n).toLocaleString("es-AR");
  const list = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  async function load() {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch(`${CFG.url}/rest/v1/items?select=id,section,data,position&active=eq.true&order=position.asc,created_at.asc`, { headers: { apikey: CFG.key }, signal: ctl.signal });
      if (!r.ok) throw new Error(r.status);
      const rows = await r.json();
      const by = {};
      rows.forEach((x) => (by[x.section] = by[x.section] || []).push({ id: x.id, ...x.data }));
      by.__seeded = rows.length > 0;
      return by;
    } finally { clearTimeout(t); }
  }

  /* ---------- Catálogo / destacados del inicio ---------- */
  const UNIT = { Pack: "packs", Vaso: "vasos", Remera: "remeras" };
  const SEL = { Pack: '[data-id="pack1"]', Vaso: "#vaso1, [data-base-id=vaso]", Remera: '[data-id="remera1"]' };

  function applyProduct(card, p, home) {
    const unit = UNIT[p.tipo] || "unidades";
    const nameEl = $(".price-name", card);
    if (nameEl) {
      nameEl.firstChild.textContent = p.nombre || "";
      const sp = $("span", nameEl);
      if (sp) sp.textContent = p.presentacion || "";
    }
    if (card.dataset.baseName !== undefined) {
      const m = (card.dataset.name || "").match(/\(([^)]+)\)$/);
      card.dataset.baseName = p.nombre;
      card.dataset.name = p.nombre + (m ? ` (${m[1]})` : "");
    } else {
      card.dataset.name = p.nombre + (p.presentacion && p.tipo === "Pack" ? ` (${p.presentacion})` : "");
    }
    if (p.precio) { card.dataset.price = p.precio; const v = $(".price-value", card); if (v) v.textContent = money(p.precio); }
    const tiers = [];
    if (Number(p.desc_desde_5)) tiers.push(`5:${Number(p.desc_desde_5)}`);
    if (Number(p.desc_desde_10)) tiers.push(`10:${Number(p.desc_desde_10)}`);
    card.dataset.tiers = tiers.join(",");
    if (Number(p.max_por_pedido)) card.dataset.max = p.max_por_pedido; else delete card.dataset.max;
    const ul = $(".price-tiers", card);
    if (ul) {
      const li = [];
      if (Number(p.desc_desde_5)) li.push(`<li><b>${Number(p.desc_desde_5)}% OFF</b> desde 5 ${unit}</li>`);
      if (Number(p.desc_desde_10)) li.push(`<li><b>${Number(p.desc_desde_10)}% OFF</b> desde 10 ${unit}</li>`);
      if (Number(p.max_por_pedido)) li.push(`<li>Máximo ${Number(p.max_por_pedido)} por pedido</li>`);
      ul.innerHTML = li.join("");
    }
    const badge = $(".product-badge", card);
    if (badge) { badge.textContent = p.etiqueta || ""; badge.hidden = !p.etiqueta; }
    if (p.imagen_1 && !$(".media-slider", card)) { const im = $(".product-card-media img", card); if (im) im.src = p.imagen_1; }
    if (p.descripcion && !$(".price-desc", card)) { /* la descripción se usa solo en productos nuevos */ }
  }

  function newProductCard(p, tpl) {
    const c = tpl.cloneNode(true);
    c.removeAttribute("id");
    c.classList.add("is-visible");
    c.dataset.id = "prod-" + String(p.id).slice(0, 8);
    $$(".media-slider, .color-picker", c).forEach((x) => x.remove());
    const media = $(".product-card-media", c);
    if (media && !$("img", media)) media.insertAdjacentHTML("beforeend", '<img class="placeholder-product-thumb" alt="" loading="lazy">');
    const img = media && $("img", media);
    if (img) {
      img.src = p.imagen_1 || "assets/logo.png"; img.alt = p.nombre || "";
      if (!p.imagen_1) img.setAttribute("style", "object-fit:contain;padding:20%;background:#0a0a0c");
    }
    applyProduct(c, p, false);
    return c;
  }

  function products(items) {
    if (!items.length) return;
    const used = new Set();
    const catGrid = $(".product-grid--3");
    const homeGrid = $(".home-widgets");
    // 1) Actualiza las cards existentes por tipo (Pack / Vaso / Remera)
    ["Pack", "Vaso", "Remera"].forEach((tipo) => {
      const p = items.find((x) => x.tipo === tipo && !used.has(x.id));
      const cards = $$(SEL[tipo]).filter((c) => c.matches(".product-card"));
      if (p) {
        used.add(p.id);
        cards.forEach((c) => {
          applyProduct(c, p, !!c.closest(".home-widgets"));
          if (c.closest(".home-widgets")) c.hidden = p.destacado !== "SI";
        });
      } else {
        cards.forEach((c) => { c.hidden = true; });
      }
    });
    // 2) Productos nuevos: se agregan al catálogo (y al inicio si son destacados)
    const tpl = $('.product-card[data-id="pack1"]', catGrid || document);
    items.filter((x) => !used.has(x.id)).forEach((p) => {
      if (catGrid && tpl) catGrid.appendChild(newProductCard(p, tpl));
      if (homeGrid && p.destacado === "SI") {
        const hp = $('.product-card[data-id="pack1"]', homeGrid);
        const more = $(".more-card", homeGrid);
        if (hp) homeGrid.insertBefore(newProductCard(p, hp), more || null);
      }
    });
    // En el inicio entran 3 productos destacados: el resto queda solo en el catálogo.
    if (homeGrid) $$(".product-card", homeGrid).filter((x) => !x.hidden).slice(3).forEach((x) => { x.hidden = true; });
  }

  /* ---------- Para negocios ---------- */
  function wholesale(items, steps) {
    const grid = $(".price-grid");
    if (grid && items.length) {
      const cards = $$(".price-card", grid);
      const tpl = cards[0];
      items.forEach((p, i) => {
        let c = cards[i];
        if (!c) {
          c = tpl.cloneNode(true);
          c.dataset.id = "mayor-" + String(p.id).slice(0, 8);
          grid.appendChild(c);
        }
        const nm = $(".price-name", c);
        nm.firstChild.textContent = p.nombre || "";
        $("span", nm).textContent = p.presentacion || "";
        c.dataset.name = `${p.nombre} (${p.presentacion || ""})`.replace(" ()", "");
        c.dataset.price = p.precio;
        $(".price-value", c).textContent = money(p.precio);
        const ul = $(".price-tiers", c);
        if (p.nota) { if (ul) ul.innerHTML = `<li>${esc(p.nota)}</li>`; }
        if (p.imagen_1) {
          const media = $(".product-card-media", c);
          if (media) media.innerHTML = `<img src="${esc(p.imagen_1)}" alt="${esc(p.nombre)}" class="placeholder-product-thumb" loading="lazy">`;
        }
      });
      cards.slice(items.length).forEach((c) => c.remove());
      grid.classList.toggle("price-grid--2", items.length <= 2);
    }
    const ol = $(".bx-how-steps");
    if (ol && steps.length) {
      ol.innerHTML = steps.map((s, i) => `<li><span class="bx-how-n">${String(i + 1).padStart(2, "0")}</span><b>${esc(s.titulo)}</b><p>${esc(s.texto || "")}</p></li>`).join("");
    }
  }

  /* ---------- Eventos ---------- */
  const dateLabel = (e) => {
    if (!e.fecha) return "Fecha a confirmar";
    const [y, m, d] = e.fecha.split("-").map(Number);
    return `${d} ${MESES[m - 1]} ${y}${e.hora ? " · " + e.hora + " h" : ""}`;
  };
  const SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="19" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  const CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 10h16M9 3v4M15 3v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function events(items) {
    const grid = $("#evGrid");
    if (!grid) return;
    const sorted = items.slice().sort((a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999"));
    grid.innerHTML = sorted.map((e, i) => {
      const href = `evento.html#${encodeURIComponent(e.id)}`;
      const img = e.imagen_1 ? `<img src="${esc(e.imagen_1)}" alt="" loading="lazy" decoding="async">` : `<img src="assets/logo.png" alt="" style="object-fit:contain;padding:22%;background:radial-gradient(60% 60% at 50% 50%,rgba(236,31,122,.35),#0a0a0c)">`;
      return `<article class="evc qs-reveal is-visible" ${e.fecha ? `data-date="${esc(e.fecha)}" data-time="${esc(e.hora || "10:00")}"` : ""} style="--d:${i * 70}ms">
        <a href="${href}" class="evc-media" aria-label="Ver ${esc(e.nombre)}">${img}</a>
        <button type="button" class="share-btn evc-share" data-share data-url="${href}" data-title="${esc(e.nombre)}" aria-label="Compartir ${esc(e.nombre)}">${SHARE}</button>
        <div class="evc-body">
          <h3><a href="${href}">${esc(e.nombre)}</a></h3>
          <p class="evc-when">${CAL}<span>${esc(dateLabel(e))}</span></p>
          <p class="evc-cat"><b>${esc(e.categoria || "Evento")}</b><span class="evc-place">${esc(e.lugar || "A confirmar")}</span></p>
        </div>
        <div class="evc-foot">${CLOCK}<span class="evc-state">Próximo evento</span></div></article>`;
    }).join("");
    document.dispatchEvent(new CustomEvent("upsky:events-updated"));
  }

  function eventDetail(items) {
    const root = $("#evento");
    if (!root) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const e = items.find((x) => x.id === id);
    const copy = $(".evp-copy", root);
    if (!e) {
      if (copy) copy.innerHTML = '<a href="eventos.html#agenda" class="evp-back">← Todos los eventos</a><h1 class="evp-title">Evento no disponible</h1><p class="evp-desc">Este evento ya no está publicado. Mirá los próximos en la agenda.</p>';
      return;
    }
    document.title = `${e.nombre} · UP SKY Energy Drink`;
    $(".ev-kicker", root).textContent = e.categoria || "Evento";
    $(".evp-title", root).textContent = e.nombre;
    $(".evp-meta", root).innerHTML = `<span>${esc(dateLabel(e))}</span><span>${esc(e.lugar || "A confirmar")}</span>`;
    $(".evp-desc", root).textContent = e.descripcion || "";
    $(".ev-tags", root).innerHTML = list(e.etiquetas).map((t) => `<span class="ev-tag">${esc(t)}</span>`).join("");
    const sh = $(".evp-share", root);
    if (sh) { sh.dataset.url = `evento.html#${encodeURIComponent(e.id)}`; sh.dataset.title = e.nombre; }
    const wa = $('a[href^="https://wa.me"]', root);
    if (wa) wa.href = `https://wa.me/5491160579579?text=${encodeURIComponent(`Hola! Quiero saber más del evento "${e.nombre}" de UP SKY.`)}`;
    const cover = $(".evp-frame", root);
    if (cover && e.imagen_1) cover.innerHTML = `<img src="${esc(e.imagen_1)}" alt="${esc(e.nombre)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;
  }

  load().then((db) => {
    if (!db.__seeded) return; // base sin cargar: se deja el contenido del HTML
    products(db.productos || []);
    wholesale(db.mayorista || [], db.pasos_negocios || []);
    events(db.eventos || []);
    eventDetail(db.eventos || []);
  }).catch(() => { /* sin conexión: queda el contenido del HTML */ });
})();
