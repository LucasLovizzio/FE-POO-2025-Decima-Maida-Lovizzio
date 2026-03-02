import api from "./api"
import type {
  InscriptionList,
  InscriptionDetailResponse,
  CreateInscriptionRequest,
} from "../types"

export const inscriptionService = {
  create: (data: CreateInscriptionRequest) =>
    api.post("/inscriptions", data),

  getMine: () =>
    api.get<InscriptionList>("/inscriptions/my"),

  getById: (id: number) =>
    api.get<InscriptionDetailResponse>(`/inscriptions/${id}`),
}