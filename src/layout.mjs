import { SITE, DISCLAIMER } from './site.mjs';
import { PRODUCTS, SET, ORDER, url as productUrl } from './data/products.mjs';
import { COLLECTIONS } from './data/content.mjs';
import { esc, json, abs, img, plain, ICON } from './lib.mjs';

export const ASSET_V = { css: '', js: '' }; // filled in by build.mjs (content hashes)

const ANN = [
  `Free US shipping on orders over <b>$${SITE.freeShippingOver}</b>`,
  'Use code <b>VEDA10</b> for 10% off your first order',
  'Subscribe &amp; save <b>10%</b> on every delivery',
  'GMP · ISO certified · <b>100% pure</b>, nothing added'
];

const NAV = [
  ['shop', '/shop/', 'Shop'],
  ['bundle', '/products/ritual-set/', 'Ritual Set'],
  ['blog', '/blog/', 'Blog'],
  ['about', '/about/', 'Our Story'],
  ['wholesale', '/wholesale/', 'Wholesale']
];

export function organizationSchema() {
  const c = SITE.company;
  return {
    '@type': 'Organization',
    '@id': SITE.domain + '/#organization',
    name: SITE.name,
    legalName: c.legalName,
    url: SITE.domain + '/',
    logo: { '@type': 'ImageObject', url: abs('/assets/img/logo.png'), width: 360, height: 258 },
    image: abs('/assets/img/og-default.jpg'),
    description: SITE.description,
    email: c.email,
    telephone: c.phone,
    address: { '@type': 'PostalAddress', streetAddress: c.street, addressLocality: c.city, addressRegion: c.region, postalCode: c.postal, addressCountry: c.country },
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: c.phone, email: c.email, areaServed: 'US', availableLanguage: 'English' }],
    ...(SITE.social.length ? { sameAs: SITE.social } : {})
  };
}
export const websiteSchema = () => ({ '@type': 'WebSite', '@id': SITE.domain + '/#website', url: SITE.domain + '/', name: SITE.name, description: SITE.description, publisher: { '@id': SITE.domain + '/#organization' }, inLanguage: 'en-US' });

function head(p) {
  const canonical = abs(p.path);
  const title = p.title;
  const og = abs(p.ogImage || '/assets/img/og-default.jpg');
  const robots = p.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const graph = [organizationSchema(), websiteSchema(), ...(p.schema || [])];
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="format-detection" content="telephone=no">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${esc(p.ogTitle || title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.ogAlt || 'Veda Apothecary single-ingredient Ayurvedic powders')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.ogTitle || title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${og}">
${p.published ? `<meta property="article:published_time" content="${p.published}">\n<meta property="article:modified_time" content="${p.modified || p.published}">` : ''}
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
${p.preload ? p.preload.map((x) => `<link rel="preload" as="image" href="${x}" fetchpriority="high">`).join('\n') : ''}
<script>document.documentElement.className+=' js'</script>
<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_V.css}">
<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script>
${SITE.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.ga4}')</script>` : ''}
</head>`;
}

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<div class="announce" id="announce" aria-live="polite" data-messages="${esc(JSON.stringify(ANN))}"><div><span>${ANN[0]}</span></div></div>
<header class="site" id="hdr">
  <div class="wrap nav">
    <nav class="nav-left" aria-label="Primary">
      ${NAV.map((n) => `<a href="${n[1]}" data-nav="${n[0]}"${active === n[0] ? ' class="active" aria-current="page"' : ''}>${n[2]}</a>`).join('\n      ')}
    </nav>
    <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-controls="mnav" data-menu="open"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h12"/></svg></button>
    <a href="/" class="logo" aria-label="Veda Apothecary home">${img('logo.png', 'Veda Apothecary', { cls: 'lg-dark', loading: 'eager', attrs: 'fetchpriority="high"' })}${img('logo-light.png', 'Veda Apothecary', { cls: 'lg-light', loading: 'lazy' })}</a>
    <div class="nav-right">
      <button class="icon-btn" type="button" aria-label="Search" data-search="open"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
      <a class="icon-btn hide-m" href="/contact/" aria-label="Contact"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></a>
      <button class="icon-btn" type="button" aria-label="Open cart, 0 items" data-cart="open"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="cart-count" id="cc" aria-hidden="true">0</span></button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mnav" role="dialog" aria-label="Menu">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    ${img('logo.png', 'Veda Apothecary', { style: 'height:50px;width:auto' })}
    <button class="icon-btn" type="button" aria-label="Close menu" data-menu="close"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  </div>
  <a href="/">Home</a>
  <a href="/shop/">Shop All</a>
  <a href="/products/ritual-set/">The Ritual Set</a>
  <a href="/blog/">Blog</a>
  <a href="/about/">Our Story</a>
  <a href="/wholesale/">Wholesale</a>
  <a href="/faq/">FAQ</a>
  <a href="/contact/">Contact</a>
</div>
<div class="search" id="search" role="dialog" aria-label="Search">
  <div class="wrap">
    <div style="display:flex;gap:16px;align-items:center">
      <label for="sq" class="eyebrow" style="white-space:nowrap">Search</label>
      <input id="sq" type="search" placeholder="Moringa, calm, digestion…" autocomplete="off">
      <button class="icon-btn" type="button" aria-label="Close search" data-search="close"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
    <div class="sres" id="sres"></div>
  </div>
</div>`;
}

function footer() {
  const c = SITE.company;
  return `<footer class="site" id="ftr">
  <div class="wrap">
    <div class="fgrid">
      <div>
        ${img('logo-light.png', 'Veda Apothecary', { cls: 'flogo' })}
        <p style="max-width:320px;margin:0;font-size:15px">Premium single-ingredient Ayurvedic powders — crafted in India, trusted across the USA. Pure, filler-free and small-batch milled.</p>
      </div>
      <div>
        <p class="fh">Shop</p>
        <ul>
          ${ORDER.map((k) => `<li><a href="${productUrl(PRODUCTS[k])}">${PRODUCTS[k].name}</a></li>`).join('\n          ')}
          <li><a href="${productUrl(SET)}">The Ritual Set</a></li>
        </ul>
      </div>
      <div>
        <p class="fh">Shop by goal</p>
        <ul>
          ${COLLECTIONS.map((x) => `<li><a href="/collections/${x.slug}/">${x.goal}</a></li>`).join('\n          ')}
          <li><a href="/shop/">All products</a></li>
        </ul>
      </div>
      <div>
        <p class="fh">Help &amp; learn</p>
        <ul>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/shipping-returns/">Shipping &amp; Returns</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/wholesale/">Wholesale &amp; Retail</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/about/">Our Story</a></li>
        </ul>
      </div>
      <div>
        <p class="fh">Visit &amp; Contact</p>
        <ul>
          <li><address style="font-style:normal">Distributed by: ${c.legalName}<br>${c.street}<br>${c.city}, ${c.region} ${c.postal}, USA<br>Product of India</address></li>
          <li>For questions, complaints or to report an adverse event, call <a href="tel:${c.phoneHref}">${c.phone}</a>.</li>
          <li><a href="mailto:${c.email}">${c.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="disclaimer">
      <div class="box">*${DISCLAIMER} Consult a healthcare professional before use, especially if pregnant, nursing, or taking medication.</div>
      <div class="fbottom"><span>© ${SITE.today.slice(0, 4)} Veda Apothecary. All rights reserved.</span><span class="flinks"><a href="/privacy-policy/">Privacy Policy</a> · <a href="/terms-of-service/">Terms of Service</a> · <a href="/shipping-returns/#returns">Refund Policy</a> · <a href="/accessibility/">Accessibility</a></span></div>
    </div>
    <div class="f-giant" aria-hidden="true"><span>V</span><span>E</span><span>D</span><span>A</span></div>
  </div>
</footer>`;
}

/**
 * Wrap a page body in the full document.
 * p: { path, title, desc, nav, body, schema, noindex, ogImage, ogType, scripts, bodyClass, hideChrome }
 */
export function layout(p) {
  const scripts = ['/assets/js/catalog.js', '/assets/js/site.js', ...(p.scripts || [])];
  return `<!doctype html>
<html lang="en">
${head(p)}
<body${p.bodyClass ? ` class="${p.bodyClass}"` : ''}>
${header(p.nav)}
<main id="main">
${p.body}
</main>
${footer()}
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-label="Shopping cart" aria-modal="true"></aside>
<div class="toast" id="toast" role="status"></div>
<div class="sticky-atc" id="satc" inert></div>
${scripts.map((s) => `<script src="${s}?v=${ASSET_V.js}" defer></script>`).join('\n')}
</body>
</html>
`;
}
