import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getEducation } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

export function EducationSection() {
  const education = getEducation()

  return (
    <SectionWrapper id="education" className="bg-surface-alt">
      <SectionHeading title="Education" sectionNumber="03" label="Academic" />
      {education.map((entry) => (
        <div
          key={`${entry.school}-${entry.startDate}`}
          className="grid gap-6 md:grid-cols-[200px_1fr] py-4"
        >
          <div className="font-mono text-xs uppercase tracking-wider pt-1 text-subtle">
            {formatDateRange(entry.startDate, entry.endDate)}
          </div>
          <div>
            <h3 className="font-display text-xl font-medium leading-snug">
              {entry.degree} — {entry.field}
            </h3>
            <div className="text-[15px] text-muted mb-3">
              <span className="text-foreground font-medium">{entry.school}</span>
            </div>
            <ul className="space-y-2">
              {entry.details.map((d, i) => (
                <li
                  key={i}
                  className="relative pl-5 text-[15px] leading-relaxed text-[color:var(--foreground)] opacity-90"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[10px] h-[1.5px] w-2.5 bg-accent"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </SectionWrapper>
  )
}
