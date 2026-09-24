import { createContext, useContext } from 'react'

export const ToastContext = createContext(() => {})

/**
 * Returns `showToast(message, action?)` where action is `{ label, onClick }`.
 */
export function useToast() {
  return useContext(ToastContext)
}
