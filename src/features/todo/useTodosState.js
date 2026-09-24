import { useCallback } from 'react'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'

const STORAGE_KEY = 'todos.v1'

/**
 * Todo shape:
 * { id, title, notes, priority: 1-3 | null, due: 'YYYY-MM-DD' | null, tags: string[],
 *   completed: boolean, completedAt: ISO | null, createdAt: ISO, updatedAt: ISO }
 */
export function useTodosState() {
  const [todos, setTodos] = useLocalStorageState(STORAGE_KEY, [])

  const add = useCallback(
    (data) => {
      const now = new Date().toISOString()
      const todo = {
        notes: '',
        priority: null,
        due: null,
        tags: [],
        ...data,
        id: crypto.randomUUID(),
        completed: false,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      }
      setTodos((current) => [...current, todo])
      return todo
    },
    [setTodos],
  )

  const update = useCallback(
    (id, data) => {
      const now = new Date().toISOString()
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? { ...todo, ...data, updatedAt: now } : todo)),
      )
    },
    [setTodos],
  )

  const setCompleted = useCallback(
    (id, completed) => {
      const now = new Date().toISOString()
      setTodos((current) =>
        current.map((todo) =>
          todo.id === id ? { ...todo, completed, completedAt: completed ? now : null, updatedAt: now } : todo,
        ),
      )
    },
    [setTodos],
  )

  const remove = useCallback(
    (id) => setTodos((current) => current.filter((todo) => todo.id !== id)),
    [setTodos],
  )

  /** Removes every completed task and returns them (for undo). */
  const clearCompleted = useCallback(() => {
    const removed = todos.filter((todo) => todo.completed)
    setTodos((current) => current.filter((todo) => !todo.completed))
    return removed
  }, [todos, setTodos])

  /** Puts previously removed tasks back, skipping any that already exist. */
  const restore = useCallback(
    (items) =>
      setTodos((current) => {
        const ids = new Set(current.map((todo) => todo.id))
        return [...current, ...items.filter((todo) => !ids.has(todo.id))]
      }),
    [setTodos],
  )

  return { todos, add, update, setCompleted, remove, clearCompleted, restore }
}
