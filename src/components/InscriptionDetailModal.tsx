import { useEffect, useState } from 'react'
import Modal from './Modal'
import { inscriptionService } from '../services/inscriptionService'
import type { InscriptionDetailResponse } from '../types'
import { useToast } from '../hooks/useToast'
import { getErrorMessage } from '../utils/errorHandler'

interface InscriptionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  inscriptionId: number
}

function InscriptionDetailModal({ isOpen, onClose, inscriptionId }: InscriptionDetailModalProps) {
  const toast = useToast()
  const [detail, setDetail] = useState<InscriptionDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !inscriptionId) return

    const loadDetail = async () => {
      try {
        setIsLoading(true)
        const response = await inscriptionService.getById(inscriptionId)
        setDetail(response.data)
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, inscriptionId])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Inscripción">
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center text-gray-600">
            <p>Cargando detalle...</p>
          </div>
        )}

        {!isLoading && detail && (
          <div className="space-y-4">
            {/* Información de la Inscripción */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Información General</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Inscripción:</span>
                  <span className="font-medium text-gray-900">#{detail.inscriptionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Inscripción:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(detail.inscriptionDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio Final:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${detail.finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de la Competencia */}
            <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Competencia</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium text-gray-900">#{detail.competitionId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="mt-1 font-medium text-gray-900">{detail.competitionName}</p>
                </div>
              </div>
            </div>

            {/* Información del Torneo */}
            <div className="rounded-lg border border-gray-200 bg-purple-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Torneo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium text-gray-900">#{detail.tournamentId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="mt-1 font-medium text-gray-900">{detail.tournamentName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Descripción:</span>
                  <p className="mt-1 text-gray-700">{detail.tournamentDescription}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Inicio:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(detail.tournamentStartDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de Fin:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(detail.tournamentFinishDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default InscriptionDetailModal
