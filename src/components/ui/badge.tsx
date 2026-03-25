import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        'bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 text-gold-500 border border-gold-500/20',
        'bg-[length:200%_100%] animate-[badge-shimmer_3s_ease-in-out_infinite]',
        'transition-colors duration-200 hover:bg-gold-500/20 hover:border-gold-500/30',
        className
      )}
    >
      {children}
    </span>
  )
}