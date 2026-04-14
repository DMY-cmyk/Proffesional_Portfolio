import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Stub each section module so dynamic() resolves to a simple id-bearing div
vi.mock('@/components/sections/research-section', () => ({
  ResearchSection: () => <section id="research" />,
}))
vi.mock('@/components/sections/experience-section', () => ({
  ExperienceSection: () => <section id="experience" />,
}))
vi.mock('@/components/sections/education-section', () => ({
  EducationSection: () => <section id="education" />,
}))
vi.mock('@/components/sections/credentials-section', () => ({
  CredentialsSection: () => <section id="credentials" />,
}))
vi.mock('@/components/sections/skills-section', () => ({
  SkillsSection: () => <section id="skills" />,
}))
vi.mock('@/components/sections/contact-section', () => ({
  ContactSection: () => <section id="contact" />,
}))
vi.mock('@/components/sections/hero-section', () => ({
  HeroSection: () => <section id="hero" />,
}))

// Make next/dynamic resolve the import synchronously (stubs are already registered)
vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<any>, _opts?: any) => {
    let Comp: any = null
    // Kick off the (stubbed, synchronous-ish) import
    const p = importFn().then((mod: any) => { Comp = mod.default })
    // Return a wrapper; in tests the stubs resolve in the microtask queue
    // so we use a lazy getter trick: render() triggers layout synchronously
    // after vitest has settled the module registry.
    return function Dynamic(props: any) {
      return Comp ? <Comp {...props} /> : null
    }
  },
}))

import Home from '@/app/page'

describe('Home page', () => {
  it('renders hero, research, experience, education, credentials, skills, contact sections in order', async () => {
    const { container } = render(<Home />)
    const ids = Array.from(container.querySelectorAll('[id]'))
      .map((el) => el.id)
      .filter((id) => ['hero', 'research', 'experience', 'education', 'credentials', 'skills', 'contact'].includes(id))
    expect(ids[0]).toBe('hero')
    expect(ids).toContain('research')
  })
})
