// Página propia de cada producto (catálogo y venta por mayor) con vista previa al compartir.
// Se pide como /p/<nombre>-<id> (ver vercel.json). Lee de Supabase con la clave pública
// (solo lectura de lo visible) y arma el HTML con las etiquetas Open Graph para WhatsApp,
// Instagram, etc. Si algo falla, responde con un aviso y un enlace al catálogo.
const fs = require("fs");
const path = require("path");

const SB = "https://stwyjbxmkwgwjwmctpki.supabase.co";
const KEY = "sb_publishable_CiDNlwCOX3-z2I59TQg8BA_zJTqZj8P";
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "$" + Number(n).toLocaleString("es-AR");
const slugify = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const DEFAULT_IMG = { Pack: "assets/pack-energizante.webp", Vaso: "assets/vaso-negro-foto.webp", Remera: "assets/remera-frente.webp" };
const UNIT = { Pack: "packs", Vaso: "vasos", Remera: "remeras" };
const SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="19" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

async function loadItems() {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 6000);
  try {
    const r = await fetch(`${SB}/rest/v1/items?select=id,section,data,position&active=eq.true&section=in.(productos,mayorista)&order=position.asc,created_at.asc`, { headers: { apikey: KEY }, signal: ctl.signal });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).map((x) => ({ id: x.id, section: x.section, ...x.data }));
  } finally { clearTimeout(t); }
}

// Mismo criterio de ids que el catálogo (para que el carrito sume en la misma línea).
function cartId(item, all) {
  const id8 = String(item.id).slice(0, 8);
  if (item.section === "mayorista") {
    const i = all.filter((x) => x.section === "mayorista").findIndex((x) => x.id === item.id);
    return i === 0 ? "mayor30" : i === 1 ? "mayorpallet" : "mayor-" + id8;
  }
  const first = all.filter((x) => x.section === "productos").find((x) => x.tipo === item.tipo);
  if (first && first.id === item.id) {
    if (item.tipo === "Pack") return "pack1";
    if (item.tipo === "Remera") return "remera1";
    if (item.tipo === "Vaso") return "vaso-" + slugify(String(item.colores || "negro").split(",")[0]);
  }
  return "prod-" + id8;
}

function page(item, all, origin) {
  const mayor = item.section === "mayorista";
  const imgs = [1, 2, 3, 4].map((n) => item["imagen_" + n]).filter(Boolean);
  const defImg = mayor ? "assets/pack-energizante.webp" : DEFAULT_IMG[item.tipo] || "assets/logo.png";
  const abs = (u) => (/^https?:\/\//.test(u) ? u : origin + "/" + u.replace(/^\//, ""));
  const main = imgs[0] || defImg;
  const canon = `${origin}/p/${slugify(item.nombre)}-${item.id}`;
  const unit = mayor ? "packs" : UNIT[item.tipo] || "unidades";
  const color = !mayor && item.tipo === "Vaso" ? String(item.colores || "").split(",")[0].trim().toLowerCase() : "";
  const cartName = mayor ? `${item.nombre}${item.presentacion ? ` (${item.presentacion})` : ""}` : item.tipo === "Pack" && item.presentacion ? `${item.nombre} (${item.presentacion})` : item.nombre + (color ? ` (${color})` : "");
  const tiers = [];
  if (!mayor && Number(item.desc_desde_5)) tiers.push(`5:${Number(item.desc_desde_5)}`);
  if (!mayor && Number(item.desc_desde_10)) tiers.push(`10:${Number(item.desc_desde_10)}`);
  const li = [];
  if (!mayor && Number(item.desc_desde_5)) li.push(`<li><b>${Number(item.desc_desde_5)}% OFF</b> desde 5 ${unit}</li>`);
  if (!mayor && Number(item.desc_desde_10)) li.push(`<li><b>${Number(item.desc_desde_10)}% OFF</b> desde 10 ${unit}</li>`);
  if (!mayor && Number(item.max_por_pedido)) li.push(`<li>Máximo ${Number(item.max_por_pedido)} por pedido</li>`);
  if (mayor && item.nota) li.push(`<li>${esc(item.nota)}</li>`);
  const desc = item.descripcion || [item.presentacion, item.precio ? money(item.precio) + " (sin envío)" : ""].filter(Boolean).join(" · ");
  const title = `${item.nombre} — UP SKY Energy Drink`;
  const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canon)}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="UP SKY Energy Drink">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canon)}">
<meta property="og:image" content="${esc(abs(main))}">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(abs(main))}">`;
  const thumbs = imgs.length > 1 ? `<div class="pd-thumbs">${imgs.map((u, i) => `<button type="button" class="pd-thumb${i === 0 ? " is-on" : ""}" data-src="${esc(u)}" aria-label="Ver foto ${i + 1}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join("")}</div>` : "";
  const maxAttr = !mayor && Number(item.max_por_pedido) ? ` data-max="${Number(item.max_por_pedido)}"` : "";
  const html = `
<section class="pd">
  <div class="container pd-grid">
    <div class="pd-media">
      <img id="pdMain" src="${esc(main)}" alt="${esc(item.nombre)}" width="900" height="900"${main.endsWith("logo.png") ? ' class="pd-ph"' : ""}>
      ${thumbs}
    </div>
    <div class="pd-info">
      <a href="${mayor ? "negocios.html#mayorista" : "catalogo.html#productos"}" class="pd-back">← ${mayor ? "Para negocios" : "Catálogo"}</a>
      <p class="pd-kicker">${mayor ? "Venta por mayor" : esc(item.tipo || "Producto")}${item.etiqueta ? ` · ${esc(item.etiqueta)}` : ""}</p>
      <h1>${esc(item.nombre)}</h1>
      ${item.presentacion ? `<p class="pd-sub">${esc(item.presentacion)}</p>` : ""}
      <p class="pd-price">${money(item.precio || 0)}</p>
      <p class="pd-note">Precio sin envío</p>
      ${item.descripcion ? `<p class="pd-desc">${esc(item.descripcion)}</p>` : ""}
      ${li.length ? `<ul class="pd-tiers">${li.join("")}</ul>` : ""}
      <div class="pd-buy" data-id="${esc(cartId(item, all))}" data-name="${esc(cartName)}" data-price="${Number(item.precio) || 0}" data-tiers="${esc(tiers.join(","))}"${maxAttr}>
        <div class="qty-stepper">
          <button type="button" class="qty-btn" data-action="decrease" aria-label="Restar">−</button>
          <span class="qty-value">1</span>
          <button type="button" class="qty-btn" data-action="increase" aria-label="Sumar">+</button>
        </div>
        <button class="btn btn-primary btn-add" type="button">Agregar al carrito</button>
      </div>
      <div class="pd-actions">
        <button type="button" class="btn btn-outline pd-share" data-share data-url="${esc(canon)}" data-title="${esc(item.nombre)}">${SHARE}Compartir</button>
        <a class="btn btn-outline" href="${mayor ? "negocios.html#mayorista" : "catalogo.html#productos"}">Ver más productos</a>
      </div>
      <p class="pd-pay">Pago por transferencia bancaria. Los precios no incluyen envío.</p>
    </div>
  </div>
</section>`;
  const ld = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: item.nombre, description: desc, image: [abs(main)], offers: { "@type": "Offer", priceCurrency: "ARS", price: Number(item.precio) || 0, availability: "https://schema.org/InStock", url: canon } }).replace(/</g, "\\u003c")}</script>`;
  return { head, main: html + "\n" + ld };
}

function send(res, code, body, cache) {
  res.statusCode = code;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cache || "no-store");
  res.end(body);
}

module.exports = async (req, res) => {
  const tpl = fs.readFileSync(path.join(__dirname, "_template.html"), "utf8");
  const fill = (h, m) => tpl.replace("{{HEAD}}", h).replace("{{MAIN}}", m);
  const missing = (msg) => send(res, 404, fill('<title>Producto no disponible — UP SKY Energy Drink</title>\n<meta name="robots" content="noindex">',
    `<section class="pd"><div class="container"><div class="pd-info" style="max-width:640px"><h1>${esc(msg)}</h1><p class="pd-desc">Mirá todo lo que tiene UP SKY en el catálogo.</p><div class="pd-actions"><a class="btn btn-primary" href="catalogo.html#productos">Ir al catálogo</a></div></div></div></section>`));
  try {
    const slug = String((req.query && req.query.slug) || "");
    const m = slug.match(UUID);
    if (!m) return missing("Producto no disponible");
    const all = await loadItems();
    const item = all.find((x) => x.id.toLowerCase() === m[0].toLowerCase());
    if (!item) return missing("Este producto ya no está disponible");
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const { head, main } = page(item, all, `${proto}://${host}`);
    return send(res, 200, fill(head, main), "public, s-maxage=60, stale-while-revalidate=300");
  } catch (e) {
    return missing("No pudimos cargar el producto");
  }
};
