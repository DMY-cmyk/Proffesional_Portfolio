import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/ui/section-divider'
import { Skeleton } from '@/components/ui/skeleton'

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Skeleton className="mb-8 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

const ProfileSection = dynamic(
  () => import('@/components/sections/profile-section').then(m => ({ default: m.ProfileSection })),
  { loading: () => <SectionSkeleton /> }
)
const TimelineSection = dynamic(
  () => import('@/components/sections/timeline-section').then(m => ({ default: m.TimelineSection })),
  { loading: () => <SectionSkeleton /> }
)
const CertificationsSection = dynamic(
  () => import('@/components/sections/certifications-section').then(m => ({ default: m.CertificationsSection })),
  { loading: () => <SectionSkeleton /> }
)
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then(m => ({ default: m.SkillsSection })),
  { loading: () => <SectionSkeleton /> }
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(m => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
)

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