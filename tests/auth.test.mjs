import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeUser, extractErrorMessage, AUTH_ENDPOINTS, googleSignIn, signIn } from '../src/services/authService.js'
import api from '../src/services/api.js'
import { clearSession, getToken, getUser } from '../src/services/sessionStore.js'

test('normalizeUser properly maps backend AppUser DTO to FE user', () => {
  const beUser = { userId: '123-abc', email: 'user@findgo.vn', fullName: 'Nguyen Van A' }
  const normalized = normalizeUser(beUser)
  assert.equal(normalized.id, '123-abc')
  assert.equal(normalized.userId, '123-abc')
  assert.equal(normalized.name, 'Nguyen Van A')
  assert.equal(normalized.fullName, 'Nguyen Van A')
  assert.equal(normalized.email, 'user@findgo.vn')
})

test('normalizeUser handles null and fallback fields gracefully', () => {
  assert.equal(normalizeUser(null), null)
  assert.equal(normalizeUser(undefined), null)
  const minimal = normalizeUser({ id: 'xyz', email: 'hello@example.com' })
  assert.equal(minimal.id, 'xyz')
  assert.equal(minimal.name, 'hello')
})

test('extractErrorMessage extracts backend error messages and status codes', () => {
  // Direct message from BE
  const errorWithMessage = { response: { data: { message: 'Email này đã được sử dụng.' } } }
  assert.equal(extractErrorMessage(errorWithMessage), 'Email này đã được sử dụng.')

  // Message with errors list
  const errorWithList = { response: { data: { message: 'Không thể tạo tài khoản.', errors: ['Mật khẩu quá ngắn.', 'Email không hợp lệ.'] } } }
  assert.equal(extractErrorMessage(errorWithList), 'Không thể tạo tài khoản. Mật khẩu quá ngắn. Email không hợp lệ.')

  // HTTP 401
  const err401 = { response: { status: 401 } }
  assert.equal(extractErrorMessage(err401), 'Incorrect email or password. Please try again.')

  // HTTP 423 Locked
  const err423 = { response: { status: 423 } }
  assert.equal(extractErrorMessage(err423), 'Account is temporarily locked due to multiple failed login attempts.')

  // HTTP 502 Bad Gateway
  const err502 = { response: { status: 502 } }
  assert.equal(extractErrorMessage(err502), 'Cannot connect to server. Please ensure the backend is running.')

  // Plain string data
  const errString = { response: { data: 'Custom backend failure' } }
  assert.equal(extractErrorMessage(errString), 'Custom backend failure')
})

test('AUTH_ENDPOINTS retain email routes and use the required Google route', () => {
  assert.equal(AUTH_ENDPOINTS.login, '/v1/auth/login')
  assert.equal(AUTH_ENDPOINTS.register, '/v1/auth/register')
  assert.equal(AUTH_ENDPOINTS.forgotPassword, '/v1/auth/forgot-password')
  assert.equal(AUTH_ENDPOINTS.resetPassword, '/v1/auth/reset-password')
  assert.equal(AUTH_ENDPOINTS.confirmEmail, '/v1/auth/confirm-email')
  assert.equal(AUTH_ENDPOINTS.resendConfirmation, '/v1/auth/resend-confirmation')
  assert.equal(AUTH_ENDPOINTS.google, '/auth/google')
  assert.equal(AUTH_ENDPOINTS.logout, '/v1/auth/logout')
})

function memoryStorage() {
  const values = new Map()
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) }
}

globalThis.localStorage = memoryStorage()
globalThis.sessionStorage = memoryStorage()
globalThis.window = new EventTarget()

test('signUp, confirmEmail, resendConfirmation, and resetPassword call expected endpoints', async (t) => {
  const originalAdapter = api.defaults.adapter
  t.after(() => { api.defaults.adapter = originalAdapter })

  const { signUp, confirmEmail, resendConfirmation, resetPassword } = await import('../src/services/authService.js')

  // signUp
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/v1/auth/register')
    assert.deepEqual(JSON.parse(config.data), { fullName: 'Nguyen Van A', email: 'a@example.com', password: 'Password123!' })
    return { data: { message: 'Tạo tài khoản thành công.' }, status: 201, config }
  }
  const regResult = await signUp({ fullName: ' Nguyen Van A ', email: ' a@example.com ', password: 'Password123!' })
  assert.equal(regResult.message, 'Tạo tài khoản thành công.')

  // confirmEmail
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/v1/auth/confirm-email')
    assert.deepEqual(JSON.parse(config.data), { userId: 'u123', token: 'token-abc' })
    return { data: { message: 'Email đã được xác minh.' }, status: 200, config }
  }
  const confirmResult = await confirmEmail({ userId: 'u123', token: 'token-abc' })
  assert.equal(confirmResult.message, 'Email đã được xác minh.')

  // resendConfirmation
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/v1/auth/resend-confirmation')
    assert.deepEqual(JSON.parse(config.data), { email: 'a@example.com' })
    return { data: { message: 'Đã gửi lại email.' }, status: 200, config }
  }
  const resendResult = await resendConfirmation({ email: ' a@example.com ' })
  assert.equal(resendResult.message, 'Đã gửi lại email.')

  // resetPassword
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/v1/auth/reset-password')
    assert.deepEqual(JSON.parse(config.data), { email: 'a@example.com', token: 'token-xyz', newPassword: 'NewPassword123!' })
    return { data: { message: 'Mật khẩu đã được đặt lại.' }, status: 200, config }
  }
  const resetResult = await resetPassword({ email: ' a@example.com ', token: ' token-xyz ', newPassword: 'NewPassword123!' })
  assert.equal(resetResult.message, 'Mật khẩu đã được đặt lại.')
})

test('Google and password login share backend response normalization and session persistence', async (t) => {
  const originalAdapter = api.defaults.adapter
  t.after(() => { api.defaults.adapter = originalAdapter; clearSession() })

  for (const wrapped of [false, true]) {
    for (const rememberMe of [false, true]) {
      api.defaults.adapter = async (config) => {
        assert.equal(config.url, '/auth/google')
        assert.equal(config.baseURL.replace(/\/$/, '') + config.url, `${api.defaults.baseURL.replace(/\/$/, '')}/auth/google`)
        assert.deepEqual(JSON.parse(config.data), { credential: 'google-id-token' })
        assert.equal(config.skipAuth, true)
        assert.equal(config.headers.Authorization, undefined)
        const body = { [wrapped ? 'token' : 'accessToken']: 'application-token', user: { id: 'g1', name: 'Google Member', email: 'member@example.com', avatar: 'avatar-url', role: 'Member' } }
        return { data: wrapped ? { data: body } : body, status: 200, config }
      }
      const result = await googleSignIn({ credential: 'google-id-token', rememberMe })
      assert.equal(result.token, 'application-token')
      assert.equal(getUser().fullName, 'Google Member')
      assert.equal(getUser().avatar, 'avatar-url')
      assert.equal(getUser().role, 'Member')
      assert.equal((rememberMe ? localStorage : sessionStorage).getItem('token'), 'application-token')
      assert.equal((rememberMe ? sessionStorage : localStorage).getItem('token'), null)
    }
  }
  api.defaults.adapter = async (config) => {
    assert.equal(config.url, '/v1/auth/login')
    assert.deepEqual(JSON.parse(config.data), { email: 'member@example.com', password: 'password' })
    return { data: { data: { accessToken: 'password-session', user: { userId: 'p1', fullName: 'Password Member' } } }, status: 200, config }
  }
  await signIn({ email: ' member@example.com ', password: 'password', rememberMe: false })
  assert.equal(getToken(), 'password-session')
  assert.equal(getUser().name, 'Password Member')
})

test('failed Google login never creates a session', async (t) => {
  globalThis.localStorage = memoryStorage()
  globalThis.sessionStorage = memoryStorage()
  globalThis.window = new EventTarget()
  const originalAdapter = api.defaults.adapter
  t.after(() => { api.defaults.adapter = originalAdapter; clearSession() })
  let requests = 0
  api.defaults.adapter = async () => { requests++; throw new Error('Unexpected request') }
  await assert.rejects(googleSignIn({ credential: '' }), /ID token/)
  assert.equal(requests, 0)
  for (const [status, message] of [[401, /rejected/], [404, /not available/], [405, /not available/], [501, /not available/], [502, /connect/], [undefined, /connect/]]) {
    api.defaults.adapter = async (config) => { throw Object.assign(new Error('Network error'), { config, ...(status ? { response: { status } } : {}) }) }
    await assert.rejects(googleSignIn({ credential: 'credential' }), message)
    assert.equal(getToken(), null)
    assert.equal(getUser(), null)
  }
  for (const body of [{ user: { id: 'g1' } }, { accessToken: 'token' }, { accessToken: ' ', user: {} }, { accessToken: 'token', user: [] }]) {
    api.defaults.adapter = async (config) => ({ data: body, status: 200, config })
    await assert.rejects(googleSignIn({ credential: 'credential' }), /incomplete/)
    assert.equal(getToken(), null)
  }
})
