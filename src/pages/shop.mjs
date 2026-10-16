import { SITE, DISCLAIMER, IMG_NOTE, PREG_NOTE } from '../site.mjs';
import { PRODUCTS, ORDER, SET, LISTING, url as productUrl } from '../data/products.mjs';
import { COLLECTIONS } from '../data/content.mjs';
import { BLOG, blogUrl } from '../data/blog.mjs';
import { esc, plain, money, img, ICON, faqDetails, faqSchema, breadcrumbSchema, crumbs, abs } from '../lib.mjs';
import { productCard, blogCard, sfPanel, phead, perks, SHOP_PERKS, hsTag, faqSection } from '../components.mjs';
import { SHOP_FAQ } from '../data/page-faqs.mjs';

const P = PRODUCTS;
const productImages = (p) => (p.bundle ? ORDER.map((k) => `/assets/img/pouch-${k}.webp`) : [`/assets/img/pouch-${p.id}.webp`, `/assets/img/bowl-${p.id}.webp`, `/assets/img/photo-${p.id}.webp`]);

/* ---------- /shop/ ---------- */
export function shopPage() {
  const chips = [['all', 'All', '/shop/'], ...COLLECTIONS.map((c) => [c.slug, c.goal, `/collections/${c.slug}/`]), ['bundle', 'Bundles', '/products/ritual-set/']];
  const trail = [['Home', '/'], ['Shop', '/shop/']];
  const body = `<div class="page">
  ${phead(trail, 'Shop <span class="it" style="color:var(--saffron)">the collection</span>', 'Browse our collection of pure, single-ingredient Ayurvedic powders. Filler-free, small-batch milled in India and shipped across the USA.')}
  <section style="padding-top:30px">
    <div class="wrap">
      <div class="toolbar">
        <nav class="chips" aria-label="Shop by goal">${chips.map((c) => `<a class="chip ${c[0] === 'all' ? 'on' : ''}" href="${c[2]}"${c[0] === 'all' ? ' aria-current="page"' : ''}>${c[0] !== 'all' && c[0] !== 'bundle' ? `<span class="dot" style="--c:${P[COLLECTIONS.find((x) => x.slug === c[0]).product].c}"></span>` : ''}${c[1]}</a>`).join('')}</nav>
        <div style="display:flex;gap:12px;align-items:center"><span class="size">${LISTING.length} products</span></div>
      </div>
      <div class="grid3">${LISTING.map((p, i) => productCard(p, { lazy: i > 2 })).join('')}</div>
      ${perks(SHOP_PERKS, 'margin-top:70px')}
    </div>
  </section>
  <section class="seo-intro" style="padding-top:20px">
    <div class="wrap narrow">
      <h2 class="h-sec">Single-ingredient Ayurvedic powders, <span class="it" style="color:var(--teal)">explained.</span></h2>
      <p>Every Veda Apothecary powder is one botanical in an 8 oz (227 g) resealable pouch — no additives, fillers or preservatives. Choose by goal: <a href="/collections/energy/">Moringa for everyday energy</a>, <a href="/collections/calm/">Ashwagandha for calm</a>, <a href="/collections/digestion/">Triphala for digestion</a> or <a href="/collections/immunity/">Amla for immunity and Vitamin C</a>*, or save 13% with <a href="${productUrl(SET)}">The Ritual Set</a>.</p>
      <p>Not sure where to begin? Read <a href="/blog/what-is-ayurveda/">What is Ayurveda?</a> or <a href="/blog/read-a-supplement-label/">how to read a supplement label</a>.</p>
    </div>
  </section>
  ${faqSection(SHOP_FAQ, { title: 'Shopping <span class="it">FAQ</span>' })}
  </div>`;
  return {
    path: '/shop/', title: 'Shop Pure Ayurvedic Powders Online | Veda Apothecary',
    desc: 'Shop pure single-ingredient Ayurvedic powders: Moringa, Ashwagandha, Triphala and Amla, plus The Ritual Set bundle. Small-batch milled in India, shipped across the USA.',
    nav: 'shop', body, priority: 0.9,
    schema: [{ '@type': 'CollectionPage', name: 'Shop Veda Apothecary', url: abs('/shop/'), isPartOf: { '@id': SITE.domain + '/#website' } }, { '@type': 'ItemList', itemListElement: LISTING.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrl(p)), name: p.name })) }, faqSchema(SHOP_FAQ), breadcrumbSchema(trail)]
  };
}

/* ---------- /collections/<goal>/ ---------- */
export function collectionPage(c) {
  const main = P[c.product];
  const others = ORDER.filter((k) => k !== c.product).map((k) => P[k]);
  const trail = [['Home', '/'], ['Shop', '/shop/'], [c.goal, `/collections/${c.slug}/`]];
  const extra = c.more.map((k) => P[k]);
  const posts = c.articles.map((s) => BLOG.find((b) => b.slug === s));
  const body = `<div class="page">
  ${phead(trail, c.h1, c.lead)}
  <section style="padding-top:30px"><div class="wrap">
    <div class="grid3 feat">${[main, ...extra].map((p) => productCard(p, { lazy: false })).join('')}</div>
  </div></section>
  <section class="seo-intro" style="padding-top:10px"><div class="wrap narrow">
    <h2 class="h-sec">Traditional wisdom, <span class="it" style="color:var(--teal)">simple ritual.</span></h2>
    ${c.intro.map((t) => `<p>${t}</p>`).join('')}
    <h3 class="h-sub">How to build the ritual</h3>
    <ol class="steps-list">${c.steps.map((s) => `<li><b>${s[0]}.</b> ${s[1]}</li>`).join('')}</ol>
    <p class="disc-inline"><b>*${DISCLAIMER}</b> ${PREG_NOTE}</p>
  </div></section>
  <section style="padding-top:20px"><div class="wrap narrow"><div class="sec-head"><div><span class="eyebrow">Good to know</span><h2 class="h-sec">${c.goal} <span class="it">FAQ</span></h2></div></div><div class="acc">${faqDetails(c.faq)}</div></div></section>
  <section style="padding-top:30px"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Explore more</span><h2 class="h-sec">Other <span class="it">botanicals</span></h2></div><a class="btn ghost" href="/shop/">View all</a></div>
    <div class="grid3">${others.slice(0, 3).map((p) => productCard(p)).join('')}</div>
  </div></section>
  <section class="bl-home" style="margin-top:50px"><div class="wrap"><div class="sec-head"><h2 class="h-sec" style="color:#F3EEDF">Read more</h2><a class="btn" style="background:#F3EEDF;color:#14291D;border-color:#F3EEDF" href="/blog/">All articles</a></div><div class="bgrid">${posts.map(blogCard).join('')}</div></div></section>
  </div>`;
  return {
    path: `/collections/${c.slug}/`, title: c.title, desc: c.desc, nav: 'shop', body, priority: 0.8,
    ogImage: `/assets/img/og-${c.product}.jpg`,
    schema: [{ '@type': 'CollectionPage', name: plain(c.h1), url: abs(`/collections/${c.slug}/`), description: c.desc, isPartOf: { '@id': SITE.domain + '/#website' } }, { '@type': 'ItemList', itemListElement: [main, ...extra].map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrl(p)), name: p.name })) }, faqSchema(c.faq), breadcrumbSchema(trail)]
  };
}

/* ---------- /products/<slug>/ ---------- */
export function productPage(p) {
  const imgs = productImages(p);
  const alt = (i) => (p.bundle ? `${P[ORDER[i]].name} pouch` : ['pouch', 'powder in a wooden bowl', 'with its source botanical'][i]);
  const subPrice = p.price * (1 - SITE.subscribeDiscount);
  const related = (p.bundle ? ORDER.slice(0, 3).map((k) => P[k]) : [...ORDER.filter((k) => k !== p.id).slice(0, 2).map((k) => P[k]), SET]);
  const posts = p.articles.map((s) => BLOG.find((b) => b.slug === s));
  const trail = [['Home', '/'], ['Shop', '/shop/'], [p.name, productUrl(p)]];
  const hero = img(imgs[0].split('/').pop(), `${p.name} — 8 oz (227 g) pouch`, { cls: p.bundle ? 'pkimg' : 'pkimg', loading: 'eager', attrs: 'id="pdpMain" fetchpriority="high"' });
  const facts = p.bundle
    ? [['Contents', 'Moringa, Ashwagandha, Triphala and Amla'], ['Net weight', '4 × 8 oz (227 g) pouches'], ['Origin', 'Product of India'], ['Distributed by', SITE.company.legalName]]
    : [['Botanical name', `<i>${p.latin}</i>`], ['Plant part', p.part], ['Net weight', '8 oz (227 g)'], ['Servings per container', p.servings], ['Ingredients', 'One — ' + p.part.toLowerCase() + ' powder only'], ['Origin', 'Product of India'], ['Distributed by', SITE.company.legalName]];
  if (p.id === 'triphala') facts[0] = ['Blend', 'Amalaki (<i>Phyllanthus emblica</i>), Haritaki (<i>Terminalia chebula</i>), Bibhitaki (<i>Terminalia bellirica</i>)'];

  const body = `<div class="page pdp-hero" style="--c:${p.c};--tint:${p.tint}" data-product="${p.id}">
  <div class="wrap">
    ${crumbs(trail).replace('class="crumbs"', 'class="crumbs" style="margin-top:30px"')}
    <div class="pdp">
      <div class="gallery">
        <div class="thumbs" role="group" aria-label="Product images">${imgs.map((src, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-thumb="${src}" aria-label="Show image ${i + 1}">${img(src.split('/').pop(), alt(i), { loading: i === 0 ? 'eager' : 'lazy' })}</button>`).join('')}</div>
        <div class="main-img">${hero}</div>
        <p class="img-note">${IMG_NOTE}</p>
      </div>
      <div class="pinfo">
        <span class="benefit">${p.tags}</span>
        <h1 class="h-display">${p.seo.h1}</h1><span class="hs-tag">${hsTag(p)}</span>
        <span class="latin">${p.latin}</span>
        <div class="pp"><span class="price" id="pp">${money(p.price)}</span>${p.compare ? `<s style="color:#9A8676">${money(p.compare)}</s>` : ''}<span class="size">${p.bundle ? '4 × 8 oz (227 g)' : `Net Wt. 8 oz (227 g) · ${p.servings} servings`}</span></div>
        <p class="short">${p.summary}</p>
        <div class="opts" role="radiogroup" aria-label="Purchase option">
          <label class="opt on" data-opt="once"><input type="radio" name="po" value="once" checked><span class="t"><b>One-time purchase</b><small>Ships in 1–2 business days</small></span><span class="price" style="font-size:18px">${money(p.price)}</span></label>
          <label class="opt" data-opt="sub"><input type="radio" name="po" value="sub"><span class="t"><b>Subscribe &amp; save 10%</b><small>Skip, pause or cancel anytime</small>
            <br><select aria-label="Delivery frequency" id="pdpFreq" hidden>${[30, 45, 60].map((d) => `<option value="${d}">Deliver every ${d} days</option>`).join('')}</select></span>
            <span style="display:grid;justify-items:end;gap:6px"><span class="save">Save 10%</span><span class="price" style="font-size:18px">${money(subPrice)}</span></span></label>
        </div>
        <div class="buyrow">
          <div class="qty"><button type="button" aria-label="Decrease quantity" data-qty="-1">−</button><span id="pdpQty" aria-live="polite">1</span><button type="button" aria-label="Increase quantity" data-qty="1">+</button></div>
          <button class="btn" id="atc" type="button" data-pdp-add="${p.id}">Add to cart — ${money(p.price)}</button>
        </div>
        <button class="btn ghost block" type="button" data-pdp-buy="${p.id}">Buy it now</button>
        <div class="perks">${[[ICON.truck, 'Free shipping over $50'], [ICON.shield, 'GMP · ISO certified'], [ICON.leaf, '100% pure, no additives']].map((x) => `<div>${x[0]}<span>${x[1]}</span></div>`).join('')}</div>
        <div class="acc">
          <details open><summary>Description</summary><div class="in"><p style="margin-top:0">${p.long}</p><ul>${p.pts.map((t) => `<li>${t}</li>`).join('')}</ul></div></details>
          <details><summary>How to use</summary><div class="in">${p.use}</div></details>
          <details><summary>Ingredients</summary><div class="in">${p.ingredients}${p.bundle ? '' : ' Nothing else — no additives, fillers or preservatives.'}</div></details>
          ${p.sf ? `<details open><summary>Supplement Facts</summary><div class="in">${sfPanel(p)}</div></details>` : ''}
          <details><summary>Storage &amp; caution</summary><div class="in"><ul><li>Store in a cool, dry place.</li><li>Keep the pouch tightly sealed after opening.</li><li>Keep away from moisture and direct sunlight.</li></ul><p><b style="color:var(--crimson);font-weight:500">Caution:</b> ${PREG_NOTE} Keep out of reach of children.</p><p class="us-dist">Distributed by: ${SITE.company.legalName}<br>${SITE.company.street}<br>${SITE.company.city}, ${SITE.company.region} ${SITE.company.postal}, USA<br>Product of India<br>For questions, complaints or to report an adverse event, call ${SITE.company.phone}.</p></div></details>
          <details><summary>Shipping &amp; returns</summary><div class="in">Standard US shipping (3–6 business days) is free on orders over $50, otherwise $5.95. Express (1–3 business days) $12.95. Unopened products can be returned within 30 days. <a href="/shipping-returns/" style="text-decoration:underline">Read the full policy</a>.</div></details>
        </div>
        <p class="disc-inline"><b>*${DISCLAIMER}</b></p>
      </div>
    </div>
  </div>

  <section class="seo-intro" style="padding-top:60px">
    <div class="wrap narrow">
      <span class="eyebrow">About ${p.name}</span>
      <h2 class="h-sec">${p.bundle ? 'One set, <span class="it" style="color:var(--c)">the whole day.</span>' : `What is ${p.short} <span class="it" style="color:var(--c)">powder?</span>`}</h2>
      ${p.about.map((t) => `<p>${t}</p>`).join('')}
      <table class="facts"><caption class="sr-only">${p.name} key facts</caption><tbody>${facts.map((f) => `<tr><th scope="row">${f[0]}</th><td>${f[1]}</td></tr>`).join('')}</tbody></table>
    </div>
  </section>

  <section style="padding-top:10px">
    <div class="wrap">
      <div class="sec-head center"><span class="eyebrow">Why you'll love it</span><h2 class="h-sec">${p.bundle ? 'The whole ritual,' : 'Pure ' + p.short + ','} <span class="it" style="color:var(--c)">nothing else.</span></h2></div>
      <div class="benefit-band">${p.pts.map((t, i) => `<div class="rv"><span class="eyebrow" style="color:var(--c)">0${i + 1}</span><b>${t.split(/ — |,/)[0]}</b><p>${t}</p></div>`).join('')}</div>
    </div>
  </section>

  <section style="padding-top:20px">
    <div class="wrap narrow">
      <div class="sec-head"><div><span class="eyebrow">Ways to enjoy</span><h2 class="h-sec">${p.bundle ? 'A day with the <span class="it">Ritual Set</span>' : `How to use <span class="it">${p.short}</span>`}</h2></div></div>
      <ul class="ways">${p.ways.map((w) => `<li><b>${w[0]}</b><span>${w[1]}</span></li>`).join('')}</ul>
    </div>
  </section>

  <section style="padding-top:30px">
    <div class="wrap narrow"><div class="sec-head"><div><span class="eyebrow">Questions</span><h2 class="h-sec">${p.short} <span class="it">FAQ</span></h2></div></div><div class="acc">${faqDetails(p.faq)}</div></div>
  </section>

  <section style="padding-top:30px">
    <div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Complete the ritual</span><h2 class="h-sec">Pairs well <span class="it">with</span></h2></div><a class="btn ghost" href="/shop/">View all</a></div>
      <div class="grid3">${related.map((r) => productCard(r)).join('')}</div>
    </div>
  </section>

  <section class="bl-home" style="margin-top:60px"><div class="wrap"><div class="sec-head"><h2 class="h-sec" style="color:#F3EEDF">Learn more</h2><a class="btn" style="background:#F3EEDF;color:#14291D;border-color:#F3EEDF" href="/blog/">All articles</a></div><div class="bgrid">${posts.map(blogCard).join('')}</div></div></section>
  </div>`;

  const offer = {
    '@type': 'Offer', url: abs(productUrl(p)), priceCurrency: 'USD', price: p.price.toFixed(2), availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': SITE.domain + '/#organization' },
    shippingDetails: { '@type': 'OfferShippingDetails', shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' }, shippingRate: { '@type': 'MonetaryAmount', value: p.price >= SITE.freeShippingOver ? '0' : '5.95', currency: 'USD' }, deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 6, unitCode: 'DAY' } } },
    hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'US', returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 30, returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnShippingFees' }
  };
  const product = {
    '@type': 'Product', '@id': abs(productUrl(p)) + '#product', name: p.name, description: plain(p.seo.desc), sku: p.sku, category: 'Herbal Supplement',
    image: productImages(p).map(abs), brand: { '@type': 'Brand', name: SITE.name }, manufacturer: { '@id': SITE.domain + '/#organization' },
    countryOfOrigin: { '@type': 'Country', name: 'India' }, weight: p.bundle ? undefined : { '@type': 'QuantitativeValue', value: 227, unitCode: 'GRM' },
    ...(p.bundle ? { hasPart: ORDER.map((k) => ({ '@type': 'Product', name: P[k].name, url: abs(productUrl(P[k])) })) } : { additionalProperty: [{ '@type': 'PropertyValue', name: 'Botanical name', value: p.latin }, { '@type': 'PropertyValue', name: 'Plant part', value: p.part }] }),
    offers: offer
  };
  return {
    path: productUrl(p), title: p.seo.title, desc: p.seo.desc, nav: p.bundle ? 'bundle' : 'shop', body, priority: p.bundle ? 0.8 : 0.9,
    ogType: 'product', ogImage: `/assets/img/og-${p.bundle ? 'ritual-set' : p.id}.jpg`, ogAlt: `${p.name} by Veda Apothecary`,
    preload: [imgs[0]], scripts: ['/assets/js/product.js'],
    schema: [product, faqSchema(p.faq), breadcrumbSchema(trail)]
  };
}
