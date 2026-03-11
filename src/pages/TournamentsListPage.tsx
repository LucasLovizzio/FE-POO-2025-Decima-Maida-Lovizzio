import { useEffect, useEstate } from 'react';
import { tournamentService } from '../services/tournamentService.ts'
import type { TournamentResponse } from '../types'
import TournamentCard from '../components/TournamentCard.tsx'

function TournamentsListPage() {
  const [tournaments, setTournaments] = useEstate<TournamentResponse[]>([]);
  const [isLoading, setIsLoading] = useEstate(true);
  const [error, setError] = useEstate<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const data = await tournamentService.getTournaments();
        const publishedTournaments = data.filter(t => t.published);
        setTournaments(publishedTournaments);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Hubo un error al cargar los torneos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="mx-auto max-w-6xl py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Torneos Disponibles</h1>
        <p className="mt-2 text-gray-600">Explorá y anotate en las próximas competencias.</p>
      </div>

      {/* ESTADO: ERROR */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* ESTADO: CARGANDO (SKELETON) -> CUMPLE EL CRITERIO */}
      {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div key={skeleton} className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </div>
        ) :

        /* ESTADO: VACÍO -> CUMPLE EL CRITERIO */
        tournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
              <p className="text-xl font-semibold text-gray-700">No hay torneos disponibles</p>
              <p className="mt-2 text-gray-500">Actualmente no hay torneos vigentes publicados. ¡Volvé a revisar pronto!</p>
            </div>
          ) :

          /* ESTADO: CON DATOS */
          (
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
  );
}

export default TournamentsListPage;