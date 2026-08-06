import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'
import { extractHeadings, readingTimeMinutes, slugifyHeading } from '@/lib/article-utils'
import { ReadingProgress } from '@/components/research/reading-progress'
import { TableOfContents } from '@/components/research/table-of-contents'
import { CiteThis } from '@/components/research/cite-this'
import { MdxLink } from '@/components/research/mdx-link'
import { getProfile, getEducation, getResearchEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllResearchSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const research = getResearchBySlug(slug)
  if (!research) return {}
  return {
    title: research.frontmatter.title,
    description: research.frontmatter.abstract,
    openGraph: {
      title: research.frontmatter.title,
      description: research.frontmatter.abstract,
      images: [{ url: `/og/research-${slug}.png`, width: 1200, height: 630, alt: research.frontmatter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/research-${slug}.png`],
    },
  }
}

// Recursively extract plain text from React children — headings like
// "Key **Findings**" arrive as arrays containing elements, and a naive
// children.join('') would stringify elements as "[object Object]",
// desyncing the id from extractHeadings' markdown-derived id.
function nodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return nodeText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }
  return ''
}

function headingWithId(Tag: 'h2' | 'h3') {
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag id={slugifyHeading(nodeText(children))} className="scroll-mt-28" {...props}>
        {children}
      </Tag>
    )
  }
}

const mdxComponents = { h2: headingWithId('h2'), h3: headingWithId('h3'), a: MdxLink }

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const research = getResearchBySlug(slug)
  if (!research) notFound()

  const headings = extractHeadings(research.content)
  const minutes = readingTimeMinutes(research.content)
  const profile = getProfile()
  const education = getEducation()
  const entry = getResearchEntries().find((e) => e.slug === slug)
  const citation = {
    authorName: profile.name,
    title: research.frontmatter.title,
    year: research.frontmatter.date.slice(0, 4),
    institution: education[0]?.school ?? '',
    kind: entry?.type ?? 'thesis',
  }

  return (
    <article className="py-16 px-6">
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl gap-10 xl:grid-cols-[1fr_240px]">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
          >
            ← Back to portfolio
          </Link>

          <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
            {research.frontmatter.title}
          </h1>

          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-subtle">
            {formatDate(research.frontmatter.date)} · {minutes} min read
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {research.frontmatter.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          {research.frontmatter.pdfPath && (
            <div className="mt-6">
              <Button href={research.frontmatter.pdfPath} variant="secondary" external>
                Download PDF
              </Button>
            </div>
          )}

          {headings.length >= 2 && (
            <details className="mt-8 rounded-lg border border-border p-4 xl:hidden">
              <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-subtle">
                On this page
              </summary>
              <div className="mt-3">
                <TableOfContents headings={headings} />
              </div>
            </details>
          )}

          <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
            <MDXRemote source={research.content} components={mdxComponents} />
          </div>

          <CiteThis citation={citation} />
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </article>
  )
}
