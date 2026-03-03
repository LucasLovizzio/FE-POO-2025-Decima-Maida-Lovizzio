import api from "./api"
import type { CompetitionResponse } from "../types"

export const competitionService = {

  getById: (id: number) =>
    api.get<CompetitionResponse>(`/competitions/${id}`),

}
