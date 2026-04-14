import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'
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
  }
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const research = getResearchBySlug(slug)

  if (!research) {
    notFound()
  }

  return (
    <article className="py-16 px-6">
      <div className="mx-auto max-w-3xl">
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
          {formatDate(research.frontmatter.date)}
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

        <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
          <MDXRemote source={research.content} />
        </div>
      </div>
    </article>
  )
}
