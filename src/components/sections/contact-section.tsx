import { SectionWrapper } from '@/components/layout/section-wrapper'
import { Button } from '@/components/ui/button'
import { getContact, getDownloads } from '@/data/content'
import { StaggerChildren } from '@/components/motion/stagger-children'

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export function ContactSection() {
  const contact = getContact()
  const downloads = getDownloads()

  return (
    <SectionWrapper id="contact">
      <div className="space-y-8">
        <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
          <span>05</span>
          <span className="h-px w-8 bg-border" />
          <span>Connect</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-foreground tracking-tight">
          Let&apos;s build<br /><em>something together.</em>
        </h2>

        <div className="flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
          <span className="text-sm text-muted-foreground">Open to opportunities</span>
        </div>

        <p className="text-muted-foreground max-w-xl">
          Always open to interesting conversations and collaboration opportunities.
        </p>

        <StaggerChildren className="flex flex-wrap gap-4">
          <Button href={contact.linkedin} variant="primary" size="lg" external>
            <span aria-label="LinkedIn">LinkedIn</span>
          </Button>
          <Button href={contact.github} variant="secondary" size="lg" external>
            <span aria-label="GitHub">GitHub</span>
          </Button>
          <Button href={`mailto:${contact.email}`} variant="secondary" size="lg">
            <span aria-label="Email">✉ Email Me</span>
          </Button>
          {contact.instagram && (
            <Button href={contact.instagram} variant="ghost" size="lg" external>
              Instagram
            </Button>
          )}
          {contact.tiktok && (
            <Button href={contact.tiktok} variant="ghost" size="lg" external>
              TikTok
            </Button>
          )}
        </StaggerChildren>

        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">Download my documents:</p>
          <StaggerChildren className="flex flex-wrap gap-4">
            {downloads.items.map((item) => (
              <Button key={item.filePath} href={item.filePath} variant="primary" size="lg" external>
                <DownloadIcon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </SectionWrapper>
  )
}