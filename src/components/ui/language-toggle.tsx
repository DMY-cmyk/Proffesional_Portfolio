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
    <div
      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((opt, i) => (
        <span key={opt.value} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-subtle">
              /
            </span>
          )}
          <button
            onClick={() => setLang(opt.value)}
            aria-pressed={lang === opt.value}
            aria-label={opt.aria}
            className={cn(
              'inline-flex min-h-11 min-w-9 items-center justify-center px-1.5 transition-colors',
              lang === opt.value
                ? 'text-accent font-semibold underline underline-offset-4'
                : 'text-subtle hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  )
}
