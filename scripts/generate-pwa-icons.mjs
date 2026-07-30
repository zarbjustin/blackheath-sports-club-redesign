import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/icons");
const logoPath = path.resolve("src/assets/brand/source/bsc-logo-outlined.png");
const siteLogoPath = path.resolve("src/assets/brand/bsc-logo-outlined-512.webp");
const iconSizes = [
  { name: "favicon-64.png", size: 64, padding: 4 },
  { name: "pwa-icon-192.png", size: 192, padding: 16 },
  { name: "pwa-icon-512.png", size: 512, padding: 44 },
  { name: "pwa-maskable-512.png", size: 512, padding: 92 },
  { name: "apple-touch-icon.png", size: 180, padding: 14 },
];

await fs.mkdir(outDir, { recursive: true });

await Promise.all(
  iconSizes.map(async ({ name, size, padding }) => {
    const logo = await sharp(logoPath)
      .resize({
        width: size - padding * 2,
        height: size - padding * 2,
        fit: "contain",
      })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: "#fbfaf6",
      },
    })
      .composite([{ input: logo, top: padding, left: padding }])
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(outDir, name));
  })
);

await sharp(logoPath)
  .resize({ width: 512, height: 512, fit: "contain" })
  .webp({ quality: 94, alphaQuality: 100, effort: 6, smartSubsample: true })
  .toFile(siteLogoPath);

console.log(`Generated ${iconSizes.length} PWA icons in ${outDir}`);
