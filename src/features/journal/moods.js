// Mood is a 1-5 ordered scale. Colors come from CSS variables (see index.css)
// so they switch with the theme; emoji + label always accompany the color.
export const MOODS = [
  { value: 1, label: 'Awful', emoji: '😣', color: 'var(--mood-1)' },
  { value: 2, label: 'Low', emoji: '😕', color: 'var(--mood-2)' },
  { value: 3, label: 'Okay', emoji: '😐', color: 'var(--mood-3)' },
  { value: 4, label: 'Good', emoji: '🙂', color: 'var(--mood-4)' },
  { value: 5, label: 'Great', emoji: '😄', color: 'var(--mood-5)' },
]

export const ENERGY_LEVELS = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Steady' },
  { value: 3, label: 'High' },
]

export function getMood(value) {
  return MOODS.find((mood) => mood.value === value) ?? null
}

export function getEnergy(value) {
  return ENERGY_LEVELS.find((level) => level.value === value) ?? null
}

/** Nearest mood for an average like 3.6. */
export function moodForAverage(average) {
  return average == null ? null : getMood(Math.round(average))
}
