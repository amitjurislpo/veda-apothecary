// Records intrinsic image sizes so every <img> can carry width/height (prevents layout shift).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const dir = 'assets/img', out = {};
for (const f of fs.readdirSync(dir).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort()) {
  const m = await sharp(path.join(dir, f)).metadata();
  out[f] = { w: m.width, h: m.height, bytes: fs.statSync(path.join(dir, f)).size };
}
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(out, null, 1));
