'use client'

import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ children, className, href }: CardProps) {
  const classes = cn(
    'block bg-surface border border-border rounded-md p-6',
    'transition-all hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(13,79,92,0.12)]',
    className
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return <div className={classes}>{children}</div>
}
