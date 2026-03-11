import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tournamentService } from '../services/tournamentService'
import { competitionService } from '../services/competitionService'
import { inscriptionService } from '../services/inscriptionService'
import type { TournamentResponse, CompetitionResponse, InscriptionResponse } from '../types'
import InscriptionConfirmationModal from '../components/InscriptionConfirmationModal'

interface CompetitionWithTournament extends CompetitionResponse {
  tournamentId: number
  tournamentName: string
  availableSpots: number
}

function ParticipantPage() {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([])
  const [competitions, setCompetitions] = useState<Map<number, CompetitionResponse[]>>(new Map())
  const [myInscriptions, setMyInscriptions] = useState<InscriptionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionWithTournament | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar torneos
      const tournamentsResponse = await tournamentService.getAll()
      const tournamentsData = tournamentsResponse.data

      setTournaments(tournamentsData)

      // Cargar competencias para cada torneo
      const competitionsMap = new Map<number, CompetitionResponse[]>()
      for (const tournament of tournamentsData) {
        const competitionsResponse = await competitionService.getAll(tournament.id)
        competitionsMap.set(tournament.id, competitionsResponse.data)
      }
      setCompetitions(competitionsMap)

      // Cargar mis inscripciones
      const inscriptionsResponse = await inscriptionService.getMine()
      setMyInscriptions(inscriptionsResponse.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const hasInscriptionInTournament = (tournamentId: number): boolean => {
    return myInscriptions.some((inscription) => inscription.tournamentId === tournamentId)
  }

  const isAlreadyInscribedInCompetition = (competitionId: number): boolean => {
    return myInscriptions.some((inscription) => inscription.competitionId === competitionId)
  }

  const getInscriptionsCountInTournament = (tournamentId: number): number => {
    return myInscriptions.filter((inscription) => inscription.tournamentId === tournamentId).length
  }

  const calculateFinalPrice = (basePrice: number, tournamentId: number): number => {
    const hasDiscount = hasInscriptionInTournament(tournamentId)
    return hasDiscount ? basePrice * 0.5 : basePrice
  }

  const handleInscribeClick = (
    competition: CompetitionResponse,
    tournament: TournamentResponse
  ) => {
    const competitionWithTournament: CompetitionWithTournament = {
      ...competition,
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      availableSpots: 0, // No podemos saber los cupos reales sin un endpoint del backend
    }
    setSelectedCompetition(competitionWithTournament)
    setIsModalOpen(true)
  }

  const handleConfirmInscription = async () => {
    if (!selectedCompetition) return

    try {
      setIsSubmitting(true)
      setError(null)

      await inscriptionService.create(selectedCompetition.tournamentId, selectedCompetition.id)

      // Recargar datos para actualizar la vista
      await loadData()

      setSuccessMessage(`¡Te has inscrito exitosamente en ${selectedCompetition.name}!`)
      setIsModalOpen(false)
      setSelectedCompetition(null)

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { message?: string } }
        message?: string
      }
      setIsModalOpen(false)
      setSelectedCompetition(null)

      // Manejar errores específicos según documentación del backend
      if (error.response?.status === 404) {
        setError('Competencia no encontrada.')
      } else if (error.response?.status === 400) {
        // El backend devuelve el mensaje en la respuesta
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
        // Mostrar el mensaje del backend directamente
        setError(errorMessage)
      } else {
        const errorMessage =
          error.response?.data?.message || error.message || 'Error al inscribirse en la competencia'
        setError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-white">Cargando torneos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Torneos Disponibles</h1>
            <p className="mt-2 text-blue-100">Inscríbete en las competencias que te interesen</p>
          </div>
          <button
            onClick={() => navigate('/participant/inscripciones')}
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-blue-50"
          >
            Mis Inscripciones
          </button>
        </div>

        {/* Mensajes de feedback */}
        {error && <div className="mb-4 rounded-lg bg-red-600 p-4 text-white">{error}</div>}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-600 p-4 text-white">{successMessage}</div>
        )}

        {/* Lista de torneos */}
        {tournaments.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <p className="text-center text-gray-600">No hay torneos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tournaments.map((tournament) => {
              const tournamentCompetitions = competitions.get(tournament.id) || []
              const inscriptionsCount = getInscriptionsCountInTournament(tournament.id)

              return (
                <div key={tournament.id} className="rounded-lg bg-white p-6 shadow-lg">
                  {/* Header del torneo */}
                  <div className="mb-4 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{tournament.name}</h2>
                    <p className="mt-2 text-gray-600">{tournament.description}</p>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>Inicio: {new Date(tournament.startDate).toLocaleDateString()}</span>
                      <span>Fin: {new Date(tournament.endDate).toLocaleDateString()}</span>
                    </div>
                    {inscriptionsCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                          {inscriptionsCount} inscripción{inscriptionsCount > 1 ? 'es' : ''} en este
                          torneo
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Competencias */}
                  {tournamentCompetitions.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay competencias disponibles para este torneo.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {tournamentCompetitions.map((competition) => {
                        const isInscribed = isAlreadyInscribedInCompetition(competition.id)
                        const hasDiscount = hasInscriptionInTournament(tournament.id)
                        const finalPrice = calculateFinalPrice(competition.basePrice, tournament.id)

                        return (
                          <div
                            key={competition.id}
                            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                          >
                            <h3 className="mb-2 font-semibold text-gray-800">{competition.name}</h3>

                            <div className="mb-3 space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>Precio base:</span>
                                <span>${competition.basePrice.toFixed(2)}</span>
                              </div>
                              {hasDiscount && !isInscribed && (
                                <div className="flex justify-between text-green-600">
                                  <span>Con descuento:</span>
                                  <span className="font-semibold">${finalPrice.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Capacidad:</span>
                                <span>{competition.capacity} participantes</span>
                              </div>
                            </div>

                            {isInscribed ? (
                              <div className="rounded bg-green-100 px-3 py-2 text-center text-sm font-semibold text-green-800">
                                ✓ Ya inscrito
                              </div>
                            ) : (
                              <button
                                onClick={() => handleInscribeClick(competition, tournament)}
                                className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                              >
                                Inscribirse
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de confirmación */}
        {selectedCompetition && (
          <InscriptionConfirmationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedCompetition(null)
            }}
            onConfirm={handleConfirmInscription}
            competitionName={selectedCompetition.name}
            basePrice={selectedCompetition.basePrice}
            finalPrice={calculateFinalPrice(
              selectedCompetition.basePrice,
              selectedCompetition.tournamentId
            )}
            hasDiscount={hasInscriptionInTournament(selectedCompetition.tournamentId)}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}

export default ParticipantPage;