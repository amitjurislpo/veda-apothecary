import { SITE, DISCLAIMER, IMG_NOTE } from '../site.mjs';
import { PRODUCTS, ORDER, SET, SINGLE_SUM, url as productUrl } from '../data/products.mjs';
import { COLLECTIONS, HOME_FAQ } from '../data/content.mjs';
import { esc, money, img, ICON, faqDetails, faqSchema, abs, plain } from '../lib.mjs';
import { blogSection, newsletter, hsTag } from '../components.mjs';

const P = PRODUCTS;
const GOAL_ICON = { energy: ICON.sun, calm: ICON.moon, digestion: ICON.leaf, immunity: ICON.shield };
const DAY = [
  ['moringa', '7 am', 'Morning boost', 'Moringa stirred into a green smoothie.'],
  ['amla', '1 pm', 'Midday tonic', 'Amla with sparkling water, lime & mint.'],
  ['ashwagandha', '7 pm', 'Evening calm', 'Ashwagandha in warm golden moon milk.'],
  ['triphala', '10 pm', 'Night ritual', 'Triphala with warm water before bed.']
];
const MARQUEE = [['Pure', '#F5B52E', '#16201D', '-3deg'], ['No fillers', '#F0642F', '#fff', '2deg'], ['Small batch', '#DDF1E8', '#0B4F45', '-2deg'], ['Made in India', '#D1275A', '#fff', '3deg'], ['Loved in the USA', '#FFF0C7', '#16201D', '-2deg'], ['Nothing added', '#fff', '#16201D', '2deg'], ['Single ingredient', '#2F7383', '#fff', '-3deg']];
const WAVE = (top, bot) => `<svg class="wave" viewBox="0 0 1440 70" preserveAspectRatio="none" style="background:${top}" aria-hidden="true"><path d="M-60 40 C 180 0, 420 70, 720 36 S 1260 0, 1500 40 V70 H-60Z" fill="${bot}"/></svg>`;
const SCENE0 = ['#FFF0C7', '#16201D'];

export function homePage() {
  const m = P.moringa;
  const goals = ORDER.map((k, i) => `<button class="d-opt ${k === 'moringa' ? 'on' : ''}" type="button" style="--c:${P[k].viv}" data-goal="${k}"><span class="em">${GOAL_ICON[P[k].benefit]}</span>More ${P[k].goal.toLowerCase()}</button>`).join('');

  const body = `<div class="page">
  <section class="d-hero">
    <div class="wrap">
      <span class="eyebrow rv">Veda Apothecary · Est. in Ayurveda</span>
      <h1 class="rv">Four ancient powders.<br><span class="hl">Zero fillers.<svg viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 100 2, 300 2, 396 12"/></svg></span></h1>
      <div class="d-for rv">Pure Ayurveda for <span class="d-rot" id="drot">${ORDER.map((k, i) => `<span class="${i === 0 ? 'on' : ''}" style="background:${P[k].viv}">${P[k].goal}</span>`).join('')}</span><sup>*</sup></div>
      <p class="hero-lead rv">Premium single-ingredient Ayurvedic powders — Moringa, Ashwagandha, Triphala and Amla — small-batch milled in India and shipped across the USA.</p>
      <div class="d-pills rv">${['100% pure & natural', 'No additives', 'Single ingredient', 'GMP & ISO certified', 'Ships across the USA'].map((t) => `<span>${ICON.check}${t}</span>`).join('')}</div>
      <div class="d-acc rv" id="dacc">
        ${ORDER.map((k, i) => {
          const p = P[k];
          return `<div class="d-panel ${i === 0 ? 'on' : ''}" style="--c:${p.viv}" data-k="${k}" tabindex="0" role="button" aria-label="${esc(p.name)}">
          <div class="dots"></div>
          <span class="num">0${i + 1}</span>
          <span class="vname">${p.short}</span>
          ${img(`pouch-${k}.webp`, '', { cls: 'pk', loading: i === 0 ? 'eager' : 'lazy' })}
          ${img(`bowl-${k}.webp`, `${p.name} in a wooden bowl`, { cls: 'bowl', loading: i === 0 ? 'eager' : 'lazy' })}
          <div class="info"><small>${p.tags}</small><h3 aria-level="2">${p.short}</h3><p>${p.summary}</p>
            <div class="row"><span class="price">${money(p.price)}</span><button class="btn sm" type="button" data-add="${k}">Add to cart</button></div>
            <a href="${productUrl(p)}" style="display:inline-block;margin-top:14px;text-decoration:underline;font-weight:500">Learn more<span class="sr-only"> about ${p.name}</span> →</a></div>
        </div>`;
        }).join('')}
      </div>
    </div>
    <p class="hero-legal"><b>*${DISCLAIMER}</b><br>${IMG_NOTE}</p>
    <div class="sticker"><svg viewBox="0 0 126 126" aria-hidden="true"><defs><path id="stp" d="M63 63m-48 0a48 48 0 1 1 96 0a48 48 0 1 1-96 0"/></defs><text font-size="10" font-weight="700" letter-spacing="2.6" fill="#16201D" font-family="DM Sans"><textPath href="#stp">100% PURE · SINGLE INGREDIENT ·</textPath></text></svg><span style="font-size:30px">8 oz</span></div>
  </section>

  <div class="d-mq" aria-hidden="true"><div class="row">${Array(2).fill(MARQUEE.map((s) => `<span style="--bg:${s[1]};--fg:${s[2]};--rt:${s[3]}">${s[0]}</span>`).join('')).join('')}</div></div>

  <section class="ps" id="ps" style="--psbg:${SCENE0[0]};--psfg:${SCENE0[1]}" aria-label="The four botanicals">
    <div class="ps-pin">
      <canvas id="psDust" aria-hidden="true"></canvas>
      <div class="ps-word" id="psWord" aria-hidden="true">MORINGA</div>
      <div class="wrap ps-grid">
        <div class="ps-left ps-txt" id="psL">
          <span class="n">01 / 04 — ${m.goal}</span><h3>${m.short}</h3><span class="hs-tag">Herbal Supplement</span><span class="lt">${m.latin}</span><p>${m.summary}</p><div class="ps-meter"><span>Filling the bowl</span><i><b id="scBar"></b></i></div>
        </div>
        <div class="ps-stage" id="psStage">
          <div class="sc-bowl" id="scBowl"><img class="sc-base" id="scBase" alt="" src="/assets/img/bowl-base-moringa.webp" width="820" height="367"><img class="sc-heap" id="scHeap" alt="" src="/assets/img/bowl-moringa.webp" width="820" height="367"></div>
          <img class="sc-pk" id="scPk" alt="Moringa Powder pouch" src="/assets/img/pouch-moringa.webp" width="620" height="861">
          <div class="sc-cap" id="scCap"><i></i>A slow, steady pour</div>
        </div>
        <div class="ps-right ps-txt" id="psR">
          <ul class="ps-facts"><li><span>Part used</span><b>${m.part}</b></li><li><span>Net weight</span><b>8 oz (227 g)</b></li><li><span>Servings</span><b>${m.servings}</b></li></ul><span class="price">${money(m.price)}</span><div class="hero-ctas"><button class="btn sm" type="button" data-add="moringa">Add to cart</button><a class="btn sm" style="background:transparent;color:inherit;border-color:currentColor" href="${productUrl(m)}">Details</a></div>
        </div>
      </div>
      <div class="ps-dots">${ORDER.map((k, i) => `<button class="${i === 0 ? 'on' : ''}" type="button" data-ps-jump="${i}" aria-label="${esc(P[k].name)}"><i></i></button>`).join('')}</div>
      <div class="ps-note"><b>*${DISCLAIMER}</b> · ${IMG_NOTE}</div>
    </div>
  </section>

  <section class="d-quiz">
    <span class="doodle" style="left:6%;top:70px" aria-hidden="true">pick one ↓</span>
    <div class="wrap grid">
      <div>
        <span class="eyebrow rv">Find your ritual</span>
        <h2 class="h-sec rv">What does your body <span class="it" style="color:var(--crimson)">need today?</span></h2>
        <p class="lead rv" style="margin-top:16px">Tap a goal — we'll match you with the botanical traditionally used for it.*</p>
        <div class="d-opts rv" role="group" aria-label="Choose a goal">${goals}</div>
      </div>
      <div class="d-result rv" id="dres" style="--c:${m.viv}" aria-live="polite"><small>Your match · ${m.goal}</small><h3>${m.name}</h3><p>${m.summary} ${m.use}</p>
        <div class="hero-ctas"><button class="btn" type="button" data-add="moringa">Add — ${money(m.price)}</button><a class="btn" style="background:transparent;color:#fff;border-color:#fff" href="${productUrl(m)}">Details</a></div>
        ${img('pouch-moringa.webp', '', { cls: 'pk' })}${img('bowl-moringa.webp', m.name, { cls: 'bowl' })}<p class="img-note light">${IMG_NOTE}</p></div>
    </div>
  </section>

  <section class="d-io">
    <div class="wrap">
      <div class="sec-head center"><span class="eyebrow rv">Radically simple</span><h2 class="h-sec rv">What's in the pouch. <span class="it" style="color:var(--saffron)">What's not.</span></h2></div>
      <div class="grid">
        <div class="d-in rv"><div class="big">1</div><h3>ingredient. That's it.</h3><p style="max-width:300px;color:var(--brown2);margin:0">One botanical per pouch, milled in small batches — exactly as nature intended.</p>${img('bowl-moringa.webp', '', { attrs: 'data-par="-0.06"' })}</div>
        <div class="d-not rv" data-io><h3>Never in our pouches:</h3><ul><li>Fillers</li><li>Additives</li><li>Preservatives</li><li>Artificial colors</li><li>Shortcuts</li></ul></div>
      </div>
    </div>
  </section>

  <section class="seo-intro">
    <div class="wrap narrow">
      <span class="eyebrow rv">About Veda Apothecary</span>
      <h2 class="h-sec rv">Pure Ayurvedic herbal powders, <span class="it" style="color:var(--teal)">made in India, shipped from Texas.</span></h2>
      <p class="rv">Veda Apothecary makes single-ingredient Ayurvedic powders for everyday rituals. <a href="${productUrl(P.moringa)}">Moringa</a>, <a href="${productUrl(P.ashwagandha)}">Ashwagandha</a>, <a href="${productUrl(P.triphala)}">Triphala</a> and <a href="${productUrl(P.amla)}">Amla</a> are sourced at the origin of these traditional botanicals in India, milled in small batches in a GMP-certified, ISO-certified facility, and distributed across the USA by Old Soul Goods Inc. in Katy, Texas.</p>
      <p class="rv">Every 8 oz (227 g) resealable pouch lists one botanical — Triphala is a three-fruit blend — with no additives, fillers or preservatives, and a full Supplement Facts panel. New to Ayurveda? Start with our <a href="/blog/what-is-ayurveda/">beginner’s guide</a>, or choose a goal below.</p>
      <ul class="goal-links rv">${COLLECTIONS.map((c) => `<li><a href="/collections/${c.slug}/"><b>${c.goal}</b><span>${P[c.product].name}</span></a></li>`).join('')}</ul>
    </div>
  </section>

  <section class="d-day" id="dday">
    <div class="wrap">
      <div class="sec-head center"><span class="eyebrow rv">A day with Veda</span><h2 class="h-sec rv">One botanical for <span class="it" style="color:var(--saffron)">every hour.</span></h2><p class="lead rv">Scroll — the sun moves with you.</p></div>
      <div class="d-arc"><svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d="M20 190 Q 500 -150 980 190"/></svg><div class="d-sun" id="dsun"></div></div>
      <div class="d-times">
        ${DAY.map((t, i) => `<a class="d-time rv" href="${productUrl(P[t[0]])}" style="--c:${P[t[0]].viv}" data-i="${i}"><span class="t">${t[1]}</span><h3>${t[2]}</h3><p>${t[3]}</p>${img(`bowl-${t[0]}.webp`, P[t[0]].name)}</a>`).join('')}
      </div>
    </div>
  </section>

  <section class="d-list" id="dlist">
    <div class="wrap">
      <div class="sec-head"><div><span class="eyebrow rv">The collection</span><h2 class="h-sec rv">Shop by <span class="it" style="color:var(--teal)">botanical.</span></h2></div><a class="btn ghost rv" href="/shop/">See all products</a></div>
      <div class="d-rows">
        ${ORDER.map((k, i) => { const p = P[k]; return `<div class="d-rowi rv" style="--c:${p.viv}" data-k="${k}"><span class="n">0${i + 1}</span><a href="${productUrl(p)}"><h3>${p.short}<small>${p.latin}</small></h3></a><span class="tags">${p.tags}<br><span class="price">${money(p.price)}</span></span><button class="btn sm" type="button" data-add="${k}" aria-label="Add ${esc(p.name)} to cart">Add +</button></div>`; }).join('')}
      </div>
    </div>
    <img class="d-follow" id="dfollow" src="/assets/img/bowl-moringa.webp" alt="" width="820" height="367">
  </section>

  <section class="d-tk">
    <div class="wrap">
      <div class="ticket rv">
        <div class="l">
          <span class="eyebrow" style="color:#FFD9E3">The Ritual Set · bundle</span>
          <h2>All four. One box. Better price.</h2>
          <p>Moringa, Ashwagandha, Triphala &amp; Amla — 8 oz each. A complete morning-to-night ritual, or the perfect wellness gift.</p>
          <div class="pr"><span class="price">${money(SET.price)}</span><s style="opacity:.7;font-size:20px">${money(SINGLE_SUM)}</s></div>
          <div class="hero-ctas"><button class="btn yellow" type="button" data-add="ritual-set">Add the set to cart</button><a class="btn" style="background:transparent;border-color:#fff" href="${productUrl(SET)}">What's inside</a></div>
        </div>
        <div class="r">${['amla', 'moringa', 'triphala', 'ashwagandha'].map((k) => img(`pouch-${k}.webp`, `${P[k].name} pouch`)).join('')}
          <div class="sticker"><svg viewBox="0 0 126 126" aria-hidden="true"><defs><path id="stp2" d="M63 63m-48 0a48 48 0 1 1 96 0a48 48 0 1 1-96 0"/></defs><text font-size="10" font-weight="700" letter-spacing="2.6" fill="#16201D" font-family="DM Sans"><textPath href="#stp2">BEST VALUE · BEST VALUE · BEST ·</textPath></text></svg>−13%</div></div>
      </div>
    </div>
  </section>

  ${WAVE('#FFFFFF', '#FFE3D3')}
  <section class="d-cert" style="padding-top:70px">
    <div class="wrap">
      <div class="sec-head center"><span class="eyebrow rv">Quality you can check</span><h2 class="h-sec rv">Certified. Transparent. <span class="it" style="color:var(--crimson)">Honest.</span></h2></div>
      <div class="d-certs">
        ${[['GMP', '#0F8B74', 'GMP certified', 'Good Manufacturing Practice standards on every batch.'], ['ISO', '#D1275A', 'ISO certified', 'Internationally recognised quality management.'], ['US', '#F0642F', 'Distributed in the USA', 'By Old Soul Goods Inc., Katy, Texas.'], ['IN', '#F5B52E', 'Made in India', 'Sourced at the origin of these botanicals.']].map((c) => `<div class="rv" style="--c:${c[1]}"><div class="badge">${c[0]}</div><h3>${c[2]}</h3><p>${c[3]}</p></div>`).join('')}
      </div>
      <div class="d-stats">
        <div class="rv"><b data-count="100" data-suf="%">100%</b><span>Pure botanical</span></div>
        <div class="rv"><b data-count="0" data-suf="">0</b><span>Fillers or additives</span></div>
        <div class="rv"><b data-count="8" data-suf=" oz">8 oz</b><span>Resealable pouch</span></div>
        <div class="rv"><b data-count="38" data-suf="+">38+</b><span>Servings per pouch</span></div>
      </div>
    </div>
  </section>
  ${WAVE('#FFE3D3', '#FFF8EE')}

  ${blogSection(3)}
  <section class="d-faq">
    <div class="wrap grid">
      <div><span class="eyebrow rv">Questions?</span><h2 class="h-sec rv">Good to <span class="it" style="color:var(--teal)">know.</span></h2><p class="lead rv" style="margin-top:16px">Can't find your answer? See the <a href="/faq/" style="color:var(--teal);text-decoration:underline">full FAQ</a> or <a href="/contact/" style="color:var(--teal);text-decoration:underline">say hello</a> — we reply within a business day.</p></div>
      <div class="rv">${faqDetails(HOME_FAQ)}</div>
    </div>
  </section>

  ${newsletter()}
  </div>`;

  const itemList = {
    '@type': 'ItemList',
    name: 'Veda Apothecary Ayurvedic powders',
    itemListElement: [...ORDER.map((k) => P[k]), SET].map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrl(p)), name: p.name }))
  };

  return {
    path: '/',
    title: 'Ayurvedic Powders: Moringa, Ashwagandha, Triphala, Amla | Veda Apothecary',
    desc: SITE.description,
    nav: '',
    body,
    schema: [{ '@type': 'WebPage', '@id': SITE.domain + '/#webpage', url: SITE.domain + '/', name: 'Veda Apothecary — Pure Ayurvedic Powders', isPartOf: { '@id': SITE.domain + '/#website' }, about: { '@id': SITE.domain + '/#organization' }, inLanguage: 'en-US' }, itemList, faqSchema(HOME_FAQ)],
    scripts: ['/assets/js/home.js'],
    preload: ['/assets/img/pouch-moringa.webp'],
    priority: 1.0
  };
}
