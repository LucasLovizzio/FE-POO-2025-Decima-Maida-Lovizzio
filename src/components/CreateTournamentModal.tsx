import { useState } from 'react'
import Modal from './Modal'
import type { CreateTournamentRequest } from '../types'

interface CreateTournamentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTournamentRequest) => Promise<void>
}

function CreateTournamentModal({ isOpen, onClose, onSubmit }: CreateTournamentModalProps) {
  const [formData, setFormData] = useState<CreateTournamentRequest>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    // Validar fecha inicio
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria'
    }

    // Validar fecha fin
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria'
    }

    // Validar que fecha fin sea posterior a fecha inicio
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end <= start) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Convertir fechas a formato ISO LocalDateTime
      const dataToSubmit: CreateTournamentRequest = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      }

      await onSubmit(dataToSubmit)

      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
      })
      setErrors({})
      onClose()
    } catch {
      // El error se maneja en el componente padre con toasts
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Torneo">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del Torneo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-white/50 px-3 py-2 shadow-sm bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
              placeholder="Ej: Campeonato Nacional 2026"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-white/50 px-3 py-2 shadow-sm bg-white/10 text-white placeholder-white/70 focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
              placeholder="Describe el torneo..."
            />
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium">
              Fecha de Inicio *
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-white/50 px-3 py-2 shadow-sm bg-white/10 text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
            />
          </div>

          {/* Fecha de Fin */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium">
              Fecha de Fin *
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-white/50 px-3 py-2 shadow-sm bg-white/10 text-white focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-md border border-white/50 bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-white text-indigo-700 px-4 py-2 text-sm font-medium hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creando...' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CreateTournamentModal
