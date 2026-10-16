/* Home page behaviour: hero accordion, rotating goals, quiz, "day with Veda" arc, list hover image,
   and the scroll-driven pour scene. Ported from the approved design (veda-apothecary-final-studio.html). */
(function () {
  'use strict';
  var V = window.VEDA, ORDER = V.order, P = V.products;
  var $ = function (s) { return document.querySelector(s); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var CUT = {}, LOW = {}, IMG = { pack: {} }, VIV = {}, GOAL = {}, PART = {};
  ORDER.forEach(function (k) { CUT[k] = P[k].bowl; LOW[k] = P[k].base; IMG.pack[k] = P[k].pack; VIV[k] = P[k].viv; GOAL[k] = P[k].goal; PART[k] = P[k].part; });
  var IMG_NOTE = 'Image for illustration purposes only. Natural color and appearance may vary.';
  var SCENE = [["#FFF0C7","#16201D","#F0642F","#ffffff"],["#0B4F45","#FFF8EE","#F5B52E","#16201D"],["#FFE3D3","#16201D","#D1275A","#ffffff"],["#DDF1E8","#0B4F45","#0B4F45","#ffffff"]];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- quiz ---------- */
function pickGoal(k){
  const p=P[k]; const r=$("#dres"); if(!r) return;
  document.querySelectorAll(".d-opt").forEach(b=>b.classList.toggle("on",b.dataset.goal===k));
  r.style.setProperty("--c",VIV[k]);
  r.innerHTML=`<small>Your match · ${GOAL[k]}</small><h3>${p.name}</h3><p>${p.short_txt} ${p.use}</p>
    <div class="hero-ctas"><button class="btn" type="button" data-add="${k}">Add — ${money(p.price)}</button><a class="btn" style="background:transparent;color:#fff;border-color:#fff" href="${p.url}">Details</a></div>
    <img class="pk" src="${IMG.pack[k]}" alt="" width="620" height="859"><img class="bowl" src="${CUT[k]}" alt="${p.name}" width="820" height="367"><p class="img-note light">${IMG_NOTE}</p>`;
}
/* ---------- motion ---------- */
let rotT=null, accT=null, psRAF=null, psVisible=false;
function init(){
  initRot(); initAcc(); initList();
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; io.unobserve(e.target); const el=e.target;
    if(el.dataset.count!==undefined){ const end=+el.dataset.count, suf=el.dataset.suf||"", t0=performance.now(); const st=t=>{const q=Math.min(1,(t-t0)/1400); el.textContent=Math.round(end*(1-Math.pow(1-q,3)))+suf; if(q<1) requestAnimationFrame(st);}; requestAnimationFrame(st); }
    else el.classList.add("in"); }),{threshold:.4});
  document.querySelectorAll("[data-count]").forEach(el=>{ el.textContent="0"+(el.dataset.suf||""); io.observe(el); });
  document.querySelectorAll("[data-io]").forEach(el=>io.observe(el));
  dScrollDay(); psStart();
}
function initRot(){
  const spans=[...document.querySelectorAll("#drot span")]; let i=0;
  rotT=setInterval(()=>{ if(!document.body.contains(spans[0])) return clearInterval(rotT); const cur=spans[i]; i=(i+1)%spans.length; const nx=spans[i];
    cur.classList.remove("on"); cur.classList.add("out"); nx.classList.remove("out"); nx.classList.add("on"); setTimeout(()=>cur.classList.remove("out"),650); },2200);
}
function initAcc(){
  const ps=[...document.querySelectorAll(".d-panel")]; let i=0, user=false;
  const set=n=>{ i=n; ps.forEach((p,j)=>p.classList.toggle("on",j===n)); };
  ps.forEach((p,j)=>{ p.addEventListener("mouseenter",()=>{ if(matchMedia("(hover:hover)").matches){ user=true; set(j);} }); p.addEventListener("click",()=>{ user=true; set(j); }); p.addEventListener("keydown",e=>{ if(e.key==="Enter"){ user=true; set(j);} }); });
  accT=setInterval(()=>{ if(!user) set((i+1)%ps.length); },3800);
}
function initList(){
  const f=$("#dfollow"); if(!f || !matchMedia("(pointer:fine)").matches) return;
  document.querySelectorAll(".d-rowi").forEach(r=>{
    r.addEventListener("mouseenter",()=>{ f.src=CUT[r.dataset.k]; f.classList.add("on"); });
    r.addEventListener("mouseleave",()=>f.classList.remove("on"));
    r.addEventListener("mousemove",e=>{ f.style.transform=`translate(${e.clientX-150}px,${e.clientY-120}px) rotate(${(e.movementX||0)*.6}deg)`; });
  });
}
function dScrollDay(){
  const vh=innerHeight;
  const d=$("#dday"); if(d){ const r=d.getBoundingClientRect(); const p=Math.min(1,Math.max(0,(vh*.7-r.top)/(r.height))); const sun=$("#dsun"); const arc=d.querySelector(".d-arc");
    const t=p; const x=20+960*t, y=190-340*t*(1-t)*2*0.75*1.33; // approximate quad bezier
    const bx=(1-t)*(1-t)*20+2*(1-t)*t*500+t*t*980, by=(1-t)*(1-t)*190+2*(1-t)*t*(-150)+t*t*190;
    sun.style.left=(bx/1000*100)+"%"; sun.style.top=(by/200*arc.offsetHeight)+"px";
    const skies=[["#FFE9B8","#FFF8EE"],["#BFE6F5","#F2FBFF"],["#F7A86B","#FBD9C4"],["#1E2A4A","#3B3F6B"]];
    const idx=Math.min(3,Math.floor(p*4)); d.style.setProperty("--sky1",skies[idx][0]); d.style.setProperty("--sky2",skies[idx][1]); d.classList.toggle("night",idx===3);
    d.querySelectorAll(".d-time").forEach(el=>el.classList.toggle("on",+el.dataset.i===idx)); }
  document.querySelectorAll("[data-par]").forEach(el=>{ const r=el.getBoundingClientRect(); if(r.bottom<0||r.top>vh) return; el.style.translate=`0 ${(r.top+r.height/2-vh/2)*+el.dataset.par}px`; });
}
addEventListener("scroll",()=>requestAnimationFrame(dScrollDay),{passive:true});
/* ---------- pour scene ---------- */
function psText(i){
  const k=ORDER[i], p=P[k];
  $("#psL").innerHTML=`<span class="n">0${i+1} / 04 — ${GOAL[k]}</span><h3>${p.short}</h3><span class="hs-tag">Herbal Supplement</span><span class="lt">${p.latin}</span><p>${p.short_txt}</p><div class="ps-meter"><span>Filling the bowl</span><i><b id="scBar"></b></i></div>`;
  $("#psR").innerHTML=`<ul class="ps-facts"><li><span>Part used</span><b>${PART[k]}</b></li><li><span>Net weight</span><b>8 oz (227 g)</b></li><li><span>Servings</span><b>${p.servings}</b></li></ul><span class="price">${money(p.price)}</span><div class="hero-ctas"><button class="btn sm" type="button" data-add="${k}">Add to cart</button><a class="btn sm" style="background:transparent;color:inherit;border-color:currentColor" href="${p.url}">Details</a></div>`;
}
function psJump(i){ const s=$("#ps"); if(!s) return; scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*(i+.5)/4,behavior:"smooth"}); }
function psStart(){
  if(psRAF){ cancelAnimationFrame(psRAF); psRAF=null; }
  if(!$("#ps")) return;
  scReset(); psSet(0); dScroll();
  // only animate while the scene is on screen (saves CPU/battery and keeps the main thread free)
  if(!reduce && "IntersectionObserver" in window) new IntersectionObserver(function(es){ psVisible=es[0].isIntersecting; if(psVisible && !psRAF) psLoop(); }).observe($("#ps"));
}
addEventListener("scroll",()=>requestAnimationFrame(dScroll),{passive:true});
const HP = {moringa:{px:70,top:3,cx:70,cy:45,rx:29,ry:21,sy:51.13},ashwagandha:{px:64,top:14,cx:57.5,cy:49,rx:25.5,ry:24,sy:56},triphala:{px:69,top:6,cx:70.7,cy:50,rx:27.8,ry:23,sy:56.71},amla:{px:68,top:22,cx:72,cy:46,rx:18,ry:15,sy:50.38}};
for(const k in HP){ const h=HP[k]; h.rxi=h.rx*.945; h.ryi=h.ry*(1-.088); h.srx=h.rxi*.93; h.sry=h.ryi*.62; h.x0=h.cx-h.rxi; h.x1=h.cx+h.rxi; }
const PRGB = {moringa:[150,168,52],ashwagandha:[222,184,128],triphala:[150,84,36],amla:[196,178,96]};
const STYLE = ["stream","shake","arc","sprinkle"];
const STYLE_TXT = {stream:"A slow, steady pour",shake:"A gentle shake",arc:"Poured from the side",sprinkle:"A light sprinkle"};
let sc = {i:-1, s:.06, enter:0, phase:"enter", hold:0, ang:0, grains:[], geo:null, q:0, t0:performance.now()};

function scClip(){}
function scBase(h,x){ const d=(x-h.cx)/h.srx; return d*d<1 ? h.sy-h.sry*Math.sqrt(1-d*d) : h.sy; }
function scBot(h,x){ const d=(x-h.cx)/h.rxi; return h.cy+h.ryi*Math.sqrt(Math.max(0,1-d*d)); }
function scSurf(x){ // heap surface y (% of image height) at x (% of image width)
  const h=HP[ORDER[sc.i]]; const Hm=scBase(h,h.px)-h.top;
  const wid=h.rxi*(.55+.5*sc.s), u=Math.abs(x-h.px)/wid, b=Math.max(0,1-u), bump=b*b*(3-2*b);
  const sideLift=(h.sy-h.cy)*sc.s*sc.s*.9*Math.min(1,u); // fills toward the rim as the bowl gets full
  return Math.min(scBot(h,x), scBase(h,x)-Hm*sc.s*bump - sideLift*(1-bump));
}
let scPat=null, scPatK="";
function scPattern(ctx,g){
  const k=ORDER[sc.i];
  if(scPatK!==k){ const c=document.createElement("canvas"), S=320; c.width=c.height=S; const x=c.getContext("2d"), b=PRGB[k];
    x.fillStyle=`rgb(${b[0]},${b[1]},${b[2]})`; x.fillRect(0,0,S,S);
    const dot=(n,rmin,rmax,lo,hi,al)=>{ for(let i=0;i<n;i++){ const f=lo+Math.random()*(hi-lo), r=rmin+Math.random()*(rmax-rmin), px=Math.random()*S, py=Math.random()*S;
      x.fillStyle=`rgba(${Math.min(255,b[0]*f)|0},${Math.min(255,b[1]*f)|0},${Math.min(255,b[2]*f)|0},${al})`;
      for(const [ox,oy] of [[0,0],[S,0],[-S,0],[0,S],[0,-S]]){ x.beginPath(); x.arc(px+ox,py+oy,r,0,7); x.fill(); } } };
    dot(2600,1.2,3.2,.82,1.12,.55); dot(4200,.5,1.3,.68,1.25,.7); dot(700,.4,.9,1.25,1.4,.8);
    scPat={c}; scPatK=k; }
  const pat=ctx.createPattern(scPat.c,"repeat"); pat.setTransform(new DOMMatrix().scale(devicePixelRatio*.6)); return pat;
}
function scDrawHeap(ctx,g){
  const h=HP[ORDER[sc.i]], d=devicePixelRatio, N=70, top=[], bot=[];
  for(let n=0;n<=N;n++){ const x=h.x0+(h.x1-h.x0)*n/N; top.push([ix(g,x)*d,iy(g,scSurf(x))*d]); bot.push([ix(g,x)*d,iy(g,scBot(h,x))*d]); }
  const path=new Path2D(); path.moveTo(...top[0]); top.forEach(p=>path.lineTo(...p)); for(let n=N;n>=0;n--) path.lineTo(...bot[n]); path.closePath();
  const pat=scPattern(ctx,g); if(!pat) return;
  ctx.save(); ctx.fillStyle=pat; ctx.fill(path);
  const L=ix(g,h.x0)*d, R=ix(g,h.x1)*d, T=iy(g,h.top)*d, B=iy(g,h.cy+h.ryi)*d;
  const gr=ctx.createLinearGradient(L,T,R,B); gr.addColorStop(0,"rgba(255,255,240,.16)"); gr.addColorStop(.5,"rgba(0,0,0,0)"); gr.addColorStop(1,"rgba(0,0,0,.26)");
  ctx.fillStyle=gr; ctx.fill(path);
  const gb=ctx.createLinearGradient(0,iy(g,h.sy)*d,0,B); gb.addColorStop(0,"rgba(0,0,0,0)"); gb.addColorStop(1,"rgba(0,0,0,.18)"); ctx.fillStyle=gb; ctx.fill(path);
  const c=PRGB[ORDER[sc.i]]; ctx.lineWidth=2*d; ctx.strokeStyle=`rgba(${c[0]},${c[1]},${c[2]},.55)`; ctx.beginPath(); ctx.moveTo(...top[0]); top.forEach(p=>ctx.lineTo(...p)); ctx.stroke();
  ctx.restore();
}
function scLayout(){
  const st=$("#psStage"), cv=$("#psDust"), b=$("#scBase"), bw=$("#scBowl"), pk=$("#scPk"); if(!st||!cv||!b||!b.naturalWidth) return null;
  const sr=st.getBoundingClientRect(), cr=cv.getBoundingClientRect();
  const W=sr.width, H=sr.height, bowlW=Math.min(W*1.12,660), bowlH=bowlW*b.naturalHeight/b.naturalWidth;
  bw.style.width=bowlW+"px"; bw.style.height=bowlH+"px"; bw.style.left=(W-bowlW)/2+"px"; bw.style.top=(H-bowlH)+"px";
  const pw=Math.max(108,Math.min(210,bowlW*.34)); pk.style.width=pw+"px";
  const ox=sr.left-cr.left, oy=sr.top-cr.top, bx=ox+(W-bowlW)/2, by=oy+H-bowlH;
  sc.geo={W,H,bowlW,bowlH,bx,by,pw,ph:pw/.72,ox,oy,sc:bowlW/600};
  return sc.geo;
}
const ix=(g,xp)=>g.bx+g.bowlW*xp/100, iy=(g,yp)=>g.by+g.bowlH*yp/100;
const easeO=t=>1-Math.pow(1-t,3);

function psSet(i){
  if(i===sc.i) return; const prev=sc.i; sc.i=i; const s=$("#ps"); if(!s) return; const k=ORDER[i], c=SCENE[i];
  s.style.setProperty("--psbg",c[0]); s.style.setProperty("--psfg",c[1]); s.style.setProperty("--psbtn",c[2]); s.style.setProperty("--psbtnfg",c[3]);
  $("#psWord").textContent=k.toUpperCase();
  s.querySelectorAll(".ps-dots button").forEach(el=>el.classList.toggle("on",+el.dataset.psJump===i));
  const L=$("#psL"), R=$("#psR"), bw=$("#scBowl"), pk=$("#scPk"), b=$("#scBase"), hp=$("#scHeap");
  const swap=()=>{ b.src=LOW[k]; hp.src=CUT[k]; pk.src=IMG.pack[k]; pk.alt=`${P[k].name} pouch`; sc.s=.06; sc.enter=0; sc.phase="enter"; sc.grains=[]; sc.ang=0; scClip();
    $("#scCap").innerHTML=`<i></i>${STYLE_TXT[STYLE[i]]}`; const done=()=>{ scLayout(); bw.classList.remove("swap"); }; if(b.complete&&b.naturalWidth) done(); else b.onload=done; };
  if(prev===-1){ psText(i); swap(); }
  else { L.classList.add("out"); R.classList.add("out"); bw.classList.add("swap"); setTimeout(()=>{ psText(i); L.classList.remove("out"); R.classList.remove("out"); swap(); },380); }
}
function psLoop(){
  const cv=$("#psDust"); if(!cv||!psVisible){ psRAF=null; return; } const d=devicePixelRatio, ctx=cv.getContext("2d");
  if(cv.width!==Math.round(cv.offsetWidth*d)||cv.height!==Math.round(cv.offsetHeight*d)){ cv.width=Math.round(cv.offsetWidth*d); cv.height=Math.round(cv.offsetHeight*d); }
  const g=scLayout(); if(!g||sc.i<0){ psRAF=requestAnimationFrame(psLoop); return; }
  const k=ORDER[sc.i], h=HP[k], style=STYLE[sc.i], t=(performance.now()-sc.t0)/1000;
  const vis=cv.getBoundingClientRect(), on=vis.bottom>0&&vis.top<innerHeight;
  // ---- phases
  if(sc.phase==="enter"){ sc.enter=Math.min(1,sc.enter+.022); if(sc.enter>=1) sc.phase="pour"; }
  else if(sc.phase==="pour"){ if(on) sc.s=Math.min(1,sc.s+.0021); sc.s=Math.max(sc.s,.06+sc.q*.9); if(sc.s>=1){ sc.phase="full"; sc.hold=performance.now(); } }
  else if(sc.phase==="full"){ if(performance.now()-sc.hold>2600){ sc.phase="reset"; } }
  else if(sc.phase==="reset"){ sc.s+=(.06-sc.s)*.08; if(sc.s<.08){ sc.s=.06; sc.phase="pour"; } }
  scClip();
  // ---- pouch pose per style
  const peakX=ix(g,h.px), heapTop=iy(g,scSurf(h.px)), lift=g.H*.30;
  let S, A, local, ent; const pw=g.pw, ph=g.ph, e=easeO(sc.enter), pouring=sc.phase==="pour";
  if(style==="stream"){ A=62; S=[peakX+3,heapTop-lift*1.05]; local=[pw*.34,-ph/2]; ent=[260,-220]; }
  else if(style==="shake"){ const w=Math.sin(t*15); A=174+(pouring?w*7:0); S=[peakX+(pouring?w*7:0),heapTop-lift*1.1]; local=[0,-ph/2]; ent=[0,-320]; }
  else if(style==="arc"){ A=108; S=[peakX-g.bowlW*.30,heapTop-lift*1.15]; local=[pw*.34,-ph/2]; ent=[-320,-60]; }
  else { const w=Math.sin(t*1.3); A=128+Math.sin(t*2.4)*9; S=[peakX+w*g.bowlW*(h.x1-h.x0)/100*.28,heapTop-lift*1.05]; local=[pw*.34,-ph/2]; ent=[320,-80]; }
  if(sc.phase==="full"||sc.phase==="reset") A=A-(style==="shake"?150:42);
  sc.ang+=(A*e-sc.ang)*.12;
  const th=sc.ang*Math.PI/180, co=Math.cos(th), si=Math.sin(th), bob=Math.sin(t*1.6)*3;
  const cx=S[0]-(local[0]*co-local[1]*si)+ent[0]*(1-e), cy=S[1]-(local[0]*si+local[1]*co)+ent[1]*(1-e)+bob;
  const pk=$("#scPk"); pk.style.opacity=e; pk.style.transform=`translate(${cx-g.ox-pw/2}px,${cy-g.oy-ph/2}px) rotate(${sc.ang}deg)`;
  const sp=[cx+(local[0]*co-local[1]*si), cy+(local[0]*si+local[1]*co)];
  // ---- emit
  const z=g.sc, c=PRGB[k];
  if(on && pouring && sc.enter>=1){
    if(style==="stream") for(let n=0;n<9;n++) sc.grains.push({x:sp[0]+(Math.random()-.5)*8*z,y:sp[1],vx:(Math.random()-.5)*.5,vy:Math.random()*.6+.3,r:(Math.random()*2.6+1.2)*z});
    else if(style==="shake"){ const w=Math.sin(t*15); if(w>.2) for(let n=0;n<16;n++) sc.grains.push({x:sp[0]+(Math.random()-.5)*pw*.55,y:sp[1],vx:(Math.random()-.5)*1.4,vy:Math.random()*1.4+.6,r:(Math.random()*2.4+1)*z}); }
    else if(style==="arc"){ const dy=Math.max(40,heapTop-sp[1]), T=Math.sqrt(2*dy/.3); for(let n=0;n<8;n++) sc.grains.push({x:sp[0]+(Math.random()-.5)*6*z,y:sp[1],vx:(peakX-sp[0])/T*(.9+Math.random()*.2),vy:-.4+Math.random()*.4,r:(Math.random()*2.6+1.2)*z}); }
    else for(let n=0;n<5;n++) sc.grains.push({x:sp[0]+(Math.random()-.5)*26*z,y:sp[1],vx:(Math.random()-.5)*1.1,vy:Math.random()*.5,r:(Math.random()*1.9+.9)*z,flt:1});
  }
  // ---- simulate & draw
  ctx.clearRect(0,0,cv.width,cv.height);
  scDrawHeap(ctx,g);
  const toImgX=x=>(x-g.bx)/g.bowlW*100;
  sc.grains=sc.grains.filter(p=>(p.a??1)>0 && p.y<cv.height/d+40);
  for(const p of sc.grains){
    if(!p.land){ p.vy+=p.flt?.16:.3; if(p.flt){ p.vx+=(Math.random()-.5)*.25; p.vx*=.97; } else p.x+=(Math.random()-.5)*.4; p.x+=p.vx; p.y+=p.vy;
      const xi=toImgX(p.x);
      if(xi>h.x0&&xi<h.x1){ const sy=iy(g,scSurf(xi)); if(p.y>=sy){ p.land=1; p.y=sy; p.vx=(p.x<peakX?-1:1)*(Math.random()*1.3+.3); p.vy=0; p.a=1; } }
      else if(p.y>g.by+g.bowlH*.6) p.a=0; }
    else { p.x+=p.vx; p.vx*=.86; const xi=toImgX(p.x); if(xi>h.x0&&xi<h.x1) p.y=iy(g,scSurf(xi)); p.a-=.05; }
    const sh=p.sh??(p.sh=.78+Math.random()*.32);
    ctx.beginPath(); ctx.arc(p.x*d,p.y*d,p.r*d,0,7);
    ctx.fillStyle=`rgba(${Math.round(c[0]*sh)},${Math.round(c[1]*sh)},${Math.round(c[2]*sh)},${Math.max(0,p.a??1)})`; ctx.fill();
  }
  const bar=$("#scBar"); if(bar) bar.style.width=Math.round(sc.s*100)+"%";
  psRAF=requestAnimationFrame(psLoop);
}
function dScroll(){
  const s=$("#ps"); if(!s) return; const r=s.getBoundingClientRect(); const p=Math.min(.9999,Math.max(0,-r.top/(s.offsetHeight-innerHeight)));
  const i=Math.floor(p*4); sc.q=Math.min(1,(p*4-i)*1.15); psSet(i);
}
function scReset(){ sc={i:-1,s:.06,enter:0,phase:"enter",hold:0,ang:0,grains:[],geo:null,q:0,t0:performance.now()}; }

/* ---------- wire-up ---------- */
document.addEventListener('click', function (e) {
  var g = e.target.closest('[data-goal]'); if (g) { pickGoal(g.dataset.goal); return; }
  var j = e.target.closest('[data-ps-jump]'); if (j) { psJump(+j.dataset.psJump); }
});
init();
})();
