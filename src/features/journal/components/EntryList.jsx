import { formatMonth } from '../../../lib/dates.js'
import EntryCard from './EntryCard.jsx'

function groupByMonth(entries) {
  const groups = []
  for (const entry of entries) {
    const month = entry.date.slice(0, 7)
    const last = groups.at(-1)
    if (last?.month === month) last.entries.push(entry)
    else groups.push({ month, entries: [entry] })
  }
  return groups
}

export default function EntryList({ entries, ...cardProps }) {
  return (
    <div className="space-y-10">
      {groupByMonth(entries).map(({ month, entries: monthEntries }) => (
        <section key={month} aria-labelledby={`month-${month}`}>
          <h3 id={`month-${month}`} className="mb-4 flex items-center gap-3">
            <span className="eyebrow">{formatMonth(month)}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span className="text-xs text-faint tabular-nums">
              {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </h3>
          <ol className="space-y-3">
            {monthEntries.map((entry) => (
              <li key={entry.id}>
                <EntryCard entry={entry} {...cardProps} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
