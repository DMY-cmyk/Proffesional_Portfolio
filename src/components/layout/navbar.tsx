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
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-shadow duration-300 ${
        hasScrolled ? 'shadow-md shadow-black/5' : ''
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-lg font-bold text-gold-500">
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
        className="absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}