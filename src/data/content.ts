import type {
  Profile,
  RawProfile,
  EducationEntry,
  ExperienceEntry,
  CertificationEntry,
  SkillCategory,
  AwardEntry,
  CourseEntry,
  ContactInfo,
  ProfessionalContact,
  PersonalContact,
  Downloads,
  SiteConfig,
  ResearchEntry,
  StatEntry,
  NoteEntry,
  TestimonialEntry,
} from '@/types/content'
import { pickLang, type Lang } from '@/lib/i18n'

import profileData from '@/content/profile.json'
import uiStringsData from '@/content/ui-strings.json'
import educationData from '@/content/education.json'
import experienceData from '@/content/experience.json'
import certificationsData from '@/content/certifications.json'
import skillsData from '@/content/skills.json'
import awardsData from '@/content/awards.json'
import coursesData from '@/content/courses.json'
import contactData from '@/content/contact.json'
import downloadsData from '@/content/downloads.json'
import siteData from '@/content/site.json'
import researchData from '@/content/research/index.json'
import noteData from '@/content/notes/index.json'
import testimonialsData from '@/content/testimonials.json'

export function getProfile(lang: Lang = 'en'): Profile {
  const raw = profileData as unknown as RawProfile
  return {
    ...raw,
    title: pickLang(raw.title, lang),
    tagline: pickLang(raw.tagline, lang),
    bio: pickLang(raw.bio, lang),
    brandStatement: pickLang(raw.brandStatement, lang),
    positioning: raw.positioning ? pickLang(raw.positioning, lang) : undefined,
    headline: raw.headline && {
      plain: pickLang(raw.headline.plain, lang),
      emphasis: pickLang(raw.headline.emphasis, lang),
      suffix: raw.headline.suffix,
    },
  }
}

export function getEducation(): EducationEntry[] {
  return educationData as EducationEntry[]
}

export function getExperience(): ExperienceEntry[] {
  return experienceData as ExperienceEntry[]
}

export function getCertifications(): CertificationEntry[] {
  return certificationsData as CertificationEntry[]
}

export function getSkills(): SkillCategory[] {
  return skillsData as SkillCategory[]
}

export function getAwards(): AwardEntry[] {
  return awardsData as AwardEntry[]
}

export function getCourses(): CourseEntry[] {
  return coursesData as CourseEntry[]
}

export function getContact(): ContactInfo {
  return contactData as ContactInfo
}

export function getDownloads(): Downloads {
  return downloadsData as Downloads
}

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig
}

export function getResearchEntries(): ResearchEntry[] {
  return researchData as ResearchEntry[]
}

export function getNoteEntries(): NoteEntry[] {
  return noteData as NoteEntry[]
}

export function getProfessionalContact(): ProfessionalContact {
  return getContact().professional
}

export function getPersonalContact(): PersonalContact | undefined {
  return getContact().personal
}

export function getStats(lang: Lang = 'en'): StatEntry[] {
  const ui = getUiStrings(lang)
  const experience = getExperience() // lang param arrives in Task 5; counts are language-independent
  const earliestYear = Math.min(
    ...experience.map((e) => new Date(e.startDate).getFullYear())
  )
  const years = Math.max(1, new Date().getFullYear() - earliestYear)
  return [
    { label: ui.statYears, value: years, suffix: '+' },
    { label: ui.statPositions, value: experience.length },
    { label: ui.statCertifications, value: getCertifications().length },
    { label: ui.statResearch, value: getResearchEntries().length },
  ]
}

export function getTestimonials(): TestimonialEntry[] {
  return testimonialsData as TestimonialEntry[]
}

export type UiStrings = typeof uiStringsData.en

export function getUiStrings(lang: Lang): UiStrings {
  return lang === 'id'
    ? { ...uiStringsData.en, ...uiStringsData.id }
    : uiStringsData.en
}