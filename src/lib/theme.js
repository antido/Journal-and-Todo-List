import { readString, writeString } from './storage.js'

// Keep in sync with the inline script in index.html, which applies the theme
// before first paint to avoid a light/dark flash.
const STORAGE_KEY = 'theme'
export const THEMES = ['system', 'light', 'dark']

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

export function getStoredTheme() {
  const value = readString(STORAGE_KEY)
  return THEMES.includes(value) ? value : 'system'
}

export function applyTheme(theme) {
  const resolved = theme === 'system' ? (systemQuery().matches ? 'dark' : 'light') : theme
  document.documentElement.dataset.theme = resolved
}

const CHANGE_EVENT = 'themepreferencechange'

export function setTheme(theme) {
  writeString(STORAGE_KEY, theme)
  applyTheme(theme)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: theme }))
}

/** Notifies every toggle on the page when the preference changes. */
export function onThemePreferenceChange(callback) {
  const handler = (event) => callback(event.detail)
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}

export function onSystemThemeChange(callback) {
  const query = systemQuery()
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
