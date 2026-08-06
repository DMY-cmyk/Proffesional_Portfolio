import type { UiStrings } from '@/data/content'

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
  key?: keyof UiStrings
}

export const sectionLinks: NavItem[] = [
  { label: 'Research', href: '#research', key: 'navResearch' },
  { label: 'Experience', href: '#experience', key: 'navExperience' },
  { label: 'Education', href: '#education', key: 'navEducation' },
  { label: 'Credentials', href: '#credentials', key: 'navCredentials' },
  { label: 'Skills', href: '#skills', key: 'navSkills' },
  { label: 'Contact', href: '#contact', key: 'navContact' },
]

export const pageLinks: NavItem[] = [
  { label: 'Research', href: '/research', key: 'navResearch' },
  { label: 'Notes', href: '/notes', key: 'navNotes' },
]

export const allNavItems: NavItem[] = [...sectionLinks, ...pageLinks]
