'use client'

import { cn } from '@/utils/cn'
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
  secondary: 'border border-gold-500 text-gold-500 hover:bg-gold-500/10 font-medium',
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
    'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileTap={tapAnimation}
        transition={springTransition}
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
      whileTap={tapAnimation}
      transition={springTransition}
    >
      {children}
    </motion.button>
  )
}