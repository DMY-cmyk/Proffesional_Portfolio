import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium',
        'bg-background border border-border text-foreground font-mono',
        'transition-colors',
        className
      )}
    >
      {children}
    </span>
  )
}
