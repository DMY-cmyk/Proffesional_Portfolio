'use client'

import { motion } from 'framer-motion'
import { Children } from 'react'
import { cn } from '@/utils/cn'

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'left'
}

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay } },
})

const itemUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
}

const itemLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45 },
  },
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.06,
  direction = 'up',
}: StaggerChildrenProps) {
  const itemVariant = direction === 'left' ? itemLeft : itemUp

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants(staggerDelay)}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariant}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
