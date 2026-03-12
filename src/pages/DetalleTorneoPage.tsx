import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { tournamentService } from '../services/tournamentService'
import { competitionService } from '../services/competitionService'
import { inscriptionService } from '../services/inscriptionService'
import type { TournamentResponse, CompetitionResponse, InscriptionResponse } from '../types'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'
import AppHeader from '../components/AppHeader'
import InscriptionConfirmationModal from '../components/InscriptionConfirmationModal'

export default function DetalleTorneoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [tournament, setTournament] = useState<TournamentResponse | null>(null)
  const [competitions, setCompetitions] = useState<CompetitionResponse[]>([])
  const [myInscriptions, setMyInscriptions] = useState<InscriptionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [inscribing, setInscribing] = useState<number | null>(null)

  // Modal de confirmación
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionResponse | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const [tournamentRes, competitionsRes, inscriptionsRes] = await Promise.all([
          tournamentService.getById(Number(id)),
          competitionService.getAll(Number(id)),
          inscriptionService.getMine(),
        ])
        setTournament(tournamentRes.data)
        setCompetitions(competitionsRes.data)
        setMyInscriptions(inscriptionsRes.data)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const isInscribed = (competitionId: number) =>
    myInscriptions.some((i) => i.competitionId === competitionId)

  const hasDiscountInTournament = () => myInscriptions.some((i) => i.tournamentId === Number(id))

  const calculateFinalPrice = (basePrice: number) => {
    return hasDiscountInTournament() ? basePrice * 0.5 : basePrice
  }

  const handleInscribirse = async (competitionId: number) => {
    try {
      setInscribing(competitionId)
      await inscriptionService.create(Number(id), competitionId)
      const inscriptionsRes = await inscriptionService.getMine()
      setMyInscriptions(inscriptionsRes.data)
      setModalOpen(false)
      setSelectedCompetition(null)
      toast.success('¡Inscripción exitosa!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setInscribing(null)
    }
  }

  const handleOpenModal = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">Cargando torneo...</p>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">No se encontró el torneo.</p>
        </div>
      </div>
    )
  }

  const hasDiscount = hasDiscountInTournament()

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header del torneo */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            onClick={() => navigate('/participant')}
            className="mb-4 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Volver a Torneos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
          <p className="mt-2 text-gray-600">{tournament.description}</p>
          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            <span>
              <strong>Inicio:</strong>{' '}
              {new Date(tournament.startDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>
              <strong>Fin:</strong>{' '}
              {new Date(tournament.endDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          {hasDiscount && (
            <div className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              🎉 ¡Tenés 50% de descuento por ya estar inscrito en este torneo!
            </div>
          )}
        </div>

        {/* Competencias */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Competencias</h2>

        {competitions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">No hay competencias disponibles para este torneo.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => {
              const alreadyInscribed = isInscribed(competition.id)
              const finalPrice = calculateFinalPrice(competition.basePrice)

              return (
                <div
                  key={competition.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">{competition.name}</h3>

                  <div className="mb-4 space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Precio base:</span>
                      <span>${competition.basePrice.toFixed(2)}</span>
                    </div>
                    {hasDiscount && !alreadyInscribed && (
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>Con descuento (50%):</span>
                        <span>${finalPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Capacidad:</span>
                      <span>{competition.capacity} participantes</span>
                    </div>
                  </div>

                  {alreadyInscribed ? (
                    <div className="rounded bg-green-100 px-3 py-2 text-center text-sm font-semibold text-green-800">
                      ✓ Ya inscrito
                    </div>
                  ) : (
                    <button
                      disabled={inscribing === competition.id}
                      onClick={() => handleOpenModal(competition)}
                      className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                      {inscribing === competition.id ? 'Inscribiendo...' : 'Inscribirse'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {selectedCompetition && (
          <InscriptionConfirmationModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false)
              setSelectedCompetition(null)
            }}
            onConfirm={() => handleInscribirse(selectedCompetition.id)}
            competitionName={selectedCompetition.name}
            basePrice={selectedCompetition.basePrice}
            finalPrice={calculateFinalPrice(selectedCompetition.basePrice)}
            hasDiscount={hasDiscount}
            isLoading={inscribing === selectedCompetition.id}
          />
        )}
      </main>
    </div>
  )
}
