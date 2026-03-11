import api from './api'
import type { CompetitionList, CompetitionResponse, CompetitionRequest } from '../types'

export const competitionService = {
  //crea competencia
  create: (tournamentId: number, data: CompetitionRequest) =>
    api.post(`/tournaments/${tournamentId}/competitions`, data),

  // elimina competencia
  delete: (id: number) => api.delete(`/competitions/${id}`),

  update: (id: number, data: CompetitionRequest) => api.put(`/competitions/${id}`, data),

  getAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/tournaments/${tournamentId}/competitions`),

  getById: (tournamentId: number, competitionId: number) =>
    api.get<CompetitionResponse>(`/tournaments/${tournamentId}/competitions/${competitionId}`),
}
