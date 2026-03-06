import api from "./api"
import type { CompetitionResponse,CompetitionRequest } from "../types"

export const competitionService = {
  //trae competencias de torneo
  getByTournament: (tournamentId: number) =>
    api.get<CompetitionResponse[]>(`/tournaments/${tournamentId}/competitions`),

  getById: (id: number) =>
    api.get<CompetitionResponse>(`/competitions/${id}`),

  //crea competencia
  create: (tournamentId: number, data: CompetitionRequest) =>
    api.post(`/tournaments/${tournamentId}/competitions`, data),

  // elimina competencia
  delete: (id: number) =>
    api.delete(`/competitions/${id}`),

  update: (id: number, data: CompetitionRequest) =>
    api.put(`/competitions/${id}`, data),
}
