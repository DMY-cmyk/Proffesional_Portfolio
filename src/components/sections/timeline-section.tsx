import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { TimelineItem } from '@/components/ui/timeline-item'
import { getEducation, getExperience } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

interface TimelineEntry {
  type: 'education' | 'experience'
  title: string
  subtitle: string
  startDate: string
  endDate: string | null
  bullets: string[]
}

export function TimelineSection() {
  const education = getEducation()
  const experience = getExperience()

  const allItems: TimelineEntry[] = [
    ...education.map((e) => ({
      type: 'education' as const,
      title: `${e.degree} — ${e.field}`,
      subtitle: e.school,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.details,
    })),
    ...experience.map((e) => ({
      type: 'experience' as const,
      title: e.role,
      subtitle: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
    })),
  ].sort((a, b) => b.startDate.localeCompare(a.startDate))

  return (
    <SectionWrapper id="experience">
      <SectionHeading title="Experience & Education" />
      <div className="max-w-3xl mx-auto">
        {allItems.map((item, index) => (
          <TimelineItem
            key={`${item.type}-${item.startDate}`}
            title={item.title}
            subtitle={item.subtitle}
            dateRange={formatDateRange(item.startDate, item.endDate)}
            isLast={index === allItems.length - 1}
          >
            <ul className="list-disc list-inside space-y-1">
              {item.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </div>
    </SectionWrapper>
  )
}