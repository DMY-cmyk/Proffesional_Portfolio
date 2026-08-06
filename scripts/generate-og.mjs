import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/research/index.json'), 'utf-8'))
const profile = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/profile.json'), 'utf-8'))
const OUT_DIR = path.join(ROOT, 'public/og')

fs.mkdirSync(OUT_DIR, { recursive: true })

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function wrapTitle(title, maxChars = 32, maxLines = 4) {
  const words = title.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = (line + ' ' + word).trim()
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'
  }
  return lines
}

function ogSvg(title, authorName) {
  const lines = wrapTitle(title)
  const titleSpans = lines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 64}">${escapeXml(l)}</tspan>`)
    .join('')
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf9f4"/>
  <rect x="0" y="0" width="1200" height="8" fill="#b8944a"/>
  <text x="80" y="120" font-family="Georgia, serif" font-size="26" letter-spacing="6" fill="#b8944a">RESEARCH</text>
  <text x="80" y="240" font-family="Georgia, serif" font-size="54" font-weight="500" fill="#0d4f5c">${titleSpans}</text>
  <text x="80" y="560" font-family="Georgia, serif" font-size="30" fill="#1a1a1a">${escapeXml(authorName)}</text>
</svg>`
}

for (const entry of entries) {
  const svg = ogSvg(entry.title, profile.name)
  const out = path.join(OUT_DIR, `research-${entry.slug}.png`)
  await sharp(Buffer.from(svg)).png().toFile(out)
  console.log(`og: wrote ${path.relative(ROOT, out)}`)
}
