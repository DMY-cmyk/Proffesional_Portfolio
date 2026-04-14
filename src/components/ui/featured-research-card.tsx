import Link from 'next/link'
import type { ResearchEntry } from '@/types/content'
import { formatDate } from '@/utils/format-date'

interface Props {
  entry: ResearchEntry
}

const typeLabel: Record<string, string> = {
  thesis: 'Undergraduate Thesis',
  'working-paper': 'Working Paper',
  'in-progress': 'In Progress',
  presentation: 'Presentation',
  published: 'Published',
}

export function FeaturedResearchCard({ entry }: Props) {
  const label = entry.type ? typeLabel[entry.type] ?? 'Research' : 'Research'
  return (
    <article className="relative bg-surface border border-border border-l-[3px] border-l-[color:var(--accent-highlight)] rounded-sm p-10">
      <span className="absolute -top-3 left-8 bg-[color:var(--accent-highlight)] text-white font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-medium">
        Featured · Thesis
      </span>
      <div className="flex flex-wrap gap-4 mb-4 font-mono text-[11px] uppercase tracking-widest text-subtle">
        <span>{formatDate(entry.date)}</span>
      </div>
      <h3 className="font-display text-3xl font-medium leading-tight tracking-tight mb-4 max-w-3xl">
        {entry.title}
      </h3>
      <p className="text-[color:var(--foreground)] opacity-90 text-base leading-relaxed mb-5 max-w-3xl">
        {entry.abstract}
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-background border border-border rounded-sm font-mono text-xs text-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/research/${entry.slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent font-medium hover:text-[color:var(--accent-primary-dark)]"
      >
        Read abstract →
      </Link>
    </article>
  )
}
