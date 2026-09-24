// localStorage can be unavailable (private mode, blocked site data) or hold
// corrupt JSON, so every access is guarded and falls back gracefully.

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: keep working in memory.
  }
}

export function readString(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeString(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore: preference simply won't persist.
  }
}
