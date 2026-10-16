import { venues } from '../data/venues.js'
import { normalizeSearch, translateText } from '../utils/localization.js'

const normalize = normalizeSearch
const ignoredWords = new Set(['a', 'an', 'the', 'with', 'and', 'to', 'for', 'of', 'in', 'near', 'me', 'good', 'place', 'places', 'quan', 'can', 'tim', 'co', 'de', 'voi', 'va', 'cho', 'toi', 'mot'])

// Pure local search boundary. Supports dynamic candidate lists while maintaining
// full compatibility with existing mock fixtures and offline execution.
export function searchDiscoveryVenues({ query = '', prompts = [], filters = {}, savedIds, savedOnly = false, location = null, candidates = venues } = {}) {
  const terms = normalize([query, ...prompts.slice(0, 3)].join(' ')).split(' ').filter((word) => word && !ignoredWords.has(word))
  const pool = Array.isArray(candidates) && candidates.length > 0 ? candidates : venues
  const locatedVenues = location ? pool.map((venue) => ({ ...venue, distanceKm: distanceKm(location, venue) })) : pool
  const results = locatedVenues.filter((venue) => {
    if (savedOnly && !savedIds?.includes(venue.id)) return false
    if (filters.purpose && !venue.purposes?.includes(filters.purpose)) return false
    if (filters.budget && venue.priceLevel !== filters.budget) return false
    if (filters.distance && venue.distanceKm > Number(filters.distance)) return false
    if (filters.groupSize && !venue.groupSizes?.includes(filters.groupSize)) return false
    if (filters.atmosphere && !venue.atmosphere?.includes(filters.atmosphere)) return false
    if (filters.amenities?.some((amenity) => !venue.amenities?.includes(amenity))) return false
    const labels = [venue.category, ...(venue.tags || []), ...(venue.purposes || []), ...(venue.atmosphere || []), ...(venue.amenities || [])]
    const workKeywords = venue.purposes?.includes('Study / Work') ? 'chạy deadline' : ''
    const searchable = normalize([venue.name, venue.address, venue.description, venue.descriptionVi, workKeywords, ...labels, ...labels.map((label) => translateText(label, 'vi'))].filter(Boolean).join(' '))
    return terms.every((term) => searchable.includes(term))
  })
  return location ? results.sort((a, b) => a.distanceKm - b.distanceKm) : results
}

// Straight-line distance from the explicitly granted browser location.
function distanceKm(from, to) {
  const radians = (degrees) => degrees * Math.PI / 180
  const latDelta = radians(to.lat - from.lat)
  const lngDelta = radians(to.lng - from.lng)
  const a = Math.sin(latDelta / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lngDelta / 2) ** 2
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a))) * 10) / 10
}

export function getMatchReasons(venue, filters = {}, language = 'en') {
  const tx = (text, values) => translateText(text, language, values)
  const reasons = []
  if (filters?.purpose && venue.purposes?.includes(filters.purpose)) reasons.push(tx('Good for {purpose}', { purpose: tx(filters.purpose).toLowerCase() }))
  if (filters?.atmosphere && venue.atmosphere?.includes(filters.atmosphere)) reasons.push(tx('{atmosphere} atmosphere', { atmosphere: tx(filters.atmosphere) }))
  for (const amenity of filters?.amenities || []) if (venue.amenities?.includes(amenity)) reasons.push(tx('Has {amenity}', { amenity: tx(amenity).toLowerCase() }))
  if (filters?.distance && venue.distanceKm <= Number(filters.distance)) reasons.push(tx('Within your preferred distance'))
  if (filters?.budget && filters.budget === venue.priceLevel) reasons.push(tx('Fits your budget'))
  if (reasons.length) return reasons
  const desc = language === 'vi' ? (venue.descriptionVi || venue.description) : (venue.description || venue.descriptionVi)
  if (desc) return [desc]
  if (Array.isArray(venue.dynamicReasons) && venue.dynamicReasons.length > 0) return venue.dynamicReasons
  if (Array.isArray(venue.reasons) && venue.reasons.length > 0) return venue.reasons
  return [language === 'vi' ? 'Không gian phù hợp với nhu cầu của bạn' : 'Matches your preferences']
}


