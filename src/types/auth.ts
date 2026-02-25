/**
 * Tipos relacionados con autenticación
 */

import type { DocTypeType } from './enums'

// Request para login de participante
export type LoginRequest = {
  email: string
  password: string
}

// Response de autenticación (contiene el token JWT)
export type AuthResponse = {
  token: string // "Bearer <jwt_token>"
}

// Request para crear una cuenta de participante
export type RegisterParticipantRequest = {
  email: string
  password: string
  name?: string
  lastName?: string
  docType: DocTypeType
  docNumber: string
}

// Response al crear un participante
export type RegisterParticipantResponse = {
  id: number
  email: string
}

// Request para login de administrador
export type AdminLoginRequest = {
  email: string
  password: string
}

// Request para crear una cuenta de administrador
export type CreateAdminRequest = {
  email: string
  password: string
}

// Response al crear un administrador
export type CreateAdminResponse = {
  id: number
  email: string
}
