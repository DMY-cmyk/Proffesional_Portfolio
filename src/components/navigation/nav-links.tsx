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
  condensed?: boolean
}

export function NavLinks({
  items,
  activeSection,
  pathname = '/',
  condensed = false,
}: NavLinksProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex w-full items-center font-mono uppercase',
        condensed
          ? 'gap-4 text-[10.5px] tracking-[0.13em]'
          : 'gap-6 text-[11px] tracking-[0.14em]'
      )}
    >
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
              'group relative inline-flex h-full min-h-[42px] items-center gap-1 transition-colors',
              'text-muted hover:text-foreground',
              isActive && 'text-accent font-medium',
              item.isSecondary && 'ml-auto'
            )}
          >
            {item.label}
            {item.isSecondary && (
              <span aria-hidden="true" className="text-highlight">
                ↗
              </span>
            )}
            <span
              data-testid="hover-underline"
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-nav-underline',
                'transition-transform duration-200 motion-reduce:transition-none',
                !isActive && 'group-hover:scale-x-100 group-focus-visible:scale-x-100'
              )}
            />
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
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
