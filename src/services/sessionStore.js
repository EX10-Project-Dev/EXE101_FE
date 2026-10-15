// Uses the same token keys as the existing Axios client.
const SESSION_EVENT = 'findgo:session-change'
export const DEMO_TOKEN = 'findgo:local-demo-session'

export function getToken() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || null
  // A demo session saved during development must not unlock a production build.
  return token === DEMO_TOKEN && !import.meta.env?.DEV ? null : token
}

export function getUser() {
  const storage = localStorage.getItem('token') ? localStorage : sessionStorage
  try {
    return JSON.parse(storage.getItem('findgo:user') || 'null')
  } catch {
    return null
  }
}

export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem('token')
    storage.removeItem('findgo:user')
  }
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function saveSession({ token, user }, rememberMe) {
  clearSession()
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem('findgo:user', JSON.stringify(user))
  storage.setItem('token', token)
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function subscribeToSession(callback) {
  window.addEventListener('storage', callback)
  window.addEventListener(SESSION_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(SESSION_EVENT, callback)
  }
}
