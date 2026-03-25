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
}

const variantStyles = {
  primary: 'bg-gold-500 text-black hover:bg-gold-600 font-medium',
  secondary: 'border border-gold-500 text-gold-accent hover:bg-gold-500/10 font-medium',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const tapAnimation = { scale: 0.97 }
const springTransition = { type: 'spring' as const, stiffness: 400, damping: 17 }

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
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 overflow-hidden relative group',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  const shineOverlay = (
    <span
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 pointer-events-none"
      aria-hidden="true"
    />
  )

  if (href) {
    const resolvedHref = href.startsWith('/') ? withBasePath(href) : href
    return (
      <motion.a
        href={resolvedHref}
        className={classes}
        whileTap={tapAnimation}
        transition={springTransition}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {shineOverlay}
        <span className="relative z-10">{children}</span>
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      whileTap={tapAnimation}
      transition={springTransition}
    >
      {shineOverlay}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}