import { useEffect, useRef } from 'react'
import { SearchIcon, XIcon } from './icons.jsx'
import Kbd from './ui/Kbd.jsx'

/** Search input. "/" focuses it from anywhere on the page; Escape clears it. */
export default function SearchField({ value, onChange, label, placeholder = label }) {
  const inputRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      const typing =
        /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="field relative flex h-11 items-center">
      <SearchIcon className="pointer-events-none absolute left-3.5 size-4 text-faint" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.key === 'Escape' && onChange('')}
        placeholder={placeholder}
        aria-label={label}
        className="h-full w-full min-w-0 bg-transparent pr-12 pl-10 text-sm text-ink outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-2 grid size-7 place-items-center rounded-md text-faint hover:bg-surface-2 hover:text-ink"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : (
        <Kbd className="pointer-events-none absolute right-3 hidden sm:inline-grid">/</Kbd>
      )}
    </div>
  )
}
