import api from './api'
import type { CompetitionList, CompetitionResponse, CompetitionRequest } from '../types'

export const competitionService = {
  //crea competencia
  create: (tournamentId: number, data: CompetitionRequest) =>
    api.post<CompetitionResponse>(`/admin/tournaments/${tournamentId}`, data),

  // elimina competencia
  delete: (tournamentId: number, competitionId: number) =>
    api.delete(`/admin/tournaments/${tournamentId}/competitions/${competitionId}`),

  update: (tournamentId: number, data: CompetitionRequest) =>
    api.put<CompetitionResponse>(`/admin/tournaments/${tournamentId}`, data),

  getAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/tournaments/${tournamentId}/competitions`),

  getById: (tournamentId: number, competitionId: number) =>
    api.get<CompetitionResponse>(`/tournaments/${tournamentId}/competitions/${competitionId}`),
}
