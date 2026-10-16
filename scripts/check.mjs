// Post-build audit: `npm run check`. Fails (exit 1) on broken internal links, missing SEO basics,
// invalid structured data, missing images, or wording the U.S. label brief forbids.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const SITE = 'https://vedaapothecaryusa.com';
const problems = [], notes = [];
const bad = (page, msg) => problems.push(`${page}: ${msg}`);

const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(DIST);
const exists = (rel) => files.includes(path.join(DIST, rel));
const pages = files.filter((f) => f.endsWith('.html'));

const titles = new Map(), descs = new Map();
const FORBIDDEN = [
  [/chemical[\s-]*free/i, '"chemical free" is removed from the U.S. label'],
  [/FDA[\s-]*(approved|certified)/i, '"FDA approved/certified" must not be used'],
  [/USFDA/i, '"USFDA" claim must not be used'],
  [/FDA[\s-]*registered/i, '"FDA-registered" is unverified'],
  [/\b(cures?|heals?|prevents?)\b(?![^<]*(any disease|disease\.))/i, 'disease claim wording']
];

for (const f of pages) {
  const rel = path.relative(DIST, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) bad(rel, 'missing <title>'); else { if (title.length > 75) notes.push(`${rel}: title ${title.length} chars`); if (titles.has(title)) bad(rel, `duplicate title (also ${titles.get(title)})`); titles.set(title, rel); }
  if (!desc) bad(rel, 'missing meta description'); else { if (desc.length < 70 || desc.length > 175) notes.push(`${rel}: description ${desc.length} chars`); if (!noindex) { if (descs.has(desc)) bad(rel, `duplicate description (also ${descs.get(desc)})`); descs.set(desc, rel); } }
  if (!canon) bad(rel, 'missing canonical'); else if (!canon.startsWith(SITE)) bad(rel, 'canonical not absolute: ' + canon);
  if (h1s !== 1) bad(rel, `expected 1 <h1>, found ${h1s}`);
  if (!/<html lang="en">/.test(html)) bad(rel, 'missing html lang');

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); if (!j['@graph'] || !j['@context']) bad(rel, 'JSON-LD missing @graph/@context'); } catch (e) { bad(rel, 'invalid JSON-LD: ' + e.message); }
  }

  // images: alt present, file exists
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt="/.test(tag)) bad(rel, 'img without alt: ' + tag.slice(0, 80));
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !exists(src.slice(1))) bad(rel, 'missing image ' + src);
    if (src && !/\bwidth="/.test(tag) && src.startsWith('/assets/img/')) notes.push(`${rel}: img without width/height ${src}`);
  }

  // links
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    let h = m[1].replace(/&amp;/g, '&');
    if (!h || /^(https?:|mailto:|tel:|javascript:|#)/.test(h)) continue;
    const [p0, hash] = h.split('#'); const pth = p0.split('?')[0];
    const target = pth.endsWith('/') ? pth.slice(1) + 'index.html' : pth.slice(1);
    if (!exists(target)) bad(rel, 'broken link ' + h);
    else if (hash) { const t = fs.readFileSync(path.join(DIST, target), 'utf8'); if (!new RegExp(`id="${hash}"`).test(t)) bad(rel, `missing anchor #${hash} on ${pth}`); }
  }
  for (const m of html.matchAll(/<a\b[^>]*\bhref="#([^"]+)"/g)) if (m[1] && !new RegExp(`id="${m[1]}"`).test(html)) bad(rel, 'missing in-page anchor #' + m[1]);

  // forbidden wording (visible text only)
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const [re, why] of FORBIDDEN) { const m = text.match(re); if (m) bad(rel, `${why}: “${m[0]}”`); }
  if (!noindex && !html.includes('have not been evaluated by the Food and Drug Administration')) bad(rel, 'FDA disclaimer missing');
}

// sitemap vs. indexable pages
const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) { const p = l.replace(SITE, ''); if (!exists((p.endsWith('/') ? p.slice(1) + 'index.html' : p.slice(1)))) bad('sitemap.xml', 'URL has no page: ' + l); }
for (const f of pages) { const rel = path.relative(DIST, f).replace(/\\/g, '/'); const html = fs.readFileSync(f, 'utf8'); if (/noindex/.test(html)) continue; const url = SITE + '/' + rel.replace(/index\.html$/, ''); if (!locs.includes(url)) bad(rel, 'indexable page missing from sitemap'); }
for (const need of ['robots.txt', 'llms.txt', 'favicon.ico', 'site.webmanifest', '404.html']) if (!exists(need)) bad('dist', 'missing ' + need);

console.log(`Checked ${pages.length} pages, ${locs.length} sitemap URLs.`);
if (notes.length) console.log('Notes:\n  ' + notes.join('\n  '));
if (problems.length) { console.error('\nPROBLEMS:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log('All checks passed.');
