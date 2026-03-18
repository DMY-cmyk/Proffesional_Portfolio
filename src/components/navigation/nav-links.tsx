import { cn } from '@/utils/cn'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
}

export function NavLinks({ items, activeSection }: NavLinksProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground',
            activeSection && item.href === `#${activeSection}` && 'text-gold-500'
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}