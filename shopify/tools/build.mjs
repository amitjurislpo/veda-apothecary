// Rebuilds the Shopify theme (shopify/) from the repo source.   Run:  npm run build:shopify
//
//   1. VEDA_TARGET=shopify node build.mjs   -> dist-shopify/   (same pages, Shopify URL scheme)
//   2. python shopify/tools/convert.py      -> snippets/ + sections/ (Liquid, live prices via all_products[...])
//   3. shopify/tools/theme-src/             -> hand-written layout, templates, cart JS, settings
//   4. dist-shopify assets                  -> theme assets/
//   5. result replaces shopify/{assets,config,layout,locales,sections,snippets,templates}
//
// Options:  --content   also write the optional Shopify-admin import pack to dist-shopify-admin/
// Requires: Node 18+, Python 3 (python3 or python on PATH). Edit theme-src/ for hand-written files,
// never the generated folders in shopify/ (they are overwritten).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const THEME = path.join(ROOT, 'shopify');
const SITE = path.join(ROOT, 'dist-shopify');
const WORK = path.join(ROOT, 'dist-shopify-theme');
const AUX = path.join(ROOT, 'dist-shopify-aux');
const FOLDERS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

const run = (cmd, args, env = {}) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });
  if (r.error || r.status !== 0) { console.error(`failed: ${cmd} ${args.join(' ')}`); process.exit(r.status || 1); }
};
const python = ['python3', 'python'].find((c) => { const r = spawnSync(c, ['-c', 'import sys; sys.exit(0 if sys.version_info[0] >= 3 else 1)'], { stdio: 'ignore' }); return !r.error && r.status === 0; });
if (!python) { console.error('Python 3 is required (python3 or python on PATH).'); process.exit(1); }

const copyDir = (from, to, filter = () => true) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b, filter); else if (filter(e.name)) fs.copyFileSync(a, b);
  }
};

// 1. Shopify-URL build of the site
run('node', ['scripts/manifest.mjs']);
run('node', ['build.mjs'], { VEDA_TARGET: 'shopify' });

// 2. static pages -> Liquid
fs.rmSync(WORK, { recursive: true, force: true });
fs.rmSync(AUX, { recursive: true, force: true });
run(python, [path.join('shopify', 'tools', 'convert.py'), SITE, WORK, AUX], { PYTHONUTF8: '1' });

// 3. hand-written theme files
copyDir(path.join(HERE, 'theme-src'), WORK);

// 4. assets: images, fonts, home/article scripts, stylesheet (font urls become theme-relative)
const A = path.join(WORK, 'assets');
copyDir(path.join(SITE, 'assets', 'img'), A);
copyDir(path.join(SITE, 'assets', 'fonts'), A, (n) => n.endsWith('.woff2'));
for (const f of ['home.js', 'article.js']) fs.copyFileSync(path.join(SITE, 'assets', 'js', f), path.join(A, f));
fs.writeFileSync(path.join(A, 'site.css'), fs.readFileSync(path.join(SITE, 'assets', 'css', 'site.css'), 'utf8').replace(/url\(\/assets\/fonts\/([^)]+)\)/g, 'url($1)'));

// 5. publish into shopify/
for (const f of FOLDERS) {
  fs.rmSync(path.join(THEME, f), { recursive: true, force: true });
  copyDir(path.join(WORK, f), path.join(THEME, f));
}
const count = FOLDERS.reduce((n, f) => n + fs.readdirSync(path.join(THEME, f), { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).length, 0);

if (process.argv.includes('--content')) {
  run(python, [path.join('shopify', 'tools', 'content_pack.py'), SITE, AUX, path.join(ROOT, 'dist-shopify-admin'), path.join('src', 'data', 'products.mjs')], { PYTHONUTF8: '1' });
}
console.log(`Shopify theme rebuilt: ${count} files in shopify/`);
