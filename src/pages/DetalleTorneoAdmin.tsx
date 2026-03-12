import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { competitionService } from '../services/competitionService'
import type { CompetitionResponse } from '../types'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'
import { InscriptionModal } from '../components/InscriptionsModal'

function DetalleTorneoAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [competitions, setCompetitions] = useState<CompetitionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Formulario crear
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Formulario editar
  const [editingCompetition, setEditingCompetition] = useState<CompetitionResponse | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCapacity, setEditCapacity] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Modal inscripciones
  const [isInscriptionsModalOpen, setIsInscriptionsModalOpen] = useState(false)
  const [selectedCompetitionForInscriptions, setSelectedCompetitionForInscriptions] = useState<{
    id: number
    name: string
  } | null>(null)

  useEffect(() => {
    if (id) {
      loadCompetitions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadCompetitions = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const res = await competitionService.getAdminAll(Number(id))
      setCompetitions(res.data)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault()

    const priceNum = Number(price)
    const capacityNum = Number(capacity)

    if (!name.trim()) {
      toast.warning('El nombre es obligatorio')
      return
    }

    if (priceNum <= 0 || isNaN(priceNum)) {
      toast.warning('El precio debe ser mayor a 0')
      return
    }

    if (capacityNum <= 0 || isNaN(capacityNum)) {
      toast.warning('La capacidad debe ser mayor a 0')
      return
    }

    try {
      setIsCreating(true)
      const res = await competitionService.create(Number(id), {
        name,
        basePrice: priceNum,
        capacity: capacityNum,
      })

      setCompetitions((prev) => [...prev, res.data])

      setName('')
      setPrice('')
      setCapacity('')

      toast.success('Competencia creada exitosamente')
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditClick = (comp: CompetitionResponse) => {
    setEditingCompetition(comp)
    setEditName(comp.name)
    setEditPrice(String(comp.basePrice))
    setEditCapacity(String(comp.capacity))
  }

  const handleUpdateCompetition = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCompetition || !id) return

    const priceNum = Number(editPrice)
    const capacityNum = Number(editCapacity)

    if (!editName.trim()) {
      toast.warning('El nombre es obligatorio')
      return
    }

    if (priceNum <= 0 || isNaN(priceNum)) {
      toast.warning('El precio debe ser mayor a 0')
      return
    }

    if (capacityNum <= 0 || isNaN(capacityNum)) {
      toast.warning('La capacidad debe ser mayor a 0')
      return
    }

    try {
      setIsUpdating(true)
      const res = await competitionService.update(Number(id), {
        name: editName,
        basePrice: priceNum,
        capacity: capacityNum,
      })

      setCompetitions((prev) =>
        prev.map((comp) => (comp.id === editingCompetition.id ? res.data : comp))
      )

      setEditingCompetition(null)
      toast.success('Competencia actualizada exitosamente')
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCompetition = async (competitionId: number) => {
    if (!id) return

    const confirmDelete = window.confirm('¿Seguro que querés eliminar esta competencia?')
    if (!confirmDelete) return

    try {
      await competitionService.delete(Number(id), competitionId)
      setCompetitions((prev) => prev.filter((comp) => comp.id !== competitionId))
      toast.success('Competencia eliminada exitosamente')
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  const handleViewInscriptions = (comp: CompetitionResponse) => {
    setSelectedCompetitionForInscriptions({ id: comp.id, name: comp.name })
    setIsInscriptionsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-white">Cargando competencias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Gestión de Competencias</h1>
            <p className="mt-2 text-blue-100">Administra las competencias del torneo</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-blue-50"
          >
            ← Volver a Torneos
          </button>
        </div>

        {/* Formulario Crear Competencia */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Crear Nueva Competencia</h2>
          <form onSubmit={handleCreateCompetition} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej: Categoría Amateur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio Base *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="100.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacidad *</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="50"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isCreating ? 'Creando...' : 'Crear Competencia'}
            </button>
          </form>
        </div>

        {/* Formulario Editar (si está activo) */}
        {editingCompetition && (
          <div className="mb-8 rounded-lg bg-yellow-50 p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Editar Competencia</h2>
            <form onSubmit={handleUpdateCompetition} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio Base *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacidad *</label>
                  <input
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-green-400"
                >
                  {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCompetition(null)}
                  className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Competencias */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Competencias Existentes</h2>

          {competitions.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-lg font-medium text-gray-700">No hay competencias creadas</p>
              <p className="mt-2 text-gray-500">
                Crea la primera competencia usando el formulario de arriba.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {competitions.map((comp) => (
                <div
                  key={comp.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{comp.name}</h3>
                  <div className="mb-3 space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Precio:</span>
                      <span className="font-medium">${comp.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacidad:</span>
                      <span className="font-medium">{comp.capacity} participantes</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleViewInscriptions(comp)}
                      className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Ver Inscripciones
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(comp)}
                        className="flex-1 rounded bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCompetition(comp.id)}
                        className="flex-1 rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Inscripciones */}
        {selectedCompetitionForInscriptions && (
          <InscriptionModal
            isOpen={isInscriptionsModalOpen}
            onClose={() => {
              setIsInscriptionsModalOpen(false)
              setSelectedCompetitionForInscriptions(null)
            }}
            tournamentId={Number(id)}
            competitionId={selectedCompetitionForInscriptions.id}
            competitionName={selectedCompetitionForInscriptions.name}
          />
        )}
      </div>
    </div>
  )
}

export default DetalleTorneoAdmin
