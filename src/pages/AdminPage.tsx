import { useNavigate } from "react-router-dom"

function AdminPage() {
  const navigate = useNavigate()

  const tournament = { id: 1 } // ejemplo temporal

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Admin</h1>
        <p className="text-lg text-gray-600">Página exclusiva para administradores
        </p>

        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
        >
          Ver competencias
        </button>

      </div>
    </div>
  )
}


export default AdminPage