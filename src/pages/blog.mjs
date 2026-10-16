import { SITE, DISCLAIMER } from '../site.mjs';
import { PRODUCTS, url as productUrl } from '../data/products.mjs';
import { BLOG, BCATS, REF, blogUrl, catUrl } from '../data/blog.mjs';
import { esc, plain, img, ICON, faqSchema, breadcrumbSchema, crumbs, abs, money } from '../lib.mjs';
import { blogCard, blogArt, faqSection } from '../components.mjs';
import { BLOG_FAQ, BLOG_CAT_FAQ } from '../data/page-faqs.mjs';

const pills = (active) => `<nav class="bl-pills" aria-label="Filter by category">${[['All categories', '/blog/'], ...BCATS.map((c) => [c, catUrl(c)])].map((c) => `<a class="${c[1] === active ? 'on' : ''}" href="${c[1]}"${c[1] === active ? ' aria-current="page"' : ''}>${c[0]}</a>`).join('')}</nav>`;

const CAT_INTRO = {
  'Ayurveda Basics': 'Start here: simple, plain-language introductions to Ayurveda, daily routines and how herbs fit into everyday life.',
  Botanicals: 'Meet the botanicals behind our powders — Moringa, Ashwagandha, Triphala and Amla — where they come from and how they are traditionally used.',
  'Rituals & Recipes': 'Easy recipes and small daily rituals that bring Ayurvedic powders into your kitchen.',
  'Sourcing & Quality': 'How our pouches are sourced, milled, labeled and shipped — and how to read a supplement label with confidence.'
};

export function blogIndex() {
  const trail = [['Home', '/'], ['Blog', '/blog/']];
  const body = `<div class="page bl-page"><section class="bl-hero"><div class="wrap">
    ${crumbs(trail)}
    <span class="eyebrow" style="color:#CFE0C9">Veda Apothecary blog</span>
    <h1>Your guide to everyday Ayurveda</h1>
    <p class="bl-lead">Plain-language guides to Ayurvedic botanicals, simple rituals and recipes, and how our powders are made.</p>
    ${pills('/blog/')}
    <div class="bgrid">${BLOG.map(blogCard).join('')}</div>
  </div></section>${faqSection(BLOG_FAQ, { title: 'Blog <span class="it">FAQ</span>' })}</div>`;
  return {
    path: '/blog/', title: 'Ayurveda Blog — Guides, Botanicals & Recipes | Veda Apothecary',
    desc: 'Plain-language guides to Ayurveda, Moringa, Ashwagandha, Triphala and Amla, plus easy recipes and how to read a supplement label. From the Veda Apothecary team.',
    nav: 'blog', body, priority: 0.8,
    schema: [{ '@type': 'Blog', '@id': abs('/blog/') + '#blog', name: 'Veda Apothecary Blog', url: abs('/blog/'), publisher: { '@id': SITE.domain + '/#organization' }, blogPost: BLOG.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(blogUrl(p)), datePublished: p.iso })) }, faqSchema(BLOG_FAQ), breadcrumbSchema(trail)]
  };
}

export function blogCategory(cat) {
  const list = BLOG.filter((p) => p.cat === cat);
  const here = catUrl(cat);
  const trail = [['Home', '/'], ['Blog', '/blog/'], [cat, here]];
  const body = `<div class="page bl-page"><section class="bl-hero"><div class="wrap">
    ${crumbs(trail)}
    <span class="eyebrow" style="color:#CFE0C9">Veda Apothecary blog</span>
    <h1>${cat}</h1>
    <p class="bl-lead">${CAT_INTRO[cat]}</p>
    ${pills(here)}
    <div class="bgrid">${list.map(blogCard).join('')}</div>
  </div></section>${faqSection(BLOG_CAT_FAQ[cat], { title: `${cat.replace(/&/g, '&amp;')} <span class="it">FAQ</span>` })}</div>`;
  return {
    path: here, title: `${cat} — Ayurveda Blog | Veda Apothecary`, desc: CAT_INTRO[cat], nav: 'blog', body, priority: 0.5,
    schema: [{ '@type': 'CollectionPage', name: `${cat} — Veda Apothecary Blog`, url: abs(here), isPartOf: { '@id': abs('/blog/') + '#blog' } }, faqSchema(BLOG_CAT_FAQ[cat]), breadcrumbSchema(trail)]
  };
}

function metaDesc(p) {
  let d = plain(p.dek);
  if (d.length >= 110) return d;
  const extra = plain(p.intro[0]);
  d = `${d} ${extra}`;
  if (d.length <= 160) return d;
  const cut = d.slice(0, 157); return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

export function blogPost(p) {
  const prod = PRODUCTS[p.k];
  const here = blogUrl(p);
  const trail = [['Home', '/'], ['Blog', '/blog/'], [p.cat, catUrl(p.cat)], [plain(p.title), here]];
  const toc = [['highlights', 'Highlights'], ...p.sec.map((s, i) => ['s' + i, s[0]]), ...(p.table ? [['glance', 'At a glance']] : []), ...(p.faq.length ? [['faq', 'Frequently asked questions']] : []), ...(p.refs.length ? [['refs', 'References']] : [])];
  const u = encodeURIComponent(abs(here)), tt = encodeURIComponent(plain(p.title));
  const more = BLOG.filter((x) => x.slug !== p.slug && x.cat === p.cat).concat(BLOG.filter((x) => x.slug !== p.slug && x.cat !== p.cat)).slice(0, 3);
  const body = `<div class="page bl-art">
  <header class="ba-head"><div class="wrap">
    ${crumbs(trail)}
    <div class="bc-meta" style="justify-content:center"><span>${ICON.book}${p.cat.toUpperCase()}</span><i></i><span>${p.min} MIN READ</span></div>
    <h1>${p.title}</h1><p class="dek">${p.dek}</p>
    <div class="ba-author">${img('mark.png', '', { loading: 'eager' })}<span><b>Written by Team Veda</b><time datetime="${p.iso}">${p.date}</time></span></div>
    <div class="ba-hero">${blogArt(p).replace('loading="lazy"', 'loading="eager"')}</div>
  </div></header>
  <div class="wrap ba-grid">
    <aside class="ba-side"><nav class="ba-toc" aria-label="Table of contents"><span class="lbl">Table of contents</span>${toc.map((t) => `<a href="#${t[0]}" data-t="${t[0]}">${t[1]}</a>`).join('')}</nav>
      <span class="lbl" style="margin-top:28px;display:block">Share it on</span>
      <div class="ba-share"><a aria-label="Share on LinkedIn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${u}">in</a><a aria-label="Share on X" target="_blank" rel="noopener" href="https://x.com/intent/tweet?url=${u}&amp;text=${tt}">X</a><a aria-label="Share on Facebook" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${u}">f</a><a aria-label="Share on WhatsApp" target="_blank" rel="noopener" href="https://wa.me/?text=${tt}%20${u}">wa</a></div></aside>
    <article class="ba-body">
      ${p.intro.map((t) => `<p>${t}</p>`).join('')}
      <h2 id="highlights">Highlights</h2><ul class="ba-hl">${p.hl.map((t) => `<li>${t}</li>`).join('')}</ul>
      ${p.sec.map((s, i) => `<h2 id="s${i}">${s[0]}</h2><p>${s[1]}</p>`).join('')}
      ${p.table ? `<h2 id="glance">At a glance</h2><div class="ba-table"><table><thead><tr>${p.table.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${p.table.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
      <div class="art-prod">${img(`pouch-${p.k}.webp`, `${prod.name} pouch`)}<div><span class="jr-meta">Featured in this article</span><h3>${prod.name}</h3><p>${prod.summary}</p><div class="hero-ctas"><button class="btn sm" type="button" data-add="${p.k}">Add — ${money(prod.price)}</button><a class="btn ghost sm" href="${productUrl(prod)}">View product</a></div></div></div>
      ${p.faq.length ? `<h2 id="faq">Frequently asked questions</h2>${p.faq.map((f) => `<details class="ba-faq"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}` : ''}
      ${p.refs.length ? `<h2 id="refs">References</h2><ol class="ba-refs">${p.refs.map((r) => `<li><a href="${REF[r].u}" target="_blank" rel="noopener">${REF[r].t}</a></li>`).join('')}</ol>` : ''}
      <p class="disc-inline">*${DISCLAIMER} This article is for general information only and is not medical advice. Consult a healthcare professional before use, especially if pregnant, nursing, or taking medication.</p>
    </article>
  </div>
  <section class="bl-home" style="margin-top:60px"><div class="wrap"><div class="sec-head"><h2 class="h-sec" style="color:#F3EEDF">Keep reading</h2><a class="btn" style="background:#F3EEDF;color:#14291D;border-color:#F3EEDF" href="/blog/">All articles</a></div><div class="bgrid">${more.map(blogCard).join('')}</div></div></section>
  </div>`;

  const words = plain([...p.intro, ...p.hl, ...p.sec.flat(), ...p.faq.flat()].join(' ')).split(' ').length;
  const post = {
    '@type': 'BlogPosting', '@id': abs(here) + '#article', mainEntityOfPage: { '@type': 'WebPage', '@id': abs(here) }, headline: plain(p.title), description: plain(p.dek),
    image: [abs(`/assets/img/og-${p.k}.jpg`)], datePublished: p.iso, dateModified: p.iso, articleSection: p.cat, wordCount: words, inLanguage: 'en-US',
    author: { '@type': 'Organization', name: 'Team Veda', url: SITE.domain + '/about/' }, publisher: { '@id': SITE.domain + '/#organization' },
    about: { '@type': 'Product', name: prod.name, url: abs(productUrl(prod)) }
  };
  return {
    path: here, title: `${plain(p.title)} | Veda Apothecary`, desc: metaDesc(p), nav: 'blog', body, priority: 0.7, ogType: 'article',
    ogImage: `/assets/img/og-${p.k}.jpg`, published: p.iso, modified: p.iso, scripts: ['/assets/js/article.js'], lastmod: p.iso,
    schema: [post, ...(p.faq.length ? [faqSchema(p.faq)] : []), breadcrumbSchema(trail)]
  };
}
