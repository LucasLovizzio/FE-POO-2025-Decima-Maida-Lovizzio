import { useAuth } from "../context/useAuth";
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService.ts'

type Role = 'PARTICIPANT' | 'ADMIN';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<Role>('PARTICIPANT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Completar campos obligatorios.')
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Formato inválido.')
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const credentials = { email, password };
      const data = role === 'PARTICIPANT'
        ? await authService.loginParticipant(credentials)
        : await authService.loginAdmin(credentials);

      // Se guarda el token y el rol en el context
      login(data.token, role);

      // Redireccionamos segun el rol
      if (role === 'PARTICIPANT') {
        navigate('/participant');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verificar que los datos ingresados sean correctos.')
    } finally {
      setIsLoading(false);
    }
  }

  // const handleLoginAdmin = () => {
  //   const fakeAdminToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWxpbmEiLCJyb2xlIjoiQURNSU4iLCJleHAiOjE4OTM0NTYwMDB9.fake";
  //   login(fakeAdminToken);
  // };
  //
  // const handleLoginParticipant = () => {
  //   const fakeParticipantToken =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWxpbmEiLCJyb2xlIjoiUEFSVElDSVBBTlQiLCJleHAiOjE4OTM0NTYwMDB9.fake";
  //   login(fakeParticipantToken);
  // };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h2>

        {/* Toggle de Roles */}
        <div className="mb-6 flex rounded-md bg-gray-200 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'PARTICIPANT' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
            }`}
            onClick={() => setRole('PARTICIPANT')}
          >
            Participante
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'ADMIN' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
            }`}
            onClick={() => setRole('ADMIN')}
          >
            Administrador
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        {/* Link a Registro (solo visible si está en pestaña participante) */}
        {role === 'PARTICIPANT' && (
          <div className="mt-6 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
