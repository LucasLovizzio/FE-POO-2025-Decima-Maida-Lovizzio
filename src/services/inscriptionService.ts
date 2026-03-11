import api from "./api"
import type {
  InscriptionList,
  InscriptionDetailResponse,
} from "../types"

export const inscriptionService = {
  getMine: () =>
    api.get<InscriptionList>("/inscriptions"),

  getById: (id: number) =>
    api.get<InscriptionDetailResponse>(`/inscriptions/${id}`),

  create: (tournamentId: number, competitionId: number) =>
    api.post(`/tournaments/${tournamentId}/competitions/${competitionId}/inscription`),
}