import { useState } from 'react'
import { CheckIcon, NotesIcon, PencilIcon, TrashIcon } from '../../../components/icons.jsx'
import IconButton from '../../../components/ui/IconButton.jsx'
import { dueLabel, toDateKey } from '../../../lib/dates.js'
import { DueBadge, PriorityBadge } from './TodoBadges.jsx'
import TodoEditor from './TodoEditor.jsx'

/** "Done today", "Done yesterday", "Done Sep 20". */
function completedLabel(completedAt) {
  if (!completedAt) return 'Done'
  const label = dueLabel(toDateKey(new Date(completedAt)))
  return /^(Today|Yesterday)$/.test(label) ? `Done ${label.toLowerCase()}` : `Done ${label}`
}

/**
 * Active tasks are raised cards. Completed tasks drop the card (transparent,
 * no border or shadow), get a filled green check, struck-through muted text
 * and a "Done" date, so the two states read apart at a glance.
 */
export default function TodoItem({ todo, onToggle, onUpdate, onDelete, onTagClick, activeTag, tagSuggestions }) {
  const [editing, setEditing] = useState(false)
  const done = todo.completed

  if (editing) {
    return (
      <TodoEditor
        todo={todo}
        tagSuggestions={tagSuggestions}
        onCancel={() => setEditing(false)}
        onSave={(data) => {
          onUpdate(todo.id, data)
          setEditing(false)
        }}
      />
    )
  }

  const hasMeta = todo.due || todo.priority || todo.tags?.length > 0 || done

  return (
    <div
      className={[
        'group flex items-start gap-3.5 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color,box-shadow] duration-200 sm:px-5',
        done
          ? 'border-transparent bg-transparent'
          : 'border-line bg-surface shadow-card hover:border-line-strong',
      ].join(' ')}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`${done ? 'Mark as not done' : 'Mark as done'}: ${todo.title}`}
        onClick={() => onToggle(todo)}
        className={[
          'group/check relative mt-px grid size-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-150',
          // Larger invisible hit area for touch.
          'before:absolute before:-inset-2.5 before:content-[""]',
          done
            ? 'border-success-fill bg-success-fill text-white'
            : 'border-line-strong text-success-fill hover:border-success-fill',
        ].join(' ')}
      >
        <CheckIcon
          className={[
            'size-3',
            done ? 'motion-safe:animate-pop' : 'opacity-0 transition-opacity group-hover/check:opacity-100',
          ].join(' ')}
          strokeWidth="3.5"
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          onDoubleClick={() => !done && setEditing(true)}
          className={[
            'text-[15px] leading-6 break-words',
            done ? 'text-faint line-through decoration-line-strong' : 'font-medium text-ink',
          ].join(' ')}
        >
          {todo.title}
        </p>

        {todo.notes && !done && (
          <p className="mt-0.5 line-clamp-2 text-sm leading-6 whitespace-pre-wrap text-muted">{todo.notes}</p>
        )}

        {hasMeta && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {done ? (
              <span className="inline-flex h-6 items-center gap-1 text-xs font-medium text-success">
                <CheckIcon className="size-3.5" strokeWidth="2.5" />
                {completedLabel(todo.completedAt)}
              </span>
            ) : (
              <>
                <DueBadge due={todo.due} completed={done} />
                <PriorityBadge value={todo.priority} />
              </>
            )}
            {todo.notes && done && (
              <span className="inline-flex items-center text-faint">
                <NotesIcon className="size-3.5" />
                <span className="sr-only">Has notes</span>
              </span>
            )}
            {todo.tags?.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                aria-pressed={activeTag === tag}
                title={`Show tasks tagged #${tag}`}
                className={[
                  'h-6 rounded-md px-1.5 text-xs font-medium transition-colors first:-ml-1.5 aria-pressed:bg-accent-soft aria-pressed:text-accent',
                  done ? 'text-faint hover:text-muted' : 'text-muted hover:bg-surface-2 hover:text-ink',
                ].join(' ')}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Always visible on touch; revealed on hover/focus on pointer devices. */}
      <div className="-my-1.5 -mr-2 flex shrink-0 gap-0.5 transition-opacity duration-150 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        {!done && (
          <IconButton label="Edit task" onClick={() => setEditing(true)}>
            <PencilIcon />
          </IconButton>
        )}
        <IconButton label="Delete task" tone="danger" onClick={() => onDelete(todo)}>
          <TrashIcon />
        </IconButton>
      </div>
    </div>
  )
}
