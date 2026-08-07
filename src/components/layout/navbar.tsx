'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, LayoutGroup } from 'framer-motion'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useCondensedNav } from '@/hooks/use-condensed-nav'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useLanguage } from '@/hooks/use-language'
import { getUiStrings } from '@/data/content'
import { navbarItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { withBasePath } from '@/lib/base-path'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

function DownloadIcon() {
  return (
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
  )
}

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const condensed = useCondensedNav()
  const reducedMotion = useReducedMotion()
  const pathname = usePathname() ?? '/'
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const localizedItems = navbarItems.map((item) => ({
    ...item,
    label: item.key ? ui[item.key] : item.label,
  }))

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 32 }

  const navRow = (
    <NavLinks
      items={localizedItems}
      activeSection={activeSection}
      pathname={pathname}
      condensed={condensed}
    />
  )

  return (
    <header
      data-condensed={condensed}
      className="fixed inset-x-0 top-0 z-50 bg-background"
    >
      <LayoutGroup>
        <div className="mx-auto max-w-[1120px] px-5 md:px-7">
          {/* Tier 1 — identity row */}
          <div
            className={`flex items-center justify-between transition-[padding] duration-300 ${
              condensed ? 'py-1.5' : 'py-2.5 lg:py-3.5'
            }`}
          >
            <Link
              href="/"
              className="flex flex-col justify-center"
              aria-label="Dzaki Yusfian — Home"
            >
              <motion.span
                layout
                transition={spring}
                className={`font-display font-medium leading-tight text-foreground ${
                  condensed ? 'text-lg' : 'text-lg md:text-[23px]'
                }`}
              >
                Dzaki Yusfian<span className="text-accent">.</span>
              </motion.span>
              {!condensed && (
                <span
                  aria-hidden="true"
                  className="mt-0.5 hidden min-[360px]:block font-mono text-[10px] md:text-[10.5px] leading-none uppercase tracking-[0.18em] text-subtle"
                >
                  {ui.brandTagline}
                </span>
              )}
            </Link>

            {/* Condensed: links move inline between brand and utilities (lg+) */}
            {condensed && (
              <motion.div
                layoutId="masthead-nav"
                transition={spring}
                className="hidden lg:flex mx-8 flex-1"
              >
                {navRow}
              </motion.div>
            )}

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              <div className="md:border-l md:border-border md:pl-3">
                <ThemeToggle />
              </div>
              <a
                href={withBasePath('/files/cv/dzaki-cv.pdf')}
                download
                className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background px-3.5 py-2 rounded-[4px] text-[11px] font-mono uppercase tracking-[0.1em] font-medium hover:bg-accent transition-colors"
                aria-label="Download CV"
              >
                <DownloadIcon />
                {condensed ? 'CV' : ui.downloadCv}
              </a>
              <MobileMenu
                items={localizedItems}
                activeSection={activeSection}
                pathname={pathname}
              />
            </div>
          </div>

          {/* Hairline + Tier 2 — navigation row (expanded, lg+) */}
          {!condensed && (
            <>
              <div className="hidden lg:block border-b border-border" />
              <motion.div
                layoutId="masthead-nav"
                transition={spring}
                className="hidden lg:flex h-[42px] items-stretch"
              >
                {navRow}
              </motion.div>
            </>
          )}
        </div>

        {/* Bottom ink rule + scroll progress */}
        <div className="relative h-0.5 bg-foreground">
          <div
            data-testid="scroll-progress"
            className="absolute left-0 top-0 h-full bg-accent"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </LayoutGroup>
    </header>
  )
}
