import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'

const STORAGE_KEY = 'journal.entries.v1'

/**
 * Entry shape:
 * { id, date: 'YYYY-MM-DD', title, body, mood: 1-5 | null, energy: 1-3 | null,
 *   tags: string[], createdAt: ISO, updatedAt: ISO }
 */
export function useJournalState() {
  const [entries, setEntries] = useLocalStorageState(STORAGE_KEY, [])

  // Newest day first; within a day, newest written first.
  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
      ),
    [entries],
  )

  const add = useCallback(
    (data) => {
      const now = new Date().toISOString()
      const entry = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      setEntries((current) => [...current, entry])
      return entry
    },
    [setEntries],
  )

  const update = useCallback(
    (id, data) => {
      const now = new Date().toISOString()
      setEntries((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, ...data, updatedAt: now } : entry)),
      )
    },
    [setEntries],
  )

  const remove = useCallback(
    (id) => setEntries((current) => current.filter((entry) => entry.id !== id)),
    [setEntries],
  )

  const restore = useCallback(
    (entry) =>
      setEntries((current) =>
        current.some((existing) => existing.id === entry.id) ? current : [...current, entry],
      ),
    [setEntries],
  )

  return { entries: sorted, add, update, remove, restore }
}
