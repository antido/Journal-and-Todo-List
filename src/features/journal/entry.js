import { toDateKey } from '../../lib/dates.js'

export function emptyEntry() {
  return { date: toDateKey(), title: '', body: '', mood: null, energy: null, tags: [] }
}

/** An entry needs at least a title, some text, or a mood. */
export function isEntryEmpty(entry) {
  return !entry.title.trim() && !entry.body.trim() && entry.mood == null
}

export function countWords(text) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}
