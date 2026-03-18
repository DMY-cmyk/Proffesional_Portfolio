import { HeroSection } from '@/components/sections/hero-section'
import { ProfileSection } from '@/components/sections/profile-section'
import { TimelineSection } from '@/components/sections/timeline-section'
import { CertificationsSection } from '@/components/sections/certifications-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProfileSection />
      <TimelineSection />
      <CertificationsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}