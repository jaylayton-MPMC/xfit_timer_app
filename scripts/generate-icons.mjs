import sharp from 'sharp';
import { writeFileSync } from 'fs';

const SVG = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="104" fill="#050505"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#161616" stroke-width="54"/>
  <path d="M 256,76 A 180,180 0 0,1 422.9,323.5" fill="none" stroke="#22c55e" stroke-width="46"/>
  <path d="M 411.9,346 A 180,180 0 0,1 114.2,366.9" fill="none" stroke="#3b82f6" stroke-width="46"/>
  <path d="M 100.1,346 A 180,180 0 0,1 231.0,77.8" fill="none" stroke="#a855f7" stroke-width="46"/>
  <text x="256" y="288" font-family="Arial Black,Helvetica Neue,Arial,sans-serif" font-size="108" font-weight="900" fill="#f5f5f5" text-anchor="middle" letter-spacing="-3">WOD</text>
</svg>`;

const svgBuf = Buffer.from(SVG);

const sizes = [
  { file: 'public/icon-512.png', size: 512 },
  { file: 'public/icon-192.png', size: 192 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/icon.png', size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(svgBuf).resize(size, size).png().toFile(file);
  console.log(`✓ ${file}`);
}
