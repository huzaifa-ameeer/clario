import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

function ToastNotification() {
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    let timeoutId

    const showNotification = (event) => {
      const { message, type = 'success' } = event.detail || {}
      if (!message) return

      window.clearTimeout(timeoutId)
      setNotification({ message, type })
      timeoutId = window.setTimeout(() => setNotification(null), 4500)
    }

    window.addEventListener('app-notification', showNotification)
    return () => {
      window.removeEventListener('app-notification', showNotification)
      window.clearTimeout(timeoutId)
    }
  }, [])

  if (!notification) return null

  const isError = notification.type === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`toast-slide-in fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
        isError
          ? 'border-red-200 bg-white text-red-700 dark:border-red-900 dark:bg-gray-950 dark:text-red-300'
          : 'border-green-200 bg-white text-green-700 dark:border-green-900 dark:bg-gray-950 dark:text-green-300'
      }`}
    >
      <Icon size={20} className="shrink-0" />
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        type="button"
        onClick={() => setNotification(null)}
        aria-label="Dismiss notification"
        className="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default ToastNotification
