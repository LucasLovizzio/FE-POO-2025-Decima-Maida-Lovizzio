import { useEffect, useState } from 'react'
import type { InscriptionResponse } from '../types'
import { adminService } from '../services/adminService.ts'
import Modal from './Modal.tsx'

interface InscriptionsModalProps {
  isOpen: boolean
  onClose: () => void
  tournamentId: number
  competitionId: number
  competitionName?: string
}

export const InscriptionModal = ({
  isOpen,
  onClose,
  tournamentId,
  competitionId,
  competitionName,
}: InscriptionsModalProps) => {
  const [inscriptions, setInscriptions] = useState<InscriptionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const fetchInscriptions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await adminService.getInscriptions(tournamentId, competitionId)
        setInscriptions(data)
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } }
        setError(error.response?.data?.message || 'Error al cargar las inscripciones.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInscriptions()
  }, [isOpen, tournamentId, competitionId])

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Inscripciones: ${competitionName || 'Competencia'}`}
    >
      <div className="flex min-h-[300px] min-w-[500px] flex-col space-y-4 p-4">
        {/* ESTADO: CARGANDO */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-gray-500">Cargando inscripciones...</span>
          </div>
        ) : /* ESTADO: ERROR */
        error ? (
          <div className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>
        ) : /* ESTADO: VACÍO (Criterio de Aceptación) */
        inscriptions.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-lg font-medium text-gray-900">Sin inscripciones</p>
            <p className="text-sm text-gray-500">
              Aún no hay participantes registrados en esta competencia.
            </p>
          </div>
        ) : (
          /* ESTADO: CON DATOS (Tabla) */
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">ID</th>
                  {/* Descomentar cuando el backend agregue estos datos: */}
                  {/* <th className="px-4 py-3 font-medium text-gray-700">Participante</th> */}
                  {/* <th className="px-4 py-3 font-medium text-gray-700">Documento</th> */}
                  <th className="px-4 py-3 font-medium text-gray-700">Fecha de Inscripción</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Precio Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inscriptions.map((ins) => (
                  <tr key={ins.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{ins.id}</td>

                    {/* Descomentar cuando el backend agregue estos datos: */}
                    {/* <td className="px-4 py-3 font-medium text-gray-900">{(ins as any).participantName || 'N/A'}</td> */}
                    {/* <td className="px-4 py-3 text-gray-600">{(ins as any).documentType ? `${(ins as any).documentType} ${(ins as any).documentNumber}` : 'N/A'}</td> */}

                    <td className="px-4 py-3 text-gray-600">
                      {new Date(ins.inscriptionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${ins.finalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  )
}
