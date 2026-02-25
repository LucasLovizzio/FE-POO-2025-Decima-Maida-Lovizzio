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
  RegisterParticipantRequest,
  RegisterParticipantResponse,
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
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
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
 * Response de error del backend
 */
export interface ErrorResponse {
  message: string
}

/**
 * Respuesta vacía (para 204 No Content)
 */
export type EmptyResponse = undefined
