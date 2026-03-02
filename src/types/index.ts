/**
 * Barrel file - Re-exporta todos los tipos del proyecto
 */

// Enums
export {
  UserRole,
  DocType,
  type UserRoleType,
  type DocTypeType,
  type TournamentPublishStatus,
} from './enums'

// Auth
export type {
  LoginRequest,
  AuthResponse,
  CreateParticipantRequest,
  CreateParticipantResponse,
  AdminLoginRequest,
  CreateAdminRequest,
  CreateAdminResponse,
} from './auth'

// Participant
export type { User, Admin as AdminEntity } from './participant'
export type { Participant } from './participant'

// Admin
export type { AdminResponse, DeleteAdminResponse } from './admin'

// Tournament
export type {
  Tournament,
  CreateTournamentRequest,
  TournamentResponse,
  TournamentListItem,
  TournamentList,
} from './tournament'

// Competition
export type {
  Competition,
  CompetitionRequest,
  CompetitionResponse,
  CompetitionList,
} from './competition'

// Inscription
export type {
  Inscription,
  InscriptionResponse,
  InscriptionDetailResponse,
  InscriptionList,
} from './inscription'

// Tipos auxiliares
/**
 * Response base de excepción del backend
 */
export interface ExceptionResponse {
  message: string
}

/**
 * Response de error del backend
 */
export type ErrorResponse = ExceptionResponse

/**
 * Respuesta vacía (para 204 No Content)
 */
export type EmptyResponse = void
