/**
 * Segmented control: a row of mutually exclusive toggle buttons on a tinted
 * track. With `deselectable`, clicking the selected option clears it (null).
 * Extra controls (e.g. a date input) can be passed as children.
 */
export default function Segmented({
  label,
  options,
  value,
  onChange,
  deselectable = false,
  size = 'sm',
  className = '',
  children,
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex max-w-full items-center gap-0.5 rounded-xl bg-surface-2 p-1 ${className}`}
    >
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={selected}
            title={option.title}
            onClick={() => onChange(selected && deselectable ? null : option.value)}
            className={[
              'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150',
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-[13px]',
              selected
                ? 'bg-surface text-ink shadow-card ring-1 ring-line'
                : 'text-muted hover:text-ink',
            ].join(' ')}
          >
            {option.icon}
            {option.label}
            {option.count != null && (
              <span className={`tabular-nums ${selected ? 'text-muted' : 'text-faint'}`}>{option.count}</span>
            )}
          </button>
        )
      })}
      {children}
    </div>
  )
}
