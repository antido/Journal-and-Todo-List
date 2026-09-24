import { addDays, toDateKey } from '../../lib/dates.js'

export function isOverdue(todo, today = toDateKey()) {
  return !todo.completed && Boolean(todo.due) && todo.due < today
}

function matchesDue(todo, filter, today) {
  switch (filter) {
    case 'overdue':
      return Boolean(todo.due) && todo.due < today
    case 'today':
      return todo.due === today
    case 'week':
      return Boolean(todo.due) && todo.due >= today && todo.due <= addDays(today, 6)
    case 'none':
      return !todo.due
    default:
      return true
  }
}

function matchesQuery(todo, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [todo.title, todo.notes, ...(todo.tags ?? [])].some((text) => text?.toLowerCase().includes(needle))
}

/** Applies every filter except status (status decides which sections render). */
export function filterTodos(todos, { query, due, priority, tag }, today = toDateKey()) {
  return todos.filter(
    (todo) =>
      matchesQuery(todo, query) &&
      matchesDue(todo, due, today) &&
      (priority == null || todo.priority === priority) &&
      (tag == null || todo.tags?.includes(tag)),
  )
}

const byPriority = (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
// Undated tasks sort after dated ones.
const byDue = (a, b) => (a.due ?? '9999-99-99').localeCompare(b.due ?? '9999-99-99')
const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt)
const chain =
  (...comparators) =>
  (a, b) => {
    for (const compare of comparators) {
      const result = compare(a, b)
      if (result) return result
    }
    return 0
  }

const COMPARATORS = {
  smart: chain(byDue, byPriority, byNewest),
  due: chain(byDue, byPriority, byNewest),
  priority: chain(byPriority, byDue, byNewest),
  created: byNewest,
}

const BUCKETS = [
  { key: 'overdue', label: 'Overdue' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'none', label: 'No date' },
]

function bucketOf(todo, today) {
  if (!todo.due) return 'none'
  if (todo.due < today) return 'overdue'
  if (todo.due === today) return 'today'
  return 'upcoming'
}

/**
 * Active tasks as sections. "Smart" groups by when they're due;
 * every other sort is a single flat list.
 */
export function groupActive(todos, sort, today = toDateKey()) {
  const sorted = todos.filter((todo) => !todo.completed).sort(COMPARATORS[sort] ?? COMPARATORS.smart)
  if (sort !== 'smart') return sorted.length ? [{ key: 'active', label: null, items: sorted }] : []

  return BUCKETS.map((bucket) => ({
    ...bucket,
    items: sorted.filter((todo) => bucketOf(todo, today) === bucket.key),
  })).filter((group) => group.items.length)
}

/** Completed tasks, most recently finished first. */
export function completedTodos(todos) {
  return todos
    .filter((todo) => todo.completed)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
}

export function computeTodoStats(todos, today = toDateKey()) {
  const active = todos.filter((todo) => !todo.completed)
  const done = todos.length - active.length

  const tagCounts = new Map()
  for (const todo of active) {
    for (const tag of todo.tags ?? []) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }

  return {
    total: todos.length,
    active: active.length,
    done,
    overdue: active.filter((todo) => isOverdue(todo, today)).length,
    dueToday: active.filter((todo) => todo.due === today).length,
    completedToday: todos.filter(
      (todo) => todo.completed && todo.completedAt && toDateKey(new Date(todo.completedAt)) === today,
    ).length,
    topTags: [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count })),
  }
}
