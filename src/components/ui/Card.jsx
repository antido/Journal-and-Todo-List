const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
}

/** The one surface style used for every panel in the app. */
export default function Card({ as: Tag = 'div', padding = 'md', className = '', ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface shadow-card ${PADDING[padding]} ${className}`}
      {...props}
    />
  )
}

/** Title row for a Card: a small heading and optional meta on the right. */
export function CardHeader({ title, meta, id }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 id={id} className="text-sm font-semibold text-ink">
        {title}
      </h3>
      {meta && <span className="text-xs text-muted">{meta}</span>}
    </div>
  )
}
