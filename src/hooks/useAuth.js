import { useSyncExternalStore } from 'react'
import { clearSession, getToken, getUser, subscribeToSession } from '../services/sessionStore'

export default function useAuth() {
  const token = useSyncExternalStore(subscribeToSession, getToken, () => null)
  return { isAuthenticated: Boolean(token), user: token ? getUser() : null, logout: clearSession }
}
