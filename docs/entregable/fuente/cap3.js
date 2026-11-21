const http = require('http'), fs = require('fs'), path = require('path');
const root = '/home/user/upsky-energydrink/prototype';
const ids = { pack: '11111111-1111-4111-8111-111111111111', vaso: '22222222-2222-4222-8222-222222222222' };
const rows = [
  { id: ids.pack, section: 'productos', data: { nombre: '1 pack de energizante', presentacion: '6 botellas 355cc c/u', tipo: 'Pack', precio: 14500, max_por_pedido: 10, desc_desde_5: 5, etiqueta: 'Más elegido', detalles: 'Contenido: 6 botellas de 355 cc\nEnvase: botella de vidrio\nSabor: frutilla\nOrigen: Industria Argentina' }, position: 0 },
  { id: ids.vaso, section: 'productos', data: { nombre: '1 vaso UP SKY', presentacion: 'Edición especial', tipo: 'Vaso', precio: 3200, desc_desde_5: 5, desc_desde_10: 10, colores: 'Negro, Rosa', detalles: 'Edición especial\nColores: negro y rosa' }, position: 1 },
];
const realFetch = global.fetch;
global.fetch = async (u, o) => String(u).includes('/rest/v1/items') ? { ok: true, status: 200, json: async () => rows } : realFetch(u, o);
const fn = require('/home/user/upsky-energydrink/api/producto.js');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.ico': 'image/x-icon' };
const srv = http.createServer((q, r) => {
  const url = new URL(q.url, 'http://x'); const m = url.pathname.match(/^\/p\/(.+)$/);
  if (m) { const res = { setHeader: (k, v) => r.setHeader(k, v), end: (b) => r.end(b), set statusCode(c) { r.statusCode = c } }; return fn({ query: { slug: decodeURIComponent(m[1]) }, headers: q.headers }, res); }
  const f = path.join(root, url.pathname === '/' ? '/index.html' : url.pathname);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end('nf'); }
  r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(7972);
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const R = {};
  for (const [n, w, h, mob] of [['prodp-d', 1440, 860, 0], ['prodp-m', 390, 844, 1]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mob ? 2 : 1.5, hasTouch: !!mob, isMobile: !!mob });
    await ctx.route('**/rest/v1/items**', r => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(rows) }));
    const p = await ctx.newPage(); await p.addInitScript(() => {});
    await p.goto(`http://localhost:7972/p/vaso-${ids.vaso}`, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    await p.addStyleTag({ content: '.whatsapp-float,.wa-nudge{display:none!important}' });
    await p.waitForTimeout(2500);
    R[n] = await p.evaluate(() => { const o = {}; const s = { media: '.pd-media img', title: '.pd-info h1', price: '.pd-price', color: '.pd-colors', buy: '.pd-buy', share: '.pd-share' }; for (const k in s) { const e = document.querySelector(s[k]); if (!e) { o[k] = null; continue; } const r = e.getBoundingClientRect(); o[k] = { x: r.x, y: r.y, w: r.width, h: r.height }; } return o; });
    await p.screenshot({ path: __dirname + '/' + n + '.png' }); await ctx.close();
  }
  const all = JSON.parse(fs.readFileSync(__dirname + '/rects.json')); Object.assign(all, R); fs.writeFileSync(__dirname + '/rects.json', JSON.stringify(all));
  await b.close(); srv.close(); console.log('ok', JSON.stringify(R['prodp-d']));
})();
