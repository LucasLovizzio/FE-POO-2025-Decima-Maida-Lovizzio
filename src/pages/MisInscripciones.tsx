import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { inscriptionService } from '../services/inscriptionService'
import type { InscriptionResponse } from '../types'
import InscriptionDetailModal from '../components/InscriptionDetailModal'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'

function MisInscripciones() {
  const navigate = useNavigate()
  const toast = useToast()
  const [inscriptions, setInscriptions] = useState<InscriptionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInscriptionId, setSelectedInscriptionId] = useState<number | null>(null)

  useEffect(() => {
    loadInscriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadInscriptions = async () => {
    try {
      setIsLoading(true)

      const response = await inscriptionService.getMine()
      // Ordenar por fecha descendente (más reciente primero)
      const sortedInscriptions = [...response.data].sort((a, b) => {
        return new Date(b.inscriptionDate).getTime() - new Date(a.inscriptionDate).getTime()
      })
      setInscriptions(sortedInscriptions)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetail = (inscriptionId: number) => {
    setSelectedInscriptionId(inscriptionId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInscriptionId(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-white">Cargando inscripciones...</p>
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
            <h1 className="text-4xl font-bold text-white">Mis Inscripciones</h1>
            <p className="mt-2 text-blue-100">
              Historial completo de tus inscripciones a competencias
            </p>
          </div>
          <button
            onClick={() => navigate('/participant')}
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-blue-50"
          >
            ← Volver a Torneos
          </button>
        </div>

        {/* Estado vacío */}
        {inscriptions.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-12 w-12 text-gray-400"
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
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">No tienes inscripciones aún</h2>
            <p className="mb-6 text-gray-600">
              Explora los torneos disponibles y comienza a inscribirte en competencias.
            </p>
            <button
              onClick={() => navigate('/participant')}
              className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Ver Torneos Disponibles
            </button>
          </div>
        ) : (
          /* Lista de inscripciones */
          <div className="space-y-4">
            {inscriptions.map((inscription) => (
              <div
                key={inscription.id}
                onClick={() => handleViewDetail(inscription.id)}
                className="cursor-pointer rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Información principal */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {inscription.tournamentName}
                      </h3>
                      <p className="text-lg text-blue-600">{inscription.competitionName}</p>
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(inscription.inscriptionDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>ID: #{inscription.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Precio y botón */}
                  <div className="ml-4 flex flex-col items-end justify-between">
                    <div className="mb-2 text-right">
                      <p className="text-sm text-gray-600">Precio pagado</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${inscription.finalPrice.toFixed(2)}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                      Ver detalle
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalle */}
        {selectedInscriptionId && (
          <InscriptionDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            inscriptionId={selectedInscriptionId}
          />
        )}
      </div>
    </div>
  )
}

export default MisInscripciones
