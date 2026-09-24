import { XIcon } from '../../../components/icons.jsx'
import SearchField from '../../../components/SearchField.jsx'
import Chip from '../../../components/ui/Chip.jsx'
import { MOODS } from '../moods.js'

export default function JournalToolbar({
  query,
  onQueryChange,
  mood,
  onMoodChange,
  tag,
  onTagChange,
  shown,
  total,
}) {
  const filtering = Boolean(query || mood || tag)

  return (
    <div className="space-y-3">
      <SearchField value={query} onChange={onQueryChange} label="Search entries" />

      {/* Scrolls sideways on small screens instead of wrapping into many rows. */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap">
          <div role="group" aria-label="Filter by mood" className="flex gap-1.5 sm:flex-wrap">
            <Chip active={!mood} onClick={() => onMoodChange(null)}>
              All moods
            </Chip>
            {MOODS.map((option) => (
              <Chip
                key={option.value}
                active={mood === option.value}
                onClick={() => onMoodChange(mood === option.value ? null : option.value)}
                title={option.label}
              >
                <span aria-hidden="true">{option.emoji}</span>
                {option.label}
              </Chip>
            ))}
          </div>

          {tag && (
            <Chip active onClick={() => onTagChange(null)}>
              #{tag}
              <XIcon className="size-3" />
              <span className="sr-only">Clear tag filter</span>
            </Chip>
          )}
        </div>
      </div>

      {filtering && (
        <p className="flex items-center gap-2 text-xs text-muted" aria-live="polite">
          Showing {shown} of {total} {total === 1 ? 'entry' : 'entries'}
          <button
            type="button"
            onClick={() => {
              onQueryChange('')
              onMoodChange(null)
              onTagChange(null)
            }}
            className="font-medium text-accent hover:text-accent-hover"
          >
            Clear filters
          </button>
        </p>
      )}
    </div>
  )
}
