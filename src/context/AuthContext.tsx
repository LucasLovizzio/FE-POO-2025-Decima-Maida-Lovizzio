import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: string | null;
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const storedToken = localStorage.getItem("token");

  const [token, setToken] = useState<string | null>(storedToken);

  const decoded = token ? jwtDecode<JwtPayload>(token) : null;

  const user = decoded?.sub ?? null;
  const role = decoded?.role ?? null;

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };