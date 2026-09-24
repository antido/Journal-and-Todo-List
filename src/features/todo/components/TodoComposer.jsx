import { useRef, useState } from 'react'
import { PlusIcon } from '../../../components/icons.jsx'
import TagInput from '../../../components/TagInput.jsx'
import Button from '../../../components/ui/Button.jsx'
import DuePicker from './DuePicker.jsx'
import PriorityPicker from './PriorityPicker.jsx'

const blank = { title: '', priority: null, due: null, tags: [] }

/**
 * Quick-add bar. Enter adds the task and keeps focus for rapid entry.
 * Details (priority, due, tags) reveal once you start typing or focus the bar.
 */
export default function TodoComposer({ onAdd, tagSuggestions }) {
  const [task, setTask] = useState(blank)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const set = (patch) => setTask((current) => ({ ...current, ...patch }))
  const canAdd = task.title.trim().length > 0
  const expanded = focused || canAdd || task.priority || task.due || task.tags.length > 0

  const submit = (event) => {
    event.preventDefault()
    if (!canAdd) return
    onAdd({ ...task, title: task.title.trim() })
    setTask(blank)
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={submit}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setTask(blank)
          inputRef.current?.blur()
        }
      }}
      aria-label="Add a task"
      className="field overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-3 py-2 pr-2 pl-4">
        <span
          aria-hidden="true"
          className={`grid size-6 shrink-0 place-items-center rounded-full transition-colors ${expanded ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-muted'}`}
        >
          <PlusIcon className="size-3.5" strokeWidth="2.5" />
        </span>
        <input
          ref={inputRef}
          value={task.title}
          onChange={(event) => set({ title: event.target.value })}
          placeholder="Add a task…"
          aria-label="Task title"
          maxLength={200}
          className="h-10 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-faint"
        />
        <Button type="submit" disabled={!canAdd} className="px-5">
          Add
        </Button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 border-t border-line bg-surface-2/50 px-4 py-3 motion-safe:animate-fade-in sm:flex-row sm:flex-wrap sm:items-center">
          <PriorityPicker value={task.priority} onChange={(priority) => set({ priority })} />
          <DuePicker value={task.due} onChange={(due) => set({ due })} />
          <TagInput tags={task.tags} onChange={(tags) => set({ tags })} suggestions={tagSuggestions} />
        </div>
      )}
    </form>
  )
}
