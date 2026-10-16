import { useSyncExternalStore } from 'react'
import { clearSession, getToken, getUser, subscribeToSession } from '../services/sessionStore'
import { signOut } from '../services/authService'

export default function useAuth() {
  const token = useSyncExternalStore(subscribeToSession, getToken, () => null)
  return {
    isAuthenticated: Boolean(token),
    user: token ? getUser() : null,
    logout: signOut,
    clearSession,
  }
}
