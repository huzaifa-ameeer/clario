import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

const MAX_TOASTS = 4
const DISMISS_AFTER = 4500

function ToastNotification() {
  const [toasts, setToasts] = useState([])

  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  useEffect(() => {
    const showNotification = (event) => {
      const { message, type = 'success' } = event.detail || {}
      if (!message) return

      const id = Date.now() + Math.random()
      setToasts((prev) => [{ id, message, type }, ...prev].slice(0, MAX_TOASTS))
      window.setTimeout(() => dismissToast(id), DISMISS_AFTER)
    }

    window.addEventListener('app-notification', showNotification)
    return () => window.removeEventListener('app-notification', showNotification)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error'
        const Icon = isError ? AlertCircle : CheckCircle2

        return (
          <div
            key={toast.id}
            role={isError ? 'alert' : 'status'}
            className={`toast-slide-in flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              isError
                ? 'border-red-200 bg-white text-red-700 dark:border-red-900 dark:bg-gray-950 dark:text-red-300'
                : 'border-green-200 bg-white text-green-700 dark:border-green-900 dark:bg-gray-950 dark:text-green-300'
            }`}
          >
            <Icon size={20} className="shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastNotification
