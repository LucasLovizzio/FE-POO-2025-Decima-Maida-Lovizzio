import api from "./api"
import type { CompetitionList, CompetitionResponse } from "../types"

export const competitionService = {
  getAll: () =>
    api.get<CompetitionList>("/competitions"),

  getById: (id: number) =>
    api.get<CompetitionResponse>(`/competitions/${id}`),
}
/*la inscripcion no va aca, va en inscripcionService */