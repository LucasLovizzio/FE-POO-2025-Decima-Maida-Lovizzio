import { useEffect, useState } from 'react'
import { adminAccountService } from '../services/adminAccountService'
import type { AdminAccount } from '../types'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'

function GestionAdmins() {
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const toast = useToast()

  // ⚠️ esto debería venir del login normalmente
  const loggedAdminId = 1

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const res = await adminAccountService.getAll()
        setAdmins(res.data)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        toast.error(errorMessage)
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
      toast.success('Administrador eliminado exitosamente')
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-4xl font-bold text-indigo-600">
          Gestión de Administradores
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between rounded-lg bg-white p-5 shadow-lg transition-shadow hover:shadow-xl"
            >
            <span className="text-gray-800 font-semibold">
              {admin.email}
            </span>

              {admin.id !== loggedAdminId && (
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  onClick={() => handleDelete(admin.id)}
                >
                  Eliminar
                </button>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default GestionAdmins
