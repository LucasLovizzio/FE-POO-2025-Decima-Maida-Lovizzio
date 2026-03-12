import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <section
        className="flex flex-col items-center justify-center text-center h-[90vh] bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6">
            Gestiona torneos fácilmente
          </h2>

          <p className="text-xl mb-8 max-w-xl">
            ¡Todo listo para organizar tu torneo! Nuestro objetivo principal es ayudar a los organizadores a gestionar sus torneos
          </p>

          <Link
            to="/login"
            className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
          >
            Empezar ahora
          </Link>
        </div>

      </section>

    </div>
);
}

export default Home;