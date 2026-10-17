import api from './api.js'
import { clearSession, DEMO_TOKEN, saveSession } from './sessionStore.js'

export const AUTH_ENDPOINTS = {
  login: import.meta.env?.VITE_AUTH_LOGIN_PATH?.trim() || '/v1/auth/login',
  register: import.meta.env?.VITE_AUTH_REGISTER_PATH?.trim() || '/v1/auth/register',
  forgotPassword: import.meta.env?.VITE_AUTH_FORGOT_PASSWORD_PATH?.trim() || '/v1/auth/forgot-password',
  resetPassword: import.meta.env?.VITE_AUTH_RESET_PASSWORD_PATH?.trim() || '/v1/auth/reset-password',
  // Relative to the shared API base ending in /api: POST /api/auth/google.
  google: '/auth/google',
  logout: import.meta.env?.VITE_AUTH_LOGOUT_PATH?.trim() || '/v1/auth/logout',
  confirmEmail: import.meta.env?.VITE_AUTH_CONFIRM_EMAIL_PATH?.trim() || '/v1/auth/confirm-email',
  resendConfirmation: import.meta.env?.VITE_AUTH_RESEND_CONFIRMATION_PATH?.trim() || '/v1/auth/resend-confirmation',
}

export function normalizeUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return null
  const id = rawUser.userId || rawUser.id || rawUser.sub || 'user'
  const fullName = rawUser.fullName || rawUser.name || rawUser.displayName || rawUser.email?.split('@')[0] || ''
  return {
    ...rawUser,
    id,
    userId: id,
    fullName,
    name: fullName,
    email: rawUser.email || '',
  }
}

export const AUTH_TIMEOUT_MS = Number(import.meta.env?.VITE_AUTH_TIMEOUT_MS) || 60000

export function extractErrorMessage(error, defaultMessage = 'An unexpected error occurred. Please try again.') {
  if (error?.code === 'ECONNABORTED' || (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'))) {
    return 'Quá thời gian kết nối đến máy chủ (máy chủ có thể đang gửi email hoặc đang khởi động lại). Vui lòng thử lại.'
  }
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message && typeof data.message === 'string') {
    if (Array.isArray(data.errors) && data.errors.length) {
      return `${data.message} ${data.errors.join(' ')}`
    }
    return data.message
  }
  if (data?.errors) {
    if (Array.isArray(data.errors) && data.errors.length) return data.errors.join(' ')
    if (typeof data.errors === 'object') {
      const list = Object.values(data.errors).flat().filter(Boolean)
      if (list.length) return list.join(' ')
    }
  }
  if (error?.response?.status === 401 || error?.code === 'INVALID_CREDENTIALS') {
    return 'Incorrect email or password. Please try again.'
  }
  if (error?.response?.status === 423) {
    return 'Account is temporarily locked due to multiple failed login attempts.'
  }
  if (error?.response?.status === 502) {
    return 'Cannot connect to server. Please ensure the backend is running.'
  }
  if (error?.response?.status === 503) {
    return 'Service temporarily unavailable. Please try again later.'
  }
  return error?.message || defaultMessage
}

export async function signIn({ email, password, rememberMe }) {
  // Explicit local demo account. Vite removes this branch from production builds.
  if (import.meta.env?.DEV && email.trim().toLowerCase() === 'demo@findgo.local') {
    if (password !== 'FindGo123!') {
      throw Object.assign(new Error('Incorrect email or password. Please try again.'), { code: 'INVALID_CREDENTIALS' })
    }
    const demoUser = { id: 'local-demo', userId: 'local-demo', name: 'FIND&GO Demo', fullName: 'FIND&GO Demo', email: 'demo@findgo.local', isDemo: true }
    saveSession({ token: DEMO_TOKEN, user: demoUser }, rememberMe)
    return { token: DEMO_TOKEN, user: demoUser }
  }

  const path = AUTH_ENDPOINTS.login

  const response = await api.post(path, { email: email.trim(), password }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return completeSignIn(response, rememberMe)
}

function completeSignIn(response, rememberMe) {
  const data = response.data?.data || response.data
  const token = data?.accessToken || data?.token
  const rawUser = data?.user
  if (typeof token !== 'string' || !token.trim() || !rawUser || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
    throw new Error('The sign-in response is incomplete. Please contact support.')
  }
  const user = normalizeUser(rawUser)
  saveSession({ token, user }, rememberMe)
  return { token, user }
}

export async function signUp({ fullName, email, password }) {
  const path = AUTH_ENDPOINTS.register
  const response = await api.post(path, {
    fullName: fullName.trim(),
    email: email.trim(),
    password,
  }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return response.data?.data || response.data
}

export async function forgotPassword({ email }) {
  const path = AUTH_ENDPOINTS.forgotPassword
  const response = await api.post(path, { email: email.trim() }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return response.data?.data || response.data
}

export async function resetPassword({ email, token, newPassword }) {
  const path = AUTH_ENDPOINTS.resetPassword
  const response = await api.post(path, {
    email: email.trim(),
    token: token.trim(),
    newPassword,
  }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return response.data?.data || response.data
}

export async function googleSignIn({ credential, rememberMe }) {
  if (typeof credential !== 'string' || !credential.trim()) {
    throw new Error('Google did not return an ID token. Please try again.')
  }
  let response
  try {
    // Backend must implement POST /api/auth/google and verify Google's ID token.
    // Never decode the credential or create a frontend-only Google session.
    response = await api.post(AUTH_ENDPOINTS.google, { credential }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Google sign-in was rejected. Please try again or use email and password.')
    }
    if ([404, 405, 501].includes(error.response?.status)) {
      throw new Error('Google sign-in is not available on the server yet. Please use email and password.')
    }
    if (!error.response || [502, 503, 504].includes(error.response.status)) {
      throw new Error('Unable to connect for Google sign-in. Check your connection and try again.')
    }
    throw new Error(extractErrorMessage(error, 'Google sign-in failed. Please try again.'))
  }
  return completeSignIn(response, rememberMe)
}

export async function signOut() {
  const path = AUTH_ENDPOINTS.logout
  try {
    await api.post(path, {}, { timeout: 5000 })
  } catch {
    // If backend is unreachable, still clear local session cleanly
  } finally {
    clearSession()
  }
}

export async function confirmEmail({ userId, token }) {
  const path = AUTH_ENDPOINTS.confirmEmail
  const response = await api.post(path, { userId, token }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return response.data?.data || response.data
}

export async function resendConfirmation({ email }) {
  const path = AUTH_ENDPOINTS.resendConfirmation
  const response = await api.post(path, { email: email.trim() }, { skipAuth: true, timeout: AUTH_TIMEOUT_MS })
  return response.data?.data || response.data
}
