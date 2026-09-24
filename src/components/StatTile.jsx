/** A single headline number. Render inside a <dl>. */
export default function StatTile({ label, value, detail, tone }) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-surface px-3 py-3 shadow-card sm:px-4 sm:py-3.5">
      <dt className="truncate text-xs font-medium text-muted">{label}</dt>
      <dd
        className={`mt-1.5 text-2xl leading-none font-semibold tracking-tight ${tone === 'danger' ? 'text-danger' : 'text-ink'}`}
      >
        {value}
      </dd>
      {detail && <dd className="mt-1.5 truncate text-xs text-faint">{detail}</dd>}
    </div>
  )
}
