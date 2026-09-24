import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { toDateKey } from '../lib/dates.js'
import { useJournal, useTodos } from '../store/context.js'
import { BookIcon, ListChecksIcon } from './icons.jsx'
import ThemeToggle from './ThemeToggle.jsx'

function LogoMark({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-canvas shadow-card ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    </span>
  )
}

function Wordmark() {
  return (
    <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
      Journal <span className="text-faint">&amp;</span> Todo
    </span>
  )
}

/** Nav destinations with live counts from the shared store. */
function useNavItems() {
  const { entries } = useJournal()
  const { todos } = useTodos()

  return useMemo(() => {
    const today = toDateKey()
    const active = todos.filter((todo) => !todo.completed)
    const overdue = active.some((todo) => todo.due && todo.due < today)
    return [
      { to: '/journal', label: 'Journal', Icon: BookIcon, count: entries.length, countLabel: 'entries' },
      {
        to: '/todo',
        label: 'Todo',
        Icon: ListChecksIcon,
        count: active.length,
        countLabel: 'active',
        alert: overdue,
        badge: true,
      },
    ]
  }, [entries, todos])
}

/** Tablet rail (md) and full sidebar (xl). */
function Sidebar({ items }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[84px] shrink-0 flex-col border-r border-line bg-surface/60 px-3 py-5 backdrop-blur md:flex xl:w-64 xl:px-4">
      <div className="flex items-center justify-center gap-3 xl:justify-start xl:px-2">
        <LogoMark />
        <span className="hidden xl:inline">
          <Wordmark />
        </span>
      </div>

      <nav aria-label="Sections" className="mt-8 flex flex-col gap-1">
        {items.map(({ to, label, Icon, count, countLabel, alert }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'group relative flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors xl:flex-row xl:gap-3 xl:px-3 xl:text-sm',
                isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-2 hover:text-ink',
              ].join(' ')
            }
          >
            <span className="relative">
              <Icon className="size-5" />
              {alert && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-danger ring-2 ring-surface xl:hidden" />
              )}
            </span>
            <span>{label}</span>
            <span className="hidden xl:ml-auto xl:inline-flex xl:items-center xl:gap-1.5">
              {alert && <span aria-hidden="true" className="size-1.5 rounded-full bg-danger" />}
              <span className="text-xs tabular-nums opacity-70">
                <span className="sr-only">, </span>
                {count}
                <span className="sr-only"> {countLabel}</span>
              </span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="flex justify-center xl:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden xl:block">
          <ThemeToggle showLabel />
        </div>
      </div>
    </aside>
  )
}

/** Phone: compact top bar + bottom tab bar. */
function MobileTopBar() {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-canvas/85 px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2.5">
        <LogoMark className="size-8" />
        <Wordmark />
      </div>
      <ThemeToggle />
    </div>
  )
}

function MobileTabBar({ items }) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-1 px-3 py-2">
        {items.map(({ to, label, Icon, count, countLabel, alert, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors',
                isActive ? 'bg-accent-soft text-accent' : 'text-muted',
              ].join(' ')
            }
          >
            <span className="relative">
              <Icon className="size-5" />
              {badge && count > 0 && (
                <span
                  className={`absolute -top-1.5 left-3.5 min-w-4 rounded-full px-1 text-center text-[10px] leading-4 font-semibold tabular-nums ${alert ? 'bg-danger text-white' : 'bg-ink text-canvas'}`}
                >
                  <span className="sr-only">, </span>
                  {count}
                  <span className="sr-only"> {countLabel}</span>
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function AppShell() {
  const { pathname } = useLocation()
  const items = useNavItems()

  return (
    <div className="min-h-dvh md:flex">
      <a
        href="#main"
        className="sr-only rounded-lg bg-ink px-3 py-2 text-sm text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>

      <Sidebar items={items} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        {/* Keyed by path so each section fades in when switching. */}
        <main
          id="main"
          key={pathname}
          className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 motion-safe:animate-fade-in sm:px-6 md:px-8 md:pt-10 md:pb-16 xl:px-12 xl:pt-12"
        >
          <Outlet />
        </main>
      </div>

      <MobileTabBar items={items} />
    </div>
  )
}
