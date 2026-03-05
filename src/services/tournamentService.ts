import api from "./api"
import type { CompetitionList, CompetitionResponse, CreateInscriptionRequest, TournamentResponse } from '../types'

export const tournamentService = {
  getAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/tournaments/${tournamentId}/competitions`),

  getById: (id: number) =>
    api.get<TournamentResponse>(`/tournaments/${id}`),

  create: (tournamentId: number, competitionId: number, data: CreateInscriptionRequest) =>
    api.post(`/tournaments/${tournamentId}/competitions/${competitionId}/inscription`, data),

  getByTournament: (tournamentId: string, competitionId: number) =>
    api.get<CompetitionResponse>(`tournaments/${tournamentId}/competitions/${competitionId}`),
}