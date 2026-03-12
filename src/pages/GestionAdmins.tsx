import { useEffect, useState } from 'react'
import { adminAccountService } from '../services/adminAccountService'
import type { AdminAccount } from '../types'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'
import { useAuth } from '../context/useAuth'
import AppHeader from '../components/AppHeader'

function GestionAdmins() {
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const toast = useToast()
  const { user: currentEmail } = useAuth()

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
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Administradores</h1>
          <p className="mt-1 text-sm text-gray-500">Administra las cuentas de la plataforma</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {admin.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800">{admin.email}</span>
              </div>

              {admin.email !== currentEmail && (
                <button
                  className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-600 hover:text-white"
                  onClick={() => handleDelete(admin.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GestionAdmins
