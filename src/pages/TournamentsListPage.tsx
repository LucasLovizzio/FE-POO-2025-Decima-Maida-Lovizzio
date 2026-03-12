import { useEffect, useState } from 'react'
import { tournamentService } from '../services/tournamentService.ts'
import type { TournamentResponse } from '../types'
import TournamentCard from '../components/TournamentCard.tsx'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'

function TournamentsListPage() {
  const toast = useToast()
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true)
        const response = await tournamentService.getTournaments()
        const publishedTournaments = response.data.filter((t: TournamentResponse) => t.published)
        setTournaments(publishedTournaments)
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">
            Torneos Disponibles
          </h1>

          <p className="mt-2 text-gray-600">
            Explorá y anotate en las próximas competencias.
          </p>
        </div>

        {/* ESTADO: CARGANDO */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div
                key={skeleton}
                className="h-64 animate-pulse rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        ) : tournaments.length === 0 ? (

          /* ESTADO: VACÍO */
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">

            <p className="text-xl font-semibold text-gray-700">
              No hay torneos disponibles
            </p>

            <p className="mt-2 text-gray-500">
              Actualmente no hay torneos vigentes publicados. ¡Volvé a revisar pronto!
            </p>

          </div>

        ) : (

          /* ESTADO: CON DATOS */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
              />
            ))}

          </div>

        )}

      </div>
    </div>
  )
}

export default TournamentsListPage
