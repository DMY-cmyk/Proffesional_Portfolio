import Link from 'next/link'
import type { ResearchEntry } from '@/types/content'

interface Props {
  entry: ResearchEntry
}

const typeLabel: Record<string, string> = {
  thesis: 'Thesis',
  'working-paper': 'Working Paper',
  'in-progress': 'In Progress',
  presentation: 'Presentation',
  published: 'Published',
}

export function ResearchCard({ entry }: Props) {
  const year = entry.date.slice(0, 4)
  const label = entry.type ? typeLabel[entry.type] ?? 'Research' : 'Research'
  return (
    <Link
      href={`/research/${entry.slug}`}
      className="block bg-surface border border-border rounded-sm p-6 transition-all hover:border-accent hover:-translate-y-0.5"
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-subtle mb-2.5">
        {label} · {year}
      </div>
      <h4 className="font-display text-xl font-medium leading-snug mb-2.5">
        {entry.title}
      </h4>
      <p className="text-sm text-muted leading-relaxed">{entry.abstract}</p>
    </Link>
  )
}
