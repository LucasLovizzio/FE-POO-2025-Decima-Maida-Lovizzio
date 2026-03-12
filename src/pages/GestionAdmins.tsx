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
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Gestión de Administradores</h1>

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
