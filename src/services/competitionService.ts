import api from './api'
import type { CompetitionList, CompetitionResponse, CompetitionRequest } from '../types'

export const competitionService = {
  // Obtiene todas las competencias de un torneo (contexto participante)
  getAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/tournaments/${tournamentId}/competitions`),

  // Obtiene todas las competencias de un torneo (contexto admin)
  getAdminAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/admin/tournaments/${tournamentId}/competitions`),

  //crea competencia
  create: (tournamentId: number, data: CompetitionRequest) =>
    api.post<CompetitionResponse>(`/admin/tournaments/${tournamentId}`, data),

  // elimina competencia
  delete: (tournamentId: number, competitionId: number) =>
    api.delete(`/admin/tournaments/${tournamentId}/competitions/${competitionId}`),

  update: (tournamentId: number, data: CompetitionRequest) =>
    api.put<CompetitionResponse>(`/admin/tournaments/${tournamentId}`, data),

  getById: (tournamentId: number, competitionId: number) =>
    api.get<CompetitionResponse>(`/tournaments/${tournamentId}/competitions/${competitionId}`),
}
