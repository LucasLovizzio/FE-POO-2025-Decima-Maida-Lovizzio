function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">¡Bienvenido al Proyecto!</h1>
        <p className="text-lg text-gray-600">React + TypeScript + Vite + Tailwind CSS</p>
        <p className="mt-4 text-sm text-gray-500">
          React Router está configurado y funcionando correctamente ✓
        </p>
      </div>
    </div>
  )
}

export default Home
