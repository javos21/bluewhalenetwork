import { readFileSync } from "node:fs";

const assets = [
  "blue-whale-svg-assets/blue-whale-logo-animatable.svg",
  "blue-whale-svg-assets/blue-whale-mark-animatable.svg",
  "blue-whale-svg-assets/blue-whale-spout-overlay.svg",
];

let failed = false;

for (const asset of assets) {
  const svg = readFileSync(asset, "utf8");
  const groupTag = svg.match(/<g id="spout"[^>]*>/)?.[0] ?? "";
  const translation = groupTag.match(/transform="translate\(([\d.-]+)[ ,]+([\d.-]+)\)"/);
  const path = svg.match(/id="spout-center" d="M([\d.-]+) ([\d.-]+)/);
  const x = Number(path?.[1]) + Number(translation?.[1] ?? 0);
  const y = Number(path?.[2]) + Number(translation?.[2] ?? 0);
  const isOnUpperFrontBody = x >= 340 && x <= 390 && y >= 145 && y <= 180;

  console.log(`${asset}: rendered origin=(${x}, ${y}) ${isOnUpperFrontBody ? "PASS" : "FAIL"}`);
  failed ||= !isOnUpperFrontBody;
}

if (failed) process.exitCode = 1;
