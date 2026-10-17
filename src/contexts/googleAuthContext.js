import { createContext } from 'react'

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || ''
export const GoogleAuthContext = createContext('unconfigured')
