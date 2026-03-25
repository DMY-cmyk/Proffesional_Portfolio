interface SectionHeadingProps {
  title: string
  subtitle?: string
  sectionNumber?: string
  label?: string
}

export function SectionHeading({ title, subtitle, sectionNumber, label }: SectionHeadingProps) {
  return (
    <div className="mb-16">
      {sectionNumber && label && (
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-gold-accent tracking-widest">{sectionNumber}</span>
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{label}</span>
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-normal text-foreground tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  )
}