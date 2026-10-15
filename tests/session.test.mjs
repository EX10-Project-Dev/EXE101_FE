import test from 'node:test'
import assert from 'node:assert/strict'
import { DEMO_TOKEN, saveSession, clearSession, getToken, getUser, subscribeToSession } from '../src/services/sessionStore.js'

function storage() {
  const values = new Map()
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) }
}

test('session reuses token keys, respects remember-me, and clears both stores', () => {
  globalThis.localStorage = storage()
  globalThis.sessionStorage = storage()
  globalThis.window = new EventTarget()
  const user = { id: 'member', name: 'Member', email: 'member@example.com' }
  let updates = 0
  const unsubscribe = subscribeToSession(() => updates++)
  saveSession({ token: 'temporary', user }, false)
  assert.equal(sessionStorage.getItem('token'), 'temporary')
  assert.equal(localStorage.getItem('token'), null)
  assert.deepEqual(getUser(), user)
  saveSession({ token: 'remembered', user }, true)
  assert.equal(sessionStorage.getItem('token'), null)
  assert.equal(localStorage.getItem('token'), 'remembered')
  assert.equal(getToken(), 'remembered')
  clearSession()
  assert.equal(getToken(), null)
  assert.equal(getUser(), null)
  assert.ok(updates >= 3)
  unsubscribe()
})

test('a persisted demo session cannot authenticate outside Vite development mode', () => {
  globalThis.localStorage = storage()
  globalThis.sessionStorage = storage()
  globalThis.window = new EventTarget()
  saveSession({ token: DEMO_TOKEN, user: { id: 'local-demo', isDemo: true } }, true)
  assert.equal(getToken(), null)
  clearSession()
})
