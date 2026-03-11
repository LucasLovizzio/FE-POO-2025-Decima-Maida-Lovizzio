import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AdminRoute } from './context/AdminRoute'
import { ParticipantRoute } from './context/ParticipantRoute'

import App from './App'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import ParticipantPage from './pages/ParticipantPage'
import MisInscripciones from './pages/MisInscripciones'
import LoginPage from './pages/LoginPage'

import RegisterPage from './pages/RegisterPage.tsx'
import DetalleTorneoAdmin from './pages/DetalleTorneoAdmin'

import './index.css'
import GestionAdmins from './pages/GestionAdmins.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Layout principal */}
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
            </Route>
            {/* Login público */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
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
              path="participant/inscripciones"
              element={
                <ParticipantRoute>
                  <MisInscripciones />
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
            //solo puede entrar un admin logueado
            <Route
              path="/admin/accounts"
              element={
                <AdminRoute>
                  <GestionAdmins />
                </AdminRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
