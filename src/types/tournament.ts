/**
 * Tipos relacionados con torneos
 */

import type { TournamentPublishStatus } from './enums'

/**
 * Entidad Torneo
 */
export interface Tournament {
  id: number
  name: string
  description: string
  startDate: string // ISO LocalDateTime
  endDate: string // ISO LocalDateTime
  published: boolean
  adminId: number
  competitionsIds: number[]
}

/**
 * Request para crear un torneo
 */
export type CreateTournamentRequest = {
  name: string
  description: string
  startDate: string // formato ISO LocalDateTime
  endDate: string // formato ISO LocalDateTime
}


/**
 * Response de un torneo (respuesta del backend)
 */
export interface TournamentResponse {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  published: boolean
  adminId: number
  competitionsIds: number[]
}

/**
 * Item de lista de torneos (usado en admin tournaments list)
 */
export interface TournamentListItem {
  name: string
  startDate: string
  endDate: string
  published: TournamentPublishStatus
}

/**
 * Lista de torneos
 */
export type TournamentList = TournamentResponse[]
