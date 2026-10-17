import axios from 'axios'
import { clearSession, DEMO_TOKEN, getToken } from './sessionStore.js'

const baseURL = import.meta.env?.VITE_API_BASE || 'https://exe101-be-wkc0.onrender.com/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && token !== DEMO_TOKEN && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuth) clearSession()
    return Promise.reject(error)
  }
)

export default api
