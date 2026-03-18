import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getResearchEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Academic and professional research work.',
}

export default function ResearchPage() {
  const entries = getResearchEntries()

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title="Research" subtitle="Academic and professional research work" />

        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.slug} href={`/research/${entry.slug}`}>
              <h3 className="text-xl font-semibold text-foreground">
                {entry.title}
              </h3>
              <p className="mt-1 text-sm text-gold-500">
                {formatDate(entry.date)}
              </p>
              <p className="mt-3 text-muted-foreground">{entry.abstract}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
