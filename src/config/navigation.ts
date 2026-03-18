export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

export const sectionLinks: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const pageLinks: NavItem[] = [
  { label: 'Research', href: '/research' },
]

export const allNavItems: NavItem[] = [...sectionLinks, ...pageLinks]