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
  const slug = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  const shareUrl = (p) => "/p/" + slug(p.nombre) + "-" + p.id;
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

  /* ---------- Promociones ---------- */
  // La base ya devuelve solo las promociones vigentes (fecha de inicio y de fin). Acá solo se aplican.
  let PROMOS = [];
  const promoFor = (p) => {
    const ok = PROMOS.filter((pr) => Number(pr.descuento) >= 1 && Number(pr.descuento) <= 90 && (!pr.producto || pr.producto === p.id));
    return ok.sort((a, b) => Number(b.descuento) - Number(a.descuento))[0] || null;
  };
  const promoPrice = (p) => {
    const pr = promoFor(p), base = Number(p.precio);
    return { pr, base, fin: pr ? Math.round(base * (1 - Number(pr.descuento) / 100)) : base };
  };
  const priceHtml = ({ pr, base, fin }) => (pr ? `<s class="promo-old">${money(base)}</s> ${money(fin)}` : money(base));

  function promoBanner(promos) {
    const pr = promos.slice().sort((a, b) => Number(b.descuento) - Number(a.descuento))[0];
    const host = $(".section-shop .page-banner") || $(".hw-wrap");
    if (!pr || !host || $(".promo-strip")) return;
    const hasta = pr.ocultar_desde && !isNaN(Date.parse(pr.ocultar_desde)) ? new Date(pr.ocultar_desde).toLocaleDateString("es-AR", { day: "numeric", month: "long" }) : "";
    const el = document.createElement("aside");
    el.className = "promo-strip";
    el.setAttribute("role", "note");
    el.innerHTML = `${pr.imagen_1 ? `<img class="promo-strip-img" src="${esc(pr.imagen_1)}" alt="" width="56" height="56" loading="lazy">` : ""}<div class="promo-strip-copy"><span class="promo-strip-tag">Promo</span><b>${esc(pr.nombre)}</b>${pr.texto ? `<span>${esc(pr.texto)}</span>` : ""}${hasta ? `<small>Hasta el ${esc(hasta)}</small>` : ""}</div><span class="promo-strip-off">-${Number(pr.descuento)}%</span>`;
    host.classList.contains("page-banner") ? host.after(el) : host.before(el);
  }

  /* ---------- Catálogo / destacados del inicio ---------- */
  const UNIT = { Pack: "packs", Vaso: "vasos", Remera: "remeras" };
  const SEL = { Pack: '[data-id="pack1"]', Vaso: "#vaso1, [data-base-id=vaso]", Remera: '[data-id="remera1"]' };

  function applyProduct(card, p, home) {
    if (p.id) { card.dataset.shareUrl = shareUrl(p); card.dataset.shareTitle = p.nombre; }
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
    const pp = promoPrice(p);
    if (p.precio) { card.dataset.price = pp.fin; const v = $(".price-value", card); if (v) v.innerHTML = priceHtml(pp); }
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
    let badge = $(".product-badge", card);
    if (!badge && pp.pr) { // las cards sin etiqueta no traen el espacio: se crea solo mientras dura la promo
      const media = $(".product-card-media", card);
      if (media) { media.insertAdjacentHTML("afterbegin", '<span class="product-badge" hidden></span>'); badge = $(".product-badge", media); }
    }
    if (badge) { badge.textContent = pp.pr ? `-${Number(pp.pr.descuento)}%` : (p.etiqueta || ""); badge.hidden = !(pp.pr || p.etiqueta); }
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
    // La compra rápida del catálogo usa el mismo precio, nombre y descuentos que la card del pack.
    const qb = $('.quick-buy[data-id="pack1"]'), pk = items.find((x) => x.tipo === "Pack");
    if (qb && pk) {
      const pp = promoPrice(pk), d5 = Number(pk.desc_desde_5);
      qb.dataset.name = pk.nombre + (pk.presentacion ? ` (${pk.presentacion})` : "");
      qb.dataset.price = pp.fin;
      qb.dataset.tiers = [d5 && `5:${d5}`, Number(pk.desc_desde_10) && `10:${Number(pk.desc_desde_10)}`].filter(Boolean).join(",");
      if (Number(pk.max_por_pedido)) qb.dataset.max = pk.max_por_pedido; else delete qb.dataset.max;
      const qn = $(".quick-buy-name", qb); if (qn) qn.textContent = pk.nombre;
      const qs = $(".quick-buy-sub", qb); if (qs) qs.textContent = [pk.presentacion, d5 && `${d5}% OFF desde 5 packs`].filter(Boolean).join(" · ");
      const qp = $(".quick-buy-price", qb); if (qp) qp.innerHTML = priceHtml(pp);
    }
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
    if (homeGrid) $$(".product-card:not(.more-card)", homeGrid).filter((x) => !x.hidden).slice(3).forEach((x) => { x.hidden = true; });
    // La card "+" (Ver todo el catálogo) siempre se muestra, tenga el CMS el contenido que tenga.
    $$(".more-card").forEach((x) => { x.hidden = false; });
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
        c.dataset.shareUrl = shareUrl(p); c.dataset.shareTitle = p.nombre;
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
        <a href="${href}" class="evc-media" aria-label="Ver ${esc(e.nombre)}">${img}<span class="evc-arrow" aria-hidden="true">${ARROW}</span></a>
        <button type="button" class="share-btn evc-share" data-share data-url="${href}" data-title="${esc(e.nombre)}" aria-label="Compartir ${esc(e.nombre)}">${SHARE}</button>
        <div class="evc-meta"><span class="evc-tag">${esc(e.categoria || "Evento")}</span><span class="evc-date">${esc(dateLabel(e))}</span></div>
        <h3><a href="${href}">${esc(e.nombre)}</a></h3>
        <p class="evc-place">${PIN}${esc(e.lugar || "A confirmar")}</p></article>`;
    }).join("");
    const empty = $("#evEmpty"); if (empty) empty.hidden = sorted.length > 0;
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

  // Cards con página propia: tocar la foto o el nombre abre /p/... (sin pisar botones, selectores ni deslizamientos).
  let down = null;
  document.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY }; }, true);
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card[data-share-url], .price-card[data-share-url]");
    if (!card || e.defaultPrevented) return;
    if (e.target.closest("button, a, input, .color-picker, .qty-stepper")) return;
    if (!e.target.closest(".product-card-media, .price-name")) return;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    location.href = card.dataset.shareUrl;
  });

  /* ---------- Comunidad (videos) ---------- */
  const HEART = '<path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.7 4.5c2 0 3.5 1.1 4.3 2.6.8-1.5 2.3-2.6 4.3-2.6 3.4 0 5.2 3.3 3.7 6.7-2.5 4.7-10 9.3-10 9.3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';
  const MARK = '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';
  const okMedia = (u) => /^https:\/\/[a-z0-9-]+\.supabase\.co\//.test(String(u || "")) || /^assets\/[\w.-]+\.(mp4|webm|mov|jpe?g|png|webp)$/.test(String(u || ""));
  function community(items) {
    const track = $("#ugcTrack");
    const vids = items.filter((v) => okMedia(v.video));
    if (!track || !vids.length) return; // sin videos cargados en el CMS se deja el contenido del HTML
    const btn = (cls, label, icon) => `<button class="ugc-action ${cls}" type="button" aria-label="${label}"${cls === "ugc-comment" ? "" : ' aria-pressed="false"'}><span class="ugc-action-icon-wrap"><svg class="ugc-action-icon" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span></button>`;
    track.innerHTML = vids.map((v) => {
      const poster = okMedia(v.portada) ? esc(v.portada) : "";
      return `<article class="ugc-card kb-zoom"${poster ? ` style="background-image:url('${poster}')"` : ""}>
        <video class="ugc-card-media" data-autoplay muted loop playsinline preload="none"${poster ? ` poster="${poster}"` : ""} aria-label="${esc(v.titulo || "Video de la comunidad UP SKY")}"><source src="${esc(v.video)}"></video>
        <div class="ugc-card-overlay"><span class="ugc-handle">${esc(v.usuario || "@upskyenergydrink")}</span><div class="ugc-actions">${btn("ugc-like", "Me gusta", HEART)}${btn("ugc-save", "Guardar", MARK)}</div></div></article>`;
    }).join("");
    track.dispatchEvent(new Event("ugc:refresh"));
  }

  /* ---------- Fotos y videos fijos del sitio ---------- */
  function slots(items) {
    const by = {};
    items.forEach((x) => { if (x.slot) by[x.slot] = x; });
    const setImg = (sel, url, all) => {
      if (!okMedia(url)) return;
      (all ? $$(sel) : [$(sel)]).forEach((im) => { if (im && im.getAttribute("src") !== url) im.src = url; });
    };
    if (by.inicio_hero) setImg("img.hero-photo", by.inicio_hero.imagen_1, true);
    if (by.negocios_hero) setImg(".page-banner-img", by.negocios_hero.imagen_1);
    if (by.producto_ingredientes) setImg(".fm-photo img", by.producto_ingredientes.imagen_1);
    [1, 2, 3].forEach((n) => {
      if (by["producto_momento_" + n]) setImg(`.pp-moment-card:nth-of-type(${n}) img`, by["producto_momento_" + n].imagen_1);
    });
    const pv = by.producto_video;
    if (pv) {
      setImg(".pp-hero-media-mobile", pv.imagen_1);
      const v = $(".pp-hero-media-desktop"), src = v && $("source", v);
      if (v && src && okMedia(pv.video) && src.getAttribute("src") !== pv.video) {
        if (okMedia(pv.portada)) v.poster = pv.portada;
        src.src = pv.video;
        v.load();
        v.play().catch(() => {});
      }
    }
  }

  load().then((db) => {
    if (!db.__seeded) return; // base sin cargar: se deja el contenido del HTML
    PROMOS = db.promos || [];
    products(db.productos || []);
    promoBanner(PROMOS);
    wholesale(db.mayorista || [], db.pasos_negocios || []);
    events(db.eventos || []);
    eventDetail(db.eventos || []);
    community(db.comunidad || []);
    slots(db.sitio || []);
  }).catch(() => { /* sin conexión: queda el contenido del HTML */ });
})();
