// One-off: pulls the embedded base64 images out of the approved design file
// (references/veda-apothecary-final-studio.html) into assets/img with real file names.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const SRC = 'references/veda-apothecary-final-studio.html';
const OUT = 'assets/img';
const NAMES = {
  '1e1cd815': 'mark.png', 'fd9c8c3f': 'logo.png', '3334d3ec': 'logo-light.png',
  '74b60834': 'bowl-moringa.webp', '7829539e': 'bowl-ashwagandha.webp', '38b5553e': 'bowl-triphala.webp', 'b608bbd8': 'bowl-amla.webp',
  'cd88dd70': 'bowl-base-moringa.webp', 'a3722ce7': 'bowl-base-ashwagandha.webp', '0d075cc7': 'bowl-base-triphala.webp', 'dafed838': 'bowl-base-amla.webp',
  // pouch-*.webp now come from the final label PDF (scripts/extract-labels.mjs), not from this file
  'ef2be320': 'photo-moringa.webp', 'a7bdae40': 'photo-ashwagandha.webp', '0e367731': 'photo-triphala.webp', 'be66abea': 'photo-amla.webp'
};
const src = fs.readFileSync(SRC, 'utf8');
const re = /data:([a-zA-Z\/+.-]+);base64,([A-Za-z0-9+\/=]+)/g;
fs.mkdirSync(OUT, { recursive: true });
const done = new Set(), manifest = {};
let m;
while ((m = re.exec(src))) {
  const h = crypto.createHash('md5').update(m[2]).digest('hex').slice(0, 8);
  if (done.has(h)) continue; done.add(h);
  const name = NAMES[h]; if (!name) { console.warn('unmapped', h); continue; }
  let buf = Buffer.from(m[2], 'base64');
  const ext = path.extname(name);
  if (ext === '.webp' && m[1] !== 'image/webp') buf = await sharp(buf).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(path.join(OUT, name), buf);
  const meta = await sharp(buf).metadata();
  manifest[name] = { w: meta.width, h: meta.height, bytes: buf.length };
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log(Object.entries(manifest).map(([k, v]) => `${k} ${v.w}x${v.h} ${Math.round(v.bytes / 1024)}KB`).join('\n'));
