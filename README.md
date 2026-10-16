# Veda Apothecary — website

Static, multi-page, SEO/AEO-ready site for **vedaapothecaryusa.com**. The look is the approved
*Final (as approved)* combo from the Design Studio (`references/veda-apothecary-final-studio.html`):
Fresh Botanica theme, Fresh Botanica fonts, floating-pill menu, product-panels hero.

Every product, goal, article and policy has its own crawlable URL with its own title, description,
canonical, Open Graph tags and JSON-LD — no hash routes, no JavaScript needed to read the content.

## Run it

```bash
npm install
npm run build      # writes the whole site to ./dist  (35 pages)
npm run check      # SEO + compliance audit of ./dist (links, titles, schema, banned wording)
npm run serve      # preview at http://localhost:4173
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3/CloudFront, cPanel).
Build command `npm run build`, publish directory `dist`. `dist/_headers` carries cache/security
headers for Netlify and Cloudflare Pages.

## Pages (all in the sitemap unless noted)

| URL | What |
|---|---|
| `/` | Home (hero panels, pour scene, quiz, day arc, bundle, certs, blog, FAQ) |
| `/shop/` | All products |
| `/products/moringa-powder/` `…/ashwagandha-powder/` `…/triphala-powder/` `…/amla-powder/` `…/ritual-set/` | Product pages — Product, Offer, FAQPage, BreadcrumbList schema |
| `/collections/energy/` `…/calm/` `…/digestion/` `…/immunity/` | Shop-by-goal landing pages |
| `/blog/`, `/blog/category/<slug>/`, `/blog/<slug>/` | Blog hub, 4 category hubs, 9 articles (BlogPosting + FAQPage) |
| `/about/` `/faq/` `/contact/` `/wholesale/` | Brand + support pages |
| `/shipping-returns/` `/privacy-policy/` `/terms-of-service/` `/accessibility/` | Policies |
| `/cart/` | Cart (noindex, not in sitemap) |
| `/sitemap.xml` `/robots.txt` `/llms.txt` `/site.webmanifest` `/404.html` | Generated |

## Where things live

```
src/site.mjs            domain, company details, checkout URL, form endpoint, GA4 id  ← edit this first
src/data/products.mjs   products, prices, Supplement Facts, per-product copy + FAQ
src/data/blog.mjs       blog posts (add an object → new page, sitemap entry, search entry)
src/data/content.mjs    goal-page copy, FAQ hub
src/pages/*.mjs         page templates   src/layout.mjs  head/header/footer/schema
assets/css/site.css     the approved design's CSS (kept as-is)   assets/css/extra.css  additions
assets/js/*.js          cart, search, home animations, product page, forms
assets/img/             images extracted from the design file; pouch-*.webp come from the final label PDF
build.mjs               generator    scripts/check.mjs  audit    scripts/serve.mjs  preview
```

## SEO / AEO built in

- One `<h1>` per page, unique title + meta description, absolute canonical, `lang="en"`, Open Graph/Twitter
  cards with generated 1200×630 images, favicons, web manifest.
- JSON-LD: Organization + WebSite on every page; Product/Offer (with shipping + return policy), FAQPage,
  BreadcrumbList, BlogPosting, CollectionPage/ItemList where relevant.
- Answer-first copy (“What is Moringa powder?”), visible FAQs mirrored in FAQPage schema, `llms.txt`.
- Internal linking: footer, goal pages ↔ products ↔ articles, breadcrumbs, “keep reading”.
- Performance: self-hosted fonts, one minified CSS file, width/height on images, lazy loading,
  scroll animation pauses off-screen. Lighthouse (mobile, simulated): SEO 100, Best Practices 100,
  Accessibility 97–100.

## U.S. label rules the copy follows

From *Final U.S. Label Changes*: “Herbal Supplement” identity; **Supplement Facts** panels; botanical
name + plant part; Triphala as “Natural Triphala Powder (Three-Fruit Blend)”; bold FDA disclaimer with
asterisk wherever a “supports” statement appears; image note; no “chemical free”; no “FDA approved /
certified / registered”; distributor + “Product of India” + complaints line (+1 713 770 6032).
`npm run check` fails the build if the banned wording appears.

## Before going live (open items)

1. **Prices** are the prototype’s sample prices — confirm in `src/data/products.mjs` (they feed Product schema).
2. **Checkout**: set `checkoutUrl` (Shopify / Stripe Payment Link / hosted checkout) in `src/site.mjs`.
   Until then the cart sends an order-request email. **Forms** (contact, wholesale, newsletter): set `formEndpoint`
   (e.g. Formspree) or they fall back to `mailto:`.
3. **Policies** (privacy, terms, shipping & returns) are drafts — have them reviewed by counsel.
   Shipping times/rates and the 30-day return rule come from the prototype; confirm them.
4. Serving size: the pouch says “1 teaspoon (3–5 g)” in How to Use but the Supplement Facts serving is
   “2 rounded tsp (6 g)” — align the label/copy with the COA.
5. Add social profile URLs (`social` in `src/site.mjs`) and GA4 id (`ga4`) when available; submit
   `sitemap.xml` in Google Search Console.
6. Deepen the blog: each article is a solid base; longer, source-cited posts will rank better.
