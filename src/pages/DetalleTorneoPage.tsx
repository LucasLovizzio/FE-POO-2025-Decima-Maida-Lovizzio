import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTournamentById, getCompetitionsByTournament } from "../services/tournamentService";

import type { tournament } from '../types/tournament'
import type { competition } from "../types/competition";

export default function DetalleTorneoPage() {
  //id desde la url useParams
  const { id } = useParams();

  const [tournament, setTournament] = useState<tournament | null>(null);
  const [competitions, setCompetitions] = useState<competition[]>([]);
  const [loading, setLoading] = useState(true);
  const handleRegister = (competitionId: number) => {
    console.log("Inscribirse en competencia", competitionId);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {

        if (!id) return;

        const tournamentData = await getTournamentById(id);
        const competitionsData = await getCompetitionsByTournament(id);

        setTournament(tournamentData);
        setCompetitions(competitionsData);

      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  if (loading) {
    return <p>Cargando torneo...</p>;
  }

  if (!tournament) {
    return <p>No se encontró el torneo</p>;
  }

  return (
    <div>

      <h1>{tournament.name}</h1>
      <p>{tournament.description}</p>

      <p>
        <strong>Fecha inicio:</strong> {tournament.startDate}
      </p>

      <p>
        <strong>Fecha fin:</strong> {tournament.endDate}
      </p>

      <h2>Competencias</h2>

      {competitions.length === 0 ? (
        <p>No hay competencias disponibles</p>
      ) : (
        <ul>

          {competitions.map((competition) => {

            const isFull = competition.availableSlots === 0;

            return (
              <li key={competition.id}>

                <h3>{competition.name}</h3>

                <p>Precio base: ${competition.basePrice}</p>

                <p>Capacidad total: {competition.capacity}</p>

                <p>Cupos disponibles: {competition.availableSlots}</p>

                <button
                  disabled={isFull}
                  onClick={() => handleRegister(competition.id)}
                  style={{
                    backgroundColor: isFull ? "gray" : "blue",
                    color: "white",
                    cursor: isFull ? "not-allowed" : "pointer"
                  }}
                >
                  {isFull ? "Competencia llena" : "Inscribirse"}
                </button>
              </li>
            );
          })}

        </ul>
      )}
    </div>
  );
}