export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  brandStatement: string
  avatar: string
}

export interface EducationEntry {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  details: string[]
  logo?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate: string | null
  location: string
  bullets: string[]
  logo?: string
}

export interface CertificationEntry {
  name: string
  issuer: string
  date: string
  documentPath: string
  slug: string
  description?: string
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface AwardEntry {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface CourseEntry {
  name: string
  provider: string
  date: string
  certificateUrl?: string
}

export interface ContactInfo {
  email: string
  linkedin: string
  github: string
  instagram?: string
  tiktok?: string
}

export interface DownloadItem {
  label: string
  filePath: string
  icon: string
  format: string
}

export interface Downloads {
  items: DownloadItem[]
}

export interface SiteConfig {
  title: string
  description: string
  url: string
  ogImage: string
  locale: string
}

export interface ResearchEntry {
  title: string
  slug: string
  abstract: string
  tags: string[]
  date: string
  pdfPath?: string
}