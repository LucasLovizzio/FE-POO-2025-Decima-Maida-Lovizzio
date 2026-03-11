import { useEffect, useState } from 'react'
import { adminAccountService } from '../services/adminAccountService'
import type { AdminAccount } from '../types'

function GestionAdmins() {
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const [error, setError] = useState<string | null>(null)

  // ⚠️ esto debería venir del login normalmente
  const loggedAdminId = 1

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const res = await adminAccountService.getAll()
        setAdmins(res.data)
      } catch (error) {
        console.error(error)
        setError('Error al cargar administradores')
      }
    }
    loadAdmins()
  }, [])

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Seguro que querés eliminar este administrador?')
    if (!confirmDelete) return

    try {
      await adminAccountService.delete(id)
      // actualizar lista sin recargar
      setAdmins((prev) => prev.filter((admin) => admin.id !== id))
    } catch (error) {
      console.error(error)
      setError('No se pudo eliminar el administrador')
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Gestión de Administradores</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <ul className="space-y-4">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="flex items-center justify-between rounded bg-white p-4 shadow"
          >
            <span>{admin.email}</span>
            {admin.id !== loggedAdminId && (
              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => handleDelete(admin.id)}
              >
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GestionAdmins
