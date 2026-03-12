import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-3xl font-bold text-indigo-600">
          TorneosApp
        </Link>

        <div className="flex gap-6">
          <Link to="/torneos" className="text-gray-700 hover:text-indigo-600">
            Torneos
          </Link>

          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Acceso
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;