'use client'

import Link from 'next/link'
import { getUiStrings } from '@/data/content'
import { useLanguage } from '@/hooks/use-language'

export function Footer() {
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 py-8 px-6">
      <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-3 font-mono text-xs text-subtle">
        <span>© {year} Dzaki Muhammad Yusfian</span>
        <div className="flex items-center gap-4">
          <span>{ui.footerBuiltWith}</span>
          <Link
            href="/personal"
            className="text-muted hover:text-accent transition-colors"
          >
            {ui.footerPersonal}
          </Link>
        </div>
      </div>
    </footer>
  )
}
