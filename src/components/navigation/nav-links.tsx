'use client'

import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import {
  resolveNavHref,
  isPageLinkActive,
  isSectionLinkActive,
} from '@/config/navigation'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
  pathname?: string
}

export function NavLinks({ items, activeSection, pathname = '/' }: NavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {items.map((item) => {
        const isSectionActive = isSectionLinkActive(item.href, pathname, activeSection)
        const isPageActive = isPageLinkActive(item.href, pathname)
        const isActive = isSectionActive || isPageActive
        return (
          <a
            key={item.href}
            href={resolveNavHref(item.href, pathname)}
            aria-current={isPageActive ? 'page' : isSectionActive ? 'location' : undefined}
            className={cn(
              'relative px-3 py-2 text-sm font-medium rounded-md transition-colors link-underline',
              'text-muted hover:text-foreground',
              isActive && 'text-accent'
            )}
          >
            {item.label}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-accent"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </a>
        )
      })}
    </nav>
  )
}
