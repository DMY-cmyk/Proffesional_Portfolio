import { cn } from '@/utils/cn'

interface SkillPillProps {
  name: string
  context?: string
  className?: string
}

export function SkillPill({ name, context, className }: SkillPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5',
        'text-sm font-medium text-foreground',
        'transition-colors hover:border-accent',
        className
      )}
    >
      {name}
      {context && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-subtle font-normal">
          · {context}
        </span>
      )}
    </span>
  )
}
