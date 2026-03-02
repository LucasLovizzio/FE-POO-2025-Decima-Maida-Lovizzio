import api from "./api"
import type {
  TournamentResponse,
  CompetitionResponse,
  AdminResponse,
} from "../types"

export const adminService = {
  getTournaments: () =>
    api.get<TournamentResponse[]>("/admin/tournaments"),

  getCompetitions: () =>
    api.get<CompetitionResponse[]>("/admin/competitions"),

  getAdmins: () =>
    api.get<AdminResponse[]>("/admin"),
}