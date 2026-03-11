import api from './api'
import type { TournamentResponse } from '../types'

export const tournamentService = {
  getAll: () => api.get<TournamentResponse[]>('/tournaments'),

  getById: (id: number) => api.get<TournamentResponse>(`/tournaments/${id}`),
}
