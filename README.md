# Journal & Todo

A minimal journal and to-do list app built with React, Vite, React Router and Tailwind CSS.

## Getting started

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – build for production into `dist/`
- `npm run preview` – preview the production build
- `npm run lint` – lint with oxlint

## Features

- **Journal**: entries with mood, energy, tags, date and free text; autosaved
  draft; edit in place; delete with undo; search and mood/tag filters; stats,
  a 14-day mood trend and top tags.
- **Todo**: quick add with priority, due date and tags; smart grouping
  (Overdue / Today / Upcoming / No date); status, due, priority, tag and text
  filters; sort options; distinct completed styling; inline edit; undo for
  complete, delete and clear completed; progress overview.
- Light / dark / system theme, keyboard shortcuts (`/` search, Ctrl/⌘+Enter
  save, Esc cancel). Data is stored in the browser's localStorage.

## Design system

- **Tokens** live in `src/index.css`: semantic colors (`canvas`, `surface`,
  `ink`, `muted`, `line`, `accent`, `success`, `danger`, …) defined per theme and
  exposed as Tailwind utilities (`bg-surface`, `text-ink`, …). Components never
  use raw palette colors or `dark:` overrides.
- **Type**: Inter Variable for UI, Fraunces Variable for page and entry titles
  (both bundled via Fontsource, no external requests).
- **Primitives** in `src/components/ui/`: `Button`, `IconButton`, `Card`,
  `Segmented`, `Chip`, `Kbd`, plus the `.field` and `.eyebrow` classes.
- **Responsive shell**: bottom tab bar on phones, icon rail on tablets, full
  sidebar with live counts on desktop. Insights/overview panels become a sticky
  side column from `lg`.

## Structure

```
src/
  main.jsx              App entry: fonts, router, store, toasts
  App.jsx               Routes (/journal, /todo)
  index.css             Design tokens, fonts, base + component styles
  components/           App shell, page header, theme toggle, toasts, search,
                        tag input, stat tile, empty state, icons
    ui/                 Design-system primitives
  store/                Shared app data (journal + todos) via context
  hooks/                useLocalStorageState
  lib/                  storage, dates, theme helpers
  features/
    journal/            Journal state, stats, moods and components
    todo/               Todo state, selectors (filter/sort/group) and components
  pages/
    JournalPage.jsx     Journal section
    TodoPage.jsx        Todo section
```
