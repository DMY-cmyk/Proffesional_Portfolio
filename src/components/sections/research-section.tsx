'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'
import { ResearchCard } from '@/components/ui/research-card'
import { getResearchEntries, getUiStrings } from '@/data/content'
import { useLanguage } from '@/hooks/use-language'

export function ResearchSection() {
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const entries = getResearchEntries()
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const others = entries.filter((e) => e !== featured)

  if (!featured) return null

  return (
    <SectionWrapper id="research" className="bg-surface-alt">
      <SectionHeading title={ui.sectionResearch} sectionNumber="01" label="Research" />
      <FeaturedResearchCard entry={featured} />
      {others.length > 0 && (
        <div
          data-testid="research-secondary-grid"
          className="grid gap-4 md:grid-cols-2 mt-6"
        >
          {others.map((entry) => (
            <ResearchCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
