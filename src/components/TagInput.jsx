import { useId, useState } from 'react'
import { XIcon } from './icons.jsx'

const MAX_TAGS = 8
const MAX_TAG_LENGTH = 24

function normalizeTag(raw) {
  return raw
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .slice(0, MAX_TAG_LENGTH)
}

/** Chip input: Enter or comma adds a tag, Backspace on empty removes the last one. */
export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [text, setText] = useState('')
  const listId = useId()
  const full = tags.length >= MAX_TAGS

  const commit = () => {
    const tag = normalizeTag(text)
    if (tag && !tags.includes(tag) && !full) onChange([...tags, tag])
    setText('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Backspace' && !text && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="field flex min-h-9 min-w-0 flex-1 flex-wrap items-center gap-1 rounded-xl px-2 py-1 shadow-none sm:min-w-56">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-6 items-center gap-0.5 rounded-md bg-accent-soft pr-0.5 pl-2 text-xs font-medium text-accent"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            aria-label={`Remove tag ${tag}`}
            className="grid size-5 place-items-center rounded text-accent/70 hover:bg-accent/15 hover:text-accent"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={text}
        onChange={(event) => {
          // Pasting "a, b" adds both tags.
          const value = event.target.value
          if (value.includes(',')) {
            const parts = value.split(',')
            const additions = parts.slice(0, -1).map(normalizeTag).filter(Boolean)
            const next = [...new Set([...tags, ...additions])].slice(0, MAX_TAGS)
            onChange(next)
            setText(parts.at(-1))
          } else {
            setText(value)
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        list={listId}
        disabled={full}
        aria-label="Add tag"
        placeholder={tags.length ? '' : 'Add tags…'}
        className="h-6 min-w-20 flex-1 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-faint disabled:cursor-not-allowed"
      />
      <datalist id={listId}>
        {suggestions
          .filter((tag) => !tags.includes(tag))
          .map((tag) => (
            <option key={tag} value={tag} />
          ))}
      </datalist>
    </div>
  )
}
