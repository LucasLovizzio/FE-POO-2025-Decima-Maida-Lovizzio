import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import type { TournamentResponse, CreateTournamentRequest } from '../types'
import TournamentCard from '../components/TournamentCard'
import CreateTournamentModal from '../components/CreateTournamentModal'

function AdminPage() {
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publishingId, setPublishingId] = useState<number | null>(null)

  // Cargar torneos al montar el componente
  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminService.getTournaments()
      
      // Ordenar por fecha descendente (más recientes primero)
      const sortedTournaments = [...response.data].sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      })
      
      setTournaments(sortedTournaments)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al cargar los torneos'
      setError(errorMessage)
      console.error('Error loading tournaments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTournament = async (data: CreateTournamentRequest) => {
    try {
      setError(null)
      const response = await adminService.createTournament(data)
      
      // Agregar el nuevo torneo a la lista sin recargar
      setTournaments((prev) => [response.data, ...prev])
      
      // Mostrar mensaje de éxito (opcional)
      console.log('Torneo creado exitosamente:', response.data)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al crear el torneo'
      setError(errorMessage)
      throw err // Re-lanzar para que el modal maneje el error
    }
  }

  const handlePublishTournament = async (id: number) => {
    try {
      setPublishingId(id)
      setError(null)
      
      const response = await adminService.publishTournament(id)
      
      // Actualizar el torneo en la lista sin recargar toda la página
      setTournaments((prev) =>
        prev.map((tournament) =>
          tournament.id === id ? response.data : tournament
        )
      )
      
      console.log('Torneo publicado exitosamente:', response.data)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al publicar el torneo'
      setError(errorMessage)
      console.error('Error publishing tournament:', err)
    } finally {
      setPublishingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
            <p className="mt-2 text-blue-100">Gestión de Torneos</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg transition-colors hover:bg-blue-50"
          >
            + Crear Torneo
          </button>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700">
            <div className="flex items-center">
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              <p className="text-white">Cargando torneos...</p>
            </div>
          </div>
        ) : tournaments.length === 0 ? (
          // Sin torneos
          <div className="rounded-lg bg-white p-12 text-center shadow-lg">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No hay torneos disponibles
            </h3>
            <p className="mb-6 text-gray-500">
              Comienza creando tu primer torneo
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Crear Torneo
            </button>
          </div>
        ) : (
          // Lista de torneos
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onPublish={handlePublishTournament}
                isPublishing={publishingId === tournament.id}
              />
            ))}
          </div>
        )}

        {/* Modal de crear torneo */}
        <CreateTournamentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTournament}
        />
      </div>
    </div>
  )
}

export default AdminPage