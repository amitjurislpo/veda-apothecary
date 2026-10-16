// Regenerates assets/img/pouch-*.webp from the FINAL U.S. label artwork (references/natural products-1 (1).pdf).
// The pouch images embedded in the design file still show the old label ("CHEMICAL FREE"), which the
// U.S. label-change brief removes, so the site uses the final artwork instead.
// Needs Python + PyMuPDF (pip install pymupdf) for the PDF render step.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const pdf = 'references/natural products-1 (1).pdf';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'veda-labels-'));
const py = `
import pymupdf, sys
doc = pymupdf.open(sys.argv[1]); pg = doc[0]
pg.get_pixmap(dpi=200).save(sys.argv[2])
`;
fs.writeFileSync(path.join(tmp, 'r.py'), py);
const sheet = path.join(tmp, 'sheet.png');
execFileSync('python', [path.join(tmp, 'r.py'), pdf, sheet]);

// Front panels, left to right on the sheet (px at 200 dpi, measured from the rendered sheet).
const PANELS = [['amla', 2], ['moringa', 1100], ['triphala', 2198], ['ashwagandha', 3296]];
for (const [name, left] of PANELS) {
  await sharp(sheet).extract({ left: left + 6, top: 6, width: 1014, height: 1408 }).resize({ width: 620 }).webp({ quality: 86 }).toFile(`assets/img/pouch-${name}.webp`);
  console.log('pouch-' + name + '.webp');
}
fs.rmSync(tmp, { recursive: true, force: true });
