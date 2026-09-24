const TONES = {
  default: 'text-faint hover:bg-surface-2 hover:text-ink',
  danger: 'text-faint hover:bg-danger-soft hover:text-danger',
}

/** Square icon-only button. `label` is required: it's the accessible name and tooltip. */
export default function IconButton({ label, tone = 'default', className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid size-9 shrink-0 place-items-center rounded-lg transition-colors ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
