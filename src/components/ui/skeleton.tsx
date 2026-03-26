import { cn } from '@/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-skeleton-shimmer rounded-md bg-muted', className)} />
}
