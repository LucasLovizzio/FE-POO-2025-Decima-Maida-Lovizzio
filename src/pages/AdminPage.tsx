import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/adminService'
import type { TournamentResponse, CreateTournamentRequest } from '../types'
import TournamentCard from '../components/TournamentCard'
import CreateTournamentModal from '../components/CreateTournamentModal'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'

function AdminPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [tournaments, setTournaments] = useState<TournamentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publishingId, setPublishingId] = useState<number | null>(null)

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      setIsLoading(true)

      const response = await adminService.getTournaments()

      const sortedTournaments = [...response.data].sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      })

      setTournaments(sortedTournaments)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTournament = async (data: CreateTournamentRequest) => {
    try {
      const response = await adminService.createTournament(data)
      setTournaments((prev) => [response.data, ...prev])
      toast.success('Torneo creado exitosamente')
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
      throw err
    }
  }

  const handlePublishTournament = async (id: number) => {
    try {
      setPublishingId(id)

      const response = await adminService.publishTournament(id)

      setTournaments((prev) =>
        prev.map((tournament) => (tournament.id === id ? response.data : tournament))
      )

      toast.success('Torneo publicado exitosamente')
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
    } finally {
      setPublishingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
            <p className="mt-2 text-blue-100">Gestión de Torneos</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-blue-50"
          >
            + Crear Torneo
          </button>
        </div>

        {isLoading ? (
          <p className="text-white">Cargando torneos...</p>
        ) : tournaments.length === 0 ? (
          <p className="text-white">No hay torneos creados aún.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <div key={tournament.id}>
                <TournamentCard
                  tournament={tournament}
                  onPublish={handlePublishTournament}
                  isPublishing={publishingId === tournament.id}
                />

                <button
                  className="mt-2 w-full rounded bg-blue-500 py-2 text-white"
                  onClick={() => navigate(`/admin/tournaments/${tournament.id}`)}
                >
                  Ver competencias
                </button>
              </div>
            ))}
          </div>
        )}

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
