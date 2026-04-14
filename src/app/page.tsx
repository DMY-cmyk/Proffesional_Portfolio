import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero-section'
import { Skeleton } from '@/components/ui/skeleton'

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Skeleton className="mb-6 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

const ResearchSection = dynamic(
  () => import('@/components/sections/research-section').then((m) => ({ default: m.ResearchSection })),
  { loading: () => <SectionSkeleton /> }
)
const ExperienceSection = dynamic(
  () => import('@/components/sections/experience-section').then((m) => ({ default: m.ExperienceSection })),
  { loading: () => <SectionSkeleton /> }
)
const EducationSection = dynamic(
  () => import('@/components/sections/education-section').then((m) => ({ default: m.EducationSection })),
  { loading: () => <SectionSkeleton /> }
)
const CredentialsSection = dynamic(
  () => import('@/components/sections/credentials-section').then((m) => ({ default: m.CredentialsSection })),
  { loading: () => <SectionSkeleton /> }
)
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then((m) => ({ default: m.SkillsSection })),
  { loading: () => <SectionSkeleton /> }
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then((m) => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
)

export default function Home() {
  return (
    <>
      <HeroSection />
      <ResearchSection />
      <ExperienceSection />
      <EducationSection />
      <CredentialsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
