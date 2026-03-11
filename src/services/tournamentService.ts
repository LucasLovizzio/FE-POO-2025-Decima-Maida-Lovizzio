import api from "./api"
import type { TournamentResponse } from '../types'

export const tournamentService = {
  getById: (id: number) =>
    api.get<TournamentResponse>(`/tournaments/${id}`),

  getTournaments: () =>
    api.get<TournamentResponse[]>(`/tournaments`),
}