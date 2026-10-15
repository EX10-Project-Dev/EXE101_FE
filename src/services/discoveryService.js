import { venues } from '../data/venues.js'
import { normalizeSearch, translateText } from '../utils/localization.js'

const normalize = normalizeSearch
const ignoredWords = new Set(['a', 'an', 'the', 'with', 'and', 'to', 'for', 'of', 'in', 'near', 'me', 'good', 'place', 'places'])

// Pure local search boundary. Replace this with the recommendation API adapter
// when the backend contract is available; the page doesn't need to change.
export function searchDiscoveryVenues({ query = '', filters = {}, savedIds, savedOnly = false } = {}) {
  const terms = normalize(query).split(' ').filter((word) => word && !ignoredWords.has(word))
  return venues.filter((venue) => {
    if (savedOnly && !savedIds?.includes(venue.id)) return false
    if (filters.purpose && !venue.purposes.includes(filters.purpose)) return false
    if (filters.budget && venue.priceLevel !== filters.budget) return false
    if (filters.distance && venue.distanceKm > Number(filters.distance)) return false
    if (filters.groupSize && !venue.groupSizes.includes(filters.groupSize)) return false
    if (filters.atmosphere && !venue.atmosphere.includes(filters.atmosphere)) return false
    if (filters.amenities?.some((amenity) => !venue.amenities.includes(amenity))) return false
    const labels = [venue.category, ...venue.tags, ...venue.purposes, ...venue.atmosphere, ...venue.amenities]
    const searchable = normalize([venue.name, venue.address, venue.description, venue.descriptionVi, ...labels, ...labels.map((label) => translateText(label, 'vi'))].join(' '))
    return terms.every((term) => searchable.includes(term))
  })
}

export function getMatchReasons(venue, filters, language = 'en') {
  const tx = (text, values) => translateText(text, language, values)
  const reasons = []
  if (filters.purpose && venue.purposes.includes(filters.purpose)) reasons.push(tx('Good for {purpose}', { purpose: tx(filters.purpose).toLowerCase() }))
  if (filters.atmosphere && venue.atmosphere.includes(filters.atmosphere)) reasons.push(tx('{atmosphere} atmosphere', { atmosphere: tx(filters.atmosphere) }))
  for (const amenity of filters.amenities || []) if (venue.amenities.includes(amenity)) reasons.push(tx('Has {amenity}', { amenity: tx(amenity).toLowerCase() }))
  if (filters.distance && venue.distanceKm <= Number(filters.distance)) reasons.push(tx('Within your preferred distance'))
  if (filters.budget === venue.priceLevel) reasons.push(tx('Fits your budget'))
  return reasons.length ? reasons : [language === 'vi' ? venue.descriptionVi : venue.description]
}
