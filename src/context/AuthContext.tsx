import { createContext, useState, useMemo, useCallback, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

interface JwtPayload {
  sub: string
  role: string
  exp: number
}

interface AuthContextType {
  user: string | null
  token: string | null
  role: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  // Inicializa el estado con una función para evitar lecturas innecesarias
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  // Decodifica el token con manejo de errores y validación de expiración
  const decoded = useMemo(() => {
    if (!token) return null

    try {
      const payload = jwtDecode<JwtPayload>(token)

      // Valida si el token expiró
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < currentTime) {
        // Token expirado, limpiar
        return null
      }

      return payload
    } catch {
      // Token inválido o corrupto, limpiar silenciosamente
      return null
    }
  }, [token])

  // Limpia el token si está corrupto o expirado
  useEffect(() => {
    if (token && !decoded) {
      localStorage.removeItem('token')
      setToken(null)
    }
  }, [token, decoded])

  const user = decoded?.sub ?? null
  const role = decoded?.role ?? null

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    // No navegamos automáticamente, dejamos que cada página decida
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }, [navigate])

  // Memoiza el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(
    () => ({ user, token, role, login, logout }),
    [user, token, role, login, logout]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext }
