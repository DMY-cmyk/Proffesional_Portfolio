'use client'

import { cn } from '@/utils/cn'
import { HoverGlow } from '@/components/motion/hover-glow'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ children, className, href }: CardProps) {
  const classes = cn(
    'rounded-lg border border-border bg-card p-6 transition-all duration-200',
    'hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/5',
    className
  )

  if (href) {
    return (
      <HoverGlow>
        <a href={href} className={cn(classes, 'block')}>
          {children}
        </a>
      </HoverGlow>
    )
  }

  return (
    <HoverGlow>
      <div className={classes}>{children}</div>
    </HoverGlow>
  )
}