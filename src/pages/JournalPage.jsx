import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useToast } from '../components/toast/context.js'
import Button from '../components/ui/Button.jsx'
import EntryList from '../features/journal/components/EntryList.jsx'
import JournalInsights from '../features/journal/components/JournalInsights.jsx'
import JournalToolbar from '../features/journal/components/JournalToolbar.jsx'
import NewEntry from '../features/journal/components/NewEntry.jsx'
import { computeStats } from '../features/journal/stats.js'
import { formatDate, greeting, toDateKey } from '../lib/dates.js'
import { useJournal } from '../store/context.js'

function matchesQuery(entry, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [entry.title, entry.body, ...(entry.tags ?? [])].some((text) =>
    text?.toLowerCase().includes(needle),
  )
}

export default function JournalPage() {
  const { entries, add, update, remove, restore } = useJournal()
  const showToast = useToast()
  const [query, setQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState(null)
  const [tagFilter, setTagFilter] = useState(null)

  useEffect(() => {
    document.title = 'Journal · Journal & Todo'
  }, [])

  const stats = useMemo(() => computeStats(entries), [entries])
  const allTags = useMemo(
    () => [...new Set(entries.flatMap((entry) => entry.tags ?? []))].sort(),
    [entries],
  )
  const visible = useMemo(
    () =>
      entries.filter(
        (entry) =>
          matchesQuery(entry, query) &&
          (moodFilter == null || entry.mood === moodFilter) &&
          (tagFilter == null || entry.tags?.includes(tagFilter)),
      ),
    [entries, query, moodFilter, tagFilter],
  )

  const handleDelete = (entry) => {
    remove(entry.id)
    showToast('Entry deleted', { label: 'Undo', onClick: () => restore(entry) })
  }

  const clearFilters = () => {
    setQuery('')
    setMoodFilter(null)
    setTagFilter(null)
  }

  return (
    <section aria-labelledby="journal-heading">
      <PageHeader
        id="journal-heading"
        eyebrow={formatDate(toDateKey(), { weekday: 'long', month: 'long', day: 'numeric' })}
        title="Journal"
        subtitle={`${greeting()}. How are you, really?`}
      />

      {/* Mobile order: composer, insights, entries. Desktop: insights become a sticky sidebar. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_1fr] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <NewEntry
            tagSuggestions={allTags}
            onCreate={(entry) => {
              add(entry)
              showToast('Entry saved')
            }}
          />
        </div>

        <aside
          aria-label="Journal insights"
          className="lg:sticky lg:top-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <JournalInsights stats={stats} activeTag={tagFilter} onTagClick={setTagFilter} />
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <section aria-labelledby="entries-heading" className="space-y-6">
            <h2 id="entries-heading" className="sr-only">
              Entries
            </h2>

            {entries.length > 0 && (
              <JournalToolbar
                query={query}
                onQueryChange={setQuery}
                mood={moodFilter}
                onMoodChange={setMoodFilter}
                tag={tagFilter}
                onTagChange={setTagFilter}
                shown={visible.length}
                total={entries.length}
              />
            )}

            {entries.length === 0 ? (
              <EmptyState
                icon="📓"
                title="Your journal is empty"
                description="Pick a mood and write a few lines above. Entries are saved in this browser."
              />
            ) : visible.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No matching entries"
                description="Try a different search or clear the filters."
                action={
                  <Button variant="secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <EntryList
                entries={visible}
                onUpdate={(id, data) => {
                  update(id, data)
                  showToast('Changes saved')
                }}
                onDelete={handleDelete}
                onTagClick={(tag) => setTagFilter((current) => (current === tag ? null : tag))}
                activeTag={tagFilter}
                tagSuggestions={allTags}
              />
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
