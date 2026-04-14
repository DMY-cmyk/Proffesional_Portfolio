import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getCertifications, getCourses, getAwards } from '@/data/content'
import { formatDate } from '@/utils/format-date'

function CredItem({
  name,
  by,
  date,
  id,
}: {
  name: string
  by: string
  date: string
  id?: string
}) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="font-medium text-[15px] text-foreground">{name}</div>
      <div className="text-sm text-muted">
        {by} · {formatDate(date)}
      </div>
      {id && (
        <div className="font-mono text-[11px] text-subtle mt-1">{id}</div>
      )}
    </div>
  )
}

export function CredentialsSection() {
  const certs = getCertifications()
  const courses = getCourses()
  const awards = getAwards()

  return (
    <SectionWrapper id="credentials">
      <SectionHeading title="Credentials" sectionNumber="04" label="Credentials" />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Certifications
          </h3>
          {certs.map((c) => (
            <CredItem
              key={c.slug}
              name={c.name}
              by={c.issuer}
              date={c.date}
              id={c.description}
            />
          ))}
        </div>
        <div>
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Training &amp; Courses
          </h3>
          {courses.map((c) => (
            <CredItem
              key={c.name}
              name={c.name}
              by={c.provider}
              date={c.date}
              id={c.credentialId}
            />
          ))}
        </div>
      </div>
      {awards.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Awards
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {awards.map((a) => (
              <CredItem
                key={a.title}
                name={a.title}
                by={a.issuer}
                date={a.date}
                id={a.description}
              />
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
