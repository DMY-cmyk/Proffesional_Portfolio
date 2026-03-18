'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface HoverGlowProps {
  children: React.ReactNode
  className?: string
}

export function HoverGlow({ children, className }: HoverGlowProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('group relative', className)}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-lg bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      {children}
    </motion.div>
  )
}
