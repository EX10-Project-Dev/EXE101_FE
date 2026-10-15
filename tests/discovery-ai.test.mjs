import test from 'node:test'
import assert from 'node:assert/strict'
import { venues } from '../src/data/venues.js'
import { rankDemoVenues, searchWithDemoAi } from '../src/services/discoveryAiDemo.js'
import { searchDiscoveryVenues } from '../src/services/discoveryService.js'

test('demo interprets first-date café intent in English and Vietnamese', () => {
  for (const prompt of ['cafe for first date', 'cà phê cho buổi hẹn hò đầu tiên']) {
    const results = rankDemoVenues(venues, [prompt])
    assert.equal(results[0].id, 'venue-3')
    assert.ok(results.every(v => v.category === 'Café' && v.reviewSource === 'demo'))
    assert.ok(results[0].matchScore > results.at(-1).matchScore)
  }
})

test('demo combines prompts, respects filtered candidates, and handles no matches', () => {
  assert.equal(rankDemoVenues(venues, ['quiet cafe', 'work with outlets'])[0].id, 'venue-1')
  const candidates = searchDiscoveryVenues({ filters: { budget: '$$', distance: '2' } })
  assert.ok(rankDemoVenues(candidates, ['cafe']).every(v => v.priceLevel === '$$' && v.distanceKm <= 2))
  assert.equal(rankDemoVenues(venues, ['somewhere nonexistent']).length, 0)
  assert.equal(rankDemoVenues([], ['cafe']).length, 0)
  assert.equal(rankDemoVenues(venues, ['The Workshop Coffee'])[0].id, 'venue-1')
})

test('cancelled demo searches never deliver stale results', async () => {
  const controller = new AbortController()
  const request = searchWithDemoAi({ candidates: venues, prompts: ['cafe'], signal: controller.signal, delayMs: 30 })
  controller.abort()
  await assert.rejects(request, { name: 'AbortError' })
  const results = await searchWithDemoAi({ candidates: venues, prompts: ['pizza'], delayMs: 0 })
  assert.equal(results[0].id, 'venue-2')
})
