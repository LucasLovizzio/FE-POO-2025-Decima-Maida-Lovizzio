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
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-800">Competencia</h3>
          <p className="text-gray-700">{competitionName}</p>
        </div>

        <div className="space-y-2 rounded-lg bg-blue-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Precio base:</span>
            <span className="font-medium text-gray-900">${basePrice.toFixed(2)}</span>
          </div>

          {hasDiscount && (
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Descuento (50%):</span>
              <span className="font-medium text-green-700">-${(basePrice * 0.5).toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-blue-200 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total a pagar:</span>
              <span className="text-xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {hasDiscount && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            ✓ Descuento aplicado por tener otra inscripción en este torneo
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Inscribiendo...' : 'Confirmar Inscripción'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default InscriptionConfirmationModal
