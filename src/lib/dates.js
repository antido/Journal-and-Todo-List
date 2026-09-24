// Entries are keyed by local calendar day ("YYYY-MM-DD") so they group by the
// day the user lived, regardless of timezone offsets in ISO timestamps.

export function toDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key, amount) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function formatDate(key, options) {
  return fromDateKey(key).toLocaleDateString(undefined, options)
}

export function relativeDayLabel(key, today = toDateKey()) {
  if (key === today) return 'Today'
  if (key === addDays(today, -1)) return 'Yesterday'

  const sameYear = key.slice(0, 4) === today.slice(0, 4)
  return formatDate(key, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** Whole days from `fromKey` to `toKey` (negative when `toKey` is earlier). */
export function daysBetween(fromKey, toKey) {
  return Math.round((fromDateKey(toKey) - fromDateKey(fromKey)) / 86_400_000)
}

/** Short, human label for a due date: Today, Tomorrow, Friday, Oct 3. */
export function dueLabel(key, today = toDateKey()) {
  const diff = daysBetween(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1 && diff < 7) return formatDate(key, { weekday: 'long' })

  const sameYear = key.slice(0, 4) === today.slice(0, 4)
  return formatDate(key, { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) })
}

export function formatMonth(key) {
  return formatDate(`${key.slice(0, 7)}-01`, { month: 'long', year: 'numeric' })
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
