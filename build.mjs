// Static site generator: `npm run build` writes the complete, crawlable site to ./dist
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { transform } from 'esbuild';
import { SITE } from './src/site.mjs';
import { ROOT, abs, plain } from './src/lib.mjs';
import { PRODUCTS, ORDER, SET, LISTING, SINGLE_SUM, url as productUrl } from './src/data/products.mjs';
import { BLOG, BCATS, blogUrl, catUrl } from './src/data/blog.mjs';
import { COLLECTIONS } from './src/data/content.mjs';
import { layout, ASSET_V } from './src/layout.mjs';
import { homePage } from './src/pages/home.mjs';
import { shopPage, collectionPage, productPage } from './src/pages/shop.mjs';
import { blogIndex, blogCategory, blogPost } from './src/pages/blog.mjs';
import { aboutPage, contactPage, wholesalePage, faqPage, shippingReturnsPage, privacyPage, termsPage, accessibilityPage, cartPage, notFoundPage } from './src/pages/info.mjs';

const DIST = path.join(ROOT, 'dist');
const write = (rel, data) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
const copyDir = (from, to, skip = () => false) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b, skip) : fs.copyFileSync(a, b);
  }
};
const hashDir = (dir) => { const h = crypto.createHash('md5'); fs.readdirSync(dir).sort().forEach((f) => h.update(fs.readFileSync(path.join(dir, f)))); return h.digest('hex').slice(0, 8); };

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/* ---------- 1. generated images: OG cards + favicons ---------- */
const imgP = (n) => path.join(ROOT, 'assets/img', n);
async function ogCard(file, bg, pouches) {
  const W = 1200, H = 630;
  const layers = [];
  const logo = await sharp(imgP('logo.png')).resize({ width: 200 }).toBuffer();
  layers.push({ input: logo, left: 56, top: 40 });
  if (pouches.length === 1) {
    const pk = await sharp(imgP(`pouch-${pouches[0]}.webp`)).resize({ height: 540 }).png().toBuffer();
    const pm = await sharp(pk).metadata();
    layers.push({ input: pk, left: W - pm.width - 90, top: 45 });
    const bowl = await sharp(imgP(`bowl-${pouches[0]}.webp`)).resize({ width: 560 }).png().toBuffer();
    const bm = await sharp(bowl).metadata();
    layers.push({ input: bowl, left: 70, top: H - bm.height - 50 });
  } else {
    let x = 70;
    for (const k of pouches) {
      const pk = await sharp(imgP(`pouch-${k}.webp`)).resize({ height: 400 }).png().toBuffer();
      const pm = await sharp(pk).metadata();
      layers.push({ input: pk, left: x, top: 200 });
      x += pm.width + 36;
    }
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } }).composite(layers).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(DIST, 'assets/img', file));
}
fs.mkdirSync(path.join(DIST, 'assets/img'), { recursive: true });
copyDir(path.join(ROOT, 'assets/img'), path.join(DIST, 'assets/img'), (n) => n === 'manifest.json');
await ogCard('og-default.jpg', '#FFF8EE', ORDER);
for (const k of ORDER) await ogCard(`og-${k}.jpg`, PRODUCTS[k].tint, [k]);
await ogCard('og-ritual-set.jpg', '#F6E3DF', ORDER);

{
  const mark = sharp(imgP('mark.png'));
  const sq = (n, bg) => sharp(imgP('mark.png')).resize({ width: Math.round(n * 0.84), height: Math.round(n * 0.84), fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).extend({ top: Math.round(n * 0.08), bottom: Math.round(n * 0.08), left: Math.round(n * 0.08), right: Math.round(n * 0.08), background: bg }).resize(n, n);
  const T = { r: 0, g: 0, b: 0, alpha: 0 }, W = { r: 255, g: 255, b: 255, alpha: 1 };
  await sq(32, T).png().toFile(path.join(DIST, 'assets/img/favicon-32.png'));
  await sq(180, W).flatten({ background: '#ffffff' }).png().toFile(path.join(DIST, 'assets/img/apple-touch-icon.png'));
  await sq(192, W).flatten({ background: '#ffffff' }).png().toFile(path.join(DIST, 'assets/img/icon-192.png'));
  await sq(512, W).flatten({ background: '#ffffff' }).png().toFile(path.join(DIST, 'assets/img/icon-512.png'));
  const png48 = await sq(48, T).png().toBuffer();
  const ico = Buffer.alloc(22); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4); ico[6] = 48; ico[7] = 48; ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png48.length, 14); ico.writeUInt32LE(22, 18);
  write('favicon.ico', Buffer.concat([ico, png48]));
}

/* ---------- 2. client data (catalog.js, search index) ---------- */
const catalog = {
  config: { checkoutUrl: SITE.checkoutUrl, orderEmail: SITE.orderEmail, formEndpoint: SITE.formEndpoint, wholesaleEmail: SITE.company.wholesaleEmail, freeShip: SITE.freeShippingOver, subOff: SITE.subscribeDiscount, ga4: SITE.ga4 },
  order: ORDER,
  products: Object.fromEntries([...ORDER.map((k) => PRODUCTS[k]), SET].map((p) => [p.id, { id: p.id, name: p.name, short: p.short, price: p.price, compare: p.compare || 0, url: productUrl(p), img: p.bundle ? '/assets/img/pouch-moringa.webp' : `/assets/img/pouch-${p.id}.webp`, bowl: `/assets/img/bowl-${p.id === 'ritual-set' ? 'triphala' : p.id}.webp`, base: `/assets/img/bowl-base-${p.id === 'ritual-set' ? 'triphala' : p.id}.webp`, pack: `/assets/img/pouch-${p.id === 'ritual-set' ? 'moringa' : p.id}.webp`, tags: p.tags, latin: p.latin, goal: p.goal, short_txt: p.summary, use: p.use, part: p.part || '', servings: p.servings || '', bundle: !!p.bundle, viv: p.viv, benefit: p.benefit }])),
  search: [
    ...[...ORDER.map((k) => PRODUCTS[k]), SET].map((p) => ({ t: p.name, u: productUrl(p), k: [p.name, p.tags, p.latin, p.benefit, p.summary].join(' ').toLowerCase(), img: p.bundle ? '/assets/img/pouch-moringa.webp' : `/assets/img/pouch-${p.id}.webp`, s: money(p.price) })),
    ...COLLECTIONS.map((c) => ({ t: `${c.goal} — Ayurvedic powders`, u: `/collections/${c.slug}/`, k: `${c.goal} ${PRODUCTS[c.product].name}`.toLowerCase(), s: 'Shop by goal' })),
    ...BLOG.map((b) => ({ t: plain(b.title), u: blogUrl(b), k: (plain(b.title) + ' ' + plain(b.dek) + ' ' + b.cat).toLowerCase(), s: 'Blog · ' + b.cat }))
  ]
};
function money(n) { return '$' + n.toFixed(2); }

/* ---------- 3. static assets with content hashes ---------- */
fs.mkdirSync(path.join(DIST, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets/js'), { recursive: true });
// one minified stylesheet (fonts + approved design + additions) and minified scripts
const cssSrc = ['fonts.css', 'site.css', 'extra.css'].map((f) => fs.readFileSync(path.join(ROOT, 'assets/css', f), 'utf8')).join('\n');
write('assets/css/site.css', (await transform(cssSrc, { loader: 'css', minify: true })).code);
for (const f of fs.readdirSync(path.join(ROOT, 'assets/js'))) write('assets/js/' + f, (await transform(fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'), { loader: 'js', minify: true, target: 'es2019' })).code);
copyDir(path.join(ROOT, 'assets/fonts'), path.join(DIST, 'assets/fonts'));
write('assets/js/catalog.js', `/* generated by build.mjs */\nwindow.VEDA=${JSON.stringify(catalog)};\n`);
ASSET_V.css = hashDir(path.join(DIST, 'assets/css'));
ASSET_V.js = hashDir(path.join(DIST, 'assets/js'));

/* ---------- 4. pages ---------- */
const pages = [
  homePage(), shopPage(), ...COLLECTIONS.map(collectionPage), ...LISTING.map(productPage),
  blogIndex(), ...BCATS.map(blogCategory), ...BLOG.map(blogPost),
  aboutPage(), faqPage(), contactPage(), wholesalePage(), shippingReturnsPage(), privacyPage(), termsPage(), accessibilityPage(), cartPage(), notFoundPage()
];
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error('duplicate path ' + p.path); seen.add(p.path);
  const file = p.file || (p.path === '/' ? 'index.html' : p.path.replace(/^\//, '') + 'index.html');
  write(file, layout(p));
}

/* ---------- 5. sitemap, robots, llms.txt, manifest, headers ---------- */
const today = SITE.today;
const sm = pages.filter((p) => !p.noindex && !p.skipSitemap).map((p) => `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${p.lastmod || today}</lastmod>\n    <priority>${(p.priority ?? 0.5).toFixed(1)}</priority>\n  </url>`).join('\n');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /cart/\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
write('site.webmanifest', JSON.stringify({ name: SITE.name, short_name: 'Veda', start_url: '/', display: 'standalone', background_color: '#FFF8EE', theme_color: SITE.themeColor, icons: [{ src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2));
write('llms.txt', `# ${SITE.name}

> ${SITE.description}

${SITE.name} (vedaapothecaryusa.com) sells pure, single-ingredient Ayurvedic herbal powders in 8 oz (227 g) resealable pouches. Products are sourced and milled in small batches in India in a GMP-certified, ISO-certified facility and distributed in the USA by ${SITE.company.legalName}, ${SITE.company.street}, ${SITE.company.city}, ${SITE.company.region} ${SITE.company.postal}. They are herbal dietary supplements; statements have not been evaluated by the FDA and the products are not intended to diagnose, treat, cure or prevent any disease.

## Products
${LISTING.map((p) => `- [${p.name}](${abs(productUrl(p))}): ${plain(p.seo.desc)}`).join('\n')}

## Shop by goal
${COLLECTIONS.map((c) => `- [${c.goal}](${abs(`/collections/${c.slug}/`)}): ${plain(c.desc)}`).join('\n')}

## Learn
${BLOG.map((b) => `- [${plain(b.title)}](${abs(blogUrl(b))}): ${plain(b.dek)}`).join('\n')}

## Company & help
- [Our Story](${abs('/about/')})
- [FAQ](${abs('/faq/')})
- [Shipping & Returns](${abs('/shipping-returns/')})
- [Wholesale](${abs('/wholesale/')})
- [Contact](${abs('/contact/')})
`);
write('_headers', `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.html\n  Cache-Control: public, max-age=0, must-revalidate\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);

console.log(`Built ${pages.length} pages → dist/  (css v${ASSET_V.css}, js v${ASSET_V.js})`);
