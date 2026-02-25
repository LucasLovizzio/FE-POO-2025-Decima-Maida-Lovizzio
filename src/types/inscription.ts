/**
 * Tipos relacionados con inscripciones
 */

/**
 * Entidad Inscripción
 */
export interface Inscription {
  id: number
  finalPrice: number
  inscriptionDate: string
  participantId: number
  competitionId: number
}

/**
 * Response de inscripción (para listados)
 */
export interface InscriptionResponse {
  id: number
  inscriptionDate: string
  finalPrice: number
  tournamentId: number
  tournamentName: string
  competitionId: number
  competitionName: string
}

/**
 * Response detallado de una inscripción
 */
export interface InscriptionDetailResponse {
  inscriptionId: number
  finalPrice: number
  inscriptionDate: string
  competitionId: number
  competitionName: string
  tournamentId: number
  tournamentName: string
  tournamentDescription: string
  tournamentStartDate: string
  tournamentFinishDate: string
}

/**
 * Lista de inscripciones
 */
export type InscriptionList = InscriptionResponse[]
