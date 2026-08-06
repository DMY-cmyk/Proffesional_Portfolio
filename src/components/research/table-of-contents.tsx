'use client'

import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { cn } from '@/utils/cn'
import type { ArticleHeading } from '@/lib/article-utils'

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  const ids = headings.map((h) => h.id)
  const active = useScrollSpy(ids)

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-subtle">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l pl-3 leading-snug transition-colors',
                h.level === 3 && 'pl-6',
                active === h.id
                  ? 'border-accent text-accent font-medium'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
