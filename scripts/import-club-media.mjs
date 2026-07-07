// Converts downloaded club media (in _clubmedia/, git-ignored) into optimized
// WebP assets under src/assets/club/. Source photos are © Blackheath Sports Club,
// taken from https://www.blackheathsportsclub.co.uk/ for this concept redesign.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const inDir = resolve(here, "../_clubmedia");
const outDir = resolve(here, "../src/assets/club");
mkdirSync(outDir, { recursive: true });

// source file -> output name (widths capped to source; q72)
const jobs = [
  ["v_esher.JPG", "rugby", 900],
  ["cricket1.jpg", "cricket", 900],
  ["tennis1.jpg", "tennis", 900],
  ["squash2.jpg", "squash", 900],
  ["Rectory_Field_Main_Bar_Small_1.jpg", "venue-bar", 900],
  ["rugbyteam1826.jpg", "heritage-team", 700],
  ["carpmael.jpg", "heritage-carpmael", 216],
  ["sitemap3.jpg", "sitemap", 900],
  ["Rec_Fld_Cricket_2.jpg", "gallery-cricket-1stxi", 900],
  ["womens_xv.jpg", "gallery-womens-xv", 900],
  ["u9s.JPG", "gallery-juniors", 900],
  ["v_cinderford.JPG", "gallery-rugby-cinderford", 900],
  ["tennis2.jpg", "gallery-tennis-doubles", 900],
  ["Squash1.jpg", "gallery-squash", 900],
  ["tennis3.jpg", "gallery-tennis", 900],
];

for (const [src, name, width] of jobs) {
  const out = resolve(outDir, `${name}.webp`);
  await sharp(resolve(inDir, src))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(out);
  console.log("wrote", `${name}.webp`);
}
console.log("done");
