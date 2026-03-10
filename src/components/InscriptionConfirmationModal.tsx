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
        <p className="text-gray-700">
          ¿Estás seguro de que deseas inscribirte en la competencia{' '}
          <span className="font-semibold">{competitionName}</span>?
        </p>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Precio base:</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            {hasDiscount && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Descuento (50%):</span>
                  <span>-${(basePrice * 0.5).toFixed(2)}</span>
                </div>
                <p className="text-sm text-green-600">✓ Ya tienes inscripciones en este torneo</p>
              </>
            )}

            <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-gray-800">
              <span>Precio final:</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default InscriptionConfirmationModal
