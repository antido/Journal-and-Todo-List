import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './context.js'

const DURATION_MS = 5000

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const dismiss = useCallback(() => {
    clearTimeout(timer.current)
    setToast(null)
  }, [])

  const showToast = useCallback(
    (message, action) => {
      clearTimeout(timer.current)
      setToast({ id: Date.now(), message, action })
      timer.current = setTimeout(dismiss, DURATION_MS)
    },
    [dismiss],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8"
      >
        {toast && (
          <div
            key={toast.id}
            className="pointer-events-auto flex min-h-11 items-center gap-3 rounded-2xl bg-ink py-1.5 pr-1.5 pl-4 text-sm font-medium text-canvas shadow-float motion-safe:animate-toast-in"
          >
            <span>{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action.onClick()
                  dismiss()
                }}
                className="h-8 rounded-xl bg-canvas/10 px-3 font-semibold text-canvas transition-colors hover:bg-canvas/20"
              >
                {toast.action.label}
              </button>
            ) : (
              <span className="pr-2.5" />
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
