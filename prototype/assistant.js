/* Asistente UP SKY — bot de respuestas guiadas (sin IA, sin servidor).
   Todo el contenido está en DATA: para cambiar textos o precios se edita ese bloque. */
(() => {
  "use strict";

  const WA = "5493454143901";
  const money = (n) => "$" + n.toLocaleString("es-AR");

  /* ------------------------------ CONTENIDO ------------------------------ */
  const PRODUCTS = {
    pack: { id: "pack1", name: "1 pack de energizante (6 botellas 355cc)", short: "Pack de 6 botellas", sub: "355 cc c/u", price: 14500, tiers: [[5, 5]], max: 10, img: "assets/pack-energizante.webp" },
    "vaso-negro": { id: "vaso-negro", name: "1 vaso UP SKY (negro)", short: "Vaso UP SKY negro", sub: "Edición especial", price: 3200, tiers: [[5, 5], [10, 10]], group: "vaso", img: "assets/vaso-negro-foto.webp" },
    "vaso-rosa": { id: "vaso-rosa", name: "1 vaso UP SKY (rosa)", short: "Vaso UP SKY rosa", sub: "Edición especial", price: 3200, tiers: [[5, 5], [10, 10]], group: "vaso", img: "assets/vaso-rosa-foto.webp" },
    remera: { id: "remera1", name: "1 remera UP SKY", short: "Remera UP SKY", sub: "Algodón negro", price: 36500, tiers: [[5, 3], [10, 6]], img: "assets/remera-frente.webp" },
    pallet: { id: "mayorpallet", name: "1 pallet (192 packs de 6 botellas 355cc c/u)", short: "1 pallet · 192 packs", sub: "6 botellas 355cc c/u", price: 2304000, tiers: [], img: "assets/logo.png" },
    mayor30: { id: "mayor30", name: "30 packs de energizante (6 botellas 355cc c/u)", short: "30 packs por mayor", sub: "6 botellas 355cc c/u", price: 388500, tiers: [], img: "assets/pack-energizante.webp" },
  };

  const FAQ = {
    alcohol: ["¿Tiene alcohol?", "UP SKY no contiene alcohol: es una bebida analcohólica elaborada con agua, cafeína, taurina y vitaminas."],
    cafe: ["¿Qué diferencia hay con un café?", "El café aporta cafeína, que estimula rápido al sistema nervioso. UP SKY combina cafeína y taurina para regular esa respuesta rápida, y suma vitaminas que contribuyen al aporte energético, con sabor a frutilla."],
    colorante: ["¿Tiene colorante?", "No tiene agregado de colorantes artificiales."],
    presentacion: ["¿Qué presentación tiene?", "Botellas de vidrio de 355 cc. Se vende en six packs (6 botellas) o pallets, según lo que necesites."],
    sabor: ["¿Qué sabores hay?", "Un sabor original a frutilla, con esencias naturales y una textura gasificada fina."],
    vidrio: ["¿Por qué botella de vidrio?", "Porque el vidrio no deja residuos de metales ni polímeros que puedan alterar el sabor, y el envase es 100% reciclable."],
    beneficios: ["¿Qué beneficios tiene?", "Aporta un estímulo energético que ayuda al rendimiento físico y mental: aumenta el estado de alerta y la concentración y reduce la fatiga. Los azúcares dan un combustible inmediato en esfuerzos intensos."],
    origen: ["¿Es de industria nacional?", "Sí, UP SKY es <b>Industria Argentina</b>. Se presenta en botella de vidrio de 355 cc."],
    donde: ["¿Dónde puedo comprar?", "Desde el catálogo de esta web. Nosotros te direccionamos al distribuidor más cercano a tu domicilio."],
    envios: ["¿Hacen envíos?", "Sí, hacemos envíos. Distribuimos en Concordia y alrededores, y coordinamos el costo y el plazo por WhatsApp. Los precios publicados no incluyen envío."],
    ubicacion: ["¿Dónde están?", "Estamos en <b>San Luis 318, Concordia, Entre Ríos</b>."],
    contacto: ["¿Cómo los contacto?", "Por WhatsApp (el botón de abajo), por email a <b>upskyenergydrink@gmail.com</b> o por Instagram <b>@upskyenergydrink</b>."],
    arrepentimiento: ["¿Puedo arrepentirme de una compra?", "Sí. Si compraste a distancia, podés revocar la compra dentro de los <b>10 días corridos</b> de recibir el producto, sin costo. Usá el <a href=\"arrepentimiento.html\">Botón de arrepentimiento</a>."],
    conservacion: ["¿Cómo se conserva?", "Una vez abierta, se recomienda consumirla en el día y conservarla refrigerada."],
    consumo: ["¿Cuánto puedo tomar?", "No se recomienda consumirla en exceso y es un producto para <b>mayores de 18 años</b>. Si tenés una condición de salud o estás embarazada o en lactancia, consultá antes con tu médico."],
    terminos: ["Términos y condiciones", "Podés leerlos completos en <a href=\"terminos.html\">Términos y condiciones</a>."],
    quienes: ["¿Quiénes pueden consumirla?", "Jóvenes y adultos que busquen más rendimiento físico y mental: deportistas, estudiantes y trabajadores. Es un producto para mayores de 18 años y no se recomienda consumirlo en exceso."],
  };

  const T = {
    cafeina: "La cafeína es de <b>20 mg cada 100 ml</b>, o sea <b>71 mg por botella</b> de 355 ml.",
    calorias: "Cada 100 ml tiene <b>44 kcal</b> y 11 g de carbohidratos. Por botella (355 ml): <b>156 kcal</b> y 39 g de carbohidratos.",
    taurina: "La taurina es de <b>400 mg cada 100 ml</b> (1.420 mg por botella). La que usamos es sintética, apta para dietas vegetarianas.",
    vitaminas: "Tiene vitaminas B3 (3 mg cada 100 ml) y B6 (0,6 mg cada 100 ml), y ácido ascórbico (vitamina C), que además ayuda a preservar el sabor.",
    ingredientes: "Agua carbonatada, sacarosa, glucosa, taurina, conservante (benzoato de sodio), saborizante, cafeína, antioxidante (ácido ascórbico), acidulante (ácido cítrico), regulador de acidez (bicarbonato de sodio) y vitaminas B3 y B6. Es el listado del rótulo.",
    precios: "<b>Precios (sin envío)</b><br>Pack de 6 botellas: <b>$14.500</b> (5% OFF desde 5 packs, máx. 10)<br>Vaso UP SKY: <b>$3.200</b> (5% OFF desde 5, 10% OFF desde 10)<br>Remera UP SKY: <b>$36.500</b> (3% OFF desde 5, 6% OFF desde 10)",
    mayor: "<b>Por mayor</b><br>30 packs: <b>$388.500</b> (4% OFF desde 31 packs, consultá por WhatsApp)<br>1 pallet de 192 packs: <b>$2.304.000</b><br>Distribución en Concordia y alrededores. Pago por transferencia bancaria. Precios sin envío.",
    pago: "El pago es por <b>transferencia bancaria</b> únicamente. Los precios no incluyen envío y la entrega la coordinamos por WhatsApp. Distribuimos en Concordia y alrededores.",
    eventos: "Estamos armando la agenda de eventos. Las fechas y lugares se publican apenas se confirman.",
    saludo: "Hola, ¿cómo va? Contame qué necesitás.",
    gracias: "De nada. Si necesitás algo más, acá estoy.",
  };

  /* Palabras clave → nodo (se comparan sin tildes y en minúscula). */
  const KEYS = [
    ["persona", ["persona", "humano", "asesor", "vendedor", "whatsapp", "wpp", "hablar con", "contactar", "reclamo", "atencion"]],
    ["pedir", ["pedir", "pedido", "comprar", "compra", "quiero", "carrito", "agregar", "sumar"]],
    ["precios", ["precio", "precios", "cuanto", "cuesta", "vale", "costo", "descuento", "oferta"]],
    ["comercio", ["mayor", "mayorista", "comercio", "kiosco", "revender", "revendedor", "distribuidor", "pallet", "negocio", "30 packs"]],
    ["pago", ["pago", "pagar", "transferencia", "tarjeta", "medios de pago", "efectivo", "cbu", "alias", "deposito"]],
    ["envios", ["envio", "envios", "enviar", "envian", "entrega", "entregan", "delivery", "zona", "domicilio", "despacho", "llega", "llegan", "hacen envios"]],
    ["ubicacion", ["direccion", "donde estan", "donde queda", "ubicacion", "local", "sucursal", "san luis", "concordia", "entre rios"]],
    ["contacto", ["contacto", "email", "correo", "instagram", "telefono", "numero", "redes"]],
    ["arrepentimiento", ["arrepent", "devolver", "devolucion", "reembolso", "garantia", "revocar", "cambiar el producto"]],
    ["conservacion", ["conservar", "conserva", "refrigerar", "heladera", "vencimiento", "vence", "duracion", "dura", "una vez abierta", "abierta", "abierto", "fecha de vencimiento"]],
    ["consumo", ["cuanto puedo tomar", "cuantas puedo tomar", "por dia", "al dia", "dosis", "exceso", "embarazo", "embarazada", "lactancia", "amamantando", "hipertension", "medico", "presion"]],
    ["terminos", ["terminos", "condiciones", "politica", "privacidad", "datos personales", "legales"]],
    ["eventos", ["evento", "eventos", "fecha", "agenda", "degustacion", "activacion"]],
    ["cafeina", ["cafeina", "mg de cafeina", "cuanta cafeina"]],
    ["calorias", ["caloria", "calorias", "kcal", "azucar", "azucares", "carbohidrato", "light", "zero"]],
    ["taurina", ["taurina"]],
    ["vitaminas", ["vitamina", "vitaminas", "ascorbico", "vitamina c"]],
    ["ingredientes", ["ingrediente", "ingredientes", "contiene", "composicion", "formula", "rotulo", "etiqueta"]],
    ["alcohol", ["alcohol", "alcoholica"]],
    ["cafe", ["cafe", "diferencia con"]],
    ["colorante", ["colorante", "artificial", "conservante"]],
    ["presentacion", ["presentacion", "tamano", "cc", "botella de", "six pack", "pack de"]],
    ["sabor", ["sabor", "sabores", "frutilla", "gusto"]],
    ["vidrio", ["vidrio", "reciclable", "reciclar", "ambiente"]],
    ["beneficios", ["beneficio", "beneficios", "para que sirve", "efecto", "rendimiento", "energia"]],
    ["origen", ["industria", "nacional", "argentina", "argentino", "hecha en", "hecho en", "origen", "fabrica", "producido"]],
    ["donde", ["donde comprar", "donde consigo", "donde puedo", "donde venden", "puntos de venta"]],
    ["quienes", ["quien puede", "quienes pueden", "menor", "edad", "deportista", "mayores"]],
    ["saludo", ["hola", "buenas", "buen dia", "buenas tardes", "buenas noches", "que tal"]],
    ["gracias", ["gracias", "genial", "perfecto", "listo", "ok"]],
  ];

  /* ------------------------------ UTILIDADES ------------------------------ */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const onPage = (name) => location.pathname.replace(/\.html$/, "").endsWith("/" + name) || location.pathname.endsWith(name + ".html");

  const IC = {
    chat: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="10" fill="currentColor"/><path d="M11 58c0-11.6 9.4-19 21-19s21 7.4 21 19z" fill="currentColor"/><path d="M19 25v-2a13 13 0 0 1 26 0v2" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/><rect x="14.5" y="24" width="7" height="11" rx="3.5" fill="currentColor"/><rect x="42.5" y="24" width="7" height="11" rx="3.5" fill="currentColor"/><path d="M46 34c0 6-4 8-9 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="35" cy="42" r="2.6" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wa: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.31.653 4.47 1.786 6.307L4 29l7.86-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.363l-.358-.213-4.663 1.039 1.02-4.55-.234-.372A9.77 9.77 0 0 1 5.182 15c0-5.964 4.858-10.818 10.822-10.818S26.818 9.036 26.818 15 21.968 24.818 16.004 24.818Zm5.98-7.34c-.327-.164-1.938-.957-2.239-1.066-.3-.11-.518-.164-.737.163-.218.328-.845 1.066-1.036 1.285-.19.218-.382.246-.709.082-.327-.164-1.379-.508-2.627-1.62-.971-.866-1.627-1.935-1.818-2.263-.19-.328-.02-.505.144-.668.148-.147.327-.382.49-.573.164-.192.218-.328.327-.546.109-.219.055-.41-.027-.573-.082-.164-.737-1.775-1.01-2.431-.266-.64-.537-.554-.737-.564l-.628-.011c-.218 0-.573.082-.873.41-.3.327-1.145 1.12-1.145 2.73 0 1.61 1.173 3.166 1.336 3.385.164.219 2.31 3.527 5.598 4.945.782.338 1.393.54 1.869.69.785.25 1.5.215 2.065.13.63-.094 1.938-.792 2.211-1.557.273-.765.273-1.42.191-1.557-.082-.137-.3-.219-.627-.383Z" fill="currentColor"/></svg>',
  };

  /* ------------------------------ ESTADO / DOM ------------------------------ */
  const state = { open: false, unknown: 0, topic: "", busy: false, started: false, lastProduct: null };

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "ua-launcher";
  launcher.setAttribute("aria-label", "Abrir el Asistente UP SKY");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = `${IC.chat}<span class="ua-launcher-tip">Asistente</span>`;

  const panel = document.createElement("section");
  panel.className = "ua-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente UP SKY");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <header class="ua-head">
      <span class="ua-avatar">${IC.chat}<i class="ua-online" aria-hidden="true"></i></span>
      <div class="ua-head-t"><strong>Asistente UP SKY</strong><small>Respondo al instante</small></div>
      <button type="button" class="ua-x ua-reset" aria-label="Volver a empezar" title="Volver a empezar">${IC.reset}</button>
      <button type="button" class="ua-x" aria-label="Cerrar el asistente">${IC.close}</button>
    </header>
    <div class="ua-log" id="uaLog" aria-live="polite"></div>
    <div class="ua-chips" id="uaChips"></div>
    <form class="ua-form" id="uaForm" autocomplete="off">
      <input type="text" id="uaInput" placeholder="Escribí tu consulta…" aria-label="Escribí tu consulta" maxlength="160">
      <button type="submit" aria-label="Enviar">${IC.send}</button>
    </form>
    <a class="ua-human" id="uaHuman" target="_blank" rel="noopener">${IC.wa}<span>Hablar con una persona por WhatsApp</span></a>`;

  const log = panel.querySelector("#uaLog");
  const chips = panel.querySelector("#uaChips");
  const form = panel.querySelector("#uaForm");
  const input = panel.querySelector("#uaInput");
  const human = panel.querySelector("#uaHuman");

  /* ------------------------------ MENSAJES ------------------------------ */
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const addMsg = (html, who = "bot") => {
    const m = document.createElement("div");
    m.className = `ua-msg ua-msg--${who}`;
    m.innerHTML = html;
    log.appendChild(m);
    scroll();
    return m;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const say = async (html, extra) => {
    state.busy = true;
    const t = document.createElement("div");
    t.className = "ua-msg ua-msg--bot ua-typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t);
    scroll();
    await wait(420);
    t.remove();
    const m = addMsg(html);
    if (extra) extra(m);
    state.busy = false;
  };
  const setChips = (list) => {
    chips.innerHTML = "";
    chips.scrollLeft = 0;
    list.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ua-chip" + (c.primary ? " ua-chip--p" : "");
      b.textContent = c.label;
      b.addEventListener("click", () => {
        if (state.busy) return;
        addMsg(esc(c.label), "me");
        c.run();
      });
      chips.appendChild(b);
    });
  };

  /* ------------------------------ ACCIONES ------------------------------ */
  const handoffText = (extra) => {
    const cart = window.upskyCart ? window.upskyCart.summary() : null;
    let t = "Hola! Soy un cliente de la web de UP SKY.";
    if (extra) t += " " + extra;
    if (cart && cart.count) t += ` Tengo en el carrito: ${cart.lines.map((l) => `${l.name} x${l.qty}`).join(", ")} (total ${cart.totalText}).`;
    return t;
  };
  const refreshHuman = (extra) => { human.href = waLink(handoffText(extra || (state.topic ? `Tengo una consulta sobre: ${state.topic}.` : ""))); };

  const MENU = () => [
    { label: "Quiero pedir", primary: true, run: () => go("pedir") },
    { label: "Precios y descuentos", run: () => go("precios") },
    { label: "Sobre el producto", run: () => go("producto") },
    { label: "Soy comercio", run: () => go("comercio") },
    { label: "Eventos", run: () => go("eventos") },
    { label: "Hablar con una persona", run: () => go("persona") },
  ];
  const back = (extra = []) => [...extra, { label: "Volver al menú", run: () => go("menu") }];

  const priceRows = (rows) => `<div class="ua-prices">${rows.map((r) => `<div class="ua-price"><img src="${r.img}" alt="" loading="lazy"><div><b>${r.name}</b><small>${r.note}</small></div><em>${r.price}</em></div>`).join("")}</div>`;
  const tierNote = (p) => { const t = p.tiers.map(([n, d]) => `${d}% OFF desde ${n}`); return t.join(" · ") + (p.max ? (t.length ? " · " : "") + `máx. ${p.max}` : ""); };
  const PRICES = () => priceRows([
    { img: PRODUCTS.pack.img, name: "Pack de 6 botellas", note: tierNote(PRODUCTS.pack), price: money(PRODUCTS.pack.price) },
    { img: PRODUCTS["vaso-negro"].img, name: "Vaso UP SKY", note: tierNote(PRODUCTS["vaso-negro"]), price: money(PRODUCTS["vaso-negro"].price) },
    { img: PRODUCTS.remera.img, name: "Remera UP SKY", note: tierNote(PRODUCTS.remera), price: money(PRODUCTS.remera.price) },
  ]);
  const PRICES_MAYOR = () => priceRows([
    { img: PRODUCTS.pack.img, name: "30 packs de energizante", note: "4% OFF desde 31 packs · consultá por WhatsApp", price: money(PRODUCTS.mayor30.price) },
    { img: PRODUCTS.pallet.img, name: "1 pallet · 192 packs", note: "6 botellas de 355 cc c/u", price: money(PRODUCTS.pallet.price) },
  ]);

  // Precios y descuentos del CMS: si el sitio los cambió, el asistente responde lo mismo que la web.
  function applyCatalog(db) {
    if (!db) return;
    const tiers = (p) => [[5, +p.desc_desde_5], [10, +p.desc_desde_10]].filter(([, d]) => d > 0);
    const set = (keys, p) => keys.forEach((k) => { if (!PRODUCTS[k] || !p || !(+p.precio > 0)) return; PRODUCTS[k].price = +p.precio; PRODUCTS[k].tiers = tiers(p); PRODUCTS[k].max = +p.max_por_pedido || 0; });
    const prods = db.productos || [];
    set(["pack"], prods.find((x) => x.tipo === "Pack"));
    set(["vaso-negro", "vaso-rosa"], prods.find((x) => x.tipo === "Vaso"));
    set(["remera"], prods.find((x) => x.tipo === "Remera"));
    const may = db.mayorista || [];
    if (may[0] && +may[0].precio > 0) PRODUCTS.mayor30.price = +may[0].precio;
    if (may[1] && +may[1].precio > 0) PRODUCTS.pallet.price = +may[1].precio;
  }
  document.addEventListener("upsky:catalog", () => applyCatalog(window.upskyCatalog));
  if (window.upskyCatalog) applyCatalog(window.upskyCatalog);

  const linkBtn = (href, label, ext) => `<a class="ua-link" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;

  function productCards(keys) {
    return `<div class="ua-cards">${keys.map((k) => {
      const p = PRODUCTS[k];
      return `<div class="ua-card"><img src="${p.img}" alt="" loading="lazy"><div><b>${p.short}</b><span>${p.sub}</span><em>${money(p.price)}</em></div><button type="button" class="ua-add" data-k="${k}">Agregar</button></div>`;
    }).join("")}</div>`;
  }
  const bindAdd = (m) => m.querySelectorAll(".ua-add").forEach((b) => b.addEventListener("click", () => addToCart(b.dataset.k, 1, b)));

  async function addToCart(k, qty, btn) {
    const p = PRODUCTS[k];
    if (!window.upskyCart) { await say("No pude acceder al carrito en esta página. Podés sumarlo desde el catálogo."); return; }
    const r = window.upskyCart.add({ id: p.id, name: p.name, price: p.price, qty, tiers: p.tiers.map((t) => t.slice()), max: p.max || 0, group: p.group || "" });
    if (btn) { btn.textContent = "Agregado ✓"; btn.disabled = true; setTimeout(() => { btn.textContent = "Agregar"; btn.disabled = false; }, 1600); }
    state.topic = "mi pedido";
    refreshHuman("Quiero finalizar un pedido.");
    const off = r.discount ? ` Se aplica ${r.discount}% OFF.` : "";
    await say(`Listo, sumé <b>${p.short}</b> al carrito (${r.qty} en total).${off}<br>Total del carrito: <b>${r.totalText}</b>.`);
    setChips([
      { label: "Ver mi carrito", primary: true, run: () => { window.upskyCart.open(); close(); } },
      { label: "Sumar otro producto", run: () => go("pedir") },
      { label: "Ir al catálogo", run: () => { location.href = (onPage("catalogo") ? "#productos" : "catalogo.html#productos"); if (onPage("catalogo")) close(); } },
      ...back(),
    ]);
  }

  /* ------------------------------ NODOS ------------------------------ */
  const NODES = {
    menu: async () => { state.topic = ""; refreshHuman(); await say("¿Qué necesitás?"); setChips(MENU()); },
    pedir: async () => {
      state.topic = "quiero hacer un pedido"; refreshHuman("Quiero hacer un pedido.");
      await say("Te llevo al <b>catálogo</b>, donde elegís tus productos y los sumás al carrito.");
      setChips([
        { label: "Ir al catálogo", primary: true, run: () => go("pedir") },
        { label: "Agregar desde acá", run: () => go("pedirchat") },
        ...back(),
      ]);
      navigate("catalogo.html", "#productos");
    },
    pedirchat: async () => {
      await say("Elegí qué querés sumar al carrito. También podés escribirme, por ejemplo: <i>“agregar 2 packs”</i>.", (m) => { m.insertAdjacentHTML("beforeend", productCards(["pack", "vaso-negro", "vaso-rosa", "remera"])); bindAdd(m); });
      setChips([{ label: "Ir al catálogo", primary: true, run: () => go("pedir") }, ...back()]);
    },
    comercio: async () => {
      state.topic = "compra por mayor"; refreshHuman("Soy comercio y quiero comprar por mayor.");
      await say("Te llevo a <b>Para negocios</b>, donde elegís el volumen (desde 30 packs o pallets de 192) y comprás por mayor.");
      setChips([
        { label: "Ir a Para negocios", primary: true, run: () => go("comercio") },
        { label: "Ver precios por mayor", run: () => go("mayor") },
        { label: "Hablar con una persona", run: () => go("persona") },
        ...back(),
      ]);
      navigate("negocios.html", "#mayorista");
    },
    precios: async () => {
      state.topic = "precios"; refreshHuman("Quería consultar precios.");
      await say("Estos son los precios, <b>sin envío</b>:" + PRICES() + '<p class="ua-note">Pago por transferencia bancaria únicamente.</p>');
      setChips([{ label: "Quiero pedir", primary: true, run: () => go("pedir") }, { label: "Precios por mayor", run: () => go("mayor") }, ...back()]);
    },
    producto: async () => {
      state.topic = "el producto";
      await say("¿Qué querés saber del producto?");
      setChips([
        { label: "Cafeína y calorías", run: () => go("cafeina") },
        { label: "Ingredientes", run: () => go("ingredientes") },
        { label: "Vidrio y sabor", run: () => go("vidrio") },
        { label: "¿Quiénes pueden tomarla?", run: () => go("quienes") },
        { label: "Más preguntas", run: () => go("faq") },
        ...back(),
      ]);
    },
    faq: async () => {
      await say("Estas son las preguntas más comunes:");
      setChips([
        { label: "¿Tiene alcohol?", run: () => go("alcohol") },
        { label: "¿Y el colorante?", run: () => go("colorante") },
        { label: "UP SKY vs. café", run: () => go("cafe") },
        { label: "Beneficios", run: () => go("beneficios") },
        { label: "Presentación", run: () => go("presentacion") },
        { label: "¿Dónde compro?", run: () => go("donde") },
        ...back([{ label: "Volver al producto", run: () => go("producto") }]),
      ]);
    },
    mayor: async () => {
      state.topic = "precios por mayor"; refreshHuman("Soy comercio y quiero precios por mayor.");
      await say("Precios por mayor, <b>sin envío</b>:" + PRICES_MAYOR() + '<p class="ua-note">Distribución en Concordia y alrededores. Pago por transferencia bancaria.</p>', (m) => m.insertAdjacentHTML("beforeend", productCards(["mayor30"])));
      log.querySelectorAll(".ua-add").forEach((b) => { if (!b._b) { b._b = 1; b.addEventListener("click", () => addToCart(b.dataset.k, 1, b)); } });
      setChips([{ label: "Comprar por mayor", primary: true, run: () => go("comercio") }, { label: "Hablar con una persona", run: () => go("persona") }, ...back()]);
    },
    eventos: async () => {
      state.topic = "eventos"; refreshHuman("Quiero llevar UP SKY a mi evento.");
      await say(T.eventos);
      setChips([
        { label: "Ver eventos", primary: true, run: () => { location.href = "eventos.html#agenda"; } },
        { label: "Quiero UP SKY en mi evento", run: () => go("persona") },
        ...back(),
      ]);
    },
    persona: async () => {
      refreshHuman();
      await say("Con gusto te pasamos con una persona del equipo. Te abro WhatsApp con tu consulta ya escrita.", (m) => m.insertAdjacentHTML("beforeend", linkBtn(human.href, "Abrir WhatsApp", true)));
      setChips(back());
    },
    cafeina: async () => { await say(T.cafeina + "<br><br>" + T.calorias); setChips([{ label: "Ingredientes", run: () => go("ingredientes") }, ...back([{ label: "Volver al producto", run: () => go("producto") }])]); },
    calorias: () => NODES.cafeina(),
    taurina: async () => { await say(T.taurina); setChips(back([{ label: "Volver al producto", run: () => go("producto") }])); },
    vitaminas: async () => { await say(T.vitaminas); setChips(back([{ label: "Volver al producto", run: () => go("producto") }])); },
    ingredientes: async () => { await say(T.ingredientes); setChips([{ label: "Cafeína y calorías", run: () => go("cafeina") }, ...back([{ label: "Volver al producto", run: () => go("producto") }])]); },
    pago: async () => { await say(T.pago); setChips([{ label: "Quiero pedir", primary: true, run: () => go("pedir") }, { label: "Hablar con una persona", run: () => go("persona") }, ...back()]); },
    saludo: async () => { await say(T.saludo); setChips(MENU()); },
    gracias: async () => { await say(T.gracias); setChips(MENU()); },
    vidrio: async () => { await say(FAQ.vidrio[1] + "<br><br>" + FAQ.sabor[1]); setChips(back([{ label: "Volver al producto", run: () => go("producto") }])); },
  };
  Object.keys(FAQ).forEach((k) => {
    if (NODES[k]) return;
    NODES[k] = async () => {
      state.topic = FAQ[k][0].replace(/[¿?]/g, "").toLowerCase();
      await say(FAQ[k][1]);
      const extra = k === "donde" ? [{ label: "Quiero pedir", primary: true, run: () => go("pedir") }] : [];
      setChips([...extra, { label: "Otra pregunta", run: () => go("faq") }, ...back()]);
    };
  });

  // Lleva a otra sección/página (y cierra el chat si ya estamos en ella).
  function navigate(page, hash) {
    const here = onPage(page.replace(".html", ""));
    setTimeout(() => {
      if (here) { close(); const t = document.querySelector(hash); if (t) t.scrollIntoView({ behavior: "smooth" }); }
      else location.href = `${page}${hash}`;
    }, reduce ? 0 : 900);
  }

  function go(id) { state.unknown = 0; (NODES[id] || NODES.menu)(); }

  /* ------------------------------ TEXTO LIBRE ------------------------------ */
  // Motor de comprensión por reglas: normaliza, tolera errores de tipeo, entiende varias
  // preguntas en una, recuerda el último producto y calcula totales con descuento.
  const ACTION = new Set(["persona", "pedir", "comercio", "saludo", "gracias"]);
  const SYN = { wpp: "whatsapp", wsp: "whatsapp", guasap: "whatsapp", whats: "whatsapp", plata: "precio", sale: "cuesta", salen: "cuesta", cuestan: "cuesta", valen: "vale", barata: "precio", barato: "precio", mail: "email", ig: "instagram", insta: "instagram", mayoristas: "mayorista", kioscos: "kiosco" };
  const NOFUZZY = new Set(["cuando", "donde", "como", "quien", "quienes", "cuanto", "cuanta"]);
  const stem = (w) => (w.length > 3 ? w.replace(/s$/, "") : w);
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };
  const tokenize = (q) => q.split(" ").map((t) => SYN[t] || t).filter(Boolean);
  // Devuelve [puntaje, índice del token usado]: cada palabra de la consulta suma una sola vez por tema.
  const kwScore = (kw, toks, joined) => {
    if (kw.includes(" ")) return joined.includes(kw) ? [2, -1] : [0, -1];
    const k = stem(kw);
    let best = [0, -1];
    toks.forEach((t, i) => {
      const s = stem(t);
      let sc = 0;
      if (s === k) sc = kw.length > 4 ? 2 : 1;
      else if (kw.length >= 5 && s.length >= 4 && !NOFUZZY.has(t)) {
        if (kw.length >= 7 && s.startsWith(k)) sc = 2; // "arrepentirme" ~ "arrepent"
        else if (s.startsWith(k) || (s.length >= 5 && k.startsWith(s)) || lev(s, k) <= 1) sc = 1.5;
      }
      if (sc > best[0]) best = [sc, i];
    });
    return best;
  };
  const scoreAll = (q) => {
    const toks = tokenize(q), joined = toks.join(" ");
    const out = {};
    for (const [node, words] of KEYS) {
      let s = 0;
      const used = new Map();
      for (const w of words) {
        const [sc, i] = kwScore(w, toks, joined);
        if (!sc) continue;
        if (i < 0) s += sc; else if (sc > (used.get(i) || 0)) used.set(i, sc);
      }
      used.forEach((v) => { s += v; });
      if (node === "comercio") s *= 2; // "quiero comprar por mayor" debe ir a Negocios, no al catálogo
      if (s > 0) out[node] = s;
    }
    return out;
  };

  const NUM = { un: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20, treinta: 30 };
  function parseOrders(q) {
    const re = /(\d{1,3}|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta)\s+(packs?|six ?packs?|vasos?|remeras?)(?:\s+(negro|rosa|negros|rosas))?/g;
    const out = [];
    let m;
    while ((m = re.exec(q))) {
      const qty = NUM[m[1]] || parseInt(m[1], 10);
      if (!qty || qty > 999) continue;
      const color = (m[3] || "").startsWith("rosa") ? "rosa" : "negro";
      const key = m[2].startsWith("pack") || m[2].startsWith("six") ? "pack" : m[2].startsWith("vaso") ? `vaso-${color}` : "remera";
      const ex = out.find((o) => o.key === key);
      if (ex) ex.qty += qty; else out.push({ key, qty });
    }
    return out;
  }

  // Producto mencionado (o recordado de la charla, para preguntas como "¿y en rosa?").
  function detectProduct(q) {
    if (/\b(vasos?)\b/.test(q)) return /\brosa\b/.test(q) ? "vaso-rosa" : /\bnegro\b/.test(q) ? "vaso-negro" : "vaso";
    if (/\b(packs?|six ?packs?|botellas?)\b/.test(q)) return "pack";
    if (/\b(remeras?|camisetas?|merch)\b/.test(q)) return "remera";
    if (/\b(rosa|negro)\b/.test(q) && state.lastProduct && state.lastProduct.startsWith("vaso")) return /\brosa\b/.test(q) ? "vaso-rosa" : "vaso-negro";
    return null;
  }

  const tierText = (p) => {
    const t = p.tiers.map(([n, d]) => `${d}% OFF desde ${n}`);
    return (t.length ? t.join(" · ") : "") + (p.max ? (t.length ? " · " : "") + `máx. ${p.max} por pedido` : "");
  };
  const discountFor = (p, qty) => p.tiers.reduce((d, [n, pc]) => (qty >= n ? Math.max(d, pc) : d), 0);
  const lineCalc = (p, qty) => { const d = discountFor(p, qty); return { d, total: Math.round(p.price * qty * (1 - d / 100)) }; };

  const productDesc = (key) => {
    const p = PRODUCTS[key === "vaso" ? "vaso-negro" : key];
    const desc = {
      pack: `El <b>pack de 6 botellas</b> de 355 cc cuesta <b>${money(p.price)}</b> sin envío.`,
      vaso: `El <b>vaso UP SKY</b> (edición especial) viene en negro y rosa y cuesta <b>${money(p.price)}</b> sin envío.`,
      remera: `La <b>remera UP SKY</b> es de algodón negro con el logo y cuesta <b>${money(p.price)}</b> sin envío.`,
    }[p.group === "vaso" ? "vaso" : key] || `<b>${p.short}</b>: ${money(p.price)} sin envío.`;
    return desc + (tierText(p) ? `<br>${tierText(p)}.` : "");
  };

  async function productInfo(key) {
    state.lastProduct = key;
    const keys = key === "vaso" ? ["vaso-negro", "vaso-rosa"] : [key];
    const p = PRODUCTS[keys[0]];
    state.topic = p.short; refreshHuman(`Consulta sobre: ${p.short}.`);
    await say(productDesc(key), (m) => { m.insertAdjacentHTML("beforeend", productCards(keys)); bindAdd(m); });
    setChips([{ label: "Quiero pedir", primary: true, run: () => go("pedir") }, { label: "Ver todos los precios", run: () => go("precios") }, ...back()]);
  }

  async function quote(orders) {
    let total = 0, notes = [];
    const lines = orders.map((o) => {
      const p = PRODUCTS[o.key];
      let qty = o.qty;
      if (p.max && qty > p.max) { notes.push(`El máximo por pedido de ${p.short.toLowerCase()} es ${p.max}. Para cantidades mayores conviene comprar por mayor (desde 30 packs).`); qty = p.max; }
      const c = lineCalc(p, qty);
      total += c.total;
      return `${qty} × ${p.short}: <b>${money(c.total)}</b>${c.d ? ` (${c.d}% OFF)` : ""}`;
    });
    state.lastProduct = orders[0].key.startsWith("vaso") ? "vaso" : orders[0].key;
    state.topic = "cotización de pedido"; refreshHuman("Quiero cotizar un pedido.");
    await say(`<b>Cotización</b> (sin envío):<br>${lines.join("<br>")}<br>Total: <b>${money(total)}</b>${notes.length ? `<p class="ua-note">${notes.join(" ")}</p>` : ""}`);
    setChips([{ label: "Agregar al carrito", primary: true, run: () => addMany(orders) }, { label: "Precios por mayor", run: () => go("mayor") }, ...back()]);
  }

  async function addMany(orders) {
    if (orders.length === 1) { addToCart(orders[0].key, orders[0].qty); return; }
    if (!window.upskyCart) { await say("No pude acceder al carrito en esta página. Podés sumarlo desde el catálogo."); return; }
    let r;
    const names = orders.map((o) => {
      const p = PRODUCTS[o.key];
      r = window.upskyCart.add({ id: p.id, name: p.name, price: p.price, qty: o.qty, tiers: p.tiers.map((t) => t.slice()), max: p.max || 0, group: p.group || "" });
      return `${o.qty} × ${p.short}`;
    });
    state.topic = "mi pedido"; refreshHuman("Quiero finalizar un pedido.");
    await say(`Listo, sumé al carrito: ${names.join(", ")}.<br>Total del carrito: <b>${r.totalText}</b>.`);
    setChips([
      { label: "Ver mi carrito", primary: true, run: () => { window.upskyCart.open(); close(); } },
      { label: "Sumar otro producto", run: () => go("pedir") },
      ...back(),
    ]);
  }

  // Varias preguntas en una: se responden juntas.
  const infoText = (k) => {
    if (k === "precios") return "<b>Precios (sin envío)</b>" + PRICES();
    if (k === "cafeina" || k === "calorias") return T.cafeina + "<br>" + T.calorias;
    if (k === "vidrio") return FAQ.vidrio[1] + "<br>" + FAQ.sabor[1];
    if (k === "mayor") return "<b>Por mayor</b>" + PRICES_MAYOR();
    if (T[k]) return T[k];
    return FAQ[k] ? FAQ[k][1] : "";
  };
  async function answerMulti(keys, lead) {
    const uniq = []; keys.forEach((k) => { const kk = k === "calorias" ? "cafeina" : k; if (!uniq.includes(kk)) uniq.push(kk); });
    state.topic = uniq.join(" y "); refreshHuman(`Tengo una consulta sobre: ${uniq.join(", ")}.`);
    await say([lead, ...uniq.map(infoText)].filter(Boolean).join("<br><br>"));
    setChips([{ label: "Quiero pedir", primary: true, run: () => go("pedir") }, { label: "Otra pregunta", run: () => go("faq") }, { label: "Hablar con una persona", run: () => go("persona") }, ...back()]);
  }

  function answer(raw) {
    const q = norm(raw);
    if (!q) return;
    const orders = parseOrders(q);
    const wantsPrice = /\b(cuanto|cuesta|sale|salen|vale|valen|total|precio|precios|costo|cotiza\w*)\b/.test(q);
    const wantsAdd = /\b(agreg\w*|suma\w*|pone\w*|anota\w*|dame|llevo|quiero|necesito|comprar|pedir|pido)\b/.test(q);
    const strongAdd = /\b(agreg\w*|suma\w*|pone\w*|anota\w*)\b/.test(q);
    if (orders.length && wantsPrice && !strongAdd) { state.unknown = 0; quote(orders); return; }
    if (orders.length && wantsAdd) { state.unknown = 0; state.lastProduct = orders[0].key; addMany(orders); return; }

    const prod = detectProduct(q);
    const scores = scoreAll(q);
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const infos = entries.filter(([n]) => !ACTION.has(n));
    const bestInfo = infos[0], top = entries[0];

    if (top && ACTION.has(top[0]) && (!bestInfo || top[1] > bestInfo[1])) { state.unknown = 0; if (prod) state.lastProduct = prod; (NODES[top[0]] || NODES.menu)(); return; }
    if (bestInfo) {
      state.unknown = 0;
      // "¿cuánto sale el vaso?" / "¿y cuánto sale?": precio del producto de la charla, no la lista completa
      if (bestInfo[0] === "precios" && (prod || (state.lastProduct && tokenize(q).length <= 4 && (/^y /.test(q) || /\b(cuanto|cuesta|sale|vale)\b/.test(q))))) {
        const pk = prod || state.lastProduct;
        const others = infos.filter(([n, sc]) => n !== "precios" && sc >= 2).slice(0, 2).map(([n]) => n);
        if (others.length) { state.lastProduct = pk; answerMulti(others, productDesc(pk)); } else productInfo(pk);
        return;
      }
      const picks = infos.filter(([, s], i) => i === 0 || s >= 2).slice(0, 3).map(([n]) => n);
      if (prod) state.lastProduct = prod;
      if (picks.length > 1) answerMulti(picks); else (NODES[picks[0]] || NODES.menu)();
      return;
    }
    if (prod) { state.unknown = 0; productInfo(prod); return; }

    state.unknown += 1;
    state.topic = raw.slice(0, 80);
    refreshHuman(`Tengo esta consulta: "${raw.slice(0, 120)}".`);
    (async () => {
      if (state.unknown >= 2) {
        await say("Mejor te paso con alguien del equipo, así te responden bien.", (m) => m.insertAdjacentHTML("beforeend", linkBtn(human.href, "Abrir WhatsApp", true)));
        setChips(MENU());
      } else {
        await say("No estoy seguro de haberte entendido. Probá con otras palabras, por ejemplo <i>“cuánto sale 12 vasos”</i> o <i>“tiene alcohol y cuánta cafeína”</i>, o elegí una opción:");
        setChips([...MENU().slice(0, 4), { label: "Hablar con una persona", run: () => go("persona") }]);
      }
    })();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || state.busy) return;
    input.value = "";
    addMsg(esc(v), "me");
    answer(v);
  });

  /* ------------------------------ ABRIR / CERRAR ------------------------------ */
  function open() {
    if (state.open) return;
    state.open = true;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("ua-open");
    refreshHuman();
    if (!state.started) {
      state.started = true;
      (async () => {
        await say("Hola, soy el <b>Asistente UP SKY</b>. Te ayudo a hacer tu pedido, resolver dudas del producto o pasarte con una persona.");
        setChips(MENU());
      })();
    }
    setTimeout(() => input.focus({ preventScroll: true }), 350);
  }
  function close() {
    state.open = false;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("ua-open");
  }
  launcher.addEventListener("click", () => (state.open ? close() : open()));
  panel.querySelector(".ua-x:not(.ua-reset)").addEventListener("click", close);
  panel.querySelector(".ua-reset").addEventListener("click", () => {
    log.innerHTML = ""; chips.innerHTML = ""; state.unknown = 0; state.topic = ""; state.busy = false; state.started = false;
    refreshHuman(); open(); state.started = true;
    (async () => { await say("Empezamos de nuevo. ¿Qué necesitás?"); setChips(MENU()); })();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && state.open) close(); });

  const mount = () => {
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    refreshHuman();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();

  window.upskyAssistant = { open, close };
})();
