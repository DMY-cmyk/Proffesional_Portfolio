import type { UiStrings } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

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

// Header link list: sections + Notes. The /research page link is intentionally
// omitted (deduped) — it stays reachable via the command palette (allNavItems)
// and the homepage research section's "View all research →" link.
export const navbarItems: NavItem[] = [
  ...sectionLinks,
  { label: 'Notes', href: '/notes', key: 'navNotes' },
]

export function resolveNavHref(href: string, pathname: string): string {
  if (href.startsWith('#')) {
    return pathname === '/' ? href : withBasePath(`/${href}`)
  }
  return withBasePath(href)
}

export function isPageLinkActive(href: string, pathname: string): boolean {
  if (href.startsWith('#')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}
