import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section className="flex h-[90vh] flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-6 text-center text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-6 text-6xl font-bold">Gestiona torneos fácilmente</h2>

          <p className="mx-auto mb-8 max-w-xl text-xl">
            ¡Todo listo para organizar tu torneo! Nuestro objetivo principal es ayudar a los
            organizadores a gestionar sus torneos
          </p>

          <Link
            to="/login"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-gray-200"
          >
            Empezar ahora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
