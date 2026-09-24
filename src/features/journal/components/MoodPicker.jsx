import { MOODS } from '../moods.js'

/** Five toggle tiles; clicking the selected mood clears it. */
export default function MoodPicker({ value, onChange }) {
  return (
    <div role="group" aria-label="Mood" className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {MOODS.map((mood) => {
        const selected = value === mood.value
        return (
          <button
            key={mood.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : mood.value)}
            style={
              selected
                ? {
                    borderColor: mood.color,
                    backgroundColor: `color-mix(in oklab, ${mood.color} 12%, var(--surface))`,
                  }
                : undefined
            }
            className={[
              'group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-1 pt-3 pb-2.5 transition-[border-color,background-color,transform] duration-150 active:scale-95',
              selected ? 'text-ink' : 'border-line bg-surface text-muted hover:border-line-strong hover:bg-surface-2 hover:text-ink',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'text-[26px] leading-none transition-[filter,transform] duration-200 sm:text-[28px]',
                selected ? 'motion-safe:animate-pop' : 'opacity-80 grayscale-[40%] group-hover:grayscale-0',
              ].join(' ')}
            >
              {mood.emoji}
            </span>
            <span className="truncate text-[11px] font-medium sm:text-xs">{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
