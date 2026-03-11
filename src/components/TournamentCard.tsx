import type { TournamentResponse } from '../types'
import { useNavigate } from 'react-router-dom';

interface TournamentCardProps {
  tournament: TournamentResponse
  onPublish?: (id: number) => void
  isPublishing?: boolean
}

function TournamentCard({ tournament, onPublish, isPublishing }: TournamentCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleCardClick = () => {
    navigate(`/tournaments/${tournament.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 transition-colors duration-200 hover:text-indigo-600">
            {tournament.name}
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {tournament.description}
          </p>
        </div>

        <span
          className={`ml-4 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
            tournament.published
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
        {tournament.published ? 'Publicado' : 'No publicado'}
      </span>
      </div>

      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
          <strong>Inicio:</strong> {formatDate(tournament.startDate)}
        </span>
        </div>

        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
          <strong>Fin:</strong> {formatDate(tournament.endDate)}
        </span>
        </div>
      </div>

      {!tournament.published && onPublish && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPublish(tournament.id)
          }}
          disabled={isPublishing}
          className={`mt-4 w-full rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 ${
            isPublishing
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isPublishing ? 'Publicando...' : 'Publicar Torneo'}
        </button>
      )}
    </div>
  )

}

export default TournamentCard
