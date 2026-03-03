import api from "./api"
import type { CompetitionList, CompetitionResponse, CreateInscriptionRequest, TournamentResponse } from '../types'

export const tournamentService = {
  getAll: () =>
    api.get<CompetitionList>("/tournaments/${tournamentId}/competitions"),

  getById: (id: number) =>
    api.get<TournamentResponse>(`/tournaments/${id}`),

  create: (data: CreateInscriptionRequest) =>
    api.post("/tournaments/${tournamentId}/competitions/${competitionId}/inscription", data),

  getByTournament: (id: string) =>
    api.get<CompetitionResponse>(`tournaments/${id}/competitions/${id}`),
}