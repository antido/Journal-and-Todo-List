import { getMood } from '../moods.js'

/** Mood pill: color dot + emoji + label (identity never relies on color alone). */
export default function MoodBadge({ value }) {
  const mood = getMood(value)
  if (!mood) return null

  return (
    <span
      className="inline-flex h-7 items-center gap-1.5 rounded-full pr-3 pl-2.5 text-xs font-medium text-ink-2"
      style={{ backgroundColor: `color-mix(in oklab, ${mood.color} 13%, var(--surface))` }}
    >
      <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: mood.color }} />
      <span aria-hidden="true">{mood.emoji}</span>
      <span>
        <span className="sr-only">Mood: </span>
        {mood.label}
      </span>
    </span>
  )
}
