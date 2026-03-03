/**
 * Enums utilizados en la aplicación
 */

/**
 * Roles de usuario en el sistema
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  PARTICIPANT: 'PARTICIPANT',
} as const

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]

/**
 * Tipos de documento válidos
 */
export const DocType = {
  DNI: 'DNI',
  PASSPORT: 'PASSPORT',
  OTHER: 'OTHER',
} as const

export type DocTypeType = (typeof DocType)[keyof typeof DocType]

/**
 * Estado de publicación de un torneo (utilizado en listados de admin)
 */
export type TournamentPublishStatus = 'Publicado' | 'Despublicado'
