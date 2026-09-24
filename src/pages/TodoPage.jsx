import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useToast } from '../components/toast/context.js'
import Button from '../components/ui/Button.jsx'
import TodoComposer from '../features/todo/components/TodoComposer.jsx'
import TodoOverview from '../features/todo/components/TodoOverview.jsx'
import TodoSection from '../features/todo/components/TodoSection.jsx'
import TodoToolbar from '../features/todo/components/TodoToolbar.jsx'
import { completedTodos, computeTodoStats, filterTodos, groupActive } from '../features/todo/selectors.js'
import { useLocalStorageState } from '../hooks/useLocalStorageState.js'
import { formatDate, toDateKey } from '../lib/dates.js'
import { useTodos } from '../store/context.js'

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

export default function TodoPage() {
  const { todos, add, update, setCompleted, remove, clearCompleted, restore } = useTodos()
  const showToast = useToast()
  const [sort, setSort] = useLocalStorageState('todos.sort', 'smart')
  const [filters, setFilters] = useState({ status: 'all', query: '', due: null, priority: null, tag: null })
  const today = toDateKey()

  useEffect(() => {
    document.title = 'Todo · Journal & Todo'
  }, [])

  const stats = useMemo(() => computeTodoStats(todos, today), [todos, today])
  const allTags = useMemo(() => [...new Set(todos.flatMap((todo) => todo.tags ?? []))].sort(), [todos])
  const narrowed = useMemo(() => filterTodos(todos, filters, today), [todos, filters, today])
  const activeGroups = useMemo(
    () => (filters.status === 'completed' ? [] : groupActive(narrowed, sort, today)),
    [narrowed, filters.status, sort, today],
  )
  const done = useMemo(
    () => (filters.status === 'active' ? [] : completedTodos(narrowed)),
    [narrowed, filters.status],
  )

  const counts = {
    all: narrowed.length,
    active: narrowed.filter((todo) => !todo.completed).length,
    completed: narrowed.filter((todo) => todo.completed).length,
  }
  const shown = counts[filters.status]
  const narrowing = Boolean(filters.query || filters.due || filters.priority || filters.tag)

  const setTag = (tag) => setFilters((current) => ({ ...current, tag }))
  const clearFilters = (patch = {}) =>
    setFilters((current) => ({ ...current, query: '', due: null, priority: null, tag: null, ...patch }))

  const handleAdd = (data) => {
    const todo = add(data)
    // Don't let a new task silently vanish behind the current filters.
    const hidden = filters.status === 'completed' || filterTodos([todo], filters, today).length === 0
    if (hidden) {
      showToast('Task added — hidden by filters', {
        label: 'Show',
        onClick: () => clearFilters({ status: 'all' }),
      })
    }
  }

  const handleToggle = (todo) => {
    const completing = !todo.completed
    setCompleted(todo.id, completing)
    if (completing) {
      showToast('Task completed', { label: 'Undo', onClick: () => setCompleted(todo.id, false) })
    }
  }

  const handleDelete = (todo) => {
    remove(todo.id)
    showToast('Task deleted', { label: 'Undo', onClick: () => restore([todo]) })
  }

  const handleClearCompleted = () => {
    const removed = clearCompleted()
    if (removed.length) {
      showToast(`Cleared ${plural(removed.length, 'task')}`, { label: 'Undo', onClick: () => restore(removed) })
    }
  }

  const itemProps = {
    onToggle: handleToggle,
    onUpdate: (id, data) => {
      update(id, data)
      showToast('Task updated')
    },
    onDelete: handleDelete,
    onTagClick: (tag) => setTag(filters.tag === tag ? null : tag),
    activeTag: filters.tag,
    tagSuggestions: allTags,
  }

  const clearCompletedButton = (
    <Button variant="ghost" size="sm" onClick={handleClearCompleted}>
      Clear completed
    </Button>
  )

  const renderEmpty = () => {
    if (todos.length === 0) {
      return (
        <EmptyState
          icon="✅"
          title="No tasks yet"
          description="Add your first task above. Press Enter to save it; tasks are kept in this browser."
        />
      )
    }
    if (narrowing) {
      return (
        <EmptyState
          icon="🔍"
          title="No matching tasks"
          description="Try a different search or clear the filters."
          action={
            <Button variant="secondary" size="sm" onClick={() => clearFilters()}>
              Clear filters
            </Button>
          }
        />
      )
    }
    if (filters.status === 'completed') {
      return <EmptyState icon="🌱" title="Nothing completed yet" description="Finished tasks will collect here." />
    }
    return <EmptyState icon="🎉" title="All done!" description="Every task is complete. Enjoy the calm." />
  }

  const isEmpty = activeGroups.length === 0 && done.length === 0

  return (
    <section aria-labelledby="todo-heading">
      <PageHeader
        id="todo-heading"
        eyebrow={formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' })}
        title="Todo"
        subtitle={
          stats.total
            ? `${plural(stats.active, 'task')} left${stats.dueToday ? ` · ${stats.dueToday} due today` : ''}`
            : 'Things to get done.'
        }
      />

      {/* Mobile order: composer, overview, tasks. Desktop: overview becomes a sticky sidebar. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_1fr] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <TodoComposer onAdd={handleAdd} tagSuggestions={allTags} />
        </div>

        <aside
          aria-label="Task overview"
          className="lg:sticky lg:top-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <TodoOverview stats={stats} activeTag={filters.tag} onTagClick={setTag} />
        </aside>

        <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
          <h2 className="sr-only">Tasks</h2>

          {todos.length > 0 && (
            <TodoToolbar
              filters={{ ...filters, sort }}
              onChange={({ sort: nextSort, ...next }) => {
                setSort(nextSort)
                setFilters(next)
              }}
              counts={counts}
              shown={shown}
              total={todos.length}
            />
          )}

          {isEmpty ? (
            renderEmpty()
          ) : (
            <div className="space-y-8">
              {activeGroups.map((group) => (
                <TodoSection
                  key={group.key}
                  label={group.label}
                  items={group.items}
                  tone={group.key === 'overdue' ? 'danger' : undefined}
                  {...itemProps}
                />
              ))}

              {done.length > 0 && (
                <TodoSection
                  label="Completed"
                  items={done}
                  collapsible={filters.status === 'all'}
                  action={clearCompletedButton}
                  {...itemProps}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
