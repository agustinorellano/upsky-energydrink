const { chromium } = require('playwright');
const fs=require('fs');
const D=__dirname, U='http://localhost:7970/';
const hide='.whatsapp-float,.wa-nudge{display:none!important}';
const DV={width:1440,height:860}, MV={width:390,height:844};
const sc=(sel,off=-100)=>async p=>{await p.evaluate(([s,o])=>window.scrollTo(0,document.querySelector(s).getBoundingClientRect().top+scrollY+o),[sel,off]);};
const addCart=async p=>{await p.evaluate(()=>localStorage.clear());await p.reload();await p.addStyleTag({content:hide});await p.waitForTimeout(600);
 await p.click('.product-card[data-id=pack1] .btn-add');for(let i=0;i<4;i++)await p.click('.product-card[data-id=pack1] [data-action=increase]');await p.click('.product-card[data-id=pack1] .btn-add');
 await p.click('#cartButton');await p.waitForTimeout(600);};
const ask=async(p,q)=>{await p.evaluate(()=>window.upskyAssistant.open());await p.waitForTimeout(900);await p.fill('#uaInput',q);await p.press('#uaInput','Enter');await p.waitForTimeout(1800);};
// name, page, viewport, mobile, prep, selectors{key:sel}
const S=[
['home-hero-d','index.html',DV,0,null,{nav:'.main-nav',cta:'.nav-cta',title:'.hero-copy h1',photo:'.hero-bg .hero-photo',btns:'.hero-actions',cue:'.hero-cue',bot:'.ua-launcher'}],
['home-feat-d','index.html',DV,0,sc('#formatos',-40),{title:'#formatos .section-title',pack:'.home-widgets .product-card:nth-of-type(1)',vaso:'.home-widgets .product-card:nth-of-type(2)',color:'.home-widgets .color-picker',remera:'.home-widgets .product-card:nth-of-type(3)',more:'.home-widgets .more-card',arrow:'.hw-arrow--next'}],
['home-comm-d','index.html',DV,0,sc('#lifestyle',-40),{title:'.comm-title',tag:'.comm-tag',car:'.ugc-carousel',foot:'.comm-foot a'}],
['home-faq-d','index.html',DV,0,sc('#faq-home',-110),{title:'#faq-home .story-title',btn:'#faq-home .btn',list:'#faq-home .faq-list'}],
['home-hero-m','index.html',MV,1,null,{title:'.hero-copy h1',photo:'.hero-photo-mobile',btns:'.hero-actions',bot:'.ua-launcher'}],
['home-feat-m','index.html',MV,1,sc('#formatos',20),{title:'#formatos .section-title',card:'.home-widgets .product-card:nth-of-type(1)',bar:'.more-card--bar'}],
['home-comm-m','index.html',MV,1,sc('#lifestyle',0),{title:'.comm-title',tag:'.comm-tag',car:'.ugc-carousel'}],
['cat-d','catalogo.html',DV,0,null,{nav:'.main-nav',title:'.page-hero-title',cta:'.page-hero-cta',quick:'.quick-buy',cue:'.page-banner .scroll-cue, .page-banner [class*=cue]'}],
['cat-grid-d','catalogo.html',DV,0,sc('#productos',-100),{pack:'#minorista + .product-grid .product-card[data-id=pack1]',vaso:'#vaso1',remera:'#minorista + .product-grid .product-card[data-id=remera1]',color:'#minorista + .product-grid .color-picker',share:'#minorista + .product-grid .share-btn',tiers:'#minorista + .product-grid .product-card[data-id=pack1] .price-tiers'}],
['cat-m','catalogo.html',MV,1,null,{title:'.page-hero-title',cta:'.page-hero-cta',quick:'.quick-buy'}],
['cat-grid-m','catalogo.html',MV,1,sc('#productos',-90),{card:'#minorista + .product-grid .product-card[data-id=pack1]',tiers:'#minorista + .product-grid .product-card[data-id=pack1] .price-tiers'}],
['ev-d','eventos.html',DV,0,null,{title:'.ev-title',car:'.ev-carousel',prev:'#evPrev',next:'#evNext'}],
['ev-ag-d','eventos.html',DV,0,sc('#agenda',-60),{title:'.ag-title',feat:'.ag-card--feat',share:'.ag-share',grid:'.ag-grid'}],
['ev-m','eventos.html',MV,1,null,{title:'.ev-title',car:'.ev-carousel'}],
['evp-d','evento-noche-up-sky.html',DV,0,null,{title:'.evp h1, .evp h2',share:'[data-share]'}],
['neg-d','negocios.html',DV,0,null,{title:'.page-hero-title',cta:'.page-hero-cta'}],
['neg-buy-d','negocios.html',DV,0,sc('#mayorista',-90),{c30:'.price-card[data-id=mayor30]',pallet:'.price-card[data-id=mayorpallet]',note:'.bx-pay-note'}],
['neg-how-d','negocios.html',DV,0,sc('#ya-podes',-90),{title:'.bx-how-title',steps:'.bx-how-steps',foot:'.bx-how-foot'}],
['neg-m','negocios.html',MV,1,null,{title:'.page-hero-title',cta:'.page-hero-cta'}],
['neg-buy-m','negocios.html',MV,1,sc('#mayorista',-80),{c30:'.price-card[data-id=mayor30]'}],
['cart-d','catalogo.html',DV,0,addCart,{head:'.cart-drawer-header',items:'#cartItems',more:'#cartAddMore',total:'.cart-total-row',form:'#shippingForm',btn:'#checkoutBtn'}],
['cart-empty-m','catalogo.html',MV,1,async p=>{await p.evaluate(()=>localStorage.clear());await p.reload();await p.addStyleTag({content:hide});await p.waitForTimeout(600);await p.click('#cartButton');await p.waitForTimeout(600);},{plus:'.cart-empty-plus',title:'.cart-empty-title',cta:'#cartEmpty .btn'}],
['bot-d','catalogo.html',DV,0,async p=>{await ask(p,'¿Cuánto cuesta el pack?');},{panel:'.ua-panel',head:'.ua-head',log:'.ua-log',chips:'.ua-chips',form:'.ua-form',human:'.ua-human'}],
['bot-m','catalogo.html',MV,1,async p=>{await ask(p,'¿Tiene alcohol?');},{head:'.ua-head',log:'.ua-log',chips:'.ua-chips',human:'.ua-human'}],
];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const R={};
const only=process.argv[2];const old=fs.existsSync(D+'/rects.json')?JSON.parse(fs.readFileSync(D+'/rects.json')):{};Object.assign(R,old);
for(const [n,pg,vp,mob,fn,sels] of S){ if(only&&!n.startsWith(only))continue;
 const ctx=await b.newContext({viewport:vp,deviceScaleFactor:mob?2:1.5,hasTouch:!!mob,isMobile:!!mob});const p=await ctx.newPage();
 await p.goto(U+pg,{waitUntil:'load'});await p.waitForTimeout(1200);await p.addStyleTag({content:hide});
 try{if(fn)await fn(p);}catch(e){console.log('prep',n,e.message.split('\n')[0]);}
 await p.waitForTimeout(2800);
 R[n]=await p.evaluate(s=>{const o={};for(const k in s){const e=document.querySelector(s[k]);if(!e){o[k]=null;continue;}const r=e.getBoundingClientRect();o[k]={x:r.x,y:r.y,w:r.width,h:r.height};}return o;},sels);
 await p.screenshot({path:`${D}/${n}.png`});await ctx.close();console.log(n,Object.entries(R[n]).filter(([k,v])=>!v).map(x=>x[0]).join(',')||'ok');}
fs.writeFileSync(D+'/rects.json',JSON.stringify(R));await b.close();})();
