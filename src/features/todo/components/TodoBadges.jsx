import { CalendarIcon, FlagIcon } from '../../../components/icons.jsx'
import { dueLabel, formatDate, toDateKey } from '../../../lib/dates.js'
import { getPriority } from '../constants.js'

const base = 'inline-flex h-6 items-center gap-1 text-xs font-medium'

/** Due date with an "Overdue" state; completed tasks show it muted and neutral. */
export function DueBadge({ due, completed }) {
  if (!due) return null
  const today = toDateKey()
  const overdue = !completed && due < today
  const isToday = !completed && due === today

  return (
    <span
      title={`Due ${formatDate(due, { dateStyle: 'full' })}`}
      className={[
        base,
        overdue
          ? 'rounded-md bg-danger-soft px-1.5 text-danger'
          : isToday
            ? 'rounded-md bg-accent-soft px-1.5 text-accent'
            : 'text-muted',
      ].join(' ')}
    >
      <CalendarIcon className="size-3.5" />
      {overdue && 'Overdue · '}
      {dueLabel(due, today)}
    </span>
  )
}

/** Priority: colored flag icon + text label (never color alone). */
export function PriorityBadge({ value }) {
  const priority = getPriority(value)
  if (!priority) return null

  return (
    <span className={`${base} text-muted`}>
      <FlagIcon className={`size-3.5 ${priority.iconClass}`} />
      {priority.label}
      <span className="sr-only"> priority</span>
    </span>
  )
}
