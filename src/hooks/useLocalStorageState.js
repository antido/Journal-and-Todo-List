import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage.js'

/**
 * useState that persists to localStorage under `key`.
 * `initialValue` may be a value or a function returning one.
 */
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue
    return readJSON(key, fallback)
  })

  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  return [value, setValue]
}
