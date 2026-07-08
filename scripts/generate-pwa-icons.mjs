import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/icons");
const iconSizes = [
  { name: "pwa-icon-192.png", size: 192, padding: 22 },
  { name: "pwa-icon-512.png", size: 512, padding: 58 },
  { name: "pwa-maskable-512.png", size: 512, padding: 92 },
  { name: "apple-touch-icon.png", size: 180, padding: 20 },
];

function svgIcon(size, padding) {
  const inner = size - padding * 2;
  const markRadius = Math.round(size * 0.13);
  const fontSize = Math.round(size * 0.23);
  const subSize = Math.round(size * 0.058);
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#0b5c43"/>
      <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${markRadius}" fill="#fbfaf6"/>
      <text x="${size / 2}" y="${Math.round(size * 0.53)}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="#0b5c43">BSC</text>
      <text x="${size / 2}" y="${Math.round(size * 0.67)}" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="${subSize}" font-weight="700" letter-spacing="${Math.max(1, Math.round(size * 0.006))}" fill="#a63c2f">RECTORY FIELD</text>
    </svg>
  `;
}

await fs.mkdir(outDir, { recursive: true });

await Promise.all(
  iconSizes.map(({ name, size, padding }) =>
    sharp(Buffer.from(svgIcon(size, padding)))
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(outDir, name))
  )
);

console.log(`Generated ${iconSizes.length} PWA icons in ${outDir}`);
