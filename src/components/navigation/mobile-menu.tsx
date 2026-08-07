'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import {
  resolveNavHref,
  isPageLinkActive,
  isSectionLinkActive,
} from '@/config/navigation'
import { useLanguage } from '@/hooks/use-language'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { getUiStrings } from '@/data/content'
import { LanguageToggle } from '@/components/ui/language-toggle'
import type { NavItem } from '@/config/navigation'

interface MobileMenuProps {
  items: NavItem[]
  activeSection?: string
  pathname?: string
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileMenu({ items, activeSection, pathname = '/' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)

  const sections = items.filter((item) => item.href.startsWith('#'))
  const pages = items.filter((item) => !item.href.startsWith('#'))

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || active === panel)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const renderGroup = (
    number: string,
    label: string,
    labelId: string,
    groupItems: NavItem[],
    baseIndex: number
  ) => (
    <div>
      <p
        id={labelId}
        className="mb-2 border-b border-border pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle"
      >
        {number} — {label}
      </p>
      <nav aria-labelledby={labelId} className="flex flex-col gap-1">
        {groupItems.map((item, i) => {
          const isSection = isSectionLinkActive(item.href, pathname, activeSection)
          const isPage = isPageLinkActive(item.href, pathname)
          return (
            <motion.div
              key={item.href}
              initial={reducedMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.05 + (baseIndex + i) * 0.04 }}
            >
              <a
                href={resolveNavHref(item.href, pathname)}
                onClick={close}
                aria-current={isPage ? 'page' : isSection ? 'location' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2 py-1.5 font-display text-[22px] transition-colors',
                  'text-muted hover:text-foreground',
                  (isSection || isPage) && 'text-accent'
                )}
              >
                {item.label}
                {item.isSecondary && (
                  <span aria-hidden="true" className="text-highlight text-base">
                    ↗
                  </span>
                )}
              </a>
            </motion.div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-muted hover:text-foreground transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
          )}
        </svg>
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={close}
                  className="fixed inset-0 bg-black/50 z-40"
                />
                <motion.div
                  ref={panelRef}
                  tabIndex={-1}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 320, damping: 32 }
                  }
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation menu"
                  className="fixed inset-y-0 right-0 w-72 sm:w-80 overflow-y-auto bg-background border-l-2 border-foreground z-50 p-6 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                      {ui.navMenuLabel}
                    </p>
                    <button
                      onClick={close}
                      className="p-2.5 -mr-2.5 text-muted hover:text-foreground transition-colors"
                      aria-label="Close menu"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col gap-8 mt-8">
                    {renderGroup('01', ui.navGroupSections, 'mobile-nav-sections', sections, 0)}
                    {pages.length > 0 &&
                      renderGroup('02', ui.navGroupPages, 'mobile-nav-pages', pages, sections.length)}
                  </div>
                  <a
                    href={withBasePath('/files/cv/dzaki-cv.pdf')}
                    download
                    onClick={close}
                    className="mt-10 flex w-full items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-[4px] text-xs font-mono uppercase tracking-wider font-medium hover:bg-accent transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
                    </svg>
                    {ui.downloadCv}
                  </a>
                  <div className="mt-6 pt-6 border-t border-border flex justify-center">
                    <LanguageToggle />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
