import api from "./api"
import type {
  TournamentResponse,
  AdminResponse,
} from "../types"

export const adminService = {
  getTournaments: () =>
    api.get<TournamentResponse[]>("/admin/tournaments"),

  getAdmins: () =>
    api.get<AdminResponse[]>("/admin/accounts"),
}