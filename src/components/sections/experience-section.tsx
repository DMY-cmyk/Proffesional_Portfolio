import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getExperience } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

function ExperienceRow({
  role,
  company,
  location,
  startDate,
  endDate,
  bullets,
}: {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  bullets: string[]
}) {
  const isNow = endDate === null
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr] py-7 border-b border-border last:border-b-0">
      <div
        className={`font-mono text-xs uppercase tracking-wider pt-1 ${
          isNow ? 'text-highlight font-semibold' : 'text-subtle'
        }`}
      >
        {formatDateRange(startDate, endDate)}
      </div>
      <div>
        <div className="font-display text-xl font-medium leading-snug">{role}</div>
        <div className="text-[15px] text-muted mb-3">
          <span className="text-foreground font-medium">{company}</span> · {location}
        </div>
        <ul className="space-y-2">
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-5 text-[15px] leading-relaxed text-[color:var(--foreground)] opacity-90"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[10px] h-[1.5px] w-2.5 bg-accent"
              />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ExperienceSection() {
  const experience = getExperience()

  return (
    <SectionWrapper id="experience">
      <SectionHeading title="Experience" sectionNumber="02" label="Work" />
      <div>
        {experience.map((exp) => (
          <ExperienceRow
            key={`${exp.company}-${exp.startDate}`}
            role={exp.role}
            company={exp.company}
            location={exp.location}
            startDate={exp.startDate}
            endDate={exp.endDate}
            bullets={exp.bullets}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
