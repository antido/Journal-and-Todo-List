import { useId, useState } from 'react'
import { ChevronIcon } from '../../../components/icons.jsx'
import TodoItem from './TodoItem.jsx'

/**
 * A titled group of tasks. When `collapsible`, the heading toggles the list.
 * `tone="danger"` marks the Overdue group (paired with its text label).
 */
export default function TodoSection({ label, items, action, collapsible = false, tone, ...itemProps }) {
  const [open, setOpen] = useState(true)
  const listId = useId()

  const heading = (
    <>
      {tone === 'danger' && <span aria-hidden="true" className="size-1.5 rounded-full bg-danger" />}
      <span className={tone === 'danger' ? 'text-danger' : undefined}>{label}</span>
      <span className="font-medium tracking-normal text-faint tabular-nums">{items.length}</span>
    </>
  )

  return (
    <section aria-label={label ?? 'Tasks'}>
      {label && (
        <div className="mb-3 flex min-h-8 items-center justify-between gap-2">
          <h3 className="eyebrow">
            {collapsible ? (
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={listId}
                className="-ml-1.5 inline-flex h-8 items-center gap-2 rounded-lg px-1.5 uppercase transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <ChevronIcon className={`size-3.5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
                {heading}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2">{heading}</span>
            )}
          </h3>
          {action}
        </div>
      )}

      {open && (
        <ul id={listId} className="space-y-2">
          {items.map((todo) => (
            <li key={todo.id} className="motion-safe:animate-fade-in">
              <TodoItem todo={todo} {...itemProps} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
