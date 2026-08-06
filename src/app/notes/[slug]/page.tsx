import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { getNoteBySlug, getAllNoteSlugs } from '@/lib/mdx'
import { readingTimeMinutes } from '@/lib/article-utils'
import { ReadingProgress } from '@/components/research/reading-progress'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) return {}
  return { title: note.frontmatter.title, description: note.frontmatter.summary }
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <article className="py-16 px-6">
      <ReadingProgress />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← All notes
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          {note.frontmatter.title}
        </h1>

        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-subtle">
          {formatDate(note.frontmatter.date)} · {readingTimeMinutes(note.content)} min read
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {note.frontmatter.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
          <MDXRemote source={note.content} />
        </div>
      </div>
    </article>
  )
}
