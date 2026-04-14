import type { Metadata } from 'next'
import Link from 'next/link'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'
import { ResearchCard } from '@/components/ui/research-card'
import { getResearchEntries } from '@/data/content'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Academic and professional research work.',
}

export default function ResearchPage() {
  const entries = getResearchEntries()
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const others = entries.filter((e) => e !== featured)

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          Research
        </h1>
        <p className="mt-2 text-muted text-base">Academic and professional research work.</p>

        {featured && (
          <div className="mt-12">
            <FeaturedResearchCard entry={featured} />
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
