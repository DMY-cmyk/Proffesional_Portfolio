'use client'

import Link from 'next/link'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { allNavItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const hasScrolled = scrollProgress > 0.01

  return (
    <header
      className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] rounded-xl md:top-3.5 md:w-[min(1200px,calc(100vw-40px))] md:rounded-2xl bg-background/50 backdrop-blur-2xl backdrop-saturate-150 border border-border dark:border-white/10 shadow-lg shadow-black/5 transition-all duration-300 ${
        hasScrolled ? 'bg-background/65 shadow-xl shadow-black/10' : ''
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16">
        <Link href="/" className="text-lg font-bold font-display text-gold-accent">
          DM
        </Link>
        <div className="flex items-center gap-2">
          <NavLinks items={allNavItems} activeSection={activeSection} />
          <ThemeToggle />
          <MobileMenu items={allNavItems} activeSection={activeSection} />
        </div>
      </div>
      <div
        data-testid="scroll-progress"
        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gold-500 transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}