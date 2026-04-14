interface StatusRibbonProps {
  now: string
  basedIn: string
  education: string
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <div className="font-mono text-[10px] uppercase tracking-wider text-subtle font-medium mb-1">
        {label}
      </div>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  )
}

export function StatusRibbon({ now, basedIn, education }: StatusRibbonProps) {
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-4 py-4 border-t border-b border-border my-6">
      <Cell label="Now" value={now} />
      <Cell label="Based in" value={basedIn} />
      <Cell label="Education" value={education} />
    </div>
  )
}
