import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getTestimonials } from '@/data/content'

export function TestimonialsSection() {
  const testimonials = getTestimonials()
  if (testimonials.length === 0) return null

  return (
    <SectionWrapper id="testimonials">
      <SectionHeading title="Testimonials" label="References" />
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={`${t.name}-${t.quote.slice(0, 16)}`} className="rounded-lg border border-border bg-surface-alt/60 p-6">
            <blockquote className="font-display text-lg italic leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-medium text-foreground">{t.name}</span>
              <span className="text-muted"> — {t.role}</span>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-subtle">{t.relationship}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionWrapper>
  )
}
