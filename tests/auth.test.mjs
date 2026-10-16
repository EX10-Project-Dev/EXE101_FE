import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeUser, extractErrorMessage, AUTH_ENDPOINTS } from '../src/services/authService.js'

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

test('AUTH_ENDPOINTS default correctly to version 1 auth routes', () => {
  assert.equal(AUTH_ENDPOINTS.login, '/v1/auth/login')
  assert.equal(AUTH_ENDPOINTS.register, '/v1/auth/register')
  assert.equal(AUTH_ENDPOINTS.forgotPassword, '/v1/auth/forgot-password')
  assert.equal(AUTH_ENDPOINTS.resetPassword, '/v1/auth/reset-password')
  assert.equal(AUTH_ENDPOINTS.google, '/v1/auth/google')
  assert.equal(AUTH_ENDPOINTS.logout, '/v1/auth/logout')
})
