import StatTile from '../../../components/StatTile.jsx'
import Card, { CardHeader } from '../../../components/ui/Card.jsx'

/**
 * Progress is a single ratio against a limit, so it's a meter: a green fill
 * (the "done" color) on a lighter step of the same hue for the track.
 */
function ProgressMeter({ done, total, completedToday }) {
  const percent = total ? Math.round((done / total) * 100) : 0

  return (
    <Card padding="sm" className="sm:p-5">
      <CardHeader id="progress-label" title="Progress" meta={`${done} of ${total} done`} />
      <div className="mt-4 flex items-center gap-3">
        <div
          role="progressbar"
          aria-labelledby="progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% — ${done} of ${total} tasks done`}
          className="h-2 flex-1 overflow-hidden rounded-full bg-success-soft"
        >
          <div
            className="h-full rounded-full bg-success-fill transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm font-semibold text-ink tabular-nums">{percent}%</span>
      </div>
      <p className="mt-3 text-xs text-muted">
        {completedToday > 0 ? `${completedToday} completed today — nice work.` : 'Nothing completed yet today.'}
      </p>
    </Card>
  )
}

export default function TodoOverview({ stats, activeTag, onTagClick }) {
  return (
    <div className="space-y-3">
      <h2 className="sr-only">Overview</h2>

      <dl className="grid grid-cols-3 gap-3">
        <StatTile label="Active" value={stats.active} detail={stats.active === 1 ? 'task' : 'tasks'} />
        <StatTile label="Due today" value={stats.dueToday} detail={stats.dueToday ? (stats.dueToday === 1 ? 'task' : 'tasks') : 'all clear'} />
        <StatTile
          label="Overdue"
          value={stats.overdue}
          tone={stats.overdue ? 'danger' : undefined}
          detail={stats.overdue ? 'past due' : 'none'}
        />
      </dl>

      <ProgressMeter done={stats.done} total={stats.total} completedToday={stats.completedToday} />

      {stats.topTags.length > 0 && (
        <Card as="section" padding="sm" aria-labelledby="todo-tags-heading" className="hidden sm:p-5 lg:block">
          <CardHeader id="todo-tags-heading" title="Tags" />
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
