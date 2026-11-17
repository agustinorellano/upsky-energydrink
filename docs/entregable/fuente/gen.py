import json,os
R=json.load(open('rects.json'))
HEAD='''<!doctype html><html lang="es"><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Manrope:wght@400;600;700;800&family=Archivo:ital,wdth,wght@1,100..125,900&display=swap"><style>
*{box-sizing:border-box;margin:0}
@page{size:1920px 1080px;margin:0}
body{background:#0a0a0c;font-family:'Manrope',sans-serif;color:#fff}
.slide{width:1920px;height:1080px;padding:44px 64px 40px;position:relative;overflow:hidden;page-break-after:always;
 background:#0a0a0c radial-gradient(1000px 640px at 90% 0%,rgba(236,31,122,.26),transparent 70%) no-repeat;
 background-image:radial-gradient(1000px 640px at 90% 0%,rgba(236,31,122,.26),transparent 70%),radial-gradient(800px 600px at 4% 100%,rgba(236,31,122,.13),transparent 70%)}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.tag span{border:1.5px solid rgba(236,31,122,.7);background:rgba(236,31,122,.12);padding:10px 22px;border-radius:999px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;font-size:14px}
.tag b{color:#ec1f7a}
.top img{height:48px}
h2{font-family:'Archivo';font-style:italic;font-weight:900;font-stretch:125%;text-transform:uppercase;line-height:1;font-size:38px;margin-bottom:6px}
h2 span{color:#ec1f7a}
.sub{color:#a3a3ab;font-size:16.5px;margin:10px 0 22px;max-width:1300px;line-height:1.5}
.foot{position:absolute;left:64px;right:64px;bottom:20px;color:#6f6f79;font-size:12px;letter-spacing:.1em;display:flex;justify-content:space-between}
.pin{position:absolute;width:30px;height:30px;border-radius:50%;background:#ec1f7a;color:#fff;font-weight:800;font-size:14px;display:grid;place-items:center;border:2.5px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.55);z-index:5}
.hl{position:absolute;border:2.5px dashed #ec1f7a;border-radius:10px;box-shadow:0 0 0 1px rgba(255,255,255,.2);z-index:4;pointer-events:none}
.leg{list-style:none;display:grid;gap:16px}
.leg li{display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:start}
.leg .n{width:30px;height:30px;border-radius:50%;background:#ec1f7a;font-weight:800;font-size:14px;display:grid;place-items:center;border:2.5px solid #fff;margin-top:1px}
.leg b{display:block;font-size:17px;margin-bottom:2px}
.leg p{color:#b4b4bd;font-size:14.5px;line-height:1.45}
.row{display:flex;gap:44px;align-items:flex-start}
.bwrap{position:relative;flex:none}
.browser{border-radius:18px;overflow:hidden;background:#131316;border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 70px rgba(0,0,0,.6)}
.bar{height:36px;background:#1b1b20;display:flex;align-items:center;gap:7px;padding:0 16px}
.bar i{width:10px;height:10px;border-radius:50%;background:#3a3a42}
.bar em{margin:0 auto;font-style:normal;font-size:12.5px;color:#8e8e98;background:#0e0e11;border-radius:999px;padding:5px 22px}
.browser img{display:block;width:100%}
.side{flex:1;padding-top:4px}
.side h3,.cardh{font-family:'Oswald';font-weight:600;font-size:22px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:16px}
.phones{display:flex;justify-content:space-between;gap:30px}
.pcol{display:flex;flex-direction:column;align-items:center;width:%(PW)spx}
.pwrap{position:relative;width:%(PW)spx}
.phone{border-radius:46px;padding:10px;background:linear-gradient(145deg,#2a2a31,#0c0c0f);border:2.5px solid #3a3a42;box-shadow:0 30px 70px rgba(0,0,0,.65)}
.phone .scr{border-radius:36px;overflow:hidden;background:#000}
.phone .scr img{display:block;width:100%%}
.cap{margin:16px 0 10px;text-align:center;font-size:14px;letter-spacing:.1em;text-transform:uppercase;font-weight:800}
.cap b{color:#ec1f7a;margin-right:8px}
.leg.sm{width:100%%;gap:10px}.leg.sm b{font-size:14.5px}.leg.sm p{font-size:12.5px;line-height:1.4}
.leg.sm li{grid-template-columns:34px 1fr;gap:10px}
.grid{display:grid;gap:26px}
.card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:30px 30px}
.card.pk{background:rgba(236,31,122,.10);border-color:rgba(236,31,122,.45)}
.card h4{font-family:'Oswald';font-weight:600;font-size:26px;text-transform:uppercase;letter-spacing:.03em;margin-bottom:8px}
.card p,.card li{color:#c3c3cb;font-size:17.5px;line-height:1.55}
.card ul{padding-left:18px;display:grid;gap:5px}
.card .k{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.14em;color:#ec1f7a;text-transform:uppercase;margin-bottom:6px}
.badge{display:inline-block;border:1.5px solid rgba(255,255,255,.35);border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px;margin-left:10px;color:#e6e6ea;vertical-align:middle}
</style></head><body>'''
SEC=''
def top(sec):
    return f'<div class="top"><div class="tag"><span>UP SKY Energy Drink · <b>{sec}</b> · Entregable de funcionalidades</span></div><img src="logo.png"></div>'
def foot(n,sec): return f'<div class="foot"><span>PROTOTIPO · {sec.upper()}</span><span>NOVIEMBRE 2026 · {n:02d}</span></div>'
def hl(r,s,ox,oy,n,pad=5,anchor='tl',vh=None):
    if vh:
        y0=max(0,r['y']);y1=min(vh,r['y']+r['h']);r=dict(r,y=y0,h=y1-y0)
    x=r['x']*s+ox-pad;y=r['y']*s+oy-pad;w=r['w']*s+2*pad;h=r['h']*s+2*pad
    px,py={'tl':(x-12,y-12),'tr':(x+w-18,y-12),'br':(x+w-18,y+h-18),'bl':(x-12,y+h-18),'cl':(x-16,y+h/2-15),'cr':(x+w-14,y+h/2-15)}[anchor]
    px=max(2,px);py=max(2,py)
    return f'<div class="hl" style="left:{x:.0f}px;top:{y:.0f}px;width:{w:.0f}px;height:{h:.0f}px"></div><div class="pin" style="left:{px:.0f}px;top:{py:.0f}px">{n}</div>'
slides=[];N=[0]
def add(html,sec):
    N[0]+=1;slides.append(f'<section class="slide">{html}{foot(N[0],sec)}</section>')
def desk(sec,title,sub,img,key,url,items,_s=None,W=1130):
    r=R[key];s=W/1440;bar=36;pins='';leg=''
    i=0
    for k,t,p,*o in items:
        if not r.get(k) or r[k]['w']<2 or r[k]['y']>858 or r[k]['y']+r[k]['h']<8: print('MISSING',key,k);continue
        i+=1;a=o[0] if o else 'tl';pad=o[1] if len(o)>1 else 5
        pins+=hl(r[k],s,0,bar,i,pad,a,860);leg+=f'<li><span class="n">{i}</span><div><b>{t}</b><p>{p}</p></div></li>'
    add(top(sec)+f'<h2>{title}</h2><p class="sub">{sub}</p><div class="row"><div class="bwrap" style="width:{W}px"><div class="browser"><div class="bar"><i></i><i></i><i></i><em>{url}</em></div><img src="{img}.png"></div>{pins}</div><div class="side"><h3>Qué tiene</h3><ul class="leg">{leg}</ul></div></div>',sec)
def phones(sec,title,sub,cols,PW=250):
    out='';
    for img,key,cap,items in cols:
        r=R[key];s=(PW-20)/390;pins='';leg='';i=0
        for k,t,p,*o in items:
            if not r.get(k) or r[k]['w']<2 or r[k]['y']>842 or r[k]['y']+r[k]['h']<8: print('MISSING',key,k);continue
            i+=1;a=o[0] if o else 'tl';pad=o[1] if len(o)>1 else 3
            pins+=hl(r[k],s,10,10,i,pad,a,844);leg+=f'<li><span class="n">{i}</span><div><b>{t}</b><p>{p}</p></div></li>'
        out+=f'<div class="pcol" style="width:{PW}px"><div class="pwrap" style="width:{PW}px"><div class="phone"><div class="scr"><img src="{img}.png"></div></div>{pins}</div><p class="cap">{cap}</p><ul class="leg sm">{leg}</ul></div>'
    add(top(sec)+f'<h2>{title}</h2><p class="sub" style="margin-bottom:14px">{sub}</p><div class="phones" style="justify-content:center;gap:{110 if PW>300 else 70}px">{out}</div>',sec)
exec(open('content.py').read())
html=(HEAD.replace('%(PW)s','268').replace('%%','%'))+''.join(slides)+'</body></html>'
open('deck.html','w').write(html);print(N[0],'slides')
