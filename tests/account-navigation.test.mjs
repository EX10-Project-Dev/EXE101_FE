import test from 'node:test'
import assert from 'node:assert/strict'
import { isMerchant, getAccountHome } from '../src/utils/accountNavigation.js'
import { normalizeUser } from '../src/services/authService.js'

test('merchant roles route to the portal, including normalized backend user and casing', () => {
  for (const role of ['Merchant', 'merchant', 'MERCHANT', ' Merchant ']) {
    const user = normalizeUser({ userId: 'merchant-1', role })
    assert.equal(isMerchant(user), true)
    assert.equal(getAccountHome(user), '/merchant')
  }
  assert.equal(getAccountHome({ roles: ['Member', 'Merchant'] }), '/merchant')
})

test('existing customer and admin navigation stays unchanged and malformed roles do not crash', () => {
  for (const user of [null, undefined, {}, { role: 'Member' }, { role: 'Customer' }, { role: 'Admin' }, { roles: null }, { role: 1 }, { roles: [null, {}] }]) {
    assert.equal(getAccountHome(user), '/discover')
  }
})

test('merchant-looking account names and emails cannot assign a merchant destination', () => {
  assert.equal(getAccountHome({ name: 'FindGo Demo Merchant', email: 'merchant.demo@findgo.example', role: 'Member' }), '/discover')
  assert.equal(getAccountHome({ role: 'NotMerchant' }), '/discover')
})
