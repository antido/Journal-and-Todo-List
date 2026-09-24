export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center sm:py-16">
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 grid size-14 place-items-center rounded-2xl bg-surface text-2xl shadow-card ring-1 ring-line"
        >
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-pretty text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
