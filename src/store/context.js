import { createContext, useContext } from 'react'

export const JournalContext = createContext(null)
export const TodosContext = createContext(null)

/** Journal entries + actions, shared app-wide (see StoreProvider). */
export function useJournal() {
  return useContext(JournalContext)
}

/** Todos + actions, shared app-wide (see StoreProvider). */
export function useTodos() {
  return useContext(TodosContext)
}
