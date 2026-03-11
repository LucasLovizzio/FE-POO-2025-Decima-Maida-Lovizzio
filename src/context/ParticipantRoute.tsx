import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { ReactNode } from 'react'

export const ParticipantRoute = ({ children }: { children: ReactNode }) => {
  const { token, role } = useAuth()

  // Si no hay sesión
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si es ADMIN y quiere entrar a zona participante
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  // Si no es PARTICIPANT
  if (role !== 'PARTICIPANT') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
