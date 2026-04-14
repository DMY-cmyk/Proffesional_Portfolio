'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function NotFound() {
  return (
    <>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative z-10">
        <motion.h1
          className="text-8xl md:text-9xl font-bold hero-gradient-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          404
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page not found
        </motion.p>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </motion.div>
      </div>
    </>
  )
}
