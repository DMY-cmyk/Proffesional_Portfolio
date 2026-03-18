import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProfile } from '@/data/content'

export function ProfileSection() {
  const profile = getProfile()

  return (
    <SectionWrapper id="about">
      <SectionHeading title="About Me" />
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>
        <blockquote className="mt-8 text-xl italic text-gold-500 font-medium">
          &ldquo;{profile.brandStatement}&rdquo;
        </blockquote>
      </div>
    </SectionWrapper>
  )
}