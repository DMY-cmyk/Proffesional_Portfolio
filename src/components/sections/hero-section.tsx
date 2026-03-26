'use client'

import { motion } from 'framer-motion'
import { getProfile } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
}

function ScrollHint() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <span className="animate-scroll-hint inline-block text-muted-foreground" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </div>
  )
}

function AvatarWithGlow({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow */}
      <div className="animate-avatar-glow absolute h-64 w-64 md:h-80 md:w-80 rounded-3xl bg-gold-500/20 blur-2xl" />
      {/* Avatar */}
      <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-3xl border-2 border-gold-500/30 bg-muted shadow-lg shadow-gold-500/20">
        <img
          src={src}
          alt={alt}
          width={320}
          height={320}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

export function HeroSection() {
  const profile = getProfile()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center px-4"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Left column — text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs text-gold-accent tracking-widest uppercase"
          >
            {profile.name}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight hero-gradient-text"
          >
            {profile.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-muted-foreground max-w-md"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#certifications"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-black font-medium hover:bg-gold-600 transition-colors"
            >
              See my work
            </a>
            <a
              href="#about"
              className="inline-flex items-center px-6 py-3 rounded-full border border-border text-foreground font-medium hover:border-gold-500/50 transition-colors"
            >
              About me
            </a>
          </motion.div>
        </motion.div>

        {/* Right column — avatar */}
        <motion.div
          className="flex items-center justify-center"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          {profile.avatar && (
            <AvatarWithGlow
              src={withBasePath(profile.avatar)}
              alt={profile.name}
            />
          )}
        </motion.div>
      </div>

      <ScrollHint />
    </section>
  )
}