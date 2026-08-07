'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/utils/cn'

interface WordRevealProps {
  text: string
  className?: string
  baseDelay?: number
}

export function WordReveal({ text, className, baseDelay = 0 }: WordRevealProps) {
  const reduced = useReducedMotion()
  const words = text.split(/\s+/).filter(Boolean)

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={cn('inline', className)}>
      {/* The animated words are aria-hidden, so the accessible name comes from
          this visually hidden copy. aria-label is prohibited on a plain span
          (implicit role="generic") and fails the aria-prohibited-attr audit. */}
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom"
            aria-hidden="true"
          >
            <motion.span
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: baseDelay + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  )
}
