import { useJournalState } from '../features/journal/useJournalState.js'
import { useTodosState } from '../features/todo/useTodosState.js'
import { JournalContext, TodosContext } from './context.js'

/**
 * Owns app data once so every consumer (pages and the navigation's counts)
 * reads the same state instead of separate copies of localStorage.
 */
export default function StoreProvider({ children }) {
  const journal = useJournalState()
  const todos = useTodosState()

  return (
    <JournalContext.Provider value={journal}>
      <TodosContext.Provider value={todos}>{children}</TodosContext.Provider>
    </JournalContext.Provider>
  )
}
