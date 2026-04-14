'use client'

import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import { motion } from 'framer-motion'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}

const variantStyles: Record<string, string> = {
  primary: 'bg-foreground text-background hover:bg-accent font-medium',
  secondary: 'border border-foreground text-foreground hover:bg-foreground hover:text-background font-medium',
  ghost: 'text-muted hover:text-foreground hover:bg-muted/20',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  className,
  children,
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    const resolvedHref = href.startsWith('/') ? withBasePath(href) : href
    return (
      <motion.a
        href={resolvedHref}
        className={classes}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 18 }}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.button>
  )
}
