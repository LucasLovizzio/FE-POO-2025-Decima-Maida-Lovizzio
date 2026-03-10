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
      return payload
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      return null
    }
  }, [token])

  // Validar expiración del token en un effect separado para mantener pureza
  useEffect(() => {
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp < currentTime) {
        // Token expirado, limpiar
        localStorage.removeItem('token')
        setToken(null)
      }
    }
  }, [decoded])

  // Limpia el token si está corrupto o expirado
  useEffect(() => {
    if (token && !decoded) {
      localStorage.removeItem('token')
      setToken(null)
    }
  }, [token, decoded])

  const user = decoded?.sub ?? null
  const role = decoded?.role ?? null

  const login = useCallback(
    (newToken: string) => {
      localStorage.setItem('token', newToken)
      setToken(newToken)
      navigate('/')
    },
    [navigate]
  )

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
