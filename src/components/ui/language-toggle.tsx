'use client'

import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/utils/cn'
import type { Lang } from '@/lib/i18n'

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: 'en', label: 'EN', aria: 'Switch to English' },
  { value: 'id', label: 'ID', aria: 'Beralih ke Bahasa Indonesia' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="inline-flex items-center rounded-md border border-border font-mono text-[11px] uppercase tracking-wider" role="group" aria-label="Language">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          aria-pressed={lang === opt.value}
          aria-label={opt.aria}
          className={cn(
            'inline-flex min-h-11 min-w-9 items-center justify-center px-2.5 transition-colors',
            lang === opt.value
              ? 'text-accent font-semibold'
              : 'text-muted hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
