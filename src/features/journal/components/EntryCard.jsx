import { useState } from 'react'
import { BoltIcon, PencilIcon, TrashIcon } from '../../../components/icons.jsx'
import Card from '../../../components/ui/Card.jsx'
import IconButton from '../../../components/ui/IconButton.jsx'
import { formatDate, formatTime, relativeDayLabel } from '../../../lib/dates.js'
import { getEnergy, getMood } from '../moods.js'
import EntryForm from './EntryForm.jsx'
import MoodBadge from './MoodBadge.jsx'

const LONG_BODY_CHARS = 320
const LONG_BODY_LINES = 5

function isLong(body) {
  return body.length > LONG_BODY_CHARS || body.split('\n').length > LONG_BODY_LINES
}

export default function EntryCard({ entry, onUpdate, onDelete, onTagClick, activeTag, tagSuggestions }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(entry)
  const [expanded, setExpanded] = useState(false)
  const mood = getMood(entry.mood)
  const energy = getEnergy(entry.energy)
  const long = isLong(entry.body)
  const edited = entry.updatedAt !== entry.createdAt

  if (editing) {
    return (
      <Card as="article" aria-label="Editing entry" className="ring-4 ring-accent/10 sm:p-7">
        <EntryForm
          value={draft}
          onChange={setDraft}
          onSubmit={(data) => {
            onUpdate(entry.id, data)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
          submitLabel="Save changes"
          tagSuggestions={tagSuggestions}
          autoFocus
        />
      </Card>
    )
  }

  return (
    <Card
      as="article"
      padding="none"
      className="group relative overflow-hidden px-5 py-5 transition-[border-color,box-shadow] duration-200 hover:border-line-strong sm:px-7 sm:py-6"
    >
      {/* Mood edge: a quiet cue that pairs with the labelled badge below. */}
      {mood && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: mood.color }}
        />
      )}

      <header className="flex items-start justify-between gap-3">
        <p className="pt-1.5 text-xs font-medium text-muted">
          <time dateTime={entry.date} title={formatDate(entry.date, { dateStyle: 'full' })}>
            {relativeDayLabel(entry.date)}
          </time>
          <span aria-hidden="true" className="mx-1.5 text-faint">
            ·
          </span>
          <span>{formatTime(entry.createdAt)}</span>
          {edited && <span className="text-faint"> · edited</span>}
        </p>

        {/* Always visible on touch; revealed on hover/focus on pointer devices. */}
        <div className="-mt-1 -mr-2 flex shrink-0 gap-0.5 transition-opacity duration-150 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          <IconButton
            label="Edit entry"
            onClick={() => {
              setDraft(entry)
              setEditing(true)
            }}
          >
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete entry" tone="danger" onClick={() => onDelete(entry)}>
            <TrashIcon />
          </IconButton>
        </div>
      </header>

      {entry.title && (
        <h3 className="mt-1 font-display text-xl leading-snug font-semibold tracking-[-0.01em] text-pretty text-ink">
          {entry.title}
        </h3>
      )}

      {entry.body && (
        <div className={entry.title ? 'mt-2' : 'mt-1'}>
          <p
            className={[
              'text-[15px] leading-7 whitespace-pre-wrap text-ink-2',
              long && !expanded ? 'line-clamp-5' : '',
            ].join(' ')}
          >
            {entry.body}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="mt-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {(mood || energy || entry.tags?.length > 0) && (
        <footer className="mt-4 flex flex-wrap items-center gap-1.5">
          <MoodBadge value={entry.mood} />
          {energy && (
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-2 px-2.5 text-xs font-medium text-ink-2">
              <BoltIcon className="size-3 text-warning" />
              {energy.label} energy
            </span>
          )}
          {entry.tags?.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              aria-pressed={activeTag === tag}
              title={`Show entries tagged #${tag}`}
              className="h-7 rounded-full px-2.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink aria-pressed:bg-accent-soft aria-pressed:text-accent"
            >
              #{tag}
            </button>
          ))}
        </footer>
      )}
    </Card>
  )
}
