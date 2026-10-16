import { SITE, DISCLAIMER, IMG_NOTE } from '../site.mjs';
import { PRODUCTS, ORDER, url as productUrl } from '../data/products.mjs';
import { FAQ_GROUPS } from '../data/content.mjs';
import { esc, plain, img, ICON, faqDetails, faqSchema, breadcrumbSchema, abs } from '../lib.mjs';
import { phead, faqSection } from '../components.mjs';
import { ABOUT_FAQ, CONTACT_FAQ, WHOLESALE_FAQ, SHIPPING_FAQ, PRIVACY_FAQ, TERMS_FAQ, ACCESSIBILITY_FAQ } from '../data/page-faqs.mjs';
import { organizationSchema } from '../layout.mjs';

const C = SITE.company;
const P = PRODUCTS;

/* ---------- Our Story ---------- */
export function aboutPage() {
  const trail = [['Home', '/'], ['Our Story', '/about/']];
  const reasons = [
    ['Single-ingredient purity', 'No additives, no fillers, no artificial colors — just one botanical, exactly as nature intended.'],
    ['Rooted in tradition', 'Botanicals drawn from generations of traditional herbal wisdom, not a modern trend.'],
    ['Certified quality', 'Packed in a GMP-certified, ISO-certified facility, batch after batch.'],
    ['Made in India, built for the USA', 'Sourced at the origin of these traditional botanicals, labeled and compliant for the American shelf.'],
    ['Small-batch freshness', 'Milled in small batches to protect potency, aroma and color — not mass-processed.'],
    ['Transparent, always', "What's on the label is what's in the bowl — real sourcing, real certifications, no shortcuts."]
  ];
  const body = `<div class="page">
  ${phead(trail, 'Wisdom you can <span class="it" style="color:var(--saffron)">stir into a glass.</span>')}
  <section style="padding-top:30px"><div class="wrap story">
    <div class="story-visual rv">${img('photo-moringa.webp', 'Moringa leaves and Moringa powder in a wooden bowl', { loading: 'eager' })}</div>
    <div><span class="eyebrow">Veda · वेद · Knowledge</span>
      <p class="quote">Veda Apothecary brings four of Ayurveda's most trusted botanicals to the American wellness routine — <em>pure, single-ingredient, and honest.</em></p>
      <p class="lead">“Veda” comes from the Sanskrit word for knowledge — a fitting name for a brand built to bring generations of traditional herbal wisdom to the modern American routine, one pure botanical at a time.</p>
      <p class="lead">Our powders are sourced at the origin of these traditional botanicals in India, milled in small batches to protect potency, aroma and color, and packed in a GMP-certified, ISO-certified facility. Every pouch is labeled for the American shelf.</p>
      <p class="lead">No additives. No fillers. Nothing artificial. Just one botanical, exactly as nature intended.</p>
    </div></div></section>
  <section style="padding-top:20px"><div class="wrap">
    <div class="sec-head center"><span class="eyebrow">Our promise</span><h2 class="h-sec">Six reasons <span class="it">wellness starts here</span></h2></div>
    <div class="why-grid">${reasons.map((r, i) => `<div class="rv"><span class="eyebrow">0${i + 1}</span><h3>${r[0]}</h3><p>${r[1]}</p></div>`).join('')}</div>
  </div></section>
  <section style="padding-top:30px"><div class="wrap">
    <div class="sec-head center"><span class="eyebrow">Product specifications</span><h2 class="h-sec">The collection <span class="it">at a glance</span></h2></div>
    <div class="spec-wrap"><table class="spec"><thead><tr><th scope="col">Product</th><th scope="col">Botanical name</th><th scope="col">Net content</th><th scope="col">Origin</th><th scope="col">Market</th></tr></thead><tbody>
      ${ORDER.map((k) => `<tr><td><a href="${productUrl(P[k])}" style="font-family:var(--serif);font-size:18px">${P[k].ident}</a></td><td><i>${P[k].latin}</i></td><td>8 oz (227 g)</td><td>India</td><td>United States</td></tr>`).join('')}
    </tbody></table></div>
    <p style="font-size:13px;color:var(--muted);margin-top:16px">Distributed by: ${C.legalName}, ${C.street}, ${C.city}, ${C.region} ${C.postal}, USA · Manufactured in India by Merrals Overseas Private Limited, Delhi · Product of India · For questions, complaints or to report an adverse event, call ${C.phone}.</p>
    <p class="disc-inline" style="margin-top:20px"><b>*${DISCLAIMER}</b> ${IMG_NOTE}</p>
  </div></section>
  ${faqSection(ABOUT_FAQ, { title: 'About Veda <span class="it">FAQ</span>' })}
  <section style="padding-top:20px"><div class="wrap center-cta"><h2 class="h-sec">Begin your <span class="it" style="color:var(--saffron)">ritual.</span></h2><div class="hero-ctas" style="justify-content:center"><a class="btn" href="/shop/">Shop the collection</a><a class="btn ghost" href="/blog/what-is-ayurveda/">New to Ayurveda?</a></div></div></section>
  </div>`;
  return {
    path: '/about/', title: 'Our Story — Pure Ayurvedic Botanicals from India | Veda Apothecary',
    desc: 'Veda means knowledge. Veda Apothecary brings four trusted Ayurvedic botanicals to the USA as pure single-ingredient powders, small-batch milled in India.',
    nav: 'about', body, priority: 0.7,
    schema: [{ '@type': 'AboutPage', name: 'Our Story — Veda Apothecary', url: abs('/about/'), about: { '@id': SITE.domain + '/#organization' } }, faqSchema(ABOUT_FAQ), breadcrumbSchema(trail)]
  };
}

/* ---------- Contact + Wholesale ---------- */
const formFields = (W) => `<div class="fgrid2">
        <div class="field"><input id="n1" name="name" placeholder=" " required autocomplete="name"><label for="n1">Full name</label></div>
        <div class="field"><input id="n2" name="email" type="email" placeholder=" " required autocomplete="email"><label for="n2">Email</label></div>
        ${W ? `<div class="field"><input id="n3" name="business" placeholder=" " required><label for="n3">Store / business name</label></div><div class="field"><input id="n4" name="location" placeholder=" "><label for="n4">City, State</label></div>
        <div class="field full"><select id="n5" name="type"><option>Independent wellness store</option><option>Grocery / natural foods</option><option>Spa / practitioner</option><option>Online retailer</option><option>Distributor</option></select><label for="n5">Business type</label></div>`
          : `<div class="field full"><select id="n5" name="topic"><option>Order question</option><option>Product question</option><option>Subscription</option><option>Returns</option><option>Other</option></select><label for="n5">Topic</label></div>`}
        <div class="field full"><textarea id="n6" name="message" placeholder=" " required></textarea><label for="n6">${W ? 'Which products & estimated monthly volume?' : 'Your message'}</label></div>
      </div>
      <button class="btn block" type="submit" style="margin-top:16px">${W ? 'Request wholesale pricing' : 'Send message'}</button>
      <p class="form-note" data-form-note aria-live="polite"></p>`;

export function contactPage() {
  const trail = [['Home', '/'], ['Contact', '/contact/']];
  const body = `<div class="page">
  ${phead(trail, `We'd love to <span class="it" style="color:var(--saffron)">hear from you</span>`)}
  <section style="padding-top:30px"><div class="wrap two">
    <div>
      <p class="lead">Questions about an order, a product, or how to use our powders? Send us a note — we reply within one business day.</p>
      <div class="info-list">
        <div><span class="ic">${ICON.mail}</span><div><b>Email</b><a href="mailto:${C.email}">${C.email}</a></div></div>
        <div><span class="ic">${ICON.phone}</span><div><b>Questions, complaints &amp; adverse events</b><a href="tel:${C.phoneHref}">Call ${C.phone}</a></div></div>
        <div><span class="ic">${ICON.pin}</span><div><b>US office</b><span>${C.legalName}, ${C.street}, ${C.city}, ${C.region} ${C.postal}</span></div></div>
        <div><span class="ic">${ICON.clock}</span><div><b>Hours</b><span>${C.hours}</span></div></div>
      </div>
      <p style="margin-top:24px">Looking for quick answers? Read the <a href="/faq/" style="text-decoration:underline">FAQ</a> or see <a href="/shipping-returns/" style="text-decoration:underline">Shipping &amp; Returns</a>.</p>
    </div>
    <form class="card" data-form="contact" novalidate>
      ${formFields(false)}
    </form>
  </div></section>
  ${faqSection(CONTACT_FAQ, { title: 'Contact <span class="it">FAQ</span>' })}
  </div>`;
  return {
    path: '/contact/', title: 'Contact Veda Apothecary — Questions, Orders & Support',
    desc: 'Contact Veda Apothecary in Katy, Texas. Questions about an order, a product or how to use our Ayurvedic powders — we reply within one business day.',
    nav: '', body, priority: 0.6, scripts: ['/assets/js/forms.js'],
    schema: [{ '@type': 'ContactPage', name: 'Contact Veda Apothecary', url: abs('/contact/'), about: { '@id': SITE.domain + '/#organization' } }, faqSchema(CONTACT_FAQ), breadcrumbSchema(trail)]
  };
}

export function wholesalePage() {
  const trail = [['Home', '/'], ['Wholesale', '/wholesale/']];
  const body = `<div class="page">
  ${phead(trail, `Stock <span class="it" style="color:var(--saffron)">Veda Apothecary</span>`)}
  <section style="padding-top:30px"><div class="wrap two">
    <div>
      <p class="lead">Retail-ready, store-ready packaging for wellness stores, grocers, spas and practitioners across the USA. Tell us about your store and we'll send our wholesale price list and terms.</p>
      <div class="info-list">
        <div><span class="ic">${ICON.mail}</span><div><b>Email</b><a href="mailto:${C.wholesaleEmail}">${C.wholesaleEmail}</a></div></div>
        <div><span class="ic">${ICON.box}</span><div><b>Retail-ready</b><span>8 oz (227 g) resealable pouches with barcodes and Supplement Facts panels</span></div></div>
        <div><span class="ic">${ICON.phone}</span><div><b>Questions, complaints &amp; adverse events</b><a href="tel:${C.phoneHref}">Call ${C.phone}</a></div></div>
        <div><span class="ic">${ICON.pin}</span><div><b>US office</b><span>${C.legalName}, ${C.street}, ${C.city}, ${C.region} ${C.postal}</span></div></div>
      </div>
      <h2 class="h-sub" style="margin-top:34px">The wholesale range</h2>
      <ul class="ways">${ORDER.map((k) => `<li><b><a href="${productUrl(P[k])}">${P[k].ident}</a></b><span><i>${P[k].latin}</i> · 8 oz (227 g) · Product of India</span></li>`).join('')}</ul>
    </div>
    <form class="card" data-form="wholesale" novalidate>
      ${formFields(true)}
    </form>
  </div></section>
  ${faqSection(WHOLESALE_FAQ, { title: 'Wholesale <span class="it">FAQ</span>' })}
  </div>`;
  return {
    path: '/wholesale/', title: 'Wholesale Ayurvedic Powders for Retailers | Veda Apothecary',
    desc: 'Stock retail-ready Moringa, Ashwagandha, Triphala and Amla powders from Veda Apothecary — 8 oz pouches with barcodes for US wellness stores, grocers and spas.',
    nav: 'wholesale', body, priority: 0.6, scripts: ['/assets/js/forms.js'],
    schema: [{ '@type': 'WebPage', name: 'Wholesale — Veda Apothecary', url: abs('/wholesale/') }, faqSchema(WHOLESALE_FAQ), breadcrumbSchema(trail)]
  };
}

/* ---------- FAQ hub ---------- */
export function faqPage() {
  const trail = [['Home', '/'], ['FAQ', '/faq/']];
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  const body = `<div class="page">
  ${phead(trail, 'Frequently asked <span class="it" style="color:var(--saffron)">questions</span>', 'Everything about our Ayurvedic powders, labeling, shipping and returns.')}
  <section style="padding-top:30px"><div class="wrap narrow">
    ${FAQ_GROUPS.map((g, gi) => `<h2 class="h-sub" id="${plain(g.title).toLowerCase().replace(/[^a-z]+/g, '-')}">${g.title}</h2><div class="acc">${faqDetails(g.items, { open: gi === 0 ? 0 : -1 })}</div>`).join('')}
    <p style="margin-top:36px">Still have a question? <a href="/contact/" style="text-decoration:underline">Contact us</a> — we reply within one business day.</p>
    <p class="disc-inline"><b>*${DISCLAIMER}</b></p>
  </div></section>
  </div>`;
  return {
    path: '/faq/', title: 'FAQ — Ayurvedic Powders, Shipping & Returns | Veda Apothecary',
    desc: 'Answers about Veda Apothecary Moringa, Ashwagandha, Triphala and Amla powders: how to use them, ingredients, labeling, shipping, returns and wholesale.',
    nav: '', body, priority: 0.6,
    schema: [{ '@type': 'WebPage', name: 'FAQ — Veda Apothecary', url: abs('/faq/') }, faqSchema(all), breadcrumbSchema(trail)]
  };
}

/* ---------- Policies ---------- */
const UPDATED = 'October 16, 2026';
function policy({ path, title, h1, desc, sections, faq, nav = '' }) {
  const trail = [['Home', '/'], [plain(h1), path]];
  const body = `<div class="page">
  ${phead(trail, h1)}
  <section style="padding-top:30px"><div class="wrap narrow prose">
    <p class="meta">Last updated: ${UPDATED}</p>
    ${sections.map((s) => `<h2${s.id ? ` id="${s.id}"` : ''}>${s.h}</h2>${s.p.map((t) => (t.startsWith('<ul') ? t : `<p>${t}</p>`)).join('')}`).join('')}
  </div></section>
  ${faqSection(faq, { title: `${plain(h1).split(' ')[0]} <span class="it">FAQ</span>` })}
  </div>`;
  return { path, title, desc, nav, body, priority: 0.3, schema: [{ '@type': 'WebPage', name: plain(h1), url: abs(path) }, faqSchema(faq), breadcrumbSchema(trail)] };
}

const contactLine = `Contact us at <a href="mailto:${C.email}">${C.email}</a> or ${C.phone}. ${C.legalName}, ${C.street}, ${C.city}, ${C.region} ${C.postal}, USA.`;

export const shippingReturnsPage = () => policy({
  faq: SHIPPING_FAQ, path: '/shipping-returns/', title: 'Shipping & Returns | Veda Apothecary', h1: 'Shipping &amp; <span class="it" style="color:var(--saffron)">returns</span>',
  desc: 'Veda Apothecary shipping rates and times (free US shipping over $50) and our 30-day return policy for unopened products.',
  sections: [
    { id: 'shipping', h: 'Shipping', p: [
      `We ship across the United States from Katy, Texas. Orders ship within 1–2 business days.`,
      `<ul><li><b>Standard shipping</b> — 3–6 business days. Free on orders over $${SITE.freeShippingOver}; otherwise $5.95.</li><li><b>Express shipping</b> — 1–3 business days. $12.95.</li></ul>`,
      'You will receive a tracking number by email when your order ships. Delivery times are estimates and begin once your order has shipped.'] },
    { id: 'returns', h: 'Returns &amp; refunds', p: [
      'Unopened products can be returned within 30 days of delivery for a refund of the purchase price. Because our products are ingestible, we cannot accept returns of opened pouches unless they arrived damaged or defective.',
      `To start a return, email <a href="mailto:${C.email}">${C.email}</a> with your order number. Return shipping is the customer’s responsibility unless the item arrived damaged or incorrect. Refunds are issued to the original payment method once we receive and inspect the return.`] },
    { h: 'Damaged or incorrect items', p: ['If your order arrives damaged or you received the wrong item, contact us right away with your order number and a photo and we will make it right.'] },
    { h: 'Subscriptions', p: ['Subscribe &amp; Save orders can be skipped, paused or cancelled at any time before the next shipment by contacting us.'] },
    { h: 'Questions', p: [contactLine] }
  ]
});

export const privacyPage = () => policy({
  faq: PRIVACY_FAQ, path: '/privacy-policy/', title: 'Privacy Policy | Veda Apothecary', h1: 'Privacy <span class="it" style="color:var(--saffron)">policy</span>',
  desc: 'How Veda Apothecary collects, uses and protects your personal information.',
  sections: [
    { h: 'Who we are', p: [`This website is operated by ${C.legalName} (“Veda Apothecary”, “we”, “us”), ${C.street}, ${C.city}, ${C.region} ${C.postal}, USA.`] },
    { h: 'Information we collect', p: ['<ul><li><b>Information you give us</b> — name, email, shipping and billing address, phone number, and the contents of messages or forms you submit.</li><li><b>Order information</b> — products purchased, order totals and delivery details. Card details are handled by our payment processor; we do not store full card numbers.</li><li><b>Usage information</b> — pages viewed, device and browser type, approximate location and referring pages, collected through cookies and similar technologies.</li></ul>'] },
    { h: 'How we use information', p: ['We use your information to process and deliver orders, respond to questions, send order updates, send marketing emails you have asked for, improve our website and products, prevent fraud, and meet legal obligations.'] },
    { h: 'Sharing', p: ['We share information only with service providers who help us run the business — such as payment processors, shipping carriers, email and analytics providers — and when required by law. We do not sell your personal information for money.'] },
    { h: 'Cookies &amp; analytics', p: ['We use cookies to remember your cart and, where enabled, to understand how the site is used. You can control cookies in your browser settings.'] },
    { h: 'Your choices &amp; rights', p: ['You can unsubscribe from marketing emails at any time using the link in each email. Depending on where you live (for example California and other US states), you may have the right to request access to, correction of, or deletion of your personal information. To make a request, contact us using the details below.'] },
    { h: 'Children', p: ['Our website is not directed to children under 13 and we do not knowingly collect their personal information.'] },
    { h: 'Security &amp; retention', p: ['We use reasonable safeguards to protect personal information and keep it only as long as needed for the purposes described above or as required by law.'] },
    { h: 'Changes', p: ['We may update this policy from time to time. The “last updated” date above shows when it last changed.'] },
    { h: 'Contact', p: [contactLine] }
  ]
});

export const termsPage = () => policy({
  faq: TERMS_FAQ, path: '/terms-of-service/', title: 'Terms of Service | Veda Apothecary', h1: 'Terms of <span class="it" style="color:var(--saffron)">service</span>',
  desc: 'The terms that apply when you use the Veda Apothecary website and purchase our products.',
  sections: [
    { h: 'Using this website', p: [`By using this website you agree to these terms. The site is operated by ${C.legalName}. If you do not agree, please do not use the site.`] },
    { h: 'Health information', p: [`*${DISCLAIMER}`, 'Content on this website is for general information only and is not medical advice. Consult a healthcare professional before use, especially if you are pregnant, nursing, or taking medication. Keep out of reach of children.', IMG_NOTE] },
    { h: 'Orders &amp; pricing', p: ['All orders are subject to acceptance and availability. Prices are in US dollars and may change without notice. We may refuse or cancel an order, for example because of a pricing error or suspected fraud, and will refund any amount charged.'] },
    { h: 'Shipping &amp; returns', p: ['See our <a href="/shipping-returns/">Shipping &amp; Returns</a> page, which forms part of these terms.'] },
    { h: 'Intellectual property', p: ['All text, images, logos and designs on this site belong to Veda Apothecary or its licensors and may not be copied or used without permission.'] },
    { h: 'Disclaimer &amp; limitation of liability', p: ['The website and products are provided “as is” to the fullest extent permitted by law. To that extent, we are not liable for indirect or consequential losses arising from your use of the site or products. Nothing in these terms limits liability that cannot be limited by law.'] },
    { h: 'Governing law', p: ['These terms are governed by the laws of the State of Texas, USA.'] },
    { h: 'Contact', p: [contactLine] }
  ]
});

export const accessibilityPage = () => policy({
  faq: ACCESSIBILITY_FAQ, path: '/accessibility/', title: 'Accessibility Statement | Veda Apothecary', h1: 'Accessibility <span class="it" style="color:var(--saffron)">statement</span>',
  desc: 'Veda Apothecary is committed to making its website accessible to everyone.',
  sections: [
    { h: 'Our commitment', p: ['We want everyone to be able to use the Veda Apothecary website. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, using semantic page structure, descriptive links and image text, keyboard-friendly controls and sufficient color contrast.'] },
    { h: 'Feedback', p: [`If you have trouble using any part of the site, or need information in another format, please tell us. ${contactLine} We will do our best to respond within two business days.`] }
  ]
});

/* ---------- Cart + 404 ---------- */
export function cartPage() {
  const trail = [['Home', '/'], ['Cart', '/cart/']];
  const body = `<div class="page">
  ${phead(trail, 'Your <span class="it" style="color:var(--saffron)">cart</span>')}
  <section style="padding-top:20px"><div class="wrap" style="max-width:900px"><div id="cartPage"><noscript><p class="lead">Please enable JavaScript to use the cart, or <a href="/contact/">contact us</a> to place an order.</p></noscript></div></div></section>
  </div>`;
  return { path: '/cart/', title: 'Your Cart | Veda Apothecary', desc: 'Review your Veda Apothecary cart.', nav: '', body, noindex: true, skipSitemap: true, scripts: ['/assets/js/cart-page.js'], schema: [] };
}

export function notFoundPage() {
  const body = `<div class="page"><section><div class="wrap empty"><h1 class="h-display">Page not found</h1><p class="lead" style="margin:16px auto 30px">Let's get you back to the ritual.</p><div class="hero-ctas" style="justify-content:center"><a class="btn" href="/">Go home</a><a class="btn ghost" href="/shop/">Shop the collection</a></div></div></section></div>`;
  return { path: '/404.html', file: '404.html', title: 'Page not found | Veda Apothecary', desc: 'This page could not be found.', nav: '', body, noindex: true, skipSitemap: true, schema: [] };
}
