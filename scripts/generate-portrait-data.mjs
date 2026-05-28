import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const input = path.join(root, "public/assets/user.jpg");
const outputDir = path.join(root, "public/portrait");
const outputJson = path.join(outputDir, "points.json");
const outputPreview = path.join(outputDir, "preview.png");

const crop = {
  left: 80,
  top: 35,
  width: 864,
  height: 1200,
};

const sampleWidth = 360;
const sampleHeight = Math.round(sampleWidth * (crop.height / crop.width));
const maxPoints = 42000;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed = 0) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function ellipse(u, v, cx, cy, rx, ry, softness = 0.08) {
  const distance = Math.sqrt(((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2);
  return 1 - smoothstep(1 - softness, 1 + softness, distance);
}

function rectangle(u, v, cx, cy, rx, ry, softness = 0.08) {
  const dx = Math.abs(u - cx) / rx;
  const dy = Math.abs(v - cy) / ry;
  const distance = Math.max(dx, dy);
  return 1 - smoothstep(1 - softness, 1 + softness, distance);
}

function subjectMask(u, v) {
  const hairAndHead = ellipse(u, v, 0.5, 0.31, 0.305, 0.305, 0.11);
  const faceAndJaw = ellipse(u, v, 0.5, 0.43, 0.265, 0.27, 0.12);
  const neck = rectangle(u, v, 0.5, 0.65, 0.155, 0.115, 0.18);
  const shirt = ellipse(u, v, 0.5, 0.88, 0.58, 0.36, 0.18);

  const shoulderStart = smoothstep(0.55, 0.64, v);
  const shoulderWidth = 0.24 + clamp((v - 0.56) / 0.44) * 0.44;
  const shoulders = shoulderStart * (1 - smoothstep(shoulderWidth, shoulderWidth + 0.08, Math.abs(u - 0.5)));

  const topTrim = smoothstep(0.015, 0.07, v);
  const bottomTrim = 1 - smoothstep(0.985, 1.04, v);
  return clamp(Math.max(hairAndHead, faceAndJaw, neck, shirt, shoulders) * topTrim * bottomTrim);
}

function faceWeight(u, v) {
  return Math.max(
    ellipse(u, v, 0.5, 0.36, 0.27, 0.31, 0.18),
    ellipse(u, v, 0.5, 0.48, 0.23, 0.2, 0.14),
  );
}

function zone(u, v, cx, cy, rx, ry) {
  return ellipse(u, v, cx, cy, rx, ry, 0.22);
}

function getPixel(buffer, x, y, width) {
  const offset = (y * width + x) * 3;
  return [buffer[offset], buffer[offset + 1], buffer[offset + 2]];
}

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  return max - min;
}

function colorForPoint(r, g, b, lum, sat, edge, contour) {
  const base = [r / 255, g / 255, b / 255];
  const purple = [0.62, 0.42, 1];
  const cyan = [0.22, 0.9, 1];
  const pink = [1, 0.34, 0.7];
  const accent = sat > 0.16 ? pink : lum > 0.68 ? cyan : purple;
  const featureBoost = clamp(edge * 0.72 + contour * 0.9 + (1 - lum) * 0.22, 0, 0.88);
  const accentMix = clamp(0.18 + edge * 0.22 + contour * 0.32, 0.16, 0.62);

  return base.map((channel, index) => {
    const contrasted = clamp((channel - 0.5) * 1.42 + 0.62);
    const mixed = contrasted * (1 - accentMix) + accent[index] * accentMix;
    return clamp(mixed + featureBoost * 0.32);
  });
}

function quantize(value, places = 4) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

fs.mkdirSync(outputDir, { recursive: true });

const { data } = await sharp(input)
  .rotate()
  .extract(crop)
  .resize(sampleWidth, sampleHeight, { fit: "fill" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const mask = new Float32Array(sampleWidth * sampleHeight);
const gray = new Float32Array(sampleWidth * sampleHeight);
const sat = new Float32Array(sampleWidth * sampleHeight);

for (let y = 0; y < sampleHeight; y += 1) {
  for (let x = 0; x < sampleWidth; x += 1) {
    const u = x / (sampleWidth - 1);
    const v = y / (sampleHeight - 1);
    const [r, g, b] = getPixel(data, x, y, sampleWidth);
    const index = y * sampleWidth + x;
    gray[index] = luminance(r, g, b);
    sat[index] = saturation(r, g, b);
    mask[index] = subjectMask(u, v);
  }
}

const points = [];

for (let y = 2; y < sampleHeight - 2; y += 1) {
  for (let x = 2; x < sampleWidth - 2; x += 1) {
    const index = y * sampleWidth + x;
    const u = x / (sampleWidth - 1);
    const v = y / (sampleHeight - 1);
    const m = mask[index];

    if (m < 0.08) {
      continue;
    }

    const gx =
      -gray[index - sampleWidth - 1] -
      2 * gray[index - 1] -
      gray[index + sampleWidth - 1] +
      gray[index - sampleWidth + 1] +
      2 * gray[index + 1] +
      gray[index + sampleWidth + 1];
    const gy =
      -gray[index - sampleWidth - 1] -
      2 * gray[index - sampleWidth] -
      gray[index - sampleWidth + 1] +
      gray[index + sampleWidth - 1] +
      2 * gray[index + sampleWidth] +
      gray[index + sampleWidth + 1];
    const edge = clamp(Math.sqrt(gx * gx + gy * gy) * 2.8);
    const contour = clamp(Math.abs(mask[index] - mask[index - 2]) + Math.abs(mask[index] - mask[index + 2]) + Math.abs(mask[index] - mask[index - sampleWidth * 2]) + Math.abs(mask[index] - mask[index + sampleWidth * 2]));
    const face = faceWeight(u, v);
    const eyeZone = Math.max(zone(u, v, 0.38, 0.35, 0.12, 0.045), zone(u, v, 0.62, 0.35, 0.12, 0.045));
    const noseZone = zone(u, v, 0.5, 0.43, 0.07, 0.13);
    const mouthZone = zone(u, v, 0.5, 0.55, 0.14, 0.055);
    const beardZone = zone(u, v, 0.5, 0.58, 0.21, 0.15);
    const featureZone = Math.max(eyeZone, noseZone, mouthZone, beardZone);
    const darkFeature = clamp((0.56 - gray[index]) * 2.2) * Math.max(face, featureZone);
    const density = clamp(
      0.025 +
        m * 0.15 +
        face * 0.26 +
        edge * 0.62 +
        contour * 0.76 +
        darkFeature * 0.42 +
        featureZone * 0.2,
      0,
      0.96,
    );

    if (hash2(x, y, 19) > density) {
      continue;
    }

    const [r, g, b] = getPixel(data, x, y, sampleWidth);
    const nx = u - 0.5;
    const ny = 0.5 - v;
    const headRelief = face * 0.66;
    const noseRelief = noseZone * 0.42;
    const cheekRelief = Math.max(zone(u, v, 0.38, 0.45, 0.12, 0.11), zone(u, v, 0.62, 0.45, 0.12, 0.11)) * 0.16;
    const shoulderBack = smoothstep(0.58, 0.98, v) * 0.42;
    const z =
      headRelief +
      noseRelief +
      cheekRelief +
      edge * 0.22 +
      contour * 0.28 -
      shoulderBack +
      (hash2(x, y, 41) - 0.5) * 0.08;
    const size = 0.011 + edge * 0.012 + contour * 0.016 + face * 0.005;
    const color = colorForPoint(r, g, b, gray[index], sat[index], edge, contour);
    const score = density + edge * 0.7 + contour * 1.1 + face * 0.5 + m * 0.18 + featureZone * 0.25;

    points.push({
      color,
      position: [
        quantize(nx * 2.38 + (hash2(x, y, 23) - 0.5) * 0.025),
        quantize(ny * 3.32 + (hash2(x, y, 29) - 0.5) * 0.025),
        quantize(z),
      ],
      score,
      size: quantize(size, 5),
    });
  }
}

points.sort((a, b) => b.score - a.score);
const selected = points.slice(0, maxPoints).sort((a, b) => a.position[1] - b.position[1]);
const positions = [];
const colors = [];
const sizes = [];

for (const point of selected) {
  positions.push(...point.position);
  colors.push(...point.color.map((value) => quantize(value, 4)));
  sizes.push(point.size);
}

const payload = {
  colors,
  count: selected.length,
  generatedFrom: "public/assets/user.jpg",
  positions,
  sizes,
};

fs.writeFileSync(outputJson, `${JSON.stringify(payload)}\n`);

const previewWidth = 900;
const previewHeight = 1200;
const circles = selected
  .map((point) => {
    const [x, y] = point.position;
    const [r, g, b] = point.color.map((value) => Math.round(value * 255));
    const px = (x / 2.38 + 0.5) * previewWidth;
    const py = (0.5 - y / 3.32) * previewHeight;
    const radius = 0.85 + point.size * 80;
    return `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${radius.toFixed(2)}" fill="rgb(${r},${g},${b})" fill-opacity="0.86" />`;
  })
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${previewWidth}" height="${previewHeight}" viewBox="0 0 ${previewWidth} ${previewHeight}"><rect width="100%" height="100%" fill="#050508"/><g>${circles}</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(outputPreview);

console.log(`Generated ${path.relative(root, outputJson)} (${selected.length} points)`);
console.log(`Generated ${path.relative(root, outputPreview)}`);
