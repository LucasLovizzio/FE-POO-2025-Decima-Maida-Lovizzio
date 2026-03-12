import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token !== 'null' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de response para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token')
      // Solo redirige si YA había sesión activa (token expirado)
      if (token) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
