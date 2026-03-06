import api from "./api"
import type { CompetitionList, CompetitionResponse } from "../types"

export const competitionService = {
  getAll: (tournamentId: number) =>
    api.get<CompetitionList>(`/tournaments/${tournamentId}/competitions`),

  getById: (tournamentId: number, competitionId: number) =>
    api.get<CompetitionResponse>(`/tournaments/${tournamentId}/competitions/${competitionId}`),
}
