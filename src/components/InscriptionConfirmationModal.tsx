import Modal from './Modal'

interface InscriptionConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  competitionName: string
  basePrice: number
  finalPrice: number
  hasDiscount: boolean
  isLoading: boolean
}

function InscriptionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  competitionName,
  basePrice,
  finalPrice,
  hasDiscount,
  isLoading,
}: InscriptionConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Inscripción">
      <div className="flex flex-col gap-4">

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 text-base font-semibold text-gray-900">Competencia</h3>
          <p className="text-sm text-gray-700">{competitionName}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-2 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Precio base</span>
              <span className="font-medium text-gray-900">
              ${basePrice.toFixed(2)}
            </span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between">
                <span className="text-gray-500">Descuento (50%)</span>
                <span className="font-medium text-gray-900">
                -${(basePrice * 0.5).toFixed(2)}
              </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
              <span className="font-semibold text-gray-900">
                Total a pagar
              </span>
                <span className="text-lg font-semibold text-gray-900">
                ${finalPrice.toFixed(2)}
              </span>
              </div>
            </div>

          </div>
        </div>

        {hasDiscount && (
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
            ✓ Descuento aplicado por tener otra inscripción en este torneo
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Inscribiendo...' : 'Confirmar Inscripción'}
          </button>
        </div>

      </div>
    </Modal>
  )
}

export default InscriptionConfirmationModal
