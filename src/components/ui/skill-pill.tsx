import { cn } from '@/utils/cn'

interface SkillPillProps {
  name: string
  context?: string
  className?: string
  filterContext?: string
}

type FilterState = 'default' | 'match' | 'dim'

function getFilterState(filterContext: string | undefined, context: string | undefined): FilterState {
  if (filterContext === undefined || filterContext === 'all') return 'default'
  if (filterContext === 'none') return context === undefined ? 'match' : 'dim'
  return filterContext === context ? 'match' : 'dim'
}

export function SkillPill({ name, context, className, filterContext }: SkillPillProps) {
  const state = getFilterState(filterContext, context)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5',
        'text-sm font-medium text-foreground',
        'transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-accent',
        state === 'dim' && 'opacity-[0.22] scale-[0.96]',
        state === 'match' && 'border-accent bg-[#edf6f7]',
        className
      )}
    >
      {name}
      {context && (
        <span
          className={cn(
            'font-mono text-[10px] uppercase tracking-wider text-subtle font-normal',
            state === 'match' && 'text-accent'
          )}
        >
          · {context}
        </span>
      )}
    </span>
  )
}
