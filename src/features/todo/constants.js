// Priority is numeric so it sorts naturally (higher = more urgent).
// Color only tints the flag icon; the label always carries the meaning.
export const PRIORITIES = [
  { value: 1, label: 'Low', iconClass: 'text-faint' },
  { value: 2, label: 'Medium', iconClass: 'text-warning' },
  { value: 3, label: 'High', iconClass: 'text-danger' },
]

export function getPriority(value) {
  return PRIORITIES.find((priority) => priority.value === value) ?? null
}

export const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export const DUE_FILTERS = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Next 7 days' },
  { value: 'none', label: 'No date' },
]

export const SORTS = [
  { value: 'smart', label: 'Smart' },
  { value: 'due', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'created', label: 'Newest' },
]
