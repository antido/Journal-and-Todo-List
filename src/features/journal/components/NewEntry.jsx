import { useEffect } from 'react'
import { useToast } from '../../../components/toast/context.js'
import Card from '../../../components/ui/Card.jsx'
import { useLocalStorageState } from '../../../hooks/useLocalStorageState.js'
import { toDateKey } from '../../../lib/dates.js'
import { emptyEntry, isEntryEmpty } from '../entry.js'
import EntryForm from './EntryForm.jsx'

const DRAFT_KEY = 'journal.draft.v1'

/** Composer for a new entry. The draft autosaves, so nothing is lost on reload. */
export default function NewEntry({ onCreate, tagSuggestions }) {
  const [draft, setDraft] = useLocalStorageState(DRAFT_KEY, emptyEntry)
  const showToast = useToast()
  const hasDraft = !isEntryEmpty(draft) || draft.tags.length > 0

  // An untouched draft from an earlier day should default to today again.
  useEffect(() => {
    const today = toDateKey()
    setDraft((current) =>
      isEntryEmpty(current) && !current.tags.length && current.date !== today
        ? { ...current, date: today }
        : current,
    )
  }, [setDraft])

  const discard = () => {
    const previous = draft
    setDraft(emptyEntry())
    showToast('Draft discarded', { label: 'Undo', onClick: () => setDraft(previous) })
  }

  return (
    <Card as="section" aria-label="New entry" className="sm:p-7">

      <EntryForm
        value={draft}
        onChange={setDraft}
        onSubmit={(entry) => {
          onCreate(entry)
          setDraft(emptyEntry())
        }}
        onCancel={hasDraft ? discard : undefined}
        cancelLabel="Discard"
        status={hasDraft ? 'Draft saved' : null}
        tagSuggestions={tagSuggestions}
      />
    </Card>
  )
}
