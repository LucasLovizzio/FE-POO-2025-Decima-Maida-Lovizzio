Documentación de Tipos TypeScript para Frontend
Este documento proporciona la información necesaria para que un agente de frontend implemente correctamente los tipos e interfaces TypeScript para consumir la API REST del backend de Torneos.
---
1. ENTIDADES DEL DOMINIO
1.1 Usuario Base (User) - Entidad Abstracta
Tabla: users
Herencia: Tabla única con discriminador user_type (joined inheritance)
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long (number) | Sí | Identificador único del usuario |
| email | String | Sí | Correo electrónico único |
| password | String | Sí | Contraseña encriptada |
| user_type | String | Sí | Discriminador: "ADMIN" o "PARTICIPANT" |
Relaciones:
- Un usuario puede ser Admin o Participant (herencia)
---
1.2 Administrador (Admin)
Extiende de: User
Tabla: No tiene tabla propia (usa users con user_type = 'ADMIN')
Herencia JPA: @PrimaryKeyJoinColumn(name = "user_id")
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long (heredado) | Sí | Heredado de User |
| email | String (heredado) | Sí | Heredado de User |
| password | String (heredado) | Sí | Heredado de User |
Relaciones:
- tournaments: Set<Tournament> - Un admin puede crear muchos torneos (OneToMany)
---
1.3 Participante (Participant)
Extiende de: User
Tabla: participants
Herencia JPA: @PrimaryKeyJoinColumn(name = "user_id")
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long (heredado) | Sí | Heredado de User |
| email | String (heredado) | Sí | Heredado de User |
| password | String (heredado) | Sí | Heredado de User |
| name | String (max 100) | No | Nombre del participante |
| lastName | String (max 100) | No | Apellido del participante |
| docType | String (max 100) | No | Tipo de documento (ver DocType enum) |
| docNumber | String (max 100) | No | Número de documento (único por docType) |
Restricciones de BD:
- Unique constraint: (document_number, document_type) - No puede haber dos participantes con mismo tipo y número de documento
Relaciones:
- inscriptions: Set<Inscription> - Un participante puede tener muchas inscripciones (OneToMany)
---
1.4 Torneo (Tournament)
Tabla: tournaments
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long | Sí | Identificador único del torneo |
| name | String (max 255) | Sí | Nombre del torneo |
| description | TEXT | Sí | Descripción del torneo |
| startDate | LocalDateTime | Sí | Fecha de inicio del torneo |
| endDate | LocalDateTime | Sí | Fecha de fin del torneo |
| published | Boolean | Sí | Indica si el torneo está publicado |
| creator_id | Long (FK a users) | Sí | ID del admin que creó el torneo |
Relaciones:
- admin: Admin - El torneo fue creado por un admin (ManyToOne)
- competitions: Set<Competition> - Un torneo tiene muchas competencias (OneToMany)
---
1.5 Competencia (Competition)
Tabla: competitions
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long | Sí | Identificador único de la competencia |
| name | String (max 255) | Sí | Nombre de la competencia |
| basePrice | BigDecimal (10,2) | Sí | Precio base de inscripción |
| capacity | Integer | Sí | Capacidad máxima de participantes |
| tournament_id | Long (FK) | Sí | ID del tournament al que pertenece |
Relaciones:
- tournament: Tournament - La competencia pertenece a un torneo (ManyToOne)
- inscriptions: Set<Inscription> - Una competencia puede tener muchas inscripciones (OneToMany)
---
1.6 Inscripción (Inscription)
Tabla: inscriptions
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| id | Long | Sí | Identificador único de la inscripción |
| finalPrice | BigDecimal | Sí | Precio final de la inscripción |
| inscriptionDate | LocalDateTime | Sí | Fecha y hora de la inscripción |
| participant_id | Long (FK) | Sí | ID del participante |
| competition_id | Long (FK) | Sí | ID de la competencia |
Relaciones:
- participant: Participant - La inscripción pertenece a un participante (ManyToOne)
- competition: Competition - La inscripción es a una competencia específica (ManyToOne)
---
2. ENUMS
UserRole
Valores posibles:
- ADMIN → "ROLE_ADMIN"
- PARTICIPANT → "ROLE_PARTICIPANT"
DocType
Valores posibles (enviados como string, no como enum en JSON):
- "DNI"
- "PASSPORT"
- "OTHER"
---
3. ENDPOINTS Y SUS CONTRATOS
3.1 Autenticación de Participante
POST /auth
Descripción: Autentica a un participante y retorna un JWT token.
Request Body:
{
  email: string (requerido),
  password: string (requerido)
}
Response (200 OK):
{
  token: Bearer <jwt_token>
}
Errores:
- 401 Unauthorized: Credenciales inválidas
---
POST /account
Descripción: Crea una nueva cuenta de participante.
Headers:
- Content-Type: application/json
Request Body:
{
  email: string (requerido, formato email válido),
  password: string (requerido),
  name: string (opcional),
  lastName: string (opcional),
  docType: string (requerido: DNI|PASSPORT|OTHER),
  docNumber: string (requerido)
}
Response (201 Created):
{
  id: 1,
  email: participante@example.com
}
Validaciones:
- Email debe tener formato válido
- docType debe ser uno de: DNI, PASSPORT, OTHER (validado con @ValidDocType)
- La combinación (docType, docNumber) debe ser única
---
3.2 Autenticación de Administrador
POST /admin/auth
Descripción: Autentica a un admin y retorna un JWT token.
Request Body:
{
  email: string (requerido),
  password: string (requerido)
}
Response (200 OK):
{
  token: Bearer <jwt_token>
}
Errores:
- 401 Unauthorized: Credenciales inválidas
---
3.3 Gestión de Torneos (Admin)
GET /admin/tournaments
Descripción: Obtiene todos los torneos ordenados por fecha descendente.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
[
  {
    name: Torneo de Fútbol 2025,
    startDate: 2025-06-01T10:00:00,
    endDate: 2025-06-15T20:00:00,
    published: Publicado | Despublicado
  }
]
Nota: El campo published es un String, no Boolean, que contiene "Publicado" o "Despublicado".
---
POST /admin/tournaments
Descripción: Crea un nuevo torneo.
Headers requeridos:
Authorization: Bearer <jwt_token>
Content-Type: application/json
Request Body:
{
  name: string (requerido),
  description: string (requerido),
  startDate: 2025-06-01T10:00:00 (requerido, formato ISO LocalDateTime),
  endDate: 2025-06-15T20:00:00 (requerido, formato ISO LocalDateTime)
}
Response (201 Created):
{
  id: 1,
  name: Torneo de Fútbol 2025,
  description: Descripción del torneo,
  startDate: 2025-06-01T10:00:00,
  endDate: 2025-06-15T20:00:00,
  published: false,
  adminId: 1,
  competitionsIds: []
}
---
PATCH /admin/tournaments/{tournamentId}/published
Descripción: Publica un torneo (cambia published a true).
Headers requeridos:
Authorization: Bearer <jwt_token>
Path Parameters:
- tournamentId: Long - ID del torneo
Response (200 OK):
{
  id: 1,
  name: Torneo de Fútbol 2025,
  description: Descripción del torneo,
  startDate: 2025-06-01T10:00:00,
  endDate: 2025-06-15T20:00:00,
  published: true,
  adminId: 1,
  competitionsIds: []
}
---
3.4 Gestión de Competencias (Admin)
POST /admin/tournaments/{tournamentId}
Descripción: Crea una nueva competencia dentro de un torneo.
Headers requeridos:
Authorization: Bearer <jwt_token>
Content-Type: application/json
Path Parameters:
- tournamentId: Long - ID del torneo
Request Body:
{
  name: string (requerido),
  basePrice: 100.50 (requerido, BigDecimal),
  capacity: 50 (requerido, Integer)
}
Response (200 OK):
{
  id: 1,
  name: Categoría Amateur,
  basePrice: 100.50,
  capacity: 50
}
---
PUT /admin/tournaments/{tournamentId}
Descripción: Actualiza los detalles de una competencia.
Headers requeridos:
Authorization: Bearer <jwt_token>
Content-Type: application/json
Request Body:
{
  name: string (requerido),
  basePrice: 150.00 (requerido),
  capacity: 100 (requerido)
}
Response (200 OK):
{
  id: 1,
  name: Categoría Profesional,
  basePrice: 150.00,
  capacity: 100
}
Nota: Este endpoint parece actualizar la última competencia creada, no especificada por ID.
---
DELETE /admin/tournaments/{tournamentId}/competitions/{competitionId}
Descripción: Elimina una competencia de un torneo.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
(no body, solo código 200)
---
GET /admin/tournaments/{tournamentId}/competitions/{competitionId}
Descripción: Obtiene los detalles de una competencia.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
{
  id: 1,
  name: Categoría Amateur,
  basePrice: 100.50,
  capacity: 50
}
---
3.5 Gestión de Inscripciones (Admin)
GET /admin/tournaments/{tournamentId}/competitions/{competitionId}/inscripciones
Descripción: Obtiene todas las inscripciones de una competencia.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
[
  {
    id: 1,
    inscriptionDate: 2025-05-15T14:30:00,
    finalPrice: 100.50,
    tournamentId: 1,
    tournamentName: Torneo de Fútbol 2025,
    competitionId: 1,
    competitionName: Categoría Amateur
  }
]
---
3.6 Torneos y Competencias (Público/Autenticado)
GET /tournaments
Descripción: Obtiene torneos publicados y próximos o en desarrollo.
Headers requeridos:
Authorization: Bearer <jwt_token> (opcional)
Response (200 OK):
[
  {
    id: 1,
    name: Torneo de Fútbol 2025,
    description: Descripción del torneo,
    startDate: 2025-06-01T10:00:00,
    endDate: 2025-06-15T20:00:00,
    published: true,
    adminId: 1,
    competitionsIds: [1, 2, 3]
  }
]
---
GET /tournaments/{id}
Descripción: Obtiene un torneo específico por ID.
Headers requeridos:
Authorization: Bearer <jwt_token> (opcional)
Path Parameters:
- id: Long - ID del torneo
Response (200 OK):
{
  id: 1,
  name: Torneo de Fútbol 2025,
  description: Descripción del torneo,
  startDate: 2025-06-01T10:00:00,
  endDate: 2025-06-15T20:00:00,
  published: true,
  adminId: 1,
  competitionsIds: [1, 2, 3]
}
---
GET /tournaments/{tournamentId}/competitions
Descripción: Obtiene las competencias de un torneo.
Headers requeridos:
Authorization: Bearer <jwt_token> (opcional)
Response (200 OK):
[
  {
    id: 1,
    name: Categoría Amateur,
    basePrice: 100.50,
    capacity: 50
  },
  {
    id: 2,
    name: Categoría Profesional,
    basePrice: 200.00,
    capacity: 30
  }
]
---
GET /tournaments/{tournamentId}/competitions/{id}
Descripción: Obtiene una competencia específica dentro de un torneo.
Headers requeridos:
Authorization: Bearer <jwt_token> (opcional)
Response (200 OK):
{
  id: 1,
  name: Categoría Amateur,
  basePrice: 100.50,
  capacity: 50
}
---
3.7 Inscripción de Participantes
POST /tournaments/{tournamentId}/competitions/{competitionId}/inscription
Descripción: Inscribe al participante autenticado en una competencia.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (204 No Content):
(no body)
Errores posibles:
- 404: Competition no encontrada
- 400: Competition llena (CapacityFullException)
- 400: Ya inscrio en el mismo torneo (ParticipantAlreadyInscribedInTournamentException)
---
3.8 Gestión de Inscripciones (Participante)
GET /inscriptions
Descripción: Obtiene todas las inscripciones del participante autenticado.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
[
  {
    id: 1,
    inscriptionDate: 2025-05-15T14:30:00,
    finalPrice: 100.50,
    tournamentId: 1,
    tournamentName: Torneo de Fútbol 2025,
    competitionId: 1,
    competitionName: Categoría Amateur
  }
]
---
GET /inscriptions/{id}
Descripción: Obtiene el detalle de una inscripción específica.
Headers requeridos:
Authorization: Bearer <jwt_token>
Path Parameters:
- id: Long - ID de la inscripción
Response (200 OK):
{
  inscriptionId: 1,
  finalPrice: 100.50,
  inscriptionDate: 2025-05-15T14:30:00,
  competitionId: 1,
  competitionName: Categoría Amateur,
  tournamentId: 1,
  tournamentName: Torneo de Fútbol 2025,
  tournamentDescription: Descripción del torneo,
  tournamentStartDate: 2025-06-01T10:00:00,
  tournamentFinishDate: 2025-06-15T20:00:00
}
---
3.9 Gestión de Cuentas Admin
POST /admin/accounts
Descripción: Crea una nueva cuenta de administrador.
Headers:
Content-Type: application/json
Request Body:
{
  email: admin@example.com (requerido),
  password: password123 (requerido)
}
Response (201 Created):
{
  id: 1,
  email: admin@example.com
}
---
GET /admin/accounts
Descripción: Obtiene todos los administradores.
Headers requeridos:
Authorization: Bearer <jwt_token>
Response (200 OK):
[
  {
    id: 1,
    email: admin1@example.com
  },
  {
    id: 2,
    email: admin2@example.com
  }
]
---
DELETE /admin/accounts/{id}
Descripción: Elimina una cuenta de administrador.
Headers requeridos:
Authorization: Bearer <jwt_token>
Path Parameters:
- id: Long - ID del admin a eliminar
Response (200 OK):
{
  message: Admin with ID 2 has been deleted.
}
Errores:
- 400 Bad Request: Un admin no puede eliminarse a sí mismo
---
3.10 Manejo de Errores
Todos los endpoints pueden devolver errores. La estructura de respuesta de error es:
{
  message: Descripción del error
}
Códigos de error comunes:
- 400 Bad Request: Datos inválidos o mal formados
- 401 Unauthorized: No autenticado o token inválido
- 403 Forbidden: No autorizado para realizar la operación
- 404 Not Found: Recurso no encontrado
- 500 Internal Server Error: Error interno del servidor
---
4. AUTENTICACIÓN
Mecanismo
- JWT (JSON Web Token) usando la librería java-jwt
- Algoritmo: HMAC512
- Secret: "POO2025" (hardcoded)
Estructura del Token
Header: No requerido (el backend lo maneja internamente)
Payload:
{
  sub: email@ejemplo.com,        // Subject: email del usuario
  role: ADMIN | PARTICIPANT,    // Rol del usuario
  exp: 1234567890                 // Fecha de expiración (timestamp)
}
Token Generation:
- El token se genera con prefijo "Bearer "
- Expiración: 10 días (864,000,000 ms)
Cómo enviar el token
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Validaciones
El backend valida:
- Token presente y válido
- Token no expirado
- Usuario existente en base de datos
---
5. TIPOS DERIVADOS SUGERIDOS
5.1 Interfaces de Entidades (para caching o estado global)
// Entidades base
interface User {
  id: number;
  email: string;
}
interface Admin extends User {
  // No tiene campos adicionales más allá de los heredados
}
interface Participant extends User {
  name?: string;
  lastName?: string;
  docType?: string;
  docNumber?: string;
}
interface Tournament {
  id: number;
  name: string;
  description: string;
  startDate: string; // ISO LocalDateTime
  endDate: string;   // ISO LocalDateTime
  published: boolean;
  adminId: number;
  competitionsIds: number[];
}
interface Competition {
  id: number;
  name: string;
  basePrice: number; // decimal
  capacity: number;
}
interface Inscription {
  id: number;
  finalPrice: number;
  inscriptionDate: string;
  participantId: number;
  competitionId: number;
}
5.2 Enums
enum UserRole {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT'
}
enum DocType {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
  OTHER = 'OTHER'
}
5.3 Request DTOs
// Auth
interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string; // "Bearer <token>"
}
// Participant
interface CreateParticipantRequest {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
  docType: string;
  docNumber: string;
}
interface CreateParticipantResponse {
  id: number;
  email: string;
}
// Admin
interface CreateAdminRequest {
  email: string;
  password: string;
}
interface CreateAdminResponse {
  id: number;
  email: string;
}
// Tournament
interface CreateTournamentRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}
interface TournamentResponse {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  published: boolean;
  adminId: number;
  competitionsIds: number[];
}
interface TournamentListItem {
  name: string;
  startDate: string;
  endDate: string;
  published: string; // "Publicado" | "Despublicado"
}
// Competition
interface CompetitionRequest {
  name: string;
  basePrice: number;
  capacity: number;
}
interface CompetitionResponse {
  id: number;
  name: string;
  basePrice: number;
  capacity: number;
}
5.4 Response DTOs (Inscripciones)
interface InscriptionResponse {
  id: number;
  inscriptionDate: string;
  finalPrice: number;
  tournamentId: number;
  tournamentName: string;
  competitionId: number;
  competitionName: string;
}
interface InscriptionDetailResponse {
  inscriptionId: number;
  finalPrice: number;
  inscriptionDate: string;
  competitionId: number;
  competitionName: string;
  tournamentId: number;
  tournamentName: string;
  tournamentDescription: string;
  tournamentStartDate: string;
  tournamentFinishDate: string;
}
5.5 Admin Responses
interface AdminResponse {
  id: number;
  email: string;
}
interface DeleteAdminResponse {
  message: string;
}
interface ExceptionResponse {
  message: string;
}
5.6 Types Auxiliares
// Para manejar la respuesta de login
type AuthResponse = LoginResponse;
// Para listas
type TournamentList = TournamentResponse[];
type CompetitionList = CompetitionResponse[];
type InscriptionList = InscriptionResponse[];
type AdminList = AdminResponse[];
// Para respuestas vacías (204 No Content)
type EmptyResponse = void;
// Para errors
type ErrorResponse = ExceptionResponse;
---
6. CONSIDERACIONES ESPECIALES
6.1 Fechas
- Formato: LocalDateTime de Java se serializa como string ISO 8601
- Ejemplo: "2025-06-01T10:00:00"
- Zona horaria: No se incluye información de zona horaria (es local)
- Tipo en TypeScript: Usar string y parsear con Date o librerías como date-fns/dayjs si se necesita manipulación
6.2 Decimals
- Los campos BigDecimal de Java se convierten a number en JSON
- Precisión: pueden haber problemas de precisión con números muy grandes
- Recomendación: Usar libraries como decimal.js o big.js si se necesita precisión exacta para precios
6.3 Booleanos vs Strings
- El campo published en Tournament es un Boolean en la entidad, pero en TournamentResponseOrderDTO se convierte a String:
  - true → "Publicado"
  - false → "Despublicado"
- Precaución: No asumir siempre Boolean, verificar el endpoint
6.4 Null vs Undefined
- Todos los campos que no tienen nullable = false podrían ser null o undefined en la respuesta
- En el frontend, usar Optional Chaining (?.) y nullish coalescing (??) para manejar estos casos
- Los campos heredados de User (id, email) siempre tienen valor
6.5 Paginación
- No se encontró paginación en los endpoints actuales
- Todas las listas se retornan completas
- Nota: Esto puede ser un problema de rendimiento con grandes volúmenes de datos
6.6 Autenticación Opcional en Algunos Endpoints
Los siguientes endpoints aceptan autenticación pero no la requieren:
- GET /tournaments
- GET /tournaments/{id}
- GET /tournaments/{tournamentId}/competitions
- GET /tournaments/{tournamentId}/competitions/{id}
Recomendación: El frontend puede mostrar información adicional si el usuario está autenticado (ej: botón de inscribirse)
6.7 Inconsistencias Observadas
1. PUT /admin/tournaments/{tournamentId}: Este endpoint no recibe el ID de la competencia a actualizar. Parece actualizar la última competencia creada. Se requiere verificación con el backend.
2. DocType: Se envía como String en el request, pero existe un enum DocType con validación. Verificar si el backend acepta los valores del enum directamente o solo los strings.
3. InscriptionRequestDTO no existe: No hay un DTO específico para crear inscripciones. La inscripción se crea mediante el endpoint POST /tournaments/{tournamentId}/competitions/{competitionId}/inscription sin body.
4. Competitions en TournamentResponseDTO: Se retorna solo un Set<Long> con los IDs de competencias, no los objetos completos. Se requiere una llamada adicional para obtener los detalles de las competencias.
6.8 Headers Comunes
// Headers típicos
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
6.9 Códigos de Estado HTTP
| Código | Significado | Uso típico |
|--------|-------------|-------------|
| 200 | OK |GET, PUT, PATCH exitoso |
| 201 | Created | POST de creación exitoso |
| 204 | No Content | DELETE o POST sin respuesta |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o no proporcionado |
| 403 | Forbidden | No tiene permisos |
| 404 | Not Found | Recurso no existe |
| 500 | Internal Server Error | Error del servidor |
---
7. NOTAS PARA EL AGENTE FRONTEND
1. Swagger: La API tiene Swagger disponible en /swagger-ui.html para exploración interactiva. El endpoint OpenAPI JSON está en /v3/api-docs.
2. Base URL: Asumir http://localhost:8080 o configurar según variable de entorno.
3. Interceptors: Implementar un interceptor de Axios/Fetch para automáticamente agregar el token a las requests autenticadas.
4. Manejo de errores: Crear un handler centralizado que capture errores y los muestre al usuario de forma amigable.
5. Type Safety: Usar los tipos definidos arriba para garantizar type-safety en las llamadas a la API.
6. Tokens: Guardar el token de forma segura (localStorage o sessionStorage) y limpiar al cerrar sesión.
---
Documento generado automáticamente a partir del análisis del backend Spring Boot.