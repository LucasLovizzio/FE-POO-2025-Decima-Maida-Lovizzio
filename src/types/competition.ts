/**
 * Tipos relacionados con competencias
 */

/**
 * Entidad Competencia
 */
export interface Competition {
  id: number
  name: string
  basePrice: number // BigDecimal convertido a number
  capacity: number
}

/**
 * Request para crear/actualizar una competencia
 */
export type CompetitionRequest = {
  name: string
  basePrice: number
  capacity: number
}

/**
 * Response de una competencia
 */
export interface CompetitionResponse {
  id: number
  name: string
  basePrice: number
  capacity: number
}

/**
 * Lista de competencias
 */
export type CompetitionList = CompetitionResponse[]
