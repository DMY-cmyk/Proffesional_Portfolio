import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { getContact, getDownloads } from '@/data/content'

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
      <SectionHeading title="Get In Touch" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button href={`mailto:${contact.email}`} variant="secondary" size="lg">
            <span aria-label="Email">✉ Email Me</span>
          </Button>
          <Button href={contact.linkedin} variant="secondary" size="lg" external>
            <span aria-label="LinkedIn">LinkedIn</span>
          </Button>
          <Button href={contact.github} variant="secondary" size="lg" external>
            <span aria-label="GitHub">GitHub</span>
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
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">Download my documents:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {downloads.items.map((item) => (
              <Button key={item.filePath} href={item.filePath} variant="primary" size="lg" external>
                <DownloadIcon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}