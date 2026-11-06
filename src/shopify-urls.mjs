// URL map used by `VEDA_TARGET=shopify node build.mjs` (see `npm run build:shopify`).
// The Vercel site and the Shopify theme share one source; only the URL scheme differs:
//   /shop/ -> /collections/all, /about/ -> /pages/about, /blog/... -> /blogs/journal/...,
//   /blog/category/<tag>/ -> /blogs/journal/tagged/<tag>, /privacy-policy/ -> /policies/privacy-policy ...
const PAGES = ['about', 'faq', 'contact', 'wholesale', 'accessibility'];
const POLICIES = { 'privacy-policy': 'privacy-policy', 'terms-of-service': 'terms-of-service', 'shipping-returns': 'shipping-policy' };

/** Map one site path ("/blog/meet-amla/") to its Shopify path. Unknown paths are returned unchanged. */
export function shopifyPath(p) {
  const m = p.match(/^\/([\w-]+)(?:\/([\w-]+))?(?:\/([\w-]+))?(\/?)$/);
  if (!m) return p;
  const [, a, b, c, slash] = m;
  const end = slash || '/';
  if (a === 'shop' && !b) return '/collections/all' + end;
  if (PAGES.includes(a) && !b) return `/pages/${a}${end}`;
  if (POLICIES[a] && !b) return `/policies/${POLICIES[a]}${end}`;
  if (a === 'blog') {
    if (!b) return '/blogs/journal' + end;
    if (b === 'category' && c) return `/blogs/journal/tagged/${c}${end}`;
    if (!c) return `/blogs/journal/${b}${end}`;
  }
  return p;
}

const RE = /(["'(])((?:https:\/\/vedaapothecaryusa\.com)?)(\/(?:shop|about|faq|contact|wholesale|accessibility|blog|privacy-policy|terms-of-service|shipping-returns)(?:\/[\w\/-]*)?)(?=[#?"')\s<]|$)/g;

/** Rewrite every internal link / canonical / JSON-LD url inside a generated HTML or JS string. */
export const rewriteUrls = (s) => s.replace(RE, (_, q, dom, p) => q + dom + shopifyPath(p));
