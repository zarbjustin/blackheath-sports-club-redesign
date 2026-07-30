import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "src/assets/brand/bsc-crest.svg");
const outputDir = path.join(root, "src/assets/brand/refined");

const source = await readFile(sourcePath, "utf8");
const paths = source.match(/<path\b[^>]*\/>/g) ?? [];

if (paths.length !== 52) {
  throw new Error(`Expected 52 source paths, found ${paths.length}`);
}

const pick = (indexes) => indexes.map((index) => paths[index]).join("\n");
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, offset) => start + offset);

const topLetters = pick(range(6, 15));
const heather = pick(range(16, 39));
const bottomLetters = pick(range(40, 49));
const separators = pick([50, 51]);
const whiteDisc = paths[0];
const innerDisc = pick([2, 3]);

const colors = {
  red: "#e30613",
  lime: "#afca0b",
  green: "#215030",
  black: "#050505",
};

function svgDocument({ title, width, height, viewBox, content }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img" aria-labelledby="title">
<title id="title">${title}</title>
${content}
</svg>
`;
}

function refinedCrestBody({ monochrome = false } = {}) {
  const red = monochrome ? colors.black : colors.red;
  const lime = monochrome ? colors.black : colors.lime;
  const green = monochrome ? colors.black : colors.green;

  return `<g transform="matrix(1 0 0 -1 0 742.897)">
${whiteDisc}
<circle cx="368.34" cy="369.47" r="335.87" fill="none" stroke="${red}" stroke-width="10"/>
<circle cx="368.34" cy="369.47" r="310.98" fill="none" stroke="${lime}" stroke-width="${monochrome ? 4 : 7}"/>
<circle cx="368.34" cy="369.47" r="287.95" fill="none" stroke="${green}" stroke-width="8"/>
${innerDisc}
${topLetters}
<g transform="translate(371.4 369.5) scale(1.06) translate(-371.4 -369.5)">
${heather}
</g>
${bottomLetters}
${separators}
</g>`;
}

function compactMarkBody() {
  return `<g transform="matrix(1 0 0 -1 0 742.897)">
${whiteDisc}
<circle cx="368.34" cy="369.47" r="335.87" fill="none" stroke="${colors.red}" stroke-width="18"/>
<circle cx="368.34" cy="369.47" r="306" fill="none" stroke="${colors.lime}" stroke-width="9"/>
<circle cx="368.34" cy="369.47" r="282" fill="none" stroke="${colors.green}" stroke-width="13"/>
<circle cx="368.34" cy="369.47" r="224" fill="none" stroke="${colors.black}" stroke-width="8"/>
<g transform="translate(371.4 369.5) scale(1.35) translate(-371.4 -369.5)">
${heather}
</g>
</g>`;
}

const primary = svgDocument({
  title: "Proposed refined Blackheath Sports Club crest",
  width: 2048,
  height: 2048,
  viewBox: "0 0 742.897 742.897",
  content: refinedCrestBody(),
});

const compact = svgDocument({
  title: "Proposed compact Blackheath Sports Club mark",
  width: 1024,
  height: 1024,
  viewBox: "0 0 742.897 742.897",
  content: compactMarkBody(),
});

const monochrome = svgDocument({
  title: "Proposed monochrome Blackheath Sports Club crest",
  width: 2048,
  height: 2048,
  viewBox: "0 0 742.897 742.897",
  content: refinedCrestBody({ monochrome: true }),
});

const horizontal = svgDocument({
  title: "Proposed horizontal Blackheath Sports Club logo",
  width: 1800,
  height: 450,
  viewBox: "0 0 1800 450",
  content: `<g transform="translate(26 24) scale(0.54)">
${compactMarkBody()}
</g>
<g font-family="Arial, Helvetica, sans-serif">
  <text x="450" y="205" fill="${colors.black}" font-size="116" font-weight="700">Blackheath</text>
  <text x="454" y="292" fill="${colors.red}" font-size="51" font-weight="700" textLength="535" lengthAdjust="spacing">SPORTS CLUB</text>
</g>`,
});

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outputDir, "bsc-crest-refined.svg"), primary),
  writeFile(path.join(outputDir, "bsc-mark-compact.svg"), compact),
  writeFile(path.join(outputDir, "bsc-crest-monochrome.svg"), monochrome),
  writeFile(path.join(outputDir, "bsc-lockup-horizontal.svg"), horizontal),
]);

console.log(`Generated four proposed logo SVGs in ${path.relative(root, outputDir)}`);
