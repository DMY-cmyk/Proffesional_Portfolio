import type {
  Profile,
  EducationEntry,
  ExperienceEntry,
  CertificationEntry,
  SkillCategory,
  AwardEntry,
  CourseEntry,
  ContactInfo,
  Downloads,
  SiteConfig,
  ResearchEntry,
} from '@/types/content'

import profileData from '@/content/profile.json'
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

export function getProfile(): Profile {
  return profileData as Profile
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