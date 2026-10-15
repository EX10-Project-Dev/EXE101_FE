import test from 'node:test'
import assert from 'node:assert/strict'
import { searchDiscoveryVenues, getMatchReasons } from '../src/services/discoveryService.js'
import { venues } from '../src/data/venues.js'

test('free-text search normalizes accents and combines requirements', () => {
  const results = searchDiscoveryVenues({ query: 'Quiet café with power outlets to work' })
  assert.deepEqual(results.map((venue) => venue.name), ['The Workshop Coffee'])
  assert.equal(searchDiscoveryVenues({ query: 'somewhere nonexistent' }).length, 0)
  assert.deepEqual(searchDiscoveryVenues({ prompts: ['Cà phê yên tĩnh chạy deadline', 'Có ổ cắm điện'] }).map((venue) => venue.id), ['venue-1'])
})

test('all filters are respected, including every requested amenity', () => {
  const results = searchDiscoveryVenues({ filters: { purpose: 'Study / Work', budget: '$$', distance: '2', groupSize: 'Solo', atmosphere: 'Quiet', amenities: ['Wi-Fi', 'Power outlets'] } })
  assert.deepEqual(results.map((venue) => venue.id), ['venue-1'])
  assert.equal(searchDiscoveryVenues({ filters: { budget: '$' } }).length, 0)
  assert.equal(searchDiscoveryVenues({ filters: { amenities: ['Wi-Fi', 'Group seating'] } }).length, 1)
})

test('saved view intersects saved places with active search', () => {
  assert.deepEqual(searchDiscoveryVenues({ savedOnly: true, savedIds: ['venue-2'], query: 'pizza' }).map((venue) => venue.id), ['venue-2'])
  assert.equal(searchDiscoveryVenues({ savedOnly: true, savedIds: ['venue-2'], filters: { atmosphere: 'Quiet' } }).length, 0)
})

test('match reasons only claim preferences the user supplied', () => {
  assert.deepEqual(getMatchReasons(venues[0], {}), [venues[0].description])
  assert.deepEqual(getMatchReasons(venues[0], { budget: '$$', distance: '2', amenities: ['Wi-Fi'] }), ['Has wi-fi', 'Within your preferred distance', 'Fits your budget'])
})

test('multiple prompts are combined and an unsubmitted fourth prompt is ignored', () => {
  assert.deepEqual(searchDiscoveryVenues({ prompts: ['quiet café', 'power outlets', 'work'] }).map((venue) => venue.id), ['venue-1'])
  assert.deepEqual(searchDiscoveryVenues({ prompts: ['quiet café', 'power outlets', 'work', 'nonexistent'] }).map((venue) => venue.id), ['venue-1'])
})

test('near-me uses actual location distances for sorting and filtering', () => {
  const location = { lat: venues[3].lat, lng: venues[3].lng }
  const results = searchDiscoveryVenues({ location })
  assert.equal(results[0].id, venues[3].id)
  assert.equal(results[0].distanceKm, 0)
  assert.ok(results.every((venue, index) => index === 0 || venue.distanceKm >= results[index - 1].distanceKm))
  const nearby = searchDiscoveryVenues({ location, filters: { distance: '2' } })
  assert.ok(nearby.every((venue) => venue.distanceKm <= 2))
  assert.equal(venues[3].distanceKm, 3.4)
})
