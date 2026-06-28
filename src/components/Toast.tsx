import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

// Displays a temporary status notification.
function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timerId = window.setTimeout(onClose, 3000)

    return () => window.clearTimeout(timerId)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
    </div>
  )
}

export default Toast
