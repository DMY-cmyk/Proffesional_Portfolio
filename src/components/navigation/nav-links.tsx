'use client'

import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
}

export function NavLinks({ items, activeSection }: NavLinksProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const isActive = activeSection && item.href === `#${activeSection}`
        return (
          <a
            key={item.href}
            href={item.href.startsWith('#') ? item.href : withBasePath(item.href)}
            className={cn(
              'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'text-muted-foreground hover:text-foreground',
              isActive && 'text-gold-500'
            )}
          >
            {item.label}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gold-500"
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