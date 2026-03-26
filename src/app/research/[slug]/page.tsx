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
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/research"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover-gold-accent transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Research
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {research.frontmatter.title}
        </h1>

        <p className="mt-3 text-gold-accent font-medium">{formatDate(research.frontmatter.date)}</p>

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

        <div className="mt-10 border-t border-border pt-10">
          <div className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-gold-accent prose-strong:text-foreground">
            <MDXRemote source={research.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
