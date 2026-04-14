interface SectionHeadingProps {
  title: string
  subtitle?: string
  sectionNumber?: string
  label?: string
}

export function SectionHeading({ title, subtitle, sectionNumber, label }: SectionHeadingProps) {
  return (
    <div className="mb-12 pb-3 border-b border-border flex items-baseline justify-between gap-6 flex-wrap">
      <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground tracking-tight">
        {title}
      </h2>
      <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-widest text-subtle">
        {label && <span>{label}</span>}
        {sectionNumber && <span>Section {sectionNumber}</span>}
      </div>
      {subtitle && <p className="w-full mt-3 text-base text-muted">{subtitle}</p>}
    </div>
  )
}
