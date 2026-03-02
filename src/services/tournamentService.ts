import api from "./api"
import type { TournamentList, TournamentResponse } from "../types"

export const tournamentService = {
  getAll: () =>
    api.get<TournamentList>("/tournaments"),

  getById: (id: number) =>
    api.get<TournamentResponse>(`/tournaments/${id}`),
}