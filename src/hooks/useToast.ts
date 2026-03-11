import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

export function useToast() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider')
  }

  return context
}
