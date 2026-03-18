import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const RESEARCH_DIR = path.join(process.cwd(), 'src/content/research')

export function getAllResearchSlugs(): string[] {
  if (!fs.existsSync(RESEARCH_DIR)) return []

  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export interface ResearchMdxData {
  slug: string
  content: string
  frontmatter: {
    title: string
    date: string
    abstract: string
    tags: string[]
    pdfPath?: string
  }
}

export function getResearchBySlug(slug: string): ResearchMdxData | null {
  const filePath = path.join(RESEARCH_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    content,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      abstract: data.abstract || '',
      tags: data.tags || [],
      pdfPath: data.pdfPath,
    },
  }
}
