import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function AppHeader() {
  const { user, role, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo / Home */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white select-none">
            T
          </div>
          <span className="text-lg font-bold text-gray-900">TorneosApp</span>
        </Link>

        {/* User info + Logout */}
        {user && (
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {role === 'ADMIN' ? 'Admin' : 'Participante'}
            </span>
            <span className="hidden text-sm font-medium text-gray-600 sm:block">{user}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader
