const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a"/>
          <stop offset="100%" style="stop-color:#1e293b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <!-- Accent line -->
      <rect x="80" y="200" width="120" height="4" rx="2" fill="url(#accent)"/>
      <!-- Name -->
      <text x="80" y="270" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        Dzaki Muhammad Yusfian
      </text>
      <!-- Title -->
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#cbd5e1">
        Accounting &amp; Finance Professional
      </text>
      <!-- Tagline -->
      <text x="80" y="370" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">
        Specializing in Tax, Audit, and Financial Analysis
      </text>
      <!-- Bottom accent dots -->
      <circle cx="80" cy="550" r="4" fill="#3b82f6" opacity="0.6"/>
      <circle cx="100" cy="550" r="4" fill="#6366f1" opacity="0.5"/>
      <circle cx="120" cy="550" r="4" fill="#8b5cf6" opacity="0.4"/>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'images', 'og-image.jpg');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log(`✅ OG image generated: ${outputPath} (${width}x${height})`);
}

async function generateAvatar() {
  const size = 400;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
        <clipPath id="circle">
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#circle)">
        <rect width="${size}" height="${size}" fill="url(#avatarBg)"/>
        <text
          x="${size / 2}"
          y="${size / 2 + 40}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="120"
          font-weight="bold"
          fill="#ffffff"
          text-anchor="middle"
        >DMY</text>
      </g>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'images', 'profile', 'avatar.jpg');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log(`✅ Avatar generated: ${outputPath} (${size}x${size})`);
}

async function generateAppleTouchIcon() {
  const size = 180;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="36" fill="#3b82f6"/>
      <text
        x="${size / 2}"
        y="${size / 2 + 18}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="56"
        font-weight="bold"
        fill="#ffffff"
        text-anchor="middle"
      >DMY</text>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'icons', 'apple-touch-icon.png');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✅ Apple touch icon generated: ${outputPath} (${size}x${size})`);
}

async function main() {
  console.log('Generating SEO images...\n');
  await generateOgImage();
  await generateAvatar();
  await generateAppleTouchIcon();
  console.log('\n🎉 All images generated successfully!');
}

main().catch((err) => {
  console.error('❌ Image generation failed:', err);
  process.exit(1);
});
