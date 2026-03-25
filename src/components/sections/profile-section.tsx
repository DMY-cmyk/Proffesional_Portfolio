import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProfile } from '@/data/content'

export function ProfileSection() {
  const profile = getProfile()

  return (
    <SectionWrapper id="about">
      <SectionHeading title="About Me" sectionNumber="01" label="Who I am" />
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>
        <div className="mt-10 relative">
          <span className="absolute -top-4 -left-2 text-5xl text-gold-500/20 font-serif select-none" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="rounded-lg border border-gold-500/20 bg-gold-500/5 px-8 py-6 text-xl italic text-gold-500 font-medium">
            {profile.brandStatement}
          </blockquote>
          <span className="absolute -bottom-6 -right-2 text-5xl text-gold-500/20 font-serif select-none" aria-hidden="true">
            &rdquo;
          </span>
        </div>
      </div>
    </SectionWrapper>
  )
}