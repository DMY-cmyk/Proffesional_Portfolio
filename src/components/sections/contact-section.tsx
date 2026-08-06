'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { Button } from '@/components/ui/button'
import { getProfessionalContact, getUiStrings } from '@/data/content'
import { useLanguage } from '@/hooks/use-language'

export function ContactSection() {
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const c = getProfessionalContact()
  const linkedinHandle = c.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com/, '')
  const githubHandle = c.github.replace(/https?:\/\/(www\.)?github\.com/, '@')

  return (
    <SectionWrapper id="contact" className="bg-surface-alt">
      <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] items-start">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-medium">
            {ui.contactEyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mt-4 mb-4">
            {ui.contactHeading}
          </h2>
          <p className="text-[color:var(--foreground)] opacity-90 text-[17px] leading-relaxed max-w-xl mb-7">
            {ui.contactBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={`mailto:${c.email}`} variant="primary" size="lg">
              {ui.contactEmailMe}
            </Button>
            <Button href={c.linkedin} variant="secondary" size="lg" external>
              LinkedIn →
            </Button>
          </div>
        </div>

        <ul className="list-none p-0">
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">Email</span>
            <span className="text-foreground font-medium text-[15px]">{c.email}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">LinkedIn</span>
            <span className="text-foreground font-medium text-[15px]">{linkedinHandle}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">GitHub</span>
            <span className="text-foreground font-medium text-[15px]">{githubHandle}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">Location</span>
            <span className="text-foreground font-medium text-[15px]">{c.location}</span>
          </li>
        </ul>
      </div>
    </SectionWrapper>
  )
}
