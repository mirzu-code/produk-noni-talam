#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/generate-icons.js <path-to-image>');
  process.exit(1);
}

const outDir = path.resolve(process.cwd(), 'public', 'icons');
await fs.promises.mkdir(outDir, { recursive: true });

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

for (const s of sizes) {
  const outPath = path.join(outDir, s.name);
  await sharp(input)
    .resize(s.size, s.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPath);
  console.log('Wrote', outPath);
}

console.log('All icons generated in', outDir);
