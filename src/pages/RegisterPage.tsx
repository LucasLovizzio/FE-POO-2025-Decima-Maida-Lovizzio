import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService.ts'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'
import { DocType } from '../types/enums'

function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    docType: DocType.DNI,
    docNumber: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (
      !formData.name.trim() ||
      !formData.lastName.trim()||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.docNumber.trim()
    ) {
      toast.error('Todos los campos son obligatorios.')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await authService.registerParticipant(formData)
      toast.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.')
      // redirige al login despues de registro exitoso
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Registro de Participante
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
            <select
              name="docType"
              value={formData.docType}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value={DocType.DNI}>DNI</option>
              <option value={DocType.PASSPORT}>Pasaporte</option>
              <option value={DocType.OTHER}>Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Documento</label>
            <input
              type="text"
              name="docNumber"
              value={formData.docNumber}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
