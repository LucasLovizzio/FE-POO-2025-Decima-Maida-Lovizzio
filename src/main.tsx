import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AdminRoute } from "./context/AdminRoute";
import { ParticipantRoute } from "./context/ParticipantRoute";

import App from "./App";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import ParticipantPage from "./pages/ParticipantPage";
import LoginPage from "./pages/LoginPage";

import RegisterPage from './pages/RegisterPage.tsx'
import DetalleTorneoAdmin from "./pages/DetalleTorneoAdmin"


import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Layout principal */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>

          {/* Login público */}
          <Route path="login" element={<LoginPage />} />
          <Routes path="register" element={<RegisterPage />} />

          {/* Ruta solo ADMIN */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Ruta solo PARTICIPANT */}
          <Route
            path="participant"
            element={
              <ParticipantRoute>
                <ParticipantPage />
              </ParticipantRoute>
            }
          />

          <Route
            path="/admin/tournaments/:id"
            element={
              <AdminRoute>
                <DetalleTorneoAdmin />
              </AdminRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);