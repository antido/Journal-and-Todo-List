import { ChevronIcon, FlagIcon, XIcon } from '../../../components/icons.jsx'
import SearchField from '../../../components/SearchField.jsx'
import Chip from '../../../components/ui/Chip.jsx'
import Segmented from '../../../components/ui/Segmented.jsx'
import { DUE_FILTERS, PRIORITIES, SORTS, STATUS_FILTERS } from '../constants.js'

export default function TodoToolbar({ filters, onChange, counts, shown, total }) {
  const { status, query, due, priority, tag, sort } = filters
  const set = (patch) => onChange({ ...filters, ...patch })
  const narrowing = Boolean(query || due || priority || tag)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Show tasks"
          size="md"
          value={status}
          onChange={(value) => set({ status: value })}
          options={STATUS_FILTERS.map((option) => ({ ...option, count: counts[option.value] }))}
        />

        <label className="relative inline-flex items-center gap-2 text-xs font-medium text-muted">
          Sort
          <select
            value={sort}
            onChange={(event) => set({ sort: event.target.value })}
            className="field h-9 cursor-pointer appearance-none rounded-xl pr-8 pl-3 text-[13px] font-medium text-ink shadow-none"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronIcon className="pointer-events-none absolute right-2.5 size-3.5 text-muted" />
        </label>
      </div>

      <SearchField value={query} onChange={(value) => set({ query: value })} label="Search tasks" />

      {/* Scrolls sideways on small screens instead of wrapping into many rows. */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max items-center gap-1.5 sm:w-auto sm:flex-wrap">
          <div role="group" aria-label="Filter by due date" className="flex gap-1.5 sm:flex-wrap">
            {DUE_FILTERS.map((option) => (
              <Chip
                key={option.value}
                active={due === option.value}
                onClick={() => set({ due: due === option.value ? null : option.value })}
              >
                {option.label}
              </Chip>
            ))}
          </div>

          {/* Divider only where the row stays on one line (phone scroller, wide desktop). */}
          <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-line sm:hidden xl:block" />

          <div role="group" aria-label="Filter by priority" className="flex gap-1.5 sm:flex-wrap">
            {[...PRIORITIES].reverse().map((option) => (
              <Chip
                key={option.value}
                active={priority === option.value}
                onClick={() => set({ priority: priority === option.value ? null : option.value })}
              >
                <FlagIcon className={`size-3 ${priority === option.value ? '' : option.iconClass}`} />
                {option.label}
              </Chip>
            ))}
          </div>

          {tag && (
            <Chip active onClick={() => set({ tag: null })}>
              #{tag}
              <XIcon className="size-3" />
              <span className="sr-only">Clear tag filter</span>
            </Chip>
          )}
        </div>
      </div>

      {narrowing && (
        <p className="flex items-center gap-2 text-xs text-muted" aria-live="polite">
          Showing {shown} of {total} {total === 1 ? 'task' : 'tasks'}
          <button
            type="button"
            onClick={() => set({ query: '', due: null, priority: null, tag: null })}
            className="font-medium text-accent hover:text-accent-hover"
          >
            Clear filters
          </button>
        </p>
      )}
    </div>
  )
}
