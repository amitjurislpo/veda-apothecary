import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './site.mjs';

export const ROOT = path.resolve(import.meta.dirname, '..');
export const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/manifest.json'), 'utf8'));

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const plain = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
export const money = (n) => '$' + Number(n).toFixed(2);
export const abs = (p) => (p.startsWith('http') ? p : SITE.domain + p);
export const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

/** <img> with intrinsic width/height (prevents layout shift) */
export function img(name, alt = '', { cls = '', loading = 'lazy', style = '', attrs = '' } = {}) {
  const m = MANIFEST[name];
  if (!m) throw new Error('Unknown image: ' + name);
  const w = m.w, h = m.h;
  return `<img${cls ? ` class="${cls}"` : ''} src="/assets/img/${name}" alt="${esc(alt)}" width="${w}" height="${h}"${loading ? ` loading="${loading}"` : ''}${loading === 'lazy' ? ' decoding="async"' : ''}${style ? ` style="${style}"` : ''}${attrs ? ' ' + attrs : ''}>`;
}
export const imgSrc = (name) => `/assets/img/${name}`;

export const ICON = {
  check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>',
  leaf: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19 14 10"/></svg>',
  shield: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  truck: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  lock: '<svg class="icon" viewBox="0 0 24 24" style="width:16px;height:16px" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  sun: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  mail: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  box: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>',
  repeat: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  book: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M3 5c3-1 6-1 8 1v14c-2-2-5-2-8-1zM21 5c-3-1-6-1-8 1v14c2-2 5-2 8-1z"/></svg>'
};

/** FAQ accordion markup shared by several pages */
export const faqDetails = (items, { open = 0, cls = '' } = {}) =>
  items.map((q, i) => `<details${i === open ? ' open' : ''}${cls ? ` class="${cls}"` : ''}><summary>${q[0]}</summary><div class="in">${q[1]}</div></details>`).join('');

export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({ '@type': 'Question', name: plain(q[0]), acceptedAnswer: { '@type': 'Answer', text: plain(q[1]) } }))
  };
}

export function breadcrumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: plain(t[0]), item: abs(t[1]) }))
  };
}

export function crumbs(trail) {
  const last = trail.length - 1;
  return `<nav class="crumbs" aria-label="Breadcrumb">${trail.map((t, i) => (i === last ? `<span aria-current="page">${t[0]}</span>` : `<a href="${t[1]}">${t[0]}</a>`)).join(' / ')}</nav>`;
}
