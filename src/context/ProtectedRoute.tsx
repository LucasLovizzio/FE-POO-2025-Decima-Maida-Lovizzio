import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { ReactNode } from "react";

// Componente que protege rutas que requieren estar autenticado
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // Obtenemos el token del contexto de autenticación
  const { token } = useAuth();

  // Si no hay token, el usuario no está autenticado → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza el contenido protegido
  return <>{children}</>;
};