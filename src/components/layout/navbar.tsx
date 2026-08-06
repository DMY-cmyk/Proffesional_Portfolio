'use client'

import Link from 'next/link'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { allNavItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { withBasePath } from '@/lib/base-path'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const hasScrolled = scrollProgress > 0.01

  return (
    <header
      className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] rounded-xl md:top-3.5 md:w-[min(1200px,calc(100vw-40px))] md:rounded-2xl bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border border-border shadow-sm transition-all duration-300 ${
        hasScrolled ? 'bg-background/85 shadow-[0_4px_16px_-8px_rgba(15,20,25,0.15)]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-5 h-14">
        <Link
          href="/"
          className="text-lg font-display font-medium text-foreground"
          aria-label="Dzaki Muhammad Yusfian — Home"
        >
          Dzaki<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <NavLinks items={allNavItems} activeSection={activeSection} />
          <button
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            className="hidden md:inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-subtle hover:text-accent hover:border-accent transition-colors"
            aria-label="Open command palette"
          >
            Ctrl K
          </button>
          <a
            href={withBasePath('/files/cv/dzaki-cv.pdf')}
            download
            className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider font-medium hover:bg-accent transition-colors"
            aria-label="Download CV"
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
            CV
          </a>
          <ThemeToggle />
          <MobileMenu items={allNavItems} activeSection={activeSection} />
        </div>
      </div>
      <div
        data-testid="scroll-progress"
        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}
