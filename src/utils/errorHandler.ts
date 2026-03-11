import axios from 'axios'

/**
 * Extrae un mensaje de error amigable de un error de axios
 */
export function getErrorMessage(error: unknown): string {
  // Error de axios con respuesta del servidor
  if (axios.isAxiosError(error)) {
    // Sin conexión / timeout
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      }
      return 'Error de conexión. Por favor, intenta nuevamente.'
    }

    // Errores del servidor con mensaje
    const status = error.response.status
    const data = error.response.data as { message?: string; error?: string }

    // Mensaje específico del servidor
    if (data?.message) {
      return data.message
    }

    if (data?.error) {
      return data.error
    }

    // Mensajes genéricos según código de estado
    switch (status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos ingresados.'
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.'
      case 403:
        return 'No tienes permisos para realizar esta acción.'
      case 404:
        return 'Recurso no encontrado.'
      case 409:
        return 'Conflicto. El recurso ya existe o no se puede modificar.'
      case 422:
        return 'Datos inválidos. Verifica la información ingresada.'
      case 500:
        return 'Error interno del servidor. Intenta nuevamente más tarde.'
      case 503:
        return 'Servicio no disponible. Intenta nuevamente más tarde.'
      default:
        return `Error del servidor (${status}). Por favor, intenta nuevamente.`
    }
  }

  // Error genérico de JavaScript
  if (error instanceof Error) {
    return error.message
  }

  // Error desconocido
  return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
}
