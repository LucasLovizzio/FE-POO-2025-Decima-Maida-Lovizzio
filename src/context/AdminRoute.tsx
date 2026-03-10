import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { ReactNode } from 'react'

// Componente que protege rutas exclusivas para administradores
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  // Obtenemos el token y el rol del contexto de autenticación
  const { token, role } = useAuth()

  // Si no hay token, el usuario no está autenticado → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario está autenticado pero no es ADMIN → redirige al inicio
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  // Si tiene token y es ADMIN, renderiza el contenido protegido
  return <>{children}</>
}
