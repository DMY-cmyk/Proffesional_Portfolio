import { HeroSection } from '@/components/sections/hero-section'
import { ProfileSection } from '@/components/sections/profile-section'
import { TimelineSection } from '@/components/sections/timeline-section'
import { CertificationsSection } from '@/components/sections/certifications-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'
import { SectionDivider } from '@/components/ui/section-divider'

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <ProfileSection />
      <SectionDivider />
      <TimelineSection />
      <SectionDivider />
      <CertificationsSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ContactSection />
    </>
  )
}