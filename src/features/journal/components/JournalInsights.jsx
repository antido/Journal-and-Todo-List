import StatTile from '../../../components/StatTile.jsx'
import Card, { CardHeader } from '../../../components/ui/Card.jsx'
import { moodForAverage } from '../moods.js'
import MoodTrend from './MoodTrend.jsx'

export default function JournalInsights({ stats, activeTag, onTagClick }) {
  const averageMood = moodForAverage(stats.averageMood)

  return (
    <div className="space-y-3">
      <h2 className="sr-only">Insights</h2>

      <dl className="grid grid-cols-3 gap-3">
        <StatTile label="Entries" value={stats.total.toLocaleString()} detail={`${stats.thisWeek} this week`} />
        <StatTile label="Streak" value={stats.streak} detail={stats.streak === 1 ? 'day' : 'days'} />
        <StatTile
          label="Avg mood"
          value={
            averageMood ? (
              <span title={`${stats.averageMood.toFixed(1)} of 5`} className="inline-flex items-center gap-1">
                <span aria-hidden="true" className="text-xl">
                  {averageMood.emoji}
                </span>
                {stats.averageMood.toFixed(1)}
              </span>
            ) : (
              '—'
            )
          }
          detail={averageMood ? `${averageMood.label} · 30d` : 'Log a mood'}
        />
      </dl>

      <MoodTrend trend={stats.trend} />

      {stats.topTags.length > 0 && (
        <Card as="section" padding="sm" aria-labelledby="top-tags-heading" className="hidden sm:p-5 lg:block">
          <CardHeader id="top-tags-heading" title="Top tags" />
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {stats.topTags.map(({ tag, count }) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTagClick(activeTag === tag ? null : tag)}
                  aria-pressed={activeTag === tag}
                  className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-xs font-medium text-ink-2 transition-colors hover:bg-surface-3 aria-pressed:bg-accent-soft aria-pressed:text-accent"
                >
                  #{tag}
                  <span className="text-faint tabular-nums">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
