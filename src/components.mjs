// Reusable markup blocks (kept class-for-class identical to the approved design).
import { PRODUCTS, ORDER, SET, url as productUrl } from './data/products.mjs';
import { BLOG, blogUrl } from './data/blog.mjs';
import { esc, money, img, ICON, crumbs, faqDetails } from './lib.mjs';

export const hsTag = (p) => (p.bundle ? 'Set of 4 herbal supplements' : 'Herbal Supplement');
export const addBtn = (id, label, cls = 'btn sm', extra = '') => `<button class="${cls}" type="button" data-add="${id}"${extra}>${label}</button>`;

export function productCard(p, { lazy = true } = {}) {
  const was = p.compare ? `<s>${money(p.compare)}</s>` : '';
  const href = productUrl(p);
  const media = p.bundle
    ? `<div style="position:relative;width:78%;height:70%">${ORDER.map((k, i) => `<img src="/assets/img/pouch-${k}.webp" alt="" width="620" height="859" loading="lazy" decoding="async" style="position:absolute;width:48%;height:auto;left:${i * 17}%;top:${[14, 4, 8, 18][i]}%;transform:rotate(${[-8, -2, 4, 9][i]}deg);border-radius:4px;box-shadow:0 18px 30px -14px rgba(0,0,0,.5)">`).join('')}</div>`
    : `${img(`pouch-${p.id}.webp`, `${p.name} 8 oz pouch`, { cls: 'pk', loading: lazy ? 'lazy' : 'eager' })}${img(`bowl-${p.id}.webp`, '', { cls: 'cutp' })}`;
  return `<article class="pcard rv" style="--c:${p.c};--tint:${p.tint}">
    <a href="${href}" class="media" aria-label="${esc(p.name)}">
      <span class="tag">${p.bundle ? 'Best value' : p.tags.split(' · ')[0]}</span>
      ${media}
    </a>
    <div class="quick"><button class="btn" type="button" data-add="${p.id}">Add to cart<span class="qp"> — ${money(p.price)}</span></button></div>
    <div class="body">
      <span class="benefit">${p.tags}</span>
      <h3><a href="${href}">${p.name}</a></h3><span class="hs-tag sm">${hsTag(p)}</span>
      <span class="latin">${p.latin}</span>
      <div class="row"><span class="price">${money(p.price)}${was}</span><span class="size">${p.bundle ? '4 × 8 oz' : '8 oz · 227 g'}</span></div>
    </div>
  </article>`;
}

/* ---------- blog ---------- */
export function blogArt(p) {
  const a = p.art, k = p.k;
  if (a.type === 'photo') return `<div class="bc-img">${img(`photo-${k}.webp`, `${PRODUCTS[k].name} with its source botanical`, { style: 'object-fit:cover' })}</div>`;
  if (a.type === 'cut') return `<div class="bc-img" style="background:${a.bg}">${img(`bowl-${k}.webp`, '', { cls: 'cut' })}</div>`;
  if (a.type === 'pack') return `<div class="bc-img" style="background:${a.bg}">${img(`pouch-${k}.webp`, '', { cls: 'pk' })}${img(`bowl-${k}.webp`, '', { cls: 'cut sm' })}</div>`;
  return `<div class="bc-img" style="background:${a.bg}">${ORDER.map((q, i) => img(`pouch-${q}.webp`, '', { cls: `pk f${i}` })).join('')}</div>`;
}
export function blogCard(p) {
  return `<a class="bcard rv" href="${blogUrl(p)}">${blogArt(p)}<div class="bc-body"><div class="bc-meta"><span>${ICON.book}${p.cat.toUpperCase()}</span><i></i><span>${p.min} MIN READ</span></div><h3>${p.title}</h3><p>${p.dek}</p><time datetime="${p.iso}">${p.date.toUpperCase()}</time></div></a>`;
}
export const blogSection = (n = 3, heading = 'Your guide to <span class="it" style="color:var(--gold)">everyday Ayurveda.</span>') => `<section class="bl-home"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow rv" style="color:#CFE0C9">From the blog</span><h2 class="h-sec rv" style="color:#F3EEDF">${heading}</h2></div><a class="btn rv" style="background:#F3EEDF;color:#14291D;border-color:#F3EEDF" href="/blog/">Visit the blog</a></div>
    <div class="bgrid">${BLOG.slice(0, n).map(blogCard).join('')}</div></div></section>`;

/* ---------- Supplement Facts panel ---------- */
export function sfPanel(p) {
  const s = p.sf; if (!s) return '';
  return `<div class="sf"><p class="sf-title">Supplement Facts</p>
  <div class="sf-sv">Serving Size ${s.size}<br>Servings Per Container ${p.servings}</div>
  <div class="sf-hd"><span>Amount Per Serving</span><span>% Daily Value</span></div>
  <div class="sf-r sf-cal"><b>Calories</b><span>${s.cal}</span><span></span></div>
  ${s.rows.map((r) => `<div class="sf-r ${r[3] ? 'ind' : ''}"><b>${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span></div>`).join('')}
  <div class="sf-ing">${s.ing.map((r) => `<div class="sf-r ${r[3] ? 'ind' : ''}"><b>${r[0]}${r[1] ? ` <small>${r[1]}</small>` : ''}</b><span>${r[2]}</span><span>${r[3] ? '' : '†'}</span></div>`).join('')}</div>
  <small class="sf-fn">* Percent Daily Values are based on a 2,000 calorie diet.<br>† Daily Value not established.</small></div>`;
}

/* ---------- page header band ---------- */
export const phead = (trail, h1, lead = '') => `<div class="phead"><div class="wrap">${crumbs(trail)}<h1 class="h-display">${h1}</h1>${lead ? `<p class="lead" style="margin:16px auto 0">${lead}</p>` : ''}</div></div>`;

export const perks = (items, style = '') => `<div class="perks"${style ? ` style="${style}"` : ''}>${items.map((x) => `<div style="padding:26px">${x[0]}<span style="font-size:14px">${x[1]}</span></div>`).join('')}</div>`;

export const SHOP_PERKS = [[ICON.truck, 'Free US shipping over $50'], [ICON.repeat, 'Subscribe & save 10%'], [ICON.shield, '30-day satisfaction promise']];

export const newsletter = () => `<section class="d-nl">
    <div class="wrap">
      <div class="box rv">
        <span class="blob" style="width:220px;height:220px;background:var(--gold);left:-60px;top:-60px"></span>
        <span class="blob" style="width:160px;height:160px;background:var(--saffron);right:-40px;bottom:-40px;animation-delay:-3s"></span>
        <span class="blob" style="width:70px;height:70px;background:var(--crimson);right:18%;top:30px;animation-delay:-5s"></span>
        <span class="eyebrow" style="color:#CFF3E7;position:relative">Join the Veda Circle</span>
        <h2 style="position:relative">Get 10% off your first order.</h2>
        <p style="position:relative;opacity:.9;margin:0">Plus seasonal recipes and Ayurvedic tips. No spam — ever.</p>
        <form style="position:relative" data-newsletter><label for="nl" style="position:absolute;left:-9999px">Email address</label><input id="nl" name="email" type="email" required autocomplete="email" placeholder="Your email address"><button class="btn pop" type="submit">Subscribe</button></form>
      </div>
    </div>
  </section>`;

export { PRODUCTS, ORDER, SET };

/* ---------- page FAQ block (items must be specific to the page it sits on) ---------- */
export const faqSection = (items, { title = 'Frequently asked <span class="it">questions</span>', eyebrow = 'Questions' } = {}) =>
  `<section class="page-faq" id="faq" style="padding-top:30px"><div class="wrap narrow"><div class="sec-head"><div><span class="eyebrow">${eyebrow}</span><h2 class="h-sec">${title}</h2></div></div><div class="acc">${faqDetails(items)}</div></div></section>`;
