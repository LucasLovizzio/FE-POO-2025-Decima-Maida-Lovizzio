import api from "./api"
import type { TournamentResponse } from '../types'
import type { tournament } from "../types/tournament";
import type { competition } from "../types/competition";

const API_URL = "http://localhost:8080";

export const tournamentService = {
  getById: (id: number) =>
    api.get<TournamentResponse>(`/tournaments/${id}`),
}
 // los uso para detalleTorneoPage
export const getTournamentById = async (id: string): Promise<tournament> => {
  const response = await fetch(`${API_URL}/tournaments/${id}`);
  return response.json();
};

export const getCompetitionsByTournament = async (id: string): Promise<competition[]> => {
  const response = await fetch(`${API_URL}/tournaments/${id}/competitions`);
  return response.json();
};