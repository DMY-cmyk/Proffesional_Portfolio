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
