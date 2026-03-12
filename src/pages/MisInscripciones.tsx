import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { inscriptionService } from '../services/inscriptionService'
import type { InscriptionResponse } from '../types'
import InscriptionDetailModal from '../components/InscriptionDetailModal'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'
import AppHeader from '../components/AppHeader'

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
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">Cargando inscripciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Inscripciones</h1>
            <p className="mt-1 text-sm text-gray-500">
              Historial completo de tus inscripciones a competencias
            </p>
          </div>

          <button
            onClick={() => navigate('/participant')}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            ← Volver a Torneos
          </button>
        </div>

        {/* Estado vacío */}
        {inscriptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
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
              className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Ver Torneos Disponibles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {inscriptions.map((inscription) => (
              <div
                key={inscription.id}
                onClick={() => handleViewDetail(inscription.id)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {inscription.tournamentName}
                      </h3>
                      <p className="text-lg text-indigo-600">{inscription.competitionName}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>
                        {new Date(inscription.inscriptionDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>

                      <span>ID: #{inscription.id}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end justify-between">
                    <div className="mb-2 text-right">
                      <p className="text-sm text-gray-600">Precio pagado</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${inscription.finalPrice.toFixed(2)}
                      </p>
                    </div>

                    <button className="flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedInscriptionId && (
          <InscriptionDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            inscriptionId={selectedInscriptionId}
          />
        )}
      </main>
    </div>
  )
}

export default MisInscripciones
