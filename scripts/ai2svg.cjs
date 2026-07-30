// One-off: extract vector artwork from the outlined Illustrator PDF (.ai) into an SVG.
// Uses only Node built-ins (zlib). Not part of the build.
const fs = require('fs');
const zlib = require('zlib');

const AI = 'src/assets/brand/source/bsc-logo-outlined-large.ai';
const OUT = process.argv[2] || 'src/assets/brand/bsc-crest.svg';

const raw = fs.readFileSync(AI);
const bin = raw.latin1Slice(0);

function inflateObj(num) {
  const marker = `\n${num} 0 obj`;
  let i = bin.indexOf(marker);
  if (i < 0) i = bin.indexOf(`${num} 0 obj`);
  const sm = bin.indexOf('stream', i) + 6;
  let st = sm;
  if (bin[st] === '\r') st++;
  if (bin[st] === '\n') st++;
  const en = bin.indexOf('endstream', st);
  return zlib.inflateSync(Buffer.from(raw.subarray(st, en)));
}

const content = inflateObj(24).toString('latin1');

// ---- tokenizer ----
const toks = content.match(/\/[^\s\/\[\]<>()]+|-?\d*\.?\d+(?:e-?\d+)?|[a-zA-Z*'"]+|[\[\]]/g) || [];

const H = 742.897;
let ctm = [1, 0, 0, 1, 0, 0];
const stack = [];
let fill = '#000000';
let stroke = '#000000';
let lw = 1;
let cx = 0, cy = 0; // current point (user space)
let d = '';
let started = false;
const out = [];

function mul(m, n) { // p x m x n
  return [
    n[0] * m[0] + n[2] * m[1],
    n[1] * m[0] + n[3] * m[1],
    n[0] * m[2] + n[2] * m[3],
    n[1] * m[2] + n[3] * m[3],
    n[0] * m[4] + n[2] * m[5] + n[4],
    n[1] * m[4] + n[3] * m[5] + n[5],
  ];
}
function tx(x, y) {
  return [ctm[0] * x + ctm[2] * y + ctm[4], ctm[1] * x + ctm[3] * y + ctm[5]];
}
function P(x, y) { const p = tx(x, y); return `${r(p[0])} ${r(p[1])}`; }
function r(v) { return Math.round(v * 100) / 100; }
function scale() { return Math.sqrt(Math.abs(ctm[0] * ctm[3] - ctm[1] * ctm[2])); }
function hex(a, b, c) {
  const h = v => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, '0');
  return `#${h(a)}${h(b)}${h(c)}`;
}

const st = [];
function n() { return parseFloat(st.pop()); }

for (let k = 0; k < toks.length; k++) {
  const t = toks[k];
  if (/^-?\d*\.?\d+(?:e-?\d+)?$/.test(t)) { st.push(t); continue; }
  if (t[0] === '/') { st.length = 0; continue; }
  switch (t) {
    case 'q': stack.push({ ctm: ctm.slice(), fill, stroke, lw }); break;
    case 'Q': { const s = stack.pop(); if (s) { ctm = s.ctm; fill = s.fill; stroke = s.stroke; lw = s.lw; } break; }
    case 'cm': { const f = st.slice(-6).map(parseFloat); st.length = 0; ctm = mul(f, ctm); break; }
    case 'm': { const y = n(), x = n(); cx = x; cy = y; d += `M${P(x, y)} `; started = true; break; }
    case 'l': { const y = n(), x = n(); cx = x; cy = y; d += `L${P(x, y)} `; break; }
    case 'c': { const y3 = n(), x3 = n(), y2 = n(), x2 = n(), y1 = n(), x1 = n(); d += `C${P(x1, y1)} ${P(x2, y2)} ${P(x3, y3)} `; cx = x3; cy = y3; break; }
    case 'v': { const y3 = n(), x3 = n(), y2 = n(), x2 = n(); d += `C${P(cx, cy)} ${P(x2, y2)} ${P(x3, y3)} `; cx = x3; cy = y3; break; }
    case 'y': { const y3 = n(), x3 = n(), y1 = n(), x1 = n(); d += `C${P(x1, y1)} ${P(x3, y3)} ${P(x3, y3)} `; cx = x3; cy = y3; break; }
    case 're': { const h = n(), w = n(), y = n(), x = n(); d += `M${P(x, y)} L${P(x + w, y)} L${P(x + w, y + h)} L${P(x, y + h)} Z `; break; }
    case 'h': d += 'Z '; break;
    case 'rg': { const b = n(), g = n(), rr = n(); fill = hex(rr, g, b); st.length = 0; break; }
    case 'g': { const gr = n(); fill = hex(gr, gr, gr); st.length = 0; break; }
    case 'k': { const kk = n(), yy = n(), mm = n(), cc = n(); fill = hex((1 - cc) * (1 - kk), (1 - mm) * (1 - kk), (1 - yy) * (1 - kk)); st.length = 0; break; }
    case 'RG': { const b = n(), g = n(), rr = n(); stroke = hex(rr, g, b); st.length = 0; break; }
    case 'G': { const gr = n(); stroke = hex(gr, gr, gr); st.length = 0; break; }
    case 'K': { const kk = n(), yy = n(), mm = n(), cc = n(); stroke = hex((1 - cc) * (1 - kk), (1 - mm) * (1 - kk), (1 - yy) * (1 - kk)); st.length = 0; break; }
    case 'w': lw = n(); break;
    case 'f': case 'F': case 'f*':
      if (d.trim()) out.push(`<path fill="${fill}" fill-rule="${t === 'f*' ? 'evenodd' : 'nonzero'}" d="${d.trim()}"/>`);
      d = ''; st.length = 0; break;
    case 'S': case 's':
      if (t === 's') d += 'Z ';
      if (d.trim()) out.push(`<path fill="none" stroke="${stroke}" stroke-width="${r(lw * scale())}" d="${d.trim()}"/>`);
      d = ''; st.length = 0; break;
    case 'B': case 'B*': case 'b': case 'b*':
      if (t[0] === 'b') d += 'Z ';
      if (d.trim()) { out.push(`<path fill="${fill}" d="${d.trim()}"/>`); out.push(`<path fill="none" stroke="${stroke}" stroke-width="${r(lw * scale())}" d="${d.trim()}"/>`); }
      d = ''; st.length = 0; break;
    case 'n': d = ''; st.length = 0; break;
    case 'W': case 'W*': break; // clip: ignored
    default: st.length = 0; // gs, Do, BDC, EMC, etc.
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${H} ${H}" role="img" aria-label="Blackheath Sports Club crest">\n<g transform="matrix(1 0 0 -1 0 ${H})">\n${out.join('\n')}\n</g>\n</svg>\n`;
fs.writeFileSync(OUT, svg);
console.log('paths:', out.length, '-> wrote', OUT, svg.length, 'bytes');
