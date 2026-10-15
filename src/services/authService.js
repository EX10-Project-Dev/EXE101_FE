import api from './api'
import { DEMO_TOKEN, saveSession } from './sessionStore'

export async function signIn({ email, password, rememberMe }) {
  // Explicit local demo account. Vite removes this branch from production builds.
  if (import.meta.env.DEV && email.trim().toLowerCase() === 'demo@findgo.local') {
    if (password !== 'FindGo123!') {
      throw Object.assign(new Error('Incorrect email or password. Please try again.'), { code: 'INVALID_CREDENTIALS' })
    }
    saveSession({ token: DEMO_TOKEN, user: { id: 'local-demo', name: 'FIND&GO Demo', email: 'demo@findgo.local', isDemo: true } }, rememberMe)
    return
  }

  const path = import.meta.env.VITE_AUTH_LOGIN_PATH?.trim()
  if (!path) throw new Error('Sign-in is not connected yet. Please try again once the service is available.')

  // All other accounts use the real backend endpoint.
  const response = await api.post(path, { email, password }, { skipAuth: true, timeout: 15000 })
  const data = response.data?.data || response.data
  const token = data?.accessToken || data?.token
  if (typeof token !== 'string' || !token.trim() || !data?.user || typeof data.user !== 'object') {
    throw new Error('The sign-in response is incomplete. Please contact support.')
  }
  saveSession({ token, user: data.user }, rememberMe)
}
