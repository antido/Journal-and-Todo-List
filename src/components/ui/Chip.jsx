/** Pill-shaped toggle for filter rows. Active chips take the accent tint. */
export default function Chip({ active, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={[
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors duration-150',
        active
          ? 'border-transparent bg-accent-soft text-accent'
          : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
