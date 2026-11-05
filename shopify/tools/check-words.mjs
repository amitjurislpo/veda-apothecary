// Compliance scan for the Shopify theme: `npm run check:shopify`.
// Flags wording the U.S. label brief forbids (same spirit as scripts/check.mjs, which scans dist/).
// The mandatory FDA disclaimer sentence is allowed; everything else is reported with file:line.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const THEME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FOLDERS = ['config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'assets'];
const EXT = new Set(['.liquid', '.json', '.js', '.css']);
const WORDS = [
  [/\bcures?\b|\bcured\b|\bcuring\b/i, 'cure'],
  [/\btreat(s|ed|ing|ment|ments)?\b/i, 'treat'],
  [/\bprevent(s|ed|ing|ion|ive)?\b/i, 'prevent'],
  [/detox\w*/i, 'detox'],
  [/\bcleans(e|es|ed|ing)\b/i, 'cleanse'],
  [/FDA[\s-]*(approved|certified)/i, 'FDA approved/certified']
];
// Legally required disclaimer ("…not intended to diagnose, treat, cure, or prevent any disease.") is allowed.
const DISCLAIMER = /not intended to diagnose, treat, cure,? or prevent any disease/gi;

const hits = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : EXT.has(path.extname(p)) && scan(p); } };
function scan(f) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.replace(DISCLAIMER, ' ');
    for (const [re, label] of WORDS) { const m = t.match(re); if (m) hits.push(`${path.relative(THEME, f).split(path.sep).join('/')}:${i + 1}  [${label}]  “${m[0]}”  …${t.slice(Math.max(0, m.index - 40), m.index + 50).trim()}…`); }
  });
}
for (const f of FOLDERS) if (fs.existsSync(path.join(THEME, f))) walk(path.join(THEME, f));
if (hits.length) { console.error(`Banned wording in shopify/ theme (${hits.length}):\n  ` + hits.join('\n  ')); process.exit(1); }
console.log('Theme wording check passed (no cure / treat / prevent / detox / cleanse / FDA approved outside the standard disclaimer).');
