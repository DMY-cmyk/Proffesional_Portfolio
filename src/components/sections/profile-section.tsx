import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProfile } from '@/data/content'

export function ProfileSection() {
  const profile = getProfile()

  return (
    <SectionWrapper id="about">
      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2">
          <SectionHeading title="About Me" sectionNumber="01" label="Who I am" />
        </div>
        <div className="md:col-span-3">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
          <div className="mt-10">
            <blockquote className="border-l-2 border-gold-500 pl-6 text-2xl md:text-3xl font-display italic text-gold-500">
              {profile.brandStatement}
            </blockquote>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}