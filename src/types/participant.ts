/**
 * Tipos relacionados con participantes
 */

import type { DocTypeType } from './enums'

/**
 * Entidad Usuario base
 */
export interface User {
  id: number
  email: string
}

/**
 * Entidad Administrador - extiende de User
 */
export interface Admin extends User {
  // No tiene campos adicionales más allá de los heredados
}

/**
 * Entidad Participante - extiende de User
 */
export interface Participant extends User {
  name?: string
  lastName?: string
  docType?: DocTypeType
  docNumber?: string
}
