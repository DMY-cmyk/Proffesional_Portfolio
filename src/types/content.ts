export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  brandStatement: string
  avatar: string
  /** Tokenized headline so we can italicize/tint one phrase without embedding HTML in JSON. */
  headline?: {
    plain: string
    emphasis: string
    suffix: string
  }
  /** Single-sentence positioning line under the H1. */
  positioning?: string
  /** Three-part status ribbon in the hero. */
  statusLine?: {
    now: string
    basedIn: string
    education: string
  }
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

export interface SkillItem {
  name: string
  /** @deprecated Use `context` instead. Still present on disk for one release; not rendered. */
  level?: number
  /** E.g. "applied", "coursework", "daily", "research", "DJP". */
  context?: string
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
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
  credentialId?: string
}

export interface ProfessionalContact {
  email: string
  linkedin: string
  github: string
  location: string
}

export interface PersonalContact {
  instagram?: string
  tiktok?: string
  note?: string
}

export interface ContactInfo {
  professional: ProfessionalContact
  personal?: PersonalContact
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

export type ResearchType =
  | 'thesis'
  | 'working-paper'
  | 'in-progress'
  | 'presentation'
  | 'published'

export interface ResearchEntry {
  title: string
  slug: string
  abstract: string
  tags: string[]
  date: string
  pdfPath?: string
  type?: ResearchType
  featured?: boolean
  venue?: string
  advisor?: string
}
