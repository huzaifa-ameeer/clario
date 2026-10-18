export const notify = (message, type = 'success') => {
  window.dispatchEvent(
    new CustomEvent('app-notification', { detail: { message, type } }),
  )
}
