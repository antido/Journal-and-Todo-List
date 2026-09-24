import Card, { CardHeader } from '../../../components/ui/Card.jsx'
import { formatDate, relativeDayLabel } from '../../../lib/dates.js'
import { MOODS, moodForAverage } from '../moods.js'

const PLOT_HEIGHT = 120

function describeDay(day) {
  const when = relativeDayLabel(day.date)
  if (day.mood == null) return `${when}: no mood logged`
  const mood = moodForAverage(day.mood)
  const detail = day.count > 1 ? ` (average ${day.mood.toFixed(1)} across ${day.count} entries)` : ''
  return `${when}: ${mood.label}${detail}`
}

/**
 * Dot strip of the last 14 days. Each day's dot sits at its (average) mood on
 * a 1-5 scale, centred on a dashed "Okay" baseline. Days are the hit targets:
 * hover or focus shows the value, and each day carries the same text as its label.
 */
export default function MoodTrend({ trend }) {
  const logged = trend.filter((day) => day.mood != null).length

  return (
    <Card as="figure" padding="sm" className="sm:p-5">
      <figcaption>
        <CardHeader title="Mood, last 14 days" meta={`${logged}/14 days`} />
      </figcaption>

      <div className="mt-5 flex gap-2">
        {/* Y axis: emoji anchors for great / okay / awful */}
        <div
          aria-hidden="true"
          className="flex w-5 flex-col justify-between text-center text-sm leading-none"
          style={{ height: PLOT_HEIGHT }}
        >
          <span title="Great">{MOODS[4].emoji}</span>
          <span title="Okay">{MOODS[2].emoji}</span>
          <span title="Awful">{MOODS[0].emoji}</span>
        </div>

        <div className="relative flex-1" style={{ height: PLOT_HEIGHT }}>
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-dashed border-line-strong" />
          <ol aria-label="Mood per day, last 14 days" className="absolute inset-0 grid grid-cols-14">
            {trend.map((day, index) => {
              const mood = moodForAverage(day.mood)
              const edge = index < 3 ? 'left-0' : index > 10 ? 'right-0' : 'left-1/2 -translate-x-1/2'
              return (
                <li key={day.date} className="group/day relative flex justify-center">
                  {/* Transparent, focusable hit target spanning the full column. */}
                  <span
                    tabIndex={0}
                    role="img"
                    aria-label={describeDay(day)}
                    className="absolute inset-0 rounded-md outline-none group-hover/day:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 inset-y-1.5">
                    {mood ? (
                      <span
                        className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface transition-transform duration-150 group-hover/day:scale-150"
                        style={{ top: `${((5 - day.mood) / 4) * 100}%`, backgroundColor: mood.color }}
                      />
                    ) : (
                      <span className="absolute top-1/2 left-1/2 h-px w-1.5 -translate-x-1/2 bg-line-strong" />
                    )}
                  </div>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-10 z-10 hidden rounded-lg bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-canvas shadow-float group-focus-within/day:block group-hover/day:block ${edge}`}
                  >
                    {mood ? (
                      <>
                        <strong className="font-semibold">
                          {mood.emoji} {mood.label}
                        </strong>
                        {day.count > 1 && <span className="opacity-70"> · avg {day.mood.toFixed(1)}</span>}
                        <span className="opacity-70"> · {formatDate(day.date, { month: 'short', day: 'numeric' })}</span>
                      </>
                    ) : (
                      <span className="opacity-80">
                        No mood · {formatDate(day.date, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="mt-2 flex justify-between pl-7 text-[11px] text-faint" aria-hidden="true">
        <span>{formatDate(trend[0].date, { month: 'short', day: 'numeric' })}</span>
        <span>Today</span>
      </div>
    </Card>
  )
}
