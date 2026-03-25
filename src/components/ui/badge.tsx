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
        'bg-gold-500 text-black/90 border border-gold-500/30 font-semibold',
        'dark:bg-gradient-to-r dark:from-gold-500/10 dark:via-gold-500/20 dark:to-gold-500/10 dark:text-gold-500 dark:border-gold-500/20',
        'dark:bg-[length:200%_100%] dark:animate-[badge-shimmer_3s_ease-in-out_infinite]',
        'transition-colors duration-200 hover:bg-gold-600 dark:hover:bg-gold-500/20 dark:hover:border-gold-500/30',
        className
      )}
    >
      {children}
    </span>
  )
}