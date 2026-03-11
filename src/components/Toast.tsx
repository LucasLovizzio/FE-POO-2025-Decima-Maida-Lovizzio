import { useEffect } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-indigo-600 text-white',
  error: 'bg-purple-700 text-white',
  warning: 'bg-indigo-400 text-white',
  info: 'bg-purple-500 text-white',
}

const variantIcons: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

function Toast({ id, message, variant, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={` ${variantStyles[variant]} animate-slide-in-right mb-2 flex max-w-md min-w-[300px] items-start gap-3 rounded-lg p-4 shadow-lg`}
      role="alert"
    >
      <div className="flex-shrink-0 text-xl font-bold">{variantIcons[variant]}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-xl font-bold opacity-70 transition-opacity hover:opacity-100"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
