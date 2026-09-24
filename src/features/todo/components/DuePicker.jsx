import Segmented from '../../../components/ui/Segmented.jsx'
import { addDays, toDateKey } from '../../../lib/dates.js'

/** Quick "Today" / "Tomorrow" toggles plus a date input for anything else. */
export default function DuePicker({ value, onChange }) {
  const today = toDateKey()
  const options = [
    { value: today, label: 'Today' },
    { value: addDays(today, 1), label: 'Tomorrow' },
  ]

  return (
    <Segmented label="Due date" options={options} value={value} onChange={onChange} deselectable>
      <input
        type="date"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        aria-label="Pick a due date"
        className="h-7 min-w-0 rounded-lg bg-transparent px-2 text-xs font-medium text-ink-2 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </Segmented>
  )
}
