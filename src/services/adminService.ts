import api from "./api"
import type {
  TournamentResponse,
  AdminResponse,
  CreateTournamentRequest,
} from "../types"

export const adminService = {
  getTournaments: () =>
    api.get<TournamentResponse[]>("/admin/tournaments"),

  createTournament: (data: CreateTournamentRequest) =>
    api.post<TournamentResponse>("/admin/tournaments", data),

  publishTournament: (id: number) =>
    api.patch<TournamentResponse>(`/admin/tournaments/${id}/published`),

  getAdmins: () =>
    api.get<AdminResponse[]>("/admin/accounts"),
}