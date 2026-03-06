import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { competitionService } from "../services/competitionService"
import type { CompetitionResponse } from "../types"

function DetalleTorneoAdmin() {

  const { id } = useParams()

  const [competitions, setCompetitions] = useState<CompetitionResponse[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [capacity, setCapacity] = useState(0)

  const [editingCompetition, setEditingCompetition] = useState<CompetitionResponse | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState(0)
  const [editCapacity, setEditCapacity] = useState(0)

  // traer competencias del torneo
  useEffect(() => {
    if (id) {
      competitionService.getByTournament(Number(id))
        .then((res) => setCompetitions(res.data))
        .catch((err) => console.error(err))
    }
  }, [id])

  // crear competencia
  const handleCreateCompetition = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (price <= 0 || capacity <= 0) {
      alert("Precio y capacidad deben ser mayores a 0")
      return
    }

    try {
      const res = await competitionService.create(Number(id), {
        name,
        basePrice: price,
        capacity
      })

      // actualizar lista sin recargar
      setCompetitions([...competitions, res.data])

      // limpiar formulario
      setName("")
      setPrice(0)
      setCapacity(0)

    } catch (error) {
      console.error(error)
    }
  }
  // ABRIR EDITAR
  const handleEditClick = (comp: CompetitionResponse) => {
    setEditingCompetition(comp)
    setEditName(comp.name)
    setEditPrice(comp.basePrice)
    setEditCapacity(comp.capacity)
  }
  // GUARDAR EDICIÓN
  const handleUpdateCompetition = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!editingCompetition) return

    if (editPrice <= 0 || editCapacity <= 0) {
      alert("Precio y capacidad deben ser mayores a 0")
      return
    }

    try {

      const res = await competitionService.update(editingCompetition.id, {
        name: editName,
        basePrice: editPrice,
        capacity: editCapacity
      })

      setCompetitions(
        competitions.map((comp) =>
          comp.id === editingCompetition.id ? res.data : comp
        )
      )

      setEditingCompetition(null)

    } catch (error) {
      console.error(error)
    }
  }

  //eliminar competencia
  const handleDeleteCompetition = async (competitionId: number) => {

    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta competencia?"
    )

    if (!confirmDelete) return

    try {
      await competitionService.delete(competitionId)

      //actualiza lista
      setCompetitions(
        competitions.filter((comp) => comp.id !== competitionId)
      )

    } catch (error) {
      alert("No se puede eliminar porque tiene inscripciones")
      console.error(error)
    }
  }


  return (
    <div>

      <h1>Detalle del torneo</h1>

      {/* FORMULARIO CREAR COMPETENCIA */}

      <h2>Crear competencia</h2>

      <form onSubmit={handleCreateCompetition}>

        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Precio base</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Capacidad</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit">
          Crear competencia
        </button>

      </form>

      {/* EDITAR COMPETENCIA */}

      {editingCompetition && (

        <>

          <h2>Editar competencia</h2>

          <form onSubmit={handleUpdateCompetition}>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
            />

            <input
              type="number"
              value={editCapacity}
              onChange={(e) => setEditCapacity(Number(e.target.value))}
            />

            <button type="submit">
              Guardar cambios
            </button>

            <button type="button" onClick={() => setEditingCompetition(null)}>
              Cancelar
            </button>

          </form>

        </>

      )}

      {/* LISTA DE COMPETENCIAS */}

      <h2>Competencias</h2>

      {competitions.length === 0 && <p>No hay competencias</p>}

      <ul>
        {competitions.map((comp) => (
          <li key={comp.id}>
            {comp.name} - ${comp.basePrice} - capacidad: {comp.capacity}
            <button onClick={() => handleEditClick(comp)}>
              Editar
            </button>

            <button onClick={() => handleDeleteCompetition(comp.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default DetalleTorneoAdmin