export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → label
    .replace(/[*_`~]/g, '')
    .trim()
}

export function extractHeadings(markdown: string): ArticleHeading[] {
  const headings: ArticleHeading[] = []
  const pattern = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = pattern.exec(markdown)) !== null) {
    const text = stripMarkdown(match[2])
    headings.push({
      id: slugifyHeading(text),
      text,
      level: match[1].length as 2 | 3,
    })
  }
  return headings
}

export function readingTimeMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export interface CitationInput {
  authorName: string
  title: string
  year: string
  institution: string
  kind: string
}

export function apaAuthor(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  const last = parts[parts.length - 1]
  const initials = parts
    .slice(0, -1)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(' ')
  return `${last}, ${initials}`
}

function kindLabel(kind: string): string {
  return kind === 'thesis' ? 'Undergraduate thesis' : kind.charAt(0).toUpperCase() + kind.slice(1)
}

export function buildApaCitation(c: CitationInput): string {
  return `${apaAuthor(c.authorName)} (${c.year}). ${c.title} [${kindLabel(c.kind)}, ${c.institution}].`
}

export function buildBibtex(c: CitationInput): string {
  const lastName = c.authorName.trim().split(/\s+/).pop()?.toLowerCase() ?? 'author'
  return [
    `@thesis{${lastName}${c.year},`,
    `  author = {${c.authorName}},`,
    `  title = {${c.title}},`,
    `  year = {${c.year}},`,
    `  school = {${c.institution}},`,
    `  type = {${kindLabel(c.kind)}}`,
    `}`,
  ].join('\n')
}
