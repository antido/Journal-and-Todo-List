export default function Kbd({ className = '', children }) {
  return (
    <kbd
      className={`inline-grid h-5 min-w-5 place-items-center rounded-md border border-line bg-surface-2 px-1 font-sans text-[11px] font-medium text-muted ${className}`}
    >
      {children}
    </kbd>
  )
}
