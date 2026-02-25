/**
 * Tipos relacionados con administradores
 */

/**
 * Response de administrador (para listados)
 */
export interface AdminResponse {
  id: number
  email: string
}

/**
 * Response al eliminar un administrador
 */
export interface DeleteAdminResponse {
  message: string
}
