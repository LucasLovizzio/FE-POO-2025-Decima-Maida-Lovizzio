import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-3xl font-bold text-indigo-600">
          TorneosApp
        </Link>

        <div className="flex gap-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600">
            Inicio
          </Link>

          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Acceso
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
