'use client'
import type { SkillCategory } from '@/types/content'
import { cn } from '@/utils/cn'

interface Props {
  categories: SkillCategory[]
  active: string
  onChange: (ctx: string) => void
}

export function SkillsFilter({ categories, active, onChange }: Props) {
  const items = categories.flatMap((c) => c.items)
  const total = items.length
  const contextCounts = new Map<string, number>()
  let noContextCount = 0
  for (const it of items) {
    if (it.context) contextCounts.set(it.context, (contextCounts.get(it.context) ?? 0) + 1)
    else noContextCount += 1
  }
  const pills: Array<{ key: string; label: string; count: number }> = [
    { key: 'all', label: 'All', count: total },
    ...Array.from(contextCounts.entries()).map(([k, n]) => ({ key: k, label: k, count: n })),
  ]
  if (noContextCount > 0) pills.push({ key: 'none', label: '(no context)', count: noContextCount })

  return (
    <div
      className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-border"
      role="group"
      aria-label="Filter skills by context"
    >
      {pills.map((p) => {
        const isActive = p.key === active
        return (
          <button
            key={p.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(p.key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12.5px] font-medium transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'bg-surface text-foreground border-border hover:border-accent'
            )}
          >
            {p.label}
            <span
              className={cn(
                'font-mono text-[10px] font-normal',
                isActive ? 'text-background opacity-60' : 'text-subtle'
              )}
            >
              {p.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
