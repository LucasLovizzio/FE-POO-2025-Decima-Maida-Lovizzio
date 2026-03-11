import type { TournamentResponse } from '../types'

interface TournamentCardProps {
  tournament: TournamentResponse
  onPublish: (id: number) => void
  isPublishing: boolean
}

function TournamentCard({ tournament, onPublish, isPublishing }: TournamentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{tournament.name}</h3>
          <p className="mt-2 text-sm text-gray-600">{tournament.description}</p>
        </div>
        <span
          className={`ml-4 rounded-full px-3 py-1 text-xs font-semibold ${
            tournament.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {tournament.published ? 'Publicado' : 'No publicado'}
        </span>
      </div>

      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            <strong>Inicio:</strong> {formatDate(tournament.startDate)}
          </span>
        </div>
        <div className="flex items-center">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            <strong>Fin:</strong> {formatDate(tournament.endDate)}
          </span>
        </div>
      </div>

      {!tournament.published && (
        <button
          onClick={() => onPublish(tournament.id)}
          disabled={isPublishing}
          className={`w-full rounded-md px-4 py-2 font-medium text-white transition-colors ${
            isPublishing ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPublishing ? 'Publicando...' : 'Publicar Torneo'}
        </button>
      )}
    </div>
  )
}

export default TournamentCard
