// One-off: isolate the central heather sprig from the extracted crest SVG.
const fs = require('fs');
const src = fs.readFileSync('src/assets/brand/bsc-crest.svg', 'utf8');
const CX = 742.897 / 2, CY = 742.897 / 2, R = 205;
const paths = [...src.matchAll(/<path[^>]*fill="([^"]*)"[^>]*d="([^"]*)"[^>]*\/>/g)];
let kept = [];
let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
for (const p of paths) {
  const fill = p[1];
  if (!/^#0[0-3]/.test(fill)) continue; // dark fills only
  const nums = (p[2].match(/-?\d*\.?\d+/g) || []).map(Number);
  let ok = true, bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (Math.hypot(x - CX, y - CY) > R) { ok = false; break; }
    bx0 = Math.min(bx0, x); by0 = Math.min(by0, y);
    bx1 = Math.max(bx1, x); by1 = Math.max(by1, y);
  }
  if (!ok) continue;
  if (bx1 - bx0 > 300 || by1 - by0 > 320) continue; // skip the surrounding ring
  kept.push(p[0]);
  minx = Math.min(minx, bx0); miny = Math.min(miny, by0);
  maxx = Math.max(maxx, bx1); maxy = Math.max(maxy, by1);
}
const pad = 14;
minx -= pad; miny -= pad; maxx += pad; maxy += pad;
const w = maxx - minx, h = maxy - miny;
const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(minx)} ${r(742.897 - maxy)} ${r(w)} ${r(h)}" role="img" aria-label="Blackheath heather emblem">\n<g transform="matrix(1 0 0 -1 0 742.897)">\n${kept.join('\n')}\n</g>\n</svg>\n`;
fs.writeFileSync('src/assets/brand/bsc-heather.svg', out);
console.log('heather paths:', kept.length, 'viewBox w/h', r(w), r(h));
function r(v) { return Math.round(v * 100) / 100; }
