'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const full = {
  hidden: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

const reducedVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' as const } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const variants = reduced ? reducedVariants : full

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={variants} initial="hidden" animate="enter" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
