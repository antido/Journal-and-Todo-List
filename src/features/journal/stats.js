import { addDays, toDateKey } from '../../lib/dates.js'

const TREND_DAYS = 14
const AVERAGE_WINDOW_DAYS = 30

const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null

/** Consecutive days with at least one entry, ending today (or yesterday if today is still blank). */
function currentStreak(entries, today) {
  const days = new Set(entries.map((entry) => entry.date))
  let cursor = days.has(today) ? today : addDays(today, -1)
  let streak = 0

  while (days.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

export function computeStats(entries, today = toDateKey()) {
  const windowStart = addDays(today, -(AVERAGE_WINDOW_DAYS - 1))
  const recentMoods = entries
    .filter((entry) => entry.mood && entry.date >= windowStart && entry.date <= today)
    .map((entry) => entry.mood)

  const trend = Array.from({ length: TREND_DAYS }, (_, index) => {
    const date = addDays(today, index - (TREND_DAYS - 1))
    const moods = entries.filter((entry) => entry.date === date && entry.mood).map((e) => e.mood)
    return { date, mood: average(moods), count: moods.length }
  })

  const tagCounts = new Map()
  for (const entry of entries) {
    for (const tag of entry.tags ?? []) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }

  const weekStart = addDays(today, -6)

  return {
    total: entries.length,
    thisWeek: entries.filter((entry) => entry.date >= weekStart && entry.date <= today).length,
    streak: currentStreak(entries, today),
    averageMood: average(recentMoods),
    moodSamples: recentMoods.length,
    trend,
    topTags: [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count })),
  }
}
