interface TimelineItemProps {
  title: string
  subtitle: string
  dateRange: string
  children: React.ReactNode
  isLast?: boolean
}

export function TimelineItem({
  title,
  subtitle,
  dateRange,
  children,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
      )}
      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-gold-500 bg-background flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-gold-500" />
      </div>
      <div>
        <p className="text-sm text-gold-accent font-medium">{dateRange}</p>
        <h3 className="text-lg font-semibold text-foreground mt-1">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}