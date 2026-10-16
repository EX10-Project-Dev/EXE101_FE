import api from './api.js'
import { MOCK_VENUES } from '../data/mockVenues.js'
import { extractVenueCoordinates } from '../utils/geoUtils.js'

export function mapBackendVenueToFrontend(result) {
  const v = result.venue || {}
  const loc = v.location || {}
  const coords = extractVenueCoordinates({
    lat: loc.latitude,
    lng: loc.longitude,
    googleMapsUrl: v.googleMapsUrl,
  }) || { lat: 10.77348, lng: 106.70560 }

  const minPrice = v.priceMin != null ? Number(v.priceMin).toLocaleString('vi-VN') + 'đ' : ''
  const maxPrice = v.priceMax != null ? Number(v.priceMax).toLocaleString('vi-VN') + 'đ' : ''
  const priceRange = minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : minPrice || maxPrice || '30.000đ - 65.000đ'

  const rawScore = result.matchScore ?? 0.8
  const matchScore = rawScore <= 1 ? Math.min(9.9, Math.max(5.0, Math.round(rawScore * 100) / 10)) : Math.round(rawScore * 10) / 10

  const validImages = Array.isArray(v.imageUrls)
    ? v.imageUrls.filter(url => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes(' ') && !url.includes('\n'))
    : []
  const samplePhotos = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=80'
  ]

  let hash = 0
  const seed = String(v.venueId || v.name || '')
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  const photoIdx = Math.abs(hash) % samplePhotos.length
  const defaultImages = [
    samplePhotos[photoIdx],
    samplePhotos[(photoIdx + 1) % samplePhotos.length],
    samplePhotos[(photoIdx + 2) % samplePhotos.length]
  ]

  const reasons = Array.isArray(result.matchReasons) && result.matchReasons.length > 0
    ? result.matchReasons
    : (result.recommendationReason ? [result.recommendationReason] : ['Không gian phù hợp với nhu cầu của bạn'])

  const amenities = Array.isArray(v.amenityCodes) ? v.amenityCodes.map(code => {
    switch (code) {
      case 'WIFI': return 'Wi-Fi'
      case 'POWER_OUTLET': return 'Power outlets'
      case 'AIR_CONDITIONING': return 'Air conditioning'
      case 'PARKING':
      case 'MOTORBIKE_PARKING':
      case 'CAR_PARKING': return 'Parking'
      case 'GROUP_SEATING': return 'Group seating'
      default: return code
    }
  }) : []

  const sourceData = v.sourceData || {}
  const rawTags = sourceData.tagsAndPurpose ? sourceData.tagsAndPurpose.split(';').map(s => s.trim()).filter(Boolean) : []
  const tags = Array.from(new Set([v.categoryName || 'Café', ...rawTags]))
  const defaultPhoto = validImages[0] || defaultImages[0]

  return {
    id: String(v.venueId || `venue-${Math.random()}`),
    name: v.name || 'Địa điểm F&B',
    category: v.categoryName || 'Café',
    tagline: result.recommendationReason || v.shortDescription || 'Địa điểm phù hợp với bạn',
    address: v.address || 'TP. Hồ Chí Minh',
    distanceKm: result.distanceKm != null ? Math.round(Number(result.distanceKm) * 10) / 10 : (v.distanceKm != null ? Math.round(Number(v.distanceKm) * 10) / 10 : 1.2),
    lat: coords.lat,
    lng: coords.lng,
    priceRange,
    priceLevel: v.priceMax > 150000 ? '$$$' : v.priceMax > 60000 ? '$$' : '$',
    budgetLevel: v.priceNote || '50k-100k',
    rating: v.ratingAverage ? Math.round(Number(v.ratingAverage) * 10) / 10 : 4.6,
    reviewCount: v.reviewCount || 20,
    matchScore,
    reasons,
    dynamicReasons: reasons,
    image: defaultPhoto,
    images: validImages.length > 0 ? validImages : defaultImages,
    googleMapsUrl: v.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name + ' ' + (v.address || ''))}`,
    description: v.shortDescription || sourceData.tagsAndPurpose || v.name || '',
    descriptionVi: v.shortDescription || sourceData.tagsAndPurpose || v.name || '',
    isOpenNow: v.isOpenNow ?? true,
    openingHours: sourceData.openingHoursSource || '08:00 - 22:00',
    amenities: Array.from(new Set(amenities)),
    tags,
    purposes: ['Study / Work', 'Hangout'],
    groupSizes: ['Solo', '2 people', '3-5 people', '6+ people'],
    atmosphere: [sourceData.observedNoise || 'Cozy'],
    reviewSource: 'backend',
  }
}

function fallbackScoredVenues(prompts, criteria) {
  const promptText = (Array.isArray(prompts) ? prompts.join(' ') : String(prompts || '')).toLowerCase()
  const scoredVenues = MOCK_VENUES.map((venue) => {
    let score = 8.5
    const matchedReasons = [...venue.reasons]
    if (promptText) {
      if (promptText.includes('deadline') || promptText.includes('làm việc') || promptText.includes('học')) {
        if (venue.purposes.includes('Study / Work')) {
          score += 1.0
          matchedReasons.unshift('Rất phù hợp để tập trung làm việc & chạy deadline')
        }
      }
      if (promptText.includes('hẹn hò') || promptText.includes('người yêu') || promptText.includes('date')) {
        if (venue.purposes.includes('Date')) {
          score += 1.1
          matchedReasons.unshift('Không gian lãng mạn, ghi điểm trong mắt đối phương')
        }
      }
      if (promptText.includes('nhóm') || promptText.includes('bạn bè') || promptText.includes('tụ tập')) {
        if (venue.groupSizes.includes('3-5 people') || venue.groupSizes.includes('6+ people')) {
          score += 0.9
          matchedReasons.unshift('Bàn rộng rãi, dễ dàng sắp xếp chỗ cho nhóm bạn')
        }
      }
      if (promptText.includes('yên tĩnh')) {
        if (venue.atmosphere.includes('Quiet')) {
          score += 0.8
        }
      }
    }
    if (criteria?.purpose && venue.purposes.includes(criteria.purpose)) score += 0.6
    if (criteria?.budget && venue.budgetLevel === criteria.budget) score += 0.5
    if (criteria?.groupSize && venue.groupSizes.includes(criteria.groupSize)) score += 0.4
    if (criteria?.category && venue.category === criteria.category) score += 0.4
    if (criteria?.atmosphere && venue.atmosphere.includes(criteria.atmosphere)) score += 0.4
    if (criteria?.amenities && criteria.amenities.length > 0) {
      const matchCount = criteria.amenities.filter((item) =>
        venue.amenities.some((a) => a.toLowerCase().includes(item.toLowerCase()))
      ).length
      score += matchCount * 0.2
    }
    const finalScore = Math.min(9.9, Math.round(score * 10) / 10)
    return {
      ...venue,
      matchScore: finalScore,
      dynamicReasons: Array.from(new Set(matchedReasons)).slice(0, 3)
    }
  })
  return scoredVenues.sort((a, b) => b.matchScore - a.matchScore)
}

export async function getRecommendations(payload = {}) {
  const { prompts = [], criteria = {}, location = null, signal = null } = payload
  const promptText = Array.isArray(prompts)
    ? prompts.filter(Boolean).join(' ').trim()
    : String(prompts || '').trim()

  try {
    const requestBody = {
      prompt: promptText || undefined,
      page: 1,
      pageSize: 40,
    }

    if (criteria?.purpose) {
      const p = criteria.purpose
      if (p === 'Study / Work') requestBody.purpose = 'STUDY'
      else if (p === 'Eat & Drink') requestBody.purpose = 'DINING'
      else if (p === 'Hangout' || p === 'Group Gathering') requestBody.purpose = 'GATHERING'
      else if (p === 'Date') requestBody.purpose = 'DATING'
      else requestBody.purpose = p
    }

    if (criteria?.budget) {
      const b = criteria.budget
      if (b === '$' || b === '<50k') { requestBody.budgetMax = 50000 }
      else if (b === '$$' || b === '50k-100k') { requestBody.budgetMin = 50000; requestBody.budgetMax = 100000 }
      else if (b === '100k-250k') { requestBody.budgetMin = 100000; requestBody.budgetMax = 250000 }
      else if (b === '$$$' || b === '250k-500k') { requestBody.budgetMin = 250000; requestBody.budgetMax = 500000 }
      else if (b === '>500k') { requestBody.budgetMin = 500000 }
    }

    if (criteria?.groupSize) {
      const gs = criteria.groupSize
      if (gs === 'Solo') requestBody.groupSize = 1
      else if (gs === '2 people') requestBody.groupSize = 2
      else if (gs === '3-5 people') requestBody.groupSize = 4
      else if (gs === '6+ people') requestBody.groupSize = 6
      else if (!isNaN(parseInt(gs, 10))) requestBody.groupSize = parseInt(gs, 10)
    }

    if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      requestBody.origin = {
        latitude: location.lat,
        longitude: location.lng,
      }
      if (criteria?.distance) {
        const d = String(criteria.distance)
        if (d === 'near_me') requestBody.maxDistanceKm = 2
        else {
          const num = parseFloat(d.replace('km', ''))
          if (!isNaN(num) && num > 0) requestBody.maxDistanceKm = num
        }
      }
    }

    if (criteria?.category) {
      const c = criteria.category
      if (c === 'Café') requestBody.categoryCodes = ['CAFE']
      else if (c === 'Restaurant') requestBody.categoryCodes = ['RESTAURANT']
      else if (c === 'Tea & Beverage') requestBody.categoryCodes = ['TEA_DRINKS']
      else if (c === 'Dessert') requestBody.categoryCodes = ['BAKERY_DESSERT']
      else if (c === 'Fast Food') requestBody.categoryCodes = ['MALA_HOTPOT_FAST_FOOD']
      else requestBody.categoryCodes = [c]
    }

    if (criteria?.atmosphere) {
      const a = criteria.atmosphere
      if (a === 'Quiet') requestBody.atmosphereTags = ['QUIET']
      else if (a === 'Cozy') requestBody.atmosphereTags = ['COZY']
      else if (a === 'Social') requestBody.atmosphereTags = ['LIVELY']
      else if (a === 'Spacious') requestBody.atmosphereTags = ['CHILL']
      else if (a === 'Outdoor') requestBody.atmosphereTags = ['OUTDOOR']
      else if (a === 'Aesthetic') requestBody.atmosphereTags = ['MODERN']
      else requestBody.atmosphereTags = [a]
    }

    if (Array.isArray(criteria?.amenities) && criteria.amenities.length > 0) {
      requestBody.amenityCodes = criteria.amenities.map(am => {
        if (am === 'Wi-Fi') return 'WIFI'
        if (am === 'Power outlets') return 'POWER_OUTLET'
        if (am === 'Air conditioning') return 'AIR_CONDITIONING'
        if (am === 'Parking') return 'PARKING'
        if (am === 'Group seating') return 'GROUP_SEATING'
        return am.toUpperCase()
      })
    }

    const response = await api.post('/v1/search/recommendations', requestBody, {
      timeout: 10000,
      signal: signal || undefined,
    })
    const results = response.data?.results
    if (Array.isArray(results) && results.length > 0) {
      return results.map(mapBackendVenueToFrontend)
    }
  } catch (error) {
    if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
      throw error
    }
  }

  return fallbackScoredVenues(prompts, criteria)
}

export async function getVenueDetail(id) {
  try {
    const response = await api.get(`/v1/venues/${id}`, { timeout: 5000 })
    if (response.data && (response.data.data || response.data)) {
      return mapBackendVenueToFrontend({ venue: response.data.data || response.data })
    }
  } catch {
    // Fallback to local venues
  }

  const found = MOCK_VENUES.find((v) => v.id === id)
  if (!found) throw new Error('Không tìm thấy địa điểm.')
  return found
}

