// Generates a 1200x630 Open Graph share image into public/og-image.jpg
// from the approved Rectory Field cricket hero, with a dark scrim and title overlay.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../src/assets/hero-cricket.png");
const logoSrc = resolve(here, "../src/assets/brand/source/bsc-logo-outlined.png");
const out = resolve(here, "../public/og-image.jpg");

const W = 1200;
const H = 630;

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="rgba(8,26,22,0.92)"/>
      <stop offset="0.6" stop-color="rgba(8,26,22,0.55)"/>
      <stop offset="1" stop-color="rgba(8,26,22,0.25)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <text x="205" y="118" font-family="Georgia, 'Times New Roman', serif" font-size="27" fill="#b8cf00" font-weight="700" letter-spacing="3">THE RECTORY FIELD · EST. 1883</text>
  <text x="68" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#ffffff" font-weight="700">Blackheath</text>
  <text x="68" y="410" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#ffffff" font-weight="700">Sports Club</text>
  <text x="72" y="500" font-family="Arial, sans-serif" font-size="27" fill="rgba(255,255,255,0.9)">Cricket · Rugby Football · Lawn Tennis · Squash · Venue hire</text>
</svg>`);

const logo = await sharp(logoSrc)
  .resize({ width: 112, height: 112, fit: "contain" })
  .png()
  .toBuffer();

await sharp(src)
  .resize({ width: W, height: H, fit: "cover", position: "centre" })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 58, left: 72 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out);

console.log("wrote public/og-image.jpg");
