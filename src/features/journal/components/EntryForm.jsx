import { useLayoutEffect, useRef } from 'react'
import TagInput from '../../../components/TagInput.jsx'
import Button from '../../../components/ui/Button.jsx'
import Kbd from '../../../components/ui/Kbd.jsx'
import { toDateKey } from '../../../lib/dates.js'
import { countWords, isEntryEmpty } from '../entry.js'
import EnergyPicker from './EnergyPicker.jsx'
import MoodPicker from './MoodPicker.jsx'

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

/**
 * Controlled entry form used for both new entries and edits.
 * Ctrl/⌘+Enter submits; Escape cancels (when onCancel is provided).
 */
export default function EntryForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancel',
  submitLabel = 'Save entry',
  status,
  tagSuggestions,
  autoFocus = false,
}) {
  const bodyRef = useRef(null)
  const words = countWords(value.body)
  const canSubmit = !isEntryEmpty(value)
  const set = (patch) => onChange({ ...value, ...patch })

  // Grow the textarea with its content.
  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value.body])

  const submit = () => {
    if (!canSubmit) return
    onSubmit({
      ...value,
      title: value.title.trim(),
      body: value.body.trim(),
      date: value.date || toDateKey(),
    })
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          submit()
        } else if (event.key === 'Escape' && onCancel) {
          event.preventDefault()
          onCancel()
        }
      }}
    >
      <fieldset>
        <legend className="eyebrow mb-3">How are you feeling?</legend>
        <MoodPicker value={value.mood} onChange={(mood) => set({ mood })} />
      </fieldset>

      <div className="mt-6">
        <input
          value={value.title}
          onChange={(event) => set({ title: event.target.value })}
          placeholder="Give it a title…"
          aria-label="Title"
          maxLength={120}
          autoFocus={autoFocus}
          className="w-full bg-transparent font-display text-[22px] leading-tight font-semibold tracking-[-0.01em] text-ink outline-none placeholder:font-medium placeholder:text-faint/70 sm:text-2xl"
        />
        <textarea
          ref={bodyRef}
          value={value.body}
          onChange={(event) => set({ body: event.target.value })}
          placeholder="What's on your mind today?"
          aria-label="Entry"
          rows={4}
          className="mt-3 block max-h-[60vh] min-h-28 w-full resize-none bg-transparent text-base leading-7 text-ink-2 outline-none placeholder:text-faint"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:items-center">
        <TagInput tags={value.tags} onChange={(tags) => set({ tags })} suggestions={tagSuggestions} />
        <div className="flex flex-wrap items-center gap-2.5">
          <EnergyPicker value={value.energy} onChange={(energy) => set({ energy })} />
          <input
            type="date"
            value={value.date}
            max={toDateKey()}
            onChange={(event) => set({ date: event.target.value })}
            aria-label="Entry date"
            className="field h-9 px-3 text-xs font-medium text-ink-2 shadow-none"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-muted" aria-live="polite">
          <span className="tabular-nums">
            {words} {words === 1 ? 'word' : 'words'}
          </span>
          {status && (
            <>
              <span aria-hidden="true" className="size-1 rounded-full bg-faint" />
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-success-fill" />
                {status}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-1 text-xs text-faint lg:inline-flex" aria-hidden="true">
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>↵</Kbd>
          </span>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={!canSubmit} title={`${submitLabel} (${isMac ? '⌘' : 'Ctrl'}+Enter)`}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
