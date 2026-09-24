import { useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredTheme,
  onSystemThemeChange,
  onThemePreferenceChange,
  setTheme,
  THEMES,
} from '../lib/theme.js'
import { MonitorIcon, MoonIcon, SunIcon } from './icons.jsx'

const META = {
  system: { label: 'System', Icon: MonitorIcon },
  light: { label: 'Light', Icon: SunIcon },
  dark: { label: 'Dark', Icon: MoonIcon },
}

/**
 * Cycles System → Light → Dark. `showLabel` renders the current mode's name
 * beside the icon (used in the wide sidebar).
 */
export default function ThemeToggle({ showLabel = false, className = '' }) {
  const [theme, setThemeState] = useState(getStoredTheme)

  // Several toggles can exist (rail, sidebar, mobile bar); keep them in sync.
  useEffect(() => onThemePreferenceChange(setThemeState), [])

  // While following the system, react to OS-level changes.
  useEffect(() => {
    if (theme !== 'system') return undefined
    return onSystemThemeChange(() => applyTheme('system'))
  }, [theme])

  const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
  const { label, Icon } = META[theme]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`${label} theme — switch to ${META[next].label.toLowerCase()}`}
      aria-label={`${label} theme. Switch to ${META[next].label.toLowerCase()} theme`}
      className={[
        'inline-flex h-9 items-center gap-2.5 rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink',
        showLabel ? 'w-full px-3 text-sm font-medium' : 'w-9 justify-center',
        className,
      ].join(' ')}
    >
      <Icon className="size-[18px]" />
      {showLabel && <span>{label} theme</span>}
    </button>
  )
}
