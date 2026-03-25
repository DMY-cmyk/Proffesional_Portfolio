import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { StaggerChildren } from '@/components/motion/stagger-children'

export function CertificationsSection() {
  const certifications = getCertifications()

  return (
    <SectionWrapper id="certifications">
      <SectionHeading title="Certifications" sectionNumber="03" label="Credentials" />
      <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.slug} href={`/certifications/${cert.slug}`}>
            <h3 className="text-lg font-semibold text-foreground">
              {cert.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
            <p className="mt-2 text-sm text-gold-500">{formatDate(cert.date)}</p>
            {cert.description && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {cert.description}
              </p>
            )}
          </Card>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  )
}