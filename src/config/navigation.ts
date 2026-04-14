export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

export const sectionLinks: NavItem[] = [
  { label: 'Research', href: '#research' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const pageLinks: NavItem[] = [
  { label: 'Research', href: '/research' },
]

export const allNavItems: NavItem[] = [...sectionLinks, ...pageLinks]