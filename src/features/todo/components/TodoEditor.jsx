import { useLayoutEffect, useRef, useState } from 'react'
import TagInput from '../../../components/TagInput.jsx'
import Button from '../../../components/ui/Button.jsx'
import Card from '../../../components/ui/Card.jsx'
import DuePicker from './DuePicker.jsx'
import PriorityPicker from './PriorityPicker.jsx'

/** Inline editor for an existing task. Enter in the title or Ctrl/⌘+Enter saves; Escape cancels. */
export default function TodoEditor({ todo, onSave, onCancel, tagSuggestions }) {
  const [draft, setDraft] = useState(() => ({
    title: todo.title,
    notes: todo.notes ?? '',
    priority: todo.priority ?? null,
    due: todo.due ?? null,
    tags: todo.tags ?? [],
  }))
  const notesRef = useRef(null)
  const set = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const canSave = draft.title.trim().length > 0

  useLayoutEffect(() => {
    const el = notesRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [draft.notes])

  const save = () => {
    if (canSave) onSave({ ...draft, title: draft.title.trim(), notes: draft.notes.trim() })
  }

  return (
    <Card
      as="form"
      padding="sm"
      aria-label="Edit task"
      onSubmit={(event) => {
        event.preventDefault()
        save()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onCancel()
        } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          save()
        }
      }}
      className="space-y-3 border-accent/40 ring-4 ring-accent/10 sm:p-5"
    >
      <input
        value={draft.title}
        onChange={(event) => set({ title: event.target.value })}
        aria-label="Task title"
        maxLength={200}
        autoFocus
        className="w-full bg-transparent text-base font-medium text-ink outline-none"
      />
      <textarea
        ref={notesRef}
        value={draft.notes}
        onChange={(event) => set({ notes: event.target.value })}
        placeholder="Add notes…"
        aria-label="Notes"
        rows={2}
        className="block max-h-64 w-full resize-none bg-transparent text-sm leading-6 text-ink-2 outline-none placeholder:text-faint"
      />
      <div className="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:flex-wrap sm:items-center">
        <PriorityPicker value={draft.priority} onChange={(priority) => set({ priority })} />
        <DuePicker value={draft.due} onChange={(due) => set({ due })} />
        <TagInput tags={draft.tags} onChange={(tags) => set({ tags })} suggestions={tagSuggestions} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!canSave} className="px-4">
          Save
        </Button>
      </div>
    </Card>
  )
}
